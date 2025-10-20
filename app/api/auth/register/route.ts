import { type NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/client";
import { users } from "@/lib/schema";
import { hashPassword } from "@/lib/crypto";
import { createSession, setSessionCookie } from "@/lib/session";
import { eq } from "drizzle-orm";
import { z } from "zod";

const registerSchema = z.object({
  email: z.email("Invalid email"),
  name: z.string().min(2, "Name must be at least 2 characters"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, name, password } = registerSchema.parse(body);

    const db = getDb();

    // Check if user already exists
    const existingUser = await db
      .select()
      .from(users)
      .where(eq(users.email, email))
      .limit(1);

    if (existingUser.length > 0) {
      return NextResponse.json(
        { error: "Email already registered" },
        { status: 400 }
      );
    }

    // Hash password
    const hashedPassword = await hashPassword(password);

    // Create user
    const userId = `user-${Date.now()}`;
    const newUser = await db
      .insert(users)
      .values({
        id: userId,
        email,
        name,
        password: hashedPassword,
      })
      .returning();

    // Create session
    const token = await createSession(
      newUser[0].id,
      newUser[0].email,
      newUser[0].name || ""
    );
    await setSessionCookie(token);

    return NextResponse.json(
      {
        success: true,
        user: {
          id: newUser[0].id,
          email: newUser[0].email,
          name: newUser[0].name,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    console.error("Registration error:", error);
    return NextResponse.json({ error: "Registration failed" }, { status: 500 });
  }
}

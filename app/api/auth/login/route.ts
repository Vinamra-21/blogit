import { type NextRequest, NextResponse } from "next/server"
import { getDb } from "@/lib/client"
import { users } from "@/lib/schema"
import { verifyPassword } from "@/lib/crypto"
import { createSession, setSessionCookie } from "@/lib/session"
import { eq } from "drizzle-orm"
import { z } from "zod"

const loginSchema = z.object({
  email: z.string().email("Invalid email"),
  password: z.string().min(1, "Password is required"),
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, password } = loginSchema.parse(body)

    const db = getDb()

    // Find user
    const user = await db.select().from(users).where(eq(users.email, email)).limit(1)

    if (!user.length) {
      return NextResponse.json({ error: "Invalid email or password" }, { status: 401 })
    }

    // Verify password
    const isPasswordValid = await verifyPassword(password, user[0].password)

    if (!isPasswordValid) {
      return NextResponse.json({ error: "Invalid email or password" }, { status: 401 })
    }

    // Create session
    const token = await createSession(user[0].id, user[0].email, user[0].name || "")
    await setSessionCookie(token)

    return NextResponse.json({
      success: true,
      user: {
        id: user[0].id,
        email: user[0].email,
        name: user[0].name,
      },
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors[0].message }, { status: 400 })
    }
    console.error("[v0] Login error:", error)
    return NextResponse.json({ error: "Login failed" }, { status: 500 })
  }
}

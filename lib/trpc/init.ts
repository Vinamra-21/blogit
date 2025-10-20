import { initTRPC, TRPCError } from "@trpc/server";
import { cookies } from "next/headers";
import { verifyToken } from "../auth/session";

export const t = initTRPC.create({
  errorFormatter({ shape }) {
    return shape;
  },
});

export const createContext = async () => {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("auth-token")?.value;

    if (!token) {
      return { session: null };
    }

    const payload = await verifyToken(token);
    return { session: payload };
  } catch (error) {
    return { session: null };
  }
};

export type Context = inferAsyncReturnType<typeof createContext>;

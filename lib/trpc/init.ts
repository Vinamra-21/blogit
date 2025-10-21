import { initTRPC, TRPCError } from "@trpc/server";
import { cookies } from "next/headers";
import { verifyToken } from "../session";

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

export const router = t.router;
export const publicProcedure = t.procedure;

export const protectedProcedure = t.procedure.use(async ({ ctx, next }) => {
  if (!ctx.session) {
    throw new TRPCError({ code: "UNAUTHORIZED" });
  }

  return next({
    ctx: {
      session: ctx.session,
    },
  });
});

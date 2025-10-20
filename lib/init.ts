import { initTRPC, TRPCError } from "@trpc/server";
import { ZodError } from "zod";
import { getSession } from "./session";

// Context type returned by createContext
export type Context = {
  session: Awaited<ReturnType<typeof getSession>>;
};

// Create context with session
export async function createContext(): Promise<Context> {
  const session = await getSession();
  return { session };
}

export const t = initTRPC.context<Context>().create({
  errorFormatter({ shape, error }) {
    return {
      ...shape,
      data: {
        ...shape.data,
        zodError:
          error.cause instanceof ZodError
            ? (error.cause as ZodError).flatten()
            : null,
      },
    };
  },
});

export const router = t.router;
export const publicProcedure = t.procedure;

export const protectedProcedure = t.procedure.use(async ({ ctx, next }) => {
  if (!ctx.session) {
    throw new TRPCError({ code: "UNAUTHORIZED", message: "Not authenticated" });
  }
  return next({
    ctx: {
      session: ctx.session,
    },
  });
});

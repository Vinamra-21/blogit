import { initTRPC, TRPCError } from "@trpc/server"
import { ZodError } from "zod"
import { getSession } from "@/lib/session"

export const t = initTRPC.context<typeof createContext>().create({
  errorFormatter({ shape, error }) {
    return {
      ...shape,
      data: {
        ...shape.data,
        zodError: error.cause instanceof ZodError ? error.cause.flatten() : null,
      },
    }
  },
})

// Create context with session
export async function createContext() {
  const session = await getSession()
  return { session }
}

export const router = t.router
export const publicProcedure = t.procedure

export const protectedProcedure = t.procedure.use(async ({ ctx, next }) => {
  if (!ctx.session) {
    throw new TRPCError({ code: "UNAUTHORIZED", message: "Not authenticated" })
  }
  return next({
    ctx: {
      session: ctx.session,
    },
  })
})

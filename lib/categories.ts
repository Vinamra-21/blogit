import { z } from "zod"
import { publicProcedure, protectedProcedure, router } from "../init"
import { getDb } from "@/lib/client"
import { categories } from "@/lib/schema"
import { eq, desc } from "drizzle-orm"

const createCategorySchema = z.object({
  name: z.string().min(1, "Name is required"),
  slug: z.string().min(1, "Slug is required"),
  description: z.string().optional(),
})

export const categoriesRouter = router({
  // Get all categories
  getAll: publicProcedure.query(async () => {
    try {
      const db = getDb()
      return await db.select().from(categories).orderBy(desc(categories.createdAt))
    } catch (error) {
      console.error("[v0] Failed to fetch categories:", error)
      throw new Error("Failed to fetch categories")
    }
  }),

  // Get category by slug
  getBySlug: publicProcedure.input(z.string()).query(async ({ input }) => {
    try {
      const db = getDb()
      const category = await db.select().from(categories).where(eq(categories.slug, input)).limit(1)
      return category[0] || null
    } catch (error) {
      console.error("[v0] Failed to fetch category:", error)
      throw new Error("Failed to fetch category")
    }
  }),

  // Updated to use protectedProcedure for write operations
  create: protectedProcedure.input(createCategorySchema).mutation(async ({ input }) => {
    try {
      const db = getDb()
      const newCategory = await db
        .insert(categories)
        .values({
          name: input.name,
          slug: input.slug,
          description: input.description,
        })
        .returning()
      return newCategory[0]
    } catch (error) {
      console.error("[v0] Failed to create category:", error)
      throw new Error("Failed to create category")
    }
  }),

  // Updated to use protectedProcedure for write operations
  update: protectedProcedure
    .input(
      createCategorySchema.extend({
        id: z.number(),
      }),
    )
    .mutation(async ({ input }) => {
      try {
        const db = getDb()
        const { id, ...updateData } = input
        const updated = await db.update(categories).set(updateData).where(eq(categories.id, id)).returning()
        return updated[0]
      } catch (error) {
        console.error("[v0] Failed to update category:", error)
        throw new Error("Failed to update category")
      }
    }),

  // Updated to use protectedProcedure for write operations
  delete: protectedProcedure.input(z.number()).mutation(async ({ input }) => {
    try {
      const db = getDb()
      await db.delete(categories).where(eq(categories.id, input))
      return { success: true }
    } catch (error) {
      console.error("[v0] Failed to delete category:", error)
      throw new Error("Failed to delete category")
    }
  }),
})

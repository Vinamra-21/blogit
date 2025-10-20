import { z } from "zod";
import { publicProcedure, protectedProcedure, router } from "./init";
import { getDb } from "@/lib/client";
import { posts, postCategories, categories, users } from "@/lib/schema";
import { eq, desc, and } from "drizzle-orm";
import { TRPCError } from "@trpc/server";

const createPostSchema = z.object({
  title: z.string().min(1, "Title is required"),
  slug: z.string().min(1, "Slug is required"),
  content: z.string().min(1, "Content is required"),
  excerpt: z.string().optional(),
  categoryIds: z.array(z.number()).optional(),
});

const updatePostSchema = createPostSchema.partial().extend({
  id: z.number(),
});

export const postsRouter = router({
  // Get all published posts with categories
  getAll: publicProcedure.query(async () => {
    const db = getDb();
    const allPosts = await db
      .select()
      .from(posts)
      .where(eq(posts.published, true))
      .orderBy(desc(posts.createdAt));

    // Fetch categories for each post
    const postsWithCategories = await Promise.all(
      allPosts.map(async (post) => {
        const postCats = await db
          .select({ category: categories })
          .from(postCategories)
          .innerJoin(categories, eq(postCategories.categoryId, categories.id))
          .where(eq(postCategories.postId, post.id));

        const author = await db
          .select()
          .from(users)
          .where(eq(users.id, post.authorId))
          .limit(1);

        return {
          ...post,
          categories: postCats.map((pc) => pc.category),
          author: author[0] || null,
        };
      })
    );

    return postsWithCategories;
  }),

  // Get post by slug
  getBySlug: publicProcedure.input(z.string()).query(async ({ input }) => {
    const db = getDb();
    const post = await db
      .select()
      .from(posts)
      .where(eq(posts.slug, input))
      .limit(1);

    if (!post.length) return null;

    const postCats = await db
      .select({ category: categories })
      .from(postCategories)
      .innerJoin(categories, eq(postCategories.categoryId, categories.id))
      .where(eq(postCategories.postId, post[0].id));

    const author = await db
      .select()
      .from(users)
      .where(eq(users.id, post[0].authorId))
      .limit(1);

    return {
      ...post[0],
      categories: postCats.map((pc) => pc.category),
      author: author[0] || null,
    };
  }),

  // Get posts by category
  getByCategory: publicProcedure.input(z.string()).query(async ({ input }) => {
    const db = getDb();
    const category = await db
      .select()
      .from(categories)
      .where(eq(categories.slug, input))
      .limit(1);

    if (!category.length) return [];

    const postCats = await db
      .select({ post: posts })
      .from(postCategories)
      .innerJoin(posts, eq(postCategories.postId, posts.id))
      .where(
        and(
          eq(postCategories.categoryId, category[0].id),
          eq(posts.published, true)
        )
      )
      .orderBy(desc(posts.createdAt));

    return postCats.map((pc) => pc.post);
  }),

  create: protectedProcedure
    .input(createPostSchema)
    .mutation(async ({ input, ctx }) => {
      const db = getDb();

      const newPost = await db
        .insert(posts)
        .values({
          title: input.title,
          slug: input.slug,
          content: input.content,
          excerpt: input.excerpt,
          authorId: ctx.session.userId,
        })
        .returning();

      if (input.categoryIds && input.categoryIds.length > 0) {
        await db.insert(postCategories).values(
          input.categoryIds.map((categoryId) => ({
            postId: newPost[0].id,
            categoryId,
          }))
        );
      }

      return newPost[0];
    }),

  update: protectedProcedure
    .input(updatePostSchema)
    .mutation(async ({ input, ctx }) => {
      const db = getDb();
      const { id, categoryIds, ...updateData } = input;

      // Check if user owns the post
      const post = await db
        .select()
        .from(posts)
        .where(eq(posts.id, id))
        .limit(1);

      if (!post.length) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Post not found" });
      }

      if (post[0].authorId !== ctx.session.userId) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "You can only edit your own posts",
        });
      }

      const updated = await db
        .update(posts)
        .set(updateData)
        .where(eq(posts.id, id))
        .returning();

      if (categoryIds) {
        await db.delete(postCategories).where(eq(postCategories.postId, id));
        if (categoryIds.length > 0) {
          await db.insert(postCategories).values(
            categoryIds.map((categoryId) => ({
              postId: id,
              categoryId,
            }))
          );
        }
      }

      return updated[0];
    }),

  delete: protectedProcedure
    .input(z.number())
    .mutation(async ({ input, ctx }) => {
      const db = getDb();

      // Check if user owns the post
      const post = await db
        .select()
        .from(posts)
        .where(eq(posts.id, input))
        .limit(1);

      if (!post.length) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Post not found" });
      }

      if (post[0].authorId !== ctx.session.userId) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "You can only delete your own posts",
        });
      }

      await db.delete(posts).where(eq(posts.id, input));
      return { success: true };
    }),

  publish: protectedProcedure
    .input(z.number())
    .mutation(async ({ input, ctx }) => {
      const db = getDb();

      // Check if user owns the post
      const post = await db
        .select()
        .from(posts)
        .where(eq(posts.id, input))
        .limit(1);

      if (!post.length) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Post not found" });
      }

      if (post[0].authorId !== ctx.session.userId) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "You can only publish your own posts",
        });
      }

      const updated = await db
        .update(posts)
        .set({ published: true })
        .where(eq(posts.id, input))
        .returning();
      return updated[0];
    }),

  getByAuthor: protectedProcedure.query(async ({ ctx }) => {
    const db = getDb();
    const authorPosts = await db
      .select()
      .from(posts)
      .where(eq(posts.authorId, ctx.session.userId))
      .orderBy(desc(posts.createdAt));

    return authorPosts;
  }),
});

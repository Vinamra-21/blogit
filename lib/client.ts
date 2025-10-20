import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "./schema";
import { createTRPCProxyClient, httpBatchLink } from "@trpc/client";
import type { AppRouter } from "./root";

let db: ReturnType<typeof drizzle> | null = null;

export function getDb() {
  if (!db) {
    const databaseUrl = process.env.NEON_DATABASE_URL;

    if (!databaseUrl) {
      console.error("NEON_DATABASE_URL environment variable is not set");
      throw new Error("Database URL is not configured");
    }

    try {
      const sql = neon(databaseUrl);
      db = drizzle(sql, { schema });
    } catch (error) {
      console.error("Failed to initialize database client:", error);
      throw new Error("Failed to connect to database");
    }
  }
  return db;
}

export type Database = ReturnType<typeof getDb>;

// tRPC client proxy for server-side usage. Other files import `trpc`.
export const trpc = createTRPCProxyClient<AppRouter>({
  links: [
    httpBatchLink({
      url: process.env.TRPC_URL || "http://localhost:3000/api/trpc",
      fetch: (input, init) =>
        (globalThis.fetch as any)(input as string, init as any),
    }),
  ],
});

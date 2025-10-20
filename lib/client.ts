import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "./schema";
import { createTRPCClient, httpBatchLink } from "@trpc/client";
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

function getBaseUrl() {
  if (typeof window !== "undefined") return ""; // browser should use relative url
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`; // SSR should use vercel url
  return `http://localhost:${process.env.PORT ?? 3000}`; // dev SSR should use localhost
}

// tRPC client proxy for server-side usage. Other files import `trpc`.
export const trpc = createTRPCClient<AppRouter>({
  links: [
    httpBatchLink({
      url: `${getBaseUrl()}/api/trpc`,
      headers() {
        return {
          "content-type": "application/json",
        };
      },
    }),
  ],
});

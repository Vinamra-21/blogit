import { neon } from "@neondatabase/serverless"
import { drizzle } from "drizzle-orm/neon-http"
import * as schema from "./schema"

let db: ReturnType<typeof drizzle> | null = null

export function getDb() {
  if (!db) {
    const databaseUrl = process.env.NEON_NEON_DATABASE_URL

    if (!databaseUrl) {
      console.error("[v0] NEON_DATABASE_URL environment variable is not set")
      throw new Error("Database URL is not configured")
    }

    try {
      const sql = neon(databaseUrl)
      db = drizzle(sql, { schema })
    } catch (error) {
      console.error("[v0] Failed to initialize database client:", error)
      throw new Error("Failed to connect to database")
    }
  }
  return db
}

export type Database = ReturnType<typeof getDb>

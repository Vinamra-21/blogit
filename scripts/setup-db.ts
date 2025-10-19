import { neon } from "@neondatabase/serverless"
import { drizzle } from "drizzle-orm/neon-http"
import * as schema from "../lib/db/schema"
import { hashPassword } from "../lib/auth/crypto"

async function setupDatabase() {
  console.log("[v0] Starting database setup...")

  const sql = neon(process.env.NEON_NEON_DATABASE_URL!)
  const db = drizzle(sql, { schema })

  try {
    // Create tables
    console.log("[v0] Creating tables...")

    // Users table
    await sql`
      CREATE TABLE IF NOT EXISTS users (
        id TEXT PRIMARY KEY,
        email VARCHAR(255) NOT NULL UNIQUE,
        name VARCHAR(255),
        password TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT NOW() NOT NULL,
        updated_at TIMESTAMP DEFAULT NOW() NOT NULL
      )
    `

    // Categories table
    await sql`
      CREATE TABLE IF NOT EXISTS categories (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL UNIQUE,
        slug VARCHAR(255) NOT NULL UNIQUE,
        description TEXT,
        created_at TIMESTAMP DEFAULT NOW() NOT NULL
      )
    `

    // Posts table
    await sql`
      CREATE TABLE IF NOT EXISTS posts (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        slug VARCHAR(255) NOT NULL UNIQUE,
        content TEXT NOT NULL,
        excerpt TEXT,
        author_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        published BOOLEAN DEFAULT FALSE NOT NULL,
        created_at TIMESTAMP DEFAULT NOW() NOT NULL,
        updated_at TIMESTAMP DEFAULT NOW() NOT NULL
      )
    `

    // Post-Category junction table
    await sql`
      CREATE TABLE IF NOT EXISTS post_categories (
        post_id INTEGER NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
        category_id INTEGER NOT NULL REFERENCES categories(id) ON DELETE CASCADE,
        PRIMARY KEY (post_id, category_id)
      )
    `

    console.log("[v0] Tables created successfully!")

    // Seed sample data
    console.log("[v0] Seeding sample data...")

    const demoPassword = await hashPassword("demo123456")
    const testPassword = await hashPassword("test123456")

    await sql`
      INSERT INTO users (id, email, name, password) 
      VALUES 
        ('user-1', 'demo@example.com', 'Demo User', ${demoPassword}),
        ('user-2', 'test@example.com', 'Test User', ${testPassword})
      ON CONFLICT (email) DO NOTHING
    `

    // Create sample categories
    await sql`
      INSERT INTO categories (name, slug, description) 
      VALUES 
        ('Technology', 'technology', 'Posts about technology and programming'),
        ('Design', 'design', 'Posts about design and UX'),
        ('Business', 'business', 'Posts about business and entrepreneurship')
      ON CONFLICT (slug) DO NOTHING
    `

    // Create sample posts
    await sql`
      INSERT INTO posts (title, slug, content, excerpt, author_id, published) 
      VALUES 
        (
          'Getting Started with Next.js',
          'getting-started-nextjs',
          '# Getting Started with Next.js\n\nNext.js is a powerful React framework...',
          'Learn the basics of Next.js and start building modern web applications.',
          'user-1',
          true
        ),
        (
          'The Future of Web Design',
          'future-web-design',
          '# The Future of Web Design\n\nWeb design is constantly evolving...',
          'Explore emerging trends in web design and UX.',
          'user-1',
          true
        )
      ON CONFLICT (slug) DO NOTHING
    `

    // Link posts to categories
    await sql`
      INSERT INTO post_categories (post_id, category_id)
      SELECT p.id, c.id FROM posts p, categories c
      WHERE p.slug = 'getting-started-nextjs' AND c.slug = 'technology'
      ON CONFLICT DO NOTHING
    `

    await sql`
      INSERT INTO post_categories (post_id, category_id)
      SELECT p.id, c.id FROM posts p, categories c
      WHERE p.slug = 'future-web-design' AND c.slug = 'design'
      ON CONFLICT DO NOTHING
    `

    console.log("[v0] Database setup completed successfully!")
    console.log("[v0] Demo credentials:")
    console.log("[v0]   Email: demo@example.com, Password: demo123456")
    console.log("[v0]   Email: test@example.com, Password: test123456")
  } catch (error) {
    console.error("[v0] Database setup failed:", error)
    throw error
  }
}

setupDatabase()

import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "../lib/schema";
import { hashPassword } from "../lib/crypto";

async function setupDatabase() {
  console.log("Starting database setup...");

  const sql = neon(process.env.NEON_DATABASE_URL!);
  const db = drizzle(sql, { schema });

  try {
    // Create tables
    console.log("Creating tables...");

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
    `;

    // Categories table
    await sql`
      CREATE TABLE IF NOT EXISTS categories (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL UNIQUE,
        slug VARCHAR(255) NOT NULL UNIQUE,
        description TEXT,
        created_at TIMESTAMP DEFAULT NOW() NOT NULL
      )
    `;

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
    `;

    // Post-Category junction table
    await sql`
      CREATE TABLE IF NOT EXISTS post_categories (
        post_id INTEGER NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
        category_id INTEGER NOT NULL REFERENCES categories(id) ON DELETE CASCADE,
        PRIMARY KEY (post_id, category_id)
      )
    `;

    console.log("Tables created successfully!");

    // Seed sample data
    console.log("Seeding sample data...");

    const demoPassword = await hashPassword("demo123456");
    const testPassword = await hashPassword("test123456");

    await sql`
      INSERT INTO users (id, email, name, password) 
      VALUES 
        ('user-1', 'demo@example.com', 'Demo User', ${demoPassword}),
        ('user-2', 'test@example.com', 'Test User', ${testPassword})
      ON CONFLICT (email) DO NOTHING
    `;

    // Create predefined categories with more options
    await sql`
      INSERT INTO categories (name, slug, description) 
      VALUES 
        ('Technology', 'technology', 'Posts about technology and programming'),
        ('Design', 'design', 'Posts about design and UX'),
        ('Business', 'business', 'Posts about business and entrepreneurship'),
        ('Lifestyle', 'lifestyle', 'Posts about lifestyle and personal development'),
        ('Travel', 'travel', 'Posts about travel and adventures'),
        ('Food', 'food', 'Posts about food and cooking'),
        ('Health', 'health', 'Posts about health and fitness'),
        ('Science', 'science', 'Posts about science and research'),
        ('Education', 'education', 'Posts about education and learning'),
        ('Entertainment', 'entertainment', 'Posts about entertainment and media'),
        ('Sports', 'sports', 'Posts about sports and athletics'),
        ('Gaming', 'gaming', 'Posts about video games and gaming culture'),
        ('Music', 'music', 'Posts about music and musicians'),
        ('Art', 'art', 'Posts about art and creative expression'),
        ('Photography', 'photography', 'Posts about photography and visual arts'),
        ('Fashion', 'fashion', 'Posts about fashion and style'),
        ('Finance', 'finance', 'Posts about finance and investing'),
        ('Politics', 'politics', 'Posts about politics and current affairs'),
        ('Environment', 'environment', 'Posts about environment and sustainability'),
        ('DIY', 'diy', 'Posts about do-it-yourself projects'),
        ('Productivity', 'productivity', 'Posts about productivity and time management'),
        ('Marketing', 'marketing', 'Posts about marketing and advertising'),
        ('Career', 'career', 'Posts about career development'),
        ('Parenting', 'parenting', 'Posts about parenting and family'),
        ('Pets', 'pets', 'Posts about pets and animals'),
        ('Books', 'books', 'Posts about books and reading'),
        ('Movies', 'movies', 'Posts about movies and cinema'),
        ('News', 'news', 'Posts about news and current events'),
        ('Opinion', 'opinion', 'Posts with personal opinions and commentary'),
        ('Tutorial', 'tutorial', 'Posts with step-by-step tutorials'),
        ('Review', 'review', 'Posts with product and service reviews')
      ON CONFLICT (slug) DO NOTHING
    `;

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
    `;

    // Link posts to categories
    await sql`
      INSERT INTO post_categories (post_id, category_id)
      SELECT p.id, c.id FROM posts p, categories c
      WHERE p.slug = 'getting-started-nextjs' AND c.slug = 'technology'
      ON CONFLICT DO NOTHING
    `;

    await sql`
      INSERT INTO post_categories (post_id, category_id)
      SELECT p.id, c.id FROM posts p, categories c
      WHERE p.slug = 'future-web-design' AND c.slug = 'design'
      ON CONFLICT DO NOTHING
    `;

    console.log("Database setup completed successfully!");
    console.log("Demo credentials:");
    console.log("  Email: demo@example.com, Password: demo123456");
    console.log("  Email: test@example.com, Password: test123456");
  } catch (error) {
    console.error("Database setup failed:", error);
    throw error;
  }
}

setupDatabase();

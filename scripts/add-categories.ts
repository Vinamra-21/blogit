import { neon } from "@neondatabase/serverless";

const sql = neon(process.env.NEON_DATABASE_URL!);

async function addCategories() {
  try {
    console.log("Adding new categories...");

    await sql`
      INSERT INTO categories (name, slug, description) 
      VALUES 
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

    console.log("Categories added successfully!");
  } catch (error) {
    console.error("Failed to add categories:", error);
    process.exit(1);
  }
}

addCategories();

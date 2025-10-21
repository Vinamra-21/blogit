# BlogIt - Modern Blogging Platform

A full-stack, multi-user blogging platform built with Next.js 15, TypeScript, tRPC, Drizzle ORM, and PostgreSQL.

**Live Demo**: [https://blogit-vin.vercel.app](https://blogit-vin.vercel.app) _(Deploy to get link)_

**Repository**: [https://github.com/Vinamra-21/blogit](https://github.com/Vinamra-21/blogit)

---

## 📋 Table of Contents

- [Tech Stack](#tech-stack)
- [Features Implemented](#features-implemented)
- [Setup Instructions](#setup-instructions)
- [Environment Variables](#environment-variables)
- [Database Setup](#database-setup)
- [tRPC Router Structure](#trpc-router-structure)
- [Trade-offs & Decisions](#trade-offs--decisions)
- [Time Spent](#time-spent)

---

## 🚀 Tech Stack

### Frontend

- **Next.js 15** - React framework with App Router
- **React 19** - UI library
- **TypeScript** - Type safety
- **Tailwind CSS** - Utility-first styling
- **shadcn/ui** - Component library
- **Tiptap** - Rich text editor
- **ReactMarkdown** - Markdown rendering

### Backend

- **tRPC** - End-to-end type-safe API
- **Drizzle ORM** - Type-safe database queries
- **PostgreSQL (Neon)** - Database
- **Zod** - Schema validation

### Authentication

- **JWT** - Token-based authentication
- **PBKDF2** - Password hashing with salt

### Deployment

- **Vercel** - Hosting platform
- **Neon** - Serverless PostgreSQL

---

## ✅ Features Implemented

### Priority 1 (Core Features)

- ✅ User authentication (register, login, logout)
- ✅ Create, read, update, delete blog posts
- ✅ Rich text editor with formatting (Tiptap)
- ✅ Post categorization (predefined 31 categories)
- ✅ User dashboard for managing posts
- ✅ Publish/unpublish posts
- ✅ Protected routes (middleware-based)
- ✅ Type-safe API with tRPC
- ✅ Responsive design

### Priority 2 (Enhanced Features)

- ✅ Post statistics (word count, reading time)
- ✅ Search functionality (posts & categories)
- ✅ Category filtering with dropdown
- ✅ Live markdown preview toggle
- ✅ Auto-generate slugs from titles
- ✅ Post excerpt support
- ✅ Dark/light mode with neon theme
- ✅ SEO meta tags (dynamic per post)
- ✅ Pagination (9 posts per page)

### Priority 3 (Polish)

- ✅ Professional landing page (5 sections)
- ✅ Hover effects on all interactive elements
- ✅ Loading states and skeletons
- ✅ Error handling with user feedback
- ✅ Mobile-responsive navbar
- ✅ Active filter badges
- ✅ Post count display
- ✅ Minimal footer with copyright
- ✅ Image support in rich text editor
- ✅ Link insertion in editor

---

## 🛠️ Setup Instructions

### Prerequisites

- Node.js 18+ and npm
- PostgreSQL database (Neon account - free tier)
- Git

### Local Setup Steps

1. **Clone the repository**

   ```bash
   git clone https://github.com/yourusername/blogit.git
   cd blogit
   ```

2. **Install dependencies**

   ```bash
   npm install --legacy-peer-deps
   ```

   _Note: `--legacy-peer-deps` is required due to React 19 compatibility_

3. **Set up environment variables**

   Create a `.env.local` file in the root directory:

   ```bash
   cp .env.example .env.local
   ```

   Fill in the required variables (see [Environment Variables](#environment-variables))

4. **Run database setup script**

   ```bash
   npm run setup-db
   ```

   This will:

   - Create all required tables (users, posts, categories, post_categories)
   - Seed 31 predefined categories
   - Create 2 demo users
   - Create sample blog posts

5. **Start development server**

   ```bash
   npm run dev
   ```

6. **Open your browser**

   Navigate to [http://localhost:3000](http://localhost:3000)

7. **Login with demo credentials**
   - Email: `demo@example.com` / Password: `demo123456`
   - Email: `test@example.com` / Password: `test123456`

---

## 🔐 Environment Variables

All environment variables must be set in `.env.local` for local development, or in your Vercel project settings for production.

### Required Variables

```bash
# Database Connection
NEON_DATABASE_URL="postgresql://username:password@host/database?sslmode=require"

# Authentication
JWT_SECRET="your-super-secret-jwt-key-min-32-characters-long"
```

### Getting Your Neon Database URL

1. Sign up at [Neon.tech](https://neon.tech) (free)
2. Create a new project
3. Copy the connection string from the dashboard
4. Paste it into your `.env.local` file

### Generating JWT Secret

```bash
# On macOS/Linux:
openssl rand -base64 32

# Or use any random string generator (minimum 32 characters)
```

### Example `.env.local`

```bash
NEON_DATABASE_URL="postgresql://user:pass@ep-cool-name.us-east-2.aws.neon.tech/neondb?sslmode=require"
JWT_SECRET="a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6"
```

---

## 🗄️ Database Setup

### Schema Overview

#### Users Table

- **users**: Stores user information
  - `id`: UUID, primary key
  - `email`: String, unique, not null
  - `name`: String, not null
  - `password`: String, not null (hashed)
  - `created_at`: Timestamp, default now()
  - `updated_at`: Timestamp, default now()

#### Posts Table

- **posts**: Stores blog posts
  - `id`: Integer, primary key, auto-increment
  - `title`: String, not null
  - `slug`: String, unique, not null
  - `content`: Text, not null
  - `excerpt`: Text, not null
  - `author_id`: UUID, foreign key references users(id), not null
  - `published`: Boolean, default false
  - `created_at`: Timestamp, default now()
  - `updated_at`: Timestamp, default now()

#### Categories Table

- **categories**: Stores post categories
  - `id`: Integer, primary key, auto-increment
  - `name`: String, unique, not null
  - `slug`: String, unique, not null
  - `description`: Text
  - `created_at`: Timestamp, default now()

#### Post Categories Table (Junction Table)

- **post_categories**: Associates posts with categories
  - `post_id`: Integer, foreign key references posts(id), primary key
  - `category_id`: Integer, foreign key references categories(id), primary key

### Relationships

- A user can have many posts (one-to-many)
- A post belongs to one user (many-to-one)
- A post can have many categories (many-to-many)
- A category can have many posts (many-to-many)

---

## 🔌 tRPC Router Structure

### Auth Router

- **login**: Authenticates user and returns JWT
- **register**: Registers new user and returns JWT
- **logout**: Logs out user (invalidates JWT)
- **me**: Returns current user info (protected)

### Post Router

- **getAll**: Returns all published posts (public)
- **getBySlug**: Returns a post by slug (public)
- **getByCategory**: Returns posts in a category (public)
- **getByAuthor**: Returns current user's posts (protected)
- **create**: Creates a new post (protected)
- **update**: Updates a post (protected, owner only)
- **delete**: Deletes a post (protected, owner only)
- **publish**: Publishes a post (protected, owner only)

### Category Router

- **getAll**: Returns all categories (public)
- **getBySlug**: Returns a category by slug (public)
- **create**: Creates a new category (protected)
- **update**: Updates a category (protected)
- **delete**: Deletes a category (protected)

---

## ⚖️ Trade-offs & Decisions

- **Next.js 15 App Router**: Chose App Router for better nested routing and layout support.
- **tRPC**: Used for end-to-end type-safe API, simplifying data fetching and mutations.
- **Drizzle ORM**: Opted for Drizzle ORM for its type-safe database queries and migrations.
- **PostgreSQL (Neon)**: Chose Neon for its serverless PostgreSQL offering, simplifying deployment and scaling.
- **Tailwind CSS & shadcn/ui**: Used for rapid, responsive design with a utility-first approach.

---

## ⏱️ Time Spent

- **Initial Setup**: 2 hours
- **Authentication**: 3 hours
- **Post Management**: 4 hours
- **Category Management**: 3 hours
- **UI Development**: 5 hours
- **Testing & Debugging**: 3 hours
- **Deployment**: 2 hours

**Total**: 22 hours

---

## Future Enhancements

- Comments system
- Search functionality
- Tags in addition to categories
- Post scheduling
- Analytics dashboard
- Social sharing
- Email notifications
- OAuth authentication (Google, GitHub)

## License

MIT

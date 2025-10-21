# BlogIt - Modern Blogging Platform

A full-stack, multi-user blogging platform built with Next.js 15, TypeScript, tRPC, Drizzle ORM, and PostgreSQL.

**Live Demo**: [https://blogit-vin.vercel.app](https://blogit-vin.vercel.app)

**Repository**: [https://github.com/Vinamra-21/blogit](https://github.com/Vinamra-21/blogit)

---

## 📋 Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Setup Instructions](#setup-instructions)
- [Environment Variables](#environment-variables)
- [Database Setup](#database-setup)
- [tRPC Router Structure](#trpc-router-structure)
- [Trade-offs & Decisions](#trade-offs--decisions)

---

## ✨ Features

### Core Features

- **User Authentication** - Secure JWT-based auth with encrypted passwords
- **CRUD Operations** - Create, read, update, delete blog posts
- **Rich Text Editor** - Professional Tiptap WYSIWYG editor with formatting
- **Categories** - 31 predefined categories for content organization
- **Dashboard** - Centralized post management interface
- **Publish/Unpublish** - Control post visibility
- **Protected Routes** - Middleware-based authentication
- **Type-Safe API** - End-to-end type safety with tRPC
- **Responsive Design** - Mobile-first approach with Tailwind CSS
- **Post Statistics** - Word count and estimated reading time
- **Search & Filter** - Search posts and filter by categories
- **Post Preview** - Live preview modal before publishing
- **Auto-generate Slugs** - SEO-friendly URLs from titles (editable)
- **Post Excerpts** - Optional summaries for posts
- **Dark/Light Mode** - Theme toggle with neon dark mode
- **Pagination** - 9 posts per page with smooth navigation
- **State Management** - Zustand for optimized global state
- **Image Support** - Add images via URLs in rich text editor
- **Link Insertion** - Hyperlinks in blog content

---

## 🚀 Tech Stack

### Frontend

- **Next.js 15** - React framework with App Router
- **React 19** - UI library
- **TypeScript** - Type safety
- **Tailwind CSS** - Utility-first styling
- **shadcn/ui** - Component library
- **Tiptap** - Rich text editor
- **Zustand** - State management
- **Zod** - Schema validation

### Backend

- **tRPC** - End-to-end type-safe API
- **Drizzle ORM** - Type-safe database queries
- **PostgreSQL (Neon)** - Serverless database
- **JWT (jose)** - Token-based authentication
- **PBKDF2** - Password hashing with salt

### Deployment

- **Vercel** - Hosting platform
- **Neon** - PostgreSQL hosting

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

### Architecture Decisions

**1. Client-Side Data Fetching with tRPC**

- **Decision**: Use client components with tRPC for data fetching
- **Pros**: Full type safety, easy mutations, optimistic updates
- **Cons**: No server-side meta tags for SEO (trade-off accepted)
- **Rationale**: Type safety and developer experience prioritized

**2. Predefined Categories**

- **Decision**: 31 curated categories (no user-created categories)
- **Pros**: Consistent organization, prevents fragmentation, better UX
- **Cons**: Less flexibility for niche topics
- **Rationale**: Quality and structure over unlimited flexibility

**3. Rich Text Editor (Tiptap)**

- **Decision**: Tiptap WYSIWYG with HTML storage
- **Pros**: Non-technical user friendly, richer formatting, image/link support
- **Cons**: Larger bundle size than plain markdown
- **Rationale**: Better user experience for content creators

**4. Zustand for State Management**

- **Decision**: Zustand instead of Redux or Context API
- **Pros**: Minimal boilerplate, better performance, easy to learn
- **Cons**: Less ecosystem than Redux
- **Rationale**: Simplicity and performance for this app size

**5. JWT in HTTP-only Cookies**

- **Decision**: Store tokens in HTTP-only cookies vs localStorage
- **Pros**: XSS protection, automatic inclusion in requests, secure
- **Cons**: Slightly more complex implementation
- **Rationale**: Security best practices

**6. Auto-generate Slugs with Manual Override**

- **Decision**: Auto-generate from title, allow manual editing
- **Pros**: Convenience + flexibility, prevents errors, SEO-friendly
- **Cons**: Extra UI complexity
- **Rationale**: Best of both worlds

**7. Pagination over Infinite Scroll**

- **Decision**: Traditional pagination (9 posts/page)
- **Pros**: SEO-friendly, shareable URLs, lower memory usage
- **Cons**: Less "modern" than infinite scroll
- **Rationale**: Better for SEO and navigation

---

## 🎯 Key Features Explained

### Post Management

- Create posts with rich text editor
- Auto-save drafts
- Preview before publishing
- Edit/delete your own posts
- Publish/unpublish anytime

### Content Organization

- 31 predefined categories
- Multi-category support per post
- Search across titles, content, excerpts
- Filter by category
- Smart pagination

### User Experience

- Instant search results
- Loading skeletons
- Error recovery
- Dark mode preference saved
- Mobile-optimized

### Security

- JWT authentication
- HTTP-only cookies
- Password hashing (PBKDF2)
- Protected routes
- Session management

---

## 🚧 Future Enhancements

- [ ] Comments system
- [ ] User profiles
- [ ] Tags (in addition to categories)
- [ ] Post scheduling
- [ ] Analytics dashboard
- [ ] Social media sharing
- [ ] Email notifications
- [ ] OAuth (Google, GitHub)
- [ ] Image uploads (currently URL-only)
- [ ] Draft auto-save
- [ ] Post versioning
- [ ] Full-text search

# Blog Platform

A modern, full-stack multi-user blogging platform built with Next.js 15, TypeScript, tRPC, Drizzle ORM, and PostgreSQL.

## Features

- **User authentication** - Secure registration and login with password encryption
- **Multi-user blogging** - Create, edit, and publish blog posts
- **Post ownership** - Users can only edit and delete their own posts
- **Category management** - Organize posts with categories
- **Markdown support** - Write posts in Markdown with live preview
- **Dashboard** - Manage all your posts and categories from a centralized dashboard
- **Type-safe API** - Full end-to-end type safety with tRPC
- **Responsive design** - Beautiful UI built with Tailwind CSS and shadcn/ui

## Tech Stack

- **Frontend**: Next.js 15 (App Router), React 19, TypeScript
- **Backend**: tRPC, Node.js
- **Database**: PostgreSQL (Neon), Drizzle ORM
- **Authentication**: JWT tokens, PBKDF2 password hashing
- **Styling**: Tailwind CSS, shadcn/ui
- **Validation**: Zod
- **Markdown**: react-markdown

## Getting Started

### Prerequisites

- Node.js 18+ and npm/pnpm
- PostgreSQL database (Neon recommended)

### Installation

1. Clone the repository and install dependencies:
\`\`\`bash
npm install
# or
pnpm install
\`\`\`

2. Set up your environment variables in the Vercel project settings:
   - \`NEON_NEON_NEON_DATABASE_URL\` - Your Neon PostgreSQL connection string
   - \`JWT_SECRET\` - Secret key for JWT token signing (generate a random string)

3. Run the database setup script to create tables and seed sample data:
\`\`\`bash
npm run setup-db
\`\`\`

4. Start the development server:
\`\`\`bash
npm run dev
\`\`\`

5. Open [http://localhost:3000](http://localhost:3000) in your browser

### Demo Credentials

After running the setup script, you can log in with:
- **Email**: demo@example.com, **Password**: demo123456
- **Email**: test@example.com, **Password**: test123456

## Project Structure

\`\`\`
├── app/
│   ├── layout.tsx              # Root layout with navbar
│   ├── page.tsx                # Home page - displays all posts
│   ├── auth/
│   │   ├── login/
│   │   │   └── page.tsx        # Login page
│   │   └── register/
│   │       └── page.tsx        # Registration page
│   ├── api/auth/
│   │   ├── login/
│   │   │   └── route.ts        # Login endpoint
│   │   ├── register/
│   │   │   └── route.ts        # Registration endpoint
│   │   ├── logout/
│   │   │   └── route.ts        # Logout endpoint
│   │   └── me/
│   │       └── route.ts        # Get current user endpoint
│   ├── posts/
│   │   └── [slug]/
│   │       └── page.tsx        # Individual post page
│   ├── categories/
│   │   └── [slug]/
│   │       └── page.tsx        # Category posts page
│   └── dashboard/
│       ├── layout.tsx          # Dashboard layout (protected)
│       ├── page.tsx            # Dashboard overview
│       ├── posts/
│       │   ├── page.tsx        # Posts management
│       │   ├── new/
│       │   │   └── page.tsx    # Create new post
│       │   └── [id]/edit/
│       │       └── page.tsx    # Edit post
│       └── categories/
│           ├── page.tsx        # Categories management
│           ├── new/
│           │   └── page.tsx    # Create new category
│           └── [id]/edit/
│               └── page.tsx    # Edit category
├── components/
│   ├── navbar.tsx              # Navigation bar with auth UI
│   ├── post-card.tsx           # Post card component
│   ├── post-form.tsx           # Post creation/edit form
│   ├── markdown-editor.tsx     # Markdown editor with preview
│   └── ui/                     # shadcn/ui components
├── lib/
│   ├── auth/
│   │   ├── crypto.ts           # Password hashing and verification
│   │   └── session.ts          # JWT token management
│   ├── db/
│   │   ├── schema.ts           # Drizzle ORM schema
│   │   └── client.ts           # Database client
│   ├── trpc/
│   │   ├── init.ts             # tRPC initialization with auth context
│   │   ├── root.ts             # Root router
│   │   ├── client.ts           # tRPC client
│   │   └── routers/
│   │       ├── posts.ts        # Posts router (with auth)
│   │       └── categories.ts   # Categories router (with auth)
│   └── hooks/
│       ├── use-posts.ts        # Posts hook
│       └── use-categories.ts   # Categories hook
├── scripts/
│   └── setup-db.ts             # Database setup script
├── middleware.ts               # Route protection middleware
└── drizzle.config.ts           # Drizzle configuration
\`\`\`

## Authentication

### How It Works

1. **Registration** - Users create an account with email and password
2. **Password Hashing** - Passwords are hashed using PBKDF2 with salt
3. **Login** - Users authenticate with email and password
4. **JWT Tokens** - Secure JWT tokens are issued and stored in HTTP-only cookies
5. **Protected Routes** - Middleware protects dashboard routes and requires authentication
6. **Protected Procedures** - tRPC procedures verify user authentication before allowing mutations

### Protected Routes

The following routes require authentication:
- `/dashboard` - Dashboard overview
- `/dashboard/posts` - Posts management
- `/dashboard/posts/new` - Create new post
- `/dashboard/posts/[id]/edit` - Edit post
- `/dashboard/categories` - Categories management
- `/dashboard/categories/new` - Create new category
- `/dashboard/categories/[id]/edit` - Edit category

Unauthenticated users are automatically redirected to `/auth/login`.

### API Routes

#### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/logout` - Logout user
- `GET /api/auth/me` - Get current user info

## API Routes

### Posts
- `posts.getAll()` - Get all published posts (public)
- `posts.getBySlug(slug)` - Get a specific post by slug (public)
- `posts.getByCategory(slug)` - Get posts in a category (public)
- `posts.getByAuthor()` - Get current user's posts (protected)
- `posts.create(data)` - Create a new post (protected)
- `posts.update(data)` - Update a post (protected, owner only)
- `posts.delete(id)` - Delete a post (protected, owner only)
- `posts.publish(id)` - Publish a post (protected, owner only)

### Categories
- `categories.getAll()` - Get all categories (public)
- `categories.getBySlug(slug)` - Get a specific category (public)
- `categories.create(data)` - Create a new category (protected)
- `categories.update(data)` - Update a category (protected)
- `categories.delete(id)` - Delete a category (protected)

## Database Schema

### Users
- `id` (TEXT, PRIMARY KEY)
- `email` (VARCHAR, UNIQUE)
- `name` (VARCHAR)
- `password` (TEXT) - Hashed password
- `created_at` (TIMESTAMP)
- `updated_at` (TIMESTAMP)

### Posts
- `id` (SERIAL, PRIMARY KEY)
- `title` (VARCHAR)
- `slug` (VARCHAR, UNIQUE)
- `content` (TEXT)
- `excerpt` (TEXT)
- `author_id` (TEXT, FOREIGN KEY → users.id)
- `published` (BOOLEAN)
- `created_at` (TIMESTAMP)
- `updated_at` (TIMESTAMP)

### Categories
- `id` (SERIAL, PRIMARY KEY)
- `name` (VARCHAR, UNIQUE)
- `slug` (VARCHAR, UNIQUE)
- `description` (TEXT)
- `created_at` (TIMESTAMP)

### Post Categories (Junction Table)
- `post_id` (INTEGER, FOREIGN KEY → posts.id)
- `category_id` (INTEGER, FOREIGN KEY → categories.id)

## Development

### Running Scripts

To run the database setup script:
\`\`\`bash
npm run setup-db
\`\`\`

### Building for Production

\`\`\`bash
npm run build
npm start
\`\`\`

### Environment Variables

Make sure to set these environment variables in your Vercel project:

- \`NEON_NEON_DATABASE_URL\` - PostgreSQL connection string from Neon
- \`JWT_SECRET\` - Secret key for JWT signing (generate a random string for production)

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

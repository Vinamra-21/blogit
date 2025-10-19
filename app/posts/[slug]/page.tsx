"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useParams } from "next/navigation"
import { trpc } from "@/lib/client"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import ReactMarkdown from "react-markdown"

export default function PostPage() {
  const params = useParams()
  const slug = params.slug as string
  const [post, setPost] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const data = await trpc.posts.getBySlug.query(slug)
        setPost(data)
      } catch (error) {
        console.error("Failed to fetch post:", error)
      } finally {
        setLoading(false)
      }
    }

    if (slug) {
      fetchPost()
    }
  }, [slug])

  if (loading) {
    return (
      <main className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-12">
          <Skeleton className="h-10 w-3/4 mb-4" />
          <Skeleton className="h-4 w-1/4 mb-8" />
          <Skeleton className="h-96 w-full" />
        </div>
      </main>
    )
  }

  if (!post) {
    return (
      <main className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-12">
          <h1 className="text-3xl font-bold mb-4">Post not found</h1>
          <Link href="/">
            <Button>Back to Blog</Button>
          </Link>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-12 max-w-3xl">
        <Link href="/">
          <Button variant="ghost" className="mb-6">
            ← Back to Blog
          </Button>
        </Link>

        <article>
          <header className="mb-8">
            <h1 className="text-4xl font-bold mb-4">{post.title}</h1>
            <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
              <span>{new Date(post.createdAt).toLocaleDateString()}</span>
              {post.author && <span>By {post.author.name}</span>}
            </div>

            {post.categories && post.categories.length > 0 && (
              <div className="flex gap-2 flex-wrap">
                {post.categories.map((cat: any) => (
                  <Link key={cat.id} href={`/categories/${cat.slug}`}>
                    <span className="text-xs bg-secondary text-secondary-foreground px-3 py-1 rounded hover:bg-secondary/80 transition-colors">
                      {cat.name}
                    </span>
                  </Link>
                ))}
              </div>
            )}
          </header>

          <div className="prose prose-sm dark:prose-invert max-w-none">
            <ReactMarkdown>{post.content}</ReactMarkdown>
          </div>
        </article>
      </div>
    </main>
  )
}

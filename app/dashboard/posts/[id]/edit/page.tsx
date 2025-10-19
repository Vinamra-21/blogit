"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { trpc } from "@/lib/client"
import { PostForm } from "@/components/post-form"
import { Skeleton } from "@/components/ui/skeleton"

export default function EditPostPage() {
  const params = useParams()
  const router = useRouter()
  const postId = Number.parseInt(params.id as string)
  const [post, setPost] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const allPosts = await trpc.posts.getByAuthor.query()
        const foundPost = allPosts.find((p) => p.id === postId)
        setPost(foundPost)
      } catch (error: any) {
        console.error("Failed to fetch post:", error)
        if (error.message?.includes("UNAUTHORIZED")) {
          router.push("/auth/login")
        } else {
          setError("Failed to load post")
        }
      } finally {
        setLoading(false)
      }
    }

    if (postId) {
      fetchPost()
    }
  }, [postId, router])

  if (loading) {
    return (
      <main className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-12 max-w-3xl space-y-6">
          <Skeleton className="h-10 w-1/3" />
          <Skeleton className="h-96 w-full" />
        </div>
      </main>
    )
  }

  if (error) {
    return (
      <main className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-12">
          <div className="bg-red-50 text-red-700 p-4 rounded-md">{error}</div>
        </div>
      </main>
    )
  }

  if (!post) {
    return (
      <main className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-12">
          <h1 className="text-3xl font-bold">Post not found</h1>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-12 max-w-3xl">
        <PostForm postId={postId} initialData={post} />
      </div>
    </main>
  )
}

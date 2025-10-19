"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { trpc } from "@/lib/client"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Skeleton } from "@/components/ui/skeleton"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

export default function PostsManagementPage() {
  const router = useRouter()
  const [posts, setPosts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [deleting, setDeleting] = useState<number | null>(null)
  const [error, setError] = useState("")

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const data = await trpc.posts.getByAuthor.query()
        setPosts(data)
      } catch (error: any) {
        console.error("Failed to fetch posts:", error)
        if (error.message?.includes("UNAUTHORIZED")) {
          router.push("/auth/login")
        } else {
          setError("Failed to load posts")
        }
      } finally {
        setLoading(false)
      }
    }

    fetchPosts()
  }, [router])

  const handleDelete = async (postId: number) => {
    setDeleting(postId)
    try {
      await trpc.posts.delete.mutate(postId)
      setPosts(posts.filter((p) => p.id !== postId))
    } catch (error) {
      console.error("Failed to delete post:", error)
      setError("Failed to delete post")
    } finally {
      setDeleting(null)
    }
  }

  const handlePublish = async (postId: number) => {
    try {
      await trpc.posts.publish.mutate(postId)
      setPosts(posts.map((p) => (p.id === postId ? { ...p, published: true } : p)))
    } catch (error) {
      console.error("Failed to publish post:", error)
      setError("Failed to publish post")
    }
  }

  return (
    <main className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-12">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold mb-2">Posts</h1>
            <p className="text-muted-foreground">Manage your blog posts</p>
          </div>
          <Link href="/dashboard/posts/new">
            <Button>New Post</Button>
          </Link>
        </div>

        {error && <div className="bg-red-50 text-red-700 p-3 rounded-md mb-4">{error}</div>}

        {loading ? (
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <Skeleton key={i} className="h-12 w-full" />
            ))}
          </div>
        ) : posts.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground mb-4">No posts yet. Create your first post!</p>
            <Link href="/dashboard/posts/new">
              <Button>Create Post</Button>
            </Link>
          </div>
        ) : (
          <div className="border rounded-lg overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {posts.map((post) => (
                  <TableRow key={post.id}>
                    <TableCell className="font-medium">{post.title}</TableCell>
                    <TableCell>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${
                          post.published
                            ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                            : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
                        }`}
                      >
                        {post.published ? "Published" : "Draft"}
                      </span>
                    </TableCell>
                    <TableCell>{new Date(post.createdAt).toLocaleDateString()}</TableCell>
                    <TableCell className="text-right space-x-2">
                      {!post.published && (
                        <Button size="sm" variant="outline" onClick={() => handlePublish(post.id)}>
                          Publish
                        </Button>
                      )}
                      <Link href={`/dashboard/posts/${post.id}/edit`}>
                        <Button size="sm" variant="outline">
                          Edit
                        </Button>
                      </Link>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button size="sm" variant="destructive">
                            Delete
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogTitle>Delete Post</AlertDialogTitle>
                          <AlertDialogDescription>
                            Are you sure you want to delete this post? This action cannot be undone.
                          </AlertDialogDescription>
                          <div className="flex gap-4 justify-end">
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleDelete(post.id)}
                              disabled={deleting === post.id}
                              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                            >
                              {deleting === post.id ? "Deleting..." : "Delete"}
                            </AlertDialogAction>
                          </div>
                        </AlertDialogContent>
                      </AlertDialog>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </div>
    </main>
  )
}

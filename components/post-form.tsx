"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { trpc } from "@/lib/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { MarkdownEditor } from "./markdown-editor"
import { Skeleton } from "@/components/ui/skeleton"

interface PostFormProps {
  postId?: number
  initialData?: any
}

export function PostForm({ postId, initialData }: PostFormProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [categories, setCategories] = useState<any[]>([])
  const [selectedCategories, setSelectedCategories] = useState<number[]>(initialData?.categoryIds || [])
  const [categoriesLoading, setCategoriesLoading] = useState(true)
  const [error, setError] = useState("")

  const [formData, setFormData] = useState({
    title: initialData?.title || "",
    slug: initialData?.slug || "",
    content: initialData?.content || "",
    excerpt: initialData?.excerpt || "",
  })

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await trpc.categories.getAll.query()
        setCategories(data)
      } catch (error) {
        console.error("Failed to fetch categories:", error)
      } finally {
        setCategoriesLoading(false)
      }
    }

    fetchCategories()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    try {
      if (postId) {
        await trpc.posts.update.mutate({
          id: postId,
          ...formData,
          categoryIds: selectedCategories,
        })
      } else {
        await trpc.posts.create.mutate({
          ...formData,
          categoryIds: selectedCategories,
        })
      }

      router.push("/dashboard")
      router.refresh()
    } catch (error: any) {
      console.error("Failed to save post:", error)
      setError(error.message || "Failed to save post")
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>{postId ? "Edit Post" : "Create New Post"}</CardTitle>
          <CardDescription>Fill in the details below to {postId ? "update" : "create"} your post</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {error && <div className="bg-red-50 text-red-700 p-3 rounded-md text-sm">{error}</div>}

          {/* Title */}
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="Post title"
              required
            />
          </div>

          {/* Slug */}
          <div className="space-y-2">
            <Label htmlFor="slug">Slug</Label>
            <Input
              id="slug"
              value={formData.slug}
              onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
              placeholder="post-slug"
              required
            />
          </div>

          {/* Excerpt */}
          <div className="space-y-2">
            <Label htmlFor="excerpt">Excerpt (optional)</Label>
            <Input
              id="excerpt"
              value={formData.excerpt}
              onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
              placeholder="Brief summary of your post"
            />
          </div>

          {/* Content */}
          <div className="space-y-2">
            <Label>Content</Label>
            <MarkdownEditor value={formData.content} onChange={(content) => setFormData({ ...formData, content })} />
          </div>

          {/* Categories */}
          <div className="space-y-3">
            <Label>Categories</Label>
            {categoriesLoading ? (
              <div className="space-y-2">
                <Skeleton className="h-6 w-32" />
                <Skeleton className="h-6 w-32" />
              </div>
            ) : (
              <div className="space-y-2">
                {categories.map((category) => (
                  <div key={category.id} className="flex items-center space-x-2">
                    <Checkbox
                      id={`cat-${category.id}`}
                      checked={selectedCategories.includes(category.id)}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          setSelectedCategories([...selectedCategories, category.id])
                        } else {
                          setSelectedCategories(selectedCategories.filter((id) => id !== category.id))
                        }
                      }}
                    />
                    <Label htmlFor={`cat-${category.id}`} className="font-normal cursor-pointer">
                      {category.name}
                    </Label>
                  </div>
                ))}
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <div className="flex gap-4">
        <Button type="submit" disabled={loading}>
          {loading ? "Saving..." : postId ? "Update Post" : "Create Post"}
        </Button>
        <Button type="button" variant="outline" onClick={() => router.back()} disabled={loading}>
          Cancel
        </Button>
      </div>
    </form>
  )
}

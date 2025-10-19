"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { trpc } from "@/lib/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Skeleton } from "@/components/ui/skeleton"

export default function EditCategoryPage() {
  const params = useParams()
  const router = useRouter()
  const categoryId = Number.parseInt(params.id as string)
  const [loading, setLoading] = useState(false)
  const [fetching, setFetching] = useState(true)
  const [category, setCategory] = useState<any>(null)
  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    description: "",
  })

  useEffect(() => {
    const fetchCategory = async () => {
      try {
        const allCategories = await trpc.categories.getAll.query()
        const found = allCategories.find((c) => c.id === categoryId)
        if (found) {
          setCategory(found)
          setFormData({
            name: found.name,
            slug: found.slug,
            description: found.description || "",
          })
        }
      } catch (error) {
        console.error("Failed to fetch category:", error)
      } finally {
        setFetching(false)
      }
    }

    if (categoryId) {
      fetchCategory()
    }
  }, [categoryId])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      await trpc.categories.update.mutate({
        id: categoryId,
        ...formData,
      })
      router.push("/dashboard/categories")
      router.refresh()
    } catch (error) {
      console.error("Failed to update category:", error)
    } finally {
      setLoading(false)
    }
  }

  if (fetching) {
    return (
      <main className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-12 max-w-2xl space-y-6">
          <Skeleton className="h-10 w-1/3" />
          <Skeleton className="h-96 w-full" />
        </div>
      </main>
    )
  }

  if (!category) {
    return (
      <main className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-12">
          <h1 className="text-3xl font-bold">Category not found</h1>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-12 max-w-2xl">
        <form onSubmit={handleSubmit} className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Edit Category</CardTitle>
              <CardDescription>Update category details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Category name"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="slug">Slug</Label>
                <Input
                  id="slug"
                  value={formData.slug}
                  onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                  placeholder="category-slug"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description (optional)</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Category description"
                  rows={4}
                />
              </div>
            </CardContent>
          </Card>

          <div className="flex gap-4">
            <Button type="submit" disabled={loading}>
              {loading ? "Updating..." : "Update Category"}
            </Button>
            <Button type="button" variant="outline" onClick={() => router.back()} disabled={loading}>
              Cancel
            </Button>
          </div>
        </form>
      </div>
    </main>
  )
}

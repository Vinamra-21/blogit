"use client"

import { useEffect, useState } from "react"
import { useRouter } from 'next/navigation'
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

export default function CategoriesManagementPage() {
  const router = useRouter()
  const [categories, setCategories] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [deleting, setDeleting] = useState<number | null>(null)
  const [error, setError] = useState("")

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await trpc.categories.getAll.query()
        setCategories(data)
      } catch (error: any) {
        console.error("Failed to fetch categories:", error)
        if (error.message?.includes("UNAUTHORIZED")) {
          router.push("/auth/login")
        } else {
          setError("Failed to load categories")
        }
      } finally {
        setLoading(false)
      }
    }

    fetchCategories()
  }, [router])

  const handleDelete = async (categoryId: number) => {
    setDeleting(categoryId)
    try {
      await trpc.categories.delete.mutate(categoryId)
      setCategories(categories.filter((c) => c.id !== categoryId))
    } catch (error: any) {
      console.error("Failed to delete category:", error)
      setError(error.message || "Failed to delete category")
    } finally {
      setDeleting(null)
    }
  }

  return (
    <main className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-12">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold mb-2">Categories</h1>
            <p className="text-muted-foreground">Manage your blog categories</p>
          </div>
          <Link href="/dashboard/categories/new">
            <Button>New Category</Button>
          </Link>
        </div>

        {error && <div className="bg-red-50 text-red-700 p-3 rounded-md mb-4">{error}</div>}

        {loading ? (
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <Skeleton key={i} className="h-12 w-full" />
            ))}
          </div>
        ) : categories.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground mb-4">No categories yet. Create your first category!</p>
            <Link href="/dashboard/categories/new">
              <Button>Create Category</Button>
            </Link>
          </div>
        ) : (
          <div className="border rounded-lg overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Slug</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {categories.map((category) => (
                  <TableRow key={category.id}>
                    <TableCell className="font-medium">{category.name}</TableCell>
                    <TableCell className="font-mono text-sm">{category.slug}</TableCell>
                    <TableCell className="max-w-xs truncate">{category.description || "-"}</TableCell>
                    <TableCell className="text-right space-x-2">
                      <Link href={`/dashboard/categories/${category.id}/edit`}>
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
                          <AlertDialogTitle>Delete Category</AlertDialogTitle>
                          <AlertDialogDescription>
                            Are you sure you want to delete this category? This action cannot be undone.
                          </AlertDialogDescription>
                          <div className="flex gap-4 justify-end">
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleDelete(category.id)}
                              disabled={deleting === category.id}
                              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                            >
                              {deleting === category.id ? "Deleting..." : "Delete"}
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

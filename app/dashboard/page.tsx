"use client"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function DashboardPage() {
  return (
    <main className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-12">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Dashboard</h1>
          <p className="text-muted-foreground">Manage your blog posts and categories</p>
        </div>

        <Tabs defaultValue="posts" className="w-full">
          <TabsList>
            <TabsTrigger value="posts">Posts</TabsTrigger>
            <TabsTrigger value="categories">Categories</TabsTrigger>
          </TabsList>

          <TabsContent value="posts" className="mt-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">Posts</h2>
              <Link href="/dashboard/posts/new">
                <Button>New Post</Button>
              </Link>
            </div>
            <div className="text-center py-12 text-muted-foreground">
              <p>Posts management component will be loaded here</p>
            </div>
          </TabsContent>

          <TabsContent value="categories" className="mt-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">Categories</h2>
              <Link href="/dashboard/categories/new">
                <Button>New Category</Button>
              </Link>
            </div>
            <div className="text-center py-12 text-muted-foreground">
              <p>Categories management component will be loaded here</p>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </main>
  )
}

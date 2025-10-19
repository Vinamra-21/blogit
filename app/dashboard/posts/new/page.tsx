import { PostForm } from "@/components/post-form"

export default function NewPostPage() {
  return (
    <main className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-12 max-w-3xl">
        <PostForm />
      </div>
    </main>
  )
}

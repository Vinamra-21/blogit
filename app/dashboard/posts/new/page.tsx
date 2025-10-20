import { PostForm } from "@/components/post-form";
import Link from "next/link";

export default function NewPostPage() {
  return (
    <main className="min-h-screen bg-white dark:bg-black">
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <div className="mb-6">
          <Link
            href="/dashboard"
            className="inline-block hover:opacity-80 transition-opacity">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2 cursor-pointer">
              Create New Post
            </h1>
          </Link>
          <p className="text-gray-600 dark:text-gray-300">
            Write and publish your story
          </p>
        </div>
        <PostForm />
      </div>
    </main>
  );
}

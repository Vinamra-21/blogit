"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { trpc } from "@/lib/client";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import ReactMarkdown from "react-markdown";
import { ArrowLeft, Calendar, User } from "lucide-react";

export default function PostPage() {
  const params = useParams();
  const slug = params.slug as string;
  const [post, setPost] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const data = await trpc.posts.getBySlug.query(slug);
        setPost(data);
      } catch (error) {
        console.error("Failed to fetch post:", error);
      } finally {
        setLoading(false);
      }
    };

    if (slug) {
      fetchPost();
    }
  }, [slug]);

  if (loading) {
    return (
      <main className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-12">
          <Skeleton className="h-10 w-3/4 mb-4" />
          <Skeleton className="h-4 w-1/4 mb-8" />
          <Skeleton className="h-96 w-full" />
        </div>
      </main>
    );
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
    );
  }

  return (
    <main className="min-h-screen bg-background gradient-bg">
      <div className="container mx-auto px-4 py-8 md:py-12 max-w-4xl">
        <Link href="/">
          <Button
            variant="ghost"
            className="mb-6 group dark:hover:text-[#00ff9d]">
            <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
            Back to Blog
          </Button>
        </Link>

        <article className="bg-card rounded-xl border dark:border-white/10 overflow-hidden shadow-sm dark:shadow-[#00ff9d]/10 neon-border">
          <div className="h-2 bg-black dark:bg-gradient-to-r dark:from-[#00ff9d] dark:to-[#00ccff]" />

          <header className="p-6 md:p-10 border-b dark:border-white/10">
            <h1 className="text-3xl md:text-5xl font-bold mb-6 leading-tight dark:text-white">
              {post.title}
            </h1>

            <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-6">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                <span>
                  {new Date(post.createdAt).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </span>
              </div>
              {post.author && (
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4" />
                  <span>By {post.author.name}</span>
                </div>
              )}
            </div>

            {post.categories && post.categories.length > 0 && (
              <div className="flex gap-2 flex-wrap">
                {post.categories.map((cat: any) => (
                  <Link key={cat.id} href={`/categories/${cat.slug}`}>
                    <span className="text-xs bg-black dark:bg-[#00ff9d]/20 text-white dark:text-[#00ff9d] px-3 py-1.5 rounded-full hover:bg-gray-800 dark:hover:bg-[#00ff9d]/30 transition-colors font-medium dark:border dark:border-[#00ff9d]/30">
                      {cat.name}
                    </span>
                  </Link>
                ))}
              </div>
            )}
          </header>

          <div className="p-6 md:p-10">
            <div className="prose prose-lg dark:prose-invert max-w-none prose-headings:font-bold prose-headings:text-foreground prose-p:text-muted-foreground prose-a:text-black dark:prose-a:text-[#00ff9d] hover:prose-a:underline prose-strong:text-foreground dark:prose-strong:text-[#00ff9d] prose-code:text-black dark:prose-code:text-[#00ff9d] prose-pre:bg-muted dark:prose-pre:bg-black dark:prose-pre:border dark:prose-pre:border-white/10">
              <ReactMarkdown>{post.content}</ReactMarkdown>
            </div>
          </div>
        </article>
      </div>
    </main>
  );
}

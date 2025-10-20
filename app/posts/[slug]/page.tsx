"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { trpc } from "@/lib/client";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowLeft, Calendar, User, Clock, BookOpen } from "lucide-react";
import { getWordCount, getReadingTime } from "@/lib/utils";

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
      <main className="min-h-screen bg-background gradient-bg">
        <div className="container mx-auto px-4 py-12 max-w-4xl">
          <Skeleton className="h-10 w-3/4 mb-4 bg-gray-200 dark:bg-white/10" />
          <Skeleton className="h-4 w-1/4 mb-8 bg-gray-200 dark:bg-white/10" />
          <Skeleton className="h-96 w-full bg-gray-200 dark:bg-white/10" />
        </div>
      </main>
    );
  }

  if (!post) {
    return (
      <main className="min-h-screen bg-background gradient-bg">
        <div className="container mx-auto px-4 py-12">
          <h1 className="text-3xl font-bold mb-4 text-gray-900 dark:text-white">
            Post not found
          </h1>
          <Link href="/">
            <Button className="bg-emerald-600 hover:bg-emerald-700 dark:bg-[#00ff9d] dark:hover:bg-[#00e68a] text-white dark:text-black">
              Back to Blog
            </Button>
          </Link>
        </div>
      </main>
    );
  }

  const wordCount = getWordCount(post.content);
  const readingTime = getReadingTime(post.content);

  return (
    <main className="min-h-screen bg-background gradient-bg">
      <div className="container mx-auto px-4 py-8 md:py-12 max-w-4xl">
        <Link href="/">
          <Button
            variant="ghost"
            className="mb-6 group dark:hover:text-[#00ff9d] text-gray-700 dark:text-white">
            <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
            Back to Blog
          </Button>
        </Link>

        <article className="bg-card rounded-xl border border-gray-200 dark:border-white/10 overflow-hidden shadow-sm dark:shadow-[#00ff9d]/10 dark:neon-border bg-white dark:bg-black">
          <div className="h-2 bg-gradient-to-r from-emerald-500 to-emerald-600 dark:from-[#00ff9d] dark:to-[#00ccff]" />

          <header className="p-6 md:p-10 border-b border-gray-200 dark:border-white/10">
            <h1 className="text-3xl md:text-5xl font-bold mb-6 leading-tight text-gray-900 dark:text-white">
              {post.title}
            </h1>

            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 dark:text-gray-400 mb-4">
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
              <div className="flex items-center gap-2 text-emerald-600 dark:text-[#00ff9d]">
                <Clock className="w-4 h-4" />
                <span>{readingTime}</span>
              </div>
              <div className="flex items-center gap-2">
                <BookOpen className="w-4 h-4" />
                <span>{wordCount.toLocaleString()} words</span>
              </div>
            </div>

            {post.categories && post.categories.length > 0 && (
              <div className="flex gap-2 flex-wrap">
                {post.categories.map((cat: any) => (
                  <Link key={cat.id} href={`/categories/${cat.slug}`}>
                    <span className="text-xs bg-emerald-100 dark:bg-[#00ff9d]/20 text-emerald-700 dark:text-[#00ff9d] px-3 py-1.5 rounded-full hover:bg-emerald-200 dark:hover:bg-[#00ff9d]/30 transition-colors font-medium border border-emerald-200 dark:border-[#00ff9d]/30">
                      {cat.name}
                    </span>
                  </Link>
                ))}
              </div>
            )}
          </header>

          <div className="p-6 md:p-10">
            <div
              className="prose prose-lg dark:prose-invert max-w-none prose-headings:font-bold prose-headings:text-gray-900 dark:prose-headings:text-white prose-p:text-gray-700 dark:prose-p:text-gray-300 prose-a:text-emerald-600 dark:prose-a:text-[#00ff9d] hover:prose-a:underline prose-strong:text-gray-900 dark:prose-strong:text-white prose-code:text-emerald-600 dark:prose-code:text-[#00ff9d] prose-pre:bg-gray-100 dark:prose-pre:bg-white/5 dark:prose-pre:border dark:prose-pre:border-white/10 prose-blockquote:border-emerald-500 dark:prose-blockquote:border-[#00ff9d] prose-blockquote:text-gray-600 dark:prose-blockquote:text-gray-400"
              dangerouslySetInnerHTML={{ __html: post.content }}
            />
          </div>
        </article>
      </div>
    </main>
  );
}

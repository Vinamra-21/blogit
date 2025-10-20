"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { trpc } from "@/lib/client";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { PenSquare, TrendingUp, Users } from "lucide-react";

export default function Home() {
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const data = await trpc.posts.getAll.query();
        setPosts(data);
      } catch (error) {
        console.error("Failed to fetch posts:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  return (
    <main className="min-h-screen gradient-bg">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16 md:py-24">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 gradient-text neon-text">
            Welcome to BlogIt
          </h1>
          <p className="text-xl text-muted-foreground mb-8">
            Discover insightful articles, share your thoughts, and connect with
            writers from around the world
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link href="/auth/register">
              <Button
                size="lg"
                className="bg-black hover:bg-black/80 dark:bg-[#00ff9d] dark:hover:bg-[#00ff9d]/90 text-white dark:text-black font-medium neon-button dark:neon-glow-strong transition-all">
                <PenSquare className="w-5 h-5 mr-2" />
                Start Writing
              </Button>
            </Link>
            <Link href="#posts">
              <Button
                size="lg"
                variant="outline"
                className="dark:border-white/20 dark:hover:border-[#00ff9d]/50 dark:hover:text-[#00ff9d] transition-all">
                Explore Posts
              </Button>
            </Link>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          <div className="bg-card border dark:border-white/10 rounded-xl p-6 text-center hover:shadow-lg dark:hover:shadow-[#00ff9d]/20 transition-all group neon-border">
            <div className="bg-black dark:bg-[#00ff9d]/10 w-14 h-14 rounded-xl flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform dark:neon-glow">
              <PenSquare className="w-7 h-7 text-white dark:text-[#00ff9d]" />
            </div>
            <div className="text-3xl font-bold mb-1 dark:text-[#00ff9d]">
              {posts.length}
            </div>
            <div className="text-sm text-muted-foreground">Published Posts</div>
          </div>
          <div className="bg-card border dark:border-white/10 rounded-xl p-6 text-center hover:shadow-lg dark:hover:shadow-[#00ccff]/20 transition-all group neon-border">
            <div className="bg-black dark:bg-[#00ccff]/10 w-14 h-14 rounded-xl flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform dark:shadow-[0_0_15px_rgba(0,204,255,0.3)]">
              <Users className="w-7 h-7 text-white dark:text-[#00ccff]" />
            </div>
            <div className="text-3xl font-bold mb-1 dark:text-[#00ccff]">
              100+
            </div>
            <div className="text-sm text-muted-foreground">Active Writers</div>
          </div>
          <div className="bg-card border dark:border-white/10 rounded-xl p-6 text-center hover:shadow-lg dark:hover:shadow-[#ff00ff]/20 transition-all group neon-border">
            <div className="bg-black dark:bg-[#ff00ff]/10 w-14 h-14 rounded-xl flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform dark:shadow-[0_0_15px_rgba(255,0,255,0.3)]">
              <TrendingUp className="w-7 h-7 text-white dark:text-[#ff00ff]" />
            </div>
            <div className="text-3xl font-bold mb-1 dark:text-[#ff00ff]">
              1K+
            </div>
            <div className="text-sm text-muted-foreground">Monthly Readers</div>
          </div>
        </div>
      </div>

      {/* Posts Section */}
      <div id="posts" className="container mx-auto px-4 pb-16">
        <div className="mb-8">
          <h2 className="text-3xl font-bold mb-2 dark:text-white">
            Latest Articles
          </h2>
          <p className="text-muted-foreground">
            Explore our most recent posts and insights
          </p>
        </div>

        {loading ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[...Array(6)].map((_, i) => (
              <Card key={i} className="overflow-hidden">
                <CardHeader>
                  <Skeleton className="h-6 w-3/4 mb-2" />
                  <Skeleton className="h-4 w-full" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-4 w-full mb-2" />
                  <Skeleton className="h-4 w-2/3" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : posts.length === 0 ? (
          <div className="text-center py-16 bg-card rounded-xl border">
            <PenSquare className="w-16 h-16 mx-auto mb-4 text-muted-foreground/50" />
            <p className="text-muted-foreground mb-4 text-lg">
              No posts yet. Be the first to share your story!
            </p>
            <Link href="/auth/register">
              <Button>Start Writing</Button>
            </Link>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {posts.map((post) => (
              <Link key={post.id} href={`/posts/${post.slug}`}>
                <Card className="h-full hover:shadow-xl dark:hover:shadow-[#00ff9d]/20 transition-all duration-300 hover:-translate-y-1 cursor-pointer overflow-hidden group border dark:border-white/10 neon-border">
                  <div className="h-2 bg-black dark:bg-gradient-to-r dark:from-[#00ff9d] dark:to-[#00ccff] group-hover:h-3 transition-all" />
                  <CardHeader>
                    <CardTitle className="line-clamp-2 group-hover:text-black dark:group-hover:text-[#00ff9d] transition-colors">
                      {post.title}
                    </CardTitle>
                    <CardDescription className="flex items-center gap-2">
                      <span>
                        {new Date(post.createdAt).toLocaleDateString()}
                      </span>
                      {post.author && <span>• {post.author.name}</span>}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground line-clamp-3 mb-4">
                      {post.excerpt || post.content.substring(0, 150)}
                    </p>
                    {post.categories && post.categories.length > 0 && (
                      <div className="flex gap-2 flex-wrap">
                        {post.categories.slice(0, 2).map((cat: any) => (
                          <span
                            key={cat.id}
                            className="text-xs bg-black dark:bg-[#00ff9d]/20 text-white dark:text-[#00ff9d] px-3 py-1 rounded-full font-medium dark:border dark:border-[#00ff9d]/30">
                            {cat.name}
                          </span>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}

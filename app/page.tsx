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
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

export default function Home() {
  const [posts, setPosts] = useState<any[]>([]);
  const [filteredPosts, setFilteredPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const data = await trpc.posts.getAll.query();
        setPosts(data);
        setFilteredPosts(data);
      } catch (error) {
        console.error("Failed to fetch posts:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  // Filter posts based on search query
  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredPosts(posts);
    } else {
      const query = searchQuery.toLowerCase();
      const filtered = posts.filter(
        (post) =>
          post.title.toLowerCase().includes(query) ||
          post.content.toLowerCase().includes(query) ||
          post.excerpt?.toLowerCase().includes(query) ||
          post.categories?.some((cat: any) =>
            cat.name.toLowerCase().includes(query)
          )
      );
      setFilteredPosts(filtered);
    }
  }, [searchQuery, posts]);

  return (
    <main className="min-h-screen gradient-bg">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16 md:py-24">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 gradient-text dark:neon-text">
            Welcome to BlogIt
          </h1>
          <p className="text-xl text-gray-600 dark:text-white mb-8">
            Discover insightful articles, share your thoughts, and connect with
            writers from around the world
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link href="/auth/register">
              <Button
                size="lg"
                className="bg-emerald-600 hover:bg-emerald-700 dark:bg-[#00ff9d] dark:hover:bg-[#00e68a] text-white dark:text-black font-medium btn-hover dark:neon-glow-strong transition-all">
                <PenSquare className="w-5 h-5 mr-2" />
                Start Writing
              </Button>
            </Link>
            <Link href="#posts">
              <Button
                size="lg"
                variant="outline"
                className="border-gray-300 text-gray-700 hover:border-emerald-500 hover:text-emerald-600 dark:text-white dark:border-white/20 dark:hover:border-[#00ff9d]/50 dark:hover:text-[#00ff9d] transition-all btn-hover">
                Explore Posts
              </Button>
            </Link>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          <div className="bg-card border border-gray-200 dark:border-white/10 rounded-xl p-6 text-center hover:shadow-lg dark:hover:shadow-[#00ff9d]/20 transition-all group dark:neon-border">
            <div className="bg-emerald-100 dark:bg-[#00ff9d]/10 w-14 h-14 rounded-xl flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform dark:neon-glow">
              <PenSquare className="w-7 h-7 text-emerald-600 dark:text-[#00ff9d]" />
            </div>
            <div className="text-3xl font-bold mb-1 text-gray-900 dark:text-[#00ff9d]">
              {posts.length}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-300">
              Published Posts
            </div>
          </div>
          <div className="bg-card border border-gray-200 dark:border-white/10 rounded-xl p-6 text-center hover:shadow-lg dark:hover:shadow-[#00ccff]/20 transition-all group dark:neon-border">
            <div className="bg-blue-100 dark:bg-[#00ccff]/10 w-14 h-14 rounded-xl flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform dark:shadow-[0_0_15px_rgba(0,204,255,0.3)]">
              <Users className="w-7 h-7 text-blue-600 dark:text-[#00ccff]" />
            </div>
            <div className="text-3xl font-bold mb-1 text-gray-900 dark:text-[#00ccff]">
              100+
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-300">
              Active Writers
            </div>
          </div>
          <div className="bg-card border border-gray-200 dark:border-white/10 rounded-xl p-6 text-center hover:shadow-lg dark:hover:shadow-[#ff00ff]/20 transition-all group dark:neon-border">
            <div className="bg-purple-100 dark:bg-[#ff00ff]/10 w-14 h-14 rounded-xl flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform dark:shadow-[0_0_15px_rgba(255,0,255,0.3)]">
              <TrendingUp className="w-7 h-7 text-purple-600 dark:text-[#ff00ff]" />
            </div>
            <div className="text-3xl font-bold mb-1 text-gray-900 dark:text-[#ff00ff]">
              1K+
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-300">
              Monthly Readers
            </div>
          </div>
        </div>
      </div>

      {/* Posts Section with Search */}
      <div id="posts" className="container mx-auto px-4 pb-16">
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
                Latest Articles
              </h2>
              <p className="text-gray-600 dark:text-gray-300">
                Explore our most recent posts and insights
              </p>
            </div>

            {/* Search Bar */}
            <div className="relative w-full md:w-96">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 dark:text-gray-500" />
              <Input
                type="text"
                placeholder="Search posts, categories..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-white dark:bg-black text-gray-900 dark:text-white border-gray-300 dark:border-white/20 placeholder:text-gray-400 dark:placeholder:text-gray-500"
              />
            </div>
          </div>
        </div>

        {loading ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[...Array(6)].map((_, i) => (
              <Card
                key={i}
                className="overflow-hidden border border-gray-200 dark:border-white/20">
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
        ) : filteredPosts.length === 0 ? (
          <div className="text-center py-16 bg-card rounded-xl border border-gray-200 dark:border-white/20">
            <PenSquare className="w-16 h-16 mx-auto mb-4 text-gray-400 dark:text-gray-500" />
            <p className="text-gray-600 dark:text-gray-300 mb-4 text-lg">
              {searchQuery
                ? `No posts found for "${searchQuery}"`
                : "No posts yet. Be the first to share your story!"}
            </p>
            {!searchQuery && (
              <Link href="/auth/register">
                <Button className="bg-emerald-600 hover:bg-emerald-700 dark:bg-[#00ff9d] dark:hover:bg-[#00e68a] text-white dark:text-black btn-hover">
                  Start Writing
                </Button>
              </Link>
            )}
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredPosts.map((post) => (
              <Link key={post.id} href={`/posts/${post.slug}`}>
                <Card className="h-full hover:shadow-xl dark:hover:shadow-[#00ff9d]/20 transition-all duration-300 hover:-translate-y-2 cursor-pointer overflow-hidden group border-2 border-gray-200 hover:border-emerald-300 dark:border-white/20 dark:hover:border-[#00ff9d]/50 bg-white dark:bg-black">
                  <div className="h-2 bg-gradient-to-r from-emerald-500 to-emerald-600 dark:from-[#00ff9d] dark:to-[#00ccff] group-hover:h-3 transition-all" />
                  <CardHeader>
                    <CardTitle className="line-clamp-2 text-gray-900 group-hover:text-emerald-600 dark:text-white dark:group-hover:text-[#00ff9d] transition-colors">
                      {post.title}
                    </CardTitle>
                    <CardDescription className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                      <span>
                        {new Date(post.createdAt).toLocaleDateString()}
                      </span>
                      {post.author && <span>• {post.author.name}</span>}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-3 mb-4">
                      {post.excerpt || post.content.substring(0, 150)}
                    </p>
                    {post.categories && post.categories.length > 0 && (
                      <div className="flex gap-2 flex-wrap">
                        {post.categories.slice(0, 2).map((cat: any) => (
                          <span
                            key={cat.id}
                            className="text-xs bg-emerald-100 text-emerald-700 dark:bg-[#00ff9d]/20 dark:text-[#00ff9d] px-3 py-1 rounded-full font-medium dark:border dark:border-[#00ff9d]/30 hover:bg-emerald-200 dark:hover:bg-[#00ff9d]/30 transition-colors">
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

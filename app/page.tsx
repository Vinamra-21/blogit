"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePostsStore } from "@/lib/stores/posts-store";
import { useCategoriesStore } from "@/lib/stores/categories-store";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectItem } from "@/components/ui/select";
import {
  PenSquare,
  TrendingUp,
  Users,
  Search,
  Filter,
  ChevronLeft,
  ChevronRight,
  Zap,
  Shield,
  Sparkles,
  BookOpen,
  Clock,
  Heart,
} from "lucide-react";

export default function Home() {
  const {
    posts,
    filteredPosts,
    loading,
    searchQuery,
    selectedCategory,
    currentPage,
    setSearchQuery,
    setSelectedCategory,
    setCurrentPage,
    fetchPosts,
  } = usePostsStore();

  const {
    categories,
    loading: categoriesLoading,
    fetchCategories,
  } = useCategoriesStore();
  const [error, setError] = useState<string | null>(null);

  const postsPerPage = 9;

  useEffect(() => {
    fetchPosts().catch((err) => setError("Failed to load posts"));
    fetchCategories();
  }, [fetchPosts, fetchCategories]);

  // Calculate pagination
  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = filteredPosts.slice(indexOfFirstPost, indexOfLastPost);
  const totalPages = Math.ceil(filteredPosts.length / postsPerPage);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    document.getElementById("posts")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <main className="min-h-screen">
      {/* SECTION 1: HERO */}
      <section className="gradient-bg py-20 md:py-32">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-block mb-4">
              <span className="bg-emerald-100 dark:bg-[#00ff9d]/20 text-emerald-700 dark:text-[#00ff9d] px-4 py-2 rounded-full text-sm font-semibold border border-emerald-200 dark:border-[#00ff9d]/30">
                ✨ Modern Blogging Platform
              </span>
            </div>

            <h1 className="text-5xl md:text-7xl font-bold mb-6 gradient-text dark:neon-text leading-tight">
              Share Your Stories
              <br />
              <span className="text-gray-600 dark:text-gray-400">
                With the World
              </span>
            </h1>

            <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 mb-10 max-w-2xl mx-auto leading-relaxed">
              A modern, elegant platform where writers connect, create, and
              inspire. Join thousands of storytellers sharing their journey.
            </p>

            <div className="flex flex-wrap gap-4 justify-center">
              <Link href="/auth/register">
                <Button
                  size="lg"
                  className="bg-emerald-600 hover:bg-emerald-700 dark:bg-[#00ff9d] dark:hover:bg-[#00e68a] text-white dark:text-black font-medium btn-hover dark:neon-glow-strong transition-all text-lg px-8 py-6">
                  <PenSquare className="w-5 h-5 mr-2" />
                  Start Writing for Free
                </Button>
              </Link>
              <Link href="#posts">
                <Button
                  size="lg"
                  variant="outline"
                  className="border-gray-300 text-gray-700 hover:border-emerald-500 hover:text-emerald-600 dark:text-white dark:border-white/20 dark:hover:border-[#00ff9d]/50 dark:hover:text-[#00ff9d] transition-all btn-hover text-lg px-8 py-6">
                  Explore Posts
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 2: FEATURES */}
      <section className="py-20 bg-white dark:bg-black border-t border-b border-gray-200 dark:border-white/10">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4 text-gray-900 dark:text-white">
              Everything You Need to Blog
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Powerful features designed for modern content creators
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="group p-8 rounded-xl border-2 border-gray-200 dark:border-white/10 hover:border-emerald-300 dark:hover:border-[#00ff9d]/50 transition-all hover:shadow-xl dark:hover:shadow-[#00ff9d]/20 bg-white dark:bg-black">
              <div className="bg-emerald-100 dark:bg-[#00ff9d]/10 w-14 h-14 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Zap className="w-7 h-7 text-emerald-600 dark:text-[#00ff9d]" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-gray-900 dark:text-white">
                Rich Text Editor
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Professional WYSIWYG editor with formatting, images, and links.
                Write like a pro with our intuitive interface.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="group p-8 rounded-xl border-2 border-gray-200 dark:border-white/10 hover:border-emerald-300 dark:hover:border-[#00ff9d]/50 transition-all hover:shadow-xl dark:hover:shadow-[#00ff9d]/20 bg-white dark:bg-black">
              <div className="bg-blue-100 dark:bg-blue-500/10 w-14 h-14 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Shield className="w-7 h-7 text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-gray-900 dark:text-white">
                Secure & Private
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                JWT authentication, encrypted passwords, and protected routes.
                Your content is safe with us.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="group p-8 rounded-xl border-2 border-gray-200 dark:border-white/10 hover:border-emerald-300 dark:hover:border-[#00ff9d]/50 transition-all hover:shadow-xl dark:hover:shadow-[#00ff9d]/20 bg-white dark:bg-black">
              <div className="bg-purple-100 dark:bg-purple-500/10 w-14 h-14 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Sparkles className="w-7 h-7 text-purple-600 dark:text-purple-400" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-gray-900 dark:text-white">
                SEO Optimized
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Dynamic meta tags, clean URLs, and fast loading. Get discovered
                by your audience.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="group p-8 rounded-xl border-2 border-gray-200 dark:border-white/10 hover:border-emerald-300 dark:hover:border-[#00ff9d]/50 transition-all hover:shadow-xl dark:hover:shadow-[#00ff9d]/20 bg-white dark:bg-black">
              <div className="bg-orange-100 dark:bg-orange-500/10 w-14 h-14 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Search className="w-7 h-7 text-orange-600 dark:text-orange-400" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-gray-900 dark:text-white">
                Smart Search
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Find posts instantly with our powerful search and category
                filtering system.
              </p>
            </div>

            {/* Feature 5 */}
            <div className="group p-8 rounded-xl border-2 border-gray-200 dark:border-white/10 hover:border-emerald-300 dark:hover:border-[#00ff9d]/50 transition-all hover:shadow-xl dark:hover:shadow-[#00ff9d]/20 bg-white dark:bg-black">
              <div className="bg-pink-100 dark:bg-pink-500/10 w-14 h-14 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Clock className="w-7 h-7 text-pink-600 dark:text-pink-400" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-gray-900 dark:text-white">
                Post Analytics
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Track word count, reading time, and engagement. Optimize your
                content.
              </p>
            </div>

            {/* Feature 6 */}
            <div className="group p-8 rounded-xl border-2 border-gray-200 dark:border-white/10 hover:border-emerald-300 dark:hover:border-[#00ff9d]/50 transition-all hover:shadow-xl dark:hover:shadow-[#00ff9d]/20 bg-white dark:bg-black">
              <div className="bg-green-100 dark:bg-green-500/10 w-14 h-14 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <BookOpen className="w-7 h-7 text-green-600 dark:text-green-400" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-gray-900 dark:text-white">
                31 Categories
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Organize your content across diverse topics. From tech to
                travel, we've got you covered.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 3: STATS */}
      <section className="py-16 gradient-bg">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-card border-2 border-gray-200 dark:border-white/10 rounded-xl p-8 text-center hover:shadow-xl dark:hover:shadow-[#00ff9d]/20 transition-all group">
              <div className="bg-emerald-100 dark:bg-[#00ff9d]/10 w-16 h-16 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform dark:neon-glow">
                <PenSquare className="w-8 h-8 text-emerald-600 dark:text-[#00ff9d]" />
              </div>
              <div className="text-4xl md:text-5xl font-bold mb-2 text-gray-900 dark:text-[#00ff9d]">
                {posts.length}+
              </div>
              <div className="text-gray-600 dark:text-gray-300 font-medium">
                Published Posts
              </div>
            </div>

            <div className="bg-card border-2 border-gray-200 dark:border-white/10 rounded-xl p-8 text-center hover:shadow-xl dark:hover:shadow-[#00ccff]/20 transition-all group">
              <div className="bg-blue-100 dark:bg-[#00ccff]/10 w-16 h-16 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform dark:shadow-[0_0_15px_rgba(0,204,255,0.3)]">
                <Users className="w-8 h-8 text-blue-600 dark:text-[#00ccff]" />
              </div>
              <div className="text-4xl md:text-5xl font-bold mb-2 text-gray-900 dark:text-[#00ccff]">
                100+
              </div>
              <div className="text-gray-600 dark:text-gray-300 font-medium">
                Active Writers
              </div>
            </div>

            <div className="bg-card border-2 border-gray-200 dark:border-white/10 rounded-xl p-8 text-center hover:shadow-xl dark:hover:shadow-[#ff00ff]/20 transition-all group">
              <div className="bg-purple-100 dark:bg-[#ff00ff]/10 w-16 h-16 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform dark:shadow-[0_0_15px_rgba(255,0,255,0.3)]">
                <TrendingUp className="w-8 h-8 text-purple-600 dark:text-[#ff00ff]" />
              </div>
              <div className="text-4xl md:text-5xl font-bold mb-2 text-gray-900 dark:text-[#ff00ff]">
                1K+
              </div>
              <div className="text-gray-600 dark:text-gray-300 font-medium">
                Monthly Readers
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 4: POSTS (with search, filter, pagination) */}
      <section id="posts" className="py-20 bg-white dark:bg-black">
        <div className="container mx-auto px-4 pb-16">
          <div className="mb-8">
            <div className="flex flex-col gap-4 mb-6">
              <div>
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
                  Latest Articles
                </h2>
                <p className="text-gray-600 dark:text-gray-300">
                  Explore our most recent posts and insights
                </p>
              </div>

              {/* Search Bar and Category Filter */}
              <div className="flex flex-col md:flex-row gap-3">
                {/* Search Bar */}
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 dark:text-gray-500" />
                  <Input
                    type="text"
                    placeholder="Search posts, categories..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 bg-white dark:bg-black text-gray-900 dark:text-white border-gray-300 dark:border-white/20 placeholder:text-gray-400 dark:placeholder:text-gray-500"
                  />
                </div>

                {/* Category Filter Dropdown */}
                <div className="relative w-full md:w-64">
                  <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 dark:text-gray-500 pointer-events-none z-10" />
                  {categoriesLoading ? (
                    <div className="h-10 bg-gray-100 dark:bg-white/10 rounded-md animate-pulse" />
                  ) : (
                    <Select
                      value={selectedCategory}
                      onValueChange={setSelectedCategory}
                      className="pl-9 bg-white dark:bg-black text-gray-900 dark:text-white border-gray-300 dark:border-white/20">
                      <SelectItem
                        value=""
                        className="text-gray-900 dark:text-white">
                        All Categories
                      </SelectItem>
                      {categories.map((category) => (
                        <SelectItem
                          key={category.id}
                          value={category.id.toString()}
                          className="text-gray-900 dark:text-white">
                          {category.name}
                        </SelectItem>
                      ))}
                    </Select>
                  )}
                </div>
              </div>

              {/* Active Filters Display */}
              {(selectedCategory || searchQuery) && (
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    Active filters:
                  </span>
                  {searchQuery && (
                    <div className="flex items-center gap-1 bg-gray-100 dark:bg-white/10 text-gray-700 dark:text-gray-300 px-3 py-1 rounded-full text-sm">
                      <Search className="w-3 h-3" />
                      <span>"{searchQuery}"</span>
                      <button
                        onClick={() => setSearchQuery("")}
                        className="ml-1 hover:text-gray-900 dark:hover:text-white">
                        ×
                      </button>
                    </div>
                  )}
                  {selectedCategory && (
                    <div className="flex items-center gap-1 bg-emerald-100 dark:bg-[#00ff9d]/20 text-emerald-700 dark:text-[#00ff9d] px-3 py-1 rounded-full text-sm border border-emerald-200 dark:border-[#00ff9d]/30">
                      <Filter className="w-3 h-3" />
                      <span>
                        {
                          categories.find(
                            (c) => c.id === parseInt(selectedCategory)
                          )?.name
                        }
                      </span>
                      <button
                        onClick={() => setSelectedCategory("")}
                        className="ml-1 hover:text-emerald-900 dark:hover:text-[#00e68a]">
                        ×
                      </button>
                    </div>
                  )}
                  {(selectedCategory || searchQuery) && (
                    <button
                      onClick={() => {
                        setSearchQuery("");
                        setSelectedCategory("");
                      }}
                      className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white underline">
                      Clear all
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>

          {error && (
            <div className="mb-6 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-500/30 text-red-700 dark:text-red-400 p-4 rounded-lg flex items-center justify-between">
              <p>{error}</p>
              <Button
                size="sm"
                variant="outline"
                onClick={() => window.location.reload()}
                className="border-red-300 dark:border-red-500/30 text-red-700 dark:text-red-400">
                Retry
              </Button>
            </div>
          )}

          {loading ? (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {[...Array(6)].map((_, i) => (
                <Card
                  key={i}
                  className="overflow-hidden border border-gray-200 dark:border-white/20">
                  <CardHeader>
                    <Skeleton className="h-6 w-3/4 mb-2 bg-gray-200 dark:bg-white/10" />
                    <Skeleton className="h-4 w-full bg-gray-200 dark:bg-white/10" />
                  </CardHeader>
                  <CardContent>
                    <Skeleton className="h-4 w-full mb-2 bg-gray-200 dark:bg-white/10" />
                    <Skeleton className="h-4 w-2/3 bg-gray-200 dark:bg-white/10" />
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : filteredPosts.length === 0 && !error ? (
            <div className="text-center py-16 bg-card rounded-xl border border-gray-200 dark:border-white/20">
              <PenSquare className="w-16 h-16 mx-auto mb-4 text-gray-400 dark:text-gray-500" />
              <p className="text-gray-600 dark:text-gray-300 mb-4 text-lg">
                {searchQuery || selectedCategory
                  ? `No posts found matching your filters`
                  : "No posts yet. Be the first to share your story!"}
              </p>
              {!searchQuery && !selectedCategory && (
                <Link href="/auth/register">
                  <Button className="bg-emerald-600 hover:bg-emerald-700 dark:bg-[#00ff9d] dark:hover:bg-[#00e68a] text-white dark:text-black btn-hover">
                    Start Writing
                  </Button>
                </Link>
              )}
            </div>
          ) : (
            <>
              {/* Results Count */}
              <div className="mb-4 text-sm text-gray-600 dark:text-gray-400">
                Showing {indexOfFirstPost + 1}-
                {Math.min(indexOfLastPost, filteredPosts.length)} of{" "}
                {filteredPosts.length} posts
              </div>

              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {currentPosts.map((post) => (
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

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="mt-12 flex items-center justify-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="border-gray-300 dark:border-white/20 text-gray-700 dark:text-white disabled:opacity-50">
                    <ChevronLeft className="w-4 h-4 mr-1" />
                    Previous
                  </Button>

                  <div className="flex items-center gap-1">
                    {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                      const page = i + 1;
                      return (
                        <Button
                          key={page}
                          variant={page === currentPage ? "default" : "outline"}
                          size="sm"
                          onClick={() => handlePageChange(page)}
                          className={
                            page === currentPage
                              ? "bg-emerald-600 hover:bg-emerald-700 dark:bg-[#00ff9d] dark:hover:bg-[#00e68a] text-white dark:text-black"
                              : "border-gray-300 dark:border-white/20 text-gray-700 dark:text-white hover:bg-gray-100 dark:hover:bg-white/10"
                          }>
                          {page}
                        </Button>
                      );
                    })}
                  </div>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="border-gray-300 dark:border-white/20 text-gray-700 dark:text-white disabled:opacity-50">
                    Next
                    <ChevronRight className="w-4 h-4 ml-1" />
                  </Button>
                </div>
              )}
            </>
          )}
        </div>
      </section>

      {/* SECTION 5: CTA */}
      <section className="py-20 gradient-bg border-t border-gray-200 dark:border-white/10">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-gray-900 dark:text-white">
              Ready to Start Your Blogging Journey?
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-10 max-w-2xl mx-auto">
              Join our community of writers and share your unique perspective
              with the world. It's free, fast, and easy to get started.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Link href="/auth/register">
                <Button
                  size="lg"
                  className="bg-emerald-600 hover:bg-emerald-700 dark:bg-[#00ff9d] dark:hover:bg-[#00e68a] text-white dark:text-black font-medium btn-hover dark:neon-glow-strong transition-all text-lg px-10 py-7">
                  <Heart className="w-5 h-5 mr-2" />
                  Create Free Account
                </Button>
              </Link>
              <Link href="/auth/login">
                <Button
                  size="lg"
                  variant="outline"
                  className="border-gray-300 text-gray-700 hover:border-emerald-500 hover:text-emerald-600 dark:text-white dark:border-white/20 dark:hover:border-[#00ff9d]/50 dark:hover:text-[#00ff9d] transition-all btn-hover text-lg px-10 py-7">
                  Sign In
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

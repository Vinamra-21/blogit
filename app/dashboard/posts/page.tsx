"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { trpc } from "@/lib/client";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { PenSquare } from "lucide-react";
export default function PostsManagementPage() {
  const router = useRouter();
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState<number | null>(null);
  const [publishing, setPublishing] = useState<number | null>(null);
  const [unpublishing, setUnpublishing] = useState<number | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const data = await trpc.posts.getByAuthor.query();
        setPosts(data);
      } catch (error: any) {
        console.error("Failed to fetch posts:", error);
        if (error.message?.includes("UNAUTHORIZED")) {
          router.push("/auth/login");
        } else {
          setError("Failed to load posts");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, [router]);

  const handleDelete = async (postId: number) => {
    setDeleting(postId);
    try {
      await trpc.posts.delete.mutate(postId);
      setPosts(posts.filter((p) => p.id !== postId));
    } catch (error) {
      console.error("Failed to delete post:", error);
      setError("Failed to delete post");
    } finally {
      setDeleting(null);
    }
  };

  const handlePublish = async (postId: number) => {
    setPublishing(postId);
    try {
      await trpc.posts.publish.mutate(postId);
      setPosts(
        posts.map((p) => (p.id === postId ? { ...p, published: true } : p))
      );
    } catch (error: any) {
      console.error("Failed to publish post:", error);
      setError(error.message || "Failed to publish post");
    } finally {
      setPublishing(null);
    }
  };

  const handleUnpublish = async (postId: number) => {
    setUnpublishing(postId);
    try {
      await trpc.posts.unpublish.mutate(postId);
      setPosts(
        posts.map((p) => (p.id === postId ? { ...p, published: false } : p))
      );
    } catch (error: any) {
      console.error("Failed to unpublish post:", error);
      setError(error.message || "Failed to unpublish post");
    } finally {
      setUnpublishing(null);
    }
  };

  return (
    <main className="min-h-screen bg-white dark:bg-black">
      <div className="container mx-auto px-4 py-12">
        <div className="flex justify-between items-center mb-8">
          <div>
            <Link
              href="/dashboard"
              className="inline-block hover:opacity-80 transition-opacity">
              <h1 className="text-4xl font-bold mb-2 text-gray-900 dark:text-white cursor-pointer">
                My Posts
              </h1>
            </Link>
            <p className="text-gray-600 dark:text-gray-300">
              Manage all your blog posts
            </p>
          </div>
          <Link href="/dashboard/posts/new">
            <Button className="bg-emerald-600 hover:bg-emerald-700 dark:bg-[#00ff9d] dark:hover:bg-[#00e68a] text-white dark:text-black btn-hover dark:neon-glow">
              New Post
            </Button>
          </Link>
        </div>

        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-500/30 text-red-700 dark:text-red-400 p-3 rounded-md mb-4">
            {error}
          </div>
        )}

        {loading ? (
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <Skeleton
                key={i}
                className="h-20 w-full bg-gray-200 dark:bg-white/10"
              />
            ))}
          </div>
        ) : posts.length === 0 ? (
          <div className="text-center py-16 bg-white dark:bg-black border border-gray-200 dark:border-white/20 rounded-xl">
            <PenSquare className="w-16 h-16 mx-auto mb-4 text-gray-400 dark:text-gray-500" />
            <p className="text-gray-600 dark:text-gray-300 mb-4 text-lg">
              No posts yet. Create your first post!
            </p>
            <Link href="/dashboard/posts/new">
              <Button className="bg-emerald-600 hover:bg-emerald-700 dark:bg-[#00ff9d] dark:hover:bg-[#00e68a] text-white dark:text-black btn-hover">
                Create Post
              </Button>
            </Link>
          </div>
        ) : (
          <div className="border border-gray-200 dark:border-white/20 rounded-lg overflow-hidden bg-white dark:bg-black">
            <Table>
              <TableHeader>
                <TableRow className="border-b border-gray-200 dark:border-white/20 bg-gray-50 dark:bg-white/5">
                  <TableHead className="text-gray-900 dark:text-white font-semibold">
                    Title
                  </TableHead>
                  <TableHead className="text-gray-900 dark:text-white font-semibold">
                    Status
                  </TableHead>
                  <TableHead className="text-gray-900 dark:text-white font-semibold">
                    Created
                  </TableHead>
                  <TableHead className="text-right text-gray-900 dark:text-white font-semibold">
                    Actions
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {posts.map((post) => (
                  <TableRow
                    key={post.id}
                    className="border-b border-gray-200 dark:border-white/10 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors">
                    <TableCell className="font-medium text-gray-900 dark:text-white">
                      <Link
                        href={`/posts/${post.slug}`}
                        className="hover:text-emerald-600 dark:hover:text-[#00ff9d] transition-colors">
                        {post.title}
                      </Link>
                    </TableCell>
                    <TableCell>
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          post.published
                            ? "bg-emerald-100 text-emerald-700 dark:bg-[#00ff9d]/20 dark:text-[#00ff9d]"
                            : "bg-gray-100 text-gray-700 dark:bg-white/10 dark:text-gray-300"
                        }`}>
                        {post.published ? "Published" : "Draft"}
                      </span>
                    </TableCell>
                    <TableCell className="text-gray-600 dark:text-gray-400">
                      {new Date(post.createdAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="text-right space-x-2">
                      <Link href={`/dashboard/posts/${post.id}/edit`}>
                        <Button
                          size="sm"
                          variant="outline"
                          className="border-gray-300 dark:border-white/20 text-gray-700 dark:text-white hover:bg-gray-100 dark:hover:bg-white/10 hover:border-gray-400 dark:hover:border-white/30 transition-all btn-hover">
                          Edit
                        </Button>
                      </Link>
                      {!post.published ? (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handlePublish(post.id)}
                          disabled={publishing === post.id}
                          className="border-emerald-300 dark:border-[#00ff9d]/30 text-emerald-600 dark:text-[#00ff9d] hover:bg-emerald-100 dark:hover:bg-[#00ff9d]/20 hover:border-emerald-400 dark:hover:border-[#00ff9d]/50 hover:text-emerald-700 dark:hover:text-[#00e68a] transition-all btn-hover disabled:opacity-50 disabled:cursor-not-allowed">
                          {publishing === post.id ? "Publishing..." : "Publish"}
                        </Button>
                      ) : (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleUnpublish(post.id)}
                          disabled={unpublishing === post.id}
                          className="border-orange-300 dark:border-orange-500/30 text-orange-600 dark:text-orange-400 hover:bg-orange-100 dark:hover:bg-orange-500/20 hover:border-orange-400 dark:hover:border-orange-500/50 hover:text-orange-700 dark:hover:text-orange-300 transition-all btn-hover disabled:opacity-50 disabled:cursor-not-allowed">
                          {unpublishing === post.id
                            ? "Unpublishing..."
                            : "Unpublish"}
                        </Button>
                      )}

                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button
                            size="sm"
                            variant="destructive"
                            className="bg-red-600 hover:bg-red-700 dark:bg-[#ff0066] dark:hover:bg-[#ff3385] text-white transition-all btn-hover hover:shadow-lg dark:hover:shadow-[#ff0066]/30">
                            Delete
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent className="bg-white dark:bg-black border border-gray-200 dark:border-white/20">
                          <AlertDialogTitle className="text-gray-900 dark:text-white">
                            Delete Post
                          </AlertDialogTitle>
                          <AlertDialogDescription className="text-gray-600 dark:text-gray-300">
                            Are you sure you want to delete this post? This
                            action cannot be undone.
                          </AlertDialogDescription>
                          <div className="flex gap-4 justify-end">
                            <AlertDialogCancel className="border-gray-300 dark:border-white/20 text-gray-700 dark:text-white">
                              Cancel
                            </AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleDelete(post.id)}
                              disabled={deleting === post.id}
                              className="bg-red-600 text-white hover:bg-red-700 dark:bg-[#ff0066] dark:hover:bg-[#ff3385]">
                              {deleting === post.id ? "Deleting..." : "Delete"}
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
  );
}

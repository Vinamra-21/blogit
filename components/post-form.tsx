"use client";

import type React from "react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { trpc } from "@/lib/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Select, SelectItem } from "@/components/ui/select";
import { X } from "lucide-react";

interface PostFormProps {
  postId?: number;
  initialData?: any;
}

export function PostForm({ postId, initialData }: PostFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState<any[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<number[]>(
    initialData?.categoryIds || []
  );
  const [categoriesLoading, setCategoriesLoading] = useState(true);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    title: initialData?.title || "",
    slug: initialData?.slug || "",
    content: initialData?.content || "",
    excerpt: initialData?.excerpt || "",
  });

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await trpc.categories.getAll.query();
        setCategories(data);
      } catch (error) {
        console.error("Failed to fetch categories:", error);
      } finally {
        setCategoriesLoading(false);
      }
    };

    fetchCategories();
  }, []);

  // Auto-generate slug from title
  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTitle = e.target.value;
    setFormData({
      ...formData,
      title: newTitle,
      slug: generateSlug(newTitle),
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (postId) {
        await trpc.posts.update.mutate({
          id: postId,
          ...formData,
          categoryIds: selectedCategories,
        });
      } else {
        await trpc.posts.create.mutate({
          ...formData,
          categoryIds: selectedCategories,
        });
      }

      router.push("/dashboard/posts");
      router.refresh();
    } catch (error: any) {
      console.error("Failed to save post:", error);
      setError(error.message || "Failed to save post");
    } finally {
      setLoading(false);
    }
  };

  const addCategory = (categoryId: string) => {
    const id = parseInt(categoryId);
    if (!selectedCategories.includes(id)) {
      setSelectedCategories([...selectedCategories, id]);
    }
  };

  const removeCategory = (categoryId: number) => {
    setSelectedCategories(selectedCategories.filter((id) => id !== categoryId));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Card className="border-gray-200 dark:border-white/10 bg-white dark:bg-black">
        <CardHeader>
          <CardTitle className="text-gray-900 dark:text-white">
            {postId ? "Edit Post" : "Create New Post"}
          </CardTitle>
          <CardDescription className="text-gray-600 dark:text-gray-300">
            Fill in the details below to {postId ? "update" : "create"} your
            post
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {error && (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-500/30 text-red-700 dark:text-red-400 p-3 rounded-md text-sm">
              {error}
            </div>
          )}

          {/* Title */}
          <div className="space-y-2">
            <Label htmlFor="title" className="text-gray-900 dark:text-white">
              Title
            </Label>
            <Input
              id="title"
              value={formData.title}
              onChange={handleTitleChange}
              placeholder="Enter your post title"
              required
              className="bg-white dark:bg-black text-gray-900 dark:text-white border-gray-300 dark:border-white/20 placeholder:text-gray-400 dark:placeholder:text-gray-500"
            />
          </div>

          {/* Slug (auto-generated, read-only) */}
          <div className="space-y-2">
            <Label htmlFor="slug" className="text-gray-900 dark:text-white">
              Slug (auto-generated)
            </Label>
            <Input
              id="slug"
              value={formData.slug}
              readOnly
              className="bg-gray-50 dark:bg-white/5 text-gray-600 dark:text-gray-400 border-gray-300 dark:border-white/20"
            />
          </div>

          {/* Excerpt */}
          <div className="space-y-2">
            <Label htmlFor="excerpt" className="text-gray-900 dark:text-white">
              Excerpt (optional)
            </Label>
            <Textarea
              id="excerpt"
              value={formData.excerpt}
              onChange={(e) =>
                setFormData({ ...formData, excerpt: e.target.value })
              }
              placeholder="Brief summary of your post"
              rows={2}
              className="bg-white dark:bg-black text-gray-900 dark:text-white border-gray-300 dark:border-white/20 resize-none placeholder:text-gray-400 dark:placeholder:text-gray-500"
            />
          </div>

          {/* Content - Improved Textarea */}
          <div className="space-y-2">
            <Label htmlFor="content" className="text-gray-900 dark:text-white">
              Content (Markdown supported)
            </Label>
            <Textarea
              id="content"
              value={formData.content}
              onChange={(e) =>
                setFormData({ ...formData, content: e.target.value })
              }
              placeholder="Write your post content here... (Markdown is supported)"
              rows={15}
              required
              className="bg-white dark:bg-black text-gray-900 dark:text-white border-gray-300 dark:border-white/20 font-mono text-sm resize-y min-h-[300px] placeholder:text-gray-400 dark:placeholder:text-gray-500"
            />
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Tip: You can use Markdown formatting (# for headings, ** for bold,
              * for italic, etc.)
            </p>
          </div>

          {/* Categories - Dropdown Selection */}
          <div className="space-y-3">
            <Label className="text-gray-900 dark:text-white">Categories</Label>
            {categoriesLoading ? (
              <Skeleton className="h-10 w-full bg-gray-200 dark:bg-white/10" />
            ) : (
              <>
                <Select
                  onValueChange={addCategory}
                  className="bg-white dark:bg-black text-gray-900 dark:text-white border-gray-300 dark:border-white/20">
                  <SelectItem
                    value=""
                    className="text-gray-400 dark:text-gray-500">
                    Select categories...
                  </SelectItem>
                  {categories
                    .filter((cat) => !selectedCategories.includes(cat.id))
                    .map((category) => (
                      <SelectItem
                        key={category.id}
                        value={category.id.toString()}
                        className="text-gray-900 dark:text-white">
                        {category.name}
                      </SelectItem>
                    ))}
                </Select>

                {/* Selected Categories */}
                {selectedCategories.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {selectedCategories.map((catId) => {
                      const category = categories.find((c) => c.id === catId);
                      return category ? (
                        <div
                          key={catId}
                          className="flex items-center gap-1 bg-emerald-100 dark:bg-[#00ff9d]/20 text-emerald-700 dark:text-[#00ff9d] px-3 py-1 rounded-full text-sm border border-emerald-200 dark:border-[#00ff9d]/30">
                          <span>{category.name}</span>
                          <button
                            type="button"
                            onClick={() => removeCategory(catId)}
                            className="hover:text-emerald-900 dark:hover:text-[#00e68a] transition-colors">
                            <X className="w-3 h-3" />
                          </button>
                        </div>
                      ) : null;
                    })}
                  </div>
                )}
              </>
            )}
          </div>
        </CardContent>
      </Card>

      <div className="flex gap-4">
        <Button
          type="submit"
          disabled={loading}
          className="bg-emerald-600 hover:bg-emerald-700 dark:bg-[#00ff9d] dark:hover:bg-[#00e68a] text-white dark:text-black btn-hover dark:neon-glow">
          {loading ? "Saving..." : postId ? "Update Post" : "Create Post"}
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={() => router.back()}
          disabled={loading}
          className="border-gray-300 dark:border-white/20 text-gray-700 dark:text-white hover:bg-gray-50 dark:hover:bg-white/5">
          Cancel
        </Button>
      </div>
    </form>
  );
}

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
import { X, Eye, Edit2, Lock, Unlock } from "lucide-react";
import { RichTextEditor } from "./rich-text-editor";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { getWordCount, getReadingTime } from "@/lib/utils";

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

  const [showPreview, setShowPreview] = useState(false);
  const [slugLocked, setSlugLocked] = useState(true);

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
      slug: slugLocked ? generateSlug(newTitle) : formData.slug,
    });
  };

  const handleSlugChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      slug: e.target.value
        .toLowerCase()
        .replace(/[^a-z0-9-]/g, "-")
        .replace(/^-|-$/g, ""),
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

          {/* Slug with edit toggle */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="slug" className="text-gray-900 dark:text-white">
                URL Slug
              </Label>
              <button
                type="button"
                onClick={() => setSlugLocked(!slugLocked)}
                className="flex items-center gap-1 text-xs text-gray-600 dark:text-gray-400 hover:text-emerald-600 dark:hover:text-[#00ff9d] transition-colors">
                {slugLocked ? (
                  <>
                    <Lock className="w-3 h-3" />
                    Auto-generate
                  </>
                ) : (
                  <>
                    <Unlock className="w-3 h-3" />
                    Manual edit
                  </>
                )}
              </button>
            </div>
            <div className="relative">
              <Input
                id="slug"
                value={formData.slug}
                onChange={handleSlugChange}
                readOnly={slugLocked}
                placeholder="post-url-slug"
                required
                className={`${
                  slugLocked
                    ? "bg-gray-50 dark:bg-white/5 text-gray-600 dark:text-gray-400 cursor-not-allowed"
                    : "bg-white dark:bg-black text-gray-900 dark:text-white"
                } border-gray-300 dark:border-white/20 placeholder:text-gray-400 dark:placeholder:text-gray-500`}
              />
              {!slugLocked && (
                <Edit2 className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 dark:text-gray-500" />
              )}
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {slugLocked
                ? "Automatically generated from title. Click unlock to edit manually."
                : "Manual mode: Changes won't sync with title."}
            </p>
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

          {/* Rich Text Editor */}
          <div className="space-y-2">
            <Label className="text-gray-900 dark:text-white">Content</Label>
            <RichTextEditor
              content={formData.content}
              onChange={(content) => setFormData({ ...formData, content })}
              placeholder="Start writing your post..."
            />
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

        {/* Preview Button */}
        <Dialog open={showPreview} onOpenChange={setShowPreview}>
          <DialogTrigger asChild>
            <Button
              type="button"
              variant="outline"
              disabled={!formData.title || !formData.content}
              className="border-gray-300 dark:border-white/20 text-gray-700 dark:text-white hover:bg-gray-50 dark:hover:bg-white/5">
              <Eye className="w-4 h-4 mr-2" />
              Preview
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-white dark:bg-black border-gray-200 dark:border-white/10">
            <DialogHeader>
              <DialogTitle className="text-gray-900 dark:text-white">
                Post Preview
              </DialogTitle>
            </DialogHeader>

            {/* Preview Content */}
            <div className="space-y-6">
              <article className="bg-white dark:bg-black rounded-xl border border-gray-200 dark:border-white/10 overflow-hidden">
                <div className="h-2 bg-gradient-to-r from-emerald-500 to-emerald-600 dark:from-[#00ff9d] dark:to-[#00ccff]" />

                <header className="p-6 md:p-8 border-b border-gray-200 dark:border-white/10 bg-white dark:bg-black">
                  <h1 className="text-3xl md:text-4xl font-bold mb-4 leading-tight text-gray-900 dark:text-white">
                    {formData.title || "Untitled Post"}
                  </h1>

                  <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 dark:text-gray-400 mb-4">
                    <div className="flex items-center gap-2 text-emerald-600 dark:text-[#00ff9d]">
                      <Eye className="w-4 h-4" />
                      <span>{getReadingTime(formData.content)}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span>
                        {getWordCount(formData.content).toLocaleString()} words
                      </span>
                    </div>
                  </div>

                  {formData.excerpt && (
                    <p className="text-gray-600 dark:text-gray-400 italic mb-4">
                      {formData.excerpt}
                    </p>
                  )}

                  {selectedCategories.length > 0 && (
                    <div className="flex gap-2 flex-wrap">
                      {selectedCategories.map((catId) => {
                        const category = categories.find((c) => c.id === catId);
                        return category ? (
                          <span
                            key={catId}
                            className="text-xs bg-emerald-100 dark:bg-[#00ff9d]/20 text-emerald-700 dark:text-[#00ff9d] px-3 py-1 rounded-full font-medium border border-emerald-200 dark:border-[#00ff9d]/30">
                            {category.name}
                          </span>
                        ) : null;
                      })}
                    </div>
                  )}
                </header>

                <div className="p-6 md:p-8 bg-white dark:bg-black">
                  <div
                    className="prose prose-lg dark:prose-invert max-w-none 
                    prose-headings:font-bold prose-headings:text-gray-900 dark:prose-headings:text-white 
                    prose-p:text-gray-700 dark:prose-p:text-white 
                    prose-a:text-emerald-600 dark:prose-a:text-[#00ff9d] hover:prose-a:underline 
                    prose-strong:text-gray-900 dark:prose-strong:text-white 
                    prose-em:text-gray-700 dark:prose-em:text-white
                    prose-code:text-emerald-600 dark:prose-code:text-[#00ff9d] prose-code:bg-gray-100 dark:prose-code:bg-white/10
                    prose-pre:bg-gray-100 dark:prose-pre:bg-white/5 prose-pre:text-gray-900 dark:prose-pre:text-white dark:prose-pre:border dark:prose-pre:border-white/10 
                    prose-blockquote:border-emerald-500 dark:prose-blockquote:border-[#00ff9d] prose-blockquote:text-gray-600 dark:prose-blockquote:text-gray-300 
                    prose-ul:text-gray-700 dark:prose-ul:text-white 
                    prose-ol:text-gray-700 dark:prose-ol:text-white 
                    prose-li:text-gray-700 dark:prose-li:text-white
                    [&>*]:text-gray-700 dark:[&>*]:text-white"
                    dangerouslySetInnerHTML={{
                      __html:
                        formData.content ||
                        '<p class="text-gray-400 dark:text-gray-500">No content yet...</p>',
                    }}
                  />
                </div>
              </article>
            </div>
          </DialogContent>
        </Dialog>

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

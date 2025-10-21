import { create } from "zustand";
import { trpc } from "@/lib/client";

interface Post {
  id: number;
  title: string;
  slug: string;
  content: string;
  excerpt?: string | null; // Allow both undefined and null
  published: boolean;
  createdAt: Date | string; // Allow both Date and string
  categories?: any[];
  author?: any;
}

interface PostsState {
  posts: Post[];
  filteredPosts: Post[];
  loading: boolean;
  error: string | null;
  searchQuery: string;
  selectedCategory: string;
  currentPage: number;

  setPosts: (posts: Post[]) => void;
  setSearchQuery: (query: string) => void;
  setSelectedCategory: (category: string) => void;
  setCurrentPage: (page: number) => void;
  fetchPosts: () => Promise<void>;
}

export const usePostsStore = create<PostsState>()((set, get) => ({
  posts: [],
  filteredPosts: [],
  loading: true,
  error: null,
  searchQuery: "",
  selectedCategory: "",
  currentPage: 1,

  setPosts: (posts) => {
    set({ posts, filteredPosts: posts });
  },

  setSearchQuery: (searchQuery) => {
    set({ searchQuery, currentPage: 1 });
    const { posts, selectedCategory } = get();
    let filtered = posts;

    // Filter by category
    if (selectedCategory && selectedCategory !== "") {
      filtered = filtered.filter((post) =>
        post.categories?.some(
          (cat: any) => cat.id === parseInt(selectedCategory)
        )
      );
    }

    // Filter by search query
    if (searchQuery.trim() !== "") {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (post) =>
          post.title.toLowerCase().includes(query) ||
          post.content.toLowerCase().includes(query) ||
          (post.excerpt && post.excerpt.toLowerCase().includes(query)) || // Handle null
          post.categories?.some((cat: any) =>
            cat.name.toLowerCase().includes(query)
          )
      );
    }

    set({ filteredPosts: filtered });
  },

  setSelectedCategory: (selectedCategory) => {
    set({ selectedCategory, currentPage: 1 });
    const { posts, searchQuery } = get();
    let filtered = posts;

    // Filter by category
    if (selectedCategory && selectedCategory !== "") {
      filtered = filtered.filter((post) =>
        post.categories?.some(
          (cat: any) => cat.id === parseInt(selectedCategory)
        )
      );
    }

    // Filter by search query
    if (searchQuery.trim() !== "") {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (post) =>
          post.title.toLowerCase().includes(query) ||
          post.content.toLowerCase().includes(query) ||
          (post.excerpt && post.excerpt.toLowerCase().includes(query)) || // Handle null
          post.categories?.some((cat: any) =>
            cat.name.toLowerCase().includes(query)
          )
      );
    }

    set({ filteredPosts: filtered });
  },

  setCurrentPage: (currentPage) => set({ currentPage }),

  fetchPosts: async () => {
    set({ loading: true, error: null });
    try {
      const data = await trpc.posts.getAll.query();
      get().setPosts(data);
    } catch (error: any) {
      console.error("Failed to fetch posts:", error);
      set({ error: "Failed to load posts. Please refresh the page." });
    } finally {
      set({ loading: false });
    }
  },
}));

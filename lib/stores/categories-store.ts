import { create } from "zustand";
import { trpc } from "@/lib/client";

interface Category {
  id: number;
  name: string;
  slug: string;
  description?: string | null; // Allow both undefined and null
}

interface CategoriesState {
  categories: Category[];
  loading: boolean;
  fetchCategories: () => Promise<void>;
}

export const useCategoriesStore = create<CategoriesState>()((set) => ({
  categories: [],
  loading: true,

  fetchCategories: async () => {
    set({ loading: true });
    try {
      const data = await trpc.categories.getAll.query();
      set({ categories: data });
    } catch (error) {
      console.error("Failed to fetch categories:", error);
    } finally {
      set({ loading: false });
    }
  },
}));

"use client";

import type React from "react";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { LogIn } from "lucide-react";
import { useAuthStore } from "@/lib/stores/auth-store";

export default function LoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { checkAuth } = useAuthStore();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
        credentials: "include",
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Login failed");
      }

      // Update Zustand store
      await checkAuth();

      router.push("/dashboard");
      router.refresh();
    } catch (error: any) {
      setError(error.message || "An error occurred during login");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen gradient-bg flex items-center justify-center px-4 py-12">
      <Card className="w-full max-w-md shadow-2xl dark:shadow-[#00ff9d]/20 border border-gray-200 dark:border-white/10 dark:neon-border bg-white dark:bg-black">
        <div className="h-2 bg-gradient-to-r from-emerald-500 to-emerald-600 dark:from-[#00ff9d] dark:to-[#00ccff] rounded-t-xl" />
        <CardHeader className="text-center pb-4">
          <div className="mx-auto w-14 h-14 bg-emerald-600 dark:bg-[#00ff9d] rounded-xl flex items-center justify-center mb-4 dark:neon-glow-strong">
            <LogIn className="w-7 h-7 text-white dark:text-black" />
          </div>
          <CardTitle className="text-2xl text-gray-900 dark:text-white">
            Welcome Back
          </CardTitle>
          <CardDescription className="text-gray-600 dark:text-gray-300">
            Sign in to continue to BlogIt
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-0">
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="bg-red-50 dark:bg-[#ff0066]/10 border border-red-200 dark:border-[#ff0066]/30 text-red-700 dark:text-[#ff0066] p-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-900 dark:text-white">
                Email
              </label>
              <Input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="your@email.com"
                required
                className="h-11 bg-white dark:bg-black text-gray-900 dark:text-white border-gray-300 dark:border-white/20 placeholder:text-gray-400 dark:placeholder:text-gray-500 dark:focus:border-[#00ff9d] transition-colors"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-900 dark:text-white">
                Password
              </label>
              <Input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Your password"
                required
                className="h-11 bg-white dark:bg-black text-gray-900 dark:text-white border-gray-300 dark:border-white/20 placeholder:text-gray-400 dark:placeholder:text-gray-500 dark:focus:border-[#00ff9d] transition-colors"
              />
            </div>

            <Button
              type="submit"
              className="w-full h-11 bg-emerald-600 hover:bg-emerald-700 dark:bg-[#00ff9d] dark:hover:bg-[#00e68a] text-white dark:text-black text-base font-medium btn-hover dark:neon-glow transition-all"
              disabled={loading}>
              {loading ? "Signing in..." : "Sign In"}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600 dark:text-gray-300">
              Don't have an account?{" "}
              <Link
                href="/auth/register"
                className="text-emerald-600 dark:text-[#00ff9d] hover:text-emerald-700 dark:hover:text-[#00e68a] font-medium hover:underline">
                Sign up
              </Link>
            </p>
          </div>
        </CardContent>
      </Card>
    </main>
  );
}

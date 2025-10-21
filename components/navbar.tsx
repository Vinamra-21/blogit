"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { PenSquare, Menu, X } from "lucide-react";
import { ThemeToggle } from "./theme-toggle";
import { useAuthStore } from "@/lib/stores/auth-store";

export function Navbar() {
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const { user, isLoading: userLoading, logout, checkAuth } = useAuthStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  const handleLogout = async () => {
    await logout();
    router.push("/");
    router.refresh();
  };

  return (
    <nav className="border-b bg-white dark:bg-black sticky top-0 z-50 dark:border-white/10 shadow-sm dark:shadow-[0_4px_20px_rgba(0,255,157,0.1)]">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link
            href="/"
            className="flex items-center gap-2 font-bold text-2xl group">
            <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 dark:bg-[#00ff9d] text-white dark:text-black p-2 rounded-lg group-hover:scale-110 transition-all dark:neon-glow-strong">
              <PenSquare className="w-5 h-5" />
            </div>
            <span className="gradient-text dark:neon-text">BlogIt</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6">
            <Link
              href="/"
              className="px-4 py-2 text-gray-700 hover:text-emerald-600 dark:text-white dark:hover:text-[#00ff9d] transition-colors font-medium">
              Home
            </Link>

            {user && (
              <Link
                href="/dashboard"
                className="px-4 py-2 text-gray-700 hover:text-emerald-600 dark:text-white dark:hover:text-[#00ff9d] transition-colors font-medium">
                Dashboard
              </Link>
            )}

            <div className="flex items-center gap-3">
              <ThemeToggle />
              {!userLoading && (
                <>
                  {user ? (
                    <>
                      <Link href="/dashboard/posts/new">
                        <Button
                          size="sm"
                          className="bg-emerald-600 hover:bg-emerald-700 dark:bg-[#00ff9d] dark:hover:bg-[#00e68a] text-white dark:text-black font-medium btn-hover dark:neon-glow transition-all">
                          <PenSquare className="w-4 h-4 mr-2" />
                          Write
                        </Button>
                      </Link>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="outline"
                            size="sm"
                            className="font-medium border-gray-300 text-gray-700 hover:border-emerald-500 hover:text-emerald-600 dark:text-white dark:border-white/20 dark:hover:border-[#00ff9d]/50 dark:hover:text-[#00ff9d] transition-all">
                            {user.name}
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent
                          align="end"
                          className="w-48 bg-white dark:bg-black dark:border-white/10">
                          <DropdownMenuItem
                            onClick={handleLogout}
                            className="cursor-pointer text-red-600 hover:text-red-700 dark:text-[#ff0066] dark:hover:text-[#ff3385]">
                            Logout
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </>
                  ) : (
                    <>
                      <Link href="/auth/login">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="font-medium text-gray-700 hover:text-emerald-600 dark:text-white dark:hover:text-[#00ff9d] transition-colors">
                          Sign In
                        </Button>
                      </Link>
                      <Link href="/auth/register">
                        <Button
                          size="sm"
                          className="bg-emerald-600 hover:bg-emerald-700 dark:bg-[#00ff9d] dark:hover:bg-[#00e68a] text-white dark:text-black font-medium btn-hover dark:neon-glow transition-all">
                          Sign Up
                        </Button>
                      </Link>
                    </>
                  )}
                </>
              )}
            </div>
          </div>

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden text-gray-700 dark:text-white dark:hover:text-[#00ff9d]"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            {mobileMenuOpen ? (
              <X className="w-5 h-5" />
            ) : (
              <Menu className="w-5 h-5" />
            )}
          </Button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden mt-4 pb-4 space-y-3 border-t dark:border-white/10 pt-4 bg-white dark:bg-black">
            <Link
              href="/"
              className="block px-4 py-2 rounded-md text-gray-700 hover:bg-emerald-50 hover:text-emerald-700 dark:text-white dark:hover:bg-white/5 dark:hover:text-[#00ff9d] font-medium transition-colors"
              onClick={() => setMobileMenuOpen(false)}>
              Home
            </Link>
            {user && (
              <Link
                href="/dashboard"
                className="block px-4 py-2 rounded-md text-gray-700 hover:bg-emerald-50 hover:text-emerald-700 dark:text-white dark:hover:bg-white/5 dark:hover:text-[#00ff9d] font-medium transition-colors"
                onClick={() => setMobileMenuOpen(false)}>
                Dashboard
              </Link>
            )}

            <div className="flex items-center justify-between px-4 py-2">
              <span className="text-sm font-medium text-gray-700 dark:text-white">
                Theme
              </span>
              <ThemeToggle />
            </div>

            {!userLoading && (
              <div className="space-y-2 pt-4 border-t dark:border-white/10">
                {user ? (
                  <>
                    <Link
                      href="/dashboard/posts/new"
                      onClick={() => setMobileMenuOpen(false)}>
                      <Button
                        size="sm"
                        className="w-full bg-emerald-600 hover:bg-emerald-700 dark:bg-[#00ff9d] dark:hover:bg-[#00e68a] text-white dark:text-black btn-hover">
                        <PenSquare className="w-4 h-4 mr-2" />
                        Write
                      </Button>
                    </Link>
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full border-gray-300 text-gray-700 dark:text-white dark:border-white/20"
                      onClick={() => {
                        handleLogout();
                        setMobileMenuOpen(false);
                      }}>
                      Logout
                    </Button>
                  </>
                ) : (
                  <>
                    <Link
                      href="/auth/login"
                      onClick={() => setMobileMenuOpen(false)}>
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full border-gray-300 text-gray-700 dark:text-white dark:border-white/20">
                        Sign In
                      </Button>
                    </Link>
                    <Link
                      href="/auth/register"
                      onClick={() => setMobileMenuOpen(false)}>
                      <Button
                        size="sm"
                        className="w-full bg-emerald-600 hover:bg-emerald-700 dark:bg-[#00ff9d] dark:hover:bg-[#00e68a] text-white dark:text-black">
                        Sign Up
                      </Button>
                    </Link>
                  </>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}

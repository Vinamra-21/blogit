"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { trpc } from "@/lib/client";
import { Button } from "@/components/ui/button";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { PenSquare, Menu, X } from "lucide-react";
import { ThemeToggle } from "./theme-toggle";

export function Navbar() {
  const router = useRouter();
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [userLoading, setUserLoading] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await trpc.categories.getAll.query();
        setCategories(data);
      } catch (error) {
        console.error("Failed to fetch categories:", error);
      } finally {
        setLoading(false);
      }
    };

    const checkAuth = async () => {
      try {
        const response = await fetch("/api/auth/me");
        if (response.ok) {
          const userData = await response.json();
          setUser(userData);
        }
      } catch (error) {
        console.error("Failed to check auth:", error);
      } finally {
        setUserLoading(false);
      }
    };

    fetchCategories();
    checkAuth();
  }, []);

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      setUser(null);
      router.push("/");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <nav className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50 dark:border-white/10">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link
            href="/"
            className="flex items-center gap-2 font-bold text-2xl group">
            <div className="bg-black dark:bg-[#00ff9d] text-white dark:text-black p-2 rounded-lg group-hover:scale-110 transition-all neon-glow-strong">
              <PenSquare className="w-5 h-5" />
            </div>
            <span className="gradient-text neon-text">BlogIt</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6">
            <NavigationMenu>
              <NavigationMenuList>
                <NavigationMenuItem>
                  <Link href="/" legacyBehavior passHref>
                    <NavigationMenuLink className="px-4 py-2 hover:text-black dark:hover:text-[#00ff9d] transition-colors font-medium">
                      Home
                    </NavigationMenuLink>
                  </Link>
                </NavigationMenuItem>

                {!loading && categories.length > 0 && (
                  <NavigationMenuItem>
                    <NavigationMenuTrigger className="font-medium">
                      Categories
                    </NavigationMenuTrigger>
                    <NavigationMenuContent>
                      <div className="w-56 p-2 bg-white dark:bg-black border dark:border-white/10">
                        {categories.map((category) => (
                          <Link
                            key={category.id}
                            href={`/categories/${category.slug}`}
                            className="block px-4 py-3 rounded-md hover:bg-gray-100 dark:hover:bg-white/5 dark:hover:text-[#00ff9d] transition-colors">
                            <div className="font-medium">{category.name}</div>
                            {category.description && (
                              <div className="text-xs text-muted-foreground line-clamp-1">
                                {category.description}
                              </div>
                            )}
                          </Link>
                        ))}
                      </div>
                    </NavigationMenuContent>
                  </NavigationMenuItem>
                )}

                {user && (
                  <NavigationMenuItem>
                    <Link href="/dashboard" legacyBehavior passHref>
                      <NavigationMenuLink className="px-4 py-2 hover:text-black dark:hover:text-[#00ff9d] transition-colors font-medium">
                        Dashboard
                      </NavigationMenuLink>
                    </Link>
                  </NavigationMenuItem>
                )}
              </NavigationMenuList>
            </NavigationMenu>

            <div className="flex items-center gap-3">
              <ThemeToggle />
              {!userLoading && (
                <>
                  {user ? (
                    <>
                      <Link href="/dashboard/posts/new">
                        <Button
                          size="sm"
                          className="bg-black hover:bg-black/80 dark:bg-[#00ff9d] dark:hover:bg-[#00ff9d]/90 text-white dark:text-black font-medium neon-button dark:neon-glow transition-all">
                          <PenSquare className="w-4 h-4 mr-2" />
                          Write
                        </Button>
                      </Link>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="outline"
                            size="sm"
                            className="font-medium dark:border-white/20 dark:hover:border-[#00ff9d]/50 dark:hover:text-[#00ff9d]">
                            {user.name}
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent
                          align="end"
                          className="w-48 dark:bg-black dark:border-white/10">
                          <DropdownMenuItem asChild>
                            <Link
                              href="/dashboard"
                              className="cursor-pointer dark:hover:text-[#00ff9d]">
                              Dashboard
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={handleLogout}
                            className="cursor-pointer text-red-600 dark:text-[#ff0066] dark:hover:text-[#ff0066]">
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
                          className="font-medium dark:hover:text-[#00ff9d]">
                          Sign In
                        </Button>
                      </Link>
                      <Link href="/auth/register">
                        <Button
                          size="sm"
                          className="bg-black hover:bg-black/80 dark:bg-[#00ff9d] dark:hover:bg-[#00ff9d]/90 text-white dark:text-black font-medium neon-button dark:neon-glow transition-all">
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
            className="md:hidden dark:hover:text-[#00ff9d]"
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
          <div className="md:hidden mt-4 pb-4 space-y-3 border-t dark:border-white/10 pt-4">
            <Link
              href="/"
              className="block px-4 py-2 hover:bg-purple-50 dark:hover:bg-purple-900/20 rounded-md font-medium"
              onClick={() => setMobileMenuOpen(false)}>
              Home
            </Link>
            {user && (
              <Link
                href="/dashboard"
                className="block px-4 py-2 hover:bg-purple-50 dark:hover:bg-purple-900/20 rounded-md font-medium"
                onClick={() => setMobileMenuOpen(false)}>
                Dashboard
              </Link>
            )}
            {!loading && categories.length > 0 && (
              <div className="space-y-1">
                <div className="px-4 py-2 text-sm font-semibold text-muted-foreground">
                  Categories
                </div>
                {categories.map((category) => (
                  <Link
                    key={category.id}
                    href={`/categories/${category.slug}`}
                    className="block px-8 py-2 hover:bg-purple-50 dark:hover:bg-purple-900/20 rounded-md"
                    onClick={() => setMobileMenuOpen(false)}>
                    {category.name}
                  </Link>
                ))}
              </div>
            )}
            {!userLoading && (
              <div className="space-y-2 pt-4 border-t dark:border-white/10">
                {user ? (
                  <>
                    <Link
                      href="/dashboard/posts/new"
                      onClick={() => setMobileMenuOpen(false)}>
                      <Button
                        size="sm"
                        className="w-full bg-black hover:bg-black/80 dark:bg-[#00ff9d] dark:hover:bg-[#00ff9d]/90 text-white dark:text-black neon-button">
                        <PenSquare className="w-4 h-4 mr-2" />
                        Write
                      </Button>
                    </Link>
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full dark:border-white/20"
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
                        className="w-full dark:border-white/20">
                        Sign In
                      </Button>
                    </Link>
                    <Link
                      href="/auth/register"
                      onClick={() => setMobileMenuOpen(false)}>
                      <Button
                        size="sm"
                        className="w-full bg-black hover:bg-black/80 dark:bg-[#00ff9d] dark:hover:bg-[#00ff9d]/90 text-white dark:text-black">
                        Sign Up
                      </Button>
                    </Link>
                  </>
                )}
              </div>
            )}
            <div className="flex items-center justify-between px-4 py-2">
              <span className="text-sm font-medium">Theme</span>
              <ThemeToggle />
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}

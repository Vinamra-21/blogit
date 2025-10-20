"use client";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function DashboardPage() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to posts management
    router.push("/dashboard/posts");
  }, [router]);

  return null;
}

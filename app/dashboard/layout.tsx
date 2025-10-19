import type React from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-background">
      <div className="border-b bg-card">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold">Dashboard</h2>
          <Link href="/">
            <Button variant="outline" size="sm">
              Back to Blog
            </Button>
          </Link>
        </div>
      </div>
      {children}
    </div>
  )
}

import { type NextRequest, NextResponse } from "next/server"
import { clearSessionCookie } from "@/lib/session"

export async function POST(request: NextRequest) {
  try {
    await clearSessionCookie()
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("[v0] Logout error:", error)
    return NextResponse.json({ error: "Logout failed" }, { status: 500 })
  }
}

import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { enforceApiPostGuard } from "@/lib/security/api-guard"
import { applySecurityHeaders } from "@/lib/security/headers"

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname

  if (request.method === "POST" && pathname.startsWith("/api/")) {
    const blocked = enforceApiPostGuard(request, pathname)
    if (blocked) {
      applySecurityHeaders(blocked)
      return blocked
    }
  }

  const response = NextResponse.next()
  applySecurityHeaders(response)
  return response
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|images/|downloads/).*)"],
}

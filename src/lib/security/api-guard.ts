import { NextResponse } from "next/server"
import { rateLimit, getClientIp } from "@/lib/security/rate-limit"

const HONEYPOT_FIELDS = ["botcheck", "website", "_hp"] as const

export function buildAllowedOrigins(request: Request): Set<string> {
  const allowed = new Set<string>()
  const host = request.headers.get("host")

  if (host) {
    allowed.add(`https://${host}`)
    allowed.add(`http://${host}`)
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL?.trim().replace(/\/$/, "")
  if (siteUrl) allowed.add(siteUrl)

  const vercelUrl = process.env.VERCEL_URL?.trim()
  if (vercelUrl) allowed.add(`https://${vercelUrl}`)

  return allowed
}

/** Reject cross-site POSTs to our API routes (no login required). */
export function isSameOriginRequest(request: Request): boolean {
  const allowed = buildAllowedOrigins(request)
  const origin = request.headers.get("origin")
  if (origin && allowed.has(origin)) return true

  const referer = request.headers.get("referer")
  if (referer) {
    try {
      return allowed.has(new URL(referer).origin)
    } catch {
      return false
    }
  }

  return false
}

export function readHoneypotValue(
  source: Record<string, unknown> | FormData
): string {
  for (const field of HONEYPOT_FIELDS) {
    const value =
      source instanceof FormData
        ? source.get(field)
        : source[field]
    if (typeof value === "string" && value.trim()) return value.trim()
  }
  return ""
}

export function isHoneypotTripped(value: string): boolean {
  return value.length > 0
}

export function assertContentLength(request: Request, maxBytes: number): boolean {
  const raw = request.headers.get("content-length")
  if (!raw) return true
  const length = Number.parseInt(raw, 10)
  if (Number.isNaN(length)) return false
  return length <= maxBytes
}

type RouteLimit = { limit: number; windowMs: number; maxBodyBytes?: number }

export const API_ROUTE_LIMITS: Record<string, RouteLimit> = {
  "/api/contact": { limit: 12, windowMs: 15 * 60 * 1000, maxBodyBytes: 32_768 },
  "/api/application": { limit: 20, windowMs: 60 * 60 * 1000, maxBodyBytes: 512 * 1024 },
}

export function enforceApiPostGuard(
  request: Request,
  pathname: string
): NextResponse | null {
  if (request.method !== "POST") return null

  if (!isSameOriginRequest(request)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 })
  }

  const config = API_ROUTE_LIMITS[pathname]
  if (!config) return null

  if (config.maxBodyBytes && !assertContentLength(request, config.maxBodyBytes)) {
    return NextResponse.json({ error: "Request too large" }, { status: 413 })
  }

  const ip = getClientIp(request)
  const result = rateLimit(`${ip}:${pathname}`, config.limit, config.windowMs)
  if (!result.ok) {
    return NextResponse.json(
      { error: "Too many requests. Please wait a few minutes and try again." },
      {
        status: 429,
        headers: { "Retry-After": String(result.retryAfterSec) },
      }
    )
  }

  return null
}

/** Generic success shown to bots that trip the honeypot (no email sent). */
export const HONEYPOT_FAKE_SUCCESS = {
  success: true,
  message: "Thank you. We will be in touch during school hours.",
} as const

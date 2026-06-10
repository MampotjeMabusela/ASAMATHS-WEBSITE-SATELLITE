import { NextResponse } from "next/server"
import { isFormsServiceReady } from "@/lib/db/client"

/** Lets public forms check readiness without exposing API keys in the client bundle. */
export async function GET() {
  return NextResponse.json({ ready: isFormsServiceReady() })
}

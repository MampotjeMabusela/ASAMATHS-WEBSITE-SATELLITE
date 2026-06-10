import { NextResponse } from "next/server"
import { APPLICATION_PDF_FILENAME, buildApplicationPdf } from "@/lib/application-pdf"

export const runtime = "nodejs"

export async function GET() {
  try {
    const pdf = buildApplicationPdf()
    return new NextResponse(new Uint8Array(pdf), {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${APPLICATION_PDF_FILENAME}"`,
        "Cache-Control": "public, max-age=86400",
      },
    })
  } catch (err) {
    console.error("Application PDF error:", err)
    return NextResponse.json({ error: "Could not generate application PDF." }, { status: 500 })
  }
}

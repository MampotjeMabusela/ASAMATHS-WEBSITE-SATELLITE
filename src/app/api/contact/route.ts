import { NextResponse } from "next/server"
import { z } from "zod"
import {
  HONEYPOT_FAKE_SUCCESS,
  isHoneypotTripped,
  readHoneypotValue,
} from "@/lib/security/api-guard"
import { containsSuspiciousPayload } from "@/lib/security/sanitize"
import { isDatabaseConfigured } from "@/lib/db/client"
import { saveInquiry } from "@/lib/db/inquiries"
import { getInquiryInbox, isWeb3FormsConfigured, submitInquiryToWeb3Forms } from "@/lib/web3forms"
import { SCHOOL_INFO } from "@/lib/constants"

const contactSchema = z.object({
  firstName: z.string().min(2).max(80),
  lastName: z.string().min(2).max(80),
  email: z.string().email().max(254),
  phone: z.string().min(7).max(20),
  subject: z.string().min(3).max(200),
  message: z.string().min(10).max(5000),
  gradeInterested: z.string().max(40).optional(),
  website: z.string().max(500).optional(),
})

export async function POST(request: Request) {
  try {
    const dbReady = isDatabaseConfigured()
    const emailReady = isWeb3FormsConfigured()

    if (!dbReady && !emailReady) {
      return NextResponse.json(
        {
          error: `Inquiry form is not configured yet. Please email ${SCHOOL_INFO.email} directly.`,
          fallbackEmail: SCHOOL_INFO.email,
        },
        { status: 503 }
      )
    }

    const body = (await request.json()) as Record<string, unknown>
    if (isHoneypotTripped(readHoneypotValue(body))) {
      return NextResponse.json(HONEYPOT_FAKE_SUCCESS)
    }

    const data = contactSchema.parse(body)

    if (
      containsSuspiciousPayload(data.message) ||
      containsSuspiciousPayload(data.subject)
    ) {
      return NextResponse.json({ error: "Invalid characters in enquiry." }, { status: 400 })
    }

    const inbox = getInquiryInbox()
    let stored = false

    if (dbReady) {
      const saved = await saveInquiry(data)
      if (!saved.ok) {
        return NextResponse.json({ error: saved.detail }, { status: saved.status })
      }
      stored = true
    }

    if (emailReady) {
      const result = await submitInquiryToWeb3Forms(data)
      if (!result.ok && !stored) {
        return NextResponse.json(
          {
            error: `${result.detail} You can also email ${inbox}.`,
            fallbackEmail: inbox,
          },
          { status: result.status && result.status >= 400 ? result.status : 502 }
        )
      }
    }

    return NextResponse.json({
      success: true,
      message: stored
        ? `Your enquiry was saved securely. We will reply to ${data.email} during school hours.`
        : `Your inquiry was sent to ${inbox}. We will reply during school hours.`,
    })
  } catch (err) {
    console.error("Contact API error:", err)
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: "Invalid form data", details: err.issues }, { status: 400 })
    }
    return NextResponse.json(
      {
        error: `Something went wrong. Please email ${SCHOOL_INFO.email} directly.`,
        fallbackEmail: SCHOOL_INFO.email,
      },
      { status: 500 }
    )
  }
}

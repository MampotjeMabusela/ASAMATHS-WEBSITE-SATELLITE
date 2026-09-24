export const runtime = "nodejs"

import { NextResponse } from "next/server"
import {
  applicationFormSchema,
  createApplicationReference,
} from "@/lib/application-schema"
import { getInquiryInbox, isWeb3FormsConfigured } from "@/lib/web3forms"
import { submitApplicationEmail } from "@/lib/submit-application-email"
import { SCHOOL_INFO } from "@/lib/constants"

export async function POST(request: Request) {
  try {
    if (!isWeb3FormsConfigured()) {
      return NextResponse.json(
        {
          error: `Application form is not configured yet. Please email ${SCHOOL_INFO.email} directly.`,
          fallbackEmail: SCHOOL_INFO.email,
        },
        { status: 503 }
      )
    }

    const body = (await request.json()) as Record<string, unknown>
    const reference =
      String(body.applicationReference ?? "").trim() || createApplicationReference()

    const { applicationReference: _ref, ...formFields } = body
    const parsed = applicationFormSchema.safeParse(formFields)
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid application data", details: parsed.error.issues },
        { status: 400 }
      )
    }

    const inbox = getInquiryInbox()
    const result = await submitApplicationEmail(parsed.data, reference)

    if (!result.ok) {
      return NextResponse.json(
        {
          error: `${result.detail} You can also email ${inbox} with reference ${reference}.`,
          fallbackEmail: inbox,
          reference,
        },
        { status: result.status && result.status >= 400 ? result.status : 502 }
      )
    }

    return NextResponse.json({
      success: true,
      reference,
      message: `Your application was sent to ${inbox}. Reference: ${reference}`,
    })
  } catch (err) {
    console.error("Application API error:", err)
    return NextResponse.json(
      {
        error: `Something went wrong. Please email ${SCHOOL_INFO.email} directly.`,
        fallbackEmail: SCHOOL_INFO.email,
      },
      { status: 500 }
    )
  }
}

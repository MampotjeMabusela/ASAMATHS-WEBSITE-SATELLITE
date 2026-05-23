import { NextResponse } from "next/server"
import { z } from "zod"
import { getInquiryInbox, isWeb3FormsConfigured, submitInquiryToWeb3Forms } from "@/lib/web3forms"
import { SCHOOL_INFO } from "@/lib/constants"

const contactSchema = z.object({
  firstName: z.string().min(2),
  lastName: z.string().min(2),
  email: z.string().email(),
  phone: z.string().min(7),
  subject: z.string().min(3),
  message: z.string().min(10),
  gradeInterested: z.string().optional(),
})

export async function POST(request: Request) {
  try {
    if (!isWeb3FormsConfigured()) {
      console.error("Contact form: WEB3FORMS_ACCESS_KEY is not set")
      return NextResponse.json(
        {
          error: `Inquiry form is not configured yet. Please email ${SCHOOL_INFO.email} directly.`,
          fallbackEmail: SCHOOL_INFO.email,
        },
        { status: 503 }
      )
    }

    const body = await request.json()
    const data = contactSchema.parse(body)
    const inbox = getInquiryInbox()
    const result = await submitInquiryToWeb3Forms(data)

    if (!result.ok) {
      return NextResponse.json(
        {
          error: `${result.detail} You can also email ${inbox}.`,
          fallbackEmail: inbox,
        },
        { status: result.status && result.status >= 400 ? result.status : 502 }
      )
    }

    return NextResponse.json({
      success: true,
      message: `Your inquiry was sent to ${inbox}. We will reply during school hours.`,
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

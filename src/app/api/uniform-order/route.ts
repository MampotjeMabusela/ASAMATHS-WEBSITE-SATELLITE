import { NextResponse } from "next/server"
import { z } from "zod"
import { SCHOOL_INFO } from "@/lib/constants"
import {
  WEB3FORMS_SUBMIT_URL,
  getInquiryInbox,
  getWeb3FormsAccessKey,
  getWeb3FormsPublicAccessKey,
  isWeb3FormsConfigured,
} from "@/lib/web3forms"
import { formatZarFromCents } from "@/lib/uniform-shop"

const lineSchema = z.object({
  name: z.string().min(1),
  listLabel: z.string().min(1),
  size: z.string().min(1),
  quantity: z.number().int().min(1).max(99),
  unitPriceLabel: z.string().min(1),
  lineTotalCents: z.number().int().min(0),
})

const orderSchema = z.object({
  reference: z.string().min(6).max(40),
  parentName: z.string().min(2).max(120),
  parentEmail: z.string().email(),
  parentPhone: z.string().min(7).max(30),
  learnerName: z.string().min(2).max(120),
  learnerGrade: z.string().min(1).max(40),
  notes: z.string().max(2000).optional(),
  paymentMethod: z.enum(["quotation", "eft"]),
  paymentReference: z.string().max(80).optional(),
  lines: z.array(lineSchema).min(1).max(50),
  totalCents: z.number().int().min(0),
})

export async function POST(request: Request) {
  try {
    if (!isWeb3FormsConfigured()) {
      return NextResponse.json(
        {
          error: `Uniform orders are not configured yet. Please email ${SCHOOL_INFO.email} directly.`,
          fallbackEmail: SCHOOL_INFO.email,
        },
        { status: 503 }
      )
    }

    const body = await request.json()
    const parsed = orderSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid order details", details: parsed.error.issues },
        { status: 400 }
      )
    }

    const data = parsed.data
    const accessKey = getWeb3FormsAccessKey() || getWeb3FormsPublicAccessKey()
    if (!accessKey) {
      return NextResponse.json(
        { error: `Please email ${SCHOOL_INFO.email} directly.` },
        { status: 503 }
      )
    }

    const inbox = getInquiryInbox()
    const itemLines = data.lines.map(
      (line) =>
        `• ${line.name} (${line.listLabel}) — Size ${line.size} × ${line.quantity} @ ${line.unitPriceLabel} = ${formatZarFromCents(line.lineTotalCents)}`
    )

    const message = [
      "Uniform catalogue order / quotation from the website.",
      "",
      `Reference: ${data.reference}`,
      `Payment method: ${data.paymentMethod === "eft" ? "EFT / bank deposit" : "Quotation only"}`,
      data.paymentReference ? `Parent payment reference: ${data.paymentReference}` : null,
      "",
      "— PARENT —",
      `Name: ${data.parentName}`,
      `Email: ${data.parentEmail}`,
      `Phone: ${data.parentPhone}`,
      "",
      "— LEARNER —",
      `Name: ${data.learnerName}`,
      `Grade: ${data.learnerGrade}`,
      "",
      "— ITEMS —",
      ...itemLines,
      "",
      `Total: ${formatZarFromCents(data.totalCents)}`,
      data.notes?.trim() ? `\nNotes: ${data.notes.trim()}` : null,
      "",
      "If the parent paid by EFT, ask them to email proof of payment quoting this reference.",
      "Stock and sizes remain subject to office confirmation.",
    ]
      .filter(Boolean)
      .join("\n")

    const formData = new FormData()
    formData.append("access_key", accessKey)
    formData.append(
      "subject",
      `Uniform Order ${data.reference} — ${data.learnerName} (${data.learnerGrade})`
    )
    formData.append("from_name", `${SCHOOL_INFO.shortName} Website`)
    formData.append("name", data.parentName)
    formData.append("email", data.parentEmail)
    formData.append("phone", data.parentPhone)
    formData.append("replyto", data.parentEmail)
    formData.append("message", message)
    formData.append("botcheck", "")

    const res = await fetch(WEB3FORMS_SUBMIT_URL, { method: "POST", body: formData })
    const json = (await res.json().catch(() => ({}))) as {
      success?: boolean
      message?: string
    }

    if (!res.ok || !json.success) {
      return NextResponse.json(
        {
          error: `${json.message || "Could not send the order."} You can also email ${inbox} with reference ${data.reference}.`,
          fallbackEmail: inbox,
          reference: data.reference,
        },
        { status: 502 }
      )
    }

    return NextResponse.json({
      success: true,
      reference: data.reference,
      message: `Order sent to ${inbox}. Reference: ${data.reference}`,
    })
  } catch (err) {
    console.error("Uniform order API error:", err)
    return NextResponse.json(
      {
        error: `Something went wrong. Please email ${SCHOOL_INFO.email} directly.`,
        fallbackEmail: SCHOOL_INFO.email,
      },
      { status: 500 }
    )
  }
}

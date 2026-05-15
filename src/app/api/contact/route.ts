import { NextResponse } from "next/server"
import { Resend } from "resend"
import { z } from "zod"

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
    const apiKey = process.env.RESEND_API_KEY
    if (!apiKey) {
      console.error("Contact form: RESEND_API_KEY is not configured")
      return NextResponse.json(
        { error: "Email service is not configured. Please contact the school directly." },
        { status: 503 }
      )
    }

    const resend = new Resend(apiKey)
    const body = await request.json()
    const data = contactSchema.parse(body)

    const emailContent = `
New Contact Form Submission
===========================
Name: ${data.firstName} ${data.lastName}
Email: ${data.email}
Phone: ${data.phone}
Subject: ${data.subject}
Grade Interested: ${data.gradeInterested || "Not specified"}

Message:
${data.message}
    `.trim()

    const { error } = await resend.emails.send({
      from: `Asamaths Website <${process.env.CONTACT_FORM_FROM_EMAIL || "website@asamaths.co.za"}>`,
      to: [process.env.CONTACT_FORM_TO_EMAIL || "asamathsinstitueoflearning@gmail.com"],
      replyTo: data.email,
      subject: `Website Inquiry: ${data.subject} - ${data.firstName} ${data.lastName}`,
      text: emailContent,
    })

    if (error) {
      console.error("Resend error:", error)
      return NextResponse.json(
        { error: "Failed to send email. Please try again." },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true, message: "Email sent successfully" })
  } catch (err) {
    console.error("Contact form error:", err)
    if (err instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid form data", details: err.issues },
        { status: 400 }
      )
    }
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

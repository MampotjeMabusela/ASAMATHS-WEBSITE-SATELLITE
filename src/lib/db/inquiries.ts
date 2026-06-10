import { sql } from "@vercel/postgres"
import { SCHOOL_INFO } from "@/lib/constants"
import { sanitizeEmail, sanitizePhone, sanitizeText } from "@/lib/security/sanitize"
import type { ContactFormData } from "@/types"
import { isDatabaseConfigured } from "@/lib/db/client"
import { ensureDatabaseSchema } from "@/lib/db/schema"

const MAX_INQUIRIES_PER_EMAIL_PER_DAY = 12

export type SaveInquiryResult = { ok: true } | { ok: false; status: number; detail: string }

export async function saveInquiry(data: ContactFormData): Promise<SaveInquiryResult> {
  if (!isDatabaseConfigured()) {
    return { ok: false, status: 503, detail: "Database not configured" }
  }

  await ensureDatabaseSchema()

  const payload = {
    firstName: sanitizeText(data.firstName, 80),
    lastName: sanitizeText(data.lastName, 80),
    email: sanitizeEmail(data.email),
    phone: sanitizePhone(data.phone),
    subject: sanitizeText(data.subject, 200),
    message: sanitizeText(data.message, 5000),
    gradeInterested: data.gradeInterested ? sanitizeText(data.gradeInterested, 40) : "",
  }

  const payloadJson = JSON.stringify(payload)

  const countResult = await sql<{ count: string }>`
    SELECT COUNT(*)::text AS count
    FROM contact_inquiries
    WHERE email = ${payload.email}
      AND created_at >= NOW() - INTERVAL '24 hours'
  `
  const recent = Number.parseInt(countResult.rows[0]?.count ?? "0", 10)
  if (recent >= MAX_INQUIRIES_PER_EMAIL_PER_DAY) {
    return {
      ok: false,
      status: 429,
      detail: "Too many enquiries from this email today. Please call the school office.",
    }
  }

  try {
    await sql`
      INSERT INTO contact_inquiries (
        campus,
        first_name,
        last_name,
        email,
        phone,
        subject,
        message,
        grade_interested,
        payload,
        email_sent
      ) VALUES (
        ${SCHOOL_INFO.name},
        ${payload.firstName},
        ${payload.lastName},
        ${payload.email},
        ${payload.phone},
        ${payload.subject},
        ${payload.message},
        ${payload.gradeInterested || null},
        ${payloadJson},
        FALSE
      )
    `
    return { ok: true }
  } catch (err) {
    console.error("saveInquiry:", err)
    return { ok: false, status: 500, detail: "Could not save enquiry securely." }
  }
}

export async function markInquiryEmailSent(id: number): Promise<void> {
  if (!isDatabaseConfigured()) return
  await sql`UPDATE contact_inquiries SET email_sent = TRUE WHERE id = ${id}`
}

import { sql } from "@vercel/postgres"
import { SCHOOL_INFO } from "@/lib/constants"
import { sanitizeEmail, sanitizePhone, sanitizeText } from "@/lib/security/sanitize"
import type { ApplicationFormValues } from "@/types/application"
import { isDatabaseConfigured } from "@/lib/db/client"
import { ensureDatabaseSchema } from "@/lib/db/schema"

const MAX_APPLICATIONS_PER_EMAIL_PER_DAY = 8

export type SaveApplicationResult =
  | { ok: true; reference: string }
  | { ok: false; status: number; detail: string }

function normalizedPayload(data: ApplicationFormValues): ApplicationFormValues {
  return {
    ...data,
    guardian1FirstName: sanitizeText(data.guardian1FirstName, 80),
    guardian1LastName: sanitizeText(data.guardian1LastName, 80),
    guardian1Email: sanitizeEmail(data.guardian1Email),
    guardian1Phone: sanitizePhone(data.guardian1Phone),
    learnerFirstName: sanitizeText(data.learnerFirstName, 80),
    learnerLastName: sanitizeText(data.learnerLastName, 80),
    physicalAddress: sanitizeText(data.physicalAddress, 300),
    suburb: sanitizeText(data.suburb, 80),
    city: sanitizeText(data.city, 80),
    postalCode: sanitizeText(data.postalCode, 10),
    additionalNotes: sanitizeText(data.additionalNotes, 3000),
    allergies: sanitizeText(data.allergies, 2000),
    medicalConditions: sanitizeText(data.medicalConditions, 2000),
    medication: sanitizeText(data.medication, 2000),
    specialNeeds: sanitizeText(data.specialNeeds, 2000),
  }
}

/** All queries use parameter binding — never string-concatenate user input into SQL. */
export async function countApplicationsTodayForEmail(email: string): Promise<number> {
  if (!isDatabaseConfigured()) return 0

  const safeEmail = sanitizeEmail(email)
  const result = await sql<{ count: string }>`
    SELECT COUNT(*)::text AS count
    FROM applications
    WHERE guardian_email = ${safeEmail}
      AND created_at >= NOW() - INTERVAL '24 hours'
  `

  return Number.parseInt(result.rows[0]?.count ?? "0", 10)
}

export async function saveApplication(
  reference: string,
  data: ApplicationFormValues
): Promise<SaveApplicationResult> {
  if (!isDatabaseConfigured()) {
    return { ok: false, status: 503, detail: "Database not configured" }
  }

  await ensureDatabaseSchema()

  const safe = normalizedPayload(data)
  const learnerName = `${safe.learnerFirstName} ${safe.learnerLastName}`.trim()
  const payloadJson = JSON.stringify(safe)

  const recentCount = await countApplicationsTodayForEmail(safe.guardian1Email)
  if (recentCount >= MAX_APPLICATIONS_PER_EMAIL_PER_DAY) {
    return {
      ok: false,
      status: 429,
      detail: "Too many applications from this email address today. Please contact the school office.",
    }
  }

  try {
    await sql`
      INSERT INTO applications (
        reference,
        campus,
        school_year,
        learner_name,
        grade_applying,
        guardian_email,
        guardian_phone,
        payload,
        email_sent
      ) VALUES (
        ${reference},
        ${SCHOOL_INFO.name},
        ${safe.schoolYear},
        ${learnerName},
        ${safe.gradeApplyingFor},
        ${safe.guardian1Email},
        ${safe.guardian1Phone},
        ${payloadJson},
        FALSE
      )
    `
    return { ok: true, reference }
  } catch (err) {
    const code = (err as { code?: string }).code
    if (code === "23505") {
      return { ok: false, status: 409, detail: "Duplicate application reference. Please try again." }
    }
    console.error("saveApplication:", err)
    return { ok: false, status: 500, detail: "Could not save application securely." }
  }
}

export async function markApplicationEmailSent(reference: string): Promise<void> {
  if (!isDatabaseConfigured()) return
  const safeRef = sanitizeText(reference, 32)
  await sql`
    UPDATE applications
    SET email_sent = TRUE
    WHERE reference = ${safeRef}
  `
}

export async function getApplicationCount(): Promise<number> {
  if (!isDatabaseConfigured()) return 0
  const result = await sql<{ count: string }>`SELECT COUNT(*)::text AS count FROM applications`
  return Number.parseInt(result.rows[0]?.count ?? "0", 10)
}

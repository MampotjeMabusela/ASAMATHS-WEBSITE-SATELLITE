import { SCHOOL_INFO } from "@/lib/constants"
import { WEB3FORMS_SUBMIT_URL, getWeb3FormsAccessKey, getWeb3FormsPublicAccessKey } from "@/lib/web3forms"
import type { ApplicationFormValues } from "@/types/application"

function line(label: string, value: string | undefined | null): string {
  const trimmed = (value ?? "").trim()
  return `${label}: ${trimmed || "—"}`
}

/** Full application summary for the school inbox (text only — no PDF / file uploads). */
export function buildApplicationMessage(data: ApplicationFormValues, reference: string): string {
  const learnerName = `${data.learnerFirstName} ${data.learnerLastName}`.trim()
  const guardianName = `${data.guardian1FirstName} ${data.guardian1LastName}`.trim()
  const submittedAt = new Date().toLocaleString("en-ZA", {
    dateStyle: "medium",
    timeStyle: "short",
  })

  const sections: string[] = [
    "Online admission application received.",
    "",
    "— APPLICATION —",
    line("Reference", reference),
    line("School year", data.schoolYear),
    line("Submitted", submittedAt),
    line("Campus", SCHOOL_INFO.name),
    "",
    "— PRIMARY GUARDIAN —",
    line("Name", guardianName),
    line("Relationship", data.guardian1Relationship),
    line("Email", data.guardian1Email),
    line("Phone", data.guardian1Phone),
    line("SA ID", data.guardian1IdNumber),
  ]

  if (data.includeSecondGuardian) {
    sections.push(
      "",
      "— SECOND GUARDIAN —",
      line("Name", `${data.guardian2FirstName} ${data.guardian2LastName}`.trim()),
      line("Relationship", data.guardian2Relationship),
      line("Email", data.guardian2Email),
      line("Phone", data.guardian2Phone)
    )
  }

  sections.push(
    "",
    "— LEARNER —",
    line("Name", learnerName),
    line("Date of birth", data.learnerDateOfBirth),
    line("Gender", data.learnerGender),
    line("SA ID", data.learnerIdNumber),
    line("Current grade", data.currentGrade),
    line("Grade applying for", data.gradeApplyingFor),
    line("Current / previous school", data.currentSchoolName),
    line(
      "Latest school reports available",
      data.hasPreviousSchoolReports === "yes" ? "Yes" : "Not yet"
    ),
    "",
    "— ADDRESS —",
    line("Street", data.physicalAddress),
    line("Suburb", data.suburb),
    line("City", data.city),
    line("Postal code", data.postalCode),
    "",
    "— EMERGENCY CONTACT —",
    line("Name", data.emergencyContactName),
    line("Relationship", data.emergencyContactRelationship),
    line("Phone", data.emergencyContactPhone),
    "",
    "— MEDICAL & SUPPORT —",
    line("Allergies", data.allergies),
    line("Medical conditions", data.medicalConditions),
    line("Medication", data.medication),
    line("Learning / support needs", data.specialNeeds),
    "",
    "— OTHER —",
    line("How they heard about us", data.referralSource),
    line("Additional notes", data.additionalNotes),
    line("POPIA consent", data.popiaConsent ? "Yes" : "No"),
    line("Declaration accurate", data.declarationAccurate ? "Yes" : "No"),
    "",
    "Supporting documents (birth certificate, school report, transfer letter, ID copy)",
    "were not uploaded online — ask the family to bring them to the office or email",
    `them separately quoting reference ${reference}.`
  )

  return sections.join("\n")
}

/** JSON payload for Web3Forms — same pattern as the working Contact inquiry form. */
export function buildApplicationJsonPayload(
  data: ApplicationFormValues,
  accessKey: string,
  reference: string
) {
  const learnerName = `${data.learnerFirstName} ${data.learnerLastName}`.trim()

  return {
    access_key: accessKey,
    subject: `Online Application ${reference} — ${learnerName} (${data.gradeApplyingFor})`,
    from_name: `${SCHOOL_INFO.shortName} Website`,
    name: `${data.guardian1FirstName} ${data.guardian1LastName}`,
    email: data.guardian1Email,
    phone: data.guardian1Phone,
    replyto: data.guardian1Email,
    application_reference: reference,
    school_year: data.schoolYear,
    learner_name: learnerName,
    grade_applying: data.gradeApplyingFor,
    message: buildApplicationMessage(data, reference),
    botcheck: "",
  }
}

type Web3FormsResponse = {
  success?: boolean
  message?: string
  body?: { message?: string }
}

async function parseWeb3FormsResponse(res: Response) {
  const json = (await res.json().catch(() => ({}))) as Web3FormsResponse
  const apiMessage = json.message ?? json.body?.message
  if (res.ok && json.success) {
    return { ok: true as const }
  }
  return {
    ok: false as const,
    status: res.status,
    detail: apiMessage || "Could not send your application. Please try again.",
  }
}

/** Browser submit (recommended by Web3Forms — same approach as Contact). */
export async function submitApplicationToWeb3FormsClient(
  data: ApplicationFormValues,
  reference: string
): Promise<{ ok: true } | { ok: false; status?: number; detail: string }> {
  const accessKey = getWeb3FormsPublicAccessKey()
  if (!accessKey) {
    return { ok: false, detail: "Application form is not configured yet." }
  }

  try {
    const res = await fetch(WEB3FORMS_SUBMIT_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(buildApplicationJsonPayload(data, accessKey, reference)),
    })
    return parseWeb3FormsResponse(res)
  } catch (err) {
    console.error("Web3Forms application client error:", err)
    return {
      ok: false,
      detail: "Could not reach the email service. Please try again or email the school directly.",
    }
  }
}

/** Server submit via JSON text only (no PDF / attachments). */
export async function submitApplicationToWeb3Forms(
  data: ApplicationFormValues,
  reference: string
): Promise<{ ok: true } | { ok: false; status?: number; detail: string }> {
  const accessKey = getWeb3FormsAccessKey() || getWeb3FormsPublicAccessKey()
  if (!accessKey) {
    return { ok: false, detail: "Application form is not configured yet." }
  }

  try {
    const res = await fetch(WEB3FORMS_SUBMIT_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(buildApplicationJsonPayload(data, accessKey, reference)),
    })
    return parseWeb3FormsResponse(res)
  } catch (err) {
    console.error("Web3Forms application server error:", err)
    return {
      ok: false,
      detail: "Could not reach the email service. Please try again or email the school directly.",
    }
  }
}

import { SCHOOL_INFO } from "@/lib/constants"
import { WEB3FORMS_SUBMIT_URL, getWeb3FormsAccessKey, getWeb3FormsPublicAccessKey } from "@/lib/web3forms"
import type { ApplicationFiles, ApplicationFormValues } from "@/types/application"

const FILE_FIELD_MAP: Record<keyof ApplicationFiles, string> = {
  birthCertificate: "birth_certificate",
  latestReport: "latest_report",
  transferLetter: "transfer_letter",
  guardianIdCopy: "guardian_id_copy",
}

function line(label: string, value: string | undefined | null): string {
  const trimmed = (value ?? "").trim()
  return `${label}: ${trimmed || "—"}`
}

/** Full application summary for the school inbox (works on Web3Forms Free — no file uploads). */
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
    line("Latest school reports available", data.hasPreviousSchoolReports === "yes" ? "Yes" : "Not yet"),
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

export type BuildApplicationFormDataOptions = {
  /** PDF / document attachments require Web3Forms Pro. Default: false (Free plan). */
  includeAttachments?: boolean
  pdfBlob?: Blob
  pdfFilename?: string
}

export function buildApplicationFormData(
  data: ApplicationFormValues,
  files: ApplicationFiles,
  accessKey: string,
  reference: string,
  options: BuildApplicationFormDataOptions = {}
): FormData {
  const formData = new FormData()
  const learnerName = `${data.learnerFirstName} ${data.learnerLastName}`.trim()
  const { includeAttachments = false, pdfBlob, pdfFilename } = options

  formData.append("access_key", accessKey)
  formData.append("subject", `Online Application ${reference} — ${learnerName} (${data.gradeApplyingFor})`)
  formData.append("from_name", `${SCHOOL_INFO.shortName} Website`)
  formData.append("name", `${data.guardian1FirstName} ${data.guardian1LastName}`)
  formData.append("email", data.guardian1Email)
  formData.append("phone", data.guardian1Phone)
  formData.append("replyto", data.guardian1Email)
  formData.append("application_reference", reference)
  formData.append("school_year", data.schoolYear)
  formData.append("learner_name", learnerName)
  formData.append("grade_applying", data.gradeApplyingFor)
  formData.append("message", buildApplicationMessage(data, reference))
  formData.append("botcheck", "")

  // Attachments are Pro-only on Web3Forms; skip on Free so submissions succeed.
  if (includeAttachments) {
    if (pdfBlob && pdfFilename) {
      formData.append("application_form", pdfBlob, pdfFilename)
    }
    for (const [key, file] of Object.entries(files) as [keyof ApplicationFiles, File | null][]) {
      if (file) {
        formData.append(FILE_FIELD_MAP[key], file, file.name)
      }
    }
  }

  return formData
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

export async function submitApplicationToWeb3FormsClient(
  data: ApplicationFormValues,
  files: ApplicationFiles,
  reference: string
): Promise<{ ok: true } | { ok: false; status?: number; detail: string }> {
  const accessKey = getWeb3FormsPublicAccessKey()
  if (!accessKey) {
    return { ok: false, detail: "Application form is not configured yet." }
  }

  try {
    const formData = buildApplicationFormData(data, files, accessKey, reference)
    const res = await fetch(WEB3FORMS_SUBMIT_URL, {
      method: "POST",
      body: formData,
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

export async function submitApplicationToWeb3Forms(
  data: ApplicationFormValues,
  files: ApplicationFiles,
  reference: string
): Promise<{ ok: true } | { ok: false; status?: number; detail: string }> {
  const accessKey = getWeb3FormsAccessKey() || getWeb3FormsPublicAccessKey()
  if (!accessKey) {
    return { ok: false, detail: "Application form is not configured yet." }
  }

  try {
    const formData = buildApplicationFormData(data, files, accessKey, reference)
    const res = await fetch(WEB3FORMS_SUBMIT_URL, {
      method: "POST",
      body: formData,
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

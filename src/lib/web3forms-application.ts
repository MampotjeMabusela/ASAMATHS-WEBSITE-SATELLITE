import { SCHOOL_INFO } from "@/lib/constants"
import {
  buildFilledApplicationPdf,
  getFilledApplicationPdfFilename,
} from "@/lib/application-pdf"
import { WEB3FORMS_SUBMIT_URL, getWeb3FormsAccessKey, getWeb3FormsPublicAccessKey } from "@/lib/web3forms"
import type { ApplicationFiles, ApplicationFormValues } from "@/types/application"

const FILE_FIELD_MAP: Record<keyof ApplicationFiles, string> = {
  birthCertificate: "birth_certificate",
  latestReport: "latest_report",
  transferLetter: "transfer_letter",
  guardianIdCopy: "guardian_id_copy",
}

function countAttachedDocuments(files: ApplicationFiles): number {
  return Object.values(files).filter(Boolean).length
}

function buildApplicationEmailSummary(
  data: ApplicationFormValues,
  reference: string,
  files: ApplicationFiles
): string {
  const learnerName = `${data.learnerFirstName} ${data.learnerLastName}`.trim()
  const guardianName = `${data.guardian1FirstName} ${data.guardian1LastName}`.trim()
  const attachedCount = countAttachedDocuments(files)
  const campusLabel = SCHOOL_INFO.neighbourhood || SCHOOL_INFO.city

  return [
    "ONLINE ADMISSION APPLICATION",
    "===========================",
    "",
    `Campus: ${SCHOOL_INFO.name} (${campusLabel})`,
    `Reference: ${reference}`,
    `Submitted: ${new Date().toLocaleString("en-ZA", { dateStyle: "medium", timeStyle: "short" })}`,
    "",
    "SUMMARY",
    "-------",
    `Learner: ${learnerName}`,
    `Grade applying for: ${data.gradeApplyingFor} (${data.schoolYear} school year)`,
    `Primary guardian: ${guardianName}`,
    `Guardian email: ${data.guardian1Email}`,
    `Guardian phone: ${data.guardian1Phone}`,
    "",
    "ATTACHMENTS",
    "-----------",
    `• Completed application form (PDF) — ${getFilledApplicationPdfFilename(reference)}`,
    attachedCount > 0
      ? `• ${attachedCount} supporting document(s) uploaded with this submission`
      : "• No supporting documents were uploaded with this submission",
    "",
    "The attached PDF matches the official printable admission form and contains the full application details.",
    "Please open the PDF for all sections (guardian, learner, address, medical, declaration).",
    "",
    `Reply to the guardian at ${data.guardian1Email} or call ${data.guardian1Phone} during ${SCHOOL_INFO.officeHoursLong}.`,
  ].join("\n")
}

export function buildApplicationFormData(
  data: ApplicationFormValues,
  files: ApplicationFiles,
  accessKey: string,
  reference: string
): FormData {
  const formData = new FormData()
  const learnerName = `${data.learnerFirstName} ${data.learnerLastName}`.trim()
  const pdfBuffer = buildFilledApplicationPdf(data, reference, files)
  const pdfFilename = getFilledApplicationPdfFilename(reference)

  formData.append("access_key", accessKey)
  const campusLabel = SCHOOL_INFO.neighbourhood || SCHOOL_INFO.city
  formData.append(
    "subject",
    `Online Application — ${campusLabel} — ${reference} — ${learnerName} (${data.gradeApplyingFor})`
  )
  formData.append("campus", SCHOOL_INFO.name)
  formData.append("from_name", `${SCHOOL_INFO.shortName} Website`)
  formData.append("name", `${data.guardian1FirstName} ${data.guardian1LastName}`)
  formData.append("email", data.guardian1Email)
  formData.append("phone", data.guardian1Phone)
  formData.append("replyto", data.guardian1Email)
  formData.append("application_reference", reference)
  formData.append("school_year", data.schoolYear)
  formData.append("learner_name", learnerName)
  formData.append("grade_applying", data.gradeApplyingFor)
  formData.append("message", buildApplicationEmailSummary(data, reference, files))
  formData.append("botcheck", "")

  formData.append(
    "completed_application",
    new Blob([new Uint8Array(pdfBuffer)], { type: "application/pdf" }),
    pdfFilename
  )

  for (const [key, file] of Object.entries(files) as [keyof ApplicationFiles, File | null][]) {
    if (file) {
      formData.append(FILE_FIELD_MAP[key], file, file.name)
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
  const accessKey = getWeb3FormsAccessKey()
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

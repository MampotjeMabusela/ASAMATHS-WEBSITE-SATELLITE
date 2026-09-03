import { SCHOOL_INFO } from "@/lib/constants"
import { WEB3FORMS_SUBMIT_URL, getWeb3FormsAccessKey, getWeb3FormsPublicAccessKey } from "@/lib/web3forms"
import type { ApplicationFiles, ApplicationFormValues } from "@/types/application"

const FILE_FIELD_MAP: Record<keyof ApplicationFiles, string> = {
  birthCertificate: "birth_certificate",
  latestReport: "latest_report",
  transferLetter: "transfer_letter",
  guardianIdCopy: "guardian_id_copy",
}

function buildApplicationMessage(data: ApplicationFormValues, reference: string): string {
  const learnerName = `${data.learnerFirstName} ${data.learnerLastName}`.trim()
  const guardianName = `${data.guardian1FirstName} ${data.guardian1LastName}`.trim()
  const submittedAt = new Date().toLocaleString("en-ZA", {
    dateStyle: "medium",
    timeStyle: "short",
  })

  return [
    "Online admission application received.",
    "",
    `Reference: ${reference}`,
    `School year: ${data.schoolYear}`,
    `Learner: ${learnerName} (${data.gradeApplyingFor})`,
    `Primary guardian: ${guardianName}`,
    `Contact: ${data.guardian1Email} · ${data.guardian1Phone}`,
    `Submitted: ${submittedAt}`,
    "",
    "The completed application is attached as a PDF — same layout as the printable admission form.",
    "",
    "Supporting documents (birth certificate, school report, transfer letter, ID copy) can be brought to the school office or emailed separately with this reference.",
  ].join("\n")
}

export function buildApplicationFormData(
  data: ApplicationFormValues,
  files: ApplicationFiles,
  accessKey: string,
  reference: string,
  pdfBlob?: Blob,
  pdfFilename?: string
): FormData {
  const formData = new FormData()
  const learnerName = `${data.learnerFirstName} ${data.learnerLastName}`.trim()

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

  if (pdfBlob && pdfFilename) {
    formData.append("application_form", pdfBlob, pdfFilename)
  }

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

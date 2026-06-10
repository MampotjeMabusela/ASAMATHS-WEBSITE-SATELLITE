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
  const g2 = data.includeSecondGuardian
    ? [
        "",
        "--- Second guardian ---",
        `Name: ${data.guardian2FirstName} ${data.guardian2LastName}`,
        `Phone: ${data.guardian2Phone}`,
        data.guardian2Email ? `Email: ${data.guardian2Email}` : "",
        data.guardian2Relationship ? `Relationship: ${data.guardian2Relationship}` : "",
      ]
        .filter(Boolean)
        .join("\n")
    : ""

  const campusLabel = SCHOOL_INFO.neighbourhood || SCHOOL_INFO.city

  return [
    `Campus: ${SCHOOL_INFO.name} (${campusLabel})`,
    `Reference: ${reference}`,
    `School year: ${data.schoolYear}`,
    "",
    "--- Primary guardian ---",
    `Name: ${data.guardian1FirstName} ${data.guardian1LastName}`,
    `Relationship: ${data.guardian1Relationship}`,
    `Email: ${data.guardian1Email}`,
    `Phone: ${data.guardian1Phone}`,
    data.guardian1IdNumber ? `ID: ${data.guardian1IdNumber}` : "",
    g2,
    "",
    "--- Learner ---",
    `Name: ${data.learnerFirstName} ${data.learnerLastName}`,
    `Date of birth: ${data.learnerDateOfBirth}`,
    data.learnerGender ? `Gender: ${data.learnerGender}` : "",
    data.learnerIdNumber ? `Learner ID: ${data.learnerIdNumber}` : "",
    `Current grade: ${data.currentGrade}`,
    `Applying for: ${data.gradeApplyingFor}`,
    `Current / previous school: ${data.currentSchoolName}`,
    `Previous reports available: ${data.hasPreviousSchoolReports === "yes" ? "Yes" : "No"}`,
    "",
    "--- Home address ---",
    data.physicalAddress,
    `${data.suburb}, ${data.city}, ${data.postalCode}`,
    "",
    "--- Emergency contact ---",
    `${data.emergencyContactName} (${data.emergencyContactRelationship})`,
    data.emergencyContactPhone,
    "",
    "--- Medical & additional ---",
    data.allergies ? `Allergies: ${data.allergies}` : "Allergies: None stated",
    data.medicalConditions ? `Conditions: ${data.medicalConditions}` : "Conditions: None stated",
    data.medication ? `Medication: ${data.medication}` : "Medication: None stated",
    data.specialNeeds ? `Special needs: ${data.specialNeeds}` : "Special needs: None stated",
    `Heard about us: ${data.referralSource}`,
    data.additionalNotes ? `Notes: ${data.additionalNotes}` : "",
  ]
    .filter(Boolean)
    .join("\n")
}

export function buildApplicationFormData(
  data: ApplicationFormValues,
  files: ApplicationFiles,
  accessKey: string,
  reference: string
): FormData {
  const formData = new FormData()
  const learnerName = `${data.learnerFirstName} ${data.learnerLastName}`.trim()

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
  formData.append("message", buildApplicationMessage(data, reference))
  formData.append("botcheck", "")

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

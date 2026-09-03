export const runtime = "nodejs"

import { NextResponse } from "next/server"
import { applicationFormSchema, validateApplicationFiles } from "@/lib/application-schema"
import type { ApplicationDocumentKey } from "@/lib/application-constants"
import { getInquiryInbox, isWeb3FormsConfigured } from "@/lib/web3forms"
import { submitApplicationWithPdf } from "@/lib/submit-application-email"
import { createApplicationReference } from "@/lib/application-schema"
import { SCHOOL_INFO } from "@/lib/constants"
import type { ApplicationFiles, ApplicationFormValues } from "@/types/application"

const FILE_KEYS: ApplicationDocumentKey[] = [
  "birthCertificate",
  "latestReport",
  "transferLetter",
  "guardianIdCopy",
]

function parseFormBody(form: FormData): { data: ApplicationFormValues; files: ApplicationFiles } {
  const get = (key: string) => String(form.get(key) ?? "").trim()
  const getBool = (key: string) => {
    const v = form.get(key)
    return v === "true" || v === "on" || v === "1"
  }

  const files: ApplicationFiles = {
    birthCertificate: null,
    latestReport: null,
    transferLetter: null,
    guardianIdCopy: null,
  }

  for (const key of FILE_KEYS) {
    const entry = form.get(key)
    if (entry instanceof File && entry.size > 0) {
      files[key] = entry
    }
  }

  const data: ApplicationFormValues = {
    schoolYear: get("schoolYear"),
    guardian1FirstName: get("guardian1FirstName"),
    guardian1LastName: get("guardian1LastName"),
    guardian1Email: get("guardian1Email"),
    guardian1Phone: get("guardian1Phone"),
    guardian1IdNumber: get("guardian1IdNumber"),
    guardian1Relationship: get("guardian1Relationship"),
    includeSecondGuardian: getBool("includeSecondGuardian"),
    guardian2FirstName: get("guardian2FirstName"),
    guardian2LastName: get("guardian2LastName"),
    guardian2Email: get("guardian2Email"),
    guardian2Phone: get("guardian2Phone"),
    guardian2Relationship: get("guardian2Relationship"),
    learnerFirstName: get("learnerFirstName"),
    learnerLastName: get("learnerLastName"),
    learnerDateOfBirth: get("learnerDateOfBirth"),
    learnerGender: get("learnerGender"),
    learnerIdNumber: get("learnerIdNumber"),
    currentGrade: get("currentGrade"),
    currentSchoolName: get("currentSchoolName"),
    gradeApplyingFor: get("gradeApplyingFor"),
    hasPreviousSchoolReports:
      get("hasPreviousSchoolReports") === "no" ? "no" : ("yes" as const),
    physicalAddress: get("physicalAddress"),
    suburb: get("suburb"),
    city: get("city"),
    postalCode: get("postalCode"),
    emergencyContactName: get("emergencyContactName"),
    emergencyContactPhone: get("emergencyContactPhone"),
    emergencyContactRelationship: get("emergencyContactRelationship"),
    allergies: get("allergies"),
    medicalConditions: get("medicalConditions"),
    medication: get("medication"),
    specialNeeds: get("specialNeeds"),
    referralSource: get("referralSource"),
    additionalNotes: get("additionalNotes"),
    popiaConsent: getBool("popiaConsent"),
    declarationAccurate: getBool("declarationAccurate"),
  }

  return { data, files }
}

export async function POST(request: Request) {
  try {
    if (!isWeb3FormsConfigured()) {
      return NextResponse.json(
        {
          error: `Application form is not configured yet. Please email ${SCHOOL_INFO.email} directly.`,
          fallbackEmail: SCHOOL_INFO.email,
        },
        { status: 503 }
      )
    }

    const form = await request.formData()
    const { data, files } = parseFormBody(form)
    const fileValidation = validateApplicationFiles(files)
    if (Object.keys(fileValidation).length > 0) {
      return NextResponse.json(
        { error: "Invalid or missing documents", details: fileValidation },
        { status: 400 }
      )
    }

    const parsed = applicationFormSchema.safeParse(data)
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid application data", details: parsed.error.issues },
        { status: 400 }
      )
    }

    const reference =
      String(form.get("applicationReference") ?? "").trim() || createApplicationReference()
    const inbox = getInquiryInbox()
    const result = await submitApplicationWithPdf(parsed.data, files, reference)

    if (!result.ok) {
      return NextResponse.json(
        {
          error: `${result.detail} You can also email ${inbox} with reference ${reference}.`,
          fallbackEmail: inbox,
          reference,
        },
        { status: result.status && result.status >= 400 ? result.status : 502 }
      )
    }

    return NextResponse.json({
      success: true,
      reference,
      message: `Your application was sent to ${inbox}. Reference: ${reference}`,
    })
  } catch (err) {
    console.error("Application API error:", err)
    return NextResponse.json(
      {
        error: `Something went wrong. Please email ${SCHOOL_INFO.email} directly.`,
        fallbackEmail: SCHOOL_INFO.email,
      },
      { status: 500 }
    )
  }
}

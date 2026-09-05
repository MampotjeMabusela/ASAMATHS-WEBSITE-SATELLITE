import { getApplicationSchoolYears } from "@/lib/dates"

/** Grades offered for online applications (aligned with fees page). */
export const APPLICATION_GRADES = [
  "Grade R",
  "Grade 1",
  "Grade 2",
  "Grade 3",
  "Grade 4",
  "Grade 5",
  "Grade 6",
  "Grade 7",
  "Grade 8",
  "Grade 9",
] as const

export { getApplicationSchoolYears }

export const GUARDIAN_RELATIONSHIPS = [
  "Mother",
  "Father",
  "Legal guardian",
  "Grandparent",
  "Other family member",
  "Other",
] as const

export const LEARNER_GENDERS = ["Female", "Male", "Prefer not to say"] as const

export const REFERRAL_SOURCES = [
  "Family or friend",
  "Social media",
  "Drive past / local area",
  "Google search",
  "School event / open day",
  "Sister campus / referral",
  "Other",
] as const

export const ACCEPTED_FILE_TYPES = [
  "application/pdf",
  "image/jpeg",
  "image/jpg",
  "image/png",
] as const

export const ACCEPTED_FILE_EXTENSIONS = ".pdf,.jpg,.jpeg,.png"

/** Per-file limit (Web3Forms free tier is strict; keep uploads reliable). */
export const MAX_APPLICATION_FILE_BYTES = 1_024 * 1_024

export const MAX_APPLICATION_TOTAL_BYTES = 4 * 1_024 * 1_024

export type ApplicationDocumentKey =
  | "birthCertificate"
  | "latestReport"
  | "transferLetter"
  | "guardianIdCopy"

export const APPLICATION_DOCUMENTS: {
  key: ApplicationDocumentKey
  label: string
  required: boolean
  hint: string
}[] = [
  {
    key: "birthCertificate",
    label: "Learner birth certificate",
    required: true,
    hint: "Certified copy or clear scan (PDF or photo).",
  },
  {
    key: "latestReport",
    label: "Latest school report",
    required: true,
    hint: "Most recent report card from current or previous school.",
  },
  {
    key: "transferLetter",
    label: "Transfer / exit letter",
    required: false,
    hint: "If the learner is moving from another school.",
  },
  {
    key: "guardianIdCopy",
    label: "Parent or guardian ID copy",
    required: false,
    hint: "Optional — speeds up administration.",
  },
]

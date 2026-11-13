import { z } from "zod"
import {
  ACCEPTED_FILE_TYPES,
  APPLICATION_GRADES,
  getApplicationSchoolYears,
  GUARDIAN_RELATIONSHIPS,
  IDENTITY_DOCUMENT_TYPES,
  MAX_APPLICATION_FILE_BYTES,
  MAX_APPLICATION_TOTAL_BYTES,
  RESIDENCY_STATUSES,
  type ApplicationDocumentKey,
} from "@/lib/application-constants"
import { SCHOOL_INFO } from "@/lib/constants"

export type ApplicationFiles = Record<ApplicationDocumentKey, File | null>

const phone = z
  .string()
  .min(10, "Enter a valid phone number (include area code)")
  .max(20, "Phone number looks too long")

const optionalPhone = z.string().max(20).optional().or(z.literal(""))

const saIdOptional = z
  .string()
  .optional()
  .or(z.literal(""))
  .refine((v) => !v || /^\d{13}$/.test(v.replace(/\s/g, "")), {
    message: "SA ID must be 13 digits if provided",
  })

const passportOptional = z
  .string()
  .optional()
  .or(z.literal(""))
  .refine((v) => !v || /^[A-Za-z0-9]{5,20}$/.test(v.replace(/\s/g, "")), {
    message: "Passport number looks invalid (5–20 letters or digits)",
  })

const identityTypeEnum = z.enum(IDENTITY_DOCUMENT_TYPES as unknown as [string, ...string[]])
const residencyEnum = z.enum(RESIDENCY_STATUSES as unknown as [string, ...string[]])
const gradeEnum = z.enum(APPLICATION_GRADES as unknown as [string, ...string[]])

function refineIdentityFields(
  ctx: z.RefinementCtx,
  prefix: "guardian1" | "learner",
  data: {
    identityType: string
    idNumber?: string
    passportNumber?: string
    nationality?: string
    residencyStatus: string
  }
) {
  const idNumber = (data.idNumber ?? "").replace(/\s/g, "")
  const passport = (data.passportNumber ?? "").replace(/\s/g, "")
  const nationality = (data.nationality ?? "").trim()
  const isPassport = data.identityType === "Passport"
  const isForeignResident = data.residencyStatus !== "South African citizen"

  if (isPassport && !passport) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "Passport number is required when Passport is selected",
      path: [`${prefix}PassportNumber`],
    })
  }

  if (!isPassport && idNumber && !/^\d{13}$/.test(idNumber)) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "SA ID must be 13 digits if provided",
      path: [`${prefix}IdNumber`],
    })
  }

  if ((isPassport || isForeignResident) && nationality.length < 2) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "Country / nationality is required for non-SA ID or foreign residency",
      path: [`${prefix}Nationality`],
    })
  }
}

export const applicationFormSchema = z
  .object({
    schoolYear: z.string().refine((val) => getApplicationSchoolYears().includes(val), {
      message: "Select a valid school year",
    }),

    guardian1FirstName: z.string().min(2, "First name is required"),
    guardian1LastName: z.string().min(2, "Last name is required"),
    guardian1Email: z.string().email("Valid email is required"),
    guardian1Phone: phone,
    guardian1IdentityType: identityTypeEnum.default("South African ID"),
    guardian1IdNumber: saIdOptional.default(""),
    guardian1PassportNumber: passportOptional.default(""),
    guardian1Nationality: z.string().max(80).default(""),
    guardian1ResidencyStatus: residencyEnum.default("South African citizen"),
    guardian1Relationship: z.enum(GUARDIAN_RELATIONSHIPS as unknown as [string, ...string[]]),

    includeSecondGuardian: z.boolean(),
    guardian2FirstName: z.string().default(""),
    guardian2LastName: z.string().default(""),
    guardian2Email: z.union([z.literal(""), z.string().email("Valid email required")]).default(""),
    guardian2Phone: optionalPhone.default(""),
    guardian2Relationship: z.string().default(""),

    learnerFirstName: z.string().min(2, "Learner first name is required"),
    learnerLastName: z.string().min(2, "Learner last name is required"),
    learnerDateOfBirth: z
      .string()
      .min(1, "Date of birth is required")
      .refine((d) => !Number.isNaN(Date.parse(d)), "Enter a valid date"),
    learnerGender: z.string().default(""),
    learnerIdentityType: identityTypeEnum.default("South African ID"),
    learnerIdNumber: saIdOptional.default(""),
    learnerPassportNumber: passportOptional.default(""),
    learnerNationality: z.string().max(80).default(""),
    learnerResidencyStatus: residencyEnum.default("South African citizen"),
    currentGrade: gradeEnum,
    currentSchoolName: z.string().min(2, "Current or previous school name is required"),
    gradeApplyingFor: gradeEnum,
    hasPreviousSchoolReports: z.enum(["yes", "no"]),

    physicalAddress: z.string().min(5, "Street address is required"),
    suburb: z.string().min(2, "Suburb is required"),
    city: z.string().min(2, "City is required"),
    postalCode: z
      .string()
      .min(4, "Postal code is required")
      .max(10)
      .regex(/^\d{4}$/, "Use a 4-digit South African postal code"),

    emergencyContactName: z.string().min(2, "Emergency contact name is required"),
    emergencyContactPhone: phone,
    emergencyContactRelationship: z.string().min(2, "Relationship is required"),

    allergies: z.string().max(2000).default(""),
    medicalConditions: z.string().max(2000).default(""),
    medication: z.string().max(2000).default(""),
    specialNeeds: z.string().max(2000).default(""),

    referralSource: z.string().min(1, "Please tell us how you heard about us"),
    additionalNotes: z.string().max(3000).default(""),

    popiaConsent: z.boolean().refine((v) => v === true, {
      message: "You must consent to continue",
    }),
    declarationAccurate: z.boolean().refine((v) => v === true, {
      message: "Please confirm the information is accurate",
    }),
  })
  .superRefine((data, ctx) => {
    refineIdentityFields(ctx, "guardian1", {
      identityType: data.guardian1IdentityType,
      idNumber: data.guardian1IdNumber,
      passportNumber: data.guardian1PassportNumber,
      nationality: data.guardian1Nationality,
      residencyStatus: data.guardian1ResidencyStatus,
    })
    refineIdentityFields(ctx, "learner", {
      identityType: data.learnerIdentityType,
      idNumber: data.learnerIdNumber,
      passportNumber: data.learnerPassportNumber,
      nationality: data.learnerNationality,
      residencyStatus: data.learnerResidencyStatus,
    })

    if (!data.includeSecondGuardian) return
    if (!data.guardian2FirstName?.trim()) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Second guardian first name is required",
        path: ["guardian2FirstName"],
      })
    }
    if (!data.guardian2LastName?.trim()) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Second guardian last name is required",
        path: ["guardian2LastName"],
      })
    }
    if (!data.guardian2Phone?.trim()) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Second guardian phone is required",
        path: ["guardian2Phone"],
      })
    }
  })

export type ApplicationFormValues = z.infer<typeof applicationFormSchema>

export const APPLICATION_STEP_FIELDS = {
  guardian: [
    "schoolYear",
    "guardian1FirstName",
    "guardian1LastName",
    "guardian1Email",
    "guardian1Phone",
    "guardian1IdentityType",
    "guardian1IdNumber",
    "guardian1PassportNumber",
    "guardian1Nationality",
    "guardian1ResidencyStatus",
    "guardian1Relationship",
    "includeSecondGuardian",
    "guardian2FirstName",
    "guardian2LastName",
    "guardian2Email",
    "guardian2Phone",
    "guardian2Relationship",
  ],
  learner: [
    "learnerFirstName",
    "learnerLastName",
    "learnerDateOfBirth",
    "learnerGender",
    "learnerIdentityType",
    "learnerIdNumber",
    "learnerPassportNumber",
    "learnerNationality",
    "learnerResidencyStatus",
    "currentGrade",
    "currentSchoolName",
    "gradeApplyingFor",
    "hasPreviousSchoolReports",
  ],
  address: [
    "physicalAddress",
    "suburb",
    "city",
    "postalCode",
    "emergencyContactName",
    "emergencyContactPhone",
    "emergencyContactRelationship",
  ],
  medical: ["allergies", "medicalConditions", "medication", "specialNeeds", "referralSource", "additionalNotes"],
  consent: ["popiaConsent", "declarationAccurate"],
} as const satisfies Record<string, readonly (keyof ApplicationFormValues)[]>

export function getApplicationDefaultValues(): ApplicationFormValues {
  return {
    schoolYear: getApplicationSchoolYears()[0],
    guardian1FirstName: "",
    guardian1LastName: "",
    guardian1Email: "",
    guardian1Phone: "",
    guardian1IdentityType: "South African ID",
    guardian1IdNumber: "",
    guardian1PassportNumber: "",
    guardian1Nationality: "South Africa",
    guardian1ResidencyStatus: "South African citizen",
    guardian1Relationship: "Mother",
    includeSecondGuardian: false,
    guardian2FirstName: "",
    guardian2LastName: "",
    guardian2Email: "",
    guardian2Phone: "",
    guardian2Relationship: "",
    learnerFirstName: "",
    learnerLastName: "",
    learnerDateOfBirth: "",
    learnerGender: "",
    learnerIdentityType: "South African ID",
    learnerIdNumber: "",
    learnerPassportNumber: "",
    learnerNationality: "South Africa",
    learnerResidencyStatus: "South African citizen",
    currentGrade: "Grade R",
    currentSchoolName: "",
    gradeApplyingFor: "Grade R",
    hasPreviousSchoolReports: "yes",
    physicalAddress: "",
    suburb: SCHOOL_INFO.suburb,
    city: SCHOOL_INFO.city,
    postalCode: "",
    emergencyContactName: "",
    emergencyContactPhone: "",
    emergencyContactRelationship: "",
    allergies: "",
    medicalConditions: "",
    medication: "",
    specialNeeds: "",
    referralSource: "",
    additionalNotes: "",
    popiaConsent: false,
    declarationAccurate: false,
  }
}

export function createApplicationReference(): string {
  const stamp = new Date().toISOString().slice(0, 10).replace(/-/g, "")
  const suffix = Math.random().toString(36).slice(2, 8).toUpperCase()
  return `ASA-${stamp}-${suffix}`
}

export function validateApplicationFile(file: File): string | null {
  if (!ACCEPTED_FILE_TYPES.includes(file.type as (typeof ACCEPTED_FILE_TYPES)[number])) {
    const ext = file.name.split(".").pop()?.toLowerCase()
    if (!ext || !["pdf", "jpg", "jpeg", "png"].includes(ext)) {
      return "Use PDF, JPG, or PNG files only."
    }
  }
  if (file.size > MAX_APPLICATION_FILE_BYTES) {
    return `Each file must be 1 MB or smaller (${file.name}).`
  }
  return null
}

export function validateApplicationFiles(files: ApplicationFiles): Record<ApplicationDocumentKey, string> {
  const errors: Partial<Record<ApplicationDocumentKey, string>> = {}
  let total = 0

  for (const [key, file] of Object.entries(files) as [ApplicationDocumentKey, File | null][]) {
    if (!file) continue
    const err = validateApplicationFile(file)
    if (err) errors[key] = err
    total += file.size
  }

  if (total > MAX_APPLICATION_TOTAL_BYTES) {
    errors.birthCertificate =
      errors.birthCertificate ?? "Total upload size must be 4 MB or less across all files."
  }

  return errors as Record<ApplicationDocumentKey, string>
}

export function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`
  return `${(bytes / 1024).toFixed(1)} KB`
}

import { jsPDF } from "jspdf"
import fs from "fs"
import path from "path"
import { BRAND, SCHOOL_INFO } from "@/lib/constants"
import {
  APPLICATION_DOCUMENTS,
  APPLICATION_GRADES,
  APPLICATION_SCHOOL_YEARS,
} from "@/lib/application-constants"
import type { ApplicationFiles, ApplicationFormValues } from "@/types/application"

const PRIMARY = { r: 30, g: 58, b: 138 }
const INK = { r: 15, g: 23, b: 42 }
const MUTED = { r: 71, g: 85, b: 105 }
const LINE = { r: 203, g: 213, b: 225 }

const MARGIN_L = 14
const MARGIN_R = 196
const CONTENT_W = MARGIN_R - MARGIN_L

function loadLogoDataUrl(): string | null {
  try {
    const logoPath = path.join(process.cwd(), "public", "images", "logo-official.png")
    if (!fs.existsSync(logoPath)) return null
    const base64 = fs.readFileSync(logoPath).toString("base64")
    return `data:image/png;base64,${base64}`
  } catch {
    return null
  }
}

function ensureSpace(doc: jsPDF, y: number, needed: number): number {
  const pageH = doc.internal.pageSize.getHeight()
  if (y + needed > pageH - 18) {
    doc.addPage()
    drawPageFooter(doc, doc.getNumberOfPages())
    return 22
  }
  return y
}

function drawPageFooter(doc: jsPDF, pageNum: number) {
  const pageH = doc.internal.pageSize.getHeight()
  doc.setFontSize(8)
  doc.setTextColor(MUTED.r, MUTED.g, MUTED.b)
  doc.text(
    `${SCHOOL_INFO.shortName} - Admission Application | ${SCHOOL_INFO.email}`,
    MARGIN_L,
    pageH - 10
  )
  doc.text(`Page ${pageNum}`, MARGIN_R, pageH - 10, { align: "right" })
}

function sectionBar(doc: jsPDF, title: string, y: number): number {
  doc.setFillColor(PRIMARY.r, PRIMARY.g, PRIMARY.b)
  doc.rect(MARGIN_L, y, CONTENT_W, 7, "F")
  doc.setFont("helvetica", "bold")
  doc.setFontSize(10)
  doc.setTextColor(255, 255, 255)
  doc.text(title, MARGIN_L + 3, y + 5)
  doc.setTextColor(INK.r, INK.g, INK.b)
  return y + 11
}

function fieldRow(
  doc: jsPDF,
  labels: { label: string; width?: number }[],
  y: number
): number {
  const gap = 4
  let x = MARGIN_L
  const totalW = CONTENT_W
  const defaultW = totalW / labels.length - gap

  doc.setFont("helvetica", "normal")
  doc.setFontSize(8)
  doc.setTextColor(MUTED.r, MUTED.g, MUTED.b)

  for (const item of labels) {
    const w = item.width ?? defaultW
    doc.text(item.label, x, y)
    doc.setDrawColor(LINE.r, LINE.g, LINE.b)
    doc.setLineWidth(0.2)
    doc.line(x, y + 2.5, x + w, y + 2.5)
    x += w + gap
  }

  doc.setTextColor(INK.r, INK.g, INK.b)
  return y + 10
}

function fieldBlock(doc: jsPDF, label: string, y: number, height = 10): number {
  doc.setFont("helvetica", "normal")
  doc.setFontSize(8)
  doc.setTextColor(MUTED.r, MUTED.g, MUTED.b)
  doc.text(label, MARGIN_L, y)
  doc.setDrawColor(LINE.r, LINE.g, LINE.b)
  doc.rect(MARGIN_L, y + 2, CONTENT_W, height)
  return y + height + 6
}

function formatDisplayDate(isoOrDate?: string): string {
  if (!isoOrDate) return "—"
  const parsed = new Date(isoOrDate)
  if (Number.isNaN(parsed.getTime())) return isoOrDate
  return parsed.toLocaleDateString("en-ZA", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  })
}

function filledValueRow(
  doc: jsPDF,
  items: { label: string; value: string; width?: number }[],
  y: number
): number {
  const gap = 4
  let x = MARGIN_L
  const defaultW = CONTENT_W / items.length - gap
  let rowHeight = 10

  for (const item of items) {
    const w = item.width ?? defaultW
    doc.setFont("helvetica", "normal")
    doc.setFontSize(7)
    doc.setTextColor(MUTED.r, MUTED.g, MUTED.b)
    doc.text(item.label, x, y)
    doc.setFont("helvetica", "bold")
    doc.setFontSize(8)
    doc.setTextColor(INK.r, INK.g, INK.b)
    const display = item.value.trim() || "—"
    const lines = doc.splitTextToSize(display, w)
    doc.text(lines, x, y + 4)
    rowHeight = Math.max(rowHeight, 4 + lines.length * 4)
    x += w + gap
  }

  return y + rowHeight + 2
}

function filledValueBlock(doc: jsPDF, label: string, value: string, y: number): number {
  doc.setFont("helvetica", "normal")
  doc.setFontSize(7)
  doc.setTextColor(MUTED.r, MUTED.g, MUTED.b)
  doc.text(label, MARGIN_L, y)
  const display = value.trim() || "—"
  const lines = doc.splitTextToSize(display, CONTENT_W - 4)
  const boxH = Math.max(8, lines.length * 4 + 4)
  doc.setDrawColor(LINE.r, LINE.g, LINE.b)
  doc.setLineWidth(0.2)
  doc.rect(MARGIN_L, y + 2, CONTENT_W, boxH)
  doc.setFont("helvetica", "normal")
  doc.setFontSize(8)
  doc.setTextColor(INK.r, INK.g, INK.b)
  doc.text(lines, MARGIN_L + 2, y + 6)
  return y + boxH + 6
}

function checkedLine(doc: jsPDF, label: string, checked: boolean, y: number): number {
  doc.setDrawColor(LINE.r, LINE.g, LINE.b)
  doc.rect(MARGIN_L, y - 3, 3.5, 3.5)
  if (checked) {
    doc.setFont("helvetica", "bold")
    doc.setFontSize(9)
    doc.setTextColor(PRIMARY.r, PRIMARY.g, PRIMARY.b)
    doc.text("X", MARGIN_L + 0.9, y)
  }
  doc.setFontSize(8)
  doc.setTextColor(INK.r, INK.g, INK.b)
  doc.text(label, MARGIN_L + 6, y)
  return y + 5
}

function drawFilledHeader(doc: jsPDF, logoDataUrl: string | null, reference: string): number {
  let y = 14

  if (logoDataUrl) {
    doc.addImage(logoDataUrl, "PNG", MARGIN_L, y, 24, 24)
  }

  const textX = logoDataUrl ? MARGIN_L + 28 : MARGIN_L
  doc.setFont("helvetica", "bold")
  doc.setFontSize(14)
  doc.setTextColor(PRIMARY.r, PRIMARY.g, PRIMARY.b)
  doc.text(SCHOOL_INFO.name, textX, y + 6)

  doc.setFont("helvetica", "italic")
  doc.setFontSize(9)
  doc.setTextColor(MUTED.r, MUTED.g, MUTED.b)
  doc.text(BRAND.motto.replace(/·/g, "|"), textX, y + 12)

  doc.setFont("helvetica", "bold")
  doc.setFontSize(12)
  doc.setTextColor(INK.r, INK.g, INK.b)
  doc.text("Learner Admission Application Form", MARGIN_L, y + 22)

  doc.setFillColor(234, 179, 8)
  doc.roundedRect(MARGIN_R - 52, y + 2, 52, 8, 1, 1, "F")
  doc.setFont("helvetica", "bold")
  doc.setFontSize(7)
  doc.setTextColor(INK.r, INK.g, INK.b)
  doc.text("ONLINE SUBMISSION", MARGIN_R - 50, y + 7.5)

  y += 30

  doc.setFillColor(239, 246, 255)
  doc.rect(MARGIN_L, y, CONTENT_W, 40, "F")
  doc.setDrawColor(PRIMARY.r, PRIMARY.g, PRIMARY.b)
  doc.setLineWidth(0.4)
  doc.rect(MARGIN_L, y, CONTENT_W, 40)

  doc.setFont("helvetica", "bold")
  doc.setFontSize(8)
  doc.setTextColor(PRIMARY.r, PRIMARY.g, PRIMARY.b)
  doc.text("School & contact information", MARGIN_L + 3, y + 5)

  doc.setFont("helvetica", "normal")
  doc.setFontSize(7.5)
  doc.setTextColor(INK.r, INK.g, INK.b)

  const col1 = MARGIN_L + 3
  const col2 = MARGIN_L + 98
  const linesL = [
    `Address: ${SCHOOL_INFO.address}`,
    `Phone: ${SCHOOL_INFO.phone}`,
    `WhatsApp: ${SCHOOL_INFO.whatsapp}`,
  ]
  const linesR = [
    `Email: ${SCHOOL_INFO.email}`,
    `Office hours: ${SCHOOL_INFO.officeHoursLong}`,
    `Principal: ${SCHOOL_INFO.principal} (${SCHOOL_INFO.principalYear})`,
    `NatEmis: ${SCHOOL_INFO.natEmis} | ${SCHOOL_INFO.phase}`,
    `Enrolment (${SCHOOL_INFO.surveyYear}): ${SCHOOL_INFO.totalLearners} learners, ${SCHOOL_INFO.totalEducators} educators`,
  ]

  let ly = y + 10
  for (const line of linesL) {
    doc.text(line, col1, ly)
    ly += 4.5
  }
  ly = y + 10
  for (const line of linesR) {
    doc.text(line, col2, ly)
    ly += 4.5
  }

  y += 46

  doc.setFontSize(7.5)
  doc.setTextColor(MUTED.r, MUTED.g, MUTED.b)
  doc.text(
    `Submitted online via the school website. Reference: ${reference}. Date: ${formatDisplayDate(new Date().toISOString())}. ` +
      "The completed application follows below; supporting documents are attached separately to this email where provided.",
    MARGIN_L,
    y,
    { maxWidth: CONTENT_W }
  )

  return y + 12
}

function finalizePdfPages(doc: jsPDF): Buffer {
  const totalPages = doc.getNumberOfPages()
  for (let p = 1; p <= totalPages; p++) {
    doc.setPage(p)
    drawPageFooter(doc, p)
  }
  return Buffer.from(doc.output("arraybuffer"))
}

function checkboxLine(doc: jsPDF, label: string, y: number): number {
  doc.setDrawColor(LINE.r, LINE.g, LINE.b)
  doc.rect(MARGIN_L, y - 3, 3.5, 3.5)
  doc.setFontSize(8)
  doc.setTextColor(INK.r, INK.g, INK.b)
  doc.text(label, MARGIN_L + 6, y)
  return y + 5
}

function drawHeader(doc: jsPDF, logoDataUrl: string | null): number {
  let y = 14

  if (logoDataUrl) {
    doc.addImage(logoDataUrl, "PNG", MARGIN_L, y, 24, 24)
  }

  const textX = logoDataUrl ? MARGIN_L + 28 : MARGIN_L
  doc.setFont("helvetica", "bold")
  doc.setFontSize(14)
  doc.setTextColor(PRIMARY.r, PRIMARY.g, PRIMARY.b)
  doc.text(SCHOOL_INFO.name, textX, y + 6)

  doc.setFont("helvetica", "italic")
  doc.setFontSize(9)
  doc.setTextColor(MUTED.r, MUTED.g, MUTED.b)
  doc.text(BRAND.motto.replace(/·/g, "|"), textX, y + 12)

  doc.setFont("helvetica", "bold")
  doc.setFontSize(12)
  doc.setTextColor(INK.r, INK.g, INK.b)
  doc.text("Learner Admission Application Form", MARGIN_L, y + 22)

  y += 30

  doc.setFillColor(239, 246, 255)
  doc.rect(MARGIN_L, y, CONTENT_W, 40, "F")
  doc.setDrawColor(PRIMARY.r, PRIMARY.g, PRIMARY.b)
  doc.setLineWidth(0.4)
  doc.rect(MARGIN_L, y, CONTENT_W, 40)

  doc.setFont("helvetica", "bold")
  doc.setFontSize(8)
  doc.setTextColor(PRIMARY.r, PRIMARY.g, PRIMARY.b)
  doc.text("School & contact information", MARGIN_L + 3, y + 5)

  doc.setFont("helvetica", "normal")
  doc.setFontSize(7.5)
  doc.setTextColor(INK.r, INK.g, INK.b)

  const col1 = MARGIN_L + 3
  const col2 = MARGIN_L + 98
  const linesL = [
    `Address: ${SCHOOL_INFO.address}`,
    `Phone: ${SCHOOL_INFO.phone}`,
    `WhatsApp: ${SCHOOL_INFO.whatsapp}`,
  ]
  const linesR = [
    `Email: ${SCHOOL_INFO.email}`,
    `Office hours: ${SCHOOL_INFO.officeHoursLong}`,
    `Principal: ${SCHOOL_INFO.principal} (${SCHOOL_INFO.principalYear})`,
    `NatEmis: ${SCHOOL_INFO.natEmis} | ${SCHOOL_INFO.phase}`,
    `Enrolment (${SCHOOL_INFO.surveyYear}): ${SCHOOL_INFO.totalLearners} learners, ${SCHOOL_INFO.totalEducators} educators`,
  ]

  let ly = y + 10
  for (const line of linesL) {
    doc.text(line, col1, ly)
    ly += 4.5
  }
  ly = y + 10
  for (const line of linesR) {
    doc.text(line, col2, ly)
    ly += 4.5
  }

  y += 46

  doc.setFontSize(7.5)
  doc.setTextColor(MUTED.r, MUTED.g, MUTED.b)
  doc.text(
    "Complete this form in block letters. Tick where applicable. Attach certified copies where noted. " +
      "Return the completed form and documents to the school office or email " +
      SCHOOL_INFO.email +
      " (subject: Admission Application). You may also apply online at the school website.",
    MARGIN_L,
    y,
    { maxWidth: CONTENT_W }
  )

  return y + 10
}

export function getFilledApplicationPdfFilename(reference: string): string {
  return `Asamaths-Application-${reference}.pdf`
}

export function buildFilledApplicationPdf(
  data: ApplicationFormValues,
  reference: string,
  files: ApplicationFiles = {
    birthCertificate: null,
    latestReport: null,
    transferLetter: null,
    guardianIdCopy: null,
  }
): Buffer {
  const doc = new jsPDF({ unit: "mm", format: "a4" })
  const logoDataUrl = loadLogoDataUrl()
  const learnerName = `${data.learnerFirstName} ${data.learnerLastName}`.trim()
  const submittedAt = formatDisplayDate(new Date().toISOString())

  let y = drawFilledHeader(doc, logoDataUrl, reference)
  drawPageFooter(doc, 1)

  y = sectionBar(doc, "A. Application details", y)
  y = ensureSpace(doc, y, 20)
  y = filledValueRow(
    doc,
    [
      { label: "School year applying for", value: data.schoolYear, width: 55 },
      { label: "Date of application", value: submittedAt, width: 55 },
      { label: "Application reference", value: reference, width: 58 },
    ],
    y
  )

  y = sectionBar(doc, "B. Primary parent / guardian", y)
  y = ensureSpace(doc, y, 45)
  y = filledValueRow(
    doc,
    [
      { label: "First name(s)", value: data.guardian1FirstName, width: 58 },
      { label: "Surname", value: data.guardian1LastName, width: 58 },
      { label: "Relationship to learner", value: data.guardian1Relationship, width: 58 },
    ],
    y
  )
  y = filledValueRow(
    doc,
    [
      { label: "Email address", value: data.guardian1Email, width: 88 },
      { label: "Cell / telephone", value: data.guardian1Phone, width: 86 },
    ],
    y
  )
  y = filledValueRow(doc, [{ label: "SA ID number", value: data.guardian1IdNumber, width: CONTENT_W }], y)

  y = sectionBar(doc, "C. Second parent / guardian (optional)", y)
  y = ensureSpace(doc, y, 40)
  if (data.includeSecondGuardian) {
    y = filledValueRow(
      doc,
      [
        { label: "First name(s)", value: data.guardian2FirstName, width: 58 },
        { label: "Surname", value: data.guardian2LastName, width: 58 },
        { label: "Relationship", value: data.guardian2Relationship, width: 58 },
      ],
      y
    )
    y = filledValueRow(
      doc,
      [
        { label: "Email", value: data.guardian2Email, width: 88 },
        { label: "Cell / telephone", value: data.guardian2Phone, width: 86 },
      ],
      y
    )
  } else {
    doc.setFontSize(8)
    doc.setTextColor(MUTED.r, MUTED.g, MUTED.b)
    doc.text("Not provided", MARGIN_L, y)
    y += 8
  }

  y = sectionBar(doc, "D. Learner information", y)
  y = ensureSpace(doc, y, 55)
  y = filledValueRow(
    doc,
    [
      { label: "Learner first name(s)", value: data.learnerFirstName, width: 58 },
      { label: "Learner surname", value: data.learnerLastName, width: 58 },
      { label: "Gender", value: data.learnerGender, width: 58 },
    ],
    y
  )
  y = filledValueRow(
    doc,
    [
      { label: "Date of birth", value: formatDisplayDate(data.learnerDateOfBirth), width: 58 },
      { label: "Learner SA ID (if applicable)", value: data.learnerIdNumber, width: 58 },
      { label: "Current grade", value: data.currentGrade, width: 58 },
    ],
    y
  )
  y = filledValueRow(
    doc,
    [
      { label: "Grade applying for", value: data.gradeApplyingFor, width: 44 },
      { label: "Current / previous school", value: data.currentSchoolName, width: 130 },
    ],
    y
  )

  doc.setFontSize(8)
  doc.setTextColor(MUTED.r, MUTED.g, MUTED.b)
  doc.text("Latest school reports available?", MARGIN_L, y)
  y = checkedLine(doc, "Yes - attached or will provide", data.hasPreviousSchoolReports === "yes", y + 2)
  y = checkedLine(doc, "Not yet - will provide", data.hasPreviousSchoolReports === "no", y)

  y = sectionBar(doc, "E. Residential address", y)
  y = ensureSpace(doc, y, 40)
  y = filledValueBlock(doc, "Street address", data.physicalAddress, y)
  y = filledValueRow(
    doc,
    [
      { label: "Suburb", value: data.suburb, width: 58 },
      { label: "City", value: data.city, width: 58 },
      { label: "Postal code", value: data.postalCode, width: 58 },
    ],
    y
  )

  y = sectionBar(doc, "F. Emergency contact", y)
  y = ensureSpace(doc, y, 28)
  y = filledValueRow(
    doc,
    [
      { label: "Full name", value: data.emergencyContactName, width: 58 },
      { label: "Relationship", value: data.emergencyContactRelationship, width: 58 },
      { label: "Telephone", value: data.emergencyContactPhone, width: 58 },
    ],
    y
  )

  y = sectionBar(doc, "G. Medical & support (optional)", y)
  y = ensureSpace(doc, y, 45)
  y = filledValueBlock(doc, "Allergies", data.allergies, y)
  y = filledValueBlock(doc, "Medical conditions", data.medicalConditions, y)
  y = filledValueBlock(doc, "Medication required at school", data.medication, y)
  y = filledValueBlock(doc, "Learning / support needs", data.specialNeeds, y)

  y = sectionBar(doc, "H. Supporting documents", y)
  y = ensureSpace(doc, y, 35)
  doc.setFontSize(8)
  for (const docInfo of APPLICATION_DOCUMENTS) {
    const attached = Boolean(files[docInfo.key])
    y = checkedLine(
      doc,
      `${docInfo.label}${attached ? " — attached to email" : docInfo.required ? " — not attached" : " — not provided"}`,
      attached,
      y
    )
  }

  y = sectionBar(doc, "I. Additional information", y)
  y = ensureSpace(doc, y, 25)
  y = filledValueRow(
    doc,
    [{ label: "How did you hear about our school?", value: data.referralSource, width: CONTENT_W }],
    y
  )
  y = filledValueBlock(doc, "Notes for the admissions office", data.additionalNotes, y)

  y = sectionBar(doc, "J. Declaration & consent", y)
  y = ensureSpace(doc, y, 45)
  doc.setFontSize(8)
  doc.setTextColor(INK.r, INK.g, INK.b)
  const decl =
    `I declare that the information provided is true and complete. I consent to ${SCHOOL_INFO.shortName} ` +
    `processing personal information in this application for enrolment purposes under POPIA. ` +
    `This application was submitted online with electronic consent on ${submittedAt}.`
  doc.text(decl, MARGIN_L, y, { maxWidth: CONTENT_W })
  y += 16
  y = filledValueRow(
    doc,
    [
      {
        label: "Parent / guardian (electronic submission)",
        value: `${data.guardian1FirstName} ${data.guardian1LastName}`,
        width: 88,
      },
      { label: "Learner", value: learnerName, width: 86 },
    ],
    y
  )

  return finalizePdfPages(doc)
}

export function buildApplicationPdf(): Buffer {
  const doc = new jsPDF({ unit: "mm", format: "a4" })
  const logoDataUrl = loadLogoDataUrl()

  let y = drawHeader(doc, logoDataUrl)
  drawPageFooter(doc, 1)

  y = sectionBar(doc, "A. Application details", y)
  y = ensureSpace(doc, y, 20)
  y = fieldRow(
    doc,
    [
      { label: "School year applying for", width: 55 },
      { label: "Date of application (DD / MM / YYYY)", width: 55 },
      { label: "Application reference (office use)", width: 58 },
    ],
    y
  )
  doc.setFontSize(7)
  doc.setTextColor(MUTED.r, MUTED.g, MUTED.b)
  doc.text(`School years: ${APPLICATION_SCHOOL_YEARS.join("  |  ")}`, MARGIN_L, y)
  y += 8

  y = sectionBar(doc, "B. Primary parent / guardian", y)
  y = ensureSpace(doc, y, 45)
  y = fieldRow(
    doc,
    [
      { label: "First name(s)", width: 58 },
      { label: "Surname", width: 58 },
      { label: "Relationship to learner", width: 58 },
    ],
    y
  )
  y = fieldRow(
    doc,
    [
      { label: "Email address", width: 88 },
      { label: "Cell / telephone", width: 86 },
    ],
    y
  )
  y = fieldRow(doc, [{ label: "SA ID number (13 digits)", width: CONTENT_W }], y)

  y = sectionBar(doc, "C. Second parent / guardian (optional)", y)
  y = ensureSpace(doc, y, 40)
  y = fieldRow(
    doc,
    [
      { label: "First name(s)", width: 58 },
      { label: "Surname", width: 58 },
      { label: "Relationship", width: 58 },
    ],
    y
  )
  y = fieldRow(
    doc,
    [
      { label: "Email", width: 88 },
      { label: "Cell / telephone", width: 86 },
    ],
    y
  )

  y = sectionBar(doc, "D. Learner information", y)
  y = ensureSpace(doc, y, 55)
  y = fieldRow(
    doc,
    [
      { label: "Learner first name(s)", width: 58 },
      { label: "Learner surname", width: 58 },
      { label: "Gender", width: 58 },
    ],
    y
  )
  y = fieldRow(
    doc,
    [
      { label: "Date of birth (DD / MM / YYYY)", width: 58 },
      { label: "Learner SA ID (if applicable)", width: 58 },
      { label: "Home language", width: 58 },
    ],
    y
  )
  y = fieldRow(
    doc,
    [
      { label: "Current grade", width: 44 },
      { label: "Grade applying for", width: 44 },
      { label: "Current / previous school", width: 86 },
    ],
    y
  )

  doc.setFontSize(7.5)
  doc.setTextColor(MUTED.r, MUTED.g, MUTED.b)
  doc.text("Grade applying for (tick one):", MARGIN_L, y)
  y += 5
  let gx = MARGIN_L
  for (const grade of APPLICATION_GRADES) {
    if (gx > MARGIN_R - 22) {
      gx = MARGIN_L
      y += 5
    }
    doc.setDrawColor(LINE.r, LINE.g, LINE.b)
    doc.rect(gx, y - 3, 3, 3)
    doc.setFontSize(7)
    doc.setTextColor(INK.r, INK.g, INK.b)
    doc.text(grade, gx + 5, y)
    gx += grade.length > 6 ? 28 : 22
  }
  y += 10

  y = fieldRow(
    doc,
    [{ label: "Previous school address (if applicable)", width: CONTENT_W }],
    y
  )
  y = ensureSpace(doc, y, 12)
  doc.setFontSize(8)
  doc.text("Latest school reports available?", MARGIN_L, y)
  y = checkboxLine(doc, "Yes - attached", y + 2)
  y = checkboxLine(doc, "Not yet - will provide", y)

  y = sectionBar(doc, "E. Residential address", y)
  y = ensureSpace(doc, y, 40)
  y = fieldBlock(doc, "Street address", y, 8)
  y = fieldRow(
    doc,
    [
      { label: "Suburb", width: 58 },
      { label: "City", width: 58 },
      { label: "Postal code", width: 58 },
    ],
    y
  )

  y = sectionBar(doc, "F. Emergency contact", y)
  y = ensureSpace(doc, y, 28)
  y = fieldRow(
    doc,
    [
      { label: "Full name", width: 58 },
      { label: "Relationship", width: 58 },
      { label: "Telephone", width: 58 },
    ],
    y
  )

  y = sectionBar(doc, "G. Medical & support (optional)", y)
  y = ensureSpace(doc, y, 45)
  y = fieldBlock(doc, "Allergies", y, 7)
  y = fieldBlock(doc, "Medical conditions", y, 7)
  y = fieldBlock(doc, "Medication required at school", y, 7)
  y = fieldBlock(doc, "Learning / support needs", y, 7)

  y = sectionBar(doc, "H. Supporting documents (attach copies)", y)
  y = ensureSpace(doc, y, 35)
  const docs = [
    "☐ Learner birth certificate (certified copy)",
    "☐ Latest school report card",
    "☐ Transfer / exit letter from previous school (if applicable)",
    "☐ Parent / guardian ID copy",
    "☐ Immunisation / clinic card (if requested by office)",
  ]
  doc.setFontSize(8)
  for (const line of docs) {
    y = checkboxLine(doc, line.replace("☐ ", ""), y)
  }

  y = sectionBar(doc, "I. Additional information", y)
  y = ensureSpace(doc, y, 25)
  y = fieldRow(doc, [{ label: "How did you hear about our school?", width: CONTENT_W }], y)
  y = fieldBlock(doc, "Notes for the admissions office", y, 12)

  y = sectionBar(doc, "J. Declaration & consent", y)
  y = ensureSpace(doc, y, 45)
  doc.setFontSize(8)
  doc.setTextColor(INK.r, INK.g, INK.b)
  const decl =
    `I declare that the information provided is true and complete. I consent to ${SCHOOL_INFO.shortName} ` +
    `processing personal information in this application for enrolment purposes under the Protection of Personal ` +
    `Information Act (POPIA). I understand that placement is subject to interview, assessment, and availability.`
  doc.text(decl, MARGIN_L, y, { maxWidth: CONTENT_W })
  y += 18

  y = fieldRow(
    doc,
    [
      { label: "Parent / guardian signature", width: 88 },
      { label: "Date (DD / MM / YYYY)", width: 86 },
    ],
    y
  )

  y = sectionBar(doc, "For office use only", y)
  y = ensureSpace(doc, y, 28)
  y = fieldRow(
    doc,
    [
      { label: "Received by", width: 58 },
      { label: "Date received", width: 58 },
      { label: "Interview date", width: 58 },
    ],
    y
  )
  y = fieldRow(
    doc,
    [
      { label: "Placement grade confirmed", width: 88 },
      { label: "Outcome (Accepted / Waiting list / Declined)", width: 86 },
    ],
    y
  )

  return finalizePdfPages(doc)
}

export const APPLICATION_PDF_FILENAME = "Asamaths-Admission-Application-Form.pdf"

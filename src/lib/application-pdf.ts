import { jsPDF } from "jspdf"
import fs from "fs"
import path from "path"
import { BRAND, SCHOOL_INFO } from "@/lib/constants"
import { APPLICATION_GRADES, APPLICATION_SCHOOL_YEARS } from "@/lib/application-constants"
import type { ApplicationFiles, ApplicationFormValues } from "@/lib/application-schema"

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
    `${SCHOOL_INFO.shortName} — Admission Application · ${SCHOOL_INFO.email}`,
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

function checkboxLine(doc: jsPDF, label: string, y: number): number {
  doc.setDrawColor(LINE.r, LINE.g, LINE.b)
  doc.rect(MARGIN_L, y - 3, 3.5, 3.5)
  doc.setFontSize(8)
  doc.setTextColor(INK.r, INK.g, INK.b)
  doc.text(label, MARGIN_L + 6, y)
  return y + 5
}

function formatDisplayDate(value?: string | Date): string {
  const d = value instanceof Date ? value : value ? new Date(value) : new Date()
  if (Number.isNaN(d.getTime())) return ""
  const dd = String(d.getDate()).padStart(2, "0")
  const mm = String(d.getMonth() + 1).padStart(2, "0")
  return `${dd} / ${mm} / ${d.getFullYear()}`
}

function fieldRowFilled(
  doc: jsPDF,
  fields: { label: string; value: string; width?: number }[],
  y: number
): number {
  const gap = 4
  let x = MARGIN_L
  const defaultW = CONTENT_W / fields.length - gap
  let rowBottom = y + 10

  doc.setFont("helvetica", "normal")
  doc.setFontSize(8)
  doc.setTextColor(MUTED.r, MUTED.g, MUTED.b)

  for (const field of fields) {
    const w = field.width ?? defaultW
    doc.text(field.label, x, y)
    doc.setDrawColor(LINE.r, LINE.g, LINE.b)
    doc.line(x, y + 2.5, x + w, y + 2.5)

    if (field.value.trim()) {
      doc.setFont("helvetica", "bold")
      doc.setFontSize(9)
      doc.setTextColor(INK.r, INK.g, INK.b)
      const lines = doc.splitTextToSize(field.value.trim(), w - 1) as string[]
      doc.text(lines, x + 0.5, y + 6.5)
      rowBottom = Math.max(rowBottom, y + 6.5 + (lines.length - 1) * 4)
      doc.setFont("helvetica", "normal")
      doc.setFontSize(8)
      doc.setTextColor(MUTED.r, MUTED.g, MUTED.b)
    }

    x += w + gap
  }

  return rowBottom
}

function fieldBlockFilled(doc: jsPDF, label: string, value: string, y: number, height = 10): number {
  doc.setFont("helvetica", "normal")
  doc.setFontSize(8)
  doc.setTextColor(MUTED.r, MUTED.g, MUTED.b)
  doc.text(label, MARGIN_L, y)
  doc.setDrawColor(LINE.r, LINE.g, LINE.b)
  doc.rect(MARGIN_L, y + 2, CONTENT_W, height)

  if (value.trim()) {
    doc.setFontSize(9)
    doc.setTextColor(INK.r, INK.g, INK.b)
    const lines = doc.splitTextToSize(value.trim(), CONTENT_W - 4) as string[]
    doc.text(lines, MARGIN_L + 2, y + 6)
  }

  return y + height + 6
}

function checkboxLineFilled(doc: jsPDF, label: string, checked: boolean, y: number): number {
  doc.setDrawColor(LINE.r, LINE.g, LINE.b)
  doc.rect(MARGIN_L, y - 3, 3.5, 3.5)
  if (checked) {
    doc.setFont("helvetica", "bold")
    doc.setFontSize(10)
    doc.setTextColor(INK.r, INK.g, INK.b)
    doc.text("✓", MARGIN_L + 0.6, y)
  }
  doc.setFont("helvetica", "normal")
  doc.setFontSize(8)
  doc.setTextColor(INK.r, INK.g, INK.b)
  doc.text(label, MARGIN_L + 6, y)
  return y + 5
}

function drawGradeChoices(doc: jsPDF, selectedGrade: string, y: number): number {
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
    if (grade === selectedGrade) {
      doc.setFont("helvetica", "bold")
      doc.setFontSize(8)
      doc.setTextColor(INK.r, INK.g, INK.b)
      doc.text("✓", gx + 0.5, y)
    }
    doc.setFont("helvetica", "normal")
    doc.setFontSize(7)
    doc.setTextColor(INK.r, INK.g, INK.b)
    doc.text(grade, gx + 5, y)
    gx += grade.length > 6 ? 28 : 22
  }

  return y + 10
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
  doc.text(BRAND.motto, textX, y + 12)

  doc.setFont("helvetica", "bold")
  doc.setFontSize(12)
  doc.setTextColor(INK.r, INK.g, INK.b)
  doc.text("Learner Admission Application Form", MARGIN_L, y + 22)

  y += 30

  doc.setFillColor(239, 246, 255)
  doc.rect(MARGIN_L, y, CONTENT_W, 36, "F")
  doc.setDrawColor(PRIMARY.r, PRIMARY.g, PRIMARY.b)
  doc.setLineWidth(0.4)
  doc.rect(MARGIN_L, y, CONTENT_W, 36)

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
    `Alt phone: ${SCHOOL_INFO.phoneAlt}`,
    `WhatsApp: ${SCHOOL_INFO.whatsapp}`,
  ]
  const linesR = [
    `Email: ${SCHOOL_INFO.email}`,
    `Office hours: ${SCHOOL_INFO.officeHoursLong}`,
    `Principal: ${SCHOOL_INFO.principal} (${SCHOOL_INFO.principalYear})`,
    `NatEmis: ${SCHOOL_INFO.natEmis} · ${SCHOOL_INFO.phase}`,
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

  y += 42

  doc.setFontSize(7.5)
  doc.setTextColor(MUTED.r, MUTED.g, MUTED.b)
  doc.text(
    "Complete this form in block letters. Tick (✓) where applicable. Attach certified copies where noted. " +
      "Return the completed form and documents to the school office or email " +
      SCHOOL_INFO.email +
      " (subject: Admission Application). You may also apply online at the school website.",
    MARGIN_L,
    y,
    { maxWidth: CONTENT_W }
  )

  return y + 10
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
  doc.text(`School years: ${APPLICATION_SCHOOL_YEARS.join("  ·  ")}`, MARGIN_L, y)
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
  y = checkboxLine(doc, "Yes — attached", y + 2)
  y = checkboxLine(doc, "Not yet — will provide", y)

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

  const totalPages = doc.getNumberOfPages()
  for (let p = 1; p <= totalPages; p++) {
    doc.setPage(p)
    drawPageFooter(doc, p)
  }

  return Buffer.from(doc.output("arraybuffer"))
}

export function filledApplicationPdfFilename(reference: string): string {
  return `Asamaths-Admission-${reference}.pdf`
}

/** Completed application PDF — same layout as the downloadable blank form. */
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
  const submittedAt = formatDisplayDate()
  const guardianName = `${data.guardian1FirstName} ${data.guardian1LastName}`.trim()

  let y = drawHeader(doc, logoDataUrl)
  drawPageFooter(doc, 1)

  y = sectionBar(doc, "A. Application details", y)
  y = ensureSpace(doc, y, 24)
  y = fieldRowFilled(
    doc,
    [
      { label: "School year applying for", value: data.schoolYear, width: 55 },
      { label: "Date of application (DD / MM / YYYY)", value: submittedAt, width: 55 },
      { label: "Application reference (office use)", value: reference, width: 58 },
    ],
    y
  )
  doc.setFontSize(7)
  doc.setTextColor(MUTED.r, MUTED.g, MUTED.b)
  doc.text("Submission method: Online application via school website", MARGIN_L, y)
  y += 8

  y = sectionBar(doc, "B. Primary parent / guardian", y)
  y = ensureSpace(doc, y, 45)
  y = fieldRowFilled(
    doc,
    [
      { label: "First name(s)", value: data.guardian1FirstName, width: 58 },
      { label: "Surname", value: data.guardian1LastName, width: 58 },
      { label: "Relationship to learner", value: data.guardian1Relationship, width: 58 },
    ],
    y
  )
  y = fieldRowFilled(
    doc,
    [
      { label: "Email address", value: data.guardian1Email, width: 88 },
      { label: "Cell / telephone", value: data.guardian1Phone, width: 86 },
    ],
    y
  )
  y = fieldRowFilled(
    doc,
    [{ label: "SA ID number (13 digits)", value: data.guardian1IdNumber ?? "", width: CONTENT_W }],
    y
  )

  y = sectionBar(doc, "C. Second parent / guardian (optional)", y)
  y = ensureSpace(doc, y, 40)
  if (data.includeSecondGuardian) {
    y = fieldRowFilled(
      doc,
      [
        { label: "First name(s)", value: data.guardian2FirstName, width: 58 },
        { label: "Surname", value: data.guardian2LastName, width: 58 },
        { label: "Relationship", value: data.guardian2Relationship, width: 58 },
      ],
      y
    )
    y = fieldRowFilled(
      doc,
      [
        { label: "Email", value: data.guardian2Email ?? "", width: 88 },
        { label: "Cell / telephone", value: data.guardian2Phone ?? "", width: 86 },
      ],
      y
    )
  } else {
    y = fieldRow(doc, [
      { label: "First name(s)", width: 58 },
      { label: "Surname", width: 58 },
      { label: "Relationship", width: 58 },
    ], y)
    y = fieldRow(
      doc,
      [
        { label: "Email", width: 88 },
        { label: "Cell / telephone", width: 86 },
      ],
      y
    )
    doc.setFontSize(8)
    doc.setTextColor(MUTED.r, MUTED.g, MUTED.b)
    doc.text("Not applicable", MARGIN_L, y - 2)
    y += 2
  }

  y = sectionBar(doc, "D. Learner information", y)
  y = ensureSpace(doc, y, 55)
  y = fieldRowFilled(
    doc,
    [
      { label: "Learner first name(s)", value: data.learnerFirstName, width: 58 },
      { label: "Learner surname", value: data.learnerLastName, width: 58 },
      { label: "Gender", value: data.learnerGender ?? "", width: 58 },
    ],
    y
  )
  y = fieldRowFilled(
    doc,
    [
      {
        label: "Date of birth (DD / MM / YYYY)",
        value: formatDisplayDate(data.learnerDateOfBirth),
        width: 58,
      },
      { label: "Learner SA ID (if applicable)", value: data.learnerIdNumber ?? "", width: 58 },
      { label: "Home language", value: "", width: 58 },
    ],
    y
  )
  y = fieldRowFilled(
    doc,
    [
      { label: "Current grade", value: data.currentGrade, width: 44 },
      { label: "Grade applying for", value: data.gradeApplyingFor, width: 44 },
      { label: "Current / previous school", value: data.currentSchoolName, width: 86 },
    ],
    y
  )
  y = drawGradeChoices(doc, data.gradeApplyingFor, y)
  y = fieldRow(doc, [{ label: "Previous school address (if applicable)", width: CONTENT_W }], y)
  y = ensureSpace(doc, y, 12)
  doc.setFontSize(8)
  doc.text("Latest school reports available?", MARGIN_L, y)
  y = checkboxLineFilled(doc, "Yes — attached", data.hasPreviousSchoolReports === "yes", y + 2)
  y = checkboxLineFilled(doc, "Not yet — will provide", data.hasPreviousSchoolReports === "no", y)

  y = sectionBar(doc, "E. Residential address", y)
  y = ensureSpace(doc, y, 40)
  y = fieldBlockFilled(doc, "Street address", data.physicalAddress, y, 8)
  y = fieldRowFilled(
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
  y = fieldRowFilled(
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
  y = fieldBlockFilled(doc, "Allergies", data.allergies ?? "", y, 7)
  y = fieldBlockFilled(doc, "Medical conditions", data.medicalConditions ?? "", y, 7)
  y = fieldBlockFilled(doc, "Medication required at school", data.medication ?? "", y, 7)
  y = fieldBlockFilled(doc, "Learning / support needs", data.specialNeeds ?? "", y, 7)

  y = sectionBar(doc, "H. Supporting documents (attach copies)", y)
  y = ensureSpace(doc, y, 40)
  y = checkboxLineFilled(doc, "Learner birth certificate (certified copy)", Boolean(files.birthCertificate), y)
  y = checkboxLineFilled(doc, "Latest school report card", Boolean(files.latestReport), y)
  y = checkboxLineFilled(
    doc,
    "Transfer / exit letter from previous school (if applicable)",
    Boolean(files.transferLetter),
    y
  )
  y = checkboxLineFilled(doc, "Parent / guardian ID copy", Boolean(files.guardianIdCopy), y)
  y = checkboxLineFilled(doc, "Immunisation / clinic card (if requested by office)", false, y)
  if (!Object.values(files).some(Boolean)) {
    doc.setFontSize(7.5)
    doc.setTextColor(MUTED.r, MUTED.g, MUTED.b)
    doc.text(
      "Documents not uploaded online — to be submitted at the school office or emailed separately with this reference.",
      MARGIN_L,
      y + 1,
      { maxWidth: CONTENT_W }
    )
    y += 8
  }

  y = sectionBar(doc, "I. Additional information", y)
  y = ensureSpace(doc, y, 25)
  y = fieldRowFilled(
    doc,
    [{ label: "How did you hear about our school?", value: data.referralSource, width: CONTENT_W }],
    y
  )
  y = fieldBlockFilled(doc, "Notes for the admissions office", data.additionalNotes ?? "", y, 12)

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
  y = fieldRowFilled(
    doc,
    [
      { label: "Parent / guardian signature", value: `${guardianName} (electronic submission)`, width: 88 },
      { label: "Date (DD / MM / YYYY)", value: submittedAt, width: 86 },
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

  const totalPages = doc.getNumberOfPages()
  for (let p = 1; p <= totalPages; p++) {
    doc.setPage(p)
    drawPageFooter(doc, p)
  }

  return Buffer.from(doc.output("arraybuffer"))
}

export const APPLICATION_PDF_FILENAME = "Asamaths-Admission-Application-Form.pdf"

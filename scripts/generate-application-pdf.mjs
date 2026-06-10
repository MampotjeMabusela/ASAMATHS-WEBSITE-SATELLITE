/**
 * Writes a static copy of the admission PDF to public/downloads/
 * Run: npm run generate-application-pdf
 */
import { jsPDF } from "jspdf"
import fs from "fs"
import path from "path"
import { fileURLToPath } from "url"

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const root = path.join(__dirname, "..")

const SCHOOL_INFO = {
  name: "Asamaths Institute Of Learning – Pretoria",
  shortName: "Asamaths Institute",
  address: "1287, 7th Road, Winterveldt, Pretoria, Pretoria",
  phone: "+27 12 725 8044",
  phoneAlt: "+27 11 925 8074",
  whatsapp: "+27 61 530 9416",
  email: "asamathsinstituteoflearning@gmail.com",
  officeHoursLong: "Monday – Friday: 06:45 – 16:00",
  principal: "Makeche Brighton",
  principalYear: 2023,
  natEmis: "700400979",
  phase: "Combined School",
}

const BRAND = { motto: "Knowledge · Wisdom · Humanity" }
const APPLICATION_SCHOOL_YEARS = ["2026", "2027"]
const APPLICATION_GRADES = [
  "Grade R", "Grade 1", "Grade 2", "Grade 3", "Grade 4",
  "Grade 5", "Grade 6", "Grade 7", "Grade 8", "Grade 9",
]

const PRIMARY = { r: 30, g: 58, b: 138 }
const INK = { r: 15, g: 23, b: 42 }
const MUTED = { r: 71, g: 85, b: 105 }
const LINE = { r: 203, g: 213, b: 225 }
const MARGIN_L = 14
const MARGIN_R = 196
const CONTENT_W = MARGIN_R - MARGIN_L

function loadLogoDataUrl() {
  const logoPath = path.join(root, "public", "images", "logo-official.png")
  if (!fs.existsSync(logoPath)) return null
  return `data:image/png;base64,${fs.readFileSync(logoPath).toString("base64")}`
}

function drawPageFooter(doc, pageNum) {
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

function ensureSpace(doc, y, needed) {
  if (y + needed > doc.internal.pageSize.getHeight() - 18) {
    doc.addPage()
    drawPageFooter(doc, doc.getNumberOfPages())
    return 22
  }
  return y
}

function sectionBar(doc, title, y) {
  doc.setFillColor(PRIMARY.r, PRIMARY.g, PRIMARY.b)
  doc.rect(MARGIN_L, y, CONTENT_W, 7, "F")
  doc.setFont("helvetica", "bold")
  doc.setFontSize(10)
  doc.setTextColor(255, 255, 255)
  doc.text(title, MARGIN_L + 3, y + 5)
  doc.setTextColor(INK.r, INK.g, INK.b)
  return y + 11
}

function fieldRow(doc, labels, y) {
  const gap = 4
  let x = MARGIN_L
  const defaultW = CONTENT_W / labels.length - gap
  doc.setFont("helvetica", "normal")
  doc.setFontSize(8)
  doc.setTextColor(MUTED.r, MUTED.g, MUTED.b)
  for (const item of labels) {
    const w = item.width ?? defaultW
    doc.text(item.label, x, y)
    doc.setDrawColor(LINE.r, LINE.g, LINE.b)
    doc.line(x, y + 2.5, x + w, y + 2.5)
    x += w + gap
  }
  doc.setTextColor(INK.r, INK.g, INK.b)
  return y + 10
}

function fieldBlock(doc, label, y, height = 10) {
  doc.setFont("helvetica", "normal")
  doc.setFontSize(8)
  doc.setTextColor(MUTED.r, MUTED.g, MUTED.b)
  doc.text(label, MARGIN_L, y)
  doc.setDrawColor(LINE.r, LINE.g, LINE.b)
  doc.rect(MARGIN_L, y + 2, CONTENT_W, height)
  return y + height + 6
}

function checkboxLine(doc, label, y) {
  doc.setDrawColor(LINE.r, LINE.g, LINE.b)
  doc.rect(MARGIN_L, y - 3, 3.5, 3.5)
  doc.setFontSize(8)
  doc.setTextColor(INK.r, INK.g, INK.b)
  doc.text(label, MARGIN_L + 6, y)
  return y + 5
}

function drawHeader(doc, logoDataUrl) {
  let y = 14
  if (logoDataUrl) doc.addImage(logoDataUrl, "PNG", MARGIN_L, y, 24, 24)
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
  let ly = y + 10
  for (const line of [
    `Address: ${SCHOOL_INFO.address}`,
    `Phone: ${SCHOOL_INFO.phone}`,
    `Alt phone: ${SCHOOL_INFO.phoneAlt}`,
    `WhatsApp: ${SCHOOL_INFO.whatsapp}`,
  ]) {
    doc.text(line, col1, ly)
    ly += 4.5
  }
  ly = y + 10
  for (const line of [
    `Email: ${SCHOOL_INFO.email}`,
    `Office hours: ${SCHOOL_INFO.officeHoursLong}`,
    `Principal: ${SCHOOL_INFO.principal} (${SCHOOL_INFO.principalYear})`,
    `NatEmis: ${SCHOOL_INFO.natEmis} · ${SCHOOL_INFO.phase}`,
  ]) {
    doc.text(line, col2, ly)
    ly += 4.5
  }
  y += 42
  doc.setFontSize(7.5)
  doc.setTextColor(MUTED.r, MUTED.g, MUTED.b)
  doc.text(
    "Complete in block letters. Attach certified copies where noted. Return to the office or email " +
      SCHOOL_INFO.email +
      ". Online applications are also accepted on the school website.",
    MARGIN_L,
    y,
    { maxWidth: CONTENT_W }
  )
  return y + 10
}

function buildPdf() {
  const doc = new jsPDF({ unit: "mm", format: "a4" })
  const logo = loadLogoDataUrl()
  let y = drawHeader(doc, logo)
  drawPageFooter(doc, 1)

  y = sectionBar(doc, "A. Application details", y)
  y = fieldRow(doc, [
    { label: "School year applying for", width: 55 },
    { label: "Date of application (DD / MM / YYYY)", width: 55 },
    { label: "Application reference (office use)", width: 58 },
  ], y)
  y += 8
  y = sectionBar(doc, "B. Primary parent / guardian", y)
  y = fieldRow(doc, [
    { label: "First name(s)", width: 58 },
    { label: "Surname", width: 58 },
    { label: "Relationship to learner", width: 58 },
  ], y)
  y = fieldRow(doc, [
    { label: "Email address", width: 88 },
    { label: "Cell / telephone", width: 86 },
  ], y)
  y = fieldRow(doc, [{ label: "SA ID number (13 digits)", width: CONTENT_W }], y)
  y = sectionBar(doc, "C. Second parent / guardian (optional)", y)
  y = fieldRow(doc, [
    { label: "First name(s)", width: 58 },
    { label: "Surname", width: 58 },
    { label: "Relationship", width: 58 },
  ], y)
  y = fieldRow(doc, [{ label: "Email", width: 88 }, { label: "Cell / telephone", width: 86 }], y)
  y = sectionBar(doc, "D. Learner information", y)
  y = fieldRow(doc, [
    { label: "Learner first name(s)", width: 58 },
    { label: "Learner surname", width: 58 },
    { label: "Gender", width: 58 },
  ], y)
  y = fieldRow(doc, [
    { label: "Date of birth (DD / MM / YYYY)", width: 58 },
    { label: "Learner SA ID (if applicable)", width: 58 },
    { label: "Home language", width: 58 },
  ], y)
  y = fieldRow(doc, [
    { label: "Current grade", width: 44 },
    { label: "Grade applying for", width: 44 },
    { label: "Current / previous school", width: 86 },
  ], y)
  y += 4
  y = fieldRow(doc, [{ label: "Previous school address (if applicable)", width: CONTENT_W }], y)
  y = checkboxLine(doc, "Latest school reports attached", y + 2)
  y = checkboxLine(doc, "Reports to follow", y)
  y = sectionBar(doc, "E. Residential address", y)
  y = fieldBlock(doc, "Street address", y, 8)
  y = fieldRow(doc, [
    { label: "Suburb", width: 58 },
    { label: "City", width: 58 },
    { label: "Postal code", width: 58 },
  ], y)
  y = sectionBar(doc, "F. Emergency contact", y)
  y = fieldRow(doc, [
    { label: "Full name", width: 58 },
    { label: "Relationship", width: 58 },
    { label: "Telephone", width: 58 },
  ], y)
  y = sectionBar(doc, "G. Medical & support (optional)", y)
  y = fieldBlock(doc, "Allergies", y, 7)
  y = fieldBlock(doc, "Medical conditions", y, 7)
  y = fieldBlock(doc, "Medication at school", y, 7)
  y = fieldBlock(doc, "Learning / support needs", y, 7)
  y = sectionBar(doc, "H. Supporting documents (attach copies)", y)
  for (const d of [
    "Learner birth certificate (certified copy)",
    "Latest school report card",
    "Transfer / exit letter (if applicable)",
    "Parent / guardian ID copy",
    "Immunisation / clinic card (if requested)",
  ]) {
    y = checkboxLine(doc, d, y)
  }
  y = sectionBar(doc, "I. Additional information", y)
  y = fieldRow(doc, [{ label: "How did you hear about our school?", width: CONTENT_W }], y)
  y = fieldBlock(doc, "Notes for admissions", y, 12)
  y = sectionBar(doc, "J. Declaration & consent", y)
  doc.setFontSize(8)
  doc.text(
    `I declare the information is true and consent to ${SCHOOL_INFO.shortName} processing it for enrolment under POPIA.`,
    MARGIN_L,
    y,
    { maxWidth: CONTENT_W }
  )
  y += 14
  y = fieldRow(doc, [
    { label: "Parent / guardian signature", width: 88 },
    { label: "Date (DD / MM / YYYY)", width: 86 },
  ], y)
  y = sectionBar(doc, "For office use only", y)
  y = fieldRow(doc, [
    { label: "Received by", width: 58 },
    { label: "Date received", width: 58 },
    { label: "Interview date", width: 58 },
  ], y)

  const pages = doc.getNumberOfPages()
  for (let p = 1; p <= pages; p++) {
    doc.setPage(p)
    drawPageFooter(doc, p)
  }
  return doc
}

const outDir = path.join(root, "public", "downloads")
const outFile = path.join(outDir, "Asamaths-Admission-Application-Form.pdf")
fs.mkdirSync(outDir, { recursive: true })
const doc = buildPdf()
fs.writeFileSync(outFile, Buffer.from(doc.output("arraybuffer")))
console.log("Wrote", outFile)

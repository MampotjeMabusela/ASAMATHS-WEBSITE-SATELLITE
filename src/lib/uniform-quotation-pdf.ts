import { jsPDF } from "jspdf"
import { BRAND, SCHOOL_INFO } from "@/lib/constants"
import {
  UNIFORM_BANK_DETAILS,
  cartSubtotalCents,
  formatZarFromCents,
  type UniformCartLine,
  type UniformCheckoutDetails,
} from "@/lib/uniform-shop"

const PRIMARY = { r: 30, g: 58, b: 138 }
const INK = { r: 15, g: 23, b: 42 }
const MUTED = { r: 71, g: 85, b: 105 }
const LINE = { r: 203, g: 213, b: 225 }
const MARGIN_L = 14
const MARGIN_R = 196
const CONTENT_W = MARGIN_R - MARGIN_L
const FOOTER_BAND = 22
const PAGE_BOTTOM = 297 - FOOTER_BAND

function schoolDescription(): string {
  return `An independent ${SCHOOL_INFO.phase.toLowerCase()} in ${SCHOOL_INFO.suburb}, ${SCHOOL_INFO.city}, dedicated to providing quality education and fostering a disciplined, cohesive learning environment.`
}

async function loadLogoDataUrl(): Promise<string | null> {
  try {
    const src = `${BRAND.logoSrc}?v=${BRAND.logoAssetVersion}`
    const res = await fetch(src)
    if (!res.ok) return null
    const blob = await res.blob()
    return await new Promise((resolve) => {
      const reader = new FileReader()
      reader.onload = () => resolve(typeof reader.result === "string" ? reader.result : null)
      reader.onerror = () => resolve(null)
      reader.readAsDataURL(blob)
    })
  } catch {
    return null
  }
}

function ensureSpace(doc: jsPDF, y: number, needed: number): number {
  if (y + needed > PAGE_BOTTOM) {
    doc.addPage()
    return 18
  }
  return y
}

function drawPageFooter(doc: jsPDF, pageNum: number, totalPages: number) {
  const pageH = doc.internal.pageSize.getHeight()
  doc.setFillColor(255, 255, 255)
  doc.rect(0, pageH - FOOTER_BAND, 210, FOOTER_BAND, "F")

  doc.setDrawColor(LINE.r, LINE.g, LINE.b)
  doc.setLineWidth(0.2)
  doc.line(MARGIN_L, pageH - FOOTER_BAND + 2, MARGIN_R, pageH - FOOTER_BAND + 2)

  doc.setFont("helvetica", "normal")
  doc.setFontSize(6.5)
  doc.setTextColor(MUTED.r, MUTED.g, MUTED.b)

  const line1 = `${SCHOOL_INFO.shortName} · ${BRAND.motto}`
  const line2 = `${SCHOOL_INFO.address}`
  const line3 = `${SCHOOL_INFO.phone} · WhatsApp ${SCHOOL_INFO.whatsapp} · ${SCHOOL_INFO.email}`
  const line4 = `${SCHOOL_INFO.officeHours} · Page ${pageNum} of ${totalPages}`

  let fy = pageH - FOOTER_BAND + 6
  for (const line of [line1, line2, line3, line4]) {
    doc.text(line, MARGIN_L, fy, { maxWidth: CONTENT_W })
    fy += 3.2
  }
}

function applyFooters(doc: jsPDF) {
  const totalPages = doc.getNumberOfPages()
  for (let p = 1; p <= totalPages; p++) {
    doc.setPage(p)
    drawPageFooter(doc, p, totalPages)
  }
}

function drawBrandedHeader(doc: jsPDF, logoDataUrl: string | null, documentTitle: string): number {
  const top = 12
  const logoSize = 22
  const textX = logoDataUrl ? MARGIN_L + logoSize + 4 : MARGIN_L
  const textMaxW = MARGIN_R - textX

  if (logoDataUrl) {
    try {
      doc.addImage(logoDataUrl, "PNG", MARGIN_L, top, logoSize, logoSize)
    } catch {
      // Continue without logo if the image cannot be embedded.
    }
  }

  doc.setFont("helvetica", "bold")
  doc.setFontSize(12)
  doc.setTextColor(PRIMARY.r, PRIMARY.g, PRIMARY.b)
  const nameLines = doc.splitTextToSize(SCHOOL_INFO.name, textMaxW) as string[]
  doc.text(nameLines.slice(0, 2), textX, top + 6)

  doc.setFont("helvetica", "italic")
  doc.setFontSize(8)
  doc.setTextColor(MUTED.r, MUTED.g, MUTED.b)
  const mottoY = top + 6 + Math.min(nameLines.length, 2) * 5
  doc.text(BRAND.motto, textX, mottoY)

  let y = Math.max(top + logoSize, mottoY + 3) + 4

  doc.setFont("helvetica", "normal")
  doc.setFontSize(7)
  doc.setTextColor(MUTED.r, MUTED.g, MUTED.b)
  const blurb = doc.splitTextToSize(schoolDescription(), CONTENT_W) as string[]
  doc.text(blurb.slice(0, 3), MARGIN_L, y)
  y += Math.min(blurb.length, 3) * 3.4 + 4

  doc.setFont("helvetica", "bold")
  doc.setFontSize(13)
  doc.setTextColor(INK.r, INK.g, INK.b)
  doc.text(documentTitle, MARGIN_L, y)
  y += 5

  const boxTop = y
  const colW = (CONTENT_W - 6) / 2
  const leftRaw = [
    `Address: ${SCHOOL_INFO.address}`,
    `Phone: ${SCHOOL_INFO.phone}`,
    `Alt phone: ${SCHOOL_INFO.phoneAlt}`,
    `WhatsApp: ${SCHOOL_INFO.whatsapp}`,
  ]
  const rightRaw = [
    `Email: ${SCHOOL_INFO.email}`,
    `Office hours: ${SCHOOL_INFO.officeHoursLong}`,
    `Principal: ${SCHOOL_INFO.principal} (${SCHOOL_INFO.principalYear})`,
    `NatEmis: ${SCHOOL_INFO.natEmis} · ${SCHOOL_INFO.phase}`,
  ]

  doc.setFont("helvetica", "normal")
  doc.setFontSize(7)
  const leftLines = leftRaw.flatMap((line) => doc.splitTextToSize(line, colW - 2) as string[])
  const rightLines = rightRaw.flatMap((line) => doc.splitTextToSize(line, colW - 2) as string[])
  const boxH = 8 + Math.max(leftLines.length, rightLines.length) * 3.6 + 3

  doc.setFillColor(239, 246, 255)
  doc.rect(MARGIN_L, boxTop, CONTENT_W, boxH, "F")
  doc.setDrawColor(PRIMARY.r, PRIMARY.g, PRIMARY.b)
  doc.setLineWidth(0.4)
  doc.rect(MARGIN_L, boxTop, CONTENT_W, boxH)

  doc.setFont("helvetica", "bold")
  doc.setFontSize(8)
  doc.setTextColor(PRIMARY.r, PRIMARY.g, PRIMARY.b)
  doc.text("School and contact information", MARGIN_L + 3, boxTop + 5)

  doc.setFont("helvetica", "normal")
  doc.setFontSize(7)
  doc.setTextColor(INK.r, INK.g, INK.b)
  doc.text(leftLines, MARGIN_L + 3, boxTop + 10)
  doc.text(rightLines, MARGIN_L + 3 + colW + 4, boxTop + 10)

  return boxTop + boxH + 6
}

/**
 * Builds a downloadable uniform quotation / order summary PDF in the browser.
 */
export async function buildUniformQuotationPdf(
  lines: UniformCartLine[],
  details: UniformCheckoutDetails,
  reference: string,
  issuedAt = new Date()
): Promise<Blob> {
  const doc = new jsPDF({ unit: "mm", format: "a4" })
  const logoDataUrl = await loadLogoDataUrl()
  let y = drawBrandedHeader(doc, logoDataUrl, "Uniform Quotation / Order Summary")

  doc.setFont("helvetica", "normal")
  doc.setFontSize(9)
  doc.setTextColor(MUTED.r, MUTED.g, MUTED.b)
  doc.text(`Reference: ${reference}`, MARGIN_L, y)
  y += 5
  doc.text(
    `Issued: ${issuedAt.toLocaleString("en-ZA", { dateStyle: "medium", timeStyle: "short" })}`,
    MARGIN_L,
    y
  )
  y += 8

  doc.setDrawColor(LINE.r, LINE.g, LINE.b)
  doc.line(MARGIN_L, y, MARGIN_R, y)
  y += 7

  doc.setFont("helvetica", "bold")
  doc.setFontSize(10)
  doc.setTextColor(INK.r, INK.g, INK.b)
  doc.text("Parent / guardian", MARGIN_L, y)
  y += 5
  doc.setFont("helvetica", "normal")
  doc.setFontSize(9)
  doc.text(`Name: ${details.parentName}`, MARGIN_L, y)
  y += 4.5
  doc.text(`Email: ${details.parentEmail}`, MARGIN_L, y)
  y += 4.5
  doc.text(`Phone: ${details.parentPhone}`, MARGIN_L, y)
  y += 6
  doc.setFont("helvetica", "bold")
  doc.setFontSize(10)
  doc.text("Learner", MARGIN_L, y)
  y += 5
  doc.setFont("helvetica", "normal")
  doc.setFontSize(9)
  doc.text(`Name: ${details.learnerName}`, MARGIN_L, y)
  y += 4.5
  doc.text(`Grade: ${details.learnerGrade}`, MARGIN_L, y)
  y += 8

  doc.setFont("helvetica", "bold")
  doc.setFontSize(10)
  doc.text("Items", MARGIN_L, y)
  y += 6

  doc.setFillColor(239, 246, 255)
  doc.rect(MARGIN_L, y - 4, CONTENT_W, 7, "F")
  doc.setFontSize(8)
  doc.setTextColor(PRIMARY.r, PRIMARY.g, PRIMARY.b)
  doc.text("Item", MARGIN_L + 1, y)
  doc.text("Size", MARGIN_L + 88, y)
  doc.text("Qty", MARGIN_L + 112, y)
  doc.text("Unit", MARGIN_L + 128, y)
  doc.text("Total", MARGIN_R, y, { align: "right" })
  y += 6
  doc.setTextColor(INK.r, INK.g, INK.b)

  for (const line of lines) {
    y = ensureSpace(doc, y, 12)
    const lineTotal = formatZarFromCents(line.unitPriceCents * line.quantity)
    const nameLines = doc.splitTextToSize(`${line.name} (${line.listLabel})`, 84) as string[]
    doc.setFont("helvetica", "normal")
    doc.setFontSize(8)
    doc.text(nameLines, MARGIN_L + 1, y)
    doc.text(line.size, MARGIN_L + 88, y)
    doc.text(String(line.quantity), MARGIN_L + 112, y)
    doc.text(line.unitPriceLabel, MARGIN_L + 128, y)
    doc.text(lineTotal, MARGIN_R, y, { align: "right" })
    y += Math.max(6, nameLines.length * 4 + 2)
  }

  y += 2
  doc.setDrawColor(LINE.r, LINE.g, LINE.b)
  doc.line(MARGIN_L, y, MARGIN_R, y)
  y += 7

  const subtotal = formatZarFromCents(cartSubtotalCents(lines))
  doc.setFont("helvetica", "bold")
  doc.setFontSize(11)
  doc.text("Total", MARGIN_L, y)
  doc.text(subtotal, MARGIN_R, y, { align: "right" })
  y += 10

  doc.setFont("helvetica", "bold")
  doc.setFontSize(10)
  doc.text("Payment options", MARGIN_L, y)
  y += 5
  doc.setFont("helvetica", "normal")
  doc.setFontSize(9)
  if (details.paymentMethod === "eft") {
    doc.text("EFT / bank deposit into the Uniform Account (details below).", MARGIN_L, y, {
      maxWidth: CONTENT_W,
    })
    y += 6
    if (details.paymentReference?.trim()) {
      doc.text(`Your payment reference: ${details.paymentReference.trim()}`, MARGIN_L, y)
      y += 5
    }
  } else {
    doc.text(
      "Quotation only — pay at the school office, or by EFT into the Uniform Account when ready.",
      MARGIN_L,
      y,
      { maxWidth: CONTENT_W }
    )
    y += 6
  }

  y = ensureSpace(doc, y, 40)
  doc.setFont("helvetica", "bold")
  doc.setFontSize(10)
  doc.text("Uniform account banking details (uniforms only)", MARGIN_L, y)
  y += 5
  doc.setFont("helvetica", "normal")
  doc.setFontSize(9)
  const bankLines = [
    `Bank: ${UNIFORM_BANK_DETAILS.bank}`,
    `Account name: ${UNIFORM_BANK_DETAILS.accountName}`,
    `Account number: ${UNIFORM_BANK_DETAILS.accountNumber}`,
    `Branch code: ${UNIFORM_BANK_DETAILS.branchCode}`,
    `Reference: ${UNIFORM_BANK_DETAILS.referenceHint}`,
  ]
  for (const line of bankLines) {
    const wrapped = doc.splitTextToSize(line, CONTENT_W) as string[]
    doc.text(wrapped, MARGIN_L, y)
    y += wrapped.length * 4 + 1
  }

  y += 4
  if (details.notes?.trim()) {
    y = ensureSpace(doc, y, 16)
    doc.setFont("helvetica", "bold")
    doc.setFontSize(10)
    doc.text("Notes", MARGIN_L, y)
    y += 5
    doc.setFont("helvetica", "normal")
    doc.setFontSize(9)
    const notes = doc.splitTextToSize(details.notes.trim(), CONTENT_W) as string[]
    doc.text(notes, MARGIN_L, y)
    y += notes.length * 4 + 4
  }

  y = ensureSpace(doc, y, 20)
  doc.setFontSize(8)
  doc.setTextColor(MUTED.r, MUTED.g, MUTED.b)
  const notesFooter = [
    "This quotation is not a tax invoice. Stock and sizes are subject to availability.",
    "Pay at the school office or into the Uniform Account above, then email proof of payment to",
    `${SCHOOL_INFO.email} quoting reference ${reference}.`,
  ]
  for (const line of notesFooter) {
    doc.text(line, MARGIN_L, y, { maxWidth: CONTENT_W })
    y += 4
  }

  applyFooters(doc)
  return doc.output("blob")
}

export function downloadUniformQuotationPdf(blob: Blob, reference: string) {
  const url = URL.createObjectURL(blob)
  const a = document.createElement("a")
  a.href = url
  a.download = `Asamaths-Uniform-Quotation-${reference}.pdf`
  a.click()
  URL.revokeObjectURL(url)
}

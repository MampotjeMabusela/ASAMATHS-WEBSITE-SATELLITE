import { jsPDF } from "jspdf"
import { SCHOOL_INFO } from "@/lib/constants"
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

function ensureSpace(doc: jsPDF, y: number, needed: number): number {
  if (y + needed > 275) {
    doc.addPage()
    return 18
  }
  return y
}

/**
 * Builds a downloadable uniform quotation / order summary PDF in the browser.
 */
export function buildUniformQuotationPdf(
  lines: UniformCartLine[],
  details: UniformCheckoutDetails,
  reference: string,
  issuedAt = new Date()
): Blob {
  const doc = new jsPDF({ unit: "mm", format: "a4" })
  let y = 16

  doc.setFont("helvetica", "bold")
  doc.setFontSize(14)
  doc.setTextColor(PRIMARY.r, PRIMARY.g, PRIMARY.b)
  doc.text(SCHOOL_INFO.name, MARGIN_L, y, { maxWidth: CONTENT_W })
  y += 8

  doc.setFontSize(12)
  doc.setTextColor(INK.r, INK.g, INK.b)
  doc.text("Uniform Quotation / Order Summary", MARGIN_L, y)
  y += 7

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

  // Table header
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
    const nameLines = doc.splitTextToSize(
      `${line.name} (${line.listLabel})`,
      84
    ) as string[]
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
  doc.text("Payment method", MARGIN_L, y)
  y += 5
  doc.setFont("helvetica", "normal")
  doc.setFontSize(9)
  if (details.paymentMethod === "eft") {
    doc.text("EFT / bank deposit (pay using the banking details below)", MARGIN_L, y, {
      maxWidth: CONTENT_W,
    })
    y += 6
    if (details.paymentReference?.trim()) {
      doc.text(`Your payment reference: ${details.paymentReference.trim()}`, MARGIN_L, y)
      y += 5
    }
  } else {
    doc.text("Quotation only — pay at the school office or by EFT when ready", MARGIN_L, y, {
      maxWidth: CONTENT_W,
    })
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

  y = ensureSpace(doc, y, 28)
  doc.setFontSize(8)
  doc.setTextColor(MUTED.r, MUTED.g, MUTED.b)
  const footer = [
    "This quotation is not a tax invoice. Stock and sizes are subject to availability.",
    "Bring this PDF (or email it) to the school office, or email proof of payment to",
    `${SCHOOL_INFO.email} quoting reference ${reference}.`,
    `Office hours: ${SCHOOL_INFO.officeHours} · ${SCHOOL_INFO.phone}`,
  ]
  for (const line of footer) {
    doc.text(line, MARGIN_L, y, { maxWidth: CONTENT_W })
    y += 4
  }

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

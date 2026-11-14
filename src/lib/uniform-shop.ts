import type { UniformPriceItem, UniformPriceList } from "@/lib/uniform-catalog"
import { UNIFORM_PRICE_LISTS } from "@/lib/uniform-catalog"

/** Banking details for uniform quotations (aligned with Fees page). */
export const UNIFORM_BANK_DETAILS = {
  bank: "First National Bank",
  accountName: "Asamath’s Institute of Learning",
  accountNumber: "62623099571",
  branchCode: "250655",
  referenceHint:
    "Use your quotation reference plus the learner’s surname (e.g. UNI-20261114-AB12 Mokoena).",
} as const

export const UNIFORM_CLOTHING_SIZES = [
  "4",
  "6",
  "8",
  "10",
  "12",
  "14",
  "16",
  "S",
  "M",
  "L",
  "XL",
] as const

export const UNIFORM_ONESIZE = ["One size"] as const

const ONESIZE_ITEM_IDS = new Set([
  "gray-red-tie",
  "gray-red-socks",
  "g79-gray-red-tie",
  "g79-maroon-socks",
  "sun-hat",
  "g79-sun-hat",
  "winter-woollen-hat",
  "g79-winter-woollen-hat",
])

export type UniformCartLine = {
  key: string
  listId: string
  listLabel: string
  itemId: string
  name: string
  size: string
  quantity: number
  unitPriceCents: number
  unitPriceLabel: string
}

export type UniformCheckoutDetails = {
  parentName: string
  parentEmail: string
  parentPhone: string
  learnerName: string
  learnerGrade: string
  notes?: string
  paymentMethod: "quotation" | "eft"
  paymentReference?: string
}

/** Parse catalog labels like "R240.00" into cents. */
export function parseUniformPriceToCents(price: string): number {
  const digits = price.replace(/[^\d.]/g, "")
  const value = Number.parseFloat(digits)
  if (Number.isNaN(value)) return 0
  return Math.round(value * 100)
}

export function formatZarFromCents(cents: number): string {
  return `R${(cents / 100).toFixed(2)}`
}

export function sizesForUniformItem(itemId: string): readonly string[] {
  return ONESIZE_ITEM_IDS.has(itemId) ? UNIFORM_ONESIZE : UNIFORM_CLOTHING_SIZES
}

export function findUniformItem(
  listId: string,
  itemId: string
): { list: UniformPriceList; item: UniformPriceItem } | null {
  const list = UNIFORM_PRICE_LISTS.find((entry) => entry.id === listId)
  if (!list) return null
  const item = list.items.find((entry) => entry.id === itemId)
  if (!item) return null
  return { list, item }
}

export function cartLineKey(listId: string, itemId: string, size: string): string {
  return `${listId}::${itemId}::${size}`
}

export function createCartLine(
  listId: string,
  itemId: string,
  size: string,
  quantity = 1
): UniformCartLine | null {
  const found = findUniformItem(listId, itemId)
  if (!found) return null
  const { list, item } = found
  const qty = Math.max(1, Math.min(99, Math.floor(quantity)))
  return {
    key: cartLineKey(listId, itemId, size),
    listId,
    listLabel: list.grades,
    itemId,
    name: item.name,
    size,
    quantity: qty,
    unitPriceCents: parseUniformPriceToCents(item.price),
    unitPriceLabel: item.price,
  }
}

export function cartSubtotalCents(lines: UniformCartLine[]): number {
  return lines.reduce((sum, line) => sum + line.unitPriceCents * line.quantity, 0)
}

export function createUniformQuotationReference(now = new Date()): string {
  const y = now.getFullYear()
  const m = String(now.getMonth() + 1).padStart(2, "0")
  const d = String(now.getDate()).padStart(2, "0")
  const rand = Math.random().toString(36).slice(2, 6).toUpperCase()
  return `UNI-${y}${m}${d}-${rand}`
}

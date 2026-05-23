import { SCHOOL_INFO } from "@/lib/constants"

export function getWhatsAppUrl(prefill?: string) {
  const base = `https://wa.me/${SCHOOL_INFO.rawWhatsApp}`
  if (!prefill?.trim()) return base
  return `${base}?text=${encodeURIComponent(prefill.trim())}`
}

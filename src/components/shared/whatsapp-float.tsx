import { getWhatsAppUrl } from "@/lib/whatsapp"
import { SCHOOL_INFO } from "@/lib/constants"
import { WhatsAppIcon } from "@/components/shared/whatsapp-icon"

const DEFAULT_MESSAGE = `Hello ${SCHOOL_INFO.shortName}, I would like to enquire about the school.`

export function WhatsAppFloat() {
  return (
    <a
      href={getWhatsAppUrl(DEFAULT_MESSAGE)}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 left-6 z-[100] flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-xl ring-2 ring-white/40 transition hover:scale-105 hover:bg-[#20bd5a] hover:shadow-2xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#25D366] focus-visible:ring-offset-2"
      aria-label={`Chat on WhatsApp: ${SCHOOL_INFO.whatsapp}`}
      title={`WhatsApp ${SCHOOL_INFO.whatsapp}`}
    >
      <WhatsAppIcon className="h-7 w-7" />
    </a>
  )
}

"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { MessageCircle, Send } from "lucide-react"
import { Button } from "@/components/ui/button"
import { getWhatsAppUrl } from "@/lib/whatsapp"
import { cn } from "@/lib/utils"

type StickyMobileCtaProps = {
  enquireHref?: string
  enquireLabel?: string
  className?: string
}

export function StickyMobileCta({
  enquireHref = "/contact#asa-contact-form",
  enquireLabel = "Enquire",
  className,
}: StickyMobileCtaProps) {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > window.innerHeight * 0.45)
    onScroll()
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  return (
    <div
      className={cn(
        "pointer-events-none fixed inset-x-0 bottom-0 z-40 border-t border-gray-200/90 bg-white/95 p-3 shadow-[0_-8px_30px_rgba(15,23,42,0.12)] backdrop-blur-md transition-transform duration-300 md:hidden",
        "pb-[max(0.75rem,env(safe-area-inset-bottom))]",
        visible ? "translate-y-0" : "translate-y-full",
        className,
      )}
      aria-hidden={!visible}
    >
      <div className="pointer-events-auto container-custom flex gap-2">
        <Link href={enquireHref} className="flex-1">
          <Button size="lg" className="h-12 w-full gap-2 bg-primary-600 text-white shadow-md">
            <Send className="h-4 w-4" aria-hidden />
            {enquireLabel}
          </Button>
        </Link>
        <a
          href={getWhatsAppUrl()}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1"
        >
          <Button
            size="lg"
            variant="outline"
            className="h-12 w-full gap-2 border-[#25D366]/40 text-[#128C7E] hover:bg-[#25D366]/10"
          >
            <MessageCircle className="h-4 w-4" aria-hidden />
            WhatsApp
          </Button>
        </a>
      </div>
    </div>
  )
}

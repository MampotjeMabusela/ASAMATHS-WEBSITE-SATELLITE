"use client"

import { useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { AnimatePresence, motion, useReducedMotion } from "framer-motion"
import { ExternalLink } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import type { NavLink } from "@/types"
import { NAV_CONDUCT, NAV_HOME, NAV_JOIN, NAV_LEARN, type NavLinkItem } from "@/lib/constants"

const itemClass = (active: boolean) =>
  cn(
    "block w-full rounded-lg px-4 py-3.5 text-left text-[15px] font-medium leading-snug transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-600 focus-visible:ring-inset md:text-base",
    active ? "bg-primary-100 text-primary-900" : "text-gray-800 hover:bg-gray-100"
  )

interface MobileNavProps {
  isOpen: boolean
  onClose: () => void
  links: NavLink[]
  sisterSchool?: { href: string; label: string }
  anchorHeight: number
}

export function MobileNav({ isOpen, onClose, sisterSchool, anchorHeight }: MobileNavProps) {
  const pathname = usePathname()
  const reduceMotion = useReducedMotion()
  const top = Math.max(anchorHeight, 56)

  useEffect(() => {
    if (!isOpen) return
    const prev = document.body.style.overflow
    document.body.style.overflow = "hidden"
    return () => {
      document.body.style.overflow = prev
    }
  }, [isOpen])

  const overlayStyle = { top } as const

  /** Right drawer: wide enough for long labels, capped for small phones */
  const drawerClass =
    "fixed bottom-0 z-50 flex w-[min(22rem,92vw)] max-w-full flex-col border-l border-gray-200 bg-white shadow-2xl md:hidden " +
    "pb-[max(1rem,env(safe-area-inset-bottom))] pt-4 pl-1 pr-2 sm:pl-2 sm:pr-3"

  return (
    <AnimatePresence mode="wait">
      {isOpen && (
        <>
          {reduceMotion ? (
            <>
              <div
                className="fixed z-40 bg-black/50 md:hidden"
                style={{ ...overlayStyle, left: 0, right: 0, bottom: 0 }}
                onClick={onClose}
                aria-hidden
              />
              <aside
                className={cn(drawerClass, "right-0")}
                style={{ ...overlayStyle, maxHeight: `calc(100dvh - ${top}px)` }}
                id="mobile-menu-panel"
                aria-label="Mobile navigation"
              >
                <div className="flex min-h-0 flex-1 flex-col overflow-y-auto overscroll-contain px-3 sm:px-4">
                  <p className="mb-3 shrink-0 px-1 text-xs font-semibold uppercase tracking-wider text-gray-500">
                    Menu
                  </p>
                  <MobileNavMenu pathname={pathname} onClose={onClose} />
                  {sisterSchool ? (
                    <div className="mt-2 shrink-0 border-t border-gray-100 pt-3">
                      <p className="mb-2 px-1 text-xs font-semibold uppercase tracking-wider text-gray-500">
                        Our campuses
                      </p>
                      <a
                        href={sisterSchool.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={cn(itemClass(false), "flex items-start gap-2")}
                        onClick={onClose}
                      >
                        <ExternalLink className="mt-0.5 h-4 w-4 shrink-0" aria-hidden />
                        <span>{sisterSchool.label}</span>
                      </a>
                    </div>
                  ) : null}
                  <div className="mt-4 shrink-0 border-t border-gray-100 pt-4">
                    <Link href="/admissions" onClick={onClose} className="block">
                      <Button className="h-12 w-full text-base font-semibold" size="lg">
                        Apply for Admission
                      </Button>
                    </Link>
                  </div>
                </div>
              </aside>
            </>
          ) : (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed z-40 bg-black/50 md:hidden"
                style={{ ...overlayStyle, left: 0, right: 0, bottom: 0 }}
                onClick={onClose}
                aria-hidden
              />

              <motion.aside
                initial={{ x: "100%" }}
                animate={{ x: 0 }}
                exit={{ x: "100%" }}
                transition={{ type: "spring", damping: 30, stiffness: 320 }}
                className={cn(drawerClass, "right-0")}
                style={{ ...overlayStyle, maxHeight: `calc(100dvh - ${top}px)` }}
                id="mobile-menu-panel"
                aria-label="Mobile navigation"
              >
                <div className="flex min-h-0 flex-1 flex-col overflow-y-auto overscroll-contain px-3 sm:px-4">
                  <p className="mb-3 shrink-0 px-1 text-xs font-semibold uppercase tracking-wider text-gray-500">
                    Menu
                  </p>
                  <MobileNavMenu pathname={pathname} onClose={onClose} />
                  {sisterSchool ? (
                    <motion.div
                      initial={{ opacity: 0, x: 12 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.2 }}
                      className="mt-2 shrink-0 border-t border-gray-100 pt-3"
                    >
                      <p className="mb-2 px-1 text-xs font-semibold uppercase tracking-wider text-gray-500">
                        Our campuses
                      </p>
                      <a
                        href={sisterSchool.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={cn(itemClass(false), "flex items-start gap-2")}
                        onClick={onClose}
                      >
                        <ExternalLink className="mt-0.5 h-4 w-4 shrink-0" aria-hidden />
                        <span>{sisterSchool.label}</span>
                      </a>
                    </motion.div>
                  ) : null}
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.28 }}
                    className="mt-4 shrink-0 border-t border-gray-100 pt-4"
                  >
                    <Link href="/admissions" onClick={onClose} className="block">
                      <Button className="h-12 w-full text-base font-semibold" size="lg">
                        Apply for Admission
                      </Button>
                    </Link>
                  </motion.div>
                </div>
              </motion.aside>
            </>
          )}
        </>
      )}
    </AnimatePresence>
  )
}

function MobileNavMenu({ pathname, onClose }: { pathname: string; onClose: () => void }) {
  const sections: { title: string; links: NavLinkItem[] }[] = [
    { title: "", links: [NAV_HOME] },
    { title: "Learn", links: NAV_LEARN },
    { title: "Join", links: NAV_JOIN },
    { title: "", links: [NAV_CONDUCT] },
  ]

  return (
    <nav aria-label="Site pages" className="space-y-4">
      {sections.map((section) => (
        <div key={section.title || "home"}>
          {section.title ? (
            <p className="mb-2 px-1 text-xs font-semibold uppercase tracking-wider text-gray-500">
              {section.title}
            </p>
          ) : null}
          <ul className="flex flex-col gap-1">
            {section.links.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className={cn(
                    itemClass(pathname === link.href),
                    link.highlight &&
                      "bg-primary-600 font-semibold text-white hover:bg-primary-700",
                  )}
                  onClick={onClose}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </nav>
  )
}

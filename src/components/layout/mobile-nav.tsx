"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { AnimatePresence, motion, useReducedMotion } from "framer-motion"
import { ExternalLink } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import type { NavLink } from "@/types"

const linkClass = (active: boolean) =>
  cn(
    "block rounded-lg px-4 py-3 text-lg font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white",
    active ? "bg-primary-50 text-primary-700" : "text-gray-600 hover:bg-gray-50 hover:text-primary-600"
  )

interface MobileNavProps {
  isOpen: boolean
  onClose: () => void
  links: NavLink[]
  /** External link to sibling campus site */
  sisterSchool?: { href: string; label: string }
}

export function MobileNav({ isOpen, onClose, links, sisterSchool }: MobileNavProps) {
  const pathname = usePathname()
  const reduceMotion = useReducedMotion()

  return (
    <AnimatePresence mode="wait">
      {isOpen && (
        <>
          {reduceMotion ? (
            <>
              <div
                className="fixed inset-0 top-16 z-40 bg-black/50 md:hidden"
                onClick={onClose}
                aria-hidden
              />
              <div className="fixed right-0 top-16 z-50 h-[calc(100vh-4rem)] w-72 overflow-y-auto bg-white shadow-2xl md:hidden">
                <nav className="flex flex-col gap-3 p-4" aria-label="Mobile">
                  {links.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      className={linkClass(pathname === link.href)}
                      onClick={onClose}
                    >
                      {link.label}
                    </Link>
                  ))}
                  {sisterSchool ? (
                    <a
                      href={sisterSchool.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={cn(linkClass(false), "flex items-center gap-2")}
                      onClick={onClose}
                    >
                      <ExternalLink className="h-4 w-4 shrink-0" aria-hidden />
                      {sisterSchool.label}
                    </a>
                  ) : null}
                  <div className="mt-6 px-2">
                    <Link href="/admissions" onClick={onClose}>
                      <Button className="w-full bg-primary-600 text-white hover:bg-primary-700">
                        Apply for Admission
                      </Button>
                    </Link>
                  </div>
                </nav>
              </div>
            </>
          ) : (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 top-16 z-40 bg-black/50 md:hidden"
                onClick={onClose}
                aria-hidden
              />

              <motion.div
                initial={{ x: "100%" }}
                animate={{ x: 0 }}
                exit={{ x: "100%" }}
                transition={{ type: "spring", damping: 25, stiffness: 200 }}
                className="fixed right-0 top-16 z-50 h-[calc(100vh-4rem)] w-72 overflow-y-auto bg-white shadow-2xl md:hidden"
              >
                <nav className="flex flex-col gap-3 p-4" aria-label="Mobile">
                  {links.map((link, i) => (
                    <motion.div
                      key={link.href}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.05 }}
                    >
                      <Link href={link.href} className={linkClass(pathname === link.href)} onClick={onClose}>
                        {link.label}
                      </Link>
                    </motion.div>
                  ))}
                  {sisterSchool ? (
                    <motion.div
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: links.length * 0.05 }}
                    >
                      <a
                        href={sisterSchool.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={cn(linkClass(false), "flex items-center gap-2")}
                        onClick={onClose}
                      >
                        <ExternalLink className="h-4 w-4 shrink-0" aria-hidden />
                        {sisterSchool.label}
                      </a>
                    </motion.div>
                  ) : null}
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 + (sisterSchool ? 0.05 : 0) }}
                    className="mt-6 px-2"
                  >
                    <Link href="/admissions" onClick={onClose}>
                      <Button className="w-full bg-primary-600 text-white hover:bg-primary-700">
                        Apply for Admission
                      </Button>
                    </Link>
                  </motion.div>
                </nav>
              </motion.div>
            </>
          )}
        </>
      )}
    </AnimatePresence>
  )
}

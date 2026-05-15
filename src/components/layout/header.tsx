"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Menu, X, Phone, ExternalLink } from "lucide-react"
import { cn } from "@/lib/utils"
import { BRAND, NAV_LINKS, SCHOOL_INFO, hasSisterSchoolLink, SISTER_SCHOOL_LINK } from "@/lib/constants"
import { MobileNav } from "./mobile-nav"
import { SiteLogo } from "./site-logo"
import { Button } from "@/components/ui/button"

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20)
    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  useEffect(() => {
    setIsMobileNavOpen(false)
  }, [pathname])

  return (
    <header
      className={cn(
        "fixed top-0 z-50 w-full transition-all duration-300",
        isScrolled ? "bg-white/95 shadow-lg backdrop-blur-md" : "bg-white"
      )}
    >
      {/* Top bar */}
      <div className="hidden bg-primary-900 text-white md:block">
        <div className="container-custom flex items-center justify-between py-1.5 text-sm">
          <div className="flex items-center gap-6">
            <a
              href={`tel:${SCHOOL_INFO.rawPhone}`}
              className="flex items-center gap-1.5 rounded-sm transition hover:text-accent-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-400 focus-visible:ring-offset-2 focus-visible:ring-offset-primary-900"
            >
              <Phone className="h-3.5 w-3.5" />
              {SCHOOL_INFO.phone}
            </a>
            <a
              href={`mailto:${SCHOOL_INFO.email}`}
              className="rounded-sm transition hover:text-accent-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-400 focus-visible:ring-offset-2 focus-visible:ring-offset-primary-900"
            >
              {SCHOOL_INFO.email}
            </a>
          </div>
          <span className="text-primary-200">
            NatEmis: {SCHOOL_INFO.natEmis} | {SCHOOL_INFO.sector} {SCHOOL_INFO.phase}
          </span>
        </div>
      </div>

      {/* Main nav */}
      <div className="container-custom">
        <div className="flex h-16 items-center justify-between md:h-20">
          {/* Logo */}
          <Link
            href="/"
            className="group flex min-w-0 max-w-[min(92vw,28rem)] items-center gap-3 rounded-xl py-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white sm:max-w-none sm:gap-4"
          >
            <SiteLogo variant="header" isScrolled={isScrolled} />
            <div className="hidden h-[3.75rem] min-w-0 flex-col justify-center border-l border-gray-200/80 pl-4 sm:flex sm:h-[3.9rem] md:h-[4.375rem] md:pl-5">
              <p className="font-display text-[1.05rem] font-semibold leading-snug tracking-tight text-primary-950 md:text-lg">
                {SCHOOL_INFO.shortName}
              </p>
              <p className="mt-0.5 text-[0.625rem] font-semibold uppercase leading-none tracking-[0.18em] text-primary-600/90 md:text-[0.6875rem]">
                {BRAND.motto}
              </p>
              <p className="mt-1.5 text-xs font-medium text-gray-500 md:text-[0.8125rem]">
                {SCHOOL_INFO.suburb}, {SCHOOL_INFO.city}
              </p>
            </div>
            <div className="flex min-w-0 flex-1 flex-col justify-center sm:hidden">
              <p className="truncate font-display text-sm font-semibold leading-tight text-primary-950">
                {SCHOOL_INFO.shortName}
              </p>
              <p className="mt-0.5 truncate text-[0.6rem] font-medium uppercase tracking-wider text-primary-600">
                {BRAND.motto}
              </p>
            </div>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden items-center gap-1 md:flex">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "rounded-lg px-3 py-2 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white",
                  pathname === link.href
                    ? "bg-primary-50 text-primary-700"
                    : "text-gray-600 hover:bg-gray-50 hover:text-primary-600"
                )}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* CTA + Mobile toggle */}
          <div className="flex items-center gap-2 sm:gap-3">
            {hasSisterSchoolLink() ? (
              <a
                href={SISTER_SCHOOL_LINK.url}
                target="_blank"
                rel="noopener noreferrer"
                className="hidden rounded-md md:inline-flex focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white"
              >
                <Button
                  size="sm"
                  variant="outline"
                  className="border-primary-200 text-primary-800 hover:bg-primary-50 hover:text-primary-900"
                >
                  <ExternalLink className="mr-1.5 h-3.5 w-3.5" aria-hidden />
                  {SISTER_SCHOOL_LINK.label}
                </Button>
              </a>
            ) : null}
            <Link href="/admissions" className="hidden rounded-md md:inline-flex focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white">
              <Button size="sm" className="bg-primary-600 text-white shadow-md hover:bg-primary-700">
                Apply Now
              </Button>
            </Link>
            <button
              type="button"
              onClick={() => setIsMobileNavOpen(!isMobileNavOpen)}
              className="inline-flex items-center justify-center rounded-lg p-2 text-gray-600 hover:bg-gray-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-600 focus-visible:ring-offset-2 md:hidden"
              aria-label="Toggle menu"
            >
              {isMobileNavOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile nav */}
      <MobileNav
        isOpen={isMobileNavOpen}
        onClose={() => setIsMobileNavOpen(false)}
        links={NAV_LINKS}
        sisterSchool={
          hasSisterSchoolLink()
            ? { href: SISTER_SCHOOL_LINK.url, label: SISTER_SCHOOL_LINK.label }
            : undefined
        }
      />
    </header>
  )
}

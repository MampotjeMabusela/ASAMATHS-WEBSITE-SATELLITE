"use client"

import { useState, useEffect, useRef, useLayoutEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Menu, X, Phone, ExternalLink } from "lucide-react"
import { cn } from "@/lib/utils"
import {
  BRAND,
  NAV_CONDUCT,
  NAV_HOME,
  NAV_JOIN,
  NAV_LEARN,
  NAV_LINKS,
  SCHOOL_INFO,
  hasSisterSchoolLink,
  SISTER_SCHOOL_LINK,
} from "@/lib/constants"
import { MobileNav } from "./mobile-nav"
import { SiteLogo } from "./site-logo"
import { Button } from "@/components/ui/button"

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false)
  const [headerAnchorPx, setHeaderAnchorPx] = useState(112)
  const pathname = usePathname()
  const headerChromeRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20)
    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  useEffect(() => {
    setIsMobileNavOpen(false)
  }, [pathname])

  useLayoutEffect(() => {
    const el = headerChromeRef.current
    if (!el || typeof ResizeObserver === "undefined") return
    const measure = () => setHeaderAnchorPx(el.offsetHeight)
    measure()
    const ro = new ResizeObserver(measure)
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  return (
    <header
      className={cn(
        "fixed top-0 z-50 w-full transition-all duration-300",
        isScrolled
          ? "border-b border-primary-100 bg-white/95 shadow-lg shadow-primary-900/5 backdrop-blur-md"
          : "border-b border-transparent bg-white"
      )}
    >
      <div ref={headerChromeRef} className="w-full">
        {/* Top bar — desktop */}
        <div className="hidden bg-primary-900 text-white md:block">
          <div className="container-custom flex items-center justify-between py-1.5 text-sm">
            <div className="flex min-w-0 flex-wrap items-center gap-4 lg:gap-6">
              <a
                href={`tel:${SCHOOL_INFO.rawPhone}`}
                className="flex shrink-0 items-center gap-1.5 rounded-sm transition hover:text-accent-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-400 focus-visible:ring-offset-2 focus-visible:ring-offset-primary-900"
              >
                <Phone className="h-3.5 w-3.5 shrink-0" />
                {SCHOOL_INFO.phone}
              </a>
              <a
                href={`mailto:${SCHOOL_INFO.email}`}
                className="min-w-0 truncate rounded-sm transition hover:text-accent-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-400 focus-visible:ring-offset-2 focus-visible:ring-offset-primary-900"
              >
                {SCHOOL_INFO.email}
              </a>
            </div>
            <span className="hidden shrink-0 text-primary-200 lg:inline">
              NatEmis: {SCHOOL_INFO.natEmis} | {SCHOOL_INFO.sector} {SCHOOL_INFO.phase}
            </span>
          </div>
        </div>

        <div className="container-custom border-b border-gray-100/90">
          {/* Main row */}
          <div className="flex h-16 items-center gap-2 md:h-20 md:gap-4">
            <Link
              href="/"
              className="group flex min-w-0 flex-1 items-center gap-2 rounded-xl py-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white sm:gap-3 md:flex-none md:gap-4"
            >
              <SiteLogo variant="header" isScrolled={isScrolled} />
              <div className="hidden min-w-0 flex-col justify-center border-l border-gray-200/80 pl-3 sm:flex sm:h-[3.9rem] sm:pl-4 md:h-[4.375rem] md:pl-5">
                <p className="font-display text-[1.02rem] font-semibold leading-snug tracking-tight text-primary-950 md:text-lg">
                  {SCHOOL_INFO.shortName}
                </p>
                <p className="mt-0.5 text-[0.625rem] font-semibold uppercase leading-none tracking-[0.18em] text-primary-600/90 md:text-[0.6875rem]">
                  {BRAND.motto}
                </p>
                <p className="mt-1.5 hidden text-xs font-medium text-gray-500 md:block md:text-[0.8125rem]">
                  {SCHOOL_INFO.suburb}, {SCHOOL_INFO.city}
                </p>
              </div>
              <div className="flex min-w-0 flex-col justify-center sm:hidden">
                <p className="truncate font-display text-[0.8125rem] font-semibold leading-tight text-primary-950 sm:text-sm">
                  {SCHOOL_INFO.shortName}
                </p>
                <p className="mt-0.5 truncate text-[0.58rem] font-medium uppercase tracking-wider text-primary-600">
                  {BRAND.motto}
                </p>
              </div>
            </Link>

            {/* Desktop nav — Learn | Join | Conduct */}
            <nav
              className="hidden flex-1 items-center justify-end gap-1 md:flex lg:gap-1.5"
              aria-label="Main navigation"
            >
              <NavLink href={NAV_HOME.href} label={NAV_HOME.label} pathname={pathname} />
              <span className="mx-0.5 hidden h-5 w-px bg-gray-200 lg:inline" aria-hidden />
              <span className="hidden px-1 text-[10px] font-semibold uppercase tracking-wider text-gray-400 lg:inline">
                Learn
              </span>
              {NAV_LEARN.map((link) => (
                <NavLink key={link.href} href={link.href} label={link.label} pathname={pathname} />
              ))}
              <span className="mx-0.5 hidden h-5 w-px bg-gray-200 lg:inline" aria-hidden />
              <span className="hidden px-1 text-[10px] font-semibold uppercase tracking-wider text-gray-400 lg:inline">
                Join
              </span>
              {NAV_JOIN.map((link) => (
                <NavLink
                  key={link.href}
                  href={link.href}
                  label={link.label}
                  pathname={pathname}
                  highlight={link.highlight}
                />
              ))}
              <span className="mx-0.5 hidden h-5 w-px bg-gray-200 lg:inline" aria-hidden />
              <NavLink href={NAV_CONDUCT.href} label={NAV_CONDUCT.label} pathname={pathname} />
            </nav>

            {/* CTA + Mobile toggle */}
            <div className="flex shrink-0 items-center gap-2 sm:gap-3">
              {hasSisterSchoolLink() ? (
                <a
                  href={SISTER_SCHOOL_LINK.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hidden flex-col items-end rounded-md lg:inline-flex focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white"
                  title={`Visit our ${SISTER_SCHOOL_LINK.label}`}
                >
                  <span className="text-[10px] font-semibold uppercase tracking-wider text-gray-400">
                    Our campuses
                  </span>
                  <Button
                    size="sm"
                    variant="outline"
                    className="mt-0.5 border-primary-200 text-primary-800 hover:bg-primary-50 hover:text-primary-900"
                  >
                    <ExternalLink className="mr-1.5 h-3.5 w-3.5" aria-hidden />
                    <span className="max-w-[10rem] truncate">{SISTER_SCHOOL_LINK.label}</span>
                  </Button>
                </a>
              ) : null}
              <Link
                href="/admissions"
                className="hidden rounded-md lg:inline-flex focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white"
              >
                <Button size="sm" className="bg-primary-600 text-white shadow-md hover:bg-primary-700">
                  Apply Now
                </Button>
              </Link>
              <button
                type="button"
                onClick={() => setIsMobileNavOpen(!isMobileNavOpen)}
                className="inline-flex min-h-11 min-w-11 touch-manipulation items-center justify-center rounded-xl border border-transparent p-2 text-gray-700 hover:bg-gray-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-600 focus-visible:ring-offset-2 md:hidden"
                aria-expanded={isMobileNavOpen}
                aria-controls="mobile-menu-panel"
                aria-label={isMobileNavOpen ? "Close menu" : "Open menu"}
              >
                {isMobileNavOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </div>
        </div>
      </div>

      <MobileNav
        isOpen={isMobileNavOpen}
        onClose={() => setIsMobileNavOpen(false)}
        links={NAV_LINKS}
        anchorHeight={headerAnchorPx}
        sisterSchool={
          hasSisterSchoolLink()
            ? { href: SISTER_SCHOOL_LINK.url, label: SISTER_SCHOOL_LINK.label }
            : undefined
        }
      />
    </header>
  )
}

function NavLink({
  href,
  label,
  pathname,
  highlight,
}: {
  href: string
  label: string
  pathname: string
  highlight?: boolean
}) {
  const active = pathname === href
  if (highlight) {
    return (
      <Link
        href={href}
        className={cn(
          "shrink-0 rounded-full px-3 py-1.5 text-xs font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white lg:text-sm",
          active
            ? "bg-primary-700 text-white shadow-md"
            : "bg-primary-600 text-white shadow-sm hover:bg-primary-700",
        )}
      >
        {label}
      </Link>
    )
  }
  return (
    <Link
      href={href}
      className={cn(
        "shrink-0 rounded-lg px-2 py-2 text-xs font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white lg:px-3 lg:text-sm",
        active ? "bg-primary-50 text-primary-700" : "text-gray-600 hover:bg-gray-50 hover:text-primary-600",
      )}
    >
      {label}
    </Link>
  )
}

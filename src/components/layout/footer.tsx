import Link from "next/link"
import { MapPin, Phone, Mail, Clock } from "lucide-react"
import { BRAND, NAV_LINKS, SCHOOL_INFO, hasSisterSchoolLink, SISTER_SCHOOL_LINK } from "@/lib/constants"
import { SiteLogo } from "./site-logo"

export function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-[#0a0f1a] text-gray-300">
      <div className="container-custom py-16">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div className="space-y-4">
            <Link
              href="/"
              className="group flex flex-col gap-4 rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-400 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0a0f1a] sm:flex-row sm:items-center"
            >
              <SiteLogo variant="footer" className="shrink-0 motion-safe:transition-opacity motion-safe:duration-200 group-hover:opacity-[0.97]" />
              <div className="min-w-0 sm:border-l sm:border-white/10 sm:pl-5">
                <span className="block font-display text-xl font-semibold leading-tight tracking-tight text-white">
                  {SCHOOL_INFO.shortName}
                </span>
                <span className="mt-1.5 block text-[0.6875rem] font-semibold uppercase leading-relaxed tracking-[0.16em] text-primary-300/95">
                  {BRAND.motto}
                </span>
              </div>
            </Link>
            <p className="text-sm leading-relaxed text-gray-400">
              An independent combined school in Tembisa, Johannesburg, dedicated to providing quality
              education and fostering a disciplined, cohesive learning environment.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-white">
              Quick Links
            </h3>
            <ul className="space-y-2.5">
              {NAV_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="rounded-sm text-sm text-gray-400 transition hover:text-primary-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-400 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0a0f1a]"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
              {hasSisterSchoolLink() ? (
                <li>
                  <a
                    href={SISTER_SCHOOL_LINK.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="rounded-sm text-sm text-gray-400 transition hover:text-primary-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-400 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0a0f1a]"
                  >
                    {SISTER_SCHOOL_LINK.label}{" "}
                    <span className="text-primary-500/90" aria-hidden>
                      ↗
                    </span>
                  </a>
                </li>
              ) : null}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-white">
              Contact Us
            </h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-2.5">
                <MapPin className="mt-0.5 h-4 w-4 flex-shrink-0 text-primary-400" />
                <span className="text-sm text-gray-400">{SCHOOL_INFO.address}</span>
              </li>
              <li>
                <a
                  href={`tel:${SCHOOL_INFO.rawPhone}`}
                  className="flex items-center gap-2.5 rounded-sm text-sm text-gray-400 transition hover:text-primary-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-400 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0a0f1a]"
                >
                  <Phone className="h-4 w-4 flex-shrink-0 text-primary-400" />
                  {SCHOOL_INFO.phone}
                </a>
              </li>
              <li>
                <a
                  href={`mailto:${SCHOOL_INFO.email}`}
                  className="flex items-center gap-2.5 rounded-sm text-sm text-gray-400 transition hover:text-primary-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-400 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0a0f1a]"
                >
                  <Mail className="h-4 w-4 flex-shrink-0 text-primary-400" />
                  {SCHOOL_INFO.email}
                </a>
              </li>
              <li className="flex items-start gap-2.5">
                <Clock className="mt-0.5 h-4 w-4 flex-shrink-0 text-primary-400" />
                <span className="text-sm text-gray-400">Mon–Fri: 07:30 – 15:00</span>
              </li>
            </ul>
          </div>

          {/* Accreditation */}
          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-white">
              School Info
            </h3>
            <ul className="space-y-2.5 text-sm text-gray-400">
              <li>
                <strong className="text-gray-300">NatEmis:</strong> {SCHOOL_INFO.natEmis}
              </li>
              <li>
                <strong className="text-gray-300">Phase:</strong> {SCHOOL_INFO.phase}
              </li>
              <li>
                <strong className="text-gray-300">Sector:</strong> {SCHOOL_INFO.sector}
              </li>
              <li>
                <strong className="text-gray-300">Province:</strong> {SCHOOL_INFO.province}
              </li>
              <li>
                <strong className="text-gray-300">Principal:</strong> {SCHOOL_INFO.principal}
              </li>
              <li>
                <strong className="text-gray-300">Learners:</strong> {SCHOOL_INFO.totalLearners} (2023)
              </li>
              <li>
                <strong className="text-gray-300">Ratio:</strong> {SCHOOL_INFO.studentTeacherRatio}
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 border-t border-gray-700/80 pt-8 text-center">
          <p className="text-sm text-gray-500">
            &copy; {currentYear} {SCHOOL_INFO.name}. All rights reserved. |{" "}
            <span className="text-gray-500">South African Schools Act, 1996 compliant</span>
          </p>
          <p className="mt-3 text-xs text-gray-500">
            This website was developed by{" "}
            <span className="font-medium text-gray-400">CiT Solutions</span>.
          </p>
        </div>
      </div>
    </footer>
  )
}

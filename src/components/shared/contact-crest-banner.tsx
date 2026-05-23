"use client"

import { motion, useReducedMotion } from "framer-motion"
import { BRAND } from "@/lib/constants"

const logoSrc = `${BRAND.logoSrc}?v=${BRAND.logoAssetVersion}`

export function ContactCrestBanner() {
  const reduceMotion = useReducedMotion()

  return (
    <motion.div className="contact-crest-motion relative mb-10 overflow-hidden rounded-2xl bg-gradient-to-br from-primary-50 via-white to-accent-50/40">
      <motion.div
        className="pointer-events-none absolute -left-12 top-1/4 h-40 w-40 rounded-full bg-primary-400/25 blur-3xl"
        animate={
          reduceMotion ? undefined : { opacity: [0.35, 0.65, 0.35], scale: [1, 1.12, 1] }
        }
        transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
        aria-hidden
      />
      <motion.div
        className="pointer-events-none absolute -right-10 bottom-0 h-44 w-44 rounded-full bg-accent-400/30 blur-3xl"
        animate={
          reduceMotion ? undefined : { opacity: [0.3, 0.55, 0.3], scale: [1.05, 1, 1.05] }
        }
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut", delay: 0.8 }}
        aria-hidden
      />
      <motion.div
        className="pointer-events-none absolute right-1/3 top-0 h-32 w-32 rounded-full bg-emerald-400/20 blur-3xl"
        animate={reduceMotion ? undefined : { opacity: [0.2, 0.45, 0.2] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 1.2 }}
        aria-hidden
      />

      <motion.div
        className="pointer-events-none absolute inset-0 opacity-[0.35]"
        style={{
          background:
            "linear-gradient(115deg, transparent 38%, rgba(255,255,255,0.85) 50%, transparent 62%)",
        }}
        animate={reduceMotion ? undefined : { x: ["-30%", "130%"] }}
        transition={{ duration: 9, repeat: Infinity, ease: "easeInOut", repeatDelay: 2 }}
        aria-hidden
      />

      <div className="relative z-10 flex min-h-[160px] flex-col items-center justify-center gap-4 px-6 py-8 sm:min-h-[180px] sm:flex-row sm:justify-between sm:gap-8 sm:px-10 sm:py-10">
        <motion.div
          className="relative flex shrink-0 items-center justify-center bg-gradient-to-br from-primary-50 via-white to-white px-2 py-1"
          animate={reduceMotion ? undefined : { y: [0, -4, 0] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
        >
          <img
            src={logoSrc}
            alt={BRAND.logoAlt}
            width={520}
            height={520}
            className="h-[7.5rem] w-auto max-w-[min(100%,220px)] object-contain sm:h-[8.5rem] sm:max-w-[240px]"
          />
        </motion.div>

        <motion.div
          className="max-w-xl text-center sm:text-left"
          initial={reduceMotion ? false : { opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <span className="mb-2 inline-flex rounded-full border border-primary-200/80 bg-white/80 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-primary-800 backdrop-blur-sm">
            Get in touch
          </span>
          <p className="font-display text-xl font-bold leading-tight text-primary-950 sm:text-2xl">
            Questions about enrolment? We&apos;re here to help
          </p>
          <p className="mt-2 text-sm leading-relaxed text-primary-800/90 sm:text-base">
            Call, email, or send a message—our office responds during school hours.
          </p>
        </motion.div>
      </div>
    </motion.div>
  )
}

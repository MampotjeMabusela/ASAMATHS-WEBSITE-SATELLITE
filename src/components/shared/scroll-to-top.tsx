"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence, useReducedMotion } from "framer-motion"
import { prefersReducedMotion } from "@/lib/motion-preference"
import { ArrowUp } from "lucide-react"

const scrollBtnClass =
  "fixed bottom-24 right-6 z-50 flex h-12 w-12 items-center justify-center rounded-full bg-primary-600 text-white shadow-lg transition-colors hover:bg-primary-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-400 focus-visible:ring-offset-2"

export function ScrollToTop() {
  const [isVisible, setIsVisible] = useState(false)
  const reduceMotion = useReducedMotion()

  useEffect(() => {
    const toggle = () => setIsVisible(window.scrollY > 500)
    window.addEventListener("scroll", toggle, { passive: true })
    return () => window.removeEventListener("scroll", toggle)
  }, [])

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: prefersReducedMotion() ? "auto" : "smooth" })
  }

  return (
    <AnimatePresence>
      {isVisible &&
        (reduceMotion ? (
          <button key="scroll-static" type="button" onClick={scrollToTop} className={scrollBtnClass} aria-label="Scroll to top">
            <ArrowUp className="h-5 w-5" />
          </button>
        ) : (
          <motion.button
            key="scroll-motion"
            type="button"
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5 }}
            onClick={scrollToTop}
            className={scrollBtnClass}
            aria-label="Scroll to top"
          >
            <ArrowUp className="h-5 w-5" />
          </motion.button>
        ))}
    </AnimatePresence>
  )
}

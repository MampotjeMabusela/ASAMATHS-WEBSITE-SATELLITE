"use client"

import { useEffect, useRef, useState } from "react"
import { useInView, useReducedMotion } from "framer-motion"

type AnimatedStatValueProps = {
  value: string
  suffix?: string
  className?: string
}

/** Stable thousands grouping (space) — avoids server/client `toLocaleString` hydration mismatches. */
function formatStatNumber(n: number): string {
  const rounded = Math.round(n)
  const negative = rounded < 0
  const digits = Math.abs(rounded).toString()
  const grouped = digits.replace(/\B(?=(\d{3})+(?!\d))/g, " ")
  return negative ? `-${grouped}` : grouped
}

function parseNumericValue(raw: string): number | null {
  const digits = raw.replace(/[^\d]/g, "")
  if (!digits) return null
  const n = parseInt(digits, 10)
  return Number.isFinite(n) ? n : null
}

export function AnimatedStatValue({ value, suffix = "", className }: AnimatedStatValueProps) {
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true, margin: "-40px" })
  const reduceMotion = useReducedMotion()
  const numeric = parseNumericValue(value)
  const [mounted, setMounted] = useState(false)
  const [display, setDisplay] = useState(() => (numeric ?? 0))

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!mounted || numeric === null) return
    if (reduceMotion || !inView) {
      setDisplay(numeric)
      return
    }

    setDisplay(0)
    const duration = 1400
    const start = performance.now()
    let frame = 0

    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / duration)
      const eased = 1 - (1 - t) ** 3
      setDisplay(Math.round(numeric * eased))
      if (t < 1) frame = requestAnimationFrame(tick)
    }

    frame = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frame)
  }, [mounted, inView, numeric, reduceMotion])

  if (numeric === null) {
    return (
      <span ref={ref} className={className}>
        {value}
        {suffix}
      </span>
    )
  }

  const shown = mounted && inView && !reduceMotion ? display : numeric

  return (
    <span ref={ref} className={className}>
      {formatStatNumber(shown)}
      {suffix}
    </span>
  )
}

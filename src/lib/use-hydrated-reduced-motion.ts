"use client"

import { useReducedMotion } from "framer-motion"
import { useEffect, useState } from "react"

/** Avoid hydration mismatch: SSR and first client paint always use the animated path. */
export function useHydratedReducedMotion(): boolean {
  const reducedMotion = useReducedMotion()
  const [hydrated, setHydrated] = useState(false)

  useEffect(() => {
    setHydrated(true)
  }, [])

  if (!hydrated) return false
  return reducedMotion ?? false
}

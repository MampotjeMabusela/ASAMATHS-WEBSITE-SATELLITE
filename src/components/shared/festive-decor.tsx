"use client"

import { useEffect, useMemo, useState } from "react"
import { FESTIVE_BANNER_LINES, getFestiveGreeting, isFestiveSeason } from "@/lib/festive-season"
import { cn } from "@/lib/utils"

const LIGHT_COLORS = ["#c41e3a", "#0f7a3e", "#f5c542", "#f8fafc", "#c41e3a", "#0f7a3e", "#f5c542"] as const
const FIREWORK_COLORS = ["#f5c542", "#ff6b6b", "#7cf5a3", "#ffd166", "#a78bfa", "#38bdf8", "#fb7185"] as const

type Snowflake = {
  id: number
  left: string
  size: number
  duration: number
  delay: number
  opacity: number
}

type FireworkBurst = {
  id: number
  left: string
  top: string
  delay: number
  color: string
  scale: number
}

function buildSnowflakes(count: number): Snowflake[] {
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    left: `${(i * 37 + 11) % 100}%`,
    size: 3 + (i % 5),
    duration: 10 + (i % 8) * 1.4,
    delay: (i % 12) * -0.85,
    opacity: 0.4 + (i % 5) * 0.1,
  }))
}

function buildFireworks(count: number): FireworkBurst[] {
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    left: `${8 + ((i * 17) % 84)}%`,
    top: `${10 + ((i * 23) % 45)}%`,
    delay: (i % 9) * 0.85,
    color: FIREWORK_COLORS[i % FIREWORK_COLORS.length],
    scale: 0.7 + (i % 4) * 0.18,
  }))
}

function ChristmasTree({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 80 110" fill="none" aria-hidden>
      <rect x="35" y="92" width="10" height="14" rx="1" fill="#6b3f1d" />
      <path d="M40 8 58 42H22L40 8Z" fill="#0d5c2e" />
      <path d="M40 22 64 58H16L40 22Z" fill="#0f7a3e" />
      <path d="M40 40 70 82H10L40 40Z" fill="#128a46" />
      <circle cx="40" cy="10" r="4" fill="#f5c542" />
      <circle cx="32" cy="36" r="2.4" fill="#c41e3a" />
      <circle cx="48" cy="40" r="2.4" fill="#f5c542" />
      <circle cx="28" cy="58" r="2.6" fill="#f8fafc" />
      <circle cx="44" cy="54" r="2.4" fill="#c41e3a" />
      <circle cx="36" cy="70" r="2.5" fill="#f5c542" />
      <circle cx="52" cy="72" r="2.4" fill="#c41e3a" />
      <circle cx="24" cy="74" r="2.2" fill="#38bdf8" />
    </svg>
  )
}

function FireworkShell({
  burst,
  animate,
}: {
  burst: FireworkBurst
  animate: boolean
}) {
  const sparks = 10
  return (
    <div
      className={cn("festive-firework absolute", animate && "festive-firework-burst")}
      style={{
        left: burst.left,
        top: burst.top,
        animationDelay: `${burst.delay}s`,
        ["--fw-scale" as string]: burst.scale,
        ["--fw-color" as string]: burst.color,
      }}
    >
      {Array.from({ length: sparks }).map((_, i) => {
        const angle = (i / sparks) * Math.PI * 2
        const x = Math.cos(angle) * 28
        const y = Math.sin(angle) * 28
        return (
          <span
            key={i}
            className="festive-spark"
            style={{
              ["--sx" as string]: `${x}px`,
              ["--sy" as string]: `${y}px`,
              backgroundColor: burst.color,
              boxShadow: `0 0 8px ${burst.color}`,
            }}
          />
        )
      })}
      <span className="festive-firework-core" style={{ backgroundColor: burst.color }} />
    </div>
  )
}

/**
 * Christmas & New Year decoration — trees, lights, snow, fireworks, holiday banner.
 */
export function FestiveDecor() {
  const [active, setActive] = useState(false)
  const [greeting, setGreeting] = useState(FESTIVE_BANNER_LINES.join(" · "))
  const [dismissed, setDismissed] = useState(false)
  const [reduceMotion, setReduceMotion] = useState(false)
  const flakes = useMemo(() => buildSnowflakes(36), [])
  const fireworks = useMemo(() => buildFireworks(8), [])

  useEffect(() => {
    const now = new Date()
    setActive(isFestiveSeason(now))
    setGreeting(getFestiveGreeting(now))

    const mq = window.matchMedia("(prefers-reduced-motion: reduce)")
    setReduceMotion(mq.matches)
    const onChange = () => setReduceMotion(mq.matches)
    mq.addEventListener("change", onChange)

    try {
      if (sessionStorage.getItem("asa-festive-dismissed") === "1") {
        setDismissed(true)
      }
    } catch {
      /* ignore */
    }

    return () => mq.removeEventListener("change", onChange)
  }, [])

  if (!active) return null

  const dismiss = () => {
    setDismissed(true)
    try {
      sessionStorage.setItem("asa-festive-dismissed", "1")
    } catch {
      /* ignore */
    }
  }

  return (
    <div className="pointer-events-none fixed inset-0 z-[60] overflow-hidden" aria-hidden={dismissed}>
      {/* Festive wash so the holiday feel is obvious */}
      <div className="absolute inset-0 bg-gradient-to-b from-emerald-950/10 via-transparent to-red-950/10" />

      {/* String lights */}
      <div className="absolute inset-x-0 top-0 h-4 overflow-hidden">
        <div className="absolute left-0 right-0 top-[9px] h-px bg-emerald-900/50" />
        <div className="flex w-full justify-between px-1 sm:px-2">
          {Array.from({ length: 28 }).map((_, i) => (
            <span
              key={i}
              className={cn("festive-bulb", !reduceMotion && "festive-bulb-twinkle")}
              style={{
                backgroundColor: LIGHT_COLORS[i % LIGHT_COLORS.length],
                animationDelay: `${(i % 7) * 0.28}s`,
              }}
            />
          ))}
        </div>
      </div>

      {/* Christmas trees — left & right, clearly visible */}
      <ChristmasTree className="absolute bottom-4 left-1 h-28 w-20 opacity-95 drop-shadow-lg sm:bottom-6 sm:left-3 sm:h-40 sm:w-28 lg:h-48 lg:w-32" />
      <ChristmasTree className="absolute bottom-4 right-1 h-28 w-20 opacity-95 drop-shadow-lg sm:bottom-6 sm:right-3 sm:h-40 sm:w-28 lg:h-48 lg:w-32" />

      {/* Stylish fireworks / firecracker bursts */}
      {!reduceMotion &&
        fireworks.map((burst) => <FireworkShell key={burst.id} burst={burst} animate />)}

      {/* Soft snowfall */}
      {!reduceMotion && (
        <div className="pointer-events-none absolute inset-0">
          {flakes.map((flake) => (
            <span
              key={flake.id}
              className="festive-snowflake absolute top-[-12px] rounded-full bg-white"
              style={{
                left: flake.left,
                width: flake.size,
                height: flake.size,
                opacity: flake.opacity,
                animationDuration: `${flake.duration}s`,
                animationDelay: `${flake.delay}s`,
                boxShadow: "0 0 5px rgba(255,255,255,0.75)",
              }}
            />
          ))}
        </div>
      )}

      {/* Holiday banner — Merry Christmas + Happy New Year 2027 */}
      {!dismissed && (
        <div className="pointer-events-auto absolute inset-x-0 bottom-[5.5rem] z-[61] flex justify-center px-3 sm:bottom-28">
          <div
            role="status"
            className="relative max-w-2xl overflow-hidden rounded-2xl border-2 border-amber-300/50 bg-gradient-to-r from-emerald-950 via-red-900 to-emerald-950 px-4 py-3 text-center shadow-2xl shadow-red-950/40 sm:px-6 sm:py-4"
          >
            <div className="pointer-events-none absolute inset-0 festive-banner-shine" aria-hidden />
            <p className="relative font-display text-sm font-bold leading-snug text-amber-50 sm:text-base">
              Merry Christmas to all parents and students
            </p>
            <p className="relative mt-1 font-display text-base font-extrabold tracking-wide text-amber-200 sm:text-lg">
              Happy New Year 2027
            </p>
            <p className="relative mt-1 text-[10px] font-medium uppercase tracking-[0.18em] text-emerald-100/80 sm:text-[11px]">
              Asamaths Institute · Season&apos;s Greetings
            </p>
            <button
              type="button"
              onClick={dismiss}
              className="relative mt-2 rounded-md border border-white/20 bg-white/10 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-amber-50 transition hover:bg-white/20"
              aria-label="Dismiss festive greeting"
            >
              Close
            </button>
            <span className="sr-only">{greeting}</span>
          </div>
        </div>
      )}
    </div>
  )
}

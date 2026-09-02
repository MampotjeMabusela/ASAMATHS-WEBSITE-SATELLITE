import {
  Bell,
  BookOpen,
  Megaphone,
  Palette,
  Trophy,
  type LucideIcon,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { SCHOOL_INFO } from "@/lib/constants"
import {
  getPublishedHighlights,
  HIGHLIGHT_CATEGORY_LABELS,
  WEEKLY_HIGHLIGHTS,
  type HighlightCategory,
} from "@/lib/highlights"

const CATEGORY_STYLES: Record<
  HighlightCategory,
  { badge: string; icon: LucideIcon }
> = {
  sports: {
    badge: "bg-accent-100 text-accent-900 ring-accent-200/80",
    icon: Trophy,
  },
  culture: {
    badge: "bg-purple-100 text-purple-900 ring-purple-200/80",
    icon: Palette,
  },
  academic: {
    badge: "bg-primary-100 text-primary-900 ring-primary-200/80",
    icon: BookOpen,
  },
  general: {
    badge: "bg-gray-100 text-gray-800 ring-gray-200/80",
    icon: Bell,
  },
}

type HeroHighlightsProps = {
  className?: string
}

export function HeroHighlights({ className }: HeroHighlightsProps) {
  const items = getPublishedHighlights(WEEKLY_HIGHLIGHTS)

  return (
    <aside
      className={cn(
        "relative flex w-full max-w-none flex-col overflow-hidden rounded-3xl border border-white/25 bg-white/95 shadow-2xl backdrop-blur-md lg:max-h-[min(620px,72vh)]",
        className
      )}
      aria-labelledby="hero-highlights-heading"
    >
      <div className="border-b border-primary-100/80 bg-gradient-to-r from-primary-900 via-primary-800 to-primary-700 px-5 py-4 sm:px-6">
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-accent-500 text-gray-900 shadow-md">
            <Megaphone className="h-5 w-5" aria-hidden />
          </div>
          <div className="min-w-0">
            <h2
              id="hero-highlights-heading"
              className="font-display text-xl font-bold tracking-tight text-white sm:text-2xl"
            >
              Highlights
            </h2>
            <p className="mt-0.5 text-sm text-primary-100">{WEEKLY_HIGHLIGHTS.weekLabel}</p>
          </div>
        </div>
        <p className="mt-3 text-sm leading-relaxed text-primary-100/95">
          Weekly announcements — sports, culture, academics, and school news.
        </p>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto px-4 py-4 sm:px-5 sm:py-5">
        {items.length === 0 ? (
          <p className="rounded-xl border border-dashed border-gray-200 bg-gray-50 px-4 py-8 text-center text-sm text-gray-600">
            No highlights posted this week. Check back soon.
          </p>
        ) : (
          <ul className="space-y-3" role="list">
            {items.map((item) => {
              const style = CATEGORY_STYLES[item.category]
              const Icon = style.icon

              return (
                <li
                  key={item.id}
                  className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm ring-1 ring-gray-100/80"
                >
                  <div className="flex flex-wrap items-center gap-2">
                    <span
                      className={cn(
                        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-semibold ring-1 ring-inset",
                        style.badge
                      )}
                    >
                      <Icon className="h-3.5 w-3.5" aria-hidden />
                      {HIGHLIGHT_CATEGORY_LABELS[item.category]}
                    </span>
                    {item.when ? (
                      <span className="text-xs font-medium text-gray-500">{item.when}</span>
                    ) : null}
                  </div>
                  <h3 className="mt-2 font-display text-base font-bold leading-snug text-gray-900">
                    {item.title}
                  </h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-gray-600">{item.description}</p>
                </li>
              )
            })}
          </ul>
        )}
      </div>

      <div className="relative border-t border-gray-100 bg-gray-50/90 px-4 py-3 sm:px-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="rounded-lg border border-primary-100 bg-white px-3 py-2 text-xs shadow-sm sm:text-sm">
            <p className="font-bold text-primary-900">NatEmis</p>
            <p className="text-primary-700">{SCHOOL_INFO.natEmis}</p>
          </div>
          <div
            className="flex h-12 w-12 items-center justify-center rounded-full bg-accent-500 text-xs font-bold text-gray-900 shadow-md sm:h-14 sm:w-14 sm:text-sm"
            aria-label={`Survey year ${SCHOOL_INFO.surveyYear}`}
          >
            {SCHOOL_INFO.surveyYear}
          </div>
        </div>
      </div>
    </aside>
  )
}

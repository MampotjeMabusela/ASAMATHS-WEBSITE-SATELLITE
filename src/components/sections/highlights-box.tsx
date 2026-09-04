"use client"

import { BookOpen, CalendarDays, Megaphone, Music2, Sparkles, Trophy } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import {
  CURRENT_HIGHLIGHTS,
  HIGHLIGHT_CATEGORY_LABELS,
  type Highlight,
  type HighlightCategory,
} from "@/lib/highlights"

const CATEGORY_STYLES: Record<
  HighlightCategory,
  { icon: typeof Trophy; badgeClass: string; dotClass: string }
> = {
  sports: {
    icon: Trophy,
    badgeClass: "bg-emerald-500/20 text-emerald-200 ring-emerald-400/30",
    dotClass: "bg-emerald-400",
  },
  culture: {
    icon: Music2,
    badgeClass: "bg-violet-500/20 text-violet-200 ring-violet-400/30",
    dotClass: "bg-violet-400",
  },
  academic: {
    icon: BookOpen,
    badgeClass: "bg-sky-500/20 text-sky-200 ring-sky-400/30",
    dotClass: "bg-sky-400",
  },
  general: {
    icon: Megaphone,
    badgeClass: "bg-accent-500/25 text-accent-100 ring-accent-400/40",
    dotClass: "bg-accent-400",
  },
}

function HighlightItem({ item }: { item: Highlight }) {
  const style = CATEGORY_STYLES[item.category]
  const Icon = style.icon

  return (
    <li className="group relative rounded-2xl border border-white/10 bg-white/[0.06] p-4 transition-colors hover:border-white/20 hover:bg-white/[0.09]">
      <div className="flex gap-3">
        <div
          className={cn(
            "mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ring-1 ring-inset",
            style.badgeClass
          )}
          aria-hidden
        >
          <Icon className="h-4 w-4" />
        </div>
        <div className="min-w-0 flex-1 space-y-1.5">
          <div className="flex flex-wrap items-center gap-2">
            <Badge
              className={cn(
                "rounded-md px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider ring-1 ring-inset",
                style.badgeClass
              )}
            >
              {HIGHLIGHT_CATEGORY_LABELS[item.category]}
            </Badge>
            {item.when ? (
              <span className="inline-flex items-center gap-1 text-[11px] font-medium text-primary-200/90">
                <CalendarDays className="h-3 w-3 shrink-0 opacity-80" aria-hidden />
                {item.when}
              </span>
            ) : null}
          </div>
          <p className="font-display text-sm font-bold leading-snug text-white">{item.title}</p>
          <p className="text-xs leading-relaxed text-primary-100/90">{item.description}</p>
        </div>
      </div>
    </li>
  )
}

export function HighlightsBox({ className }: { className?: string }) {
  const { weekLabel, items, updatedAt, updatedLabel } = CURRENT_HIGHLIGHTS

  return (
    <aside
      className={cn(
        "relative flex w-full max-w-none flex-col overflow-hidden rounded-3xl border border-white/25 bg-primary-900/50 shadow-2xl backdrop-blur-md lg:max-h-[min(620px,72vh)]",
        className
      )}
      aria-labelledby="highlights-heading"
      aria-describedby="highlights-week-label"
    >
      <div className="border-b border-white/10 bg-gradient-to-r from-primary-950/80 via-primary-900/60 to-primary-800/50 px-5 py-4 sm:px-6 sm:py-5">
        <div className="flex items-start justify-between gap-3">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-accent-400" aria-hidden />
              <h2 id="highlights-heading" className="font-display text-xl font-extrabold text-white sm:text-2xl">
                Highlights
              </h2>
            </div>
            <p id="highlights-week-label" className="text-sm font-medium text-primary-100">
              {weekLabel}
            </p>
          </div>
          <p className="shrink-0 text-right text-[10px] uppercase tracking-wide text-primary-300/80">
            Updated
            <br />
            <time dateTime={updatedAt}>{updatedLabel}</time>
          </p>
        </div>
        <p className="mt-2 text-xs text-primary-200/80">
          Sports, culture, academic updates &amp; school notices for this week.
        </p>
      </div>

      <div className="hide-scrollbar flex-1 overflow-y-auto px-4 py-4 sm:px-5 sm:py-5">
        {items.length > 0 ? (
          <ul className="space-y-3" role="list">
            {items.map((item) => (
              <HighlightItem key={item.id} item={item} />
            ))}
          </ul>
        ) : (
          <p className="rounded-2xl border border-dashed border-white/20 px-4 py-8 text-center text-sm text-primary-200">
            No highlights posted this week. Check back soon.
          </p>
        )}
      </div>
    </aside>
  )
}

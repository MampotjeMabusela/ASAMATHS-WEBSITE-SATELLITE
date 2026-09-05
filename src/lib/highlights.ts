/**
 * Weekly Highlights — update `HIGHLIGHT_ITEMS` each week with school announcements.
 *
 * Categories: sports | culture | academic | general
 * Week label and "Updated" date are derived automatically from today's date.
 */

import { formatShortDate, formatWeekLabel, toIsoDate, getCurrentDate } from "@/lib/dates"

export type HighlightCategory = "sports" | "culture" | "academic" | "general"

export type Highlight = {
  id: string
  category: HighlightCategory
  title: string
  description: string
  /** Optional — e.g. "Wed 4 Sep" or "This Friday, 14:00" */
  when?: string
  /** ISO start date (YYYY-MM-DD) — used by the Calendar page */
  startDate?: string
  /** ISO end date for multi-day highlights */
  endDate?: string
  /** 24-hour time HH:mm */
  time?: string
}

export type HighlightsWeek = {
  weekLabel: string
  /** ISO date when this list was last updated (YYYY-MM-DD) */
  updatedAt: string
  /** Human-readable update label — derived from `updatedAt`. */
  updatedLabel: string
  items: Highlight[]
}

export const HIGHLIGHT_CATEGORY_LABELS: Record<HighlightCategory, string> = {
  sports: "Sports",
  culture: "Culture",
  academic: "Academic",
  general: "General",
}

/** Edit weekly — dates on the homepage and calendar are filled in automatically. */
export const HIGHLIGHT_ITEMS: Highlight[] = [
  {
    id: "sports-none",
    category: "sports",
    title: "No Updates",
    description: "",
  },
  {
    id: "culture-none",
    category: "culture",
    title: "No Updates",
    description: "",
  },
  {
    id: "academic-none",
    category: "academic",
    title: "No Updates",
    description: "",
  },
  {
    id: "general-none",
    category: "general",
    title: "No Updates",
    description: "",
  },
]

/** Highlights with week label and update date derived from today. */
export function getCurrentHighlights(now = new Date()): HighlightsWeek {
  const today = getCurrentDate(now)
  const updatedAt = toIsoDate(today)

  return {
    weekLabel: formatWeekLabel(today),
    updatedAt,
    updatedLabel: formatShortDate(today),
    items: HIGHLIGHT_ITEMS,
  }
}

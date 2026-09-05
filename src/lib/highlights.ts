/**
 * Weekly Highlights — update this file each week with school announcements.
 *
 * Categories: sports | culture | academic | general
 * Set `weekLabel` to the current week (e.g. "Week of 2–6 September 2026").
 * Replace `items` with that week's notices; newest or most important items first.
 */

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
  /** Human-readable update label — keep in sync with `updatedAt`. */
  updatedLabel: string
  items: Highlight[]
}

export const HIGHLIGHT_CATEGORY_LABELS: Record<HighlightCategory, string> = {
  sports: "Sports",
  culture: "Culture",
  academic: "Academic",
  general: "General",
}

/** Current week's highlights — edit weekly */
export const CURRENT_HIGHLIGHTS: HighlightsWeek = {
  weekLabel: "Week of 1–5 September 2026",
  updatedAt: "2026-09-05",
  updatedLabel: "5 Sep 2026",
  items: [
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
  ],
}

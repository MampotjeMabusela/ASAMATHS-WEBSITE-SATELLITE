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
}

export type HighlightsWeek = {
  weekLabel: string
  /** ISO date when this list was last updated (YYYY-MM-DD) */
  updatedAt: string
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
  weekLabel: "Week of 2–6 September 2026",
  updatedAt: "2026-09-02",
  items: [
    {
      id: "term3-assessments",
      category: "academic",
      title: "Term 3 assessments underway",
      description:
        "Formal assessments continue this week. Study timetables were shared in class — please check bags and WhatsApp groups.",
      when: "Mon – Fri",
    },
    {
      id: "soccer-fixtures",
      category: "sports",
      title: "Inter-house soccer fixtures",
      description:
        "House teams play after school on the main field. Spectators welcome — learners must stay in designated areas.",
      when: "Wed 3 Sep · 14:30",
    },
    {
      id: "heritage-prep",
      category: "culture",
      title: "Heritage Day programme planning",
      description:
        "Cultural groups meet during lunch to prepare performances for our Heritage Day celebration later this month.",
      when: "Thu 4 Sep",
    },
    {
      id: "admissions-open",
      category: "general",
      title: "2027 admissions enquiries open",
      description:
        "Families interested in joining Asamaths next year may book a campus visit or start an online application on our Admissions page.",
    },
  ],
}

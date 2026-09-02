/**
 * Weekly home-page highlights — edit this file to publish announcements.
 *
 * Update `weekLabel` and `items` each week (sports, culture, academics, general).
 * Set `published: false` on an item to hide it without deleting the entry.
 */

export type HighlightCategory = "sports" | "culture" | "academic" | "general"

export type HighlightItem = {
  id: string
  category: HighlightCategory
  title: string
  description: string
  /** Optional — e.g. "Mon 8 Sep" or "This Friday" */
  when?: string
  published?: boolean
}

export type WeeklyHighlights = {
  weekLabel: string
  items: HighlightItem[]
}

export const HIGHLIGHT_CATEGORY_LABELS: Record<HighlightCategory, string> = {
  sports: "Sports",
  culture: "Culture",
  academic: "Academic",
  general: "General",
}

export const WEEKLY_HIGHLIGHTS: WeeklyHighlights = {
  weekLabel: "Week of 2 – 6 September 2026",
  items: [
    {
      id: "term3-assessments",
      category: "academic",
      title: "Term 3 assessments underway",
      description:
        "Grade 10–12 learners begin formal assessments this week. Study timetables were shared in class — please check bags and WhatsApp groups.",
      when: "Mon – Fri",
    },
    {
      id: "soccer-fixtures",
      category: "sports",
      title: "Inter-house soccer fixtures",
      description:
        "House teams play after school on the main field. Spectators welcome — learners must stay in designated areas.",
      when: "Wed 3 Sep, 14:30",
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

export function getPublishedHighlights(highlights: WeeklyHighlights = WEEKLY_HIGHLIGHTS): HighlightItem[] {
  return highlights.items.filter((item) => item.published !== false)
}

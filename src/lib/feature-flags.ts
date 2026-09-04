/**
 * Temporary visibility toggles — flip to `true` when ready to publish again.
 */
export const TEMPORARY_VISIBILITY = {
  homepageHighlights: true,
  sportsPage: true,
  culturePage: true,
  uniformCatalogPage: true,
  uniformCatalogImages: false,
  calendarPage: true,
} as const

export function isNavLinkVisible(href: string): boolean {
  if (href === "/sports") return TEMPORARY_VISIBILITY.sportsPage
  if (href === "/culture") return TEMPORARY_VISIBILITY.culturePage
  if (href === "/uniform-catalog") return TEMPORARY_VISIBILITY.uniformCatalogPage
  if (href === "/calendar") return TEMPORARY_VISIBILITY.calendarPage
  return true
}

export function isAsaKnowledgeEntryVisible(id: string): boolean {
  if (id === "sports") return TEMPORARY_VISIBILITY.sportsPage
  if (id === "culture") return TEMPORARY_VISIBILITY.culturePage
  if (id === "uniform") return TEMPORARY_VISIBILITY.uniformCatalogPage
  if (id === "calendar") return TEMPORARY_VISIBILITY.calendarPage
  return true
}

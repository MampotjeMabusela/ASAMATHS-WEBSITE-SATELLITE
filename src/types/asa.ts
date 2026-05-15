export type AsaReply = {
  text: string
  /** Client-side navigation path when the user should see a specific page */
  navigateTo?: string
  /** Short label for the “Take me there” button */
  linkLabel?: string
}

export type AsaKnowledgeEntry = {
  id: string
  keywords: string[]
  buildAnswer: () => string
  navigateTo?: string
  linkLabel?: string
}

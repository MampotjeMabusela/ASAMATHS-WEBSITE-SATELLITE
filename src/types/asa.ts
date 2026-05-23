export type AsaReply = {
  text: string
  /** Client-side navigation path when the user should see a specific page */
  navigateTo?: string
  /** Short label for the “Take me there” button */
  linkLabel?: string
  /** Matched knowledge topic — used for follow-up questions */
  topicId?: string
  /** Optional quick-reply suggestions shown under the message */
  suggestions?: string[]
}

export type AsaKnowledgeEntry = {
  id: string
  keywords: string[]
  /** Higher weight for priority topics when scores tie */
  priority?: number
  buildAnswer: () => string
  navigateTo?: string
  linkLabel?: string
  suggestions?: string[]
}

export type AsaConversationContext = {
  lastTopicId?: string
}

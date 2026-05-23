import { getAsaKnowledgeBase } from "@/lib/asa-knowledge"
import { SCHOOL_INFO } from "@/lib/constants"
import type { AsaConversationContext, AsaKnowledgeEntry, AsaReply } from "@/types/asa"

export { stripAsaFormattingForSpeech, prepareTextForSpeech } from "@/lib/asa-voice"

const NAV_INTENT =
  /\b(take me to|show me|open|go to|navigate to|visit|see)\s+(?:the\s+)?(.+)/i

const FOLLOW_UP_MORE = /^(tell me more|more info|more details|explain more|go on|continue)$/i
const FOLLOW_UP_YES = /^(yes|yeah|yep|sure|ok|okay|please|thanks|thank you)$/i

function normalize(s: string): string {
  return s
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s']/g, " ")
    .replace(/\s+/g, " ")
    .trim()
}

function tokens(s: string): Set<string> {
  const n = normalize(s)
  return new Set(n.split(" ").filter((t) => t.length > 1))
}

function scoreQuery(query: string, entry: AsaKnowledgeEntry): number {
  const q = normalize(query)
  if (!q) return 0
  let score = entry.priority ?? 0

  for (const raw of entry.keywords) {
    const k = normalize(raw)
    if (k.length < 2) continue
    if (q === k) score += 12
    else if (q.includes(k)) score += Math.min(10, 4 + Math.floor(k.length / 3))
    else {
      const qTokens = tokens(query)
      const kTokens = tokens(raw)
      let overlap = 0
      kTokens.forEach((t) => {
        if (qTokens.has(t)) overlap += 2
      })
      score += overlap
    }
  }

  return score
}

function entryToReply(entry: AsaKnowledgeEntry): AsaReply {
  return {
    text: entry.buildAnswer(),
    navigateTo: entry.navigateTo,
    linkLabel: entry.linkLabel,
    topicId: entry.id,
    suggestions: entry.suggestions,
  }
}

function findEntryById(id: string): AsaKnowledgeEntry | undefined {
  return getAsaKnowledgeBase().find((e) => e.id === id)
}

function resolveNavigationIntent(query: string): AsaKnowledgeEntry | null {
  const match = query.match(NAV_INTENT)
  if (!match?.[1]) return null
  const target = normalize(match[1])
  const base = getAsaKnowledgeBase()
  let best: { entry: AsaKnowledgeEntry; score: number } | null = null

  for (const entry of base) {
    if (!entry.navigateTo) continue
    const labels = [
      entry.id.replace(/-/g, " "),
      ...(entry.linkLabel ? [entry.linkLabel] : []),
      ...entry.keywords.slice(0, 6),
    ]
    for (const label of labels) {
      const n = normalize(label)
      if (target.includes(n) || n.includes(target)) {
        const s = n.length
        if (!best || s > best.score) best = { entry, score: s }
      }
    }
  }

  return best?.entry ?? null
}

function menuReply(): AsaReply {
  return {
    text: `Here’s what I can help with:\n\n• **Admissions** — apply online with documents, or ask how enrolment works\n• **Fees** — payments and the fee schedule\n• **Subjects** — grades **R to 7** and learning areas\n• **Contact** — phone, email, WhatsApp, and our enquiry form\n• **About** — location, principal, and school facts\n• **Gallery** — photos of campus life\n\nTap a suggestion below, or ask in your own words.`,
    topicId: "greeting",
    suggestions: [
      "How do I apply?",
      "Contact details",
      "What grades do you teach?",
      "School fees",
    ],
  }
}

function fallbackReply(): AsaReply {
  return {
    text: `I’m not sure I caught that, but I can still help. Try asking about **admissions**, **fees**, **subjects** (Grade R–7), **contact** details, **office hours**, or say **menu** for a full list. If you need a person, the office is happy to talk during **${SCHOOL_INFO.officeHoursLong}**.`,
    navigateTo: "/contact#asa-contact-form",
    linkLabel: "Contact the school",
    topicId: "greeting",
    suggestions: ["How do I apply?", "Phone and email", "What grades?", "Menu"],
  }
}

/**
 * Produce a reply using curated local knowledge (no external AI).
 */
export function getAsaReply(userMessage: string, ctx?: AsaConversationContext): AsaReply {
  const trimmed = userMessage.trim()
  if (!trimmed) {
    return {
      text: "Ask me anything about the school — try **admissions**, **fees**, **contact**, or say **menu** for ideas.",
      suggestions: ["Menu", "How do I apply?", "Contact details"],
    }
  }

  const qNorm = normalize(trimmed)

  if (qNorm === "menu" || qNorm === "help" || qNorm === "options") {
    return menuReply()
  }

  const navEntry = resolveNavigationIntent(trimmed)
  if (navEntry) {
    return {
      ...entryToReply(navEntry),
      text: `Sure — I’ll take you to **${navEntry.linkLabel ?? navEntry.id.replace(/-/g, " ")}**. ${navEntry.buildAnswer()}`,
    }
  }

  if (ctx?.lastTopicId) {
    const last = findEntryById(ctx.lastTopicId)
    if (last && FOLLOW_UP_MORE.test(qNorm)) {
      return entryToReply(last)
    }
    if (last && FOLLOW_UP_YES.test(qNorm) && last.navigateTo) {
      return {
        text: `Opening **${last.linkLabel ?? "that page"}** for you now.`,
        navigateTo: last.navigateTo,
        linkLabel: last.linkLabel,
        topicId: last.id,
      }
    }
  }

  const base = getAsaKnowledgeBase()
  const ranked = base
    .map((entry) => ({ entry, score: scoreQuery(trimmed, entry) }))
    .filter((r) => r.score > 0)
    .sort((a, b) => b.score - a.score)

  const best = ranked[0]
  const second = ranked[1]

  if (best && best.score >= 4) {
    const reply = entryToReply(best.entry)
    if (second && second.score >= best.score - 2 && second.score >= 4) {
      return {
        ...reply,
        text: `${reply.text}\n\nYou might also want **${second.entry.linkLabel ?? second.entry.id.replace(/-/g, " ")}** — just ask if you’d like details.`,
      }
    }
    return reply
  }

  if (best && best.score >= 2) {
    return entryToReply(best.entry)
  }

  return fallbackReply()
}

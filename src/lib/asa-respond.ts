import { getAsaKnowledgeBase } from "@/lib/asa-knowledge"
import { SCHOOL_INFO } from "@/lib/constants"
import type { AsaReply } from "@/types/asa"

/** Strip markdown-ish **bold** for speech synthesis */
export function stripAsaFormattingForSpeech(text: string): string {
  return text.replace(/\*\*([^*]+)\*\*/g, "$1")
}

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
  return new Set(n.split(" ").filter((t) => t.length > 0))
}

function scoreQuery(query: string, keywords: string[]): number {
  const q = normalize(query)
  if (!q) return 0
  let score = 0
  for (const raw of keywords) {
    const k = normalize(raw)
    if (k.length < 2) continue
    if (q.includes(k)) {
      score += Math.min(8, 3 + Math.floor(k.length / 4))
      continue
    }
    const qTokens = tokens(query)
    Array.from(tokens(raw)).forEach((t) => {
      if (t.length > 2 && qTokens.has(t)) score += 2
    })
  }
  return score
}

/**
 * Produce a reply using only local knowledge (no external AI).
 */
export function getAsaReply(userMessage: string): AsaReply {
  const trimmed = userMessage.trim()
  if (!trimmed) {
    return {
      text: "Ask me anything about **Asamaths**—contact details, admissions, fees, or say **menu** for ideas.",
    }
  }

  const base = getAsaKnowledgeBase()
  let best: { entry: (typeof base)[0]; score: number } | null = null

  for (const entry of base) {
    const s = scoreQuery(trimmed, entry.keywords)
    if (!best || s > best.score) best = { entry, score: s }
  }

  const threshold = 3
  if (best && best.score >= threshold) {
    const text = best.entry.buildAnswer()
    return {
      text,
      navigateTo: best.entry.navigateTo,
      linkLabel: best.entry.linkLabel,
    }
  }

  const fuzzy = normalize(trimmed).split(" ").filter((w) => w.length > 3)
  let second: { entry: (typeof base)[0]; score: number } | null = null
  for (const entry of base) {
    let s = 0
    for (const word of fuzzy) {
      if (entry.keywords.some((kw) => normalize(kw).includes(word))) s += 1
    }
    if (!second || s > second.score) second = { entry, score: s }
  }

  if (second && second.score >= 2) {
    const text = second.entry.buildAnswer()
    return {
      text,
      navigateTo: second.entry.navigateTo,
      linkLabel: second.entry.linkLabel,
    }
  }

  return {
    text: `I couldn't match that precisely. I know about **contact**, **admissions**, **fees**, **subjects** and curriculum, **about** the school, **gallery**, and **home**. You can also ask for our **phone**, **email**, **address**, or **Principal ${SCHOOL_INFO.principal}**. Which would you like?`,
    navigateTo: "/contact#asa-contact-form",
    linkLabel: "Contact us",
  }
}

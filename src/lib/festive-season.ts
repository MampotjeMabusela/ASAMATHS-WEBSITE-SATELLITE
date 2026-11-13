/** Festive season window — Christmas & New Year site decorations. */

export function isFestiveSeason(now = new Date()): boolean {
  if (process.env.NEXT_PUBLIC_FESTIVE_DECOR === "true") return true
  if (process.env.NEXT_PUBLIC_FESTIVE_DECOR === "false") return false

  const month = now.getMonth() // 0-based
  const day = now.getDate()

  // 1 November → 15 January (Advent through New Year)
  if (month === 10) return true // November
  if (month === 11) return true // December
  if (month === 0 && day <= 15) return true // January
  return false
}

export const FESTIVE_BANNER_LINES = [
  "Merry Christmas to all parents and students",
  "Happy New Year 2027",
] as const

export function getFestiveGreeting(now = new Date()): string {
  const month = now.getMonth()
  const day = now.getDate()
  if (month === 0 || (month === 11 && day >= 26)) {
    return "Happy New Year 2027 — from Asamaths Institute"
  }
  if (month === 11 && day >= 20) {
    return "Merry Christmas to all parents and students · Happy New Year 2027"
  }
  return "Merry Christmas to all parents and students · Happy New Year 2027"
}

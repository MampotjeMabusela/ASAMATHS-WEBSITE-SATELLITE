/** Shared date helpers — always derive display dates from the current day at runtime. */

export function getCurrentDate(now = new Date()): Date {
  const date = new Date(now)
  date.setHours(12, 0, 0, 0)
  return date
}

export function getCurrentCalendarYear(now = new Date()): number {
  return getCurrentDate(now).getFullYear()
}

export function toIsoDate(date: Date): string {
  const normalized = getCurrentDate(date)
  const year = normalized.getFullYear()
  const month = String(normalized.getMonth() + 1).padStart(2, "0")
  const day = String(normalized.getDate()).padStart(2, "0")
  return `${year}-${month}-${day}`
}

export function getCurrentYearMonth(now = new Date()): string {
  return toIsoDate(getCurrentDate(now)).slice(0, 7)
}

export function formatShortDate(date: Date): string {
  return getCurrentDate(date).toLocaleDateString("en-ZA", {
    day: "numeric",
    month: "short",
    year: "numeric",
  })
}

function getWeekdayRange(date: Date): { start: Date; end: Date } {
  const current = getCurrentDate(date)
  const weekday = current.getDay()
  const mondayOffset = weekday === 0 ? -6 : 1 - weekday
  const start = new Date(current)
  start.setDate(current.getDate() + mondayOffset)
  const end = new Date(start)
  end.setDate(start.getDate() + 4)
  return { start, end }
}

/** e.g. "Week of 1–5 September 2026" (Monday–Friday of the current week). */
export function formatWeekLabel(date: Date): string {
  const { start, end } = getWeekdayRange(date)
  const startDay = start.getDate()
  const endDay = end.getDate()
  const startMonth = start.toLocaleDateString("en-ZA", { month: "long" })
  const endMonth = end.toLocaleDateString("en-ZA", { month: "long" })
  const year = end.getFullYear()

  if (startMonth === endMonth) {
    return `Week of ${startDay}–${endDay} ${startMonth} ${year}`
  }

  return `Week of ${startDay} ${startMonth} – ${endDay} ${endMonth} ${year}`
}

export function getApplicationSchoolYears(now = new Date()): readonly [string, string] {
  const year = getCurrentCalendarYear(now)
  return [String(year), String(year + 1)] as const
}

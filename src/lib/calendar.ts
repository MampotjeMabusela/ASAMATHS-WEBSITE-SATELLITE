import { toIsoDate } from "@/lib/dates"
import {
  getCurrentHighlights,
  HIGHLIGHT_CATEGORY_LABELS,
  type Highlight,
  type HighlightCategory,
} from "@/lib/highlights"

export type CalendarEvent = {
  id: string
  title: string
  description: string
  category: HighlightCategory
  categoryLabel: string
  startDate: string
  endDate: string
  time?: string
  whenLabel?: string
}

const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
] as const

const WEEKDAY_LABELS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"] as const

export function highlightToCalendarEvent(item: Highlight, fallbackDate: string): CalendarEvent {
  const startDate = item.startDate ?? fallbackDate
  const endDate = item.endDate ?? item.startDate ?? fallbackDate

  return {
    id: item.id,
    title: item.title,
    description: item.description,
    category: item.category,
    categoryLabel: HIGHLIGHT_CATEGORY_LABELS[item.category],
    startDate,
    endDate,
    time: item.time,
    whenLabel: item.when,
  }
}

/** Calendar events derived from the current Highlights list (single source of truth). */
export function getCalendarEventsFromHighlights(now = new Date()): CalendarEvent[] {
  const { items, updatedAt } = getCurrentHighlights(now)
  return items.map((item) => highlightToCalendarEvent(item, updatedAt))
}

export function formatCalendarMonthLabel(yearMonth: string): string {
  const [year, month] = yearMonth.split("-").map(Number)
  if (!year || !month) return yearMonth
  return `${MONTHS[month - 1]} ${year}`
}

export function formatDisplayDate(isoDate: string): string {
  const date = parseIsoDate(isoDate)
  return date.toLocaleDateString("en-ZA", {
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
  })
}

export function parseIsoDate(isoDate: string): Date {
  const [year, month, day] = isoDate.split("-").map(Number)
  return new Date(year, (month ?? 1) - 1, day ?? 1, 12, 0, 0, 0)
}

export { toIsoDate }

export function shiftYearMonth(yearMonth: string, delta: number): string {
  const [year, month] = yearMonth.split("-").map(Number)
  const date = new Date(year, (month ?? 1) - 1 + delta, 1, 12)
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`
}

export function eventsInMonth(events: CalendarEvent[], yearMonth: string): CalendarEvent[] {
  const [year, month] = yearMonth.split("-").map(Number)
  const monthStart = toIsoDate(new Date(year, (month ?? 1) - 1, 1, 12))
  const monthEnd = toIsoDate(new Date(year, month ?? 1, 0, 12))

  return events.filter((event) => event.startDate <= monthEnd && event.endDate >= monthStart)
}

export function eventsOnDate(events: CalendarEvent[], isoDate: string): CalendarEvent[] {
  return events.filter((event) => isoDate >= event.startDate && isoDate <= event.endDate)
}

export type CalendarDayCell = {
  isoDate: string
  day: number
  inMonth: boolean
  isToday: boolean
  events: CalendarEvent[]
}

/** Monday-first grid cells for a calendar month. */
export function buildCalendarMonthGrid(
  yearMonth: string,
  events: CalendarEvent[],
  todayIso = toIsoDate(new Date())
): CalendarDayCell[] {
  const [year, month] = yearMonth.split("-").map(Number)
  const firstOfMonth = new Date(year, (month ?? 1) - 1, 1, 12)
  const mondayIndex = (firstOfMonth.getDay() + 6) % 7
  const gridStart = new Date(firstOfMonth)
  gridStart.setDate(firstOfMonth.getDate() - mondayIndex)

  const cells: CalendarDayCell[] = []
  for (let i = 0; i < 42; i++) {
    const date = new Date(gridStart)
    date.setDate(gridStart.getDate() + i)
    const isoDate = toIsoDate(date)
    cells.push({
      isoDate,
      day: date.getDate(),
      inMonth: date.getMonth() === firstOfMonth.getMonth(),
      isToday: isoDate === todayIso,
      events: eventsOnDate(events, isoDate),
    })
  }

  while (cells.length > 35 && cells.slice(-7).every((cell) => !cell.inMonth)) {
    cells.splice(-7, 7)
  }

  return cells
}

export { WEEKDAY_LABELS, MONTHS }

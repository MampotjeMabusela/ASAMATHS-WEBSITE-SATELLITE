"use client"

import { useMemo, useState } from "react"
import Link from "next/link"
import { ChevronLeft, ChevronRight, Sparkles } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  buildCalendarMonthGrid,
  formatCalendarMonthLabel,
  formatDisplayDate,
  shiftYearMonth,
  toIsoDate,
  type CalendarEvent,
  WEEKDAY_LABELS,
} from "@/lib/calendar"
import type { HighlightCategory } from "@/lib/highlights"
import { cn } from "@/lib/utils"

const CATEGORY_STYLES: Record<
  HighlightCategory,
  { badge: string; dot: string; ring: string }
> = {
  sports: {
    badge: "bg-emerald-100 text-emerald-800 ring-emerald-200",
    dot: "bg-emerald-500",
    ring: "ring-emerald-300",
  },
  culture: {
    badge: "bg-violet-100 text-violet-800 ring-violet-200",
    dot: "bg-violet-500",
    ring: "ring-violet-300",
  },
  academic: {
    badge: "bg-sky-100 text-sky-800 ring-sky-200",
    dot: "bg-sky-500",
    ring: "ring-sky-300",
  },
  general: {
    badge: "bg-amber-100 text-amber-900 ring-amber-200",
    dot: "bg-amber-500",
    ring: "ring-amber-300",
  },
}

type SchoolCalendarProps = {
  events: CalendarEvent[]
  initialMonth: string
  weekLabel: string
  updatedLabel: string
}

function sortEvents(events: CalendarEvent[]): CalendarEvent[] {
  return [...events].sort((a, b) => {
    const dateCompare = a.startDate.localeCompare(b.startDate)
    if (dateCompare !== 0) return dateCompare
    return (a.time ?? "").localeCompare(b.time ?? "")
  })
}

export function SchoolCalendar({ events, initialMonth, weekLabel, updatedLabel }: SchoolCalendarProps) {
  const [yearMonth, setYearMonth] = useState(initialMonth)
  const todayIso = toIsoDate(new Date())

  const monthEvents = useMemo(() => {
    return sortEvents(
      events.filter((event) => {
        const monthStart = `${yearMonth}-01`
        const [year, month] = yearMonth.split("-").map(Number)
        const monthEnd = toIsoDate(new Date(year, month ?? 1, 0, 12))
        return event.startDate <= monthEnd && event.endDate >= monthStart
      })
    )
  }, [events, yearMonth])

  const grid = useMemo(
    () => buildCalendarMonthGrid(yearMonth, events, todayIso),
    [events, todayIso, yearMonth]
  )

  return (
    <div className="space-y-8">
      <Card className="border-primary-100 bg-white/90 shadow-sm">
        <CardHeader className="gap-4 border-b border-gray-100 pb-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="mb-2 flex items-center gap-2 text-sm font-medium text-primary-700">
              <Sparkles className="h-4 w-4 text-accent-500" aria-hidden />
              Synced with homepage Highlights
            </div>
            <CardTitle className="font-display text-2xl text-gray-900">
              {formatCalendarMonthLabel(yearMonth)}
            </CardTitle>
            <p className="mt-1 text-sm text-gray-600">
              {weekLabel} · Updated {updatedLabel}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="outline"
              size="icon"
              aria-label="Previous month"
              onClick={() => setYearMonth((current) => shiftYearMonth(current, -1))}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              type="button"
              variant="outline"
              className="min-w-[7rem]"
              onClick={() => setYearMonth(initialMonth)}
            >
              This week
            </Button>
            <Button
              type="button"
              variant="outline"
              size="icon"
              aria-label="Next month"
              onClick={() => setYearMonth((current) => shiftYearMonth(current, 1))}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="mb-2 grid grid-cols-7 gap-1">
            {WEEKDAY_LABELS.map((label) => (
              <div
                key={label}
                className="py-2 text-center text-xs font-semibold uppercase tracking-wide text-gray-500"
              >
                {label}
              </div>
            ))}
          </div>
          <div className="grid grid-cols-7 gap-1">
            {grid.map((cell) => (
              <div
                key={cell.isoDate}
                className={cn(
                  "min-h-[5.5rem] rounded-xl border p-2 sm:min-h-[6.25rem]",
                  cell.inMonth ? "border-gray-200 bg-white" : "border-transparent bg-gray-50/70 text-gray-400",
                  cell.isToday && cell.inMonth && "border-primary-300 ring-2 ring-primary-200"
                )}
              >
                <div className="flex items-start justify-between gap-1">
                  <span
                    className={cn(
                      "inline-flex h-6 w-6 items-center justify-center rounded-full text-xs font-semibold",
                      cell.isToday && cell.inMonth && "bg-primary-700 text-white"
                    )}
                  >
                    {cell.day}
                  </span>
                </div>
                <ul className="mt-1 space-y-1">
                  {cell.events.slice(0, 2).map((event) => {
                    const style = CATEGORY_STYLES[event.category]
                    return (
                      <li key={event.id}>
                        <span
                          className={cn(
                            "block truncate rounded-md px-1.5 py-0.5 text-[10px] font-medium leading-tight sm:text-[11px]",
                            style.badge
                          )}
                          title={event.title}
                        >
                          {event.title}
                        </span>
                      </li>
                    )
                  })}
                  {cell.events.length > 2 ? (
                    <li className="px-1 text-[10px] font-medium text-gray-500">+{cell.events.length - 2} more</li>
                  ) : null}
                </ul>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div>
        <h2 className="font-display text-xl font-bold text-gray-900 sm:text-2xl">
          Events this month
        </h2>
        <p className="mt-1 text-sm text-gray-600">
          The same notices shown in the homepage Highlights box, organised by date.
        </p>
        {monthEvents.length > 0 ? (
          <ul className="mt-5 space-y-4">
            {monthEvents.map((event) => {
              const style = CATEGORY_STYLES[event.category]
              const rangeLabel =
                event.startDate === event.endDate
                  ? formatDisplayDate(event.startDate)
                  : `${formatDisplayDate(event.startDate)} – ${formatDisplayDate(event.endDate)}`

              return (
                <li key={event.id}>
                  <Card className="border-gray-200 shadow-sm">
                    <CardContent className="flex flex-col gap-3 p-5 sm:flex-row sm:items-start sm:justify-between">
                      <div className="min-w-0 space-y-2">
                        <div className="flex flex-wrap items-center gap-2">
                          <Badge className={cn("ring-1 ring-inset", style.badge)}>{event.categoryLabel}</Badge>
                          {event.whenLabel ? (
                            <span className="text-xs font-medium text-gray-500">{event.whenLabel}</span>
                          ) : null}
                        </div>
                        <h3 className="font-display text-lg font-semibold text-gray-900">{event.title}</h3>
                        <p className="text-sm leading-relaxed text-gray-600">{event.description}</p>
                      </div>
                      <div className="shrink-0 text-sm font-medium text-primary-800">
                        <p>{rangeLabel}</p>
                        {event.time ? <p className="mt-0.5 text-gray-600">{event.time}</p> : null}
                      </div>
                    </CardContent>
                  </Card>
                </li>
              )
            })}
          </ul>
        ) : (
          <Card className="mt-5 border-dashed border-gray-200 bg-gray-50/80">
            <CardContent className="p-8 text-center text-sm text-gray-600">
              No highlighted events scheduled for this month. Check another month or return to the{" "}
              <Link href="/#asa-home-hero" className="font-medium text-primary-700 underline">
                homepage Highlights
              </Link>
              .
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}

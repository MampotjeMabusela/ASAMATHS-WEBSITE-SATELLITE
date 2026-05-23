import type { LucideIcon } from "lucide-react"
import { Building2, Clock, MapPin, Hash } from "lucide-react"
import { SCHOOL_INFO } from "@/lib/constants"
import { cn } from "@/lib/utils"

type GlanceItem = {
  icon: LucideIcon
  label: string
  value: string
}

const defaultItems: GlanceItem[] = [
  { icon: Building2, label: "Phase", value: SCHOOL_INFO.phase },
  { icon: Clock, label: "Office hours", value: SCHOOL_INFO.officeHours },
  { icon: MapPin, label: "Location", value: `${SCHOOL_INFO.suburb}, ${SCHOOL_INFO.city}` },
  { icon: Hash, label: "NatEmis", value: SCHOOL_INFO.natEmis },
]

export function AtAGlanceStrip({
  items = defaultItems,
  className,
}: {
  items?: GlanceItem[]
  className?: string
}) {
  return (
    <div
      className={cn(
        "mb-10 grid gap-3 rounded-2xl border border-primary-100 bg-white p-4 shadow-sm sm:grid-cols-2 lg:grid-cols-4 sm:p-5",
        className,
      )}
    >
      {items.map((item) => (
        <div key={item.label} className="flex items-start gap-3 rounded-xl bg-primary-50/50 p-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary-600 text-white">
            <item.icon className="h-5 w-5" aria-hidden />
          </div>
          <div className="min-w-0">
            <p className="text-xs font-semibold uppercase tracking-wide text-primary-600">{item.label}</p>
            <p className="mt-0.5 text-sm font-medium text-gray-900">{item.value}</p>
          </div>
        </div>
      ))}
    </div>
  )
}

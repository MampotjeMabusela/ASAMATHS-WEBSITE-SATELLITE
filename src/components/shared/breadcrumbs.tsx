import Link from "next/link"
import { ChevronRight, Home } from "lucide-react"
import { cn } from "@/lib/utils"

export type BreadcrumbItem = {
  label: string
  href?: string
}

type BreadcrumbsProps = {
  items: BreadcrumbItem[]
  className?: string
}

export function Breadcrumbs({ items, className }: BreadcrumbsProps) {
  if (items.length === 0) return null

  return (
    <nav aria-label="Breadcrumb" className={cn("mb-6", className)}>
      <ol className="flex flex-wrap items-center gap-1.5 text-sm text-gray-500">
        <li className="flex items-center gap-1.5">
          <Link
            href="/"
            className="inline-flex items-center gap-1 rounded-sm transition hover:text-primary-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-600 focus-visible:ring-offset-2"
          >
            <Home className="h-3.5 w-3.5" aria-hidden />
            <span className="sr-only">Home</span>
          </Link>
        </li>
        {items.map((item, i) => {
          const isLast = i === items.length - 1
          return (
            <li key={`${item.label}-${i}`} className="flex items-center gap-1.5">
              <ChevronRight className="h-3.5 w-3.5 shrink-0 text-gray-300" aria-hidden />
              {item.href && !isLast ? (
                <Link
                  href={item.href}
                  className="rounded-sm font-medium transition hover:text-primary-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-600 focus-visible:ring-offset-2"
                >
                  {item.label}
                </Link>
              ) : (
                <span className="font-medium text-gray-800" aria-current={isLast ? "page" : undefined}>
                  {item.label}
                </span>
              )}
            </li>
          )
        })}
      </ol>
    </nav>
  )
}

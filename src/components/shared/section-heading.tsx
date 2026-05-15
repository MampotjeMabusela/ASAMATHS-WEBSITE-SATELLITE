import { cn } from "@/lib/utils"

interface SectionHeadingProps {
  title: string
  subtitle?: string
  align?: "left" | "center"
  className?: string
}

export function SectionHeading({
  title,
  subtitle,
  align = "center",
  className,
}: SectionHeadingProps) {
  return (
    <div
      className={cn(
        "mb-12 w-full max-w-none",
        align === "center" && "mx-auto text-center",
        className
      )}
    >
      <h2 className="font-display text-3xl font-bold text-gray-900 sm:text-4xl">{title}</h2>
      {subtitle && <p className="mt-4 text-lg text-gray-500">{subtitle}</p>}
      <div className={cn("mt-4 h-1 w-16 rounded-full bg-primary-600", align === "center" && "mx-auto")} />
    </div>
  )
}

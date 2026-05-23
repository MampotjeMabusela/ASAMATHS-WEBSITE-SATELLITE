import { cn } from "@/lib/utils"

interface SectionHeadingProps {
  title: string
  subtitle?: string
  eyebrow?: string
  align?: "left" | "center"
  as?: "h1" | "h2"
  className?: string
}

export function SectionHeading({
  title,
  subtitle,
  eyebrow,
  align = "center",
  as: Tag = "h2",
  className,
}: SectionHeadingProps) {
  return (
    <div
      className={cn(
        "mb-12 w-full max-w-none",
        align === "center" && "mx-auto text-center",
        className,
      )}
    >
      {eyebrow ? (
        <p
          className={cn(
            "mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-primary-600",
            align === "center" && "mx-auto",
          )}
        >
          {eyebrow}
        </p>
      ) : null}
      <Tag className="font-display text-3xl font-bold text-gray-900 sm:text-4xl">{title}</Tag>
      {subtitle && <p className="mt-4 text-lg text-gray-500">{subtitle}</p>}
      <div className={cn("mt-4 h-1 w-16 rounded-full bg-primary-600", align === "center" && "mx-auto")} />
    </div>
  )
}

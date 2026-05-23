"use client"

import { cn } from "@/lib/utils"
import { BRAND } from "@/lib/constants"

type SiteLogoVariant = "header" | "footer"

const logoSrcWithCache = `${BRAND.logoSrc}?v=${BRAND.logoAssetVersion}`

/** Footer chrome — must match `footer` in footer.tsx */
const FOOTER_BG = "#0a0f1a"

/**
 * Crest on header/footer — no card, border, ring, or shadow.
 * Logo PNG uses a transparent background so colours stay visible on white (header) and dark (footer).
 */
const shell: Record<
  SiteLogoVariant,
  { wrap: string; img: string; surface: string }
> = {
  header: {
    wrap: "relative flex h-[3.75rem] w-[168px] shrink-0 items-center justify-center sm:h-[4rem] sm:w-[188px] md:h-[4.25rem] md:w-[200px]",
    surface: "bg-white",
    img: "max-h-full max-w-full object-contain object-center",
  },
  footer: {
    wrap: "relative flex h-[4.5rem] w-[192px] shrink-0 items-center justify-center sm:h-[4.25rem] sm:w-[210px]",
    surface: "bg-[#0a0f1a]",
    img: "max-h-full max-w-full object-contain object-center",
  },
}

const placeholderShell: Record<SiteLogoVariant, string> = {
  header:
    "flex h-[3.75rem] w-[168px] shrink-0 flex-col items-center justify-center sm:h-[4rem] sm:w-[188px] md:h-[4.25rem] md:w-[200px]",
  footer:
    "flex h-[4.5rem] w-[192px] shrink-0 flex-col items-center justify-center sm:h-[4.25rem] sm:w-[210px]",
}

export function SiteLogo({
  variant,
  className,
  isScrolled = false,
}: {
  variant: SiteLogoVariant
  className?: string
  /** Header only: crest surface matches solid vs frosted bar. */
  isScrolled?: boolean
}) {
  if (BRAND.showLogoPlaceholder) {
    return (
      <div
        className={cn(
          placeholderShell[variant],
          variant === "header" && "border border-dashed border-gray-300/70 text-primary-700/75",
          variant === "footer" && "border border-dashed border-white/30 text-primary-200/90",
          className
        )}
        role="img"
        aria-label="School crest — final artwork will appear here"
      >
        <span
          className={cn(
            "max-w-[11rem] text-center text-[0.625rem] font-semibold uppercase leading-snug tracking-[0.14em]",
            variant === "header" && "text-primary-700/80",
            variant === "footer" && "text-primary-200/95"
          )}
        >
          Crest
          <span className="mt-0.5 block font-normal normal-case tracking-normal text-[0.55rem] opacity-80">
            placeholder
          </span>
        </span>
      </div>
    )
  }

  const styles = shell[variant]
  const surfaceClass =
    variant === "header"
      ? isScrolled
        ? "bg-white/95 backdrop-blur-md"
        : styles.surface
      : styles.surface

  return (
    <div
      className={cn(styles.wrap, surfaceClass, className)}
      style={variant === "footer" ? { backgroundColor: FOOTER_BG } : undefined}
    >
      <img
        src={logoSrcWithCache}
        alt={BRAND.logoAlt}
        width={640}
        height={640}
        decoding="async"
        fetchPriority={variant === "header" ? "high" : undefined}
        className={cn(
          styles.img,
          variant === "footer" && "drop-shadow-[0_2px_12px_rgba(0,0,0,0.35)]"
        )}
      />
    </div>
  )
}

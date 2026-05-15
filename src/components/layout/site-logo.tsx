"use client"

import Image from "next/image"
import { cn } from "@/lib/utils"
import { BRAND } from "@/lib/constants"

type SiteLogoVariant = "header" | "footer"

const logoSrcWithCache = `${BRAND.logoSrc}?v=${BRAND.logoAssetVersion}`

/**
 * Crest sits directly on the header/footer — no card, border, or shadow.
 * Header uses a plain `<img>` so `mix-blend-multiply` composites correctly (Next `<Image fill>`
 * wraps the bitmap in extra layers and the blend often looks like a no-op). The header crest
 * wrapper repeats the same surface as the bar (`bg-white` / `bg-white/95` + blur) so the
 * crest’s white matting matches the bar, including after scroll.
 * Footer keeps Next `Image` + `rounded-2xl` on dark chrome.
 */
const imageShell: Record<
  SiteLogoVariant,
  { wrap: string; img: string; sizes: string; quality: number; priority?: boolean }
> = {
  header: {
    wrap: "relative h-[3.75rem] w-[165px] shrink-0 overflow-hidden rounded-md sm:h-[3.9rem] sm:w-[185px] md:h-[4.375rem] md:w-[198px]",
    img: "mix-blend-multiply",
    sizes: "(max-width:768px) 250px, 300px",
    quality: 95,
    priority: true,
  },
  footer: {
    wrap: "relative h-[4.53rem] w-[190px] shrink-0 sm:h-[4.375rem] sm:w-[212px]",
    img: "object-contain object-center rounded-2xl",
    sizes: "(max-width:768px) 275px, 320px",
    quality: 95,
  },
}

const placeholderShell: Record<SiteLogoVariant, string> = {
  header:
    "flex h-[3.75rem] w-[165px] shrink-0 flex-col items-center justify-center rounded-2xl sm:h-[3.9rem] sm:w-[185px] md:h-[4.375rem] md:w-[198px]",
  footer:
    "flex h-[4.53rem] w-[190px] shrink-0 flex-col items-center justify-center rounded-2xl sm:h-[4.375rem] sm:w-[212px]",
}

export function SiteLogo({
  variant,
  className,
  isScrolled = false,
}: {
  variant: SiteLogoVariant
  className?: string
  /** Header only: keep crest surface in sync with the fixed header (solid vs frosted). */
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

  const shell = imageShell[variant]

  if (variant === "header") {
    return (
      <div
        className={cn(
          shell.wrap,
          isScrolled ? "bg-white/95 backdrop-blur-md" : "bg-white",
          "flex items-center justify-center",
          className
        )}
      >
        {/* Native img: blend mode reliably affects the real header / frosted layer behind */}
        <img
          src={logoSrcWithCache}
          alt={BRAND.logoAlt}
          width={640}
          height={640}
          decoding="async"
          fetchPriority="high"
          className={cn("max-h-full max-w-full object-contain", shell.img)}
        />
      </div>
    )
  }

  return (
    <div className={cn(shell.wrap, className)}>
      <Image
        src={logoSrcWithCache}
        alt={BRAND.logoAlt}
        fill
        className={shell.img}
        sizes={shell.sizes}
        quality={shell.quality}
      />
    </div>
  )
}

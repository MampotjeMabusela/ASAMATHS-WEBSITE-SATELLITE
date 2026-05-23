import Image from "next/image"
import type { ReactNode } from "react"
import { cn } from "@/lib/utils"
import { STUDENT_PHOTO_BLUR_DATA_URL } from "@/lib/student-photo-blur"
import { photoSrc } from "@/lib/student-photos"

type PageBannerVariant = "hero" | "wide" | "compact"

export type PageBannerProps = {
  src: string
  alt: string
  headline: string
  subline?: string
  badge?: string
  variant?: PageBannerVariant
  objectPosition?: string
  /** Use contain for logos or artwork with padding; default is cover for photos. */
  imageFit?: "cover" | "contain"
  /** Horizontal nudge for the image focal point (percent from center; positive = right). */
  imageOffsetX?: number
  /** Rich overlays, glow, and polish — best for crest / logo banners. */
  enhanced?: boolean
  className?: string
  priority?: boolean
}

const variantStyles: Record<PageBannerVariant, string> = {
  hero: "aspect-[21/10] min-h-[200px] md:min-h-[260px] lg:min-h-[300px]",
  wide: "aspect-[21/9] min-h-[180px] md:min-h-[220px]",
  compact: "aspect-[21/11] min-h-[160px] sm:min-h-[180px]",
}

export function PageBanner({
  src,
  alt,
  headline,
  subline,
  badge,
  variant = "wide",
  objectPosition,
  imageFit = "cover",
  imageOffsetX = 0,
  enhanced = false,
  className,
  priority = false,
}: PageBannerProps) {
  const isLogoBanner = imageFit === "contain"
  const resolvedObjectPosition =
    objectPosition ?? `${50 + imageOffsetX}% center`
  const gradient = enhanced
    ? "from-primary-950/75 via-primary-900/20 to-transparent"
    : isLogoBanner
      ? "from-primary-950/55 via-primary-900/15 to-transparent"
      : variant === "compact"
        ? "from-primary-950/70 via-primary-900/35 to-primary-800/20"
        : "from-primary-950/80 via-primary-900/45 to-primary-700/25"

  return (
    <BannerFrame variant={variant} className={className} enhanced={enhanced}>
      {enhanced ? <BannerBackdrop /> : null}
      <Image
        src={photoSrc(src)}
        alt={alt}
        fill
        priority={priority}
        placeholder="blur"
        blurDataURL={STUDENT_PHOTO_BLUR_DATA_URL}
        className={cn(
          imageFit === "contain"
            ? cn(
                "object-contain p-6 sm:p-10",
                enhanced
                  ? "z-[1] bg-transparent drop-shadow-[0_10px_40px_rgba(30,64,175,0.22)]"
                  : "bg-white",
              )
            : "object-cover",
        )}
        style={{ objectPosition: resolvedObjectPosition }}
        sizes="100vw"
      />
      {enhanced ? <BannerDecorations /> : null}
      <div
        className="pointer-events-none absolute inset-0 z-[2] opacity-[0.07]"
        style={{
          backgroundImage: `radial-gradient(circle at 20% 30%, white 1px, transparent 1px)`,
          backgroundSize: "28px 28px",
        }}
        aria-hidden
      />
      <div
        className={cn(
          "pointer-events-none absolute -right-16 top-0 z-[2] h-48 w-48 rounded-full blur-3xl",
          enhanced ? "bg-accent-400/40" : "bg-accent-400/20",
        )}
        aria-hidden
      />
      <div
        className={cn(
          "pointer-events-none absolute -left-20 bottom-0 z-[2] h-56 w-56 rounded-full blur-3xl",
          enhanced && "bg-primary-400/30",
        )}
        aria-hidden
      />
      <div className={cn("absolute inset-0 z-[3] bg-gradient-to-r", gradient)} />
      <div className="absolute inset-0 z-[4] flex flex-col justify-end p-5 sm:p-7 md:p-8">
        {badge ? (
          <span
            className={cn(
              "mb-3 inline-flex w-fit rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-wider backdrop-blur-sm",
              enhanced
                ? "border-accent-300/50 bg-gradient-to-r from-primary-800/80 to-primary-700/70 text-white shadow-lg shadow-primary-950/30"
                : "border-white/25 bg-white/15 text-white",
            )}
          >
            {badge}
          </span>
        ) : null}
        <p className="max-w-3xl font-display text-xl font-bold leading-tight text-white drop-shadow-md sm:text-2xl md:text-3xl">
          {headline}
        </p>
        {subline ? (
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-primary-100/95 sm:text-base">{subline}</p>
        ) : null}
      </div>
    </BannerFrame>
  )
}

function BannerBackdrop() {
  return (
    <div
      className="pointer-events-none absolute inset-0 bg-gradient-to-br from-primary-100 via-white to-accent-50/60"
      aria-hidden
    />
  )
}

function BannerDecorations() {
  return (
    <>
      <div
        className="pointer-events-none absolute inset-y-0 right-[-5%] w-[65%]"
        style={{
          background:
            "radial-gradient(ellipse 70% 80% at 58% 50%, rgba(250,204,21,0.28) 0%, rgba(30,64,175,0.08) 45%, transparent 72%)",
        }}
        aria-hidden
      />
      <div
        className="pointer-events-none absolute left-0 top-1/2 h-40 w-40 -translate-y-1/2 rounded-full opacity-40 blur-2xl"
        style={{ background: "radial-gradient(circle, rgba(34,197,94,0.2) 0%, transparent 70%)" }}
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.12]"
        style={{
          background:
            "linear-gradient(115deg, transparent 35%, rgba(255,255,255,0.9) 50%, transparent 65%)",
        }}
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse at center, transparent 42%, rgba(15,23,42,0.12) 100%)",
        }}
        aria-hidden
      />
      <span
        className="pointer-events-none absolute left-4 top-4 h-8 w-8 border-l-2 border-t-2 border-accent-400/50"
        aria-hidden
      />
      <span
        className="pointer-events-none absolute right-4 top-4 h-8 w-8 border-r-2 border-t-2 border-accent-400/50"
        aria-hidden
      />
      <span
        className="pointer-events-none absolute bottom-4 left-4 h-8 w-8 border-b-2 border-l-2 border-primary-400/40"
        aria-hidden
      />
      <span
        className="pointer-events-none absolute bottom-4 right-4 h-8 w-8 border-b-2 border-r-2 border-primary-400/40"
        aria-hidden
      />
      <div className="pointer-events-none absolute inset-0 overflow-hidden opacity-30" aria-hidden>
        <div className="banner-shimmer absolute -inset-full h-[200%] w-1/3 rotate-12 bg-gradient-to-r from-transparent via-white/40 to-transparent" />
      </div>
    </>
  )
}

function BannerFrame({
  variant,
  className,
  enhanced,
  children,
}: {
  variant: PageBannerVariant
  className?: string
  enhanced?: boolean
  children: ReactNode
}) {
  return (
    <div
      className={cn(
        "relative w-full overflow-hidden rounded-3xl shadow-xl ring-1 ring-primary-200/80",
        enhanced && "shadow-2xl shadow-primary-900/15 ring-primary-300/60",
        variantStyles[variant],
        className,
      )}
    >
      {children}
    </div>
  )
}

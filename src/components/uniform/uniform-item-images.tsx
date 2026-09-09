"use client"

import Image from "next/image"
import { useCallback, useState } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog"
import { cn } from "@/lib/utils"
import type { UniformItemImage } from "@/lib/uniform-catalog"

type UniformItemImagesProps = {
  images: UniformItemImage[]
  itemName: string
  variant?: "default" | "compact"
}

export function UniformItemImages({ images, itemName, variant = "default" }: UniformItemImagesProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null)
  const active = openIndex !== null ? images[openIndex] : null
  const compact = variant === "compact"

  const onClose = useCallback(() => setOpenIndex(null), [])

  const goPrev = useCallback(() => {
    setOpenIndex((i) => (i === null ? null : (i - 1 + images.length) % images.length))
  }, [images.length])

  const goNext = useCallback(() => {
    setOpenIndex((i) => (i === null ? null : (i + 1) % images.length))
  }, [images.length])

  return (
    <>
      <div className={cn("flex flex-wrap gap-2", compact ? "justify-start" : "justify-center gap-3")}>
        {images.map((image, index) => (
          <figure
            key={image.src}
            className={cn(
              "overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm",
              compact ? "ring-1 ring-gray-100" : "rounded-xl"
            )}
          >
            <button
              type="button"
              onClick={() => setOpenIndex(index)}
              className={cn(
                "group relative block cursor-zoom-in",
                compact ? "h-24 w-32 sm:h-28 sm:w-40" : "h-36 w-44 sm:h-40 sm:w-52"
              )}
              aria-label={`View larger image of ${itemName}${image.label ? ` (${image.label})` : ""}`}
            >
              <Image
                src={image.src}
                alt={image.alt}
                fill
                className="object-contain p-1 transition-transform duration-200 group-hover:scale-[1.02] sm:p-1.5"
                sizes={compact ? "96px" : "128px"}
              />
            </button>
            {image.label ? (
              <figcaption
                className={cn(
                  "border-t border-gray-100 bg-gray-50 text-center font-medium text-gray-600",
                  compact ? "px-1.5 py-0.5 text-[10px]" : "px-2 py-1 text-[11px]"
                )}
              >
                {image.label}
              </figcaption>
            ) : null}
          </figure>
        ))}
      </div>

      <Dialog open={active !== null} onOpenChange={(open) => !open && onClose()}>
        <DialogContent className="w-[min(92vw,28rem)] max-w-none gap-3 border-gray-200 p-4 sm:p-5">
          {active && openIndex !== null ? (
            <>
              <DialogTitle className="pr-8 text-center font-display text-base font-semibold text-gray-900 sm:text-lg">
                {itemName}
                {active.label ? (
                  <span className="mt-0.5 block text-sm font-normal text-gray-500">{active.label}</span>
                ) : null}
              </DialogTitle>
              <DialogDescription className="sr-only">{active.alt}</DialogDescription>

              <div className="relative mx-auto h-[min(70vh,28rem)] w-full rounded-lg bg-white ring-1 ring-gray-200">
                <Image
                  src={active.src}
                  alt={active.alt}
                  fill
                  className="object-contain p-3 sm:p-4"
                  sizes="(max-width: 640px) 92vw, 28rem"
                  priority
                />
              </div>

              {images.length > 1 ? (
                <div className="flex items-center justify-center gap-2">
                  <Button type="button" variant="outline" size="icon" onClick={goPrev} aria-label="Previous image">
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <span className="min-w-[3.5rem] text-center text-xs font-medium text-gray-500">
                    {openIndex + 1} / {images.length}
                  </span>
                  <Button type="button" variant="outline" size="icon" onClick={goNext} aria-label="Next image">
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              ) : null}
            </>
          ) : null}
        </DialogContent>
      </Dialog>
    </>
  )
}

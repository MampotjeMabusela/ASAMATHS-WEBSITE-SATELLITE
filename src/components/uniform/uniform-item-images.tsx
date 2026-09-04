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
import type { UniformItemImage } from "@/lib/uniform-catalog"

type UniformItemImagesProps = {
  images: UniformItemImage[]
  itemName: string
}

export function UniformItemImages({ images, itemName }: UniformItemImagesProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null)
  const active = openIndex !== null ? images[openIndex] : null

  const onClose = useCallback(() => setOpenIndex(null), [])

  const goPrev = useCallback(() => {
    setOpenIndex((i) => (i === null ? null : (i - 1 + images.length) % images.length))
  }, [images.length])

  const goNext = useCallback(() => {
    setOpenIndex((i) => (i === null ? null : (i + 1) % images.length))
  }, [images.length])

  return (
    <>
      <div className="flex flex-wrap justify-center gap-3">
        {images.map((image, index) => (
          <figure
            key={image.src}
            className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm"
          >
            <button
              type="button"
              onClick={() => setOpenIndex(index)}
              className="group relative block h-36 w-28 cursor-zoom-in sm:h-40 sm:w-32"
              aria-label={`View larger image of ${itemName}${image.label ? ` (${image.label})` : ""}`}
            >
              <Image
                src={image.src}
                alt={image.alt}
                fill
                className="object-contain p-2 transition-transform duration-200 group-hover:scale-[1.03]"
                sizes="128px"
              />
            </button>
            {image.label ? (
              <figcaption className="border-t border-gray-100 bg-gray-50 px-2 py-1 text-center text-[11px] font-medium text-gray-600">
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

              <div className="relative mx-auto h-[min(62vh,22rem)] w-full rounded-lg bg-gray-50 ring-1 ring-gray-100">
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

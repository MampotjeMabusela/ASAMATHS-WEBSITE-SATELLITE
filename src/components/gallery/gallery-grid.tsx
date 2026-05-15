"use client"

import Image from "next/image"
import { useCallback, useState } from "react"
import { FadeIn } from "@/components/shared/fade-in"
import type { GalleryItem } from "@/lib/student-photos"
import { STUDENT_PHOTO_BLUR_DATA_URL } from "@/lib/student-photo-blur"
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"

interface GalleryGridProps {
  items: GalleryItem[]
}

export function GalleryGrid({ items }: GalleryGridProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null)
  const active = openIndex !== null ? items[openIndex] : null

  const onClose = useCallback(() => setOpenIndex(null), [])

  return (
    <>
      <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
        {items.map((item, i) => (
          <FadeIn key={item.src} delay={i * 0.06}>
            <button
              type="button"
              onClick={() => setOpenIndex(i)}
              className="group block w-full cursor-zoom-in rounded-2xl border border-gray-200 bg-white text-left shadow-sm transition-[border-color,box-shadow] hover:border-primary-200 hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white"
            >
              <figure className="overflow-hidden rounded-2xl">
                <div className="relative aspect-[4/3] overflow-hidden">
                  <Image
                    src={item.src}
                    alt={item.alt}
                    fill
                    placeholder="blur"
                    blurDataURL={STUDENT_PHOTO_BLUR_DATA_URL}
                    className="object-cover transition-transform duration-300 group-hover:scale-[1.03] group-focus-visible:scale-[1.02]"
                    sizes="(max-width:640px)100vw,(max-width:1280px)50vw,33vw"
                  />
                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-primary-950/50 via-transparent to-transparent opacity-90 transition-opacity group-hover:opacity-100" />
                  <span className="pointer-events-none absolute bottom-3 right-3 rounded-md bg-black/45 px-2 py-1 text-[10px] font-medium uppercase tracking-wide text-white backdrop-blur-sm">
                    Tap to enlarge
                  </span>
                </div>
                <figcaption className="p-4">
                  <h3 className="font-display text-lg font-semibold text-gray-900">{item.title}</h3>
                  <p className="mt-1 text-sm text-gray-500">{item.caption}</p>
                </figcaption>
              </figure>
            </button>
          </FadeIn>
        ))}
      </div>

      <Dialog open={active !== null} onOpenChange={(o) => !o && onClose()}>
        <DialogContent className="max-h-[94vh] w-[min(96vw,56rem)] max-w-none gap-4 overflow-auto border-gray-200 p-3 sm:p-6">
          {active && (
            <>
              <DialogTitle className="pr-8 text-lg font-semibold leading-snug text-gray-900">{active.title}</DialogTitle>
              <DialogDescription className="sr-only">{active.alt}</DialogDescription>
              <div className="relative mx-auto aspect-[4/3] w-full max-h-[min(78vh,640px)] min-h-[180px] rounded-lg bg-gray-100 ring-1 ring-gray-100">
                <Image
                  src={active.src}
                  alt={active.alt}
                  fill
                  placeholder="blur"
                  blurDataURL={STUDENT_PHOTO_BLUR_DATA_URL}
                  className="object-contain"
                  sizes="96vw"
                  priority={false}
                />
              </div>
              <p className="text-sm leading-relaxed text-gray-600">{active.caption}</p>
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  )
}

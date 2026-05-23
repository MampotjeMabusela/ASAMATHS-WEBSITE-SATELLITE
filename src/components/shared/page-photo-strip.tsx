import Image from "next/image"
import { cn } from "@/lib/utils"
import { STUDENT_PHOTO_BLUR_DATA_URL } from "@/lib/student-photo-blur"
import { photoSrc } from "@/lib/student-photos"

export type PagePhotoStripItem = {
  src: string
  alt: string
  label: string
  objectPosition?: string
}

export function PagePhotoStrip({
  items,
  className,
}: {
  items: readonly [PagePhotoStripItem, PagePhotoStripItem]
  className?: string
}) {
  return (
    <div className={cn("grid gap-4 sm:grid-cols-2 sm:gap-5", className)}>
      {items.map((item) => (
        <figure
          key={item.src}
          className="group relative aspect-[4/3] overflow-hidden rounded-2xl shadow-md ring-1 ring-gray-200/90 transition-shadow hover:shadow-lg"
        >
          <Image
            src={photoSrc(item.src)}
            alt={item.alt}
            fill
            placeholder="blur"
            blurDataURL={STUDENT_PHOTO_BLUR_DATA_URL}
            className="object-cover transition-transform duration-500 group-hover:scale-[1.02]"
            style={{ objectPosition: item.objectPosition ?? "center" }}
            sizes="(max-width:640px)100vw,50vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-primary-950/75 via-primary-900/15 to-transparent" />
          <figcaption className="absolute bottom-0 left-0 right-0 p-4">
            <p className="font-display text-sm font-semibold text-white drop-shadow sm:text-base">{item.label}</p>
          </figcaption>
        </figure>
      ))}
    </div>
  )
}

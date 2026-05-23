import Image from "next/image"
import { STUDENT_PHOTO_BLUR_DATA_URL } from "@/lib/student-photo-blur"
import { CAMPUS_PHOTOS, photoSrc } from "@/lib/student-photos"
import { FadeIn } from "@/components/shared/fade-in"

const featured = [
  {
    src: CAMPUS_PHOTOS.building,
    alt: "Asamaths Institute campus buildings and courtyard",
    label: "Campus & facilities",
    className: "sm:col-span-2 sm:row-span-2",
    objectPosition: "center 40%",
  },
  {
    src: CAMPUS_PHOTOS.friends,
    alt: "Two learners in uniform in class",
    label: "Our learners",
    className: "",
    objectPosition: "center 30%",
  },
  {
    src: CAMPUS_PHOTOS.courtyardWalk,
    alt: "Staff and learner on the courtyard",
    label: "School life",
    className: "",
    objectPosition: "center 35%",
  },
  {
    src: CAMPUS_PHOTOS.classroomGroup,
    alt: "Classroom of attentive learners",
    label: "In the classroom",
    className: "sm:col-span-2",
    objectPosition: "center 40%",
  },
] as const

export function GalleryFeatured() {
  return (
    <FadeIn className="mb-10">
      <div className="grid gap-3 sm:grid-cols-4 sm:grid-rows-2 sm:gap-4">
        {featured.map((item) => (
          <figure
            key={item.src}
            className={`relative min-h-[140px] overflow-hidden rounded-2xl shadow-md ring-1 ring-primary-200/70 sm:min-h-[160px] ${item.className}`}
          >
            <Image
              src={photoSrc(item.src)}
              alt={item.alt}
              fill
              placeholder="blur"
              blurDataURL={STUDENT_PHOTO_BLUR_DATA_URL}
              className="object-cover"
              style={{ objectPosition: item.objectPosition }}
              sizes="(max-width:640px)100vw,50vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-primary-950/70 via-primary-900/20 to-transparent" />
            <figcaption className="absolute bottom-3 left-3 right-3">
              <span className="inline-block rounded-md bg-black/40 px-2.5 py-1 text-xs font-semibold text-white backdrop-blur-sm">
                {item.label}
              </span>
            </figcaption>
          </figure>
        ))}
      </div>
    </FadeIn>
  )
}

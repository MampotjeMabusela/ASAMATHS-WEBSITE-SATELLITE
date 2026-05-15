import Image from "next/image"
import { SCHOOL_INFO } from "@/lib/constants"
import { STUDENT_PHOTO_BLUR_DATA_URL } from "@/lib/student-photo-blur"
import { STUDENT_PHOTOS } from "@/lib/student-photos"

/** Full-width celebratory strip — complements existing hero/media without replacing them. */
export function CommunitySpotlight() {
  return (
    <section className="relative isolate w-full overflow-hidden" aria-label="Community spotlight">
      <div className="relative h-[200px] w-full md:h-[280px] lg:h-[300px]">
        <Image
          src={STUDENT_PHOTOS.classroomCelebration}
          alt={`Intermediate-phase classmates celebrating participation during a lesson at ${SCHOOL_INFO.shortName}`}
          fill
          placeholder="blur"
          blurDataURL={STUDENT_PHOTO_BLUR_DATA_URL}
          className="object-cover object-[center_40%]"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-primary-950/82 via-primary-800/65 to-primary-600/55" />
        <div className="container-custom relative z-10 flex h-full items-center px-4 sm:px-6">
          <p className="max-w-none font-display text-xl font-bold leading-snug text-white drop-shadow-md sm:text-2xl md:text-3xl md:leading-tight">
            Proud moments happen every day—we learn, lift each other up, and keep growing.
          </p>
        </div>
      </div>
    </section>
  )
}

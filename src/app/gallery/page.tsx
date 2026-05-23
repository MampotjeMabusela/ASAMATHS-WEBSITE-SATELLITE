import type { Metadata } from "next"
import Link from "next/link"
import { FadeIn } from "@/components/shared/fade-in"
import { PageIntro } from "@/components/shared/page-intro"
import { GalleryFeatured } from "@/components/gallery/gallery-featured"
import { GalleryGrid } from "@/components/gallery/gallery-grid"
import { PageBanner } from "@/components/shared/page-banner"
import { CAMPUS_PHOTOS } from "@/lib/student-photos"
import { CTABanner } from "@/components/sections/cta-banner"
import { SCHOOL_INFO } from "@/lib/constants"
import { GALLERY_ITEMS } from "@/lib/student-photos"

export const metadata: Metadata = {
  title: "Gallery",
  description: `View photos and images from ${SCHOOL_INFO.name} in ${SCHOOL_INFO.suburb}, ${SCHOOL_INFO.city}.`,
}

export default function GalleryPage() {
  return (
    <>
      <section id="asa-gallery" className="scroll-mt-28 bg-gradient-to-br from-primary-50 to-white pb-16 pt-32">
        <div className="container-custom">
          <FadeIn>
            <PageIntro
              eyebrow="Campus life"
              title="Our Gallery"
              subtitle="A glimpse into life at Asamaths Institute"
              breadcrumbs={[{ label: "Gallery" }]}
            />
          </FadeIn>

          <FadeIn delay={0.04}>
            <PageBanner
              src={CAMPUS_PHOTOS.building}
              alt={`Campus buildings and courtyard at ${SCHOOL_INFO.shortName}, ${SCHOOL_INFO.suburb}`}
              headline="Campus, classrooms, and community"
              subline="Tap any photo below to view it larger."
              variant="compact"
              objectPosition="center 45%"
              className="mb-8"
            />
          </FadeIn>

          <GalleryFeatured />

          <GalleryGrid items={GALLERY_ITEMS} />

          <FadeIn delay={0.55}>
            <p className="mt-10 text-center text-gray-600">
              Want to see more of our facilities?{" "}
              <Link href="/contact" className="font-medium text-primary-600 hover:underline">
                Book a visit
              </Link>{" "}
              or send us a message.
            </p>
          </FadeIn>
        </div>
      </section>
      <CTABanner
        title="Want to See More?"
        description="Schedule a visit to tour our campus and experience the Asamaths environment firsthand."
        buttonText="Book a Visit"
        buttonHref="/contact"
      />
    </>
  )
}

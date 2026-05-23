import Image from "next/image"
import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { SCHOOL_INFO } from "@/lib/constants"
import { STUDENT_PHOTO_BLUR_DATA_URL } from "@/lib/student-photo-blur"
import { STUDENT_PHOTOS, photoSrc } from "@/lib/student-photos"

interface CTABannerProps {
  title?: string
  description?: string
  buttonText?: string
  buttonHref?: string
}

export function CTABanner({
  title = "Ready to Join Our Community?",
  description = `Contact ${SCHOOL_INFO.shortName} today to learn more about our admission process, fees, and how we can partner in your child's educational journey.`,
  buttonText = "Send an Inquiry",
  buttonHref = "/contact#asa-contact-form",
}: CTABannerProps) {
  return (
    <section
      id="asa-home-cta"
      className="relative scroll-mt-24 overflow-hidden py-20"
    >
      <div className="absolute inset-0 -z-10">
        <Image
          src={photoSrc(STUDENT_PHOTOS.sports)}
          alt=""
          fill
          placeholder="blur"
          blurDataURL={STUDENT_PHOTO_BLUR_DATA_URL}
          className="object-cover object-[center_40%]"
          sizes="100vw"
          aria-hidden
        />
      </div>
      <div className="absolute inset-0 -z-10 bg-gradient-to-r from-primary-950/95 via-primary-900/92 to-primary-950/95" />

      <div className="container-custom relative z-10 text-center">
        <h2 className="text-balance font-display text-3xl font-bold text-white sm:text-4xl">{title}</h2>
        <p className="mx-auto mt-4 w-full max-w-none px-2 text-lg text-primary-100 md:px-4">
          {description}
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-4">
          <Link href={buttonHref}>
            <Button size="lg" className="bg-accent-500 font-semibold text-gray-900 hover:bg-accent-600">
              {buttonText}
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
          <Link href={`tel:${SCHOOL_INFO.rawPhone}`}>
            <Button size="lg" variant="outlineOnDark">
              Call {SCHOOL_INFO.phone}
            </Button>
          </Link>
        </div>
      </div>
    </section>
  )
}

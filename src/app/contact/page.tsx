import type { Metadata } from "next"
import Image from "next/image"
import { MapPin, Phone, Mail, Clock } from "lucide-react"
import { SectionHeading } from "@/components/shared/section-heading"
import { FadeIn } from "@/components/shared/fade-in"
import { ContactForm } from "@/components/forms/contact-form"
import { GoogleMap } from "@/components/shared/google-map"
import { SCHOOL_INFO } from "@/lib/constants"
import { STUDENT_PHOTO_BLUR_DATA_URL } from "@/lib/student-photo-blur"
import { STUDENT_PHOTOS } from "@/lib/student-photos"

export const metadata: Metadata = {
  title: "Contact Us",
  description: `Contact ${SCHOOL_INFO.name} at ${SCHOOL_INFO.address}, call ${SCHOOL_INFO.phone} or ${SCHOOL_INFO.phoneAlt}, or email ${SCHOOL_INFO.email}.`,
}

const contactDetails = [
  { icon: MapPin, label: "Address", value: SCHOOL_INFO.address },
  { icon: Phone, label: "Phone (main)", value: SCHOOL_INFO.phone, href: `tel:${SCHOOL_INFO.rawPhone}` },
  { icon: Phone, label: "Phone (additional)", value: SCHOOL_INFO.phoneAlt, href: `tel:${SCHOOL_INFO.rawPhoneAlt}` },
  { icon: Mail, label: "Email", value: SCHOOL_INFO.email, href: `mailto:${SCHOOL_INFO.email}` },
  { icon: Clock, label: "Hours", value: "Monday – Friday: 07:30 – 15:00" },
]

export default function ContactPage() {
  return (
    <>
      <section className="bg-gradient-to-br from-primary-50 to-white pb-16 pt-32">
        <div className="container-custom">
          <FadeIn>
            <SectionHeading
              title="Contact Us"
              subtitle="We'd love to hear from you. Reach out via any of the channels below."
            />
          </FadeIn>

          <FadeIn delay={0.06}>
            <div className="relative mb-12 aspect-[21/11] min-h-[160px] w-full overflow-hidden rounded-3xl shadow-lg ring-1 ring-primary-200 md:aspect-[21/9] md:min-h-[200px]">
              <Image
                src={STUDENT_PHOTOS.studentReadingPortrait}
                alt={`Portrait of a primary learner reading from a book for literacy support at ${SCHOOL_INFO.shortName}`}
                fill
                placeholder="blur"
                blurDataURL={STUDENT_PHOTO_BLUR_DATA_URL}
                className="object-cover object-[center_35%]"
                sizes="100vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-primary-950/60 via-primary-900/15 to-transparent" />
              <p className="absolute bottom-4 left-4 right-4 max-w-none font-display text-base font-semibold text-white drop-shadow-md sm:bottom-5 sm:left-6 sm:text-lg md:text-xl">
                Questions about enrolment? We&apos;re here to help—reach out when it suits you.
              </p>
            </div>
          </FadeIn>

          <div className="grid gap-12 lg:grid-cols-2">
            {/* Left: Contact details + map */}
            <FadeIn>
              <div className="space-y-6">
                <div className="grid gap-4 sm:grid-cols-2">
                  {contactDetails.map((detail) => (
                    <div
                      key={detail.label}
                      className="flex items-start gap-3 rounded-xl border border-gray-200 bg-white p-4 shadow-sm"
                    >
                      <detail.icon className="mt-0.5 h-5 w-5 flex-shrink-0 text-primary-600" />
                      <div>
                        <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
                          {detail.label}
                        </p>
                        {detail.href ? (
                          <a
                            href={detail.href}
                            className="break-all rounded-sm text-sm font-medium text-primary-600 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-600 focus-visible:ring-offset-2"
                          >
                            {detail.value}
                          </a>
                        ) : (
                          <p className="text-sm font-medium text-gray-900">{detail.value}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
                <GoogleMap />
              </div>
            </FadeIn>

            {/* Right: Contact form */}
            <FadeIn direction="left" delay={0.2}>
              <div
                id="asa-contact-form"
                className="scroll-mt-28 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8"
              >
                <h3 className="mb-6 font-display text-2xl font-bold text-gray-900">
                  Send Us a Message
                </h3>
                <ContactForm />
              </div>
            </FadeIn>
          </div>
        </div>
      </section>
    </>
  )
}

import type { Metadata } from "next"
import Image from "next/image"
import type { LucideIcon } from "lucide-react"
import { MapPin, Phone, Mail, Clock } from "lucide-react"
import { FadeIn } from "@/components/shared/fade-in"
import { PageIntro } from "@/components/shared/page-intro"
import { ContactCrestBanner } from "@/components/shared/contact-crest-banner"
import { ContactForm } from "@/components/forms/contact-form"
import { GoogleMap } from "@/components/shared/google-map"
import { WhatsAppIcon } from "@/components/shared/whatsapp-icon"
import { SCHOOL_INFO } from "@/lib/constants"
import { getWhatsAppUrl } from "@/lib/whatsapp"
import { STUDENT_PHOTO_BLUR_DATA_URL } from "@/lib/student-photo-blur"
import { CAMPUS_PHOTOS, photoSrc } from "@/lib/student-photos"

export const metadata: Metadata = {
  title: "Contact Us",
  description: `Contact ${SCHOOL_INFO.name} at ${SCHOOL_INFO.address}, call ${SCHOOL_INFO.phone}, WhatsApp ${SCHOOL_INFO.whatsapp}, or email ${SCHOOL_INFO.email}.`,
}

type ContactDetail =
  | { label: string; value: string; icon: LucideIcon; href?: string }
  | { label: string; value: string; href: string; whatsapp: true }

const contactDetails: ContactDetail[] = [
  { icon: MapPin, label: "Address", value: SCHOOL_INFO.address },
  { icon: Phone, label: "Phone (main)", value: SCHOOL_INFO.phone, href: `tel:${SCHOOL_INFO.rawPhone}` },
  {
    label: "WhatsApp",
    value: SCHOOL_INFO.whatsapp,
    href: getWhatsAppUrl(`Hello ${SCHOOL_INFO.shortName}, I have an enquiry.`),
    whatsapp: true,
  },
  { icon: Mail, label: "Email", value: SCHOOL_INFO.email, href: `mailto:${SCHOOL_INFO.email}` },
  { icon: Clock, label: "Hours", value: SCHOOL_INFO.officeHoursLong },
]

export default function ContactPage() {
  return (
    <>
      <section className="bg-gradient-to-br from-primary-50 to-white pb-16 pt-32">
        <div className="container-custom">
          <PageIntro
            eyebrow="Reach out"
            title="Contact Us"
            subtitle="We'd love to hear from you. Reach out via any of the channels below."
            breadcrumbs={[{ label: "Contact" }]}
          />

          <FadeIn delay={0.06}>
            <ContactCrestBanner />
          </FadeIn>

          <div className="grid gap-12 lg:grid-cols-2">
            <FadeIn>
              <div className="space-y-6">
                <div className="grid gap-4 sm:grid-cols-2">
                  {contactDetails.map((detail) => {
                    const isWhatsapp = "whatsapp" in detail && detail.whatsapp
                    const RowIcon = "icon" in detail ? detail.icon : null
                    return (
                    <div
                      key={detail.label}
                      className="flex items-start gap-3 rounded-xl border border-gray-200 bg-white p-4 shadow-sm transition-shadow hover:border-primary-200 hover:shadow-md"
                    >
                      {isWhatsapp ? (
                        <WhatsAppIcon className="mt-0.5 h-5 w-5 flex-shrink-0 text-[#25D366]" />
                      ) : RowIcon ? (
                        <RowIcon className="mt-0.5 h-5 w-5 flex-shrink-0 text-primary-600" />
                      ) : null}
                      <div>
                        <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
                          {detail.label}
                        </p>
                        {detail.href ? (
                          <a
                            href={detail.href}
                            target={isWhatsapp ? "_blank" : undefined}
                            rel={isWhatsapp ? "noopener noreferrer" : undefined}
                            className={
                              isWhatsapp
                                ? "break-all rounded-sm text-sm font-medium text-[#128C7E] hover:text-[#075E54] hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#25D366] focus-visible:ring-offset-2"
                                : "break-all rounded-sm text-sm font-medium text-primary-600 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-600 focus-visible:ring-offset-2"
                            }
                          >
                            {detail.value}
                          </a>
                        ) : (
                          <p className="text-sm font-medium text-gray-900">{detail.value}</p>
                        )}
                      </div>
                    </div>
                    )
                  })}
                </div>

                <figure className="relative aspect-[16/10] overflow-hidden rounded-2xl shadow-md ring-1 ring-primary-100">
                  <Image
                    src={photoSrc(CAMPUS_PHOTOS.building)}
                    alt={`Exterior of ${SCHOOL_INFO.shortName} campus in ${SCHOOL_INFO.suburb}`}
                    fill
                    placeholder="blur"
                    blurDataURL={STUDENT_PHOTO_BLUR_DATA_URL}
                    className="object-cover object-center"
                    sizes="(max-width:1024px)100vw,50vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-primary-950/60 via-transparent to-transparent" />
                  <figcaption className="absolute bottom-4 left-4 right-4 text-sm font-medium text-white drop-shadow">
                    Find us at {SCHOOL_INFO.address}
                  </figcaption>
                </figure>

                <GoogleMap />
              </div>
            </FadeIn>

            <FadeIn direction="left" delay={0.2}>
              <div
                id="asa-contact-form"
                className="scroll-mt-28 rounded-2xl border border-gray-200 bg-white p-6 shadow-md ring-1 ring-primary-100/60 sm:p-8"
              >
                <h3 className="mb-2 font-display text-2xl font-bold text-gray-900">Send an Inquiry</h3>
                <p className="mb-6 text-sm text-gray-500">
                  We typically reply within one to two school days during term time.
                </p>
                <ContactForm />
              </div>
            </FadeIn>
          </div>
        </div>
      </section>
    </>
  )
}

import type { Metadata } from "next"
import Image from "next/image"
import { MapPin, Phone, Mail, User, Calendar } from "lucide-react"
import { SectionHeading } from "@/components/shared/section-heading"
import { FadeIn } from "@/components/shared/fade-in"
import { CTABanner } from "@/components/sections/cta-banner"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { SCHOOL_INFO } from "@/lib/constants"
import { STUDENT_PHOTO_BLUR_DATA_URL } from "@/lib/student-photo-blur"
import { STUDENT_PHOTOS } from "@/lib/student-photos"
import { GoogleMap } from "@/components/shared/google-map"

export const metadata: Metadata = {
  title: "About Us",
  description: `Learn about ${SCHOOL_INFO.name}, an independent combined school in ${SCHOOL_INFO.suburb}, ${SCHOOL_INFO.city}. Meet our principal, ${SCHOOL_INFO.principal}, and discover our mission.`,
}

const infoCards = [
  { icon: MapPin, label: "Address", value: SCHOOL_INFO.address },
  { icon: Phone, label: "Phone", value: SCHOOL_INFO.phone, href: `tel:${SCHOOL_INFO.rawPhone}` },
  { icon: Mail, label: "Email", value: SCHOOL_INFO.email, href: `mailto:${SCHOOL_INFO.email}` },
  { icon: User, label: "Principal (2023)", value: SCHOOL_INFO.principal },
  { icon: Calendar, label: "Survey Year", value: SCHOOL_INFO.surveyYear.toString() },
]

export default function AboutPage() {
  return (
    <>
      <section className="bg-gradient-to-br from-primary-50 to-white pb-16 pt-32">
        <div className="container-custom">
          <FadeIn>
            <SectionHeading
              title="About Our School"
              subtitle={`Discover the story behind Asamaths Institute Of Learning – ${SCHOOL_INFO.city}`}
            />
          </FadeIn>

          <FadeIn delay={0.04}>
            <div className="relative mb-12 aspect-[21/10] min-h-[180px] overflow-hidden rounded-3xl shadow-xl ring-1 ring-primary-200 md:min-h-[220px]">
              <Image
                src={STUDENT_PHOTOS.reading}
                alt={`Primary-phase literacy session: learner reading attentively with class resources at ${SCHOOL_INFO.shortName}`}
                fill
                placeholder="blur"
                blurDataURL={STUDENT_PHOTO_BLUR_DATA_URL}
                className="object-cover object-[center_30%]"
                sizes="100vw"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-primary-950/55 via-primary-900/20 to-transparent" />
              <p className="absolute bottom-4 left-4 right-4 max-w-none font-display text-lg font-semibold text-white drop-shadow-md sm:bottom-6 sm:left-6 sm:text-2xl">
                Nurturing every reader, every thinker—from Grade R to 7.
              </p>
            </div>
          </FadeIn>

          <div className="grid items-start gap-12 lg:grid-cols-2">
            <FadeIn className="space-y-6">
              <div id="asa-about-content" className="scroll-mt-28 space-y-6">
                <div>
                  <Badge className="mb-3">
                    {SCHOOL_INFO.sector} {SCHOOL_INFO.phase}
                  </Badge>
                  <h2 className="font-display text-3xl font-bold text-gray-900">
                    Welcome to {SCHOOL_INFO.name}
                  </h2>
                </div>
              <div className="prose prose-gray max-w-none space-y-4 text-gray-600">
                <p>
                  <strong>{SCHOOL_INFO.name}</strong>, situated at {SCHOOL_INFO.address}, operates as
                  an independent combined school within the {SCHOOL_INFO.neighbourhood},{" "}
                  {SCHOOL_INFO.city} urban suburb of {SCHOOL_INFO.province} Province, South Africa.
                </p>
                <p>
                  According to a survey conducted in {SCHOOL_INFO.surveyYear}, the school had a total
                  population of <strong>{SCHOOL_INFO.totalLearners} learners</strong> served by a
                  dedicated team of <strong>{SCHOOL_INFO.totalEducators} educators</strong>, resulting
                  in a student-teacher ratio of <strong>{SCHOOL_INFO.studentTeacherRatio}</strong>.
                </p>
                <p>
                  Our school uniform regulations are overseen by the institution&#39;s administration
                  in accordance with the South African Schools Act of 1996 and guidelines provided by
                  the provincial Education Department. These regulations dictate the design, colors,
                  and wearing of school uniforms, aiming to foster a cohesive identity, equality, and
                  discipline within the student body.
                </p>
                <p>
                  As an independent fee-paying institution, tuition fees are determined by the school
                  administration to cover operational expenses and educational resources. Families are
                  responsible for paying the specified fees, which may vary depending on grade level
                  and additional services offered.
                </p>
              </div>
              </div>
            </FadeIn>

            <FadeIn direction="left" delay={0.2}>
              <div className="space-y-6">
                <div id="asa-about-map" className="scroll-mt-28">
                  <GoogleMap />
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  {infoCards.map((card) => (
                    <Card key={card.label} className="border-gray-100">
                      <CardContent className="flex items-start gap-3 pt-5">
                        <card.icon className="mt-0.5 h-5 w-5 flex-shrink-0 text-primary-600" />
                        <div>
                          <p className="text-xs uppercase tracking-wide text-gray-400">{card.label}</p>
                          {card.href ? (
                            <a
                              href={card.href}
                              className="rounded-sm text-sm font-medium text-primary-600 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-600 focus-visible:ring-offset-2"
                            >
                              {card.value}
                            </a>
                          ) : (
                            <p className="text-sm font-medium text-gray-900">{card.value}</p>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>
      <CTABanner />
    </>
  )
}

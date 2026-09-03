import type { Metadata } from "next"
import { MapPin, Phone, Mail, User, Calendar } from "lucide-react"
import { FadeIn } from "@/components/shared/fade-in"
import { PageIntro } from "@/components/shared/page-intro"
import { AtAGlanceStrip } from "@/components/shared/at-a-glance-strip"
import { PageBanner } from "@/components/shared/page-banner"
import { PagePhotoStrip } from "@/components/shared/page-photo-strip"
import { CTABanner } from "@/components/sections/cta-banner"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { SCHOOL_INFO } from "@/lib/constants"
import { CAMPUS_PHOTOS } from "@/lib/student-photos"
import { GoogleMap } from "@/components/shared/google-map"

export const metadata: Metadata = {
  title: "About Us",
  description: `Learn about ${SCHOOL_INFO.name}, an independent combined school in ${SCHOOL_INFO.suburb}. Meet our principal, ${SCHOOL_INFO.principal}, and discover our mission.`,
}

const infoCards = [
  { icon: MapPin, label: "Address", value: SCHOOL_INFO.address },
  { icon: Phone, label: "Phone", value: SCHOOL_INFO.phone, href: `tel:${SCHOOL_INFO.rawPhone}` },
  { icon: Mail, label: "Email", value: SCHOOL_INFO.email, href: `mailto:${SCHOOL_INFO.email}` },
  { icon: User, label: `Principal (${SCHOOL_INFO.principalYear})`, value: SCHOOL_INFO.principal },
  { icon: Calendar, label: "Survey Year", value: SCHOOL_INFO.surveyYear.toString() },
]

export default function AboutPage() {
  return (
    <>
      <section className="bg-gradient-to-br from-primary-50 to-white pb-16 pt-32">
        <div className="container-custom">
          <PageIntro
            eyebrow="Who we are"
            title="About Our School"
            subtitle={`Discover the story behind ${SCHOOL_INFO.name}`}
            breadcrumbs={[{ label: "About" }]}
          />

          <FadeIn delay={0.04}>
            <AtAGlanceStrip />
          </FadeIn>

          <FadeIn delay={0.04}>
            <PageBanner
              src={CAMPUS_PHOTOS.building}
              alt={`Brick campus buildings and courtyard at ${SCHOOL_INFO.shortName}, ${SCHOOL_INFO.suburb}`}
              headline="A campus built for learning, belonging, and growth"
              subline={`Independent combined education in the heart of ${SCHOOL_INFO.suburb}.`}
              badge="Our campus"
              variant="hero"
              objectPosition="center 45%"
              className="mb-8"
              priority
            />
          </FadeIn>

          <FadeIn delay={0.06}>
            <PagePhotoStrip
              className="mb-12"
              items={[
                {
                  src: CAMPUS_PHOTOS.friends,
                  alt: `Learners in Asamaths uniform sharing a moment in class at ${SCHOOL_INFO.shortName}`,
                  label: "Friendships that last",
                  objectPosition: "center 30%",
                },
                {
                  src: CAMPUS_PHOTOS.classroomGroup,
                  alt: `Learners focused during a lesson at ${SCHOOL_INFO.shortName}`,
                  label: "Purposeful classrooms",
                  objectPosition: "center 40%",
                },
              ]}
            />
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
                    an independent combined school in {SCHOOL_INFO.suburb},{" "}
                    {SCHOOL_INFO.province} Province, South Africa.
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
                <div id="asa-about-map" className="scroll-mt-28 overflow-hidden rounded-3xl shadow-lg ring-1 ring-primary-100">
                  <GoogleMap />
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  {infoCards.map((card) => (
                    <Card key={card.label} className="border-gray-100 transition-shadow hover:shadow-md">
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

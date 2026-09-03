import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import { ArrowRight, Calendar, Info, Music2 } from "lucide-react"
import { FadeIn } from "@/components/shared/fade-in"
import { PageIntro } from "@/components/shared/page-intro"
import { PageBanner } from "@/components/shared/page-banner"
import { CTABanner } from "@/components/sections/cta-banner"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { SCHOOL_INFO } from "@/lib/constants"
import {
  CULTURE_ACTIVITIES,
  CULTURE_INTRO,
  CULTURE_VALUES,
  UPCOMING_CULTURE,
} from "@/lib/culture"
import { STUDENT_PHOTO_BLUR_DATA_URL } from "@/lib/student-photo-blur"
import { STUDENT_PHOTOS, photoSrc } from "@/lib/student-photos"

export const metadata: Metadata = {
  title: "Culture",
  description: `Culture and heritage at ${SCHOOL_INFO.shortName} — music, dance, languages, and celebrations in ${SCHOOL_INFO.suburb}.`,
}

export default function CulturePage() {
  return (
    <>
      <section id="asa-culture" className="scroll-mt-28 bg-gradient-to-br from-primary-50 to-white pb-16 pt-32">
        <div className="container-custom">
          <FadeIn>
            <PageIntro
              eyebrow="Who we are"
              title="Culture"
              subtitle={`Heritage, creativity, and community at ${SCHOOL_INFO.shortName}`}
              breadcrumbs={[{ label: "Culture" }]}
            />
          </FadeIn>

          <FadeIn delay={0.04}>
            <PageBanner
              src={STUDENT_PHOTOS.classroomCelebration}
              alt={`Learners celebrating together at ${SCHOOL_INFO.shortName}, ${SCHOOL_INFO.suburb}`}
              headline="Celebrating identity and belonging"
              subline="Music, language, and tradition in everyday school life."
              badge="Culture"
              variant="wide"
              objectPosition="center 35%"
              className="mb-10"
            />
          </FadeIn>

          <FadeIn delay={0.06}>
            <div className="mb-10 flex gap-3 rounded-xl border border-primary-100 bg-white/90 p-6 shadow-sm md:p-8">
              <Music2 className="mt-0.5 h-6 w-6 shrink-0 text-primary-600" aria-hidden />
              <p className="leading-relaxed text-gray-700">{CULTURE_INTRO}</p>
            </div>
          </FadeIn>

          <div className="grid gap-10 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,0.8fr)] lg:items-start">
            <div className="space-y-6">
              <FadeIn delay={0.08}>
                <h2 className="font-display text-2xl font-bold text-gray-900">Cultural activities</h2>
              </FadeIn>
              <div className="grid gap-4 sm:grid-cols-2">
                {CULTURE_ACTIVITIES.map((activity, index) => (
                  <FadeIn key={activity.id} delay={0.1 + index * 0.03}>
                    <Card className="h-full border-gray-100 shadow-sm transition-shadow hover:shadow-md">
                      <CardHeader className="pb-2">
                        <CardTitle className="font-display text-lg">{activity.name}</CardTitle>
                        {activity.when ? (
                          <Badge variant="secondary" className="mt-2 w-fit text-xs">
                            {activity.when}
                          </Badge>
                        ) : null}
                      </CardHeader>
                      <CardContent>
                        <CardDescription className="max-w-none text-sm leading-relaxed text-gray-600">
                          {activity.description}
                        </CardDescription>
                      </CardContent>
                    </Card>
                  </FadeIn>
                ))}
              </div>
            </div>

            <div className="space-y-6">
              <FadeIn delay={0.12}>
                <div className="relative aspect-[4/3] overflow-hidden rounded-2xl shadow-md ring-1 ring-gray-200">
                  <Image
                    src={photoSrc(STUDENT_PHOTOS.foundation)}
                    alt={`Foundation-phase learners learning at ${SCHOOL_INFO.shortName}`}
                    fill
                    placeholder="blur"
                    blurDataURL={STUDENT_PHOTO_BLUR_DATA_URL}
                    className="object-cover object-center"
                    sizes="(max-width: 1024px) 100vw, 400px"
                  />
                </div>
              </FadeIn>

              <FadeIn delay={0.14}>
                <Card className="border-violet-100 bg-violet-50/50">
                  <CardHeader>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-5 w-5 text-violet-700" aria-hidden />
                      <CardTitle className="font-display text-lg text-violet-950">
                        Upcoming cultural events
                      </CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {UPCOMING_CULTURE.map((item) => (
                      <div key={item.id} className="border-b border-violet-100/80 pb-4 last:border-0 last:pb-0">
                        <p className="font-semibold text-violet-950">{item.title}</p>
                        <p className="mt-0.5 text-xs font-medium text-violet-800">{item.when}</p>
                        <p className="mt-1 text-sm text-violet-900/80">{item.description}</p>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </FadeIn>

              <FadeIn delay={0.16}>
                <Card className="border-amber-100 bg-amber-50/60">
                  <CardHeader>
                    <div className="flex items-start gap-2">
                      <Info className="mt-0.5 h-5 w-5 shrink-0 text-amber-700" aria-hidden />
                      <CardTitle className="font-display text-lg text-amber-950">Our cultural values</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2 text-sm leading-relaxed text-amber-900/90">
                      {CULTURE_VALUES.map((note) => (
                        <li key={note} className="flex gap-2">
                          <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-amber-600" />
                          {note}
                        </li>
                      ))}
                    </ul>
                    <Link href="/" className="mt-4 inline-block">
                      <Button variant="outline" size="sm" className="gap-2 border-amber-200 bg-white">
                        Weekly highlights on home
                        <ArrowRight className="h-4 w-4" />
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              </FadeIn>
            </div>
          </div>

          <FadeIn delay={0.18}>
            <p className="mt-10 text-center text-sm text-gray-600">
              To volunteer for cultural events or join a parent support group, email{" "}
              <a href={`mailto:${SCHOOL_INFO.email}`} className="font-medium text-primary-700 underline">
                {SCHOOL_INFO.email}
              </a>
              .
            </p>
          </FadeIn>
        </div>
      </section>

      <CTABanner
        title="Learn more about our school"
        description="Discover our history, values, and leadership on the About page."
        buttonText="About Us"
        buttonHref="/about"
      />
    </>
  )
}

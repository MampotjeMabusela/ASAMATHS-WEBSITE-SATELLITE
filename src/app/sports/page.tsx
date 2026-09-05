import type { Metadata } from "next"
import { redirect } from "next/navigation"
import Link from "next/link"
import { ArrowRight, Calendar, Info, Trophy } from "lucide-react"
import { FadeIn } from "@/components/shared/fade-in"
import { PageIntro } from "@/components/shared/page-intro"
import { CTABanner } from "@/components/sections/cta-banner"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { SCHOOL_INFO } from "@/lib/constants"
import { TEMPORARY_VISIBILITY } from "@/lib/feature-flags"
import {
  SPORTS_INTRO,
  SPORTS_PROGRAMS,
  SPORTS_VALUES,
  UPCOMING_SPORTS,
} from "@/lib/sports"

export const metadata: Metadata = {
  title: "Sports",
  description: `Sport and physical education at ${SCHOOL_INFO.shortName} — athletics, soccer, netball, and inter-house competitions in ${SCHOOL_INFO.suburb}.`,
}

export default function SportsPage() {
  if (!TEMPORARY_VISIBILITY.sportsPage) redirect("/")

  return (
    <>
      <section id="asa-sports" className="scroll-mt-28 bg-gradient-to-br from-primary-50 to-white pb-16 pt-32">
        <div className="container-custom">
          <FadeIn>
            <PageIntro
              eyebrow="Active learners"
              title="Sports"
              subtitle={`Teamwork, fitness, and school spirit at ${SCHOOL_INFO.shortName}`}
              breadcrumbs={[{ label: "Sports" }]}
            />
          </FadeIn>

          <FadeIn delay={0.06}>
            <div className="mb-10 flex gap-3 rounded-xl border border-primary-100 bg-white/90 p-6 shadow-sm md:p-8">
              <Trophy className="mt-0.5 h-6 w-6 shrink-0 text-primary-600" aria-hidden />
              <p className="leading-relaxed text-gray-700">{SPORTS_INTRO}</p>
            </div>
          </FadeIn>

          <div className="grid gap-10 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,0.8fr)] lg:items-start">
            <div className="space-y-6">
              <FadeIn delay={0.08}>
                <h2 className="font-display text-2xl font-bold text-gray-900">Sports programmes</h2>
              </FadeIn>
              <div className="grid gap-4 sm:grid-cols-2">
                {SPORTS_PROGRAMS.map((program, index) => (
                  <FadeIn key={program.id} delay={0.1 + index * 0.03}>
                    <Card className="h-full border-gray-100 shadow-sm transition-shadow hover:shadow-md">
                      <CardHeader className="pb-2">
                        <CardTitle className="font-display text-lg">{program.name}</CardTitle>
                        {program.seasons ? (
                          <Badge variant="secondary" className="mt-2 w-fit text-xs">
                            {program.seasons}
                          </Badge>
                        ) : null}
                      </CardHeader>
                      <CardContent>
                        <CardDescription className="max-w-none text-sm leading-relaxed text-gray-600">
                          {program.description}
                        </CardDescription>
                      </CardContent>
                    </Card>
                  </FadeIn>
                ))}
              </div>
            </div>

            <div className="space-y-6">
              <FadeIn delay={0.14}>
                <Card className="border-emerald-100 bg-emerald-50/50">
                  <CardHeader>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-5 w-5 text-emerald-700" aria-hidden />
                      <CardTitle className="font-display text-lg text-emerald-950">
                        This term at a glance
                      </CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {UPCOMING_SPORTS.map((item) => (
                      <div key={item.id} className="border-b border-emerald-100/80 pb-4 last:border-0 last:pb-0">
                        <p className="font-semibold text-emerald-950">{item.title}</p>
                        {item.when ? (
                          <p className="mt-0.5 text-xs font-medium text-emerald-800">{item.when}</p>
                        ) : null}
                        {item.description ? (
                          <p className="mt-1 text-sm text-emerald-900/80">{item.description}</p>
                        ) : null}
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
                      <CardTitle className="font-display text-lg text-amber-950">What we expect</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2 text-sm leading-relaxed text-amber-900/90">
                      {SPORTS_VALUES.map((note) => (
                        <li key={note} className="flex gap-2">
                          <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-amber-600" />
                          {note}
                        </li>
                      ))}
                    </ul>
                    <Link href="/uniform-catalog" className="mt-4 inline-block">
                      <Button variant="outline" size="sm" className="gap-2 border-amber-200 bg-white">
                        Sports uniform catalog
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
              For team lists, transport, or permission forms, contact the school office at{" "}
              <a href={`tel:${SCHOOL_INFO.rawPhone}`} className="font-medium text-primary-700 underline">
                {SCHOOL_INFO.phone}
              </a>
              .
            </p>
          </FadeIn>
        </div>
      </section>

      <CTABanner
        title="See our learners in action"
        description="Browse photos of campus life, classrooms, and sport in our gallery."
        buttonText="View Gallery"
        buttonHref="/gallery"
        showBackgroundImage={false}
      />
    </>
  )
}

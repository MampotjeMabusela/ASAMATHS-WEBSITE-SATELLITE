import type { Metadata } from "next"
import { redirect } from "next/navigation"
import { CalendarDays } from "lucide-react"
import { FadeIn } from "@/components/shared/fade-in"
import { PageIntro } from "@/components/shared/page-intro"
import { PageBanner } from "@/components/shared/page-banner"
import { CTABanner } from "@/components/sections/cta-banner"
import { SchoolCalendar } from "@/components/calendar/school-calendar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { SCHOOL_INFO } from "@/lib/constants"
import { TEMPORARY_VISIBILITY } from "@/lib/feature-flags"
import { getCalendarEventsFromHighlights } from "@/lib/calendar"
import { CURRENT_HIGHLIGHTS } from "@/lib/highlights"
import { CAMPUS_PHOTOS } from "@/lib/student-photos"

export const metadata: Metadata = {
  title: "Calendar",
  description: `School calendar and weekly highlights for ${SCHOOL_INFO.shortName} — sports, culture, academic dates, and notices.`,
}

export default function CalendarPage() {
  if (!TEMPORARY_VISIBILITY.calendarPage) redirect("/")

  const events = getCalendarEventsFromHighlights()
  const initialMonth = CURRENT_HIGHLIGHTS.updatedAt.slice(0, 7)

  return (
    <>
      <section
        id="asa-calendar"
        className="scroll-mt-28 bg-gradient-to-br from-primary-50 to-white pb-16 pt-32"
      >
        <div className="container-custom">
          <FadeIn>
            <PageIntro
              eyebrow="What's on"
              title="Calendar"
              subtitle={`Weekly school dates and notices for ${SCHOOL_INFO.shortName}`}
              breadcrumbs={[{ label: "Calendar" }]}
            />
          </FadeIn>

          <FadeIn delay={0.04}>
            <PageBanner
              src={CAMPUS_PHOTOS.classroomGroup}
              alt={`Learners in class at ${SCHOOL_INFO.shortName}, ${SCHOOL_INFO.suburb}`}
              headline="Plan the week ahead"
              subline="Sports, culture, academic updates, and school notices in one place."
              badge="Calendar"
              variant="compact"
              objectPosition="center 35%"
              className="mb-10"
            />
          </FadeIn>

          <FadeIn delay={0.08}>
            <Card className="mb-10 border-primary-100 bg-white/90">
              <CardHeader className="pb-3">
                <div className="flex items-start gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary-100 text-primary-700">
                    <CalendarDays className="h-5 w-5" />
                  </div>
                  <div>
                    <CardTitle className="font-display text-xl">Linked to Highlights</CardTitle>
                    <p className="mt-1 text-sm leading-relaxed text-gray-600">
                      This calendar is fed directly from the homepage <strong>Highlights</strong> box. When
                      the office updates weekly highlights, the same events appear here automatically.
                    </p>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <p className="text-sm text-gray-600">
                  Current focus: <span className="font-medium text-gray-900">{CURRENT_HIGHLIGHTS.weekLabel}</span>
                </p>
              </CardContent>
            </Card>
          </FadeIn>

          <FadeIn delay={0.12}>
            <SchoolCalendar
              events={events}
              initialMonth={initialMonth}
              weekLabel={CURRENT_HIGHLIGHTS.weekLabel}
              updatedLabel={CURRENT_HIGHLIGHTS.updatedLabel}
            />
          </FadeIn>
        </div>
      </section>

      <CTABanner
        title="Questions about an event?"
        description="Contact the school office during office hours for times, venues, and learner requirements."
        buttonText="Contact Us"
        buttonHref="/contact"
      />
    </>
  )
}

import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import {
  ArrowRight,
  ClipboardCheck,
  FileText,
  PhoneCall,
  UserCheck,
  FolderOpen,
  ClipboardList,
  Wallet,
  Calendar,
  type LucideIcon,
} from "lucide-react"
import { FadeIn } from "@/components/shared/fade-in"
import { PageIntro } from "@/components/shared/page-intro"
import { AtAGlanceStrip } from "@/components/shared/at-a-glance-strip"
import { StickyMobileCta } from "@/components/shared/sticky-mobile-cta"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { PageBanner } from "@/components/shared/page-banner"
import { SCHOOL_INFO } from "@/lib/constants"
import { STUDENT_PHOTO_BLUR_DATA_URL } from "@/lib/student-photo-blur"
import { CAMPUS_PHOTOS, photoSrc } from "@/lib/student-photos"

export const metadata: Metadata = {
  title: "Admissions",
  description: `Learn about the admission process at ${SCHOOL_INFO.name}. Contact us directly for personalized guidance on enrolling your child.`,
}

const enrolmentChecklist: {
  icon: LucideIcon
  title: string
  body: string
  links?: readonly { label: string; href: string }[]
}[] = [
  {
    icon: FolderOpen,
    title: "Gather documents early",
    body: "Typically include the learner’s birth certificate or ID, latest school report card, transfer or exit paperwork from a previous school, and any immunisation or clinic records requested. Admissions will confirm exactly what applies to your child.",
    links: [{ label: "Send us an enquiry", href: "/contact#asa-contact-form" }],
  },
  {
    icon: ClipboardList,
    title: "Interview & readiness check",
    body: `After we’ve received your enquiry, we arrange a conversation and placement discussion so your child settles in the best grade.`,
    links: [{ label: "Start on Contact", href: "/contact#asa-contact-form" }],
  },
  {
    icon: Wallet,
    title: "Fees, deposit & payment plan",
    body: `Review our general orientation on fees, then confirm deposits, timelines, or payment arrangements with admissions—figures are finalized with the administration office.`,
    links: [{ label: "Fees overview", href: "/fees" }],
  },
  {
    icon: Calendar,
    title: "Term dates & school calendar",
    body: `Provincial term dates vary by year. Ask the office for the current brochure, term-by-term calendar, and daily times so you’re aligned from week one.`,
    links: [{ label: "Confirm with the office", href: "/contact#asa-contact-form" }],
  },
]

const steps = [
  {
    icon: PhoneCall,
    title: "1. Contact the School",
    description:
      "Reach out to us directly via phone or email to express your interest and schedule an initial consultation.",
  },
  {
    icon: FileText,
    title: "2. Submit Documentation",
    description:
      "Provide the required documents including birth certificate, previous school reports, and transfer card.",
  },
  {
    icon: UserCheck,
    title: "3. Interview & Assessment",
    description:
      "Prospective students may undergo a brief assessment and interview to determine appropriate grade placement.",
  },
  {
    icon: ClipboardCheck,
    title: "4. Enrollment Confirmation",
    description:
      "Upon acceptance, complete the enrollment forms and pay the required registration fees to secure placement.",
  },
]

export default function AdmissionsPage() {
  return (
    <>
      <section id="asa-admissions" className="scroll-mt-28 bg-gradient-to-br from-primary-50 to-white pb-24 pt-32 md:pb-16">
        <div className="container-custom">
          <PageIntro
            eyebrow="Join us"
            title="Admissions"
            subtitle="Your child's journey to quality education begins here"
            breadcrumbs={[{ label: "Admissions" }]}
          />

          <FadeIn delay={0.04}>
            <AtAGlanceStrip />
          </FadeIn>

          <FadeIn delay={0.08}>
            <PageBanner
              src={CAMPUS_PHOTOS.courtyardWalk}
              alt={`Educator and learner on the school courtyard at ${SCHOOL_INFO.shortName}, ${SCHOOL_INFO.suburb}`}
              headline="A welcoming path into our school family"
              subline="A place where your child is known, supported, and challenged to grow."
              badge="Admissions"
              variant="wide"
              objectPosition="center 40%"
              className="mb-12"
            />
          </FadeIn>

          <FadeIn delay={0.2}>
            <div className="mb-12 w-full text-center">
              <p className="text-lg text-gray-600">
                The admission to private schools such as <strong>{SCHOOL_INFO.name}</strong> involves a
                personalized approach tailored to meet the unique needs of each student. Individuals
                interested in admission are encouraged to contact the school directly to learn more
                about the admission process.
              </p>
            </div>
          </FadeIn>

          <FadeIn delay={0.22}>
            <Card className="mb-12 border-primary-100 bg-white/95 shadow-md">
              <CardHeader className="pb-2">
                <CardTitle className="font-display text-xl sm:text-2xl">
                  Practical next steps for families
                </CardTitle>
                <CardDescription className="text-base text-gray-600">
                  A short enrolment checklist after you enquire—keep documents ready, confirm finances, and
                  lock in the school calendar with our office.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-5 pt-0">
                <ul className="space-y-4">
                  {enrolmentChecklist.map((row) => (
                    <li
                      key={row.title}
                      className="flex gap-4 rounded-xl border border-gray-100 bg-gray-50/80 p-4 sm:p-5"
                    >
                      <span className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl bg-primary-100 text-primary-700">
                        <row.icon className="h-5 w-5" aria-hidden />
                      </span>
                      <div className="min-w-0">
                        <p className="font-semibold text-gray-900">{row.title}</p>
                        <p className="mt-1 text-sm leading-relaxed text-gray-600">{row.body}</p>
                        {row.links && row.links.length > 0 ? (
                          <div className="mt-3 flex flex-wrap gap-x-4 gap-y-2">
                            {row.links.map((l) => (
                              <Link
                                key={l.href}
                                href={l.href}
                                className="text-sm font-medium text-primary-700 underline decoration-primary-700/35 underline-offset-2 hover:text-primary-900 hover:decoration-primary-900"
                              >
                                {l.label} →
                              </Link>
                            ))}
                          </div>
                        ) : null}
                      </div>
                    </li>
                  ))}
                </ul>
                <div className="flex flex-wrap gap-3 rounded-lg border border-dashed border-primary-200 bg-primary-50/50 p-4">
                  <p className="w-full text-sm text-primary-950">
                    <strong>Prefer to talk?</strong> Call or WhatsApp-aligned hours are shown on Contact—we’re
                    glad to walk you through enrolment personally.
                  </p>
                  <Link href="/fees">
                    <Button variant="outline" size="sm" className="border-primary-300">
                      Fees & finances
                    </Button>
                  </Link>
                  <Link href="/contact#asa-contact-form">
                    <Button size="sm" className="bg-primary-600 text-white hover:bg-primary-700">
                      Contact admissions
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </FadeIn>

          <FadeIn delay={0.24} className="mb-12">
            <div className="grid gap-8 lg:grid-cols-5 lg:items-center">
              <div className="relative aspect-[4/3] overflow-hidden rounded-2xl shadow-lg ring-1 ring-primary-100 lg:col-span-2">
                <Image
                  src={photoSrc(CAMPUS_PHOTOS.friends)}
                  alt={`Learners in Asamaths uniform at ${SCHOOL_INFO.shortName}`}
                  fill
                  placeholder="blur"
                  blurDataURL={STUDENT_PHOTO_BLUR_DATA_URL}
                  className="object-cover object-[center_30%]"
                  sizes="(max-width:1024px)100vw,40vw"
                />
              </div>
              <p className="text-center text-base leading-relaxed text-gray-600 lg:col-span-3 lg:text-left">
                Every enrolment begins with a conversation. We take time to understand your child&apos;s
                strengths, needs, and goals—so placement in the right grade feels confident from day one.
              </p>
            </div>
          </FadeIn>

          <div className="mb-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {steps.map((step, i) => (
              <FadeIn key={step.title} delay={i * 0.15}>
                <Card className="h-full border-gray-100 transition-colors hover:border-primary-200">
                  <CardContent className="pt-6">
                    <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary-100 text-primary-600">
                      <step.icon className="h-6 w-6" />
                    </div>
                    <h3 className="mb-2 text-lg font-semibold text-gray-900">{step.title}</h3>
                    <p className="text-sm leading-relaxed text-gray-500">{step.description}</p>
                  </CardContent>
                </Card>
              </FadeIn>
            ))}
          </div>

          <FadeIn>
            <div className="text-center">
              <div className="flex flex-wrap justify-center gap-4">
                <Link href="/contact">
                  <Button size="lg" className="bg-primary-600 text-white hover:bg-primary-700">
                    Contact Admissions
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
                <a href={`tel:${SCHOOL_INFO.rawPhone}`}>
                  <Button size="lg" variant="outline">
                    <PhoneCall className="mr-2 h-5 w-5" />
                    Call {SCHOOL_INFO.phone}
                  </Button>
                </a>
              </div>
            </div>
          </FadeIn>
        </div>
      </section>
      <StickyMobileCta enquireLabel="Apply enquiry" />
    </>
  )
}

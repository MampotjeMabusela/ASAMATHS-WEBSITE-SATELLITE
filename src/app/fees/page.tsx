import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import {
  ArrowRight,
  AlertCircle,
  Banknote,
  Building2,
  CalendarClock,
  CreditCard,
  Landmark,
  MapPin,
  Phone,
  Printer,
  Smartphone,
} from "lucide-react"
import { FadeIn } from "@/components/shared/fade-in"
import { PageIntro } from "@/components/shared/page-intro"
import { StickyMobileCta } from "@/components/shared/sticky-mobile-cta"
import { CTABanner } from "@/components/sections/cta-banner"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion"
import { SCHOOL_INFO } from "@/lib/constants"
import { PageBanner } from "@/components/shared/page-banner"
import { STUDENT_PHOTO_BLUR_DATA_URL } from "@/lib/student-photo-blur"
import { CAMPUS_PHOTOS, photoSrc } from "@/lib/student-photos"

export const metadata: Metadata = {
  title: "School Fees — 2026",
  description: `2026 school fees structure for ${SCHOOL_INFO.shortName}: registration, tuition by grade, payment options, and banking details.`,
}

/** As published on the 2026 fees schedule (office contact on document). Address matches site-wide `SCHOOL_INFO.address`. */
const FEES_OFFICE = {
  telDisplay: "012 725 8044",
  telHref: "tel:+27127258044",
  faxDisplay: "086 4653 150",
  mobileDisplay: "061 530 9416",
  mobileHref: "tel:+27615309416",
  emailDisplay: "asamathsinstituteoflearning@gmail.com",
  emailHref: "mailto:asamathsinstituteoflearning@gmail.com",
  gdeLabel: "GDE 700400979",
} as const

const tuitionRows: {
  grade: string
  monthly: string
  termly: string
  yearly: string
}[] = [
  { grade: "Grade R", monthly: "R700.00", termly: "R2100.00", yearly: "R8400.00" },
  { grade: "Grade 1 – 3", monthly: "R750.00", termly: "R2250.00", yearly: "R9000.00" },
  { grade: "Grade 4 – 6", monthly: "R800.00", termly: "R2400.00", yearly: "R9600.00" },
  { grade: "Grade 7", monthly: "R850.00", termly: "R2550.00", yearly: "R10200.00" },
  { grade: "Grade 8", monthly: "R900.00", termly: "R2700.00", yearly: "R10800.00" },
  { grade: "Grade 9", monthly: "R900.00", termly: "R2700.00", yearly: "R10800.00" },
]

const paymentOptions = [
  {
    title: "Option A — Monthly",
    body: "Monthly fees must be paid by the 3rd of every month.",
    icon: CalendarClock,
  },
  {
    title: "Option B — Termly",
    body: "Termly payment must be paid by the 3rd.",
    icon: Banknote,
  },
  {
    title: "Option C — Yearly",
    body: "Yearly payment must be paid before 31 January.",
    icon: CreditCard,
  },
] as const

const bankDetails = {
  bank: "First National Bank",
  accountName: "Asamath’s Institute of Learning",
  accountNumber: "62623099571",
  branchCode: "250655",
  referenceHint: "Use the learner’s name, surname, and grade (e.g. Kagiso Makamo Grade 4).",
} as const

const faqs = [
  {
    q: "Is the registration fee refundable?",
    a: "No. The registration fee is non-refundable, as stated on the official 2026 fees schedule.",
  },
  {
    q: "What is the difference between registration and re-registration?",
    a: "New enrolments pay the registration fee (R1000.00). Returning learners pay the re-registration fee (R450.00). A late re-registration fee of R500.00 applies if re-registration is not completed on time—confirm dates with the office.",
  },
  {
    q: "How should I pay?",
    a: "Fees must be deposited into the school’s bank account only (see banking details on this page). Use the reference format advised so allocations are quick and accurate.",
  },
  {
    q: "When are termly or yearly fees due?",
    a: "Option B (termly) must be paid by the 3rd as advised for each term. Option C (yearly) is due before 31 January. Confirm exact dates on the letter from the office.",
  },
]

export default function FeesPage() {
  return (
    <>
      <section id="asa-fees" className="scroll-mt-28 bg-gradient-to-br from-primary-50 to-white pb-24 pt-32 md:pb-16">
        <div className="container-custom">
          <PageIntro
            eyebrow="2026 fee schedule"
            title="School Fees"
            subtitle="Registration, tuition, payment options, and banking details"
            breadcrumbs={[{ label: "Fees" }]}
          />

          <FadeIn delay={0.03}>
            <PageBanner
              src={CAMPUS_PHOTOS.adminOffice}
              alt={`School administration office at ${SCHOOL_INFO.shortName} supporting fee enquiries`}
              headline="Clear fees, fair options — invest in your child's year with confidence"
              subline={`Questions about deposits, payment plans, or banking references? Our office team is ready to help.`}
              badge="Fees & finance"
              variant="compact"
              objectPosition="center 35%"
              className="mb-8"
            />
          </FadeIn>

          {/* Office strip — matches letterhead-style info from the schedule */}
          <FadeIn delay={0.04}>
            <Card className="mb-8 border-primary-100 bg-white/90 shadow-sm ring-1 ring-primary-100/80">
              <CardContent className="grid gap-6 p-6 sm:grid-cols-2 sm:p-8 lg:grid-cols-4">
                <div className="flex gap-3 lg:col-span-2">
                  <MapPin className="mt-0.5 h-5 w-5 shrink-0 text-primary-600" aria-hidden />
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-primary-700">Address</p>
                    <p className="mt-1 text-sm leading-relaxed text-gray-700">{SCHOOL_INFO.address}</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <Phone className="mt-0.5 h-5 w-5 shrink-0 text-primary-600" aria-hidden />
                  <div className="space-y-2 text-sm text-gray-700">
                    <p>
                      <span className="text-xs font-semibold uppercase text-primary-700">Tel </span>
                      <a
                        href={FEES_OFFICE.telHref}
                        className="font-medium text-primary-800 underline-offset-2 hover:underline"
                      >
                        {FEES_OFFICE.telDisplay}
                      </a>
                    </p>
                    <p className="flex items-center gap-2">
                      <Printer className="h-3.5 w-3.5 text-gray-400" aria-hidden />
                      <span className="text-xs font-semibold uppercase text-primary-700">Fax </span>
                      {FEES_OFFICE.faxDisplay}
                    </p>
                    <p className="flex items-center gap-2">
                      <Smartphone className="h-3.5 w-3.5 text-gray-400" aria-hidden />
                      <span className="text-xs font-semibold uppercase text-primary-700">Mobile </span>
                      <a
                        href={FEES_OFFICE.mobileHref}
                        className="font-medium text-primary-800 underline-offset-2 hover:underline"
                      >
                        {FEES_OFFICE.mobileDisplay}
                      </a>
                    </p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <Building2 className="mt-0.5 h-5 w-5 shrink-0 text-primary-600" aria-hidden />
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-primary-700">Email &amp; GDE</p>
                    <a
                      href={FEES_OFFICE.emailHref}
                      className="mt-1 block text-sm font-medium text-primary-800 underline-offset-2 hover:underline"
                    >
                      {FEES_OFFICE.emailDisplay}
                    </a>
                    <p className="mt-2 text-sm text-gray-600">{FEES_OFFICE.gdeLabel}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </FadeIn>

          <div className="grid gap-8 lg:grid-cols-12">
            {/* Registration */}
            <FadeIn delay={0.06} className="lg:col-span-5">
              <Card className="h-full border-2 border-primary-700/25 bg-primary-50/40 shadow-sm ring-1 ring-primary-200/60">
                <CardHeader className="pb-2">
                  <CardTitle className="font-display text-xl text-primary-950">Registration fees</CardTitle>
                  <CardDescription className="text-primary-800/90">
                    As per the 2026 schedule — please confirm dates with the office.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <ul className="space-y-3 text-sm text-gray-800">
                    <li className="flex justify-between gap-4 border-b border-primary-200/60 pb-3">
                      <span className="font-medium">Registration fee (new)</span>
                      <span className="shrink-0 font-semibold tabular-nums text-primary-900">R1000.00</span>
                    </li>
                    <li className="flex justify-between gap-4 border-b border-primary-200/60 pb-3">
                      <span className="font-medium">Re-registration fee</span>
                      <span className="shrink-0 font-semibold tabular-nums text-primary-900">R450.00</span>
                    </li>
                    <li className="flex justify-between gap-4">
                      <span className="font-medium">Late re-registration fee</span>
                      <span className="shrink-0 font-semibold tabular-nums text-primary-900">R500.00</span>
                    </li>
                  </ul>
                  <p className="rounded-lg bg-primary-900 px-3 py-2.5 text-center text-sm font-semibold text-white">
                    Registration fee is non-refundable
                  </p>
                </CardContent>
              </Card>
            </FadeIn>

            {/* Office panel — visible on all breakpoints beside registration */}
            <FadeIn delay={0.08} className="lg:col-span-7">
              <div className="relative h-full min-h-[240px] overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-md ring-1 ring-primary-100 sm:min-h-[280px]">
                <Image
                  src={photoSrc(CAMPUS_PHOTOS.bankLogos)}
                  alt="South African bank logos: Nedbank, Capitec, FNB, Standard Bank, and Absa — common channels for school fee payments"
                  fill
                  className="object-contain object-center p-4 sm:p-6"
                  sizes="(max-width:1024px)100vw,58vw"
                  placeholder="blur"
                  blurDataURL={STUDENT_PHOTO_BLUR_DATA_URL}
                />
                <div
                  className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_top,rgba(10,15,26,0.92)_0%,rgba(10,15,26,0.45)_28%,transparent_52%)]"
                  aria-hidden
                />
                <div className="absolute bottom-5 left-5 right-5 sm:bottom-6 sm:left-6 sm:right-6">
                  <p className="font-display text-base font-semibold leading-snug text-white drop-shadow sm:text-lg md:text-xl">
                    Visit or call the office for payment plans and proof of deposit.
                  </p>
                  <p className="mt-2 text-sm text-primary-100/95">
                    {SCHOOL_INFO.shortName} · {SCHOOL_INFO.suburb}, {SCHOOL_INFO.city}
                  </p>
                </div>
              </div>
            </FadeIn>
          </div>

          {/* Tuition table */}
          <FadeIn delay={0.1}>
            <Card className="mt-10 border-gray-100 shadow-sm">
              <CardHeader className="border-b border-gray-100 bg-gradient-to-r from-white to-primary-50/30 pb-4">
                <CardTitle className="font-display text-2xl text-gray-900">2026 tuition fees</CardTitle>
                <CardDescription>Amounts per grade — monthly, termly, or yearly payment.</CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[32rem] border-collapse text-left text-sm">
                    <thead>
                      <tr className="border-b border-gray-200 bg-primary-900 text-white">
                        <th scope="col" className="px-4 py-3.5 font-display text-xs font-semibold uppercase tracking-wider sm:px-6">
                          Grade
                        </th>
                        <th scope="col" className="px-4 py-3.5 font-display text-xs font-semibold uppercase tracking-wider sm:px-6">
                          Monthly
                        </th>
                        <th scope="col" className="px-4 py-3.5 font-display text-xs font-semibold uppercase tracking-wider sm:px-6">
                          Termly
                        </th>
                        <th scope="col" className="px-4 py-3.5 font-display text-xs font-semibold uppercase tracking-wider sm:px-6">
                          Yearly
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 text-gray-800">
                      {tuitionRows.map((row) => (
                        <tr key={row.grade} className="even:bg-gray-50/50 hover:bg-primary-50/30">
                          <th
                            scope="row"
                            className="whitespace-nowrap px-4 py-3 font-semibold text-primary-950 sm:px-6"
                          >
                            {row.grade}
                          </th>
                          <td className="px-4 py-3 font-medium tabular-nums text-gray-900 sm:px-6">{row.monthly}</td>
                          <td className="px-4 py-3 font-medium tabular-nums text-gray-900 sm:px-6">{row.termly}</td>
                          <td className="px-4 py-3 font-medium tabular-nums text-gray-900 sm:px-6">{row.yearly}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <p className="border-t border-gray-100 px-4 py-3 text-xs text-gray-500 sm:px-6">
                  Enquire at the office for term dates, payment plans, or fee-related queries.
                </p>
              </CardContent>
            </Card>
          </FadeIn>

          {/* Payment options */}
          <FadeIn delay={0.12}>
            <div className="mt-10">
              <h3 className="mb-4 font-display text-xl font-bold text-gray-900">Payment options</h3>
              <div className="grid gap-4 md:grid-cols-3">
                {paymentOptions.map((opt) => (
                  <Card key={opt.title} className="border-gray-100 bg-white/90 shadow-sm">
                    <CardHeader className="pb-2">
                      <opt.icon className="mb-1 h-8 w-8 text-primary-600" aria-hidden />
                      <CardTitle className="text-base leading-snug">{opt.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm leading-relaxed text-gray-600">{opt.body}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
              <p className="mt-4 rounded-lg border border-primary-200 bg-primary-50/60 px-4 py-3 text-sm font-medium text-primary-950">
                Fees are strictly deposited to the school account.
              </p>
            </div>
          </FadeIn>

          {/* Bank details */}
          <FadeIn delay={0.14}>
            <Card className="mt-10 border-gray-100 shadow-sm">
              <CardHeader className="flex flex-row items-center gap-3 space-y-0 pb-2">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary-100 text-primary-800">
                  <Landmark className="h-6 w-6" aria-hidden />
                </div>
                <div>
                  <CardTitle className="font-display text-xl">Bank details</CardTitle>
                  <CardDescription>FNB — use the reference line exactly as instructed.</CardDescription>
                </div>
              </CardHeader>
              <CardContent className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">Bank</p>
                  <p className="mt-1 text-sm font-medium text-gray-900">{bankDetails.bank}</p>
                </div>
                <div className="sm:col-span-2">
                  <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">Account name</p>
                  <p className="mt-1 text-sm font-medium text-gray-900">{bankDetails.accountName}</p>
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">Account number</p>
                  <p className="mt-1 font-mono text-sm font-semibold tabular-nums text-gray-900">
                    {bankDetails.accountNumber}
                  </p>
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">Branch code</p>
                  <p className="mt-1 font-mono text-sm font-semibold tabular-nums text-gray-900">
                    {bankDetails.branchCode}
                  </p>
                </div>
                <div className="border-t border-gray-100 pt-4 sm:col-span-2 lg:col-span-4">
                  <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">Reference</p>
                  <p className="mt-1 text-sm leading-relaxed text-gray-700">{bankDetails.referenceHint}</p>
                </div>
              </CardContent>
            </Card>
          </FadeIn>

          {/* Disclaimer + FAQ */}
          <FadeIn delay={0.16}>
            <div className="relative isolate mx-auto mt-10 w-full overflow-hidden rounded-3xl border border-gray-100 bg-white/95 p-6 shadow-sm ring-1 ring-primary-100 md:p-8">
              <div className="pointer-events-none absolute inset-0 -z-10">
                <Image
                  src={photoSrc(CAMPUS_PHOTOS.building)}
                  alt=""
                  fill
                  placeholder="blur"
                  blurDataURL={STUDENT_PHOTO_BLUR_DATA_URL}
                  className="object-cover object-[center_40%] opacity-[0.12]"
                  sizes="100vw"
                  aria-hidden
                />
                <div className="absolute inset-0 bg-gradient-to-b from-white via-white/97 to-white" />
              </div>
              <div className="relative z-10">
                <div className="mb-8 flex items-start gap-3 rounded-xl border border-amber-200 bg-amber-50/95 p-4 backdrop-blur-[2px]">
                  <AlertCircle className="mt-0.5 h-5 w-5 flex-shrink-0 text-amber-600" aria-hidden />
                  <p className="text-sm text-amber-900">
                    <strong>Please note:</strong> This page reflects the 2026 schedule supplied to families.
                    Final interpretation, due dates for each term, and any updates are confirmed by the school
                    office. Website totals are for convenience; your deposit slip and school correspondence remain
                    authoritative.
                  </p>
                </div>

                <h3 className="mb-6 font-display text-2xl font-bold text-gray-900">Frequently asked questions</h3>
                <Accordion type="single" collapsible className="text-left">
                  {faqs.map((faq, i) => (
                    <AccordionItem key={faq.q} value={`faq-${i}`}>
                      <AccordionTrigger className="text-left">{faq.q}</AccordionTrigger>
                      <AccordionContent>
                        <p className="text-gray-600">{faq.a}</p>
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>

                <div className="mt-8 text-center">
                  <Link href="/contact">
                    <Button size="lg" className="bg-primary-600 text-white hover:bg-primary-700">
                      Fee enquiries &amp; proof of payment
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </FadeIn>
        </div>
      </section>
      <CTABanner />
      <StickyMobileCta enquireLabel="Fee enquiry" />
    </>
  )
}

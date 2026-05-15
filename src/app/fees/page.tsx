import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import { ArrowRight, AlertCircle, Banknote, FileText, HelpCircle } from "lucide-react"
import { SectionHeading } from "@/components/shared/section-heading"
import { FadeIn } from "@/components/shared/fade-in"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion"
import { SCHOOL_INFO } from "@/lib/constants"
import { STUDENT_PHOTO_BLUR_DATA_URL } from "@/lib/student-photo-blur"
import { STUDENT_PHOTOS } from "@/lib/student-photos"

export const metadata: Metadata = {
  title: "School Fees",
  description: `Information about school fees at ${SCHOOL_INFO.name}. As an independent fee-paying institution, fees are determined by the school administration.`,
}

const faqs = [
  {
    q: "How are school fees determined?",
    a: "As an independent fee-paying institution, tuition fees are determined by the school administration to cover operational expenses and educational resources.",
  },
  {
    q: "Do fees vary by grade level?",
    a: "Yes, fees may vary depending on the grade level and any additional services offered. Please contact the school directly for the current fee structure.",
  },
  {
    q: "What payment methods are accepted?",
    a: "The school accepts various payment methods. Contact the administration office for details on accepted payment methods and payment plans.",
  },
  {
    q: "Is there a registration fee?",
    a: "Yes, there is typically a registration fee for new students. Contact the school for the current registration fee amount.",
  },
]

export default function FeesPage() {
  return (
    <>
      <section id="asa-fees" className="scroll-mt-28 bg-gradient-to-br from-primary-50 to-white pb-16 pt-32">
        <div className="container-custom">
          <FadeIn>
            <SectionHeading title="School Fees" subtitle="Transparent information about our fee structure" />
          </FadeIn>

          <div className="mb-12 grid gap-8 lg:grid-cols-3">
            <FadeIn>
              <Card className="h-full border-gray-100">
                <CardHeader>
                  <Banknote className="mb-2 h-10 w-10 text-primary-600" />
                  <CardTitle>Fee-Paying Institution</CardTitle>
                  <CardDescription>
                    {SCHOOL_INFO.name} is an independent fee-paying school.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-500">
                    Tuition fees are determined by the school administration to cover operational
                    expenses and educational resources. Families are responsible for paying the
                    specified fees.
                  </p>
                </CardContent>
              </Card>
            </FadeIn>

            <FadeIn delay={0.1}>
              <Card className="h-full border-gray-100">
                <CardHeader>
                  <FileText className="mb-2 h-10 w-10 text-primary-600" />
                  <CardTitle>Fee Variation</CardTitle>
                  <CardDescription>Fees depend on grade level and services.</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-500">
                    Fees may vary depending on grade level and additional services offered. For accurate
                    and up-to-date information on current fees, please contact the school directly.
                  </p>
                </CardContent>
              </Card>
            </FadeIn>

            <FadeIn delay={0.2}>
              <Card className="h-full border-gray-100">
                <CardHeader>
                  <HelpCircle className="mb-2 h-10 w-10 text-primary-600" />
                  <CardTitle>Get Exact Fees</CardTitle>
                  <CardDescription>Contact us for current fee schedules.</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="mb-4 text-sm text-gray-500">
                    For the most accurate and current fee information, please reach out to our
                    administration office directly.
                  </p>
                  <Link href="/contact">
                    <Button size="sm" className="w-full">
                      Inquire About Fees
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </FadeIn>
          </div>

          <FadeIn delay={0.3}>
            <div className="relative isolate mx-auto w-full max-w-none overflow-hidden rounded-3xl border border-gray-100 bg-white/95 p-6 shadow-sm ring-1 ring-primary-100 md:p-8">
              <div className="pointer-events-none absolute inset-0 -z-10">
                <Image
                  src={STUDENT_PHOTOS.mathChalkboardLesson}
                  alt=""
                  fill
                  placeholder="blur"
                  blurDataURL={STUDENT_PHOTO_BLUR_DATA_URL}
                  className="object-cover object-[center_50%] opacity-[0.14]"
                  sizes="(max-width:768px)100vw,48rem"
                  aria-hidden
                />
                <div className="absolute inset-0 bg-gradient-to-b from-white via-white/96 to-white" />
              </div>
              <div className="relative z-10">
                <div className="mb-8 flex items-start gap-3 rounded-xl border border-amber-200 bg-amber-50/95 p-4 backdrop-blur-[2px]">
                  <AlertCircle className="mt-0.5 h-5 w-5 flex-shrink-0 text-amber-600" />
                  <p className="text-sm text-amber-800">
                    <strong>Please note:</strong> The fee information provided here is general. For
                    accurate, up-to-date fee schedules and any applicable discounts or payment plans,
                    please contact the school administration directly.
                  </p>
                </div>

                <h3 className="mb-6 font-display text-2xl font-bold text-gray-900">
                  Frequently Asked Questions
                </h3>
                <Accordion type="single" collapsible className="text-left">
                  {faqs.map((faq, i) => (
                    <AccordionItem key={i} value={`faq-${i}`}>
                      <AccordionTrigger className="text-left">{faq.q}</AccordionTrigger>
                      <AccordionContent>
                        <p className="text-gray-500">{faq.a}</p>
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </div>
            </div>
          </FadeIn>
        </div>
      </section>
    </>
  )
}

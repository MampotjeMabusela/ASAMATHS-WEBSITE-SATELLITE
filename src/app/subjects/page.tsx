import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import { ArrowRight, BookOpen, Info } from "lucide-react"
import { SectionHeading } from "@/components/shared/section-heading"
import { FadeIn } from "@/components/shared/fade-in"
import { CTABanner } from "@/components/sections/cta-banner"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { SCHOOL_INFO } from "@/lib/constants"
import { STUDENT_PHOTO_BLUR_DATA_URL } from "@/lib/student-photo-blur"
import { STUDENT_PHOTOS } from "@/lib/student-photos"

export const metadata: Metadata = {
  title: "Subjects & Curriculum",
  description: `${SCHOOL_INFO.name} — curriculum overview for Grade R through Grade 7.`,
}

const foundationSubjects = ["Literacy (Home Language)", "Numeracy", "Life Skills"]

const intermediateSubjects = [
  "Home Language",
  "First Additional Language",
  "Mathematics",
  "Natural Sciences and Technology",
  "Social Sciences (History & Geography)",
  "Life Skills (Creative Arts, Physical Education, Personal and Social Well-being)",
]

const seniorSubjects = [
  "Home Language",
  "First Additional Language",
  "Mathematics",
  "Natural Sciences",
  "Social Sciences (History & Geography)",
  "Technology",
  "Economic and Management Sciences",
  "Life Orientation",
  "Creative Arts",
]

export default function SubjectsPage() {
  return (
    <>
      <section id="asa-subjects" className="scroll-mt-28 bg-gradient-to-br from-primary-50 to-white pb-16 pt-32">
        <div className="container-custom">
          <FadeIn>
            <SectionHeading
              title="Subjects & Curriculum"
              subtitle={`Learning areas from Grade R through Grade 7 at ${SCHOOL_INFO.shortName}`}
            />
          </FadeIn>

          <FadeIn delay={0.04}>
            <div className="relative mb-12 h-52 w-full overflow-hidden rounded-3xl shadow-xl ring-1 ring-primary-200 sm:h-56 md:h-64">
              <Image
                src={STUDENT_PHOTOS.classroom}
                alt={`Foundation and intermediate-phase classroom activity—learners contributing to lessons at ${SCHOOL_INFO.shortName}`}
                fill
                placeholder="blur"
                blurDataURL={STUDENT_PHOTO_BLUR_DATA_URL}
                className="object-cover object-[center_35%]"
                sizes="100vw"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-primary-950/75 via-primary-800/45 to-primary-600/25" />
              <p className="absolute bottom-4 left-4 right-4 font-display text-xl font-bold text-white drop-shadow sm:bottom-6 sm:left-6 sm:text-2xl">
                Curriculum with heart—Foundation through Grade 7
              </p>
            </div>
          </FadeIn>

          <FadeIn delay={0.05}>
            <div className="mb-12 w-full rounded-xl border border-primary-100 bg-white/80 p-6 shadow-sm md:p-8">
              <div className="flex gap-3">
                <BookOpen className="mt-0.5 h-6 w-6 flex-shrink-0 text-primary-600" />
                <div className="space-y-4 text-gray-700">
                  <p className="leading-relaxed">
                    <strong>{SCHOOL_INFO.name}</strong> offers <strong>Grade R - Grade 7</strong>. The phases
                    below follow the broad South African General Education and Training (GET) structure:{" "}
                    <strong>Foundation Phase</strong> (Grades R–3), <strong>Intermediate Phase</strong> (Grades
                    4–6), and in <strong>Grade 7</strong> learners work within{" "}
                    <strong>Senior Phase</strong> learning areas.
                  </p>
                  <p className="text-sm leading-relaxed text-gray-600">
                    For more information about the Subjects offered, email us or call Asamaths Institute
                    Offices.
                  </p>
                </div>
              </div>
            </div>
          </FadeIn>

          <div className="mb-12 w-full space-y-6">
            <FadeIn>
              <Card className="border-gray-100">
                <CardHeader className="pb-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge>Foundation Phase</Badge>
                    <CardTitle className="text-lg sm:text-xl">Grades R – 3</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="grid gap-6 lg:grid-cols-2 lg:items-start">
                  <SubjectList items={foundationSubjects} />
                  <div className="relative aspect-[4/3] min-h-[200px] overflow-hidden rounded-2xl shadow-md ring-1 ring-gray-200">
                    <Image
                      src={STUDENT_PHOTOS.foundation}
                      alt={`Foundation-phase home-language literacy work with teacher support at ${SCHOOL_INFO.shortName}`}
                      fill
                      placeholder="blur"
                      blurDataURL={STUDENT_PHOTO_BLUR_DATA_URL}
                      className="object-cover object-center"
                      sizes="(max-width:1024px)100vw,50vw"
                    />
                  </div>
                </CardContent>
              </Card>
            </FadeIn>

            <FadeIn delay={0.06}>
              <Card className="border-gray-100">
                <CardHeader className="pb-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge variant="accent">Intermediate Phase</Badge>
                    <CardTitle className="text-lg sm:text-xl">Grades 4 – 6</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="grid gap-6 lg:grid-cols-2 lg:items-start">
                  <SubjectList items={intermediateSubjects} />
                  <div className="relative aspect-[4/3] min-h-[200px] overflow-hidden rounded-2xl shadow-md ring-1 ring-gray-200">
                    <Image
                      src={STUDENT_PHOTOS.mathWhiteboardStudent}
                      alt={`Intermediate-phase learner practising two-digit arithmetic on the whiteboard at ${SCHOOL_INFO.shortName}`}
                      fill
                      placeholder="blur"
                      blurDataURL={STUDENT_PHOTO_BLUR_DATA_URL}
                      className="object-cover object-[center_35%]"
                      sizes="(max-width:1024px)100vw,50vw"
                    />
                  </div>
                </CardContent>
              </Card>
            </FadeIn>

            <FadeIn delay={0.09}>
              <div className="relative min-h-[200px] w-full overflow-hidden rounded-3xl shadow-lg ring-1 ring-primary-200 md:min-h-[260px]">
                <Image
                  src={STUDENT_PHOTOS.mathChalkboardLesson}
                  alt={`Mathematics educator modelling written methods on chalkboard observed by Grade R–7 learners at ${SCHOOL_INFO.shortName}`}
                  fill
                  placeholder="blur"
                  blurDataURL={STUDENT_PHOTO_BLUR_DATA_URL}
                  className="object-cover object-[center_40%]"
                  sizes="100vw"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-primary-950/80 via-primary-800/55 to-transparent" />
                <div className="absolute bottom-6 left-5 right-6 max-w-none sm:left-8 sm:bottom-8">
                  <p className="font-display text-lg font-semibold leading-snug text-white drop-shadow-md sm:text-2xl md:text-3xl">
                    Guided mathematics—with patient teaching and classrooms where every step counts.
                  </p>
                </div>
              </div>
            </FadeIn>

            <FadeIn delay={0.12}>
              <Card className="border-gray-100">
                <CardHeader className="pb-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge>Grade 7</Badge>
                    <CardTitle className="text-lg sm:text-xl">Senior-phase learning areas</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="space-y-5">
                  <p className="text-sm text-gray-600">
                    Nationally the Senior Phase spans Grades 7–9; at {SCHOOL_INFO.shortName},{" "}
                    <strong>Grade 7 is our final year</strong>. Typical learning areas at this level include:
                  </p>
                  <div className="grid gap-6 lg:grid-cols-2 lg:items-start">
                    <SubjectList items={seniorSubjects} />
                    <div className="relative aspect-[4/3] min-h-[200px] overflow-hidden rounded-2xl shadow-md ring-1 ring-gray-200">
                      <Image
                        src={STUDENT_PHOTOS.scienceLesson}
                        alt={`Hands-on Natural Sciences magnetism demonstration with educator and intermediate-phase learner at ${SCHOOL_INFO.shortName}`}
                        fill
                        placeholder="blur"
                        blurDataURL={STUDENT_PHOTO_BLUR_DATA_URL}
                        className="object-cover object-[center_45%]"
                        sizes="(max-width:1024px)100vw,50vw"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </FadeIn>
          </div>

          <FadeIn delay={0.18}>
            <div className="mb-10 flex w-full gap-3 rounded-xl border border-amber-200 bg-amber-50 p-4 md:p-5">
              <Info className="mt-0.5 h-5 w-5 flex-shrink-0 text-amber-700" />
              <div className="text-sm leading-relaxed text-amber-900">
                <p className="mb-3">
                  <strong>Important:</strong> Remember that the exact choice of subjects may vary depending on
                  the school&apos;s resources and expertise.
                </p>
                <p>
                  Moving on from Grade 7, families typically explore other high schools for further grades—
                  we&apos;re happy to discuss options when you{" "}
                  <Link href="/contact" className="font-medium underline hover:text-amber-950">
                    contact us
                  </Link>
                  .
                </p>
              </div>
            </div>
          </FadeIn>

          <FadeIn delay={0.22}>
            <div className="text-center">
              <Link href="/contact">
                <Button size="lg" className="bg-primary-600 text-white hover:bg-primary-700">
                  Ask About Our Offering
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </div>
          </FadeIn>
        </div>
      </section>
      <CTABanner />
    </>
  )
}

function SubjectList({ items }: { items: string[] }) {
  return (
    <ul className="list-inside list-disc space-y-1.5 text-sm text-gray-600 marker:text-primary-500 md:text-[15px]">
      {items.map((item) => (
        <li key={item} className="pl-1 leading-snug md:leading-relaxed">
          {item}
        </li>
      ))}
    </ul>
  )
}

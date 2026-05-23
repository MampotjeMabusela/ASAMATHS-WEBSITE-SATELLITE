import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import { ArrowRight, BookOpen, Info } from "lucide-react"
import { FadeIn } from "@/components/shared/fade-in"
import { PageIntro } from "@/components/shared/page-intro"
import { CTABanner } from "@/components/sections/cta-banner"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { SCHOOL_INFO } from "@/lib/constants"
import { PageBanner } from "@/components/shared/page-banner"
import { STUDENT_PHOTO_BLUR_DATA_URL } from "@/lib/student-photo-blur"
import { CAMPUS_PHOTOS, STUDENT_PHOTOS, photoSrc } from "@/lib/student-photos"

export const metadata: Metadata = {
  title: "Subjects",
  description: `${SCHOOL_INFO.name} — subjects by grade from Grade R through Grade 9.`,
}

type SubjectEntry = { name: string; about: string }

type SubjectBand = {
  badge: string
  title: string
  items: readonly SubjectEntry[]
  imageSrc: string
  imageAlt: string
  imageClass: string
}

const subjectBands: SubjectBand[] = [
  {
    badge: "Grade R",
    title: "Grade R",
    items: [
      {
        name: "Life Skills",
        about:
          "A holistic programme that weaves together early literacy, numeracy, creative play, movement, and personal and social growth—so young children learn routines, confidence, and curiosity in a nurturing, age-appropriate way.",
      },
      {
        name: "English",
        about:
          "Listening and speaking are emphasised alongside emergent reading and writing through stories, rhymes, and structured play. Learners build vocabulary and communication habits that support the rest of the Foundation Phase.",
      },
      {
        name: "Mathematics",
        about:
          "Hands-on activities introduce numbers, counting, shapes, patterns, and measurement in concrete ways. The focus is on mathematical language, exploration, and confidence before formal written methods.",
      },
    ],
    imageSrc: STUDENT_PHOTOS.foundation,
    imageAlt: `Foundation-phase learning at ${SCHOOL_INFO.shortName}`,
    imageClass: "object-cover object-center",
  },
  {
    badge: "Grades 1–3",
    title: "Grade 1–3",
    items: [
      {
        name: "Life Skills",
        about:
          "Creative Arts, Physical Education, and Personal and Social Well-being are integrated so learners practise teamwork, healthy habits, and self-expression while connecting learning to real-life contexts.",
      },
      {
        name: "English",
        about:
          "Home-language English develops reading fluency, comprehension, phonics, spelling, and writing for different purposes. Speaking and listening tasks build clarity, vocabulary, and confident classroom participation.",
      },
      {
        name: "Mathematics",
        about:
          "Number operations, place value, fractions in context, measurement, data handling, and simple geometry are taught with manipulatives and problem-solving routines so learners understand ideas before memorising rules.",
      },
      {
        name: "Afrikaans",
        about:
          "As First Additional Language, Afrikaans introduces listening stories, songs, basic vocabulary, short phrases, and early reading and writing so learners can communicate in everyday classroom and community settings.",
      },
    ],
    imageSrc: CAMPUS_PHOTOS.literacyNotebook,
    imageAlt: `Learner writing in a notebook during an English literacy lesson at ${SCHOOL_INFO.shortName}`,
    imageClass: "object-cover object-[center_35%]",
  },
  {
    badge: "Grades 4–6",
    title: "Grade 4–6",
    items: [
      {
        name: "English",
        about:
          "Reading and viewing, writing, listening, and speaking are developed through longer texts, structured paragraphs, and language conventions. Learners practise summarising, inferencing, and writing for real audiences.",
      },
      {
        name: "Mathematics",
        about:
          "Whole numbers, fractions, decimals, ratio thinking, perimeter and area, volume, angles, and data representations are explored with an emphasis on reasoning, multi-step problems, and clear mathematical communication.",
      },
      {
        name: "Afrikaans",
        about:
          "First Additional Language work strengthens listening comprehension, dialogues, grammar in context, reading passages, and short functional writing so learners can use Afrikaans with growing accuracy and confidence.",
      },
      {
        name: "Social Sciences",
        about:
          "History and Geography are studied as integrated themes—maps, places, resources, timelines, and sources—so learners understand change over time, human-environment relationships, and responsible citizenship.",
      },
      {
        name: "Natural Sciences",
        about:
          "Topics across life and physical science encourage questioning, fair tests, and recording evidence. Learners investigate matter, energy, ecosystems, and the human body at an age-appropriate conceptual level.",
      },
      {
        name: "Life-Skills/L.O",
        about:
          "Life Orientation–style learning brings together personal and social well-being, study habits, health and safety, physical education, and creative expression so learners develop resilience, respect, and healthy routines.",
      },
    ],
    imageSrc: CAMPUS_PHOTOS.classroomGroup,
    imageAlt: `Intermediate-phase learners in class at ${SCHOOL_INFO.shortName}`,
    imageClass: "object-cover object-[center_40%]",
  },
  {
    badge: "Grades 7–9",
    title: "Grade 7–9",
    items: [
      {
        name: "English",
        about:
          "Literature, language structures, and extended writing are consolidated. Learners analyse texts, plan essays, refine grammar and style, and present ideas orally with increasing independence in preparation for further study.",
      },
      {
        name: "Mathematics",
        about:
          "Algebraic thinking, integers, exponents, functions, geometry proofs and constructions, statistics, and probability are developed with attention to exam readiness, reasoning chains, and checking strategies.",
      },
      {
        name: "Afrikaans",
        about:
          "More demanding texts, transactional writing, prepared speeches, and formal language use build proficiency. Grammar, vocabulary, and comprehension tasks align with Senior Phase expectations for the FAL programme.",
      },
      {
        name: "Social Sciences",
        about:
          "History deepens source-based enquiry and cause-and-effect; Geography strengthens map skills, development issues, and environmental awareness. Both subjects emphasise evidence, perspective, and structured arguments.",
      },
      {
        name: "Natural Sciences",
        about:
          "Integrated life and physical science content includes cells, reproduction, chemical reactions, electricity, and forces. Practical work, safety, and scientific literacy support conceptual understanding and application.",
      },
      {
        name: "Life-Skills/L.O",
        about:
          "Careers guidance, social and emotional learning, physical education, creative arts pathways, and civic themes help adolescents set goals, manage stress, understand rights and responsibilities, and lead healthy lives.",
      },
      {
        name: "EMS",
        about:
          "Economic and Management Sciences introduces the economy as a system, entrepreneurship, simple financial documents, and the role of business and consumers—linking classroom tasks to everyday money and work decisions.",
      },
      {
        name: "Creative Arts",
        about:
          "Visual Art, Music, Drama, and Dance are explored through performance, composition, reflection, and appreciation. Learners experiment with techniques, collaborate in ensembles, and build confidence in creative expression.",
      },
      {
        name: "Technology",
        about:
          "Design processes, materials and structures, systems and control, and responsible use of tools (including basic digital skills where applicable) encourage problem-solving, sketching solutions, and evaluating real products.",
      },
    ],
    imageSrc: STUDENT_PHOTOS.scienceLesson,
    imageAlt: `Senior-phase learners in uniform during a classroom lesson at ${SCHOOL_INFO.shortName}`,
    imageClass: "object-cover object-[center_45%]",
  },
]

export default function SubjectsPage() {
  return (
    <>
      <section id="asa-subjects" className="scroll-mt-28 bg-gradient-to-br from-primary-50 to-white pb-16 pt-32">
        <div className="container-custom">
          <PageIntro
            eyebrow="Curriculum"
            title="Subjects"
            subtitle={`Learning areas by grade at ${SCHOOL_INFO.shortName}`}
            breadcrumbs={[{ label: "Subjects" }]}
          />

          <FadeIn delay={0.04}>
            <PageBanner
              src={CAMPUS_PHOTOS.curriculumPlayground}
              alt={`Learners in uniform playing together at ${SCHOOL_INFO.shortName}`}
              headline="Subjects from Grade R through Grade 9"
              subline="Structured learning across foundation, intermediate, and senior phases."
              badge="Curriculum"
              variant="wide"
              objectPosition="center 40%"
              className="mb-12"
            />
          </FadeIn>

          <FadeIn delay={0.05}>
            <div className="mb-12 w-full rounded-xl border border-primary-100 bg-white/80 p-6 shadow-sm md:p-8">
              <div className="flex gap-3">
                <BookOpen className="mt-0.5 h-6 w-6 flex-shrink-0 text-primary-600" />
                <div className="space-y-4 text-gray-700">
                  <p className="leading-relaxed">
                    <strong>{SCHOOL_INFO.name}</strong> lists the subjects below by grade band. Each item includes
                    a short description of what learners typically cover; your child&apos;s class teacher can share
                    term plans and assessment schedules.
                  </p>
                  <p className="text-sm leading-relaxed text-gray-600">
                    For timetables, optional streams, or the latest offering, email us or call Asamaths Institute
                    offices.
                  </p>
                </div>
              </div>
            </div>
          </FadeIn>

          <div className="mb-12 w-full space-y-6">
            {subjectBands.map((band, index) => (
              <FadeIn key={band.title} delay={0.06 + index * 0.03}>
                <Card className="border-gray-100 shadow-sm transition-shadow hover:shadow-md">
                  <CardHeader className="pb-2">
                    <div className="flex flex-wrap items-center gap-2">
                      <Badge variant={index % 2 === 1 ? "accent" : "default"}>{band.badge}</Badge>
                      <CardTitle className="text-lg sm:text-xl">{band.title}</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent className="grid gap-6 lg:grid-cols-2 lg:items-start">
                    <NumberedSubjectList items={band.items} bandKey={band.title} />
                    <div className="relative aspect-[4/3] min-h-[200px] overflow-hidden rounded-2xl shadow-md ring-1 ring-gray-200 lg:sticky lg:top-28">
                      <Image
                        src={photoSrc(band.imageSrc)}
                        alt={band.imageAlt}
                        fill
                        placeholder="blur"
                        blurDataURL={STUDENT_PHOTO_BLUR_DATA_URL}
                        className={band.imageClass}
                        sizes="(max-width:1024px)100vw,50vw"
                      />
                    </div>
                  </CardContent>
                </Card>
              </FadeIn>
            ))}
          </div>

          <FadeIn delay={0.18}>
            <div className="mb-10 flex w-full gap-3 rounded-xl border border-amber-200 bg-amber-50 p-4 md:p-5">
              <Info className="mt-0.5 h-5 w-5 flex-shrink-0 text-amber-700" />
              <div className="text-sm leading-relaxed text-amber-900">
                <p className="mb-3">
                  <strong>Important:</strong> The exact timetable, pacing, and subject choices may vary depending on
                  the school&apos;s resources and staffing.
                </p>
                <p>
                  If you have questions about a specific grade,{" "}
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

function NumberedSubjectList({ items, bandKey }: { items: readonly SubjectEntry[]; bandKey: string }) {
  return (
    <ol className="list-decimal space-y-5 pl-5 marker:font-semibold marker:text-primary-600">
      {items.map((item) => (
        <li key={`${bandKey}-${item.name}`} className="pl-1 text-[15px] leading-snug text-gray-900 md:text-base md:leading-relaxed">
          <span className="font-semibold text-primary-950">{item.name}</span>
          <p className="mt-1.5 text-sm font-normal leading-relaxed text-gray-600 md:text-[15px]">{item.about}</p>
        </li>
      ))}
    </ol>
  )
}

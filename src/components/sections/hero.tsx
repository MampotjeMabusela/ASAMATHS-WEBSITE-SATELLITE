"use client"

import Image from "next/image"
import Link from "next/link"
import { motion, useReducedMotion } from "framer-motion"
import { ArrowRight, Star } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { SCHOOL_INFO } from "@/lib/constants"
import { STUDENT_PHOTO_BLUR_DATA_URL } from "@/lib/student-photo-blur"
import { STUDENT_PHOTOS } from "@/lib/student-photos"

function HeroStudentImage({ className }: { className?: string }) {
  return (
    <div
      className={`relative aspect-[4/5] w-full max-w-none overflow-hidden rounded-3xl border border-white/25 bg-primary-900/40 shadow-2xl lg:max-h-[min(620px,72vh)] ${className ?? ""}`}
    >
      <Image
        src={STUDENT_PHOTOS.hero}
        alt={`Grade R–7 learner participating confidently in a whole-class lesson at ${SCHOOL_INFO.shortName}`}
        fill
        placeholder="blur"
        blurDataURL={STUDENT_PHOTO_BLUR_DATA_URL}
        className="object-cover object-[center_25%]"
        sizes="(max-width: 1024px) 100vw, 50vw"
        priority
      />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-primary-950/50 via-transparent to-primary-950/20" />
      <div className="absolute -bottom-3 -left-3 rounded-xl border border-white/25 bg-white/15 px-4 py-2.5 text-xs text-white shadow-lg backdrop-blur-md sm:px-5 sm:py-3 sm:text-sm">
        <p className="font-bold">NatEmis</p>
        <p className="text-primary-100">{SCHOOL_INFO.natEmis}</p>
      </div>
      <div className="absolute -right-3 -top-3 flex h-14 w-14 items-center justify-center rounded-full bg-accent-500 text-xs font-bold text-gray-900 shadow-lg sm:h-16 sm:w-16 sm:text-sm">
        {SCHOOL_INFO.surveyYear}
      </div>
    </div>
  )
}

export function Hero() {
  const reduceMotion = useReducedMotion()
  const textMotionTransition = reduceMotion
    ? { duration: 0 }
    : { duration: 0.8, ease: "easeOut" as const }
  const heroImgTransition = reduceMotion
    ? { duration: 0 }
    : { duration: 1, delay: 0.2, ease: "easeOut" as const }

  return (
    <section
      id="asa-home-hero"
      className="relative flex min-h-[90vh] items-center overflow-hidden bg-gradient-to-br from-primary-950 via-primary-900 to-primary-800 pt-24 scroll-mt-24"
    >
      {/* Optional depth: classroom layer (very subtle, right side) */}
      <div className="pointer-events-none absolute inset-0 opacity-[0.14]">
        <Image
          src={STUDENT_PHOTOS.classroom}
          alt=""
          fill
          placeholder="blur"
          blurDataURL={STUDENT_PHOTO_BLUR_DATA_URL}
          className="object-cover object-center"
          sizes="100vw"
          aria-hidden
        />
      </div>

      <div className="absolute inset-0 opacity-[0.06]">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `radial-gradient(circle at 25% 25%, white 1px, transparent 1px)`,
            backgroundSize: "50px 50px",
          }}
        />
      </div>

      <div className="absolute -right-40 -top-40 h-96 w-96 rounded-full bg-accent-500/20 blur-3xl" />
      <div className="absolute -bottom-40 -left-40 h-96 w-96 rounded-full bg-primary-400/10 blur-3xl" />

      <div className="container-custom relative z-10 py-16 sm:py-20">
        <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-12">
          <motion.div
            initial={{ opacity: reduceMotion ? 1 : 0, y: reduceMotion ? 0 : 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={textMotionTransition}
            className="space-y-7"
          >
            <Badge variant="accent" className="text-xs tracking-wide">
              {SCHOOL_INFO.sector} {SCHOOL_INFO.phase}
            </Badge>

            <h1 className="font-display text-4xl font-extrabold leading-tight text-white sm:text-5xl lg:text-6xl">
              Shaping Future
              <br />
              <span className="text-accent-400">Leaders</span> with
              <br />
              Excellence
            </h1>

            <div className="lg:hidden">
              <HeroStudentImage />
            </div>

            <p className="max-w-none text-lg leading-relaxed text-primary-100">
              Welcome to <strong className="text-white">{SCHOOL_INFO.name}</strong>, an independent
              combined school in {SCHOOL_INFO.suburb}, {SCHOOL_INFO.city}. With {SCHOOL_INFO.totalLearners} learners and
              a dedicated team of {SCHOOL_INFO.totalEducators} educators, we provide quality education
              in a disciplined, nurturing environment.
            </p>

            <div className="flex flex-wrap gap-4">
              <Link href="/admissions">
                <Button
                  size="lg"
                  className="bg-accent-500 font-semibold text-gray-900 shadow-xl hover:bg-accent-600"
                >
                  Apply for Admission
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link href="/about">
                <Button size="lg" variant="outline" className="border-white/20 text-white hover:bg-white/10">
                  Learn More
                </Button>
              </Link>
            </div>

            <div className="flex flex-wrap gap-6 pt-2">
              {[
                { label: "Learners", value: SCHOOL_INFO.totalLearners.toString() },
                { label: "Educators", value: SCHOOL_INFO.totalEducators.toString() },
                { label: "Ratio", value: SCHOOL_INFO.studentTeacherRatio },
              ].map((stat) => (
                <div key={stat.label} className="flex items-center gap-2">
                  <Star className="h-4 w-4 text-accent-400" />
                  <span className="text-sm text-primary-200">
                    <strong className="text-white">{stat.value}</strong> {stat.label}
                  </span>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: reduceMotion ? 1 : 0, scale: reduceMotion ? 1 : 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={heroImgTransition}
            className="hidden justify-center lg:flex lg:justify-end"
          >
            <HeroStudentImage />
          </motion.div>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0">
        <svg
          viewBox="0 0 1440 100"
          fill="none"
          preserveAspectRatio="none"
          className="h-[60px] w-full"
        >
          <path d="M0 50C240 100 480 0 720 50C960 100 1200 0 1440 50V100H0V50Z" fill="white" />
        </svg>
      </div>
    </section>
  )
}

"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { AnimatePresence, motion, useReducedMotion } from "framer-motion"
import { ArrowRight, Star } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { SCHOOL_INFO } from "@/lib/constants"
import { STUDENT_PHOTO_BLUR_DATA_URL } from "@/lib/student-photo-blur"
import { HERO_SLIDESHOW, STUDENT_PHOTOS, photoSrc } from "@/lib/student-photos"

const SLIDE_INTERVAL_MS = 3000

function HeroStudentSlideshow({ className }: { className?: string }) {
  const reduceMotion = useReducedMotion()
  const [index, setIndex] = useState(0)
  const slideCount = HERO_SLIDESHOW.length
  const slide = HERO_SLIDESHOW[index]

  useEffect(() => {
    if (reduceMotion || slideCount <= 1) return
    const id = window.setInterval(() => {
      setIndex((current) => (current + 1) % slideCount)
    }, SLIDE_INTERVAL_MS)
    return () => window.clearInterval(id)
  }, [reduceMotion, slideCount])

  useEffect(() => {
    if (slideCount <= 1) return
    const next = HERO_SLIDESHOW[(index + 1) % slideCount]
    const img = new window.Image()
    img.src = photoSrc(next.src)
  }, [index, slideCount])

  if (!slide) {
    return null
  }

  return (
    <div
      className={cn(
        "relative aspect-[4/5] w-full max-w-none overflow-hidden rounded-3xl border border-white/25 bg-primary-900/40 shadow-2xl lg:max-h-[min(620px,72vh)]",
        className
      )}
    >
      <AnimatePresence mode="sync">
        <motion.div
          key={slide.src}
          className="absolute inset-0"
          initial={reduceMotion ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={reduceMotion ? undefined : { opacity: 0 }}
          transition={{ duration: 0.7, ease: "easeInOut" }}
        >
          <Image
            src={photoSrc(slide.src)}
            alt={slide.alt}
            fill
            placeholder="blur"
            blurDataURL={STUDENT_PHOTO_BLUR_DATA_URL}
            className="object-cover"
            style={{ objectPosition: slide.objectPosition ?? "center 25%" }}
            sizes="(max-width: 1024px) 100vw, 50vw"
            quality={95}
            priority={index === 0}
          />
        </motion.div>
      </AnimatePresence>

      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-primary-950/50 via-transparent to-primary-950/20" />

      {/* Slide progress — subtle dots */}
      {slideCount > 1 && !reduceMotion ? (
        <div
          className="absolute bottom-4 left-1/2 z-10 flex -translate-x-1/2 gap-1.5 rounded-full bg-primary-950/40 px-2.5 py-1.5 backdrop-blur-sm"
          aria-hidden
        >
          {HERO_SLIDESHOW.map((slide, i) => (
            <span
              key={slide.src}
              className={cn(
                "h-1.5 rounded-full transition-all duration-500",
                i === index ? "w-5 bg-accent-400" : "w-1.5 bg-white/50"
              )}
            />
          ))}
        </div>
      ) : null}

      <div className="absolute -bottom-3 -left-3 z-10 rounded-xl border border-white/25 bg-white/15 px-4 py-2.5 text-xs text-white shadow-lg backdrop-blur-md sm:px-5 sm:py-3 sm:text-sm">
        <p className="font-bold">NatEmis</p>
        <p className="text-primary-100">{SCHOOL_INFO.natEmis}</p>
      </div>
      <div className="absolute -right-3 -top-3 z-10 flex h-14 w-14 items-center justify-center rounded-full bg-accent-500 text-xs font-bold text-gray-900 shadow-lg sm:h-16 sm:w-16 sm:text-sm">
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
      className="relative flex min-h-[85svh] items-center overflow-hidden bg-gradient-to-br from-primary-950 via-primary-900 to-primary-800 pt-24 scroll-mt-24 supports-[min-height:100dvh]:min-h-[85dvh]"
    >
      {/* Optional depth: classroom layer (very subtle, right side) */}
      <div className="pointer-events-none absolute inset-0 opacity-[0.14]">
        <Image
          src={photoSrc(STUDENT_PHOTOS.classroom)}
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

            <h1 className="text-balance font-display text-4xl font-extrabold leading-tight text-white sm:text-5xl lg:text-6xl">
              Shaping Future
              <br />
              <span className="text-accent-400">Leaders</span> with
              <br />
              Excellence
            </h1>

            <div className="lg:hidden">
              <HeroStudentSlideshow />
            </div>

            <p className="max-w-none text-lg leading-relaxed text-primary-100">
              Welcome to <strong className="text-white">{SCHOOL_INFO.name}</strong>, an independent
              combined school in {SCHOOL_INFO.suburb}, {SCHOOL_INFO.city}. With {SCHOOL_INFO.totalLearners}{" "}
              learners and
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
                <Button size="lg" variant="outlineOnDark">
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
            <HeroStudentSlideshow />
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

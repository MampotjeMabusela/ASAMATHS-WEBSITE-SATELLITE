"use client"

import Image from "next/image"
import { Users, UserCheck, Building2, Award } from "lucide-react"
import { FadeIn } from "@/components/shared/fade-in"
import { AnimatedStatValue } from "@/components/shared/animated-stat-value"
import { SCHOOL_INFO } from "@/lib/constants"
import { STUDENT_PHOTO_BLUR_DATA_URL } from "@/lib/student-photo-blur"
import { STUDENT_PHOTOS, photoSrc } from "@/lib/student-photos"

const stats = [
  {
    icon: Users,
    value: SCHOOL_INFO.totalLearners.toString(),
    label: "Total Learners",
    suffix: "+",
  },
  {
    icon: UserCheck,
    value: SCHOOL_INFO.totalEducators.toString(),
    label: "Dedicated Educators",
  },
  {
    icon: Building2,
    value: SCHOOL_INFO.studentTeacherRatio,
    label: "Student-Teacher Ratio",
  },
  {
    icon: Award,
    value: SCHOOL_INFO.sector,
    label: "School Type",
  },
]

export function StatsBanner() {
  return (
    <section
      id="asa-home-stats"
      className="relative scroll-mt-24 overflow-hidden bg-gray-50 py-16"
    >
      <div className="pointer-events-none absolute inset-0 -z-10">
        <Image
          src={photoSrc(STUDENT_PHOTOS.playground)}
          alt=""
          fill
          placeholder="blur"
          blurDataURL={STUDENT_PHOTO_BLUR_DATA_URL}
          className="object-cover object-[center_30%]"
          sizes="100vw"
          aria-hidden
        />
      </div>
      <div className="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-b from-white/93 via-gray-50/90 to-white/93" />

      <div className="container-custom relative z-10">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
          {stats.map((stat, i) => (
            <FadeIn key={stat.label} delay={i * 0.1} className="text-center">
              <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-white/90 text-primary-600 shadow-sm ring-1 ring-primary-100 backdrop-blur-sm">
                <stat.icon className="h-6 w-6" />
              </div>
              <p className="font-display text-3xl font-bold text-gray-900 sm:text-4xl">
                <AnimatedStatValue value={stat.value} suffix={stat.suffix} />
              </p>
              <p className="mt-1 text-sm font-medium text-gray-600">{stat.label}</p>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  )
}

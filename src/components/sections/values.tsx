"use client"

import Image from "next/image"
import { Trophy, Shield, Users, Lightbulb, type LucideIcon } from "lucide-react"
import { SectionHeading } from "@/components/shared/section-heading"
import { FadeIn } from "@/components/shared/fade-in"
import { Card, CardContent } from "@/components/ui/card"
import { SCHOOL_INFO, VALUES } from "@/lib/constants"
import { STUDENT_PHOTO_BLUR_DATA_URL } from "@/lib/student-photo-blur"
import { STUDENT_PHOTOS, photoSrc } from "@/lib/student-photos"

const iconMap: Record<string, LucideIcon> = {
  Trophy,
  Shield,
  Users,
  Lightbulb,
}

export function Values() {
  return (
    <section id="asa-home-values" className="scroll-mt-24 py-20">
      <div className="container-custom">
        <SectionHeading
          eyebrow="What we stand for"
          title="Our Core Values"
          subtitle="The principles that guide every aspect of life at Asamaths Institute"
        />

        <FadeIn className="mb-12 grid items-center gap-8 lg:grid-cols-2 lg:gap-12">
          <div className="relative aspect-[16/11] overflow-hidden rounded-3xl shadow-xl ring-1 ring-gray-200/80">
            <Image
              src={photoSrc(STUDENT_PHOTOS.smile)}
              alt={`Learners in school uniform during a focused classroom lesson at ${SCHOOL_INFO.shortName}, ${SCHOOL_INFO.suburb}`}
              fill
              placeholder="blur"
              blurDataURL={STUDENT_PHOTO_BLUR_DATA_URL}
              className="object-cover object-[center_25%]"
              sizes="(max-width:1024px)100vw,50vw"
            />
            <div className="absolute inset-0 bg-gradient-to-tr from-primary-900/30 via-transparent to-transparent" />
          </div>
          <div className="rounded-2xl border border-primary-100 bg-gradient-to-br from-primary-50/80 to-white p-6 text-gray-600 shadow-sm sm:p-8">
            <p className="font-display text-xl font-semibold text-primary-900 sm:text-2xl">
              Real learners, real growth
            </p>
            <p className="mt-3 text-sm leading-relaxed sm:text-base">
              From the classroom to the playground, we nurture discipline, curiosity, and belonging—so every
              child can thrive in {SCHOOL_INFO.suburb} and beyond.
            </p>
          </div>
        </FadeIn>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {VALUES.map((value, i) => {
            const Icon = iconMap[value.icon] || Trophy
            return (
              <FadeIn key={value.title} delay={i * 0.1}>
                <Card className="h-full border-gray-100 transition-colors hover:border-primary-200">
                  <CardContent className="pt-6">
                    <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary-100 text-primary-600">
                      <Icon className="h-6 w-6" />
                    </div>
                    <h3 className="mb-2 text-lg font-semibold text-gray-900">{value.title}</h3>
                    <p className="text-sm leading-relaxed text-gray-500">{value.description}</p>
                  </CardContent>
                </Card>
              </FadeIn>
            )
          })}
        </div>
      </div>
    </section>
  )
}

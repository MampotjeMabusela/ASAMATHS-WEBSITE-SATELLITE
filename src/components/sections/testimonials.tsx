"use client"

import Image from "next/image"
import { Star, Quote } from "lucide-react"
import { SectionHeading } from "@/components/shared/section-heading"
import { FadeIn } from "@/components/shared/fade-in"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { TESTIMONIALS } from "@/lib/constants"
import { STUDENT_PHOTO_BLUR_DATA_URL } from "@/lib/student-photo-blur"
import { STUDENT_PHOTOS, photoSrc } from "@/lib/student-photos"

export function Testimonials() {
  return (
    <section id="asa-home-testimonials" className="relative scroll-mt-24 overflow-hidden py-20">
      <div className="pointer-events-none absolute inset-0 -z-10">
        <Image
          src={photoSrc(STUDENT_PHOTOS.joy)}
          alt=""
          fill
          placeholder="blur"
          blurDataURL={STUDENT_PHOTO_BLUR_DATA_URL}
          className="object-cover object-[center_35%]"
          sizes="100vw"
          aria-hidden
        />
      </div>
      <div className="pointer-events-none absolute inset-0 -z-10 bg-gray-50/88 backdrop-blur-[2px]" />

      <div className="container-custom relative z-10">
        <SectionHeading
          eyebrow="Community voices"
          title="What Our Community Says"
          subtitle="Comments from parents and former learners (names used with permission)"
          className="[&_h2]:text-white [&>p]:text-white/95 [&>div:last-child]:bg-white"
        />
        <div className="grid gap-6 md:grid-cols-3">
          {TESTIMONIALS.map((t, i) => (
            <FadeIn key={t.name} delay={i * 0.15}>
              <Card className="h-full border-gray-200/90 bg-white shadow-md">
                <CardContent className="pt-8">
                  <div className="mb-4 flex items-center gap-3">
                    <div
                      className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary-600 font-display text-sm font-bold text-white shadow-md ring-2 ring-primary-100"
                      aria-hidden
                    >
                      {t.initials}
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-gray-950">{t.name}</p>
                      <div className="mt-1 flex flex-wrap gap-1.5">
                        <Badge
                          variant="secondary"
                          className="text-[10px] font-semibold uppercase tracking-wide text-gray-900"
                        >
                          {t.role}
                        </Badge>
                        <Badge variant="default" className="text-[10px] text-primary-900">
                          {t.roleDetail}
                        </Badge>
                      </div>
                    </div>
                  </div>
                  <Quote className="mb-3 h-7 w-7 text-primary-500" aria-hidden />
                  <p className="mb-4 italic leading-relaxed text-gray-800">&quot;{t.text}&quot;</p>
                  <div className="flex items-center gap-1" aria-label={`${t.rating} out of 5 stars`}>
                    {Array.from({ length: t.rating }).map((_, j) => (
                      <Star key={j} className="h-4 w-4 fill-accent-500 text-accent-600" />
                    ))}
                  </div>
                </CardContent>
              </Card>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  )
}

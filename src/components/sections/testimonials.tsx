"use client"

import Image from "next/image"
import { Star, Quote } from "lucide-react"
import { SectionHeading } from "@/components/shared/section-heading"
import { FadeIn } from "@/components/shared/fade-in"
import { Card, CardContent } from "@/components/ui/card"
import { TESTIMONIALS } from "@/lib/constants"
import { STUDENT_PHOTO_BLUR_DATA_URL } from "@/lib/student-photo-blur"
import { STUDENT_PHOTOS } from "@/lib/student-photos"

export function Testimonials() {
  return (
    <section id="asa-home-testimonials" className="relative scroll-mt-24 overflow-hidden py-20">
      <div className="pointer-events-none absolute inset-0 -z-10">
        <Image
          src={STUDENT_PHOTOS.joy}
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
          title="What Our Community Says"
          subtitle="Comments from parents and former learners (names used with permission)"
        />
        <div className="grid gap-6 md:grid-cols-3">
          {TESTIMONIALS.map((t, i) => (
            <FadeIn key={i} delay={i * 0.15}>
              <Card className="h-full border-white/70 bg-white/95 shadow-md backdrop-blur-sm">
                <CardContent className="pt-8">
                  <Quote className="mb-4 h-8 w-8 text-primary-200" />
                  <p className="mb-6 italic leading-relaxed text-gray-600">&quot;{t.text}&quot;</p>
                  <div className="mb-2 flex items-center gap-1">
                    {Array.from({ length: t.rating }).map((_, j) => (
                      <Star key={j} className="h-4 w-4 fill-accent-400 text-accent-400" />
                    ))}
                  </div>
                  <p className="text-sm font-semibold text-gray-900">{t.name}</p>
                  <p className="text-xs text-gray-500">{t.role}</p>
                </CardContent>
              </Card>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  )
}

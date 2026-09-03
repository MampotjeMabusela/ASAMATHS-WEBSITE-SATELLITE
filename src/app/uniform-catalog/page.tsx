import type { Metadata } from "next"
import { redirect } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { ArrowRight, Info, Ruler, Shirt, ShoppingBag } from "lucide-react"
import { FadeIn } from "@/components/shared/fade-in"
import { PageIntro } from "@/components/shared/page-intro"
import { PageBanner } from "@/components/shared/page-banner"
import { CTABanner } from "@/components/sections/cta-banner"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { SCHOOL_INFO } from "@/lib/constants"
import { TEMPORARY_VISIBILITY } from "@/lib/feature-flags"
import {
  UNIFORM_CATALOG_IMAGE,
  UNIFORM_ITEMS,
  UNIFORM_POLICY_NOTES,
  type UniformItem,
} from "@/lib/uniform-catalog"
import { CAMPUS_PHOTOS } from "@/lib/student-photos"

export const metadata: Metadata = {
  title: "Uniform Catalog",
  description: `Official school uniform catalog for ${SCHOOL_INFO.shortName} — items, sizes, and prices for all learners.`,
}

const ALL_LEARNERS_LABEL = "All learners"

function SizeChips({ sizes }: { sizes: string[] }) {
  return (
    <div className="flex flex-wrap gap-1.5">
      {sizes.map((size) => (
        <span
          key={size}
          className="inline-flex min-w-[2rem] items-center justify-center rounded-md border border-primary-100 bg-primary-50/80 px-2 py-0.5 text-xs font-medium text-primary-800"
        >
          {size}
        </span>
      ))}
    </div>
  )
}

function UniformItemCard({ item }: { item: UniformItem }) {
  return (
    <Card className="overflow-hidden border-gray-200 shadow-sm">
      <div className="grid md:grid-cols-[minmax(0,280px)_1fr]">
        <div className="relative flex min-h-[280px] items-center justify-center bg-gradient-to-b from-white to-gray-50 p-6 md:min-h-[320px]">
          <Image
            src={item.imageSrc}
            alt={item.imageAlt}
            width={480}
            height={640}
            className="h-auto max-h-[300px] w-auto max-w-full object-contain drop-shadow-md md:max-h-[340px]"
            sizes="(max-width: 768px) 80vw, 280px"
            quality={95}
          />
        </div>
        <div className="flex flex-col border-t border-gray-100 md:border-l md:border-t-0">
          <CardHeader className="border-b border-gray-100 bg-gray-50/80 pb-4">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <CardTitle className="font-display text-xl">{item.name}</CardTitle>
                <CardDescription className="mt-2 max-w-none text-sm leading-relaxed text-gray-600">
                  {item.description}
                </CardDescription>
              </div>
              <Badge variant="accent" className="shrink-0 px-3 py-1 text-base font-bold">
                {item.price}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="flex flex-1 flex-col justify-center space-y-3 py-5">
            <div>
              <p className="mb-2 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-gray-500">
                <Ruler className="h-3.5 w-3.5" aria-hidden />
                Available sizes
              </p>
              <SizeChips sizes={item.sizes} />
            </div>
            {item.notes ? <p className="text-xs text-gray-500">{item.notes}</p> : null}
          </CardContent>
        </div>
      </div>
    </Card>
  )
}

export default function UniformCatalogPage() {
  if (!TEMPORARY_VISIBILITY.uniformCatalogPage) redirect("/")

  return (
    <>
      <section
        id="asa-uniform-catalog"
        className="scroll-mt-28 bg-gradient-to-br from-primary-50 to-white pb-16 pt-32"
      >
        <div className="container-custom">
          <FadeIn>
            <PageIntro
              eyebrow="Dress code"
              title="Uniform Catalog"
              subtitle="Official school uniform items with photos, sizes, and guide prices for Asamaths learners"
              breadcrumbs={[{ label: "Uniform Catalog" }]}
            />
          </FadeIn>

          <FadeIn delay={0.04}>
            <PageBanner
              src={CAMPUS_PHOTOS.friends}
              alt={`Learners in school uniform at ${SCHOOL_INFO.shortName}, ${SCHOOL_INFO.suburb}`}
              headline="Neat, proud, and ready to learn"
              subline="Our uniform reflects discipline, identity, and belonging."
              variant="compact"
              objectPosition="center 40%"
              className="mb-10"
            />
          </FadeIn>

          <FadeIn delay={0.08}>
            <Card className="mb-10 border-primary-100 bg-white/90">
              <CardHeader className="pb-3">
                <div className="flex items-start gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary-100 text-primary-700">
                    <ShoppingBag className="h-5 w-5" />
                  </div>
                  <div>
                    <CardTitle className="font-display text-xl">How to order</CardTitle>
                    <CardDescription className="mt-1 text-sm leading-relaxed">
                      Visit the school office during office hours ({SCHOOL_INFO.officeHours}) to
                      confirm sizes in stock, place orders, and collect uniform items. For
                      questions, call{" "}
                      <a href={`tel:${SCHOOL_INFO.rawPhone}`} className="font-medium text-primary-700 underline">
                        {SCHOOL_INFO.phone}
                      </a>{" "}
                      or email{" "}
                      <a
                        href={`mailto:${SCHOOL_INFO.email}`}
                        className="font-medium text-primary-700 underline"
                      >
                        {SCHOOL_INFO.email}
                      </a>
                      .
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
            </Card>
          </FadeIn>

          <FadeIn delay={0.1}>
            <div className="space-y-5">
              <div className="flex items-center gap-2">
                <Shirt className="h-5 w-5 text-primary-600" aria-hidden />
                <h2 className="font-display text-2xl font-bold text-gray-900">{ALL_LEARNERS_LABEL}</h2>
              </div>
              <div className="grid gap-6">
                {UNIFORM_ITEMS.map((item) => (
                  <UniformItemCard key={item.id} item={item} />
                ))}
              </div>
            </div>
          </FadeIn>

          <FadeIn delay={0.24}>
            <div className="mt-12 space-y-3">
              <h2 className="font-display text-xl font-bold text-gray-900">Full catalog poster</h2>
              <p className="text-sm text-gray-600">
                Save or print the official price list for quick reference when ordering at the
                office.
              </p>
              <div className="mx-auto max-w-[560px] overflow-hidden rounded-2xl border border-gray-200 bg-white p-5 shadow-lg shadow-primary-900/5 sm:p-6">
                <Image
                  src={UNIFORM_CATALOG_IMAGE}
                  alt="Asamaths Institute official school uniform catalog with all items, prices, and sizes"
                  width={750}
                  height={1094}
                  className="h-auto w-full object-contain"
                  sizes="(max-width: 768px) 92vw, 560px"
                  quality={100}
                  priority={false}
                />
              </div>
            </div>
          </FadeIn>

          <FadeIn delay={0.28}>
            <Card className="mt-10 border-amber-100 bg-amber-50/60">
              <CardHeader>
                <div className="flex items-start gap-3">
                  <Info className="mt-0.5 h-5 w-5 shrink-0 text-amber-700" aria-hidden />
                  <div>
                    <CardTitle className="font-display text-lg text-amber-950">
                      Uniform policy reminders
                    </CardTitle>
                    <CardDescription className="mt-2 text-amber-900/80">
                      <ul className="space-y-2 text-sm leading-relaxed">
                        {UNIFORM_POLICY_NOTES.map((note) => (
                          <li key={note} className="flex gap-2">
                            <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-amber-600" />
                            {note}
                          </li>
                        ))}
                      </ul>
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Link href="/code-of-conduct">
                  <Button variant="outline" className="gap-2 border-amber-200 bg-white hover:bg-amber-50">
                    Read the Code of Conduct
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </FadeIn>
        </div>
      </section>

      <CTABanner
        title="New to Asamaths?"
        description="View our admissions process and download the application form to join our school community."
        buttonText="Apply for Admission"
        buttonHref="/admissions"
      />
    </>
  )
}

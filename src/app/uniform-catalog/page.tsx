import type { Metadata } from "next"
import Image from "next/image"
import { redirect } from "next/navigation"
import Link from "next/link"
import { ArrowRight, Info, ShoppingBag } from "lucide-react"
import { FadeIn } from "@/components/shared/fade-in"
import { PageIntro } from "@/components/shared/page-intro"
import { CTABanner } from "@/components/sections/cta-banner"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { SCHOOL_INFO } from "@/lib/constants"
import { TEMPORARY_VISIBILITY } from "@/lib/feature-flags"
import {
  UNIFORM_CATALOG_MID_IMAGE,
  UNIFORM_CATALOG_TOP_IMAGE,
  UNIFORM_POLICY_NOTES,
  UNIFORM_PRICE_LISTS,
} from "@/lib/uniform-catalog"
import { UniformPriceListSection } from "@/components/uniform/uniform-price-list"
import { UniformShop } from "@/components/uniform/uniform-shop"

export const metadata: Metadata = {
  title: "Uniform Catalog",
  description: `Official school uniform price list and online cart for ${SCHOOL_INFO.shortName} — choose sizes, build a quotation, and email the school.`,
}

export default function UniformCatalogPage() {
  if (!TEMPORARY_VISIBILITY.uniformCatalogPage) redirect("/")

  return (
    <UniformShop>
      <section
        id="asa-uniform-catalog"
        className="scroll-mt-28 bg-gradient-to-br from-primary-50 to-white pb-16 pt-32"
      >
        <div className="container-custom">
          <FadeIn>
            <PageIntro
              eyebrow="Dress code · shop"
              title="Uniform Catalog"
              subtitle="Browse official prices, add sizes to your cart, then download a PDF quotation or email your order to the school"
              breadcrumbs={[{ label: "Uniform Catalog" }]}
            />
          </FadeIn>

          <FadeIn delay={0.08}>
            <Card className="mb-10 overflow-hidden border-primary-100 bg-white/95 shadow-sm ring-1 ring-primary-950/5">
              <CardHeader className="pb-4">
                <div className="flex items-start gap-3">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-primary-100 to-primary-50 text-primary-800 ring-1 ring-primary-200/60">
                    <ShoppingBag className="h-5 w-5" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <CardTitle className="font-display text-xl text-primary-950">
                      How to order online
                    </CardTitle>
                    <CardDescription className="mt-1 text-sm text-gray-600">
                      Build a basket from the grid below, then download a quotation or email the school.
                    </CardDescription>
                    <ol className="mt-4 grid gap-3 sm:grid-cols-3">
                      <li className="rounded-xl border border-primary-100 bg-primary-50/50 p-3">
                        <p className="text-[0.65rem] font-semibold uppercase tracking-[0.18em] text-primary-700">
                          Step 01
                        </p>
                        <p className="mt-1.5 text-sm leading-relaxed text-primary-950">
                          Choose a size and quantity on any item, then tap <strong>Add to cart</strong>.
                        </p>
                      </li>
                      <li className="rounded-xl border border-primary-100 bg-primary-50/50 p-3">
                        <p className="text-[0.65rem] font-semibold uppercase tracking-[0.18em] text-primary-700">
                          Step 02
                        </p>
                        <p className="mt-1.5 text-sm leading-relaxed text-primary-950">
                          Open your cart, review the basket, and continue to checkout.
                        </p>
                      </li>
                      <li className="rounded-xl border border-primary-100 bg-primary-50/50 p-3">
                        <p className="text-[0.65rem] font-semibold uppercase tracking-[0.18em] text-primary-700">
                          Step 03
                        </p>
                        <p className="mt-1.5 text-sm leading-relaxed text-primary-950">
                          Download a <strong>PDF quotation</strong> and/or email the order. Pay at the
                          office ({SCHOOL_INFO.officeHours}) or by EFT using details staff provide —
                          then email proof of payment to{" "}
                          <a
                            href={`mailto:${SCHOOL_INFO.email}`}
                            className="font-medium text-primary-700 underline"
                          >
                            {SCHOOL_INFO.email}
                          </a>{" "}
                          with your quotation reference.
                        </p>
                      </li>
                    </ol>
                  </div>
                </div>
              </CardHeader>
            </Card>
          </FadeIn>

          <div className="space-y-12">
            {UNIFORM_PRICE_LISTS.flatMap((list, index) => {
              const table = (
                <FadeIn key={list.id} delay={0.1 + index * 0.04}>
                  <UniformPriceListSection list={list} />
                </FadeIn>
              )

              if (list.id !== "grade-r-6") return [table]

              return [
                <FadeIn key="uniform-catalog-top-image" delay={0.1 + index * 0.04 - 0.02}>
                  <figure className="overflow-hidden rounded-2xl border border-primary-100 bg-white shadow-md ring-1 ring-primary-950/5">
                    <Image
                      src={UNIFORM_CATALOG_TOP_IMAGE.src}
                      alt={UNIFORM_CATALOG_TOP_IMAGE.alt}
                      width={UNIFORM_CATALOG_TOP_IMAGE.width}
                      height={UNIFORM_CATALOG_TOP_IMAGE.height}
                      className="mx-auto h-auto w-full object-contain"
                      sizes="(max-width: 768px) 100vw, 896px"
                    />
                  </figure>
                </FadeIn>,
                table,
                <FadeIn key="uniform-catalog-mid-image" delay={0.1 + index * 0.04 + 0.02}>
                  <figure className="overflow-hidden rounded-2xl border border-primary-100 bg-white shadow-md ring-1 ring-primary-950/5">
                    <Image
                      src={UNIFORM_CATALOG_MID_IMAGE.src}
                      alt={UNIFORM_CATALOG_MID_IMAGE.alt}
                      width={UNIFORM_CATALOG_MID_IMAGE.width}
                      height={UNIFORM_CATALOG_MID_IMAGE.height}
                      className="mx-auto h-auto w-full object-contain"
                      sizes="(max-width: 768px) 100vw, 896px"
                    />
                  </figure>
                </FadeIn>,
              ]
            })}
          </div>

          <FadeIn delay={0.28}>
            <Card className="mt-10 border-amber-100 bg-amber-50/60">
              <CardHeader>
                <div className="flex items-start gap-3">
                  <Info className="mt-0.5 h-5 w-5 shrink-0 text-amber-700" aria-hidden />
                  <div>
                    <CardTitle className="font-display text-lg text-amber-950">
                      Uniform policy reminders
                    </CardTitle>
                    <ul className="mt-2 space-y-2 text-sm leading-relaxed text-amber-900/80">
                      {UNIFORM_POLICY_NOTES.map((note) => (
                        <li key={note} className="flex gap-2">
                          <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-amber-600" />
                          {note}
                        </li>
                      ))}
                    </ul>
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
    </UniformShop>
  )
}

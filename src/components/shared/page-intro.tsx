import { Breadcrumbs, type BreadcrumbItem } from "@/components/shared/breadcrumbs"
import { SectionHeading } from "@/components/shared/section-heading"
import { FadeIn } from "@/components/shared/fade-in"

type PageIntroProps = {
  title: string
  subtitle?: string
  eyebrow?: string
  breadcrumbs: BreadcrumbItem[]
  className?: string
}

/** Standard inner-page header: breadcrumbs + accessible h1. */
export function PageIntro({ title, subtitle, eyebrow, breadcrumbs, className }: PageIntroProps) {
  return (
    <FadeIn className={className}>
      <Breadcrumbs items={breadcrumbs} />
      <SectionHeading as="h1" title={title} subtitle={subtitle} eyebrow={eyebrow} />
    </FadeIn>
  )
}

import type { Metadata } from "next"
import { FadeIn } from "@/components/shared/fade-in"
import { PageIntro } from "@/components/shared/page-intro"
import { SCHOOL_INFO } from "@/lib/constants"
import { CodeOfConductDocument } from "./document"

export const metadata: Metadata = {
  title: "Code of Conduct",
  description: `Code of conduct for learners and parents at ${SCHOOL_INFO.name}, ${SCHOOL_INFO.city}, South Africa.`,
}

export default function CodeOfConductPage() {
  return (
    <section
      id="asa-code-of-conduct"
      className="scroll-mt-28 bg-gradient-to-br from-primary-50 to-white pb-20 pt-32"
    >
      <div className="container-custom max-w-4xl">
        <PageIntro
          eyebrow="Policy"
          title="Code of Conduct"
          subtitle={`Asamath's Institute of Learning · ${SCHOOL_INFO.city}, South Africa`}
          breadcrumbs={[{ label: "Code of Conduct" }]}
          className="mb-10"
        />
        <FadeIn delay={0.06}>
          <CodeOfConductDocument />
        </FadeIn>
      </div>
    </section>
  )
}

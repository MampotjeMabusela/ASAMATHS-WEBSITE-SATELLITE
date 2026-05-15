import { Hero } from "@/components/sections/hero"
import { StatsBanner } from "@/components/sections/stats-banner"
import { CommunitySpotlight } from "@/components/sections/community-spotlight"
import { Values } from "@/components/sections/values"
import { CTABanner } from "@/components/sections/cta-banner"
import { Testimonials } from "@/components/sections/testimonials"

export default function HomePage() {
  return (
    <>
      <Hero />
      <StatsBanner />
      <CommunitySpotlight />
      <Values />
      <Testimonials />
      <CTABanner />
    </>
  )
}

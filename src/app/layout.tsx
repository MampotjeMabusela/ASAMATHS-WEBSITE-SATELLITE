import type { Metadata, Viewport } from "next"
import { Inter, Playfair_Display } from "next/font/google"
import "./globals.css"
import { Header } from "@/components/layout/header"
import { SkipLink } from "@/components/shared/skip-link"
import { Footer } from "@/components/layout/footer"
import { ScrollToTop } from "@/components/shared/scroll-to-top"
import { AsaChat } from "@/components/shared/asa-chat"
import { WhatsAppFloat } from "@/components/shared/whatsapp-float"
import { Analytics } from "@vercel/analytics/react"
import { SpeedInsights } from "@vercel/speed-insights/next"
import { BRAND, SCHOOL_INFO } from "@/lib/constants"

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL?.trim() || "https://asamaths-website-tembisa.vercel.app"

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
})

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
  weight: ["400", "500", "600", "700", "800"],
})

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
}

/** Re-render server pages daily so dates and school years stay current. */
export const revalidate = 86400

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: `${SCHOOL_INFO.name} | Independent Combined School in ${SCHOOL_INFO.city}`,
    template: `%s | ${SCHOOL_INFO.shortName}`,
  },
  description: `${SCHOOL_INFO.name} is an independent combined school in ${SCHOOL_INFO.suburb}, Gauteng. Serving ${SCHOOL_INFO.totalLearners} learners with a ${SCHOOL_INFO.studentTeacherRatio} student-teacher ratio. Contact us at ${SCHOOL_INFO.phone}.`,
  keywords: [
    "Asamaths Institute",
    "Thembisa school",
    "independent school Gauteng",
    "combined school Thembisa",
    "private school South Africa",
    SCHOOL_INFO.name,
  ],
  openGraph: {
    title: SCHOOL_INFO.name,
    description: `Independent combined school in ${SCHOOL_INFO.suburb}, Gauteng. ${SCHOOL_INFO.totalLearners} learners, ${SCHOOL_INFO.totalEducators} educators.`,
    type: "website",
    locale: "en_ZA",
    siteName: SCHOOL_INFO.name,
    images: [{ url: BRAND.logoSrc, alt: BRAND.logoAlt }],
  },
  twitter: {
    card: "summary_large_image",
    title: SCHOOL_INFO.name,
    description: `Independent combined school in ${SCHOOL_INFO.suburb}, Gauteng. ${SCHOOL_INFO.totalLearners} learners, ${SCHOOL_INFO.totalEducators} educators.`,
    images: [BRAND.logoSrc],
  },
  icons: {
    icon: [{ url: BRAND.logoSrc, type: "image/png" }],
    apple: [{ url: BRAND.logoSrc }],
  },
  robots: { index: true, follow: true },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable}`}>
      <body className="flex min-h-screen min-w-0 flex-col font-sans">
        <SkipLink />
        <Header />
        <main id="main-content" className="flex-1 scroll-mt-28" tabIndex={-1}>
          {children}
        </main>
        <Footer />
        <ScrollToTop />
        <WhatsAppFloat />
        <AsaChat />
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  )
}

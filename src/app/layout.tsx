import type { Metadata } from "next"
import { Inter, Playfair_Display } from "next/font/google"
import "./globals.css"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { ScrollToTop } from "@/components/shared/scroll-to-top"
import { AsaChat } from "@/components/shared/asa-chat"
import { Analytics } from "@vercel/analytics/react"
import { SpeedInsights } from "@vercel/speed-insights/next"
import { BRAND, SCHOOL_INFO } from "@/lib/constants"

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

export const metadata: Metadata = {
  title: {
    default: `${SCHOOL_INFO.name} | Independent Combined School in Johannesburg`,
    template: `%s | ${SCHOOL_INFO.shortName}`,
  },
  description: `${SCHOOL_INFO.name} is an independent combined school in Tembisa, Johannesburg, Gauteng. Serving ${SCHOOL_INFO.totalLearners} learners with a ${SCHOOL_INFO.studentTeacherRatio} student-teacher ratio. Contact us at ${SCHOOL_INFO.phone}.`,
  keywords: [
    "Asamaths Institute",
    "Johannesburg school",
    "Tembisa school",
    "independent school Gauteng",
    "combined school Johannesburg",
    "private school South Africa",
    SCHOOL_INFO.name,
  ],
  openGraph: {
    title: SCHOOL_INFO.name,
    description: `Independent combined school in Tembisa, Johannesburg. ${SCHOOL_INFO.totalLearners} learners, ${SCHOOL_INFO.totalEducators} educators.`,
    type: "website",
    locale: "en_ZA",
    siteName: SCHOOL_INFO.name,
    images: [{ url: BRAND.logoSrc, alt: BRAND.logoAlt }],
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
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
        <ScrollToTop />
        <AsaChat />
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  )
}

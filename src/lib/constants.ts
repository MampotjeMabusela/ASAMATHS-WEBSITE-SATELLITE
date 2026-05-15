/** Printed address and map search string — keep in sync everywhere (footer, contact, fees, maps). */
export const SCHOOL_MAP_ADDRESS =
  "601 Rabat and Conakry Street, Thembisa, Midrand" as const

export const SCHOOL_INFO = {
  name: "Asamaths Institute Of Learning – Midrand",
  shortName: "Asamaths Institute",
  address: SCHOOL_MAP_ADDRESS,
  phone: "+27 12 725 8044",
  rawPhone: "+27127258044",
  phoneAlt: "+27 11 925 8074",
  rawPhoneAlt: "+27119258074",
  email: "asamathsinstitueoflearning@gmail.com",
  principal: "Makeche Brighton",
  principalYear: 2023,
  natEmis: "700400979",
  phase: "Combined School",
  sector: "Independent",
  specialisation: "Ordinary",
  province: "Gauteng",
  city: "Midrand",
  suburb: "Thembisa",
  neighbourhood: "Thembisa",
  totalLearners: 923,
  totalEducators: 28,
  studentTeacherRatio: "33:1",
  surveyYear: 2023,
  /**
   * OSM pin near Rabat & Conakry Streets, Jiyana, Thembisa (intersection area).
   * Set `NEXT_PUBLIC_GOOGLE_MAPS_EMBED_API_KEY` for Google’s embed geocoded to `address`.
   */
  coordinates: { lat: -26.0293392, lng: 28.217104 },
  googleMapsUrl: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(SCHOOL_MAP_ADDRESS)}`,
}

/** Official crest — file: /public/images/logo-official.png */
export const BRAND = {
  logoSrc: "/images/logo-official.png",
  /** Bust browser/CDN cache when the crest file is replaced. */
  logoAssetVersion: "5",
  logoAlt:
    "Asamath's Institute of Learning — official crest: Knowledge, Wisdom, Humanity",
  motto: "Knowledge · Wisdom · Humanity",
  /** When true, header/footer show a text placeholder instead of the crest image. */
  showLogoPlaceholder: false,
}

export const NAV_LINKS = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Admissions", href: "/admissions" },
  { label: "Fees", href: "/fees" },
  { label: "Subjects", href: "/subjects" },
  { label: "Gallery", href: "/gallery" },
  { label: "Code of Conduct", href: "/code-of-conduct" },
  { label: "Contact", href: "/contact" },
]

/**
 * Optional link to a sibling campus (duplicate site). Set in `.env.local` / Vercel:
 * `NEXT_PUBLIC_SISTER_SCHOOL_URL` — full URL, e.g. https://other-campus.vercel.app
 * `NEXT_PUBLIC_SISTER_SCHOOL_LABEL` — button text (default: "Our other campus")
 */
export const SISTER_SCHOOL_LINK = {
  url: (process.env.NEXT_PUBLIC_SISTER_SCHOOL_URL ?? "").trim(),
  label: (process.env.NEXT_PUBLIC_SISTER_SCHOOL_LABEL ?? "Our other campus").trim() || "Our other campus",
} as const

export function hasSisterSchoolLink(): boolean {
  return SISTER_SCHOOL_LINK.url.length > 0
}

export const VALUES = [
  {
    title: "Excellence",
    description:
      "We strive for the highest standards in academic achievement and personal development.",
    icon: "Trophy",
  },
  {
    title: "Discipline",
    description:
      "Fostering self-discipline and respect through our structured uniform policy and code of conduct.",
    icon: "Shield",
  },
  {
    title: "Community",
    description: "Building strong bonds between learners, educators, and the Thembisa community.",
    icon: "Users",
  },
  {
    title: "Innovation",
    description: "Embracing modern teaching methodologies while honoring traditional values.",
    icon: "Lightbulb",
  },
]

export const TESTIMONIALS = [
  {
    name: "Nomsa M.",
    role: "Parent · Grade R",
    text: "Asamaths has transformed my child's educational journey. The dedicated teachers and structured environment make all the difference.",
    rating: 5,
  },
  {
    name: "Thabo N.",
    role: "Former learner",
    text: "The foundation I received at Asamaths prepared me exceptionally well for high school. I'm forever grateful.",
    rating: 5,
  },
  {
    name: "Nomvula S.",
    role: "Parent · Grade 6",
    text: "This school is a pillar of the Thembisa community, providing quality education to our children.",
    rating: 5,
  },
]

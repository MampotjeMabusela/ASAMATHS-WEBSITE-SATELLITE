/** Printed address and map search string — keep in sync everywhere (footer, contact, fees, maps). */
export const SCHOOL_MAP_ADDRESS =
  "601 Rabat and Conakry Street, Thembisa" as const

export const SCHOOL_INFO = {
  name: "Asamaths Institute Of Learning – Thembisa",
  shortName: "Asamaths Institute",
  address: SCHOOL_MAP_ADDRESS,
  phone: "+27 11 925 8074",
  rawPhone: "+27119258074",
  phoneAlt: "+27 12 725 8044",
  rawPhoneAlt: "+27127258044",
  whatsapp: "+27 61 532 5019",
  /** Digits only — for https://wa.me/ links */
  rawWhatsApp: "27615325019",
  email: "asamathsinstituteoflearning@gmail.com",
  officeHours: "Mon–Fri: 06:45 – 16:00",
  officeHoursLong: "Monday – Friday: 06:45 – 16:00",
  principal: "Selamiselo Khumalo",
  principalYear: 2026,
  natEmis: "700400988",
  phase: "Combined School",
  sector: "Independent",
  specialisation: "Ordinary",
  province: "Gauteng",
  city: "Thembisa",
  suburb: "Thembisa",
  neighbourhood: "Thembisa",
  totalLearners: 759,
  totalEducators: 26,
  studentTeacherRatio: "29:1",
  surveyYear: 2026,
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
  logoAssetVersion: "10",
  logoAlt:
    "Asamath's Institute of Learning — official crest: Knowledge, Wisdom, Humanity",
  motto: "Knowledge · Wisdom · Humanity",
  /** When true, header/footer show a text placeholder instead of the crest image. */
  showLogoPlaceholder: false,
}

export type NavLinkItem = {
  label: string
  href: string
  highlight?: boolean
}

export const NAV_HOME: NavLinkItem = { label: "Home", href: "/" }

export const NAV_LEARN: NavLinkItem[] = [
  { label: "About", href: "/about" },
  { label: "Subjects", href: "/subjects" },
  { label: "Sports", href: "/sports" },
  { label: "Culture", href: "/culture" },
  { label: "Gallery", href: "/gallery" },
  { label: "Uniform Catalog", href: "/uniform-catalog" },
]

export const NAV_JOIN: NavLinkItem[] = [
  { label: "Admissions", href: "/admissions", highlight: true },
  { label: "Fees", href: "/fees" },
  { label: "Contact", href: "/contact" },
]

export const NAV_CONDUCT: NavLinkItem = { label: "Code of Conduct", href: "/code-of-conduct" }

/** Flat list for footer and legacy consumers */
export const NAV_LINKS: NavLinkItem[] = [
  NAV_HOME,
  ...NAV_LEARN,
  ...NAV_JOIN,
  NAV_CONDUCT,
]

/**
 * Optional link to a sibling campus (duplicate site). Set in `.env.local` / Vercel:
 * `NEXT_PUBLIC_SISTER_SCHOOL_URL` — full URL, e.g. https://other-campus.vercel.app
 * `NEXT_PUBLIC_SISTER_SCHOOL_LABEL` — button text (default: "Pretoria campus")
 */
export const SISTER_SCHOOL_LINK = {
  url: (process.env.NEXT_PUBLIC_SISTER_SCHOOL_URL ?? "").trim(),
  label: (process.env.NEXT_PUBLIC_SISTER_SCHOOL_LABEL ?? "Pretoria campus").trim() || "Pretoria campus",
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
    initials: "NM",
    role: "Parent",
    roleDetail: "Grade R",
    text: "Asamaths has transformed my child's educational journey. The dedicated teachers and structured environment make all the difference.",
    rating: 5,
  },
  {
    name: "Thabo N.",
    initials: "TN",
    role: "Former learner",
    roleDetail: "Alumni",
    text: "The foundation I received at Asamaths prepared me exceptionally well for high school. I'm forever grateful.",
    rating: 5,
  },
  {
    name: "Nomvula S.",
    initials: "NS",
    role: "Parent",
    roleDetail: "Grade 6",
    text: "This school is a pillar of the Thembisa community, providing quality education to our children.",
    rating: 5,
  },
]

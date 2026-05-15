export const SCHOOL_INFO = {
  name: "Asamaths Institute Of Learning – Johannesburg",
  shortName: "Asamaths Institute",
  address: "1287, 7th Road, Tembisa, Johannesburg, Johannesburg",
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
  city: "Johannesburg",
  suburb: "Tembisa",
  neighbourhood: "Tembisa",
  totalLearners: 923,
  totalEducators: 28,
  studentTeacherRatio: "33:1",
  surveyYear: 2023,
  coordinates: { lat: -25.6250, lng: 28.1000 },
  googleMapsEmbedUrl:
    "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3592.5!2d28.0975!3d-25.6250!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMjXCsDM3JzMwLjAiUyAyOMKwMDYnMDAuMCJF!5e0!3m2!1sen!2sza!4v1700000000000",
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
    description: "Building strong bonds between learners, educators, and the Tembisa community.",
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
    text: "This school is a pillar of the Tembisa community, providing quality education to our children.",
    rating: 5,
  },
]

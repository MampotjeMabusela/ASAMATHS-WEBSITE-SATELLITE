export type UniformCategory = "unisex"

export type UniformItem = {
  id: string
  name: string
  category: UniformCategory
  price: string
  priceNote?: string
  sizes: string[]
  description: string
  notes?: string
  imageSrc: string
  imageAlt: string
}

/** Standard uniform sizes available for all catalog items. */
export const UNIFORM_SIZES = [
  "Extra Small (XS)",
  "Small (S)",
  "Medium (M)",
  "Large (L)",
  "Extra Large (XL)",
] as const

/** Full printable catalog poster (enhanced). */
export const UNIFORM_CATALOG_IMAGE = "/images/uniform/uniform-catalog.png"

/** All uniform items — shown together under “All learners” on the catalog page. */
export const UNIFORM_ITEMS: UniformItem[] = [
  {
    id: "girls-skirt",
    name: "Girls Skirt",
    category: "unisex",
    price: "R180.00",
    imageSrc: "/images/uniform/items/girls-skirt.png",
    imageAlt: "Asamaths Institute official navy girls school skirt",
    sizes: [...UNIFORM_SIZES],
    description:
      "Official navy pleated school skirt with the Asamaths crest. Worn with the white school shirt and school tie. Hem length must be modest and in line with the Code of Conduct.",
  },
  {
    id: "boys-pants",
    name: "Navy Trousers",
    category: "unisex",
    price: "R180.00",
    imageSrc: "/images/uniform/items/boys-pants.png",
    imageAlt: "Asamaths Institute official navy school trousers",
    sizes: [...UNIFORM_SIZES],
    description:
      "Official navy school trousers with the Asamaths crest on the leg. Worn with the white school shirt and school tie. Trousers must be full length and worn at the waist.",
  },
  {
    id: "grey-trousers",
    name: "Grey Trousers",
    category: "unisex",
    price: "R180.00",
    imageSrc: "/images/uniform/items/grey-trousers.png",
    imageAlt: "Asamaths Institute official grey school trousers",
    sizes: [...UNIFORM_SIZES],
    description:
      "Official grey school trousers with the Asamaths crest on the leg. Worn with the white school shirt and school tie. Full length, worn at the waist, in line with the school dress code.",
  },
  {
    id: "girls-jersey",
    name: "Girls Jersey",
    category: "unisex",
    price: "R350.00",
    imageSrc: "/images/uniform/items/girls-jersey.png",
    imageAlt: "Asamaths Institute official navy girls school jersey with crest",
    sizes: [...UNIFORM_SIZES],
    description:
      "Long-sleeved V-neck school jersey in navy with gold and blue trim and the official school crest. Worn over the white shirt during cooler months and for formal assembly.",
  },
  {
    id: "boys-jersey",
    name: "Boys Jersey",
    category: "unisex",
    price: "R350.00",
    imageSrc: "/images/uniform/items/boys-jersey.png",
    imageAlt: "Asamaths Institute official navy boys school jersey with crest",
    sizes: [...UNIFORM_SIZES],
    description:
      "Long-sleeved V-neck school jersey in navy with gold and blue trim and the official school crest. Worn over the white shirt during cooler months and for formal assembly.",
  },
  {
    id: "school-tie",
    name: "School Tie",
    category: "unisex",
    price: "R80.00",
    imageSrc: "/images/uniform/items/school-tie.png",
    imageAlt: "Asamaths Institute official school tie in navy, gold, and blue",
    sizes: [...UNIFORM_SIZES],
    description:
      "Official striped school tie in navy, gold, and blue with the Asamaths crest. Required with the formal day uniform for assembly and everyday classroom wear.",
  },
  {
    id: "school-socks",
    name: "School Socks",
    category: "unisex",
    price: "R35.00",
    imageSrc: "/images/uniform/items/school-socks.png",
    imageAlt: "Asamaths Institute official navy school socks",
    sizes: [...UNIFORM_SIZES],
    description:
      "Plain navy ankle school socks. No logos, patterns, or non-uniform colours — worn with black school shoes as part of the daily uniform.",
  },
  {
    id: "golf-tshirt",
    name: "School Golf T-Shirt",
    category: "unisex",
    price: "R120.00",
    imageSrc: "/images/uniform/items/golf-tshirt.png",
    imageAlt: "Asamaths Institute official navy golf shirt with school crest",
    sizes: [...UNIFORM_SIZES],
    description:
      "Short-sleeved navy golf shirt with gold and blue shoulder panels and the official school crest. For sports days, physical education, and designated casual uniform days.",
  },
  {
    id: "track-suit",
    name: "Track Suit",
    category: "unisex",
    price: "R650.00",
    imageSrc: "/images/uniform/items/track-suit.png",
    imageAlt: "Asamaths Institute official navy and gold school tracksuit set",
    sizes: [...UNIFORM_SIZES],
    description:
      "Full school tracksuit set — zip jacket and matching pants in navy with gold side stripes and the Asamaths crest. For winter sport, outdoor activities, and approved PE sessions.",
    notes: "Sold as a complete set (top and pants).",
  },
]

export const UNIFORM_CATEGORY_LABELS: Record<UniformCategory, string> = {
  unisex: "All learners",
}

export const UNIFORM_POLICY_NOTES = [
  "Learners must wear the complete official uniform on school days unless the office announces a special dress day.",
  "All items must be clean, neat, and labelled with the learner’s name where possible.",
  "Uniform compliance is part of our Code of Conduct — parents are asked to support daily readiness.",
  "Stock and sizes are subject to availability. Confirm sizing at the school office before purchasing.",
  "Prices shown are guide prices from the official catalog and may be updated by the school without notice on this website.",
] as const

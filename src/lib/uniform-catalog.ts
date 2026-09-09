export type UniformItemImage = {
  src: string
  alt: string
  label?: string
}

export type UniformPriceItem = {
  id: string
  name: string
  price: string
  images?: UniformItemImage[]
  /** When true, product photos display in the catalog table (overrides global image toggle). */
  showImages?: boolean
}

export type UniformPriceList = {
  id: string
  title: string
  subtitle: string
  grades: string
  items: UniformPriceItem[]
}

/** Bump when any public uniform item image changes so browsers fetch fresh files. */
export const UNIFORM_IMAGES_VERSION = "40"

export function uniformItemSrc(path: string): string {
  const base = path.split("?")[0] ?? path
  return `${base}?v=${UNIFORM_IMAGES_VERSION}`
}

const SHIRT_IMAGES: UniformItemImage[] = [
  {
    src: uniformItemSrc("/images/uniform/items/shirt-long-sleeve.png"),
    alt: "Long sleeve white school shirt with Asamaths logo",
    label: "Long sleeve",
  },
  {
    src: uniformItemSrc("/images/uniform/items/shirt-short-sleeve.png"),
    alt: "Short sleeve white school shirt with Asamaths logo",
    label: "Short sleeve",
  },
]

const SPORTS_TSHIRT_IMAGES: UniformItemImage[] = [
  {
    src: uniformItemSrc("/images/uniform/items/sports-tshirt.jpg"),
    alt: "Red sports T-shirt with Asamaths logo",
  },
]

const JERSEY_RED_STRIPES_IMAGES: UniformItemImage[] = [
  {
    src: uniformItemSrc("/images/uniform/items/jersey-red-stripes.png"),
    alt: "Grey school jersey with red stripes and Asamaths logo",
  },
]

const PULLOVER_RED_STRIPES_IMAGES: UniformItemImage[] = [
  {
    src: uniformItemSrc("/images/uniform/items/pullover-red-stripes.png"),
    alt: "Grey school pullover with red stripes and Asamaths logo",
  },
]

const SUMMER_TRACKSUIT_IMAGES: UniformItemImage[] = [
  {
    src: uniformItemSrc("/images/uniform/items/summer-tracksuit.jpg"),
    alt: "Grey summer tracksuit with red stripes and Asamaths logo",
  },
]

const SUMMER_TRACKSUIT_G79_IMAGES: UniformItemImage[] = [
  {
    src: uniformItemSrc("/images/uniform/items/summer-tracksuit.jpg"),
    alt: "Grey summer tracksuit with maroon stripes and Asamaths logo",
  },
]

const WINTER_TRACKSUIT_IMAGES: UniformItemImage[] = [
  {
    src: uniformItemSrc("/images/uniform/items/winter-tracksuit.jpg"),
    alt: "Grey winter tracksuit with red stripes and Asamaths logo",
  },
]

const WINTER_TRACKSUIT_G79_IMAGES: UniformItemImage[] = [
  {
    src: uniformItemSrc("/images/uniform/items/winter-tracksuit.jpg"),
    alt: "Grey winter tracksuit with maroon stripes and Asamaths logo",
  },
]

const BLAZER_IMAGES: UniformItemImage[] = [
  {
    src: uniformItemSrc("/images/uniform/items/blazer.png"),
    alt: "Grey school blazer with Asamaths crest",
  },
]

const BLAZER_G79_IMAGES: UniformItemImage[] = [
  {
    src: uniformItemSrc("/images/uniform/items/blazer-g79.png"),
    alt: "Grey school blazer with maroon trim and Asamaths crest",
  },
]

const RED_DRIMAC_IMAGES: UniformItemImage[] = [
  {
    src: uniformItemSrc("/images/uniform/items/red-drimac.png"),
    alt: "Red school drimac with Asamaths logo",
  },
]

const MAROON_DRIMAC_IMAGES: UniformItemImage[] = [
  {
    src: uniformItemSrc("/images/uniform/items/maroon-drimac.png"),
    alt: "Maroon school drimac with Asamaths logo",
  },
]

const GRAY_RED_TIE_IMAGES: UniformItemImage[] = [
  {
    src: uniformItemSrc("/images/uniform/items/gray-red-tie.png"),
    alt: "Grey school tie with red stripe",
  },
]

const GRAY_RED_SOCKS_IMAGES: UniformItemImage[] = [
  {
    src: uniformItemSrc("/images/uniform/items/gray-red-socks.png"),
    alt: "Grey school socks with red stripes",
  },
]

const MAROON_SOCKS_IMAGES: UniformItemImage[] = [
  {
    src: uniformItemSrc("/images/uniform/items/maroon-socks.png"),
    alt: "Grey school socks with maroon stripes",
  },
]

const WINTER_WOOLLEN_HAT_IMAGES: UniformItemImage[] = [
  {
    src: uniformItemSrc("/images/uniform/items/winter-woollen-hat.png"),
    alt: "Grey winter woollen school hat with red pom-pom",
  },
]

const WINTER_WOOLLEN_HAT_G79_IMAGES: UniformItemImage[] = [
  {
    src: uniformItemSrc("/images/uniform/items/winter-woollen-hat-g79.jpg"),
    alt: "Grey winter woollen school hat with maroon stripes and pom-pom",
  },
]

const GRAY_SKIRT_IMAGES: UniformItemImage[] = [
  {
    src: uniformItemSrc("/images/uniform/items/gray-skirt.png"),
    alt: "Grey school skirt with red trim",
  },
]

const GRAY_SKIRT_G79_IMAGES: UniformItemImage[] = [
  {
    src: uniformItemSrc("/images/uniform/items/gray-skirt-g79.png"),
    alt: "Grey school skirt with maroon trim",
  },
]

const PLEATED_SKIRT_IMAGES: UniformItemImage[] = [
  {
    src: uniformItemSrc("/images/uniform/items/pleated-skirt.png"),
    alt: "Grey pleated school skirt with maroon trim",
  },
]

const SPORTS_WHITE_SHORTS_IMAGES: UniformItemImage[] = [
  {
    src: uniformItemSrc("/images/uniform/items/sports-white-shorts.png"),
    alt: "White sports shorts with Asamaths logo",
  },
]

const SPORTS_WHITE_SHORTS_G79_IMAGES: UniformItemImage[] = [
  {
    src: uniformItemSrc("/images/uniform/items/sports-white-shorts-g79.png"),
    alt: "White sports shorts with maroon trim and Asamaths logo",
  },
]

const TUNIC_IMAGES: UniformItemImage[] = [
  {
    src: uniformItemSrc("/images/uniform/items/tunic.png"),
    alt: "Grey school tunic with red trim and Asamaths logo",
  },
]

/** Official uniform price lists by grade band. */
export const UNIFORM_PRICE_LISTS: UniformPriceList[] = [
  {
    id: "grade-r-6",
    title: "UNIFORM PRICE LIST",
    subtitle: "GRADE R-6",
    grades: "Grade R – 6",
    items: [
      { id: "shirt", name: "Shirt (Long/Short Sleeve)", price: "R240.00", images: SHIRT_IMAGES, showImages: true },
      { id: "sports-tshirt", name: "Sports T-shirt", price: "R370.00", images: SPORTS_TSHIRT_IMAGES, showImages: true },
      { id: "jersey-red-stripes", name: "Jersey(Red Stripes)", price: "R330.00", images: JERSEY_RED_STRIPES_IMAGES, showImages: true },
      { id: "pullover-red-stripes", name: "Pullover (Red Stripes)", price: "R270.00", images: PULLOVER_RED_STRIPES_IMAGES, showImages: true },
      { id: "summer-tracksuit", name: "Summer Tracksuit", price: "R670.00", images: SUMMER_TRACKSUIT_IMAGES, showImages: true },
      { id: "winter-tracksuit", name: "Winter Tracksuit", price: "R750.00", images: WINTER_TRACKSUIT_IMAGES, showImages: true },
      { id: "red-drimac", name: "Red Drimac", price: "R450.00", images: RED_DRIMAC_IMAGES, showImages: true },
      { id: "blazer", name: "Blazer", price: "R750.00", images: BLAZER_IMAGES, showImages: true },
      { id: "tunic", name: "Tunic", price: "R400.00", images: TUNIC_IMAGES },
      { id: "gray-red-tie", name: "Gray and Red Tie", price: "R150.00", images: GRAY_RED_TIE_IMAGES, showImages: true },
      { id: "gray-red-socks", name: "Gray and Red Socks", price: "R100.00", images: GRAY_RED_SOCKS_IMAGES },
      { id: "sun-hat", name: "Sun hat", price: "R200.00" },
      { id: "winter-woollen-hat", name: "Winter woollen hat", price: "R200.00", images: WINTER_WOOLLEN_HAT_IMAGES, showImages: true },
      { id: "gray-skirt", name: "Gray Skirt", price: "R200.00", images: GRAY_SKIRT_IMAGES, showImages: true },
      { id: "sports-white-shorts", name: "Sports White Shorts", price: "R200.00", images: SPORTS_WHITE_SHORTS_IMAGES, showImages: true },
    ],
  },
  {
    id: "grade-7-9",
    title: "UNIFORM PRICE LIST",
    subtitle: "GRADE 7-9",
    grades: "Grade 7 – 9",
    items: [
      { id: "g79-shirt", name: "Shirt (Long/Short Sleeve)", price: "R240.00", images: SHIRT_IMAGES, showImages: true },
      { id: "g79-sports-tshirt", name: "Sports T-shirt", price: "R370.00", images: SPORTS_TSHIRT_IMAGES, showImages: true },
      { id: "g79-jersey-red-stripes", name: "Jersey(Maroon Stripes)", price: "R330.00", images: JERSEY_RED_STRIPES_IMAGES, showImages: true },
      { id: "g79-pullover-red-stripes", name: "Pullover (Maroon Stripes)", price: "R270.00", images: PULLOVER_RED_STRIPES_IMAGES, showImages: true },
      { id: "g79-summer-tracksuit", name: "Summer Tracksuit", price: "R670.00", images: SUMMER_TRACKSUIT_G79_IMAGES, showImages: true },
      { id: "g79-winter-tracksuit", name: "Winter Tracksuit", price: "R750.00", images: WINTER_TRACKSUIT_G79_IMAGES, showImages: true },
      { id: "g79-red-drimac", name: "Maroon Drimac", price: "R450.00", images: MAROON_DRIMAC_IMAGES, showImages: true },
      { id: "g79-blazer", name: "Blazer", price: "R750.00", images: BLAZER_G79_IMAGES, showImages: true },
      { id: "g79-gray-red-tie", name: "Gray and Red Tie", price: "R150.00", images: GRAY_RED_TIE_IMAGES, showImages: true },
      { id: "g79-maroon-socks", name: "Maroon Socks", price: "R100.00", images: MAROON_SOCKS_IMAGES, showImages: true },
      { id: "g79-sun-hat", name: "Sun hat", price: "R200.00" },
      { id: "g79-winter-woollen-hat", name: "Winter woolen hat (maroon stripes)", price: "R200.00", images: WINTER_WOOLLEN_HAT_G79_IMAGES, showImages: true },
      { id: "g79-gray-skirt", name: "Gray Skirt", price: "R200.00", images: GRAY_SKIRT_G79_IMAGES, showImages: true },
      { id: "g79-pleated-skirt", name: "Pleated Skirt", price: "R340.00", images: PLEATED_SKIRT_IMAGES, showImages: true },
      { id: "g79-sports-white-shorts", name: "Sports White Shorts", price: "R200.00", images: SPORTS_WHITE_SHORTS_G79_IMAGES, showImages: true },
    ],
  },
]

export const UNIFORM_POLICY_NOTES = [
  "Learners must wear the complete official uniform on school days unless the office announces a special dress day.",
  "All items must be clean, neat, and labelled with the learner’s name where possible.",
  "Uniform compliance is part of our Code of Conduct — parents are asked to support daily readiness.",
  "Stock and sizes are subject to availability. Confirm sizing at the school office before purchasing.",
  "Item names and prices match the official school price list and may be updated by the office without notice on this website.",
] as const

/** Official uniform catalog poster shown above the Grade R–6 price list. */
export const UNIFORM_CATALOG_TOP_IMAGE = {
  src: uniformItemSrc("/images/uniform/uniform-catalog-poster.png"),
  alt: "Official Asamaths Institute uniform price list for Grade R–6 and Grade 7–9",
  width: 1024,
  height: 393,
} as const

/** Reference photo shown between the Grade R–6 and Grade 7–9 price lists. */
export const UNIFORM_CATALOG_MID_IMAGE = {
  src: uniformItemSrc("/images/uniform/uniform-jersey-pullover-guide.jpg"),
  alt: "School jersey and pullover with red stripes and Asamaths logo",
  width: 1024,
  height: 819,
} as const

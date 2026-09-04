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
}

export type UniformPriceList = {
  id: string
  title: string
  subtitle: string
  grades: string
  items: UniformPriceItem[]
}

/** Bump when any public uniform item image changes so browsers fetch fresh files. */
export const UNIFORM_IMAGES_VERSION = "8"

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
    src: uniformItemSrc("/images/uniform/items/sports-tshirt.png"),
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
    src: uniformItemSrc("/images/uniform/items/summer-tracksuit.png"),
    alt: "Grey summer tracksuit with red stripes and Asamaths logo",
  },
]

const WINTER_TRACKSUIT_IMAGES: UniformItemImage[] = [
  {
    src: uniformItemSrc("/images/uniform/items/winter-tracksuit.png"),
    alt: "Grey winter tracksuit with red stripes and Asamaths logo",
  },
]

const BLAZER_IMAGES: UniformItemImage[] = [
  {
    src: uniformItemSrc("/images/uniform/items/blazer.png"),
    alt: "Grey school blazer with Asamaths crest",
  },
]

const RED_DRIMAC_IMAGES: UniformItemImage[] = [
  {
    src: uniformItemSrc("/images/uniform/items/red-drimac.png"),
    alt: "Red school drimac with Asamaths logo",
  },
]

const GRAY_RED_TIE_IMAGES: UniformItemImage[] = [
  {
    src: uniformItemSrc("/images/uniform/items/gray-red-tie-striped.png"),
    alt: "Grey and red striped school tie",
  },
  {
    src: uniformItemSrc("/images/uniform/items/gray-red-tie-stripe.png"),
    alt: "Grey school tie with red stripe",
  },
]

const GRAY_RED_SOCKS_IMAGES: UniformItemImage[] = [
  {
    src: uniformItemSrc("/images/uniform/items/gray-red-socks.png"),
    alt: "Grey school socks with red stripes",
  },
]

const SUN_HAT_IMAGES: UniformItemImage[] = [
  {
    src: uniformItemSrc("/images/uniform/items/sun-hat.png"),
    alt: "Red school sun hat with Asamaths logo",
  },
]

const WINTER_WOOLLEN_HAT_IMAGES: UniformItemImage[] = [
  {
    src: uniformItemSrc("/images/uniform/items/winter-woollen-hat.png"),
    alt: "Grey winter woollen school hat with red pom-pom",
  },
]

const GRAY_SKIRT_IMAGES: UniformItemImage[] = [
  {
    src: uniformItemSrc("/images/uniform/items/gray-skirt.png"),
    alt: "Grey school skirt with red trim",
  },
]

const SPORTS_WHITE_SHORTS_IMAGES: UniformItemImage[] = [
  {
    src: uniformItemSrc("/images/uniform/items/sports-white-shorts.png"),
    alt: "White sports shorts with Asamaths logo",
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
      { id: "shirt", name: "Shirt (Long/Short Sleeve)", price: "R240.00", images: SHIRT_IMAGES },
      { id: "sports-tshirt", name: "Sports T-shirt", price: "R370.00", images: SPORTS_TSHIRT_IMAGES },
      { id: "jersey-red-stripes", name: "Jersey(Red Stripes)", price: "R330.00", images: JERSEY_RED_STRIPES_IMAGES },
      { id: "pullover-red-stripes", name: "Pullover (Red Stripes)", price: "R270.00", images: PULLOVER_RED_STRIPES_IMAGES },
      { id: "summer-tracksuit", name: "Summer Tracksuit", price: "R670.00", images: SUMMER_TRACKSUIT_IMAGES },
      { id: "winter-tracksuit", name: "Winter Tracksuit", price: "R750.00", images: WINTER_TRACKSUIT_IMAGES },
      { id: "red-drimac", name: "Red Drimac", price: "R450.00", images: RED_DRIMAC_IMAGES },
      { id: "blazer", name: "Blazer", price: "R750.00", images: BLAZER_IMAGES },
      { id: "tunic", name: "Tunic", price: "R400.00", images: TUNIC_IMAGES },
      { id: "gray-red-tie", name: "Gray and Red Tie", price: "R150.00", images: GRAY_RED_TIE_IMAGES },
      { id: "gray-red-socks", name: "Gray and Red Socks", price: "R100.00", images: GRAY_RED_SOCKS_IMAGES },
      { id: "sun-hat", name: "Sun hat", price: "R200.00", images: SUN_HAT_IMAGES },
      { id: "winter-woollen-hat", name: "Winter woollen hat", price: "R200.00", images: WINTER_WOOLLEN_HAT_IMAGES },
      { id: "gray-skirt", name: "Gray Skirt", price: "R200.00", images: GRAY_SKIRT_IMAGES },
      { id: "sports-white-shorts", name: "Sports White Shorts", price: "R200.00", images: SPORTS_WHITE_SHORTS_IMAGES },
    ],
  },
  {
    id: "grade-7-9",
    title: "UNIFORM PRICE LIST",
    subtitle: "GRADE 7-9",
    grades: "Grade 7 – 9",
    items: [
      { id: "g79-shirt", name: "Shirt (Long/Short Sleeve)", price: "R240.00", images: SHIRT_IMAGES },
      { id: "g79-sports-tshirt", name: "Sports T-shirt", price: "R370.00", images: SPORTS_TSHIRT_IMAGES },
      { id: "g79-jersey-red-stripes", name: "Jersey(Red Stripes)", price: "R330.00", images: JERSEY_RED_STRIPES_IMAGES },
      { id: "g79-pullover-red-stripes", name: "Pullover (Red Stripes)", price: "R270.00", images: PULLOVER_RED_STRIPES_IMAGES },
      { id: "g79-summer-tracksuit", name: "Summer Tracksuit", price: "R670.00", images: SUMMER_TRACKSUIT_IMAGES },
      { id: "g79-winter-tracksuit", name: "Winter Tracksuit", price: "R750.00", images: WINTER_TRACKSUIT_IMAGES },
      { id: "g79-red-drimac", name: "Red Drimac", price: "R450.00", images: RED_DRIMAC_IMAGES },
      { id: "g79-blazer", name: "Blazer", price: "R750.00", images: BLAZER_IMAGES },
      { id: "g79-gray-red-tie", name: "Gray and Red Tie", price: "R150.00", images: GRAY_RED_TIE_IMAGES },
      { id: "g79-gray-red-socks", name: "Gray and Red Socks", price: "R100.00", images: GRAY_RED_SOCKS_IMAGES },
      { id: "g79-sun-hat", name: "Sun hat", price: "R200.00", images: SUN_HAT_IMAGES },
      { id: "g79-winter-woollen-hat", name: "Winter woollen hat", price: "R200.00", images: WINTER_WOOLLEN_HAT_IMAGES },
      { id: "g79-gray-skirt", name: "Gray Skirt", price: "R200.00", images: GRAY_SKIRT_IMAGES },
      { id: "g79-sports-white-shorts", name: "Sports White Shorts", price: "R200.00", images: SPORTS_WHITE_SHORTS_IMAGES },
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

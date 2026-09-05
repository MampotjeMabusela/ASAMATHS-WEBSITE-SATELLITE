export type SportProgram = {
  id: string
  name: string
  description: string
  seasons?: string
}

export type SportsFixture = {
  id: string
  title: string
  when: string
  description: string
}

export const SPORTS_INTRO =
  "Sport at Asamaths Institute builds fitness, teamwork, and school pride. Learners take part in physical education, inter-house competitions, and seasonal fixtures on our fields and courts — guided by educators who encourage discipline, fair play, and commitment."

export const SPORTS_PROGRAMS: SportProgram[] = [
  {
    id: "athletics",
    name: "Athletics",
    description:
      "Track and field events including sprints, relays, long jump, and high jump. Inter-house athletics trials and term meets give every learner a chance to participate and represent their house.",
    seasons: "Term 1 & Term 3",
  },
  {
    id: "soccer",
    name: "Soccer",
    description:
      "Boys and girls teams train after school and compete in friendly matches and inter-house leagues. Emphasis on teamwork, fitness, and respect for officials and opponents.",
    seasons: "Term 2 & Term 3",
  },
  {
    id: "netball",
    name: "Netball",
    description:
      "Popular among foundation and intermediate learners. Skills sessions cover passing, movement, and court positioning, with matches arranged against neighbouring schools where possible.",
    seasons: "Term 2",
  },
  {
    id: "volleyball",
    name: "Volleyball",
    description:
      "Indoor and outdoor volleyball develops coordination and communication. Learners practice serving, setting, and rally play during PE and optional afternoon sessions.",
    seasons: "Term 1 & Term 4",
  },
  {
    id: "cross-country",
    name: "Cross-country & fun runs",
    description:
      "Distance running builds endurance and perseverance. House fun runs and cross-country events are held on the sports field and surrounding campus routes.",
    seasons: "Term 3",
  },
  {
    id: "pe",
    name: "Physical Education",
    description:
      "All grades have structured PE lessons covering movement skills, fitness, and sport ethics. Learners wear the official school track suit or golf shirt as directed by their educator.",
    seasons: "Year-round",
  },
]

export const UPCOMING_SPORTS: SportsFixture[] = [
  {
    id: "no-updates",
    title: "No Updates",
    when: "",
    description: "",
  },
]

export const SPORTS_VALUES = [
  "Fair play and respect for teammates, opponents, and officials",
  "Regular attendance at practices and punctuality on match days",
  "Official sports uniform (track suit or golf shirt) as required",
  "Academic responsibility — sport complements, never replaces, classroom commitment",
] as const

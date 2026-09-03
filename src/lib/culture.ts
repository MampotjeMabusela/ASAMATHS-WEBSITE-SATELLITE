export type CultureActivity = {
  id: string
  name: string
  description: string
  when?: string
}

export type CultureEvent = {
  id: string
  title: string
  when: string
  description: string
}

export const CULTURE_INTRO =
  "Culture at Asamaths Institute celebrates who we are — our languages, traditions, music, and creativity. Through assemblies, heritage programmes, and classroom activities, learners explore identity, respect diversity, and share pride in the Thembisa community and South Africa's rich cultural heritage."

export const CULTURE_ACTIVITIES: CultureActivity[] = [
  {
    id: "heritage",
    name: "Heritage & cultural days",
    description:
      "Learners dress in traditional attire, perform poetry and dance, and share stories about their home languages and cultures. Heritage Day and related events are highlights of the school calendar.",
    when: "September & selected term dates",
  },
  {
    id: "music-choir",
    name: "Music & choir",
    description:
      "Singing, rhythm, and school songs build unity at assemblies and prize-giving. Choir and group performances rehearse during lunch breaks and cultural periods.",
  },
  {
    id: "dance-drama",
    name: "Dance & drama",
    description:
      "Creative movement and short drama pieces allow learners to express ideas and history through performance. Cultural groups prepare items for school and community events.",
  },
  {
    id: "languages",
    name: "Languages & literature",
    description:
      "English, Afrikaans, and African languages are taught with appreciation for oral tradition, storytelling, and reading. Sepedi and other home languages are valued in the classroom and on cultural days.",
  },
  {
    id: "art-craft",
    name: "Art & creative crafts",
    description:
      "Visual art projects, posters, and craft work support themes from history, life orientation, and cultural studies — displayed in classrooms and at open days.",
  },
  {
    id: "debate",
    name: "Debate & public speaking",
    description:
      "Learners develop confidence and critical thinking through debates, speeches, and assembly presentations — skills that serve them in academics and community leadership.",
  },
]

export const UPCOMING_CULTURE: CultureEvent[] = [
  {
    id: "heritage-rehearsal",
    title: "Heritage Day dress rehearsal",
    when: "Fridays · 13:30 – 15:00",
    description: "Cultural groups rehearse performances for the Heritage Day programme.",
  },
  {
    id: "assembly-performances",
    title: "Monthly cultural assembly",
    when: "First Friday of each month",
    description: "Grade groups share songs, poems, or short items celebrating language and tradition.",
  },
  {
    id: "heritage-day",
    title: "Heritage Day celebrations",
    when: "September (date confirmed by office)",
    description: "Full-school programme with performances, traditional dress, and community guests.",
  },
]

export const CULTURE_VALUES = [
  "Respect for all cultures, languages, and beliefs represented in our school",
  "Participation encouraged — every learner can contribute through art, song, or service",
  "Traditional dress worn with pride and in line with the Code of Conduct",
  "Collaboration between educators, parents, and cultural groups for major events",
] as const

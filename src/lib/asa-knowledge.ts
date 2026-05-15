import { NAV_LINKS, SCHOOL_INFO, TESTIMONIALS, VALUES } from "@/lib/constants"
import type { AsaKnowledgeEntry } from "@/types/asa"

/** Curated passages Asa uses to answer; keywords cover common phrasing. */
export function getAsaKnowledgeBase(): AsaKnowledgeEntry[] {
  const vLines = VALUES.map((v) => `${v.title}: ${v.description}`).join(" ")

  return [
    {
      id: "greeting",
      keywords: ["hi", "hello", "hey", "good morning", "good day", "start", "help", "menu"],
      buildAnswer: () =>
        `Hi! I'm **Asa**, your guide for ${SCHOOL_INFO.shortName}. I can explain our school, **subjects** and phases, fees, admissions, how to reach us, and move you to the right page—just ask naturally.`,
    },
    {
      id: "home",
      keywords: ["home", "homepage", "main page", "landing", "start page"],
      buildAnswer: () =>
        `The **Home** page introduces ${SCHOOL_INFO.name}, our learner numbers, values, and what families say about us.`,
      navigateTo: "/#asa-home-hero",
      linkLabel: "Go to Home",
    },
    {
      id: "about",
      keywords: ["about", "who are you", "history", "mission", "thembisa", "midrand", "location", "map", "where are you"],
      buildAnswer: () =>
        `**About** covers who we are: ${SCHOOL_INFO.name} is an independent **${SCHOOL_INFO.phase.toLowerCase()}** in **${SCHOOL_INFO.suburb}**, ${SCHOOL_INFO.city} (${SCHOOL_INFO.province}). You'll find our address, principal (**${SCHOOL_INFO.principal}**), learner stats from ${SCHOOL_INFO.surveyYear}, and a map.`,
      navigateTo: "/about#asa-about-map",
      linkLabel: "Open About",
    },
    {
      id: "address",
      keywords: ["address", "located", "where is the school", "directions", "find you", "visit", "rabat", "conakry", "thembisa"],
      buildAnswer: () =>
        `We're at **${SCHOOL_INFO.address}**. Opening **About** or **Contact** shows the map embed too.`,
      navigateTo: "/contact#asa-contact-form",
      linkLabel: "Contact & map",
    },
    {
      id: "contact",
      keywords: ["contact", "email", "message", "form", "write", "reach", "website form"],
      buildAnswer: () =>
        `Email us at **${SCHOOL_INFO.email}** or phone **${SCHOOL_INFO.phone}** / **${SCHOOL_INFO.phoneAlt}**. Office hours: **Monday–Friday, 07:30–15:00**. The **Contact** page has our enquiry form.`,
      navigateTo: "/contact#asa-contact-form",
      linkLabel: "Contact page",
    },
    {
      id: "phone",
      keywords: ["phone", "call", "number", "telephone", "whatsapp", "ring"],
      buildAnswer: () =>
        `Phone lines: **${SCHOOL_INFO.phone}** (main), **${SCHOOL_INFO.phoneAlt}** (additional).`,
      navigateTo: "/contact#asa-contact-form",
      linkLabel: "Contact details",
    },
    {
      id: "admissions",
      keywords: [
        "admission",
        "admissions",
        "apply",
        "application",
        "enrol",
        "enroll",
        "register",
        "placement",
        "interview",
        "documentation",
      ],
      buildAnswer: () =>
        `**Admissions** is a stepped process: contact the school, submit documents (birth certificate, reports, transfer card where applicable), interview/assessment, then enrollment once accepted. Fees and registration apply—see **Fees** or call us.`,
      navigateTo: "/admissions#asa-admissions",
      linkLabel: "Admissions",
    },
    {
      id: "subjects",
      keywords: [
        "subject",
        "subjects",
        "curriculum",
        "syllabus",
        "grade r",
        "foundation phase",
        "intermediate phase",
        "senior phase",
        "fet",
        "life orientation",
        "math",
        "mathematics",
        "literacy",
        "natural sciences",
        "electives",
        "grades",
        "what do you teach",
      ],
      buildAnswer: () =>
        `We offer **Grade R through Grade 7** only. The **Subjects** page describes **Foundation** (R–3), **Intermediate** (4–6), and **Grade 7** senior-phase learning areas. We do **not** enrol **Grades 8–12** or FET. Contact us for specifics per grade.`,
      navigateTo: "/subjects#asa-subjects",
      linkLabel: "Subjects page",
    },
    {
      id: "grades-high",
      keywords: [
        "grade 8",
        "grade 9",
        "grade 10",
        "grade 11",
        "grade 12",
        "matric",
        "fet",
        "high school",
        "senior phase grades",
      ],
      buildAnswer: () =>
        `${SCHOOL_INFO.shortName} enrols **Grade R through Grade 7** only—**not** Grades 8–12 or FET. See **Subjects** for our learning areas, or **contact** us for guidance after Grade 7.`,
      navigateTo: "/subjects#asa-subjects",
      linkLabel: "Subjects page",
    },
    {
      id: "fees",
      keywords: ["fee", "fees", "tuition", "cost", "price", "payment", "pay", "registration fee", "money"],
      buildAnswer: () =>
        `${SCHOOL_INFO.shortName} is **fee-paying**; amounts vary by grade and services. For the current schedule, **contact the office** directly—the **Fees** page explains how this works.`,
      navigateTo: "/fees#asa-fees",
      linkLabel: "Fees info",
    },
    {
      id: "gallery",
      keywords: ["gallery", "photos", "pictures", "images", "campus", "tour"],
      buildAnswer: () =>
        `Our **Gallery** is being updated—placeholders explain that real photos will appear soon. You can **book a visit** from prompts on that page.`,
      navigateTo: "/gallery#asa-gallery",
      linkLabel: "Gallery",
    },
    {
      id: "stats",
      keywords: ["how many", "learners", "students", "pupils", "teachers", "educators", "ratio", "nat emis", "natemis"],
      buildAnswer: () =>
        `About **${SCHOOL_INFO.totalLearners} learners** and **${SCHOOL_INFO.totalEducators} educators** (${SCHOOL_INFO.studentTeacherRatio} ratio, ${SCHOOL_INFO.surveyYear} survey data). NatEmis: **${SCHOOL_INFO.natEmis}**. Sector: **${SCHOOL_INFO.sector}**; phase: **${SCHOOL_INFO.phase}**.`,
      navigateTo: "/about#asa-about-content",
      linkLabel: "About stats",
    },
    {
      id: "principal",
      keywords: ["principal", "head", "makeche"],
      buildAnswer: () => `Principal (as listed for ${SCHOOL_INFO.principalYear}): **${SCHOOL_INFO.principal}**.`,
      navigateTo: "/about#asa-about-content",
      linkLabel: "About school",
    },
    {
      id: "values",
      keywords: ["value", "values", "culture", "excellence", "discipline", "community", "innovation", "philosophy"],
      buildAnswer: () => `Our core values include: ${vLines}`,
      navigateTo: "/#asa-home-values",
      linkLabel: "Home — values section",
    },
    {
      id: "testimonials",
      keywords: ["testimonial", "review", "parents say", "what people say"],
      buildAnswer: () =>
        `Here's what visitors and families said (summaries): ${TESTIMONIALS.map((t) => `"${t.text.slice(0, 80)}…" (${t.name}, ${t.role})`).join(" ")}`,
      navigateTo: "/#asa-home-testimonials",
      linkLabel: "Home — testimonials",
    },
    {
      id: "hours",
      keywords: ["hours", "open", "closing", "time", "when open", "office hours"],
      buildAnswer: () => `The school operates **Monday–Friday, 07:30–15:00** (general hours shown on site).`,
      navigateTo: "/contact#asa-contact-form",
      linkLabel: "Contact",
    },
    {
      id: "nav-all",
      keywords: ["pages", "sections", "sitemap", "where can i go"],
      buildAnswer: () =>
        `Pages on this website: ${NAV_LINKS.map((l) => `**${l.label}** (${l.href})`).join(", ")}. Ask “take me to fees” etc. anytime.`,
    },
    {
      id: "combined",
      keywords: ["combined school", "independent school", "private school", "gauteng", "phase", "sector"],
      buildAnswer: () =>
        `We're an **${SCHOOL_INFO.sector.toLowerCase()} ${SCHOOL_INFO.phase.toLowerCase()}** in **${SCHOOL_INFO.province}** (${SCHOOL_INFO.specialisation.toLowerCase()} specialization on record).`,
      navigateTo: "/about#asa-about-content",
      linkLabel: "About",
    },
  ]
}

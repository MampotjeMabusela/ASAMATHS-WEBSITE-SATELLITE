import {
  BRAND,
  NAV_LINKS,
  SCHOOL_INFO,
  TESTIMONIALS,
  VALUES,
  hasSisterSchoolLink,
  SISTER_SCHOOL_LINK,
} from "@/lib/constants"
import type { AsaKnowledgeEntry } from "@/types/asa"

const { shortName, name, officeHoursLong, email, phone, phoneAlt, whatsapp } = SCHOOL_INFO

/** Curated knowledge Asa uses to answer — keywords cover everyday family questions. */
export function getAsaKnowledgeBase(): AsaKnowledgeEntry[] {
  const valueSummary = VALUES.map((v) => `${v.title} (${v.description})`).join(" ")
  const parentQuote = TESTIMONIALS.find((t) => t.role === "Parent")

  const entries: AsaKnowledgeEntry[] = [
    {
      id: "greeting",
      priority: 2,
      keywords: [
        "hi",
        "hello",
        "hey",
        "good morning",
        "good afternoon",
        "good day",
        "howdy",
        "start",
        "who are you",
        "what can you do",
        "what do you do",
      ],
      buildAnswer: () =>
        `Hi there! I'm **Asa**, your guide to **${shortName}**. I can explain admissions, fees, subjects, how to reach us, and jump you to the right page. What would you like to know?`,
      suggestions: ["How do I apply?", "Contact details", "What grades do you offer?", "School fees"],
    },
    {
      id: "thanks",
      keywords: ["thank", "thanks", "appreciate", "cheers", "great help"],
      buildAnswer: () =>
        `You're welcome! If you need anything else about **${shortName}**, just ask — or use **Contact** to speak with the office.`,
      suggestions: ["Contact details", "How do I apply?"],
    },
    {
      id: "goodbye",
      keywords: ["bye", "goodbye", "good night", "see you", "later"],
      buildAnswer: () =>
        `Goodbye — and good luck! Remember you can reach us on **${phone}** or **${email}** during **${officeHoursLong}**.`,
    },
    {
      id: "home",
      keywords: ["home", "homepage", "main page", "landing", "website"],
      buildAnswer: () =>
        `The **Home** page introduces **${name}**, our learner community, values, and what families say about us.`,
      navigateTo: "/#asa-home-hero",
      linkLabel: "Go to Home",
    },
    {
      id: "about",
      priority: 1,
      keywords: [
        "about",
        "who are you",
        "tell me about the school",
        "what is asamaths",
        "mission",
        "vision",
        "winterveldt",
        "pretoria",
        "gauteng",
        "independent",
        "combined school",
      ],
      buildAnswer: () =>
        `**${name}** is an independent **${SCHOOL_INFO.phase.toLowerCase()}** in **${SCHOOL_INFO.suburb}**, ${SCHOOL_INFO.city}. We focus on disciplined, nurturing education from **Grade R through Grade 7**. Principal: **${SCHOOL_INFO.principal}** (${SCHOOL_INFO.principalYear}). About **${SCHOOL_INFO.totalLearners}** learners and **${SCHOOL_INFO.totalEducators}** educators.`,
      navigateTo: "/about#asa-about-content",
      linkLabel: "About the school",
      suggestions: ["Admissions", "Contact details", "What grades?"],
    },
    {
      id: "address",
      priority: 1,
      keywords: [
        "address",
        "located",
        "where is the school",
        "where are you",
        "directions",
        "find you",
        "visit",
        "7th road",
        "map",
        "location",
      ],
      buildAnswer: () =>
        `You'll find us at **${SCHOOL_INFO.address}**. The **Contact** and **About** pages include a map — handy for directions or planning a visit.`,
      navigateTo: "/contact#asa-contact-form",
      linkLabel: "Contact & map",
    },
    {
      id: "contact",
      priority: 2,
      keywords: [
        "contact",
        "email",
        "message",
        "form",
        "write",
        "reach",
        "get in touch",
        "enquiry",
        "inquiry",
        "send message",
        "talk to someone",
      ],
      buildAnswer: () =>
        `The easiest ways to reach us:\n\n• **Email:** ${email}\n• **Phone:** ${phone} (main) or ${phoneAlt}\n• **Office hours:** ${officeHoursLong}\n\nUse the **Send an Inquiry** form on the **Contact** page — messages go straight to the school inbox.`,
      navigateTo: "/contact#asa-contact-form",
      linkLabel: "Contact & inquiry form",
      suggestions: ["WhatsApp number", "How do I apply?", "Office hours"],
    },
    {
      id: "whatsapp",
      priority: 2,
      keywords: ["whatsapp", "whats app", "wa me", "chat on whatsapp", "text the school"],
      buildAnswer: () =>
        `You can **WhatsApp** us on **${whatsapp}** — there's also a chat button on the site. For formal enquiries, the **Contact** form or email works well too.`,
      navigateTo: "/contact#asa-contact-form",
      linkLabel: "Contact page",
    },
    {
      id: "phone",
      keywords: ["phone", "call", "number", "telephone", "ring", "dial"],
      buildAnswer: () =>
        `Call **${phone}** (main line) or **${phoneAlt}** (additional). The office can help with admissions, fees, and general questions during **${officeHoursLong}**.`,
      navigateTo: "/contact#asa-contact-form",
      linkLabel: "All contact details",
    },
    {
      id: "hours",
      keywords: ["hours", "open", "closing", "when open", "office hours", "what time", "school hours"],
      buildAnswer: () =>
        `Our office is generally open **${officeHoursLong}**, Monday to Friday. If you're unsure about a specific visit, call **${phone}** first — the team will confirm.`,
      navigateTo: "/contact#asa-contact-form",
      linkLabel: "Contact",
    },
    {
      id: "admissions",
      priority: 3,
      keywords: [
        "admission",
        "admissions",
        "apply",
        "application",
        "enrol",
        "enroll",
        "register",
        "registration",
        "placement",
        "interview",
        "assessment",
        "documents",
        "birth certificate",
        "transfer",
        "new learner",
        "new student",
        "join the school",
        "how do i apply",
      ],
      buildAnswer: () =>
        `Here's the usual **admissions** path:\n\n1. **Contact** the school to express interest\n2. Submit documents (birth certificate, recent reports, transfer card if applicable)\n3. **Interview or assessment** for placement\n4. **Enrolment** once accepted — fees and registration apply\n\nEvery family is different, so the office can walk you through the latest steps.`,
      navigateTo: "/admissions#asa-admissions",
      linkLabel: "Admissions page",
      suggestions: ["School fees", "Contact details", "What grades?"],
    },
    {
      id: "subjects",
      priority: 2,
      keywords: [
        "subject",
        "subjects",
        "curriculum",
        "syllabus",
        "what do you teach",
        "learning areas",
        "grade r",
        "foundation",
        "intermediate",
        "grade 7",
        "math",
        "mathematics",
        "english",
        "afrikaans",
        "natural sciences",
        "life orientation",
        "ems",
        "creative arts",
      ],
      buildAnswer: () =>
        `We offer **Grade R through Grade 7** only. On **Subjects** you'll see three bands:\n\n• **Foundation** (R–3)\n• **Intermediate** (4–6)\n• **Grade 7** senior-phase areas\n\nWe do **not** enrol Grades 8–12 or FET. For a specific grade's timetable, contact the office.`,
      navigateTo: "/subjects#asa-subjects",
      linkLabel: "Subjects & curriculum",
      suggestions: ["Admissions", "Grade 8 or matric?", "Contact"],
    },
    {
      id: "grades-high",
      priority: 3,
      keywords: [
        "grade 8",
        "grade 9",
        "grade 10",
        "grade 11",
        "grade 12",
        "matric",
        "fet",
        "high school",
        "secondary school",
        "after grade 7",
      ],
      buildAnswer: () =>
        `**${shortName}** enrols **Grade R through Grade 7** only — we don't offer Grades 8–12 or matric on this campus. After Grade 7, families typically look at high schools in the area. Our team can still offer general guidance if you call **${phone}**.`,
      navigateTo: "/subjects#asa-subjects",
      linkLabel: "See our grades",
      suggestions: ["Admissions", "Contact"],
    },
    {
      id: "fees",
      priority: 3,
      keywords: [
        "fee",
        "fees",
        "tuition",
        "cost",
        "price",
        "how much",
        "payment",
        "pay",
        "registration fee",
        "bank",
        "deposit",
        "school fees",
        "afford",
      ],
      buildAnswer: () =>
        `**${shortName}** is fee-paying; amounts depend on grade and services. The **Fees** page explains the **2026** schedule, payment options, and banking details. For your child's exact amount or a payment plan, contact the office — they'll give you the current figures.`,
      navigateTo: "/fees#asa-fees",
      linkLabel: "Fees page",
      suggestions: ["How do I apply?", "Contact details"],
    },
    {
      id: "gallery",
      keywords: ["gallery", "photos", "pictures", "images", "campus photos", "see the school", "tour"],
      buildAnswer: () =>
        `Our **Gallery** has real photos of campus life, classrooms, and learners. It's a good way to get a feel for the school before you visit. You can also book a visit from prompts on that page.`,
      navigateTo: "/gallery#asa-gallery",
      linkLabel: "View gallery",
    },
    {
      id: "conduct",
      keywords: [
        "code of conduct",
        "conduct",
        "uniform",
        "discipline",
        "rules",
        "policy",
        "behaviour",
        "behavior",
        "dress code",
      ],
      buildAnswer: () =>
        `Our **Code of Conduct** covers uniforms, discipline, attendance, and family responsibilities. It's worth reading before enrolment so everyone knows the expectations.`,
      navigateTo: "/code-of-conduct#asa-code-of-conduct",
      linkLabel: "Code of Conduct",
    },
    {
      id: "stats",
      keywords: [
        "how many",
        "learners",
        "students",
        "pupils",
        "teachers",
        "educators",
        "ratio",
        "nat emis",
        "natemis",
        "size",
        "enrolment numbers",
      ],
      buildAnswer: () =>
        `At a glance: about **${SCHOOL_INFO.totalLearners} learners**, **${SCHOOL_INFO.totalEducators} educators**, ratio **${SCHOOL_INFO.studentTeacherRatio}** (${SCHOOL_INFO.surveyYear} survey). **NatEmis:** ${SCHOOL_INFO.natEmis}. We're **${SCHOOL_INFO.sector}**, **${SCHOOL_INFO.phase}**.`,
      navigateTo: "/about#asa-about-content",
      linkLabel: "About — facts",
    },
    {
      id: "principal",
      keywords: ["principal", "headmaster", "head teacher", "makeche", "who is in charge"],
      buildAnswer: () =>
        `Our principal (listed for ${SCHOOL_INFO.principalYear}) is **${SCHOOL_INFO.principal}**. For appointments or official matters, contact the office on **${phone}**.`,
      navigateTo: "/about#asa-about-content",
      linkLabel: "About",
    },
    {
      id: "values",
      keywords: ["value", "values", "culture", "excellence", "community", "innovation", "motto", "philosophy"],
      buildAnswer: () =>
        `Our motto is **${BRAND.motto}**. Core values: ${valueSummary}`,
      navigateTo: "/#asa-home-values",
      linkLabel: "Our values",
    },
    {
      id: "testimonials",
      keywords: ["testimonial", "review", "parents say", "what people say", "feedback", "reputation"],
      buildAnswer: () =>
        parentQuote
          ? `Families share positive feedback on our site. For example, **${parentQuote.name}** (${parentQuote.role}) said: "${parentQuote.text.slice(0, 120)}…" See more on the **Home** page.`
          : `Families share positive feedback on the **Home** page — visit the testimonials section to read more.`,
      navigateTo: "/#asa-home-testimonials",
      linkLabel: "Community voices",
    },
    {
      id: "nav-all",
      keywords: ["pages", "sections", "sitemap", "where can i go", "what's on the site", "website pages"],
      buildAnswer: () =>
        `Pages here: ${NAV_LINKS.map((l) => `**${l.label}**`).join(", ")}. Say something like "take me to admissions" and I'll point you there.`,
      suggestions: ["Admissions", "Fees", "Contact"],
    },
    {
      id: "motto",
      keywords: ["knowledge wisdom humanity", "school motto", "crest", "logo"],
      buildAnswer: () =>
        `Our motto is **${BRAND.motto}** — you'll see it on our crest and across the site.`,
      navigateTo: "/",
      linkLabel: "Home",
    },
  ]

  if (hasSisterSchoolLink()) {
    entries.push({
      id: "sister-campus",
      keywords: ["pretoria", "winterveldt", "other campus", "sister school", "second campus", "other site"],
      buildAnswer: () =>
        `We also have **${SISTER_SCHOOL_LINK.label}** — a separate campus site you can open from the menu. This site covers **${SCHOOL_INFO.suburb}**, ${SCHOOL_INFO.city}.`,
      navigateTo: SISTER_SCHOOL_LINK.url,
      linkLabel: SISTER_SCHOOL_LINK.label,
    })
  }

  return entries
}

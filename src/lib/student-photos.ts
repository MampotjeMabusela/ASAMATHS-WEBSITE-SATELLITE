/** Public paths for on-site student photography (see /public/images/students). */

export const STUDENT_PHOTOS = {
  hero: "/images/students/hero-primary.png",
  classroom: "/images/students/classroom-energy.png",
  reading: "/images/students/student-reading.png",
  focus: "/images/students/student-focus.png",
  smile: "/images/students/student-smile.png",
  foundation: "/images/students/foundation-sepedi.png",
  playground: "/images/students/playground.png",
  sports: "/images/students/sports-field.png",
  joy: "/images/students/students-joy.png",
  scienceLesson: "/images/students/science-lesson.png",
  studentReadingPortrait: "/images/students/student-reading-portrait.png",
  mathWhiteboardStudent: "/images/students/math-whiteboard-student.png",
  mathChalkboardLesson: "/images/students/math-chalkboard-lesson.png",
  classroomCelebration: "/images/students/classroom-celebration.png",
} as const

export type GalleryItem = {
  src: string
  title: string
  caption: string
  /** Descriptive alt text: subject, activity, phase (not just “students”). */
  alt: string
}

export const GALLERY_ITEMS: GalleryItem[] = [
  {
    src: STUDENT_PHOTOS.hero,
    title: "Engaged in class",
    caption: "Learners ready to participate in lessons.",
    alt: "Primary-phase learner confidently taking part in a whole-class lesson with hand raised.",
  },
  {
    src: STUDENT_PHOTOS.classroom,
    title: "Active learning",
    caption: "Hands up, minds on—collaborative classroom moments.",
    alt: "Group of intermediate-phase learners with hands raised during an interactive lesson.",
  },
  {
    src: STUDENT_PHOTOS.reading,
    title: "Focus on literacy",
    caption: "Building strong reading habits every day.",
    alt: "Learner concentrating on literacy work at a desk in a bright classroom.",
  },
  {
    src: STUDENT_PHOTOS.focus,
    title: "Learning spaces",
    caption: "Bright, structured environments for study.",
    alt: "Learner focused at a desk during independent classwork in Tembisa, Johannesburg.",
  },
  {
    src: STUDENT_PHOTOS.smile,
    title: "Proud moment",
    caption: "Confidence grows with every small success.",
    alt: "Smiling learner in school uniform reflecting a confident classroom moment.",
  },
  {
    src: STUDENT_PHOTOS.foundation,
    title: "Foundation-phase work",
    caption: "Home language and foundational skills (e.g. Sepedi literacy resources).",
    alt: "Foundation-phase learner working with literacy and language materials in class.",
  },
  {
    src: STUDENT_PHOTOS.playground,
    title: "Play and movement",
    caption: "Break time energy and teamwork outdoors.",
    alt: "Learners outdoors on the playground during break with space for play and movement.",
  },
  {
    src: STUDENT_PHOTOS.sports,
    title: "On the field",
    caption: "Physical education and sporty afternoons.",
    alt: "Learners during physical-education-style activity with open grass and sunshine.",
  },
  {
    src: STUDENT_PHOTOS.joy,
    title: "Together we grow",
    caption: "Friendships and smiles across the phases we offer.",
    alt: "Cheerful group of classmates celebrating learning together indoors.",
  },
  {
    src: STUDENT_PHOTOS.scienceLesson,
    title: "Science in action",
    caption: "Hands-on investigations with educators alongside our learners.",
    alt: "Natural sciences exploration: educator and learner with magnets during a lesson.",
  },
  {
    src: STUDENT_PHOTOS.studentReadingPortrait,
    title: "Every reader matters",
    caption: "Confident literacy habits in calm, purposeful classrooms.",
    alt: "Portrait-style photo of a primary learner reading attentively from a book.",
  },
  {
    src: STUDENT_PHOTOS.mathWhiteboardStudent,
    title: "Numeracy confidence",
    caption: "Learners practising mathematics with focus and perseverance.",
    alt: "Learner solving two-digit addition on a classroom whiteboard for numeracy practice.",
  },
  {
    src: STUDENT_PHOTOS.mathChalkboardLesson,
    title: "Mathematics explained",
    caption: "Clear teaching guided by caring, experienced educators.",
    alt: "Mathematics educator pointing to sums on the chalkboard while learners look on.",
  },
  {
    src: STUDENT_PHOTOS.classroomCelebration,
    title: "We celebrate progress",
    caption: "Joint success when effort turns into breakthrough moments.",
    alt: "Classmates smiling and cheering during a participatory classroom celebration.",
  },
]

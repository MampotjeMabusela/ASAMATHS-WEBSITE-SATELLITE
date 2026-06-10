export interface ContactFormData {
  firstName: string
  lastName: string
  email: string
  phone: string
  subject: string
  message: string
  gradeInterested?: string
  /** Honeypot — must stay empty */
  website?: string
}

export interface NavLink {
  label: string
  href: string
  children?: NavLink[]
}

export interface StatItem {
  label: string
  value: string
  icon: string
}

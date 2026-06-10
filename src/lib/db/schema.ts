import { sql } from "@vercel/postgres"
import { isDatabaseConfigured } from "@/lib/db/client"

let schemaEnsured = false
let schemaPromise: Promise<void> | null = null

/** Idempotent DDL — runs once per server instance when Neon is connected. */
export async function ensureDatabaseSchema(): Promise<void> {
  if (schemaEnsured || !isDatabaseConfigured()) return
  if (schemaPromise) return schemaPromise

  schemaPromise = (async () => {
    await sql`
      CREATE TABLE IF NOT EXISTS applications (
        id BIGSERIAL PRIMARY KEY,
        reference VARCHAR(32) NOT NULL UNIQUE,
        campus VARCHAR(160) NOT NULL,
        school_year VARCHAR(8) NOT NULL,
        learner_name VARCHAR(200) NOT NULL,
        grade_applying VARCHAR(24) NOT NULL,
        guardian_email VARCHAR(254) NOT NULL,
        guardian_phone VARCHAR(24) NOT NULL,
        payload JSONB NOT NULL,
        email_sent BOOLEAN NOT NULL DEFAULT FALSE,
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      )
    `
    await sql`CREATE INDEX IF NOT EXISTS idx_applications_created_at ON applications (created_at DESC)`
    await sql`CREATE INDEX IF NOT EXISTS idx_applications_guardian_email ON applications (guardian_email)`
    await sql`CREATE INDEX IF NOT EXISTS idx_applications_campus_year ON applications (campus, school_year)`

    await sql`
      CREATE TABLE IF NOT EXISTS contact_inquiries (
        id BIGSERIAL PRIMARY KEY,
        campus VARCHAR(160) NOT NULL,
        first_name VARCHAR(80) NOT NULL,
        last_name VARCHAR(80) NOT NULL,
        email VARCHAR(254) NOT NULL,
        phone VARCHAR(24) NOT NULL,
        subject VARCHAR(200) NOT NULL,
        message TEXT NOT NULL,
        grade_interested VARCHAR(40),
        payload JSONB NOT NULL,
        email_sent BOOLEAN NOT NULL DEFAULT FALSE,
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      )
    `
    await sql`CREATE INDEX IF NOT EXISTS idx_contact_inquiries_created_at ON contact_inquiries (created_at DESC)`
    await sql`CREATE INDEX IF NOT EXISTS idx_contact_inquiries_email ON contact_inquiries (email)`

    schemaEnsured = true
  })().catch((err) => {
    schemaPromise = null
    throw err
  })

  return schemaPromise
}

/**
 * Initialise Postgres tables for applications and enquiries.
 * Usage: POSTGRES_URL=... node scripts/db-init.mjs
 */
import fs from "node:fs"
import path from "node:path"
import { fileURLToPath } from "node:url"
import pg from "pg"

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const connectionString = process.env.POSTGRES_URL || process.env.DATABASE_URL

if (!connectionString) {
  console.error("Set POSTGRES_URL or DATABASE_URL")
  process.exit(1)
}

const ddl = fs.readFileSync(path.join(__dirname, "db-init.sql"), "utf8")
const client = new pg.Client({ connectionString, ssl: { rejectUnauthorized: false } })

try {
  await client.connect()
  await client.query(ddl)
  console.log("Database tables ready (applications, contact_inquiries).")
} catch (err) {
  console.error("db-init failed:", err)
  process.exitCode = 1
} finally {
  await client.end()
}

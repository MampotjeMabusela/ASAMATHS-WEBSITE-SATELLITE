import { isWeb3FormsConfigured } from "@/lib/web3forms"

export function isDatabaseConfigured(): boolean {
  return Boolean(process.env.POSTGRES_URL?.trim() || process.env.DATABASE_URL?.trim())
}

/** Forms work when Postgres and/or Web3Forms email is configured. */
export function isFormsServiceReady(): boolean {
  return isDatabaseConfigured() || isWeb3FormsConfigured()
}

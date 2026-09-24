import { submitApplicationToWeb3Forms } from "@/lib/web3forms-application"
import type { ApplicationFormValues } from "@/types/application"

/**
 * Emails the application as plain text via Web3Forms (JSON).
 * No PDF or file attachments — Free plan compatible, same pattern as Contact.
 */
export async function submitApplicationEmail(
  data: ApplicationFormValues,
  reference: string
): Promise<{ ok: true } | { ok: false; status?: number; detail: string }> {
  return submitApplicationToWeb3Forms(data, reference)
}

/** @deprecated Use submitApplicationEmail — kept for any leftover imports. */
export const submitApplicationWithPdf = submitApplicationEmail

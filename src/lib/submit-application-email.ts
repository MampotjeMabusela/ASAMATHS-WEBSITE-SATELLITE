import {
  buildFilledApplicationPdf,
  filledApplicationPdfFilename,
} from "@/lib/application-pdf"
import { buildApplicationFormData } from "@/lib/web3forms-application"
import { WEB3FORMS_SUBMIT_URL, getWeb3FormsAccessKey, getWeb3FormsPublicAccessKey } from "@/lib/web3forms"
import type { ApplicationFiles, ApplicationFormValues } from "@/types/application"

type Web3FormsResponse = {
  success?: boolean
  message?: string
  body?: { message?: string }
}

async function parseWeb3FormsResponse(res: Response) {
  const json = (await res.json().catch(() => ({}))) as Web3FormsResponse
  const apiMessage = json.message ?? json.body?.message
  if (res.ok && json.success) {
    return { ok: true as const }
  }
  return {
    ok: false as const,
    status: res.status,
    detail: apiMessage || "Could not send your application. Please try again.",
  }
}

/** Server-only: generates the filled PDF and emails it with the application. */
export async function submitApplicationWithPdf(
  data: ApplicationFormValues,
  files: ApplicationFiles,
  reference: string
): Promise<{ ok: true } | { ok: false; status?: number; detail: string }> {
  const accessKey = getWeb3FormsAccessKey() || getWeb3FormsPublicAccessKey()
  if (!accessKey) {
    return { ok: false, detail: "Application form is not configured yet." }
  }

  try {
    const pdfBuffer = buildFilledApplicationPdf(data, reference, files)
    const pdfBlob = new Blob([new Uint8Array(pdfBuffer)], { type: "application/pdf" })
    const formData = buildApplicationFormData(
      data,
      files,
      accessKey,
      reference,
      pdfBlob,
      filledApplicationPdfFilename(reference)
    )

    const res = await fetch(WEB3FORMS_SUBMIT_URL, {
      method: "POST",
      body: formData,
    })
    return parseWeb3FormsResponse(res)
  } catch (err) {
    console.error("Application email with PDF error:", err)
    return {
      ok: false,
      detail: "Could not reach the email service. Please try again or email the school directly.",
    }
  }
}

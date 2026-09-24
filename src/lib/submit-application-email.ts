import { buildApplicationFormData } from "@/lib/web3forms-application"
import {
  WEB3FORMS_SUBMIT_URL,
  getWeb3FormsAccessKey,
  getWeb3FormsPublicAccessKey,
} from "@/lib/web3forms"
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

/**
 * Emails the application via Web3Forms as text fields only.
 *
 * Web3Forms Free does not support file attachments (Pro-only). Attaching the
 * generated PDF previously caused every parent submission to fail. Full details
 * are included in the email body instead. Set WEB3FORMS_ALLOW_ATTACHMENTS=true
 * only if the account is on a Pro plan.
 */
export async function submitApplicationWithPdf(
  data: ApplicationFormValues,
  files: ApplicationFiles,
  reference: string
): Promise<{ ok: true } | { ok: false; status?: number; detail: string }> {
  const accessKey = getWeb3FormsAccessKey() || getWeb3FormsPublicAccessKey()
  if (!accessKey) {
    return { ok: false, detail: "Application form is not configured yet." }
  }

  const allowAttachments = process.env.WEB3FORMS_ALLOW_ATTACHMENTS === "true"

  try {
    let formData = buildApplicationFormData(data, files, accessKey, reference, {
      includeAttachments: false,
    })

    if (allowAttachments) {
      try {
        const { buildFilledApplicationPdf, filledApplicationPdfFilename } = await import(
          "@/lib/application-pdf"
        )
        const pdfBuffer = buildFilledApplicationPdf(data, reference, files)
        const pdfBlob = new Blob([new Uint8Array(pdfBuffer)], { type: "application/pdf" })
        formData = buildApplicationFormData(data, files, accessKey, reference, {
          includeAttachments: true,
          pdfBlob,
          pdfFilename: filledApplicationPdfFilename(reference),
        })
      } catch (pdfErr) {
        console.warn("Application PDF attachment skipped:", pdfErr)
        formData = buildApplicationFormData(data, files, accessKey, reference, {
          includeAttachments: false,
        })
      }
    }

    const res = await fetch(WEB3FORMS_SUBMIT_URL, {
      method: "POST",
      body: formData,
    })
    return parseWeb3FormsResponse(res)
  } catch (err) {
    console.error("Application email error:", err)
    return {
      ok: false,
      detail: "Could not reach the email service. Please try again or email the school directly.",
    }
  }
}

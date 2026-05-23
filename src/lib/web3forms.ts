import type { ContactFormData } from "@/types"
import { SCHOOL_INFO } from "@/lib/constants"

export const WEB3FORMS_SUBMIT_URL = "https://api.web3forms.com/submit"

/** School inbox — Web3Forms delivers to the email used when creating the access key. */
export function getInquiryInbox(): string {
  return SCHOOL_INFO.email
}

/** Server-side key (Vercel env). Preferred for API route. */
export function getWeb3FormsAccessKey(): string | null {
  return process.env.WEB3FORMS_ACCESS_KEY?.trim() || null
}

/** Client-side key — Web3Forms documents this as safe to expose in the browser. */
export function getWeb3FormsPublicAccessKey(): string | null {
  return process.env.NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY?.trim() || null
}

export function isWeb3FormsConfigured(): boolean {
  return Boolean(getWeb3FormsAccessKey() || getWeb3FormsPublicAccessKey())
}

export function buildWeb3FormsPayload(data: ContactFormData, accessKey: string) {
  return {
    access_key: accessKey,
    subject: `Website Inquiry: ${data.subject} — ${data.firstName} ${data.lastName}`,
    from_name: `${SCHOOL_INFO.shortName} Website`,
    name: `${data.firstName} ${data.lastName}`,
    email: data.email,
    phone: data.phone,
    inquiry_subject: data.subject,
    message: data.message,
    grade_interested: data.gradeInterested?.trim() || "Not specified",
    replyto: data.email,
    botcheck: "",
  }
}

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
    detail: apiMessage || "Web3Forms could not send your message. Please try again.",
  }
}

/** Submit from the browser (recommended by Web3Forms — no server IP whitelist). */
export async function submitInquiryToWeb3FormsClient(
  data: ContactFormData
): Promise<{ ok: true } | { ok: false; status?: number; detail: string }> {
  const accessKey = getWeb3FormsPublicAccessKey()
  if (!accessKey) {
    return { ok: false, detail: "Inquiry form is not configured yet." }
  }

  try {
    const res = await fetch(WEB3FORMS_SUBMIT_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(buildWeb3FormsPayload(data, accessKey)),
    })
    return parseWeb3FormsResponse(res)
  } catch (err) {
    console.error("Web3Forms client error:", err)
    return {
      ok: false,
      detail: "Could not reach the email service. Please try again or email the school directly.",
    }
  }
}

/** Submit from API route (requires WEB3FORMS_ACCESS_KEY on the server). */
export async function submitInquiryToWeb3Forms(
  data: ContactFormData
): Promise<{ ok: true } | { ok: false; status?: number; detail: string }> {
  const accessKey = getWeb3FormsAccessKey()
  if (!accessKey) {
    return { ok: false, detail: "Inquiry form is not configured yet." }
  }

  try {
    const res = await fetch(WEB3FORMS_SUBMIT_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(buildWeb3FormsPayload(data, accessKey)),
    })
    return parseWeb3FormsResponse(res)
  } catch (err) {
    console.error("Web3Forms server error:", err)
    return {
      ok: false,
      detail: "Could not reach the email service. Please try again or email the school directly.",
    }
  }
}

"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Loader2, CheckCircle2, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import type { ContactFormData } from "@/types"
import { SCHOOL_INFO } from "@/lib/constants"
import {
  getInquiryInbox,
  getWeb3FormsPublicAccessKey,
  submitInquiryToWeb3FormsClient,
} from "@/lib/web3forms"

const contactSchema = z.object({
  firstName: z.string().min(2, "First name is required"),
  lastName: z.string().min(2, "Last name is required"),
  email: z.string().email("Valid email is required"),
  phone: z.string().min(7, "Phone number is required"),
  subject: z.string().min(3, "Subject is required"),
  message: z.string().min(10, "Message must be at least 10 characters"),
  gradeInterested: z.string().optional(),
})

type FormStatus = {
  type: "success" | "error" | null
  message: string
}

function FieldError({ id, message }: { id: string; message?: string }) {
  if (!message) return null
  return (
    <p id={id} role="alert" className="text-xs text-red-600">
      {message}
    </p>
  )
}

export function ContactForm() {
  const [status, setStatus] = useState<FormStatus>({ type: null, message: "" })

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
  })

  const onSubmit = async (data: ContactFormData) => {
    setStatus({ type: null, message: "" })
    const inbox = getInquiryInbox()
    try {
      // Web3Forms recommends browser-side submit; fall back to /api/contact if only server key is set.
      const publicKey = getWeb3FormsPublicAccessKey()
      if (publicKey) {
        const result = await submitInquiryToWeb3FormsClient(data)
        if (!result.ok) {
          throw new Error(`${result.detail} You can also email ${inbox} directly.`)
        }
        setStatus({
          type: "success",
          message: `Your inquiry was sent to ${inbox}. We will reply during school hours.`,
        })
        reset()
        return
      }

      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })
      const json = (await res.json()) as { error?: string; message?: string; fallbackEmail?: string }

      if (!res.ok) {
        const fallback = json.fallbackEmail || inbox
        throw new Error(json.error || `Could not send your inquiry. Please email ${fallback} directly.`)
      }

      setStatus({
        type: "success",
        message:
          json.message ||
          `Your inquiry was sent to ${inbox}. We will reply during school hours.`,
      })
      reset()
    } catch (err) {
      const fallback = inbox
      const isNetwork =
        err instanceof TypeError ||
        (err instanceof Error && /failed to fetch/i.test(err.message))
      setStatus({
        type: "error",
        message: isNetwork
          ? `Connection problem. Check your internet and try again, or email ${fallback} directly.`
          : err instanceof Error
            ? err.message
            : `Failed to send. Please email ${fallback} directly.`,
      })
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
      {status.type && (
        <div
          role="status"
          className={`flex items-center gap-2 rounded-lg p-4 text-sm ${
            status.type === "success"
              ? "border border-green-200 bg-green-50 text-green-700"
              : "border border-red-200 bg-red-50 text-red-700"
          }`}
        >
          {status.type === "success" ? (
            <CheckCircle2 className="h-5 w-5 flex-shrink-0" />
          ) : (
            <AlertCircle className="h-5 w-5 flex-shrink-0" />
          )}
          {status.message}
        </div>
      )}

      <div className="grid gap-5 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="firstName">First Name *</Label>
          <Input
            id="firstName"
            placeholder="John"
            aria-invalid={errors.firstName ? true : undefined}
            aria-describedby={errors.firstName ? "firstName-error" : undefined}
            {...register("firstName")}
          />
          <FieldError id="firstName-error" message={errors.firstName?.message} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="lastName">Last Name *</Label>
          <Input
            id="lastName"
            placeholder="Doe"
            aria-invalid={errors.lastName ? true : undefined}
            aria-describedby={errors.lastName ? "lastName-error" : undefined}
            {...register("lastName")}
          />
          <FieldError id="lastName-error" message={errors.lastName?.message} />
        </div>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="email">Email *</Label>
          <Input
            id="email"
            type="email"
            placeholder="john@example.com"
            aria-invalid={errors.email ? true : undefined}
            aria-describedby={errors.email ? "email-error" : undefined}
            {...register("email")}
          />
          <FieldError id="email-error" message={errors.email?.message} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="phone">Phone *</Label>
          <Input
            id="phone"
            type="tel"
            placeholder="+27 12 345 6789"
            aria-invalid={errors.phone ? true : undefined}
            aria-describedby={errors.phone ? "phone-error" : undefined}
            {...register("phone")}
          />
          <FieldError id="phone-error" message={errors.phone?.message} />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="gradeInterested">Grade Interested In (Optional)</Label>
        <select
          id="gradeInterested"
          {...register("gradeInterested")}
          className="flex h-11 w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm shadow-sm hover:border-gray-400 focus:border-primary-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-600 focus-visible:ring-offset-2"
        >
          <option value="">Select a grade</option>
          <option value="Grade R">Grade R</option>
          <option value="Grade 1">Grade 1</option>
          <option value="Grade 2">Grade 2</option>
          <option value="Grade 3">Grade 3</option>
          <option value="Grade 4">Grade 4</option>
          <option value="Grade 5">Grade 5</option>
          <option value="Grade 6">Grade 6</option>
          <option value="Grade 7">Grade 7</option>
        </select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="subject">Subject *</Label>
        <Input
          id="subject"
          placeholder="Admission inquiry"
          aria-invalid={errors.subject ? true : undefined}
          aria-describedby={errors.subject ? "subject-error" : undefined}
          {...register("subject")}
        />
        <FieldError id="subject-error" message={errors.subject?.message} />
      </div>

      <div className="space-y-2">
        <Label htmlFor="message">Message *</Label>
        <Textarea
          id="message"
          placeholder="Tell us about your inquiry..."
          aria-invalid={errors.message ? true : undefined}
          aria-describedby={errors.message ? "message-error" : undefined}
          {...register("message")}
        />
        <FieldError id="message-error" message={errors.message?.message} />
      </div>

      <p className="text-xs leading-relaxed text-gray-500">
        Messages are sent securely to{" "}
        <a
          href={`mailto:${SCHOOL_INFO.email}`}
          className="font-medium text-primary-700 underline decoration-primary-700/40 underline-offset-2 hover:text-primary-900"
        >
          {SCHOOL_INFO.email}
        </a>
        . We aim to reply during school hours.
      </p>
      <p className="border-t border-gray-100 pt-4 text-xs leading-relaxed text-gray-500">
        By sending this message, you consent to <strong>{SCHOOL_INFO.shortName}</strong> using the details
        above to respond to your enquiry and related administration (for example placements or fee
        follow-up). We process personal information lawfully under the Protection of Personal
        Information Act (POPIA): we keep what is necessary, retain it responsibly, respect your rights
        to access or correction, and do not sell your data.
      </p>
      <Button type="submit" size="lg" className="w-full sm:w-auto" disabled={isSubmitting}>
        {isSubmitting ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Sending...
          </>
        ) : (
          "Send Inquiry"
        )}
      </Button>
    </form>
  )
}

"use client"

import { useMemo, useState } from "react"
import {
  CheckCircle2,
  Loader2,
  Minus,
  Plus,
  ShoppingBag,
  Trash2,
  X,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { FormSelect } from "@/components/forms/form-select"
import { useUniformCart } from "@/components/uniform/uniform-cart-context"
import { SCHOOL_INFO } from "@/lib/constants"
import { isWeb3FormsConfigured } from "@/lib/web3forms"
import {
  UNIFORM_BANK_DETAILS,
  createUniformQuotationReference,
  formatZarFromCents,
} from "@/lib/uniform-shop"
import {
  buildUniformQuotationPdf,
  downloadUniformQuotationPdf,
} from "@/lib/uniform-quotation-pdf"
import { cn } from "@/lib/utils"

const GRADES = [
  "Grade R",
  "Grade 1",
  "Grade 2",
  "Grade 3",
  "Grade 4",
  "Grade 5",
  "Grade 6",
  "Grade 7",
  "Grade 8",
  "Grade 9",
]

type CheckoutStep = "cart" | "details" | "done"

export function UniformCartFab() {
  const { itemCount, setOpen, subtotalCents } = useUniformCart()
  if (itemCount === 0) return null

  return (
    <button
      type="button"
      onClick={() => setOpen(true)}
      className="fixed bottom-24 right-4 z-40 flex items-center gap-2 rounded-full bg-primary-900 px-4 py-3 text-sm font-semibold text-white shadow-xl ring-1 ring-primary-700/40 transition hover:bg-primary-800 sm:bottom-8 sm:right-6"
      aria-label={`Open uniform cart, ${itemCount} items`}
    >
      <ShoppingBag className="h-4 w-4" aria-hidden />
      <span>
        Cart · {itemCount} · {formatZarFromCents(subtotalCents)}
      </span>
    </button>
  )
}

export function UniformCartPanel() {
  const {
    lines,
    itemCount,
    subtotalCents,
    isOpen,
    setOpen,
    updateQuantity,
    removeItem,
    clearCart,
  } = useUniformCart()

  const [step, setStep] = useState<CheckoutStep>("cart")
  const [status, setStatus] = useState<{ type: "error" | "success" | null; message: string }>({
    type: null,
    message: "",
  })
  const [submitting, setSubmitting] = useState(false)
  const [reference, setReference] = useState<string | null>(null)

  const [parentName, setParentName] = useState("")
  const [parentEmail, setParentEmail] = useState("")
  const [parentPhone, setParentPhone] = useState("")
  const [learnerName, setLearnerName] = useState("")
  const [learnerGrade, setLearnerGrade] = useState("Grade 1")
  const [notes, setNotes] = useState("")
  const [paymentMethod, setPaymentMethod] = useState<"quotation" | "eft">("quotation")
  const [paymentReference, setPaymentReference] = useState("")

  const canEmailSchool = useMemo(() => isWeb3FormsConfigured(), [])

  if (!isOpen) return null

  const close = () => {
    setOpen(false)
    if (step === "done") {
      setStep("cart")
      setStatus({ type: null, message: "" })
      setReference(null)
    }
  }

  const details = {
    parentName: parentName.trim(),
    parentEmail: parentEmail.trim(),
    parentPhone: parentPhone.trim(),
    learnerName: learnerName.trim(),
    learnerGrade,
    notes: notes.trim(),
    paymentMethod,
    paymentReference: paymentReference.trim(),
  }

  const validateDetails = () => {
    if (details.parentName.length < 2) return "Enter the parent / guardian name."
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(details.parentEmail)) return "Enter a valid email."
    if (details.parentPhone.length < 7) return "Enter a valid phone number."
    if (details.learnerName.length < 2) return "Enter the learner’s name."
    if (paymentMethod === "eft" && details.paymentReference.length < 2) {
      return "Enter the EFT payment reference you used (or will use)."
    }
    return null
  }

  const handleDownloadPdf = async () => {
    const error = validateDetails()
    if (error) {
      setStatus({ type: "error", message: error })
      return
    }
    const ref = reference ?? createUniformQuotationReference()
    setReference(ref)
    setSubmitting(true)
    try {
      const blob = await buildUniformQuotationPdf(lines, details, ref)
      downloadUniformQuotationPdf(blob, ref)
      setStatus({
        type: "success",
        message: `PDF downloaded. Keep reference ${ref} when you pay or visit the office.`,
      })
    } catch {
      setStatus({
        type: "error",
        message: "Could not generate the PDF quotation. Please try again.",
      })
    } finally {
      setSubmitting(false)
    }
  }

  const handleEmailSchool = async () => {
    const error = validateDetails()
    if (error) {
      setStatus({ type: "error", message: error })
      return
    }
    if (lines.length === 0) return

    const ref = reference ?? createUniformQuotationReference()
    setReference(ref)
    setSubmitting(true)
    setStatus({ type: null, message: "" })

    try {
      // Also generate the PDF locally for the parent to keep.
      const blob = await buildUniformQuotationPdf(lines, details, ref)
      downloadUniformQuotationPdf(blob, ref)

      const res = await fetch("/api/uniform-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          reference: ref,
          ...details,
          lines: lines.map((line) => ({
            name: line.name,
            listLabel: line.listLabel,
            size: line.size,
            quantity: line.quantity,
            unitPriceLabel: line.unitPriceLabel,
            lineTotalCents: line.unitPriceCents * line.quantity,
          })),
          totalCents: subtotalCents,
        }),
      })
      const json = (await res.json()) as { error?: string; message?: string }
      if (!res.ok) throw new Error(json.error || "Could not email the school.")

      setStatus({
        type: "success",
        message:
          json.message ||
          `Order emailed to ${SCHOOL_INFO.email}. Your PDF quotation was also downloaded.`,
      })
      setStep("done")
      clearCart()
    } catch (err) {
      setStatus({
        type: "error",
        message:
          err instanceof Error
            ? err.message
            : `Could not email the school. Download the PDF and email ${SCHOOL_INFO.email} instead.`,
      })
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <button
        type="button"
        className="absolute inset-0 bg-black/50"
        aria-label="Close cart"
        onClick={close}
      />
      <aside
        className="relative flex h-full w-full max-w-md flex-col bg-white shadow-2xl"
        role="dialog"
        aria-modal="true"
        aria-labelledby="uniform-cart-title"
      >
        <div className="flex items-center justify-between border-b border-gray-200 px-4 py-4">
          <div>
            <h2 id="uniform-cart-title" className="font-display text-lg font-bold text-gray-900">
              Uniform cart
            </h2>
            <p className="text-xs text-gray-500">
              {itemCount === 0
                ? "Your basket is empty"
                : `${itemCount} item${itemCount === 1 ? "" : "s"} · ${formatZarFromCents(subtotalCents)}`}
            </p>
          </div>
          <button
            type="button"
            onClick={close}
            className="rounded-lg p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-800"
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-4 py-4">
          {step === "done" ? (
            <div className="rounded-2xl border border-green-200 bg-green-50 p-5 text-center">
              <CheckCircle2 className="mx-auto mb-3 h-10 w-10 text-green-600" aria-hidden />
              <p className="font-display text-lg font-bold text-green-900">Order sent</p>
              {reference ? (
                <p className="mt-2 font-mono text-sm font-semibold text-green-800">
                  Reference: {reference}
                </p>
              ) : null}
              <p className="mt-3 text-sm text-green-800">{status.message}</p>
              <p className="mt-4 text-xs leading-relaxed text-green-700">
                Pay at the school office or via EFT into the Asamaths Uniform Account (details on
                your PDF and this page). Email proof of payment to {SCHOOL_INFO.email} with your
                reference.
              </p>
              <Button className="mt-5" onClick={close}>
                Close
              </Button>
            </div>
          ) : null}

          {step === "cart" ? (
            lines.length === 0 ? (
              <p className="rounded-xl border border-dashed border-gray-200 px-4 py-10 text-center text-sm text-gray-500">
                Add uniform items from the catalogue below. Choose a size, then tap Add to cart.
              </p>
            ) : (
              <ul className="space-y-3">
                {lines.map((line) => (
                  <li
                    key={line.key}
                    className="rounded-xl border border-gray-200 bg-gray-50/80 p-3"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <p className="font-medium text-gray-900">{line.name}</p>
                        <p className="text-xs text-gray-500">
                          {line.listLabel} · Size {line.size}
                        </p>
                        <p className="mt-1 text-sm font-semibold text-primary-900">
                          {formatZarFromCents(line.unitPriceCents * line.quantity)}
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeItem(line.key)}
                        className="rounded-md p-1.5 text-gray-400 hover:bg-white hover:text-red-600"
                        aria-label={`Remove ${line.name}`}
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                    <div className="mt-3 flex items-center gap-2">
                      <button
                        type="button"
                        className="rounded-md border border-gray-300 bg-white p-1.5"
                        onClick={() => updateQuantity(line.key, line.quantity - 1)}
                        aria-label="Decrease quantity"
                      >
                        <Minus className="h-3.5 w-3.5" />
                      </button>
                      <span className="min-w-[2rem] text-center text-sm font-semibold tabular-nums">
                        {line.quantity}
                      </span>
                      <button
                        type="button"
                        className="rounded-md border border-gray-300 bg-white p-1.5"
                        onClick={() => updateQuantity(line.key, line.quantity + 1)}
                        aria-label="Increase quantity"
                      >
                        <Plus className="h-3.5 w-3.5" />
                      </button>
                      <span className="ml-auto text-xs text-gray-500">{line.unitPriceLabel} each</span>
                    </div>
                  </li>
                ))}
              </ul>
            )
          ) : null}

          {step === "details" ? (
            <div className="space-y-4">
              <p className="text-sm text-gray-600">
                Enter your details to download a PDF quotation or email the order to the school.
              </p>
              <div className="space-y-1.5">
                <Label htmlFor="uni-parent-name">Parent / guardian name *</Label>
                <Input
                  id="uni-parent-name"
                  value={parentName}
                  onChange={(e) => setParentName(e.target.value)}
                  autoComplete="name"
                />
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <Label htmlFor="uni-parent-email">Email *</Label>
                  <Input
                    id="uni-parent-email"
                    type="email"
                    value={parentEmail}
                    onChange={(e) => setParentEmail(e.target.value)}
                    autoComplete="email"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="uni-parent-phone">Phone *</Label>
                  <Input
                    id="uni-parent-phone"
                    type="tel"
                    value={parentPhone}
                    onChange={(e) => setParentPhone(e.target.value)}
                    autoComplete="tel"
                  />
                </div>
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <Label htmlFor="uni-learner-name">Learner name *</Label>
                  <Input
                    id="uni-learner-name"
                    value={learnerName}
                    onChange={(e) => setLearnerName(e.target.value)}
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="uni-learner-grade">Grade *</Label>
                  <FormSelect
                    id="uni-learner-grade"
                    value={learnerGrade}
                    onChange={(e) => setLearnerGrade(e.target.value)}
                  >
                    {GRADES.map((grade) => (
                      <option key={grade} value={grade}>
                        {grade}
                      </option>
                    ))}
                  </FormSelect>
                </div>
              </div>

              <fieldset className="space-y-2 rounded-xl border border-gray-200 p-3">
                <legend className="px-1 text-sm font-semibold text-gray-900">Checkout option</legend>
                <label className="flex cursor-pointer gap-2 text-sm text-gray-700">
                  <input
                    type="radio"
                    name="paymentMethod"
                    checked={paymentMethod === "quotation"}
                    onChange={() => setPaymentMethod("quotation")}
                  />
                  Download quotation first — pay later at school or by EFT
                </label>
                <label className="flex cursor-pointer gap-2 text-sm text-gray-700">
                  <input
                    type="radio"
                    name="paymentMethod"
                    checked={paymentMethod === "eft"}
                    onChange={() => setPaymentMethod("eft")}
                  />
                  I will pay / have paid by EFT into the Uniform Account
                </label>
              </fieldset>

              {paymentMethod === "eft" ? (
                <div className="space-y-3 rounded-xl border border-primary-100 bg-primary-50/50 p-3 text-sm text-primary-950">
                  <p className="font-semibold">Asamaths Uniform Account</p>
                  <p className="text-xs text-primary-800/90">For uniform purchases only — not school fees.</p>
                  <ul className="space-y-1 text-xs leading-relaxed">
                    <li>Bank: {UNIFORM_BANK_DETAILS.bank}</li>
                    <li>Account name: {UNIFORM_BANK_DETAILS.accountName}</li>
                    <li>Account number: {UNIFORM_BANK_DETAILS.accountNumber}</li>
                    <li>Branch code: {UNIFORM_BANK_DETAILS.branchCode}</li>
                    <li>Reference: {UNIFORM_BANK_DETAILS.referenceHint}</li>
                  </ul>
                  <div className="space-y-1.5">
                    <Label htmlFor="uni-pay-ref">Your EFT payment reference *</Label>
                    <Input
                      id="uni-pay-ref"
                      value={paymentReference}
                      onChange={(e) => setPaymentReference(e.target.value)}
                      placeholder="Name and Grade"
                    />
                  </div>
                  <p className="text-xs text-primary-800/90">
                    After paying, email proof of payment to{" "}
                    <a className="font-medium underline" href={`mailto:${SCHOOL_INFO.email}`}>
                      {SCHOOL_INFO.email}
                    </a>{" "}
                    with your quotation reference.
                  </p>
                </div>
              ) : null}

              <div className="space-y-1.5">
                <Label htmlFor="uni-notes">Notes (optional)</Label>
                <Textarea
                  id="uni-notes"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={3}
                  placeholder="e.g. Collect from office on Friday"
                />
              </div>
            </div>
          ) : null}

          {status.type && step !== "done" ? (
            <p
              className={cn(
                "mt-4 rounded-lg px-3 py-2 text-sm",
                status.type === "error"
                  ? "border border-red-200 bg-red-50 text-red-800"
                  : "border border-green-200 bg-green-50 text-green-800"
              )}
              role="status"
            >
              {status.message}
            </p>
          ) : null}
        </div>

        {step !== "done" ? (
          <div className="space-y-2 border-t border-gray-200 bg-white px-4 py-4">
            {lines.length > 0 ? (
              <p className="flex items-center justify-between text-sm font-semibold text-gray-900">
                <span>Total</span>
                <span className="font-display text-lg text-primary-900">
                  {formatZarFromCents(subtotalCents)}
                </span>
              </p>
            ) : null}

            {step === "cart" ? (
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  className="flex-1"
                  disabled={lines.length === 0}
                  onClick={() => clearCart()}
                >
                  Clear
                </Button>
                <Button
                  className="flex-1"
                  disabled={lines.length === 0}
                  onClick={() => {
                    setStatus({ type: null, message: "" })
                    setStep("details")
                  }}
                >
                  Checkout
                </Button>
              </div>
            ) : (
              <div className="space-y-2">
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => setStep("cart")}
                  disabled={submitting}
                >
                  Back to cart
                </Button>
                <Button className="w-full" onClick={handleDownloadPdf} disabled={submitting}>
                  Download PDF quotation
                </Button>
                <Button
                  className="w-full bg-primary-800 hover:bg-primary-700"
                  onClick={handleEmailSchool}
                  disabled={submitting || !canEmailSchool}
                >
                  {submitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Sending…
                    </>
                  ) : (
                    "Email order to school + download PDF"
                  )}
                </Button>
                {!canEmailSchool ? (
                  <p className="text-center text-[11px] text-amber-700">
                    Online email is not configured. Download the PDF and send it to{" "}
                    {SCHOOL_INFO.email}.
                  </p>
                ) : null}
              </div>
            )}
          </div>
        ) : null}
      </aside>
    </div>
  )
}

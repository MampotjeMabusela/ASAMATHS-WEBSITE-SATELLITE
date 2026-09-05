"use client"

import { useCallback, useMemo, useState } from "react"
import { useForm, type Resolver } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import {
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Loader2,
  User,
  Users,
  MapPin,
  HeartPulse,
  ClipboardCheck,
} from "lucide-react"
import type { LucideIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { FormSelect } from "@/components/forms/form-select"
import { SCHOOL_INFO } from "@/lib/constants"
import {
  APPLICATION_GRADES,
  getApplicationSchoolYears,
  GUARDIAN_RELATIONSHIPS,
  LEARNER_GENDERS,
  REFERRAL_SOURCES,
} from "@/lib/application-constants"
import {
  getApplicationDefaultValues,
  APPLICATION_STEP_FIELDS,
  applicationFormSchema,
  createApplicationReference,
} from "@/lib/application-schema"
import { getInquiryInbox, isWeb3FormsConfigured } from "@/lib/web3forms"
import type { ApplicationFormValues } from "@/types/application"
import { cn } from "@/lib/utils"

const STEPS: { id: keyof typeof APPLICATION_STEP_FIELDS | "review"; title: string; icon: LucideIcon }[] = [
  { id: "guardian", title: "Guardian", icon: Users },
  { id: "learner", title: "Learner", icon: User },
  { id: "address", title: "Address", icon: MapPin },
  { id: "medical", title: "Details", icon: HeartPulse },
  { id: "review", title: "Submit", icon: ClipboardCheck },
]

function FieldError({ id, message }: { id: string; message?: string }) {
  if (!message) return null
  return (
    <p id={id} role="alert" className="text-xs text-red-600">
      {message}
    </p>
  )
}

function StepProgress({ current }: { current: number }) {
  return (
    <nav aria-label="Application progress" className="mb-8">
      <ol className="flex flex-wrap gap-2 sm:gap-3">
        {STEPS.map((step, i) => {
          const done = i < current
          const active = i === current
          return (
            <li
              key={step.id}
              className={cn(
                "flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-medium sm:px-3 sm:text-xs",
                active && "border-primary-600 bg-primary-50 text-primary-900",
                done && "border-primary-200 bg-primary-50/80 text-primary-800",
                !active && !done && "border-gray-200 bg-gray-50 text-gray-500"
              )}
            >
              <step.icon className="h-3.5 w-3.5 shrink-0" aria-hidden />
              <span className="hidden sm:inline">{step.title}</span>
              <span className="sm:hidden">{i + 1}</span>
            </li>
          )
        })}
      </ol>
      <p className="mt-2 text-xs text-gray-500">
        Step {current + 1} of {STEPS.length}: {STEPS[current].title}
      </p>
    </nav>
  )
}

export function ApplicationForm() {
  const [stepIndex, setStepIndex] = useState(0)
  const [reference, setReference] = useState<string | null>(null)
  const [status, setStatus] = useState<{
    type: "success" | "error" | null
    message: string
    ref?: string
  }>({ type: null, message: "" })

  const inbox = getInquiryInbox()
  const configured = isWeb3FormsConfigured()

  const applicationDefaults = useMemo(() => getApplicationDefaultValues(), [])
  const schoolYears = useMemo(() => getApplicationSchoolYears(), [])

  const {
    register,
    handleSubmit,
    watch,
    trigger,
    reset,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<ApplicationFormValues>({
    resolver: zodResolver(applicationFormSchema) as Resolver<ApplicationFormValues>,
    defaultValues: applicationDefaults,
    mode: "onBlur",
  })

  const values = watch()
  const includeSecondGuardian = watch("includeSecondGuardian")

  const currentStep = STEPS[stepIndex]

  const goNext = useCallback(async () => {
    const step = STEPS[stepIndex]
    if (step.id === "review") return

    const fields =
      step.id in APPLICATION_STEP_FIELDS
        ? [...APPLICATION_STEP_FIELDS[step.id as keyof typeof APPLICATION_STEP_FIELDS]]
        : []
    const valid = await trigger(fields as (keyof ApplicationFormValues)[])
    if (valid) setStepIndex((i) => Math.min(i + 1, STEPS.length - 1))
  }, [stepIndex, trigger])

  const goBack = () => setStepIndex((i) => Math.max(0, i - 1))

  const reviewSummary = useMemo(() => {
    const v = values
    return [
      { label: "Reference", value: reference ?? "Generated on submit" },
      { label: "School year", value: v.schoolYear },
      {
        label: "Primary guardian",
        value: `${v.guardian1FirstName} ${v.guardian1LastName} · ${v.guardian1Phone}`,
      },
      {
        label: "Learner",
        value: `${v.learnerFirstName} ${v.learnerLastName} → ${v.gradeApplyingFor}`,
      },
      { label: "Address", value: `${v.suburb}, ${v.city}` },
      {
        label: "Documents",
        value: `Bring to school or email ${inbox} separately`,
      },
    ]
  }, [values, reference, inbox])

  const onSubmit = async (data: ApplicationFormValues) => {
    setStatus({ type: null, message: "" })

    const ref = createApplicationReference()
    setReference(ref)

    try {
      const body = new FormData()
      Object.entries(data).forEach(([k, val]) => {
        if (typeof val === "boolean") body.append(k, val ? "true" : "false")
        else body.append(k, String(val ?? ""))
      })
      body.append("applicationReference", ref)

      const res = await fetch("/api/application", { method: "POST", body })
      const json = (await res.json()) as { error?: string; message?: string; reference?: string }
      if (!res.ok) {
        throw new Error(json.error || `Could not send application. Email ${inbox}.`)
      }

      setStatus({
        type: "success",
        message: `Your application was sent to ${inbox}. Our admissions team will contact you during school hours.`,
        ref,
      })
      reset(getApplicationDefaultValues())
      setStepIndex(0)
      window.scrollTo({ top: 0, behavior: "smooth" })
    } catch (err) {
      const isNetwork =
        err instanceof TypeError ||
        (err instanceof Error && /failed to fetch/i.test(err.message))
      setStatus({
        type: "error",
        message: isNetwork
          ? `Connection problem. Try again or email ${inbox} and quote ${ref}.`
          : err instanceof Error
            ? err.message
            : `Failed to send. Please email ${inbox} directly.`,
      })
    }
  }

  if (status.type === "success") {
    return (
      <div
        role="status"
        className="rounded-2xl border border-green-200 bg-green-50 p-6 text-center sm:p-8"
      >
        <CheckCircle2 className="mx-auto mb-4 h-12 w-12 text-green-600" aria-hidden />
        <h3 className="font-display text-xl font-bold text-green-900">Application received</h3>
        {status.ref && (
          <p className="mt-2 font-mono text-sm font-semibold text-green-800">
            Reference: {status.ref}
          </p>
        )}
        <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-green-800">{status.message}</p>
        <p className="mx-auto mt-4 max-w-md text-xs text-green-700">
          Please keep your reference number. Bring birth certificate, latest school report, and any
          transfer paperwork to the school office, or email them to{" "}
          <a href={`mailto:${inbox}`} className="font-medium underline">
            {inbox}
          </a>{" "}
          quoting your reference.
        </p>
        <Button
          type="button"
          className="mt-6 bg-green-700 hover:bg-green-800"
          onClick={() => {
            setStatus({ type: null, message: "" })
            setReference(null)
          }}
        >
          Submit another application
        </Button>
      </div>
    )
  }

  if (!configured) {
    return (
      <div className="rounded-xl border border-amber-200 bg-amber-50 p-5 text-sm text-amber-900">
        <p className="font-medium">Online applications are almost ready</p>
        <p className="mt-2">
          The form needs a Web3Forms key (same as Contact). Meanwhile, email{" "}
          <a href={`mailto:${inbox}`} className="font-semibold underline">
            {inbox}
          </a>{" "}
          or use the contact form.
        </p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6" noValidate>
      <StepProgress current={stepIndex} />

      {status.type === "error" && (
        <div
          role="alert"
          className="flex items-start gap-2 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700"
        >
          <AlertCircle className="mt-0.5 h-5 w-5 shrink-0" />
          {status.message}
        </div>
      )}

      {currentStep.id === "guardian" && (
        <div className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="schoolYear">School year applying for *</Label>
            <FormSelect id="schoolYear" {...register("schoolYear")}>
              {schoolYears.map((y) => (
                <option key={y} value={y}>
                  {y}
                </option>
              ))}
            </FormSelect>
          </div>
          <p className="text-sm font-semibold text-gray-900">Primary parent or guardian</p>
          <div className="grid gap-5 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="guardian1FirstName">First name *</Label>
              <Input id="guardian1FirstName" {...register("guardian1FirstName")} />
              <FieldError id="g1-fn" message={errors.guardian1FirstName?.message} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="guardian1LastName">Last name *</Label>
              <Input id="guardian1LastName" {...register("guardian1LastName")} />
              <FieldError id="g1-ln" message={errors.guardian1LastName?.message} />
            </div>
          </div>
          <div className="grid gap-5 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="guardian1Email">Email *</Label>
              <Input id="guardian1Email" type="email" {...register("guardian1Email")} />
              <FieldError id="g1-em" message={errors.guardian1Email?.message} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="guardian1Phone">Phone *</Label>
              <Input id="guardian1Phone" type="tel" placeholder="+27 …" {...register("guardian1Phone")} />
              <FieldError id="g1-ph" message={errors.guardian1Phone?.message} />
            </div>
          </div>
          <div className="grid gap-5 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="guardian1Relationship">Relationship to learner *</Label>
              <FormSelect id="guardian1Relationship" {...register("guardian1Relationship")}>
                {GUARDIAN_RELATIONSHIPS.map((r) => (
                  <option key={r} value={r}>
                    {r}
                  </option>
                ))}
              </FormSelect>
            </div>
            <div className="space-y-2">
              <Label htmlFor="guardian1IdNumber">SA ID number (optional)</Label>
              <Input id="guardian1IdNumber" {...register("guardian1IdNumber")} />
              <FieldError id="g1-id" message={errors.guardian1IdNumber?.message} />
            </div>
          </div>
          <label className="flex cursor-pointer items-center gap-2 text-sm text-gray-700">
            <input
              type="checkbox"
              className="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-600"
              {...register("includeSecondGuardian")}
            />
            Add a second parent or guardian
          </label>
          {includeSecondGuardian && (
            <div className="space-y-5 rounded-xl border border-dashed border-primary-200 bg-primary-50/40 p-4">
              <p className="text-sm font-semibold text-primary-950">Second guardian</p>
              <div className="grid gap-5 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="guardian2FirstName">First name *</Label>
                  <Input id="guardian2FirstName" {...register("guardian2FirstName")} />
                  <FieldError id="g2-fn" message={errors.guardian2FirstName?.message} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="guardian2LastName">Last name *</Label>
                  <Input id="guardian2LastName" {...register("guardian2LastName")} />
                  <FieldError id="g2-ln" message={errors.guardian2LastName?.message} />
                </div>
              </div>
              <div className="grid gap-5 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="guardian2Phone">Phone *</Label>
                  <Input id="guardian2Phone" type="tel" {...register("guardian2Phone")} />
                  <FieldError id="g2-ph" message={errors.guardian2Phone?.message} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="guardian2Email">Email (optional)</Label>
                  <Input id="guardian2Email" type="email" {...register("guardian2Email")} />
                  <FieldError id="g2-em" message={errors.guardian2Email?.message} />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="guardian2Relationship">Relationship</Label>
                <FormSelect id="guardian2Relationship" {...register("guardian2Relationship")}>
                  <option value="">Select</option>
                  {GUARDIAN_RELATIONSHIPS.map((r) => (
                    <option key={r} value={r}>
                      {r}
                    </option>
                  ))}
                </FormSelect>
              </div>
            </div>
          )}
        </div>
      )}

      {currentStep.id === "learner" && (
        <div className="space-y-5">
          <div className="grid gap-5 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="learnerFirstName">Learner first name *</Label>
              <Input id="learnerFirstName" {...register("learnerFirstName")} />
              <FieldError id="l-fn" message={errors.learnerFirstName?.message} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="learnerLastName">Learner last name *</Label>
              <Input id="learnerLastName" {...register("learnerLastName")} />
              <FieldError id="l-ln" message={errors.learnerLastName?.message} />
            </div>
          </div>
          <div className="grid gap-5 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="learnerDateOfBirth">Date of birth *</Label>
              <Input id="learnerDateOfBirth" type="date" {...register("learnerDateOfBirth")} />
              <FieldError id="l-dob" message={errors.learnerDateOfBirth?.message} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="learnerGender">Gender (optional)</Label>
              <FormSelect id="learnerGender" {...register("learnerGender")}>
                <option value="">Prefer not to say</option>
                {LEARNER_GENDERS.map((g) => (
                  <option key={g} value={g}>
                    {g}
                  </option>
                ))}
              </FormSelect>
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="learnerIdNumber">Learner SA ID (optional)</Label>
            <Input id="learnerIdNumber" {...register("learnerIdNumber")} />
            <FieldError id="l-id" message={errors.learnerIdNumber?.message} />
          </div>
          <div className="grid gap-5 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="currentGrade">Current grade *</Label>
              <FormSelect id="currentGrade" {...register("currentGrade")}>
                {APPLICATION_GRADES.map((g) => (
                  <option key={g} value={g}>
                    {g}
                  </option>
                ))}
              </FormSelect>
            </div>
            <div className="space-y-2">
              <Label htmlFor="gradeApplyingFor">Grade applying for *</Label>
              <FormSelect id="gradeApplyingFor" {...register("gradeApplyingFor")}>
                {APPLICATION_GRADES.map((g) => (
                  <option key={g} value={g}>
                    {g}
                  </option>
                ))}
              </FormSelect>
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="currentSchoolName">Current or previous school *</Label>
            <Input id="currentSchoolName" {...register("currentSchoolName")} />
            <FieldError id="l-sch" message={errors.currentSchoolName?.message} />
          </div>
          <fieldset className="space-y-2">
            <legend className="text-sm font-medium text-gray-900">
              Do you have the learner&apos;s latest school reports? *
            </legend>
            <div className="flex flex-wrap gap-4">
              {(["yes", "no"] as const).map((v) => (
                <label key={v} className="flex items-center gap-2 text-sm">
                  <input
                    type="radio"
                    value={v}
                    className="text-primary-600 focus:ring-primary-600"
                    {...register("hasPreviousSchoolReports")}
                  />
                  {v === "yes" ? "Yes" : "Not yet — I will provide them"}
                </label>
              ))}
            </div>
          </fieldset>
        </div>
      )}

      {currentStep.id === "address" && (
        <div className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="physicalAddress">Street address *</Label>
            <Input id="physicalAddress" {...register("physicalAddress")} />
            <FieldError id="addr" message={errors.physicalAddress?.message} />
          </div>
          <div className="grid gap-5 sm:grid-cols-3">
            <div className="space-y-2 sm:col-span-1">
              <Label htmlFor="suburb">Suburb *</Label>
              <Input id="suburb" {...register("suburb")} />
              <FieldError id="sub" message={errors.suburb?.message} />
            </div>
            <div className="space-y-2 sm:col-span-1">
              <Label htmlFor="city">City *</Label>
              <Input id="city" {...register("city")} />
              <FieldError id="city" message={errors.city?.message} />
            </div>
            <div className="space-y-2 sm:col-span-1">
              <Label htmlFor="postalCode">Postal code *</Label>
              <Input id="postalCode" inputMode="numeric" {...register("postalCode")} />
              <FieldError id="pc" message={errors.postalCode?.message} />
            </div>
          </div>
          <p className="border-t border-gray-100 pt-4 text-sm font-semibold text-gray-900">
            Emergency contact (if different from guardian)
          </p>
          <div className="grid gap-5 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="emergencyContactName">Full name *</Label>
              <Input id="emergencyContactName" {...register("emergencyContactName")} />
              <FieldError id="ec-n" message={errors.emergencyContactName?.message} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="emergencyContactPhone">Phone *</Label>
              <Input id="emergencyContactPhone" type="tel" {...register("emergencyContactPhone")} />
              <FieldError id="ec-p" message={errors.emergencyContactPhone?.message} />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="emergencyContactRelationship">Relationship *</Label>
            <Input
              id="emergencyContactRelationship"
              placeholder="e.g. Aunt, neighbour"
              {...register("emergencyContactRelationship")}
            />
            <FieldError id="ec-r" message={errors.emergencyContactRelationship?.message} />
          </div>
        </div>
      )}

      {currentStep.id === "medical" && (
        <div className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="allergies">Allergies (optional)</Label>
            <Textarea id="allergies" rows={2} placeholder="None if not applicable" {...register("allergies")} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="medicalConditions">Medical conditions (optional)</Label>
            <Textarea id="medicalConditions" rows={2} {...register("medicalConditions")} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="medication">Medication at school (optional)</Label>
            <Textarea id="medication" rows={2} {...register("medication")} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="specialNeeds">Learning or support needs (optional)</Label>
            <Textarea id="specialNeeds" rows={2} {...register("specialNeeds")} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="referralSource">How did you hear about us? *</Label>
            <FormSelect id="referralSource" {...register("referralSource")}>
              <option value="">Select one</option>
              {REFERRAL_SOURCES.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </FormSelect>
            <FieldError id="ref" message={errors.referralSource?.message} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="additionalNotes">Anything else for admissions? (optional)</Label>
            <Textarea id="additionalNotes" rows={3} {...register("additionalNotes")} />
          </div>
        </div>
      )}

      {currentStep.id === "review" && (
        <div className="space-y-5">
          <ul className="divide-y divide-gray-100 rounded-xl border border-gray-200 bg-white">
            {reviewSummary.map((row) => (
              <li key={row.label} className="flex flex-col gap-0.5 px-4 py-3 sm:flex-row sm:justify-between">
                <span className="text-xs font-medium uppercase tracking-wide text-gray-400">
                  {row.label}
                </span>
                <span className="text-sm font-medium text-gray-900">{row.value}</span>
              </li>
            ))}
          </ul>
          <label className="flex cursor-pointer items-start gap-3 rounded-lg border border-gray-200 p-4">
            <input
              type="checkbox"
              className="mt-1 h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-600"
              checked={values.popiaConsent}
              onChange={(e) => setValue("popiaConsent", e.target.checked, { shouldValidate: true })}
            />
            <span className="text-xs leading-relaxed text-gray-600">
              I consent to <strong>{SCHOOL_INFO.shortName}</strong> processing this application to
              assess enrolment, under POPIA. Information is kept confidential and used only for school
              administration.
            </span>
          </label>
          <FieldError id="popia" message={errors.popiaConsent?.message} />
          <label className="flex cursor-pointer items-start gap-3 rounded-lg border border-gray-200 p-4">
            <input
              type="checkbox"
              className="mt-1 h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-600"
              checked={values.declarationAccurate}
              onChange={(e) =>
                setValue("declarationAccurate", e.target.checked, { shouldValidate: true })
              }
            />
            <span className="text-xs leading-relaxed text-gray-600">
              I declare that the information provided is true and complete to the best of my
              knowledge.
            </span>
          </label>
          <FieldError id="decl" message={errors.declarationAccurate?.message} />
          <p className="text-xs text-gray-500">
            Submitting sends your application securely to{" "}
            <a href={`mailto:${inbox}`} className="font-medium text-primary-700 underline">
              {inbox}
            </a>{" "}
            as a professional PDF (same layout as the downloadable form). You will receive a
            reference number on screen. Supporting documents (birth certificate, school report,
            transfer letter) can be brought to the school office or emailed separately with your
            reference.
          </p>
        </div>
      )}

      <div className="flex flex-wrap items-center justify-between gap-3 border-t border-gray-100 pt-6">
        <Button
          type="button"
          variant="outline"
          onClick={goBack}
          disabled={stepIndex === 0 || isSubmitting}
          className="gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </Button>
        {currentStep.id !== "review" ? (
          <Button type="button" onClick={goNext} className="gap-2 bg-primary-600 hover:bg-primary-700">
            Continue
            <ArrowRight className="h-4 w-4" />
          </Button>
        ) : (
          <Button
            type="submit"
            size="lg"
            disabled={isSubmitting}
            className="gap-2 bg-primary-600 hover:bg-primary-700"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Sending application…
              </>
            ) : (
              <>
                <CheckCircle2 className="h-4 w-4" />
                Submit application
              </>
            )}
          </Button>
        )}
      </div>
    </form>
  )
}

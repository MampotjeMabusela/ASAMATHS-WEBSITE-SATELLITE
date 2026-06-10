"use client"

import type { UseFormRegister } from "react-hook-form"

type HoneypotFieldProps = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  register: UseFormRegister<any>
}

/** Hidden from users; bots that fill it are rejected server-side without sending email. */
export function HoneypotField({ register }: HoneypotFieldProps) {
  return (
    <div
      className="pointer-events-none absolute left-[-9999px] top-auto h-0 w-0 overflow-hidden opacity-0"
      aria-hidden="true"
    >
      <label htmlFor="website">Website</label>
      <input
        id="website"
        type="text"
        tabIndex={-1}
        autoComplete="off"
        {...register("website")}
      />
    </div>
  )
}

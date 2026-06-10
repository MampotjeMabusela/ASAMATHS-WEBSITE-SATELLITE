import * as React from "react"
import { cn } from "@/lib/utils"

export type FormSelectProps = React.SelectHTMLAttributes<HTMLSelectElement>

export const FormSelect = React.forwardRef<HTMLSelectElement, FormSelectProps>(
  ({ className, children, ...props }, ref) => (
    <select
      ref={ref}
      className={cn(
        "flex h-11 w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm shadow-sm transition-all duration-200",
        "hover:border-gray-400",
        "focus:border-primary-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-600 focus-visible:ring-offset-2",
        "disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      {...props}
    >
      {children}
    </select>
  )
)
FormSelect.displayName = "FormSelect"

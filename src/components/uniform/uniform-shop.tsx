"use client"

import type { ReactNode } from "react"
import { UniformCartProvider } from "@/components/uniform/uniform-cart-context"
import { UniformCartFab, UniformCartPanel } from "@/components/uniform/uniform-cart-panel"

export function UniformShop({ children }: { children: ReactNode }) {
  return (
    <UniformCartProvider>
      {children}
      <UniformCartFab />
      <UniformCartPanel />
    </UniformCartProvider>
  )
}

"use client"

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react"
import {
  cartLineKey,
  cartSubtotalCents,
  createCartLine,
  type UniformCartLine,
} from "@/lib/uniform-shop"

const STORAGE_KEY = "asa-uniform-cart-v1"

type UniformCartContextValue = {
  lines: UniformCartLine[]
  itemCount: number
  subtotalCents: number
  isOpen: boolean
  setOpen: (open: boolean) => void
  addItem: (listId: string, itemId: string, size: string, quantity?: number) => boolean
  updateQuantity: (key: string, quantity: number) => void
  removeItem: (key: string) => void
  clearCart: () => void
}

const UniformCartContext = createContext<UniformCartContextValue | null>(null)

function loadStoredCart(): UniformCartLine[] {
  if (typeof window === "undefined") return []
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw) as UniformCartLine[]
    if (!Array.isArray(parsed)) return []
    return parsed.filter(
      (line) =>
        line &&
        typeof line.key === "string" &&
        typeof line.quantity === "number" &&
        line.quantity > 0
    )
  } catch {
    return []
  }
}

export function UniformCartProvider({ children }: { children: ReactNode }) {
  const [lines, setLines] = useState<UniformCartLine[]>([])
  const [isOpen, setOpen] = useState(false)
  const [hydrated, setHydrated] = useState(false)

  useEffect(() => {
    setLines(loadStoredCart())
    setHydrated(true)
  }, [])

  useEffect(() => {
    if (!hydrated) return
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(lines))
    } catch {
      // ignore quota errors
    }
  }, [lines, hydrated])

  const addItem = useCallback(
    (listId: string, itemId: string, size: string, quantity = 1) => {
      const next = createCartLine(listId, itemId, size, quantity)
      if (!next) return false
      setLines((prev) => {
        const existing = prev.find((line) => line.key === next.key)
        if (existing) {
          return prev.map((line) =>
            line.key === next.key
              ? { ...line, quantity: Math.min(99, line.quantity + next.quantity) }
              : line
          )
        }
        return [...prev, next]
      })
      setOpen(true)
      return true
    },
    []
  )

  const updateQuantity = useCallback((key: string, quantity: number) => {
    const qty = Math.floor(quantity)
    setLines((prev) => {
      if (qty <= 0) return prev.filter((line) => line.key !== key)
      return prev.map((line) =>
        line.key === key ? { ...line, quantity: Math.min(99, qty) } : line
      )
    })
  }, [])

  const removeItem = useCallback((key: string) => {
    setLines((prev) => prev.filter((line) => line.key !== key))
  }, [])

  const clearCart = useCallback(() => setLines([]), [])

  const value = useMemo<UniformCartContextValue>(
    () => ({
      lines,
      itemCount: lines.reduce((sum, line) => sum + line.quantity, 0),
      subtotalCents: cartSubtotalCents(lines),
      isOpen,
      setOpen,
      addItem,
      updateQuantity,
      removeItem,
      clearCart,
    }),
    [lines, isOpen, addItem, updateQuantity, removeItem, clearCart]
  )

  return <UniformCartContext.Provider value={value}>{children}</UniformCartContext.Provider>
}

export function useUniformCart() {
  const ctx = useContext(UniformCartContext)
  if (!ctx) {
    throw new Error("useUniformCart must be used within UniformCartProvider")
  }
  return ctx
}

export { cartLineKey }

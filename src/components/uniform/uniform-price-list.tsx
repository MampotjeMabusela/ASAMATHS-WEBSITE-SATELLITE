"use client"

import { useState } from "react"
import { GraduationCap, ShoppingBag, Shirt } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { FormSelect } from "@/components/forms/form-select"
import { TEMPORARY_VISIBILITY } from "@/lib/feature-flags"
import type { UniformPriceItem, UniformPriceList } from "@/lib/uniform-catalog"
import { sizesForUniformItem } from "@/lib/uniform-shop"
import { UniformItemImages } from "@/components/uniform/uniform-item-images"
import { useUniformCart } from "@/components/uniform/uniform-cart-context"
import { cn } from "@/lib/utils"

function shouldShowItemImages(item: UniformPriceItem): boolean {
  if (!item.images?.length) return false
  if (item.showImages) return true
  return TEMPORARY_VISIBILITY.uniformCatalogImages
}

function UniformProductCard({
  item,
  index,
  listId,
}: {
  item: UniformPriceItem
  index: number
  listId: string
}) {
  const showImages = shouldShowItemImages(item)
  const sizes = sizesForUniformItem(item.id)
  const [size, setSize] = useState(sizes[0] ?? "One size")
  const [qty, setQty] = useState(1)
  const [justAdded, setJustAdded] = useState(false)
  const { addItem } = useUniformCart()

  const onAdd = () => {
    const ok = addItem(listId, item.id, size, qty)
    if (ok) {
      setJustAdded(true)
      window.setTimeout(() => setJustAdded(false), 1200)
    }
  }

  return (
    <article
      className={cn(
        "group flex h-full flex-col overflow-hidden rounded-2xl border border-primary-100/80 bg-white shadow-sm ring-1 ring-primary-950/5 transition duration-300",
        "hover:-translate-y-0.5 hover:border-primary-200 hover:shadow-lg hover:shadow-primary-900/10"
      )}
    >
      <div className="relative border-b border-primary-50 bg-gradient-to-b from-primary-50/80 via-white to-white">
        <span className="absolute left-3 top-3 z-10 inline-flex h-7 min-w-7 items-center justify-center rounded-full bg-primary-900/90 px-2 text-[0.65rem] font-semibold tabular-nums tracking-wide text-white shadow-sm">
          {String(index + 1).padStart(2, "0")}
        </span>
        {showImages ? (
          <UniformItemImages images={item.images!} itemName={item.name} variant="card" />
        ) : (
          <div className="flex aspect-[5/4] items-center justify-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary-100 text-primary-700">
              <Shirt className="h-8 w-8" aria-hidden />
            </div>
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-2.5 p-3 sm:p-3.5">
        <div className="space-y-1.5">
          <h3 className="font-display text-sm font-semibold leading-snug text-primary-950 sm:text-[0.95rem]">
            {item.name}
          </h3>
          {item.paymentUrl ? (
            <a
              href={item.paymentUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex w-full items-center justify-between gap-2 rounded-lg bg-primary-800 px-3 py-2 font-display text-sm font-bold tabular-nums text-white shadow-sm ring-1 ring-primary-900/20 transition hover:bg-primary-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2"
              aria-label={`Pay ${item.price} for ${item.name} securely via Yoco`}
              title="Pay now with card or bank account via Yoco"
            >
              <span>{item.price}</span>
              <span className="text-[0.65rem] font-semibold uppercase tracking-[0.14em] text-primary-100">
                Pay now
              </span>
            </a>
          ) : (
            <p className="inline-flex items-center rounded-md bg-primary-50 px-2 py-0.5 font-display text-sm font-bold tabular-nums text-primary-900 ring-1 ring-primary-100">
              {item.price}
            </p>
          )}
        </div>

        <div className="mt-auto grid grid-cols-[1fr_auto] gap-2">
          <label className="min-w-0 space-y-1 text-xs text-gray-600">
            <span className="block font-medium text-gray-700">Size</span>
            <FormSelect
              className="h-9 w-full px-2 text-xs"
              value={size}
              onChange={(e) => setSize(e.target.value)}
              aria-label={`Size for ${item.name}`}
            >
              {sizes.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </FormSelect>
          </label>
          <label className="space-y-1 text-xs text-gray-600">
            <span className="block font-medium text-gray-700">Qty</span>
            <FormSelect
              className="h-9 w-[4.25rem] px-2 text-xs"
              value={String(qty)}
              onChange={(e) => setQty(Number(e.target.value))}
              aria-label={`Quantity for ${item.name}`}
            >
              {Array.from({ length: 10 }, (_, i) => i + 1).map((n) => (
                <option key={n} value={n}>
                  {n}
                </option>
              ))}
            </FormSelect>
          </label>
        </div>

        <Button
          type="button"
          size="sm"
          className={cn(
            "h-10 w-full gap-1.5 bg-primary-800 hover:bg-primary-700",
            justAdded && "bg-emerald-700 hover:bg-emerald-700"
          )}
          onClick={onAdd}
        >
          <ShoppingBag className="h-3.5 w-3.5" aria-hidden />
          {justAdded ? "Added" : "Add to cart"}
        </Button>
      </div>
    </article>
  )
}

export function UniformPriceListSection({ list }: { list: UniformPriceList }) {
  return (
    <Card className="overflow-hidden border-primary-100/90 bg-gradient-to-b from-white to-primary-50/30 shadow-md ring-1 ring-primary-950/5">
      <CardHeader className="relative overflow-hidden border-b border-primary-800/20 bg-gradient-to-r from-primary-950 via-primary-900 to-primary-800 px-4 py-6 text-center text-white sm:px-6 sm:py-7">
        <div
          className="pointer-events-none absolute inset-0 opacity-30"
          style={{
            backgroundImage:
              "radial-gradient(circle at 20% 20%, rgba(255,255,255,0.18), transparent 40%), radial-gradient(circle at 80% 0%, rgba(255,255,255,0.12), transparent 35%)",
          }}
          aria-hidden
        />
        <p className="relative text-[0.65rem] font-semibold uppercase tracking-[0.22em] text-primary-200/90 sm:text-xs">
          Official price list · shop online
        </p>
        <CardTitle className="relative mt-1.5 font-display text-2xl font-bold tracking-tight sm:text-3xl">
          {list.subtitle}
        </CardTitle>
        <p className="relative mt-2 inline-flex items-center justify-center gap-1.5 text-sm font-medium text-primary-100">
          <GraduationCap className="h-4 w-4 shrink-0" aria-hidden />
          {list.grades}
        </p>
      </CardHeader>

      <CardContent className="p-4 sm:p-5 lg:p-6">
        <ul
          className="grid grid-cols-1 gap-3.5 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 sm:gap-4"
          aria-label={`${list.title} for ${list.grades}`}
        >
          {list.items.map((item, index) => (
            <li key={item.id} className="min-w-0">
              <UniformProductCard item={item} index={index} listId={list.id} />
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  )
}

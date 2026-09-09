import { GraduationCap } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { TEMPORARY_VISIBILITY } from "@/lib/feature-flags"
import type { UniformPriceItem, UniformPriceList } from "@/lib/uniform-catalog"
import { UniformItemImages } from "@/components/uniform/uniform-item-images"
import { cn } from "@/lib/utils"

function shouldShowItemImages(item: UniformPriceItem): boolean {
  if (!item.images?.length) return false
  if (item.showImages) return true
  return TEMPORARY_VISIBILITY.uniformCatalogImages
}

function UniformPriceRow({ item, index }: { item: UniformPriceItem; index: number }) {
  const showImages = shouldShowItemImages(item)

  return (
    <tr
      className={cn(
        "border-b border-gray-100 transition-colors last:border-b-0 hover:bg-primary-50/40",
        index % 2 === 1 && "bg-gray-50/60"
      )}
    >
      <td className="w-[1%] whitespace-nowrap px-3 py-3 align-middle text-center text-xs font-semibold tabular-nums text-gray-400 sm:px-4 sm:text-sm">
        {String(index + 1).padStart(2, "0")}
      </td>
      <td className="px-3 py-3 align-middle sm:px-4 sm:py-3.5">
        <div className={cn("flex flex-col gap-3", showImages && "sm:flex-row sm:items-center sm:gap-4")}>
          {showImages ? (
            <UniformItemImages images={item.images!} itemName={item.name} variant="compact" />
          ) : null}
          <p className="font-medium leading-snug text-gray-900 sm:text-[0.9375rem]">{item.name}</p>
        </div>
      </td>
      <td className="whitespace-nowrap px-3 py-3 text-right align-middle sm:px-4 sm:py-3.5">
        <span className="inline-block min-w-[5.5rem] rounded-md bg-primary-50 px-2.5 py-1 font-display text-sm font-bold tabular-nums text-primary-900 sm:min-w-[6rem] sm:px-3 sm:text-base">
          {item.price}
        </span>
      </td>
    </tr>
  )
}

export function UniformPriceListSection({ list }: { list: UniformPriceList }) {
  return (
    <Card className="overflow-hidden border-gray-200 shadow-md ring-1 ring-gray-100">
      <CardHeader className="border-b border-primary-800/20 bg-gradient-to-r from-primary-950 via-primary-900 to-primary-800 px-4 py-5 text-center text-white sm:px-6">
        <p className="text-[0.65rem] font-semibold uppercase tracking-[0.22em] text-primary-200/90 sm:text-xs">
          Official price list
        </p>
        <CardTitle className="mt-1 font-display text-xl font-bold tracking-tight sm:text-2xl">
          {list.subtitle}
        </CardTitle>
        <p className="mt-2 inline-flex items-center justify-center gap-1.5 text-sm font-medium text-primary-100">
          <GraduationCap className="h-4 w-4 shrink-0" aria-hidden />
          {list.grades}
        </p>
      </CardHeader>
      <CardContent className="overflow-x-auto p-0">
        <table className="w-full min-w-[20rem] border-collapse text-left">
          <caption className="sr-only">
            {list.title} for {list.grades}
          </caption>
          <thead>
            <tr className="border-b border-gray-200 bg-gray-100/90">
              <th
                scope="col"
                className="px-3 py-3 text-center text-[0.65rem] font-semibold uppercase tracking-wider text-gray-500 sm:px-4 sm:text-xs"
              >
                #
              </th>
              <th
                scope="col"
                className="px-3 py-3 text-[0.65rem] font-semibold uppercase tracking-wider text-gray-600 sm:px-4 sm:text-xs"
              >
                Uniform item
              </th>
              <th
                scope="col"
                className="px-3 py-3 text-right text-[0.65rem] font-semibold uppercase tracking-wider text-gray-600 sm:px-4 sm:text-xs"
              >
                Price (ZAR)
              </th>
            </tr>
          </thead>
          <tbody>
            {list.items.map((item, index) => (
              <UniformPriceRow key={item.id} item={item} index={index} />
            ))}
          </tbody>
        </table>
      </CardContent>
    </Card>
  )
}

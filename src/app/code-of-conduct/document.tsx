import { CodeOfConductPartA } from "./document-part-a"
import { CodeOfConductPartB } from "./document-part-b"
import { CodeOfConductPartC } from "./document-part-c"
import { CodeOfConductPartD } from "./document-part-d"
import { CodeOfConductPartE } from "./document-part-e"

export function CodeOfConductDocument() {
  return (
    <article className="space-y-10 rounded-xl border border-gray-200 bg-white/90 p-5 shadow-sm md:p-6">
      <CodeOfConductPartA />
      <CodeOfConductPartB />
      <CodeOfConductPartC />
      <CodeOfConductPartD />
      <CodeOfConductPartE />
    </article>
  )
}

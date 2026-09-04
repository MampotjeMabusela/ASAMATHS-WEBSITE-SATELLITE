/**
 * Enhance individual uniform product images for the catalog page.
 * Usage: node scripts/optimize-uniform-images.mjs
 */
import fs from "node:fs"
import path from "node:path"
import { fileURLToPath } from "node:url"
import sharp from "sharp"

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const root = path.resolve(__dirname, "..")
const sourcesDir = path.join(root, "scripts", "_uniform-sources")
const outDir = path.join(root, "public", "images", "uniform", "items")

const ITEMS = [
  { id: "shirt-long-sleeve", file: "shirt-long-sleeve.jpg" },
  { id: "shirt-short-sleeve", file: "shirt-short-sleeve.jpg" },
  { id: "sports-tshirt", file: "sports-tshirt.jpg" },
  { id: "jersey-red-stripes", file: "jersey-red-stripes.jpg" },
  { id: "pullover-red-stripes", file: "pullover-red-stripes.jpg" },
  { id: "summer-tracksuit", file: "summer-tracksuit.jpg" },
  { id: "winter-tracksuit", file: "winter-tracksuit.jpg" },
  { id: "blazer", file: "blazer.jpg" },
  { id: "red-drimac", file: "red-drimac.jpg" },
  { id: "gray-red-tie-striped", file: "gray-red-tie-striped.jpg" },
  { id: "gray-red-tie-stripe", file: "gray-red-tie-stripe.jpg" },
  { id: "gray-red-socks", file: "gray-red-socks.jpg" },
  { id: "sun-hat", file: "sun-hat.jpg" },
  { id: "winter-woollen-hat", file: "winter-woollen-hat.jpg" },
  { id: "gray-skirt", file: "gray-skirt.jpg" },
  { id: "sports-white-shorts", file: "sports-white-shorts.jpg" },
  { id: "tunic", file: "tunic.jpg" },
  { id: "girls-skirt", file: "girls-skirt.png" },
  { id: "boys-pants", file: "boys-pants.png" },
  { id: "girls-jersey", file: "girls-jersey.png" },
  { id: "boys-jersey", file: "boys-jersey.png" },
  { id: "school-tie", file: "school-tie.png" },
  { id: "school-socks", file: "school-socks.png" },
  { id: "grey-trousers", file: "grey-trousers.png" },
  { id: "golf-tshirt", file: "golf-tshirt.png" },
  { id: "track-suit", file: "track-suit.png" },
]

const TARGET_WIDTH = 1200

async function enhanceUniformImage(inputPath, outputPath) {
  const tmp = `${outputPath}.tmp`
  const meta = await sharp(inputPath).metadata()
  const width = meta.width ?? 0

  let pipeline = sharp(inputPath, { failOn: "none" })
    .rotate()
    .trim({ threshold: 12 })
    .flatten({ background: "#ffffff" })

  if (width > 0 && width < TARGET_WIDTH) {
    pipeline = pipeline.resize({
      width: TARGET_WIDTH,
      withoutEnlargement: false,
      fit: "inside",
      kernel: sharp.kernel.lanczos3,
    })
  } else if (width > TARGET_WIDTH) {
    pipeline = pipeline.resize({
      width: TARGET_WIDTH,
      withoutEnlargement: true,
      fit: "inside",
      kernel: sharp.kernel.lanczos3,
    })
  }

  await pipeline
    .normalize()
    .sharpen({ sigma: 1.1, m1: 0.6, m2: 2.8, x1: 2, y2: 10, y3: 20 })
    .png({ compressionLevel: 8, effort: 10, palette: false })
    .toFile(tmp)

  fs.renameSync(tmp, outputPath)
  const out = await sharp(outputPath).metadata()
  const kb = Math.round(fs.statSync(outputPath).size / 1024)
  return { from: `${meta.width}x${meta.height}`, to: `${out.width}x${out.height}`, kb }
}

fs.mkdirSync(outDir, { recursive: true })

async function main() {
  console.log("Enhancing uniform item images...\n")
  for (const item of ITEMS) {
    const input = path.join(sourcesDir, item.file)
    if (!fs.existsSync(input)) throw new Error(`Missing source: ${input}`)
    const output = path.join(outDir, `${item.id}.png`)
    const result = await enhanceUniformImage(input, output)
    console.log(`${item.id}: ${result.from} → ${result.to} (${result.kb} KB)`)
  }

  const catalogInput = path.join(sourcesDir, "uniform-catalog.png")
  if (fs.existsSync(catalogInput)) {
    const catalogOut = path.join(root, "public", "images", "uniform", "uniform-catalog.png")
    const result = await enhanceUniformImage(catalogInput, catalogOut)
    console.log(`uniform-catalog: ${result.from} → ${result.to} (${result.kb} KB)`)
  }

  console.log("\nDone.")
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})

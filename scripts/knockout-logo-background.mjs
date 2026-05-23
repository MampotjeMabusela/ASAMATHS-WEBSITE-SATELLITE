/**
 * Removes near-white pixels from the official crest so it sits cleanly on any background.
 * Usage: node scripts/knockout-logo-background.mjs
 */
import path from "node:path"
import { fileURLToPath } from "node:url"
import sharp from "sharp"

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const logoPath = path.join(__dirname, "..", "public", "images", "logo-official.png")
const WHITE_THRESHOLD = 245

const { data, info } = await sharp(logoPath)
  .ensureAlpha()
  .raw()
  .toBuffer({ resolveWithObject: true })

for (let i = 0; i < data.length; i += 4) {
  const r = data[i]
  const g = data[i + 1]
  const b = data[i + 2]
  if (r >= WHITE_THRESHOLD && g >= WHITE_THRESHOLD && b >= WHITE_THRESHOLD) {
    data[i + 3] = 0
  } else if (r >= 230 && g >= 230 && b >= 230) {
    // Feather light edge pixels
    const avg = (r + g + b) / 3
    const alpha = Math.round(255 * (1 - (avg - 230) / (WHITE_THRESHOLD - 230)))
    data[i + 3] = Math.min(data[i + 3], Math.max(0, alpha))
  }
}

await sharp(Buffer.from(data), {
  raw: { width: info.width, height: info.height, channels: 4 },
})
  .png()
  .toFile(logoPath)

console.log("Updated", logoPath, "with transparent background")

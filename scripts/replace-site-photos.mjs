/**
 * Replace all site photos from Cursor workspace assets (May 2026 batch).
 * Keeps existing filenames, max widths, and campus colour-enhance presets.
 */
import fs from "node:fs"
import path from "node:path"
import { fileURLToPath } from "node:url"
import sharp from "sharp"

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const repoRoot = path.resolve(__dirname, "..")
const assetsDir =
  process.env.ASA_PHOTO_ASSETS ??
  path.resolve(
    __dirname,
    "../../../.cursor/projects/c-Users-mampo-Downloads-asamaths-website-satellite/assets",
  )

const STUDENT_OUT = path.join(repoRoot, "public/images/students")
const CAMPUS_OUT = path.join(repoRoot, "public/images/campus")

/** @type {{ assetSuffix: string; filename: string; maxWidth: number; allowUpscale?: boolean; enhance?: string }[]} */
const STUDENT_PHOTOS = [
  { assetSuffix: "image-d529a69b-802a-483d-8b5a-403e2408aa3a", filename: "hero-primary.png", maxWidth: 1280 },
  {
    assetSuffix: "image-1a4fd6b3-240f-4f03-9615-9c0d6e07d01e",
    filename: "classroom-energy.png",
    maxWidth: 1920,
    allowUpscale: true,
  },
  {
    assetSuffix: "image-80afc28f-45d5-4939-81af-c3bf4196f9c3",
    filename: "classroom-celebration.png",
    maxWidth: 1920,
  },
  {
    assetSuffix: "image-7566f840-9fff-458b-8cb0-2ad549d109f6",
    filename: "playground.png",
    maxWidth: 1920,
  },
  {
    assetSuffix: "image-0454cc4f-cdaa-46e9-b8b6-868ee2cb7dc5",
    filename: "student-smile.png",
    maxWidth: 1400,
  },
  {
    assetSuffix: "image-c5c1247a-8f78-49a4-adc6-84b8a6806b64",
    filename: "students-joy.png",
    maxWidth: 1920,
    allowUpscale: true,
  },
  {
    assetSuffix: "image-d228ac6e-b336-4e1c-acba-5fe1ad1b6dec",
    filename: "sports-field.png",
    maxWidth: 1920,
  },
  {
    assetSuffix: "image-dc0687f8-21c4-4e24-a4d4-3cf38bd0aa56",
    filename: "student-focus.png",
    maxWidth: 1400,
  },
  {
    assetSuffix: "image-527f6b8d-711a-4f94-9b36-6f9fb35d894a",
    filename: "student-reading.png",
    maxWidth: 1400,
  },
  {
    assetSuffix: "image-6431a899-1df4-41cc-b384-09321d3b69aa",
    filename: "foundation-sepedi.png",
    maxWidth: 1920,
    allowUpscale: true,
  },
  {
    assetSuffix: "image-d228ac6e-b336-4e1c-acba-5fe1ad1b6dec",
    filename: "science-lesson.png",
    maxWidth: 1920,
  },
  {
    assetSuffix: "image-8997a9bf-824b-484c-8f1a-b0fdbb749d88",
    filename: "student-reading-portrait.png",
    maxWidth: 1400,
  },
  {
    assetSuffix: "image-d529a69b-802a-483d-8b5a-403e2408aa3a",
    filename: "math-whiteboard-student.png",
    maxWidth: 1400,
  },
  {
    assetSuffix: "image-8997a9bf-824b-484c-8f1a-b0fdbb749d88",
    filename: "math-chalkboard-lesson.png",
    maxWidth: 1920,
  },
  {
    assetSuffix: "image-1a4fd6b3-240f-4f03-9615-9c0d6e07d01e",
    filename: "productive-collaborations.png",
    maxWidth: 1920,
    allowUpscale: true,
  },
]

/** @type {{ assetSuffix: string; filename: string; maxWidth: number; allowUpscale?: boolean; enhance?: string }[]} */
const CAMPUS_PHOTOS = [
  {
    assetSuffix: "image-0454cc4f-cdaa-46e9-b8b6-868ee2cb7dc5",
    filename: "campus-friends.png",
    maxWidth: 1600,
    allowUpscale: true,
    enhance: "warm",
  },
  {
    assetSuffix: "image-c5c1247a-8f78-49a4-adc6-84b8a6806b64",
    filename: "campus-courtyard-walk.png",
    maxWidth: 1920,
    allowUpscale: true,
    enhance: "classroom",
  },
  {
    assetSuffix: "image-ee6ddf6e-9456-481f-b59c-b827d84e5b33",
    filename: "admin-office.png",
    maxWidth: 1400,
    allowUpscale: true,
    enhance: "indoor",
  },
  {
    assetSuffix: "image-7566f840-9fff-458b-8cb0-2ad549d109f6",
    filename: "campus-building.png",
    maxWidth: 1920,
    allowUpscale: true,
    enhance: "classroom",
  },
  {
    assetSuffix: "image-1a4fd6b3-240f-4f03-9615-9c0d6e07d01e",
    filename: "classroom-group.png",
    maxWidth: 1920,
    allowUpscale: true,
    enhance: "classroom",
  },
  {
    assetSuffix: "image-6431a899-1df4-41cc-b384-09321d3b69aa",
    filename: "curriculum-playground.png",
    maxWidth: 1920,
    allowUpscale: true,
    enhance: "warm",
  },
  {
    assetSuffix: "image-dc0687f8-21c4-4e24-a4d4-3cf38bd0aa56",
    filename: "literacy-notebook.png",
    maxWidth: 1600,
    allowUpscale: true,
    enhance: "warm",
  },
]

function resolveAsset(suffix) {
  const match = fs
    .readdirSync(assetsDir)
    .find((name) => name.includes(suffix) && name.endsWith(".png"))
  if (!match) throw new Error(`Asset not found for suffix: ${suffix}`)
  return path.join(assetsDir, match)
}

function applyEnhance(pipeline, kind) {
  switch (kind) {
    case "outdoor":
      return pipeline.normalize().modulate({ brightness: 1.04, saturation: 1.1 })
    case "indoor":
      return pipeline.normalize().modulate({ brightness: 1.06, saturation: 1.04 })
    case "classroom":
      return pipeline.normalize().modulate({ brightness: 1.05, saturation: 1.08 })
    case "warm":
    default:
      return pipeline.normalize().modulate({ brightness: 1.03, saturation: 1.06 })
  }
}

async function optimizeOne(photo, outDir) {
  const { assetSuffix, filename, maxWidth, allowUpscale, enhance } = photo
  const input = resolveAsset(assetSuffix)
  const output = path.join(outDir, filename)
  const meta = await sharp(input).metadata()
  const targetWidth = Math.min(maxWidth, allowUpscale ? maxWidth : meta.width ?? maxWidth)

  let pipeline = sharp(input).rotate().resize({
    width: targetWidth,
    withoutEnlargement: !allowUpscale,
    fit: "inside",
    kernel: sharp.kernel.lanczos3,
  })

  if (enhance) pipeline = applyEnhance(pipeline, enhance)

  await pipeline
    .sharpen({ sigma: enhance ? 0.9 : 0.8, m1: 0.5, m2: 2.5, x1: 2, y2: 10, y3: 20 })
    .png({ compressionLevel: 6, effort: 10 })
    .toFile(output)

  const outMeta = await sharp(output).metadata()
  return {
    filename,
    from: `${meta.width}x${meta.height}`,
    to: `${outMeta.width}x${outMeta.height}`,
    kb: Math.round(fs.statSync(output).size / 1024),
  }
}

if (!fs.existsSync(assetsDir)) {
  console.error(`Assets directory not found: ${assetsDir}`)
  process.exit(1)
}

fs.mkdirSync(STUDENT_OUT, { recursive: true })
fs.mkdirSync(CAMPUS_OUT, { recursive: true })

console.log(`Assets: ${assetsDir}\n`)

console.log("Students:")
for (const photo of STUDENT_PHOTOS) {
  const result = await optimizeOne(photo, STUDENT_OUT)
  console.log(`  ${result.filename}: ${result.from} → ${result.to} (${result.kb} KB)`)
}

console.log("\nCampus:")
for (const photo of CAMPUS_PHOTOS) {
  const result = await optimizeOne(photo, CAMPUS_OUT)
  console.log(`  ${result.filename}: ${result.from} → ${result.to} (${result.kb} KB)`)
}

console.log("\nDone. Run: npm run enhance-photos")

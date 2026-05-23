/**
 * Process campus / page photos from Cursor workspace assets.
 */
import fs from "node:fs"
import path from "node:path"
import { fileURLToPath } from "node:url"
import sharp from "sharp"

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const assetsDir =
  process.env.ASA_PHOTO_ASSETS ??
  path.resolve(
    __dirname,
    "../../../.cursor/projects/c-Users-mampo-Downloads-asamaths-website/assets",
  )

const PHOTOS = [
  {
    assetSuffix: "image-36b17504-2fed-4f7a-aa85-542d4b53cfc7",
    filename: "campus-friends.png",
    maxWidth: 1600,
    allowUpscale: true,
    enhance: "warm",
  },
  {
    assetSuffix: "image-ca0a0446-6010-4493-8353-3f8116e83b61",
    filename: "campus-courtyard-walk.png",
    maxWidth: 1920,
    allowUpscale: true,
    enhance: "outdoor",
  },
  {
    assetSuffix: "image-5d0c2287-0cca-43f2-9003-b312784cc601",
    filename: "admin-office.png",
    maxWidth: 1400,
    allowUpscale: true,
    enhance: "indoor",
  },
  {
    assetSuffix: "image-8a91d919-c74a-44c1-a0c5-276277b7166d",
    filename: "campus-building.png",
    maxWidth: 1920,
    allowUpscale: true,
    enhance: "outdoor",
  },
  {
    assetSuffix: "image-0d017815-4b06-4252-84a0-5038f932a111",
    filename: "classroom-group.png",
    maxWidth: 1920,
    allowUpscale: true,
    enhance: "classroom",
  },
  {
    assetSuffix: "image-170d8828-83ba-4e46-8f7f-9c1070eab286",
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

  pipeline = applyEnhance(pipeline, enhance)
  await pipeline
    .sharpen({ sigma: 0.9, m1: 0.5, m2: 2.5, x1: 2, y2: 10, y3: 20 })
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

const outDir = process.argv[2]
if (!outDir) {
  console.error("Usage: node scripts/optimize-campus-photos.mjs <outDir>")
  process.exit(1)
}

fs.mkdirSync(outDir, { recursive: true })
console.log(`→ ${outDir}`)
for (const photo of PHOTOS) {
  const result = await optimizeOne(photo, outDir)
  console.log(`  ${result.filename}: ${result.from} → ${result.to} (${result.kb} KB)`)
}

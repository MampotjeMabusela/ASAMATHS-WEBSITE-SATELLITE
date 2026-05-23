/**
 * Process homepage student photos from Cursor workspace assets.
 * Sharpen + resize for web display without upscaling beyond 2× native width.
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
    assetSuffix: "image-2d1be281-01b7-42a5-a866-2ddd1462f627",
    filename: "hero-primary.png",
    maxWidth: 1280,
  },
  {
    assetSuffix: "image-30f77eaf-6900-4e3b-a239-ab08453e3d40",
    filename: "classroom-energy.png",
    maxWidth: 1920,
    allowUpscale: true,
  },
  {
    assetSuffix: "image-0df8161a-0c27-489a-adaa-878587889367",
    filename: "classroom-celebration.png",
    maxWidth: 1920,
  },
  {
    assetSuffix: "image-0e27328d-e827-4917-b7b5-d8977a3f35dc",
    filename: "playground.png",
    maxWidth: 1920,
  },
  {
    assetSuffix: "image-479bc86a-bff3-4a54-b0d9-1d8153650fea",
    filename: "student-smile.png",
    maxWidth: 1400,
  },
  {
    assetSuffix: "image-ab3e9aca-02a2-4af0-9b1c-01367d36e644",
    filename: "students-joy.png",
    maxWidth: 1920,
    allowUpscale: true,
  },
  {
    assetSuffix: "image-7ba5679b-de4c-487a-b164-b47e8c6083e1",
    filename: "sports-field.png",
    maxWidth: 1920,
  },
  {
    assetSuffix: "image-0de90114-7d61-424c-a8ff-a73340840f56",
    filename: "student-focus.png",
    maxWidth: 1400,
  },
]

function resolveAsset(suffix) {
  const match = fs
    .readdirSync(assetsDir)
    .find((name) => name.includes(suffix) && name.endsWith(".png"))
  if (!match) throw new Error(`Asset not found for suffix: ${suffix}`)
  return path.join(assetsDir, match)
}

async function optimizeOne({ assetSuffix, filename, maxWidth, allowUpscale }, outDir) {
  const input = resolveAsset(assetSuffix)
  const output = path.join(outDir, filename)
  const meta = await sharp(input).metadata()
  const targetWidth = Math.min(
    maxWidth,
    allowUpscale ? maxWidth : meta.width ?? maxWidth,
  )

  await sharp(input)
    .rotate()
    .resize({
      width: targetWidth,
      withoutEnlargement: !allowUpscale,
      fit: "inside",
      kernel: sharp.kernel.lanczos3,
    })
    .sharpen({ sigma: 0.8, m1: 0.5, m2: 2.5, x1: 2, y2: 10, y3: 20 })
    .png({ compressionLevel: 6, effort: 10 })
    .toFile(output)

  const outMeta = await sharp(output).metadata()
  const bytes = fs.statSync(output).size
  return {
    filename,
    from: `${meta.width}x${meta.height}`,
    to: `${outMeta.width}x${outMeta.height}`,
    kb: Math.round(bytes / 1024),
  }
}

const outputDirs = process.argv.slice(2)
if (outputDirs.length === 0) {
  console.error("Usage: node scripts/optimize-home-photos.mjs <outDir> [outDir2...]")
  process.exit(1)
}

for (const dir of outputDirs) {
  fs.mkdirSync(dir, { recursive: true })
  console.log(`\n→ ${dir}`)
  for (const photo of PHOTOS) {
    const result = await optimizeOne(photo, dir)
    console.log(`  ${result.filename}: ${result.from} → ${result.to} (${result.kb} KB)`)
  }
}

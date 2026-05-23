/**
 * Upscale + sharpen all site images to ~4K without colour grading.
 * No normalize/modulate — preserves original colour.
 *
 * Usage: node scripts/enhance-all-images.mjs [rootDir]
 */
import fs from "node:fs"
import path from "node:path"
import { fileURLToPath } from "node:url"
import sharp from "sharp"

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const rootDir = path.resolve(__dirname, "..", process.argv[2] ?? "public/images")
const TARGET_WIDTH = 3840

const IMAGE_EXT = /\.(png|jpe?g|webp)$/i

function collectImages(dir, acc = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name)
    if (entry.isDirectory()) collectImages(full, acc)
    else if (IMAGE_EXT.test(entry.name)) acc.push(full)
  }
  return acc
}

async function enhanceFile(filePath) {
  const tmp = `${filePath}.enhance-tmp`
  const meta = await sharp(filePath).metadata()
  const width = meta.width ?? 0
  const height = meta.height ?? 0

  let pipeline = sharp(filePath, { failOn: "none" }).rotate()

  if (width > 0 && width < TARGET_WIDTH) {
    pipeline = pipeline.resize({
      width: TARGET_WIDTH,
      withoutEnlargement: false,
      fit: "inside",
      kernel: sharp.kernel.lanczos3,
    })
  }

  pipeline = pipeline.sharpen({
    sigma: 0.85,
    m1: 0.5,
    m2: 2.4,
    x1: 2,
    y2: 10,
    y3: 20,
  })

  const ext = path.extname(filePath).toLowerCase()
  if (ext === ".jpg" || ext === ".jpeg") {
    await pipeline.jpeg({ quality: 92, mozjpeg: true, chromaSubsampling: "4:4:4" }).toFile(tmp)
  } else if (ext === ".webp") {
    await pipeline.webp({ quality: 92, effort: 6 }).toFile(tmp)
  } else {
    await pipeline.png({ compressionLevel: 6, effort: 10, palette: false }).toFile(tmp)
  }

  fs.renameSync(tmp, filePath)
  const out = await sharp(filePath).metadata()
  const kb = Math.round(fs.statSync(filePath).size / 1024)
  return {
    file: path.relative(rootDir, filePath),
    from: `${width}x${height}`,
    to: `${out.width}x${out.height}`,
    kb,
  }
}

const files = collectImages(rootDir)
if (files.length === 0) {
  console.error(`No images under ${rootDir}`)
  process.exit(1)
}

console.log(`Enhancing ${files.length} images → max width ${TARGET_WIDTH}px (colour preserved)\n`)
const results = []
for (const file of files) {
  try {
    const result = await enhanceFile(file)
    results.push(result)
    console.log(`  ✓ ${result.file}: ${result.from} → ${result.to} (${result.kb} KB)`)
  } catch (err) {
    console.error(`  ✗ ${file}:`, err.message)
    process.exitCode = 1
  }
}

const totalKb = results.reduce((s, r) => s + r.kb, 0)
console.log(`\nDone: ${results.length} files, ~${Math.round(totalKb / 1024)} MB total`)

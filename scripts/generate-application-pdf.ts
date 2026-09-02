/**
 * Writes a static copy of the admission PDF to public/downloads/
 * Run: npm run generate-application-pdf
 */
import fs from "fs"
import path from "path"
import { APPLICATION_PDF_FILENAME, buildApplicationPdf } from "../src/lib/application-pdf"

const outDir = path.join(process.cwd(), "public", "downloads")
const outFile = path.join(outDir, APPLICATION_PDF_FILENAME)

fs.mkdirSync(outDir, { recursive: true })
fs.writeFileSync(outFile, buildApplicationPdf())
console.log("Wrote", outFile)

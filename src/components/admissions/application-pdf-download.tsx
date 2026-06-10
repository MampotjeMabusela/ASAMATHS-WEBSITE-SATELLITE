import Link from "next/link"
import { Download, FileText, Printer } from "lucide-react"
import { Button } from "@/components/ui/button"
import { SCHOOL_INFO } from "@/lib/constants"
import { APPLICATION_PDF_FILENAME } from "@/lib/application-pdf"

const PDF_API = "/api/application/pdf"
const PDF_STATIC = "/downloads/Asamaths-Admission-Application-Form.pdf"

export function ApplicationPdfDownload() {
  return (
    <div
      id="asa-print-application"
      className="scroll-mt-28 rounded-2xl border border-gray-200 bg-gradient-to-br from-gray-50 to-white p-6 shadow-md sm:p-8"
    >
      <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
        <div className="max-w-xl">
          <p className="text-xs font-semibold uppercase tracking-wider text-primary-600">
            Printable form
          </p>
          <h2 className="mt-2 font-display text-2xl font-bold text-gray-900">
            Download PDF application
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-gray-600">
            Prefer paper? Download our official admission form with the school crest, full contact
            details, and every section needed for enrolment. Print, complete in block letters, attach
            documents, and return to the office or email{" "}
            <a
              href={`mailto:${SCHOOL_INFO.email}`}
              className="font-medium text-primary-700 underline decoration-primary-700/35"
            >
              {SCHOOL_INFO.email}
            </a>
            .
          </p>
          <ul className="mt-4 space-y-1.5 text-sm text-gray-600">
            <li className="flex items-start gap-2">
              <FileText className="mt-0.5 h-4 w-4 shrink-0 text-primary-600" aria-hidden />
              Includes logo, address, phone, WhatsApp, email, and office hours
            </li>
            <li className="flex items-start gap-2">
              <FileText className="mt-0.5 h-4 w-4 shrink-0 text-primary-600" aria-hidden />
              Matches the online application sections (guardian, learner, medical, documents)
            </li>
          </ul>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row lg:flex-col lg:min-w-[220px]">
          <a href={PDF_API} download={APPLICATION_PDF_FILENAME} className="inline-flex">
            <Button size="lg" className="w-full gap-2 bg-primary-600 text-white hover:bg-primary-700">
              <Download className="h-5 w-5" aria-hidden />
              Download PDF
            </Button>
          </a>
          <a
            href={PDF_STATIC}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex sm:flex-1 lg:flex-none"
          >
            <Button size="lg" variant="outline" className="w-full gap-2 border-primary-200">
              <Printer className="h-5 w-5" aria-hidden />
              Open to print
            </Button>
          </a>
          <Link href="#asa-apply-online" className="text-center text-sm font-medium text-primary-700 hover:underline">
            Or apply online instead →
          </Link>
        </div>
      </div>
    </div>
  )
}

"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { Home, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function NotFound() {
  const router = useRouter()

  return (
    <div className="flex min-h-[80vh] flex-col items-center justify-center px-4 pt-20 text-center">
      <h1 className="font-display text-7xl font-extrabold text-primary-600 sm:text-9xl">404</h1>
      <h2 className="mt-4 text-2xl font-semibold text-gray-900 sm:text-3xl">Page Not Found</h2>
      <p className="mt-3 max-w-md text-gray-500">
        The page you are looking for might have been removed, had its name changed, or is temporarily
        unavailable.
      </p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Link href="/">
          <Button size="lg">
            <Home className="mr-2 h-5 w-5" />
            Go Home
          </Button>
        </Link>
        <Button variant="outline" size="lg" type="button" onClick={() => router.back()}>
          <ArrowLeft className="mr-2 h-5 w-5" />
          Go Back
        </Button>
      </div>
    </div>
  )
}

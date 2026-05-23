import { ExternalLink, MapPin } from "lucide-react"
import { SCHOOL_INFO } from "@/lib/constants"

function osmEmbedSrc(lat: number, lng: number): string {
  const pad = 0.012
  const bbox = `${lng - pad},${lat - pad},${lng + pad},${lat + pad}`
  return `https://www.openstreetmap.org/export/embed.html?${new URLSearchParams({
    bbox,
    layer: "mapnik",
    marker: `${lat},${lng}`,
  }).toString()}`
}

/** Requires `NEXT_PUBLIC_GOOGLE_MAPS_EMBED_API_KEY` (Maps Embed API). `q` uses the full postal address. */
function googleEmbedSrc(apiKey: string): string {
  const q = encodeURIComponent(SCHOOL_INFO.address)
  const key = encodeURIComponent(apiKey)
  return `https://www.google.com/maps/embed/v1/place?key=${key}&q=${q}`
}

export function GoogleMap() {
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_EMBED_API_KEY?.trim()
  const iframeSrc = apiKey
    ? googleEmbedSrc(apiKey)
    : osmEmbedSrc(SCHOOL_INFO.coordinates.lat, SCHOOL_INFO.coordinates.lng)

  return (
    <div className="space-y-3">
      <div className="flex items-start gap-2 rounded-lg border border-primary-100 bg-primary-50/90 px-4 py-3 text-left text-sm text-gray-900">
        <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-primary-600" aria-hidden />
        <span className="font-medium leading-snug">{SCHOOL_INFO.address}</span>
      </div>
      <div className="overflow-hidden rounded-2xl border border-gray-200 shadow-md">
        <iframe
          src={iframeSrc}
          width="100%"
          height="400"
          style={{ border: 0 }}
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          title="School location map"
          className="block"
        />
      </div>
      {!apiKey ? (
        <p className="text-center text-xs text-gray-600">
          Embedded map uses OpenStreetMap at the mapped 7th Road area. For the exact property, use{" "}
          <strong>Open in Google Maps</strong> below (same address as above).
        </p>
      ) : null}
      {!apiKey ? (
        <p className="text-center text-xs text-gray-500">
          Map data:{" "}
          <a
            href="https://www.openstreetmap.org/copyright"
            target="_blank"
            rel="noopener noreferrer"
            className="underline hover:text-gray-700"
          >
            © OpenStreetMap contributors
          </a>
        </p>
      ) : null}
      <p className="text-center text-sm text-gray-600">
        <a
          href={SCHOOL_INFO.googleMapsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 font-medium text-primary-600 underline underline-offset-2 hover:text-primary-800"
        >
          Open in Google Maps
          <ExternalLink className="h-3.5 w-3.5 shrink-0" aria-hidden />
        </a>
      </p>
    </div>
  )
}

import { SCHOOL_INFO } from "@/lib/constants"

export function GoogleMap() {
  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 shadow-md">
      <iframe
        src={SCHOOL_INFO.googleMapsEmbedUrl}
        width="100%"
        height="400"
        style={{ border: 0 }}
        allowFullScreen
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        title="Asamaths Institute Location"
        className="block"
      />
    </div>
  )
}

/** Strip control characters and cap length before storage or downstream use. */
export function sanitizeText(value: string, maxLength: number): string {
  return value
    .replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, "")
    .trim()
    .slice(0, maxLength)
}

export function sanitizeEmail(value: string): string {
  return sanitizeText(value, 254).toLowerCase()
}

export function sanitizePhone(value: string): string {
  return sanitizeText(value, 20)
}

/** Reject obvious SQL/script probe strings in free-text fields (defence in depth). */
export function containsSuspiciousPayload(value: string): boolean {
  const probe = value.toLowerCase()
  const patterns = [
    /\bunion\s+select\b/,
    /\bdrop\s+table\b/,
    /\binsert\s+into\b/,
    /\bdelete\s+from\b/,
    /;\s*--/,
    /<script[\s>]/,
  ]
  return patterns.some((re) => re.test(probe))
}

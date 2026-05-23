/** Natural browser speech for Asa — voice selection and readable phrasing. */

export function stripAsaFormattingForSpeech(text: string): string {
  return text
    .replace(/\*\*([^*]+)\*\*/g, "$1")
    .replace(/\*([^*]+)\*/g, "$1")
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
    .replace(/https?:\/\/\S+/g, "")
}

export function prepareTextForSpeech(text: string): string {
  let t = stripAsaFormattingForSpeech(text)
  t = t.replace(/\u2013|\u2014/g, ", ")
  t = t.replace(/;/g, ", ")
  t = t.replace(/\bNatEmis\b/gi, "Nat Emis")
  t = t.replace(/\bGrade\s*R\b/gi, "Grade R")
  t = t.replace(/\bR\s*[-–]\s*(\d)/gi, "Grade R to $1")
  t = t.replace(/\b(\d)\s*[-–]\s*(\d)\b/g, "$1 to $2")
  t = t.replace(/\s+/g, " ")
  return t.trim()
}

function splitIntoSpeechChunks(text: string): string[] {
  const prepared = prepareTextForSpeech(text)
  if (!prepared) return []
  const chunks = prepared
    .split(/(?<=[.!?])\s+/)
    .map((s) => s.trim())
    .filter((s) => s.length > 0)
  return chunks.length > 0 ? chunks : [prepared]
}

function scoreVoice(voice: SpeechSynthesisVoice): number {
  const name = voice.name.toLowerCase()
  const lang = voice.lang.toLowerCase()
  let score = 0
  if (lang === "en-za") score += 50
  else if (lang.startsWith("en-gb")) score += 35
  else if (lang.startsWith("en")) score += 20

  if (name.includes("google") && name.includes("uk english female")) score += 40
  if (name.includes("google") && name.includes("english")) score += 25
  if (name.includes("microsoft") && (name.includes("zira") || name.includes("hazel"))) score += 30
  if (name.includes("samantha") || name.includes("karen") || name.includes("moira")) score += 28
  if (name.includes("natural") || name.includes("neural") || name.includes("premium")) score += 15
  if (voice.localService) score += 5
  return score
}

export function pickNaturalVoice(voices: SpeechSynthesisVoice[]): SpeechSynthesisVoice | null {
  if (voices.length === 0) return null
  const ranked = [...voices]
    .filter((v) => v.lang.toLowerCase().startsWith("en"))
    .sort((a, b) => scoreVoice(b) - scoreVoice(a))
  return ranked[0] ?? voices.find((v) => v.lang.startsWith("en")) ?? voices[0] ?? null
}

let voicesReady = false
let cachedVoice: SpeechSynthesisVoice | null = null

export function initAsaVoice(onReady?: () => void): void {
  if (typeof window === "undefined" || !window.speechSynthesis) return

  const refresh = () => {
    const voices = window.speechSynthesis.getVoices()
    if (voices.length > 0) {
      voicesReady = true
      cachedVoice = pickNaturalVoice(voices)
      onReady?.()
    }
  }

  refresh()
  window.speechSynthesis.addEventListener("voiceschanged", refresh)
}

function speakChunkQueue(chunks: string[], voice: SpeechSynthesisVoice | null, index: number) {
  if (index >= chunks.length) return
  const utterance = new SpeechSynthesisUtterance(chunks[index])
  utterance.lang = voice?.lang ?? "en-ZA"
  if (voice) utterance.voice = voice
  utterance.rate = 1
  utterance.pitch = 1
  utterance.volume = 1
  utterance.onend = () => speakChunkQueue(chunks, voice, index + 1)
  utterance.onerror = () => speakChunkQueue(chunks, voice, index + 1)
  window.speechSynthesis.speak(utterance)
}

export function speakNaturally(text: string, voiceOn: boolean): void {
  if (typeof window === "undefined" || !voiceOn || !window.speechSynthesis) return

  window.speechSynthesis.cancel()
  const chunks = splitIntoSpeechChunks(text)
  if (chunks.length === 0) return

  const voice =
    cachedVoice ??
    pickNaturalVoice(window.speechSynthesis.getVoices()) ??
    null

  if (!voicesReady && window.speechSynthesis.getVoices().length === 0) {
    window.speechSynthesis.addEventListener(
      "voiceschanged",
      () => {
        cachedVoice = pickNaturalVoice(window.speechSynthesis.getVoices())
        speakChunkQueue(chunks, cachedVoice, 0)
      },
      { once: true }
    )
    return
  }

  speakChunkQueue(chunks, voice, 0)
}

export function stopAsaSpeech(): void {
  if (typeof window !== "undefined" && window.speechSynthesis) {
    window.speechSynthesis.cancel()
  }
}

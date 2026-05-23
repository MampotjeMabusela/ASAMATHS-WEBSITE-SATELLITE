"use client"

import { useCallback, useEffect, useId, useMemo, useRef, useState } from "react"
import { useRouter, usePathname } from "next/navigation"
import { AnimatePresence, motion, useReducedMotion } from "framer-motion"
import {
  Bot,
  MapPin,
  MessageCircle,
  Mic,
  Send,
  Volume2,
  VolumeX,
  X,
} from "lucide-react"
import { getAsaReply } from "@/lib/asa-respond"
import { initAsaVoice, speakNaturally, stopAsaSpeech } from "@/lib/asa-voice"
import { prefersReducedMotion } from "@/lib/motion-preference"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

type ChatRole = "asa" | "user"

type Msg = {
  id: string
  role: ChatRole
  text: string
  navigateTo?: string
  linkLabel?: string
  suggestions?: string[]
}

function AsaFormattedText({ text }: { text: string }) {
  const lines = text.split("\n")
  return (
    <>
      {lines.map((line, lineIndex) => (
        <span key={lineIndex}>
          {lineIndex > 0 && <br />}
          {line.split(/(\*\*[^*]+\*\*)/g).map((part, i) => {
            if (part.startsWith("**") && part.endsWith("**")) {
              return (
                <strong key={i} className="font-semibold text-primary-800">
                  {part.slice(2, -2)}
                </strong>
              )
            }
            return <span key={i}>{part}</span>
          })}
        </span>
      ))}
    </>
  )
}

function navigateWithHash(router: ReturnType<typeof useRouter>, dest: string, currentPath: string) {
  if (/^https?:\/\//i.test(dest)) {
    window.open(dest, "_blank", "noopener,noreferrer")
    return
  }

  const hashIndex = dest.indexOf("#")
  const pathOnly = hashIndex >= 0 ? dest.slice(0, hashIndex) : dest
  const hash = hashIndex >= 0 ? dest.slice(hashIndex + 1) : ""

  const goScroll = () => {
    if (!hash) return
    window.requestAnimationFrame(() => {
      document.getElementById(hash)?.scrollIntoView({
        behavior: prefersReducedMotion() ? "auto" : "smooth",
        block: "start",
      })
    })
  }

  if (pathOnly === currentPath && hash) {
    if (window.location.hash === `#${hash}`) {
      goScroll()
      return
    }
    window.history.pushState(null, "", `${pathOnly}#${hash}`)
    goScroll()
    return
  }

  router.push(dest)
  window.setTimeout(goScroll, 400)
  window.setTimeout(goScroll, 900)
}

export function AsaChat() {
  const router = useRouter()
  const pathname = usePathname()
  const reduceMotion = useReducedMotion()
  const panelId = useId()
  const scrollRef = useRef<HTMLDivElement>(null)
  const [open, setOpen] = useState(false)
  const [input, setInput] = useState("")
  const [voiceOn, setVoiceOn] = useState(true)
  const [listening, setListening] = useState(false)
  const [lastTopicId, setLastTopicId] = useState<string | undefined>()
  const recognitionRef = useRef<{ stop(): void } | null>(null)

  const [messages, setMessages] = useState<Msg[]>(() => {
    const first = getAsaReply("hello")
    return [
      {
        id: "welcome",
        role: "asa",
        text: first.text,
        navigateTo: first.navigateTo,
        linkLabel: first.linkLabel,
        suggestions: first.suggestions,
      },
    ]
  })

  const micSupported = useMemo(() => {
    if (typeof window === "undefined") return false
    const w = window as unknown as {
      SpeechRecognition?: new () => { stop(): void; start(): void }
      webkitSpeechRecognition?: new () => { stop(): void; start(): void }
    }
    return !!(w.SpeechRecognition || w.webkitSpeechRecognition)
  }, [])

  useEffect(() => {
    initAsaVoice()
  }, [])

  useEffect(() => {
    const el = scrollRef.current
    if (!el) return
    el.scrollTop = el.scrollHeight
  }, [messages, open])

  const stopRecognition = useCallback(() => {
    try {
      recognitionRef.current?.stop()
    } catch {
      /* ignore */
    }
    recognitionRef.current = null
    setListening(false)
  }, [])

  useEffect(() => {
    return () => {
      stopRecognition()
      stopAsaSpeech()
    }
  }, [stopRecognition])

  const appendAsaReply = useCallback(
    (userText: string) => {
      const reply = getAsaReply(userText, { lastTopicId })
      if (reply.topicId) setLastTopicId(reply.topicId)

      const id = `asa-${Date.now()}`
      setMessages((prev) => [
        ...prev,
        {
          id,
          role: "asa",
          text: reply.text,
          navigateTo: reply.navigateTo,
          linkLabel: reply.linkLabel,
          suggestions: reply.suggestions,
        },
      ])
      speakNaturally(reply.text, voiceOn)
    },
    [voiceOn, lastTopicId]
  )

  const sendUserMessage = useCallback(
    (text: string) => {
      const trimmed = text.trim()
      if (!trimmed) return
      setMessages((prev) => [...prev, { id: `u-${Date.now()}`, role: "user", text: trimmed }])
      window.setTimeout(() => appendAsaReply(trimmed), 0)
    },
    [appendAsaReply]
  )

  const onSend = useCallback(() => {
    const trimmed = input.trim()
    if (!trimmed) return
    setInput("")
    sendUserMessage(trimmed)
  }, [input, sendUserMessage])

  const onSuggestion = useCallback(
    (prompt: string) => {
      sendUserMessage(prompt)
    },
    [sendUserMessage]
  )

  const toggleListen = useCallback(() => {
    if (!micSupported || typeof window === "undefined") return

    type Rec = EventTarget & {
      continuous: boolean
      interimResults: boolean
      lang: string
      start(): void
      stop(): void
      onresult: ((ev: unknown) => void) | null
      onerror: (() => void) | null
      onend: (() => void) | null
    }
    const w = window as unknown as {
      SpeechRecognition?: new () => Rec
      webkitSpeechRecognition?: new () => Rec
    }
    const Ctor = w.SpeechRecognition || w.webkitSpeechRecognition
    if (!Ctor) return

    if (listening) {
      stopRecognition()
      return
    }

    const rec = new Ctor()
    rec.continuous = false
    rec.interimResults = false
    rec.lang = "en-ZA"

    rec.onresult = (ev: unknown) => {
      const e = ev as { results: Iterable<{ 0?: { transcript: string } }> }
      const text = Array.from(e.results)
        .map((r) => r[0]?.transcript ?? "")
        .join(" ")
        .trim()
      if (text) sendUserMessage(text)
    }
    rec.onerror = () => setListening(false)
    rec.onend = () => {
      recognitionRef.current = null
      setListening(false)
    }

    recognitionRef.current = rec
    setListening(true)
    try {
      rec.start()
    } catch {
      setListening(false)
    }
  }, [micSupported, listening, stopRecognition, sendUserMessage])

  const latestAsaSuggestions = useMemo((): string[] => {
    for (let i = messages.length - 1; i >= 0; i--) {
      const msg = messages[i]
      if (msg.role === "asa" && msg.suggestions && msg.suggestions.length > 0) {
        return msg.suggestions
      }
    }
    return ["Menu", "How do I apply?", "Contact details"]
  }, [messages])

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className={cn(
          "fixed bottom-6 right-6 z-[100] flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-primary-600 to-primary-800 text-white shadow-xl ring-2 ring-white/30 transition hover:scale-105 hover:shadow-2xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-400 focus-visible:ring-offset-2",
          open && "pointer-events-none opacity-0"
        )}
        aria-haspopup="dialog"
        aria-expanded={open}
        aria-controls={panelId}
        aria-label="Open Asa assistant chat"
      >
        <Bot className="h-7 w-7" />
        <span className="absolute -right-1 -top-1 flex h-6 min-w-[1.25rem] items-center justify-center rounded-full bg-accent-400 px-1 text-[10px] font-bold text-gray-900">
          Asa
        </span>
      </button>

      <AnimatePresence>
        {open && (
          <>
            <motion.button
              type="button"
              initial={{ opacity: reduceMotion ? 1 : 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: reduceMotion ? 1 : 0 }}
              transition={reduceMotion ? { duration: 0 } : { duration: 0.2 }}
              className="fixed inset-0 z-[99] bg-black/30 backdrop-blur-[2px] md:hidden"
              aria-label="Close chat overlay"
              onClick={() => setOpen(false)}
            />

            <motion.div
              id={panelId}
              role="dialog"
              aria-modal="true"
              aria-labelledby="asa-chat-title"
              initial={{
                opacity: reduceMotion ? 1 : 0,
                y: reduceMotion ? 0 : 16,
                scale: reduceMotion ? 1 : 0.98,
              }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{
                opacity: reduceMotion ? 1 : 0,
                y: reduceMotion ? 0 : 16,
                scale: reduceMotion ? 1 : 0.98,
              }}
              transition={
                reduceMotion ? { duration: 0 } : { type: "spring", stiffness: 320, damping: 28 }
              }
              className={cn(
                "fixed bottom-24 right-6 z-[100] flex max-h-[min(72vh,560px)] w-[calc(100vw-3rem)] max-w-[400px] flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-2xl md:bottom-6"
              )}
            >
              <div className="flex items-start justify-between gap-2 bg-gradient-to-r from-primary-900 via-primary-800 to-primary-900 px-4 py-3 text-white">
                <div className="flex gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/15">
                    <MessageCircle className="h-5 w-5" />
                  </div>
                  <div>
                    <h2 id="asa-chat-title" className="font-display text-lg font-bold leading-tight">
                      Asa
                    </h2>
                    <p className="text-xs text-primary-100">School guide · voice &amp; chat</p>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => {
                      const next = !voiceOn
                      setVoiceOn(next)
                      if (!next) stopAsaSpeech()
                    }}
                    className="rounded-lg p-2 text-white/90 hover:bg-white/10"
                    title={voiceOn ? "Mute voice replies" : "Enable voice replies"}
                    aria-pressed={voiceOn}
                  >
                    {voiceOn ? <Volume2 className="h-5 w-5" /> : <VolumeX className="h-5 w-5" />}
                  </button>
                  <button
                    type="button"
                    onClick={() => setOpen(false)}
                    className="rounded-lg p-2 hover:bg-white/10"
                    aria-label="Close chat"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
              </div>

              <div ref={scrollRef} className="flex-1 overflow-y-auto bg-gray-50 px-3 py-3">
                <div className="flex flex-col gap-3">
                  {messages.map((m) => (
                    <div
                      key={m.id}
                      className={cn(
                        "max-w-[95%] rounded-2xl px-3 py-2.5 text-sm leading-relaxed shadow-sm",
                        m.role === "user"
                          ? "ml-auto bg-primary-600 text-white"
                          : "mr-auto border border-gray-100 bg-white text-gray-700"
                      )}
                    >
                      {m.role === "asa" ? <AsaFormattedText text={m.text} /> : m.text}
                      {m.role === "asa" && (m.navigateTo || m.linkLabel) && (
                        <div className="mt-2 border-t border-gray-100 pt-2">
                          <Button
                            type="button"
                            size="sm"
                            variant="outline"
                            className="gap-2 border-primary-200 hover:bg-primary-50"
                            onClick={() => {
                              if (m.navigateTo) navigateWithHash(router, m.navigateTo, pathname)
                              setOpen(false)
                            }}
                          >
                            <MapPin className="h-4 w-4" />
                            {m.linkLabel || "Take me there"}
                          </Button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <div className="border-t border-gray-200 bg-white p-3">
                <div className="mb-2 flex flex-wrap gap-1.5">
                  {latestAsaSuggestions.map((prompt) => (
                    <button
                      key={prompt}
                      type="button"
                      onClick={() => onSuggestion(prompt)}
                      className="rounded-full border border-primary-200 bg-primary-50 px-2.5 py-1 text-[11px] font-medium text-primary-800 transition hover:bg-primary-100"
                    >
                      {prompt}
                    </button>
                  ))}
                </div>
                <div className="flex gap-2">
                  {micSupported && (
                    <Button
                      type="button"
                      size="icon"
                      variant={listening ? "default" : "outline"}
                      className={cn(
                        listening && "animate-pulse bg-accent-500 text-gray-900 hover:bg-accent-500"
                      )}
                      onClick={toggleListen}
                      title="Speak your question"
                      aria-pressed={listening}
                    >
                      <Mic className="h-4 w-4" />
                    </Button>
                  )}
                  <input
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault()
                        onSend()
                      }
                    }}
                    placeholder={
                      micSupported
                        ? "Ask about admissions, fees, contact…"
                        : "Ask about admissions, fees, contact…"
                    }
                    className="min-w-0 flex-1 rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-primary-500 focus-visible:ring-2 focus-visible:ring-primary-600 focus-visible:ring-offset-2"
                    aria-label="Message to Asa"
                  />
                  <Button type="button" size="icon" onClick={onSend} aria-label="Send message">
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
                <p className="mt-2 text-[11px] text-gray-400">
                  {micSupported
                    ? "Tip: say “take me to admissions” or tap a suggestion above."
                    : "Voice replies use your browser — enable sound for a natural read-aloud."}
                </p>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}

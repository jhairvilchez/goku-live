'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { DANCES, danceForGift, type Dance, type DanceId } from '@/lib/dances'
import type { LiveEvent } from '@/lib/tikfinity'

export type Speech = { id: number; user: string; text: string }
export type Banner = { id: number; title: string; subtitle: string }
export type FeedItem = { id: number; label: string; detail: string }

type SpeechJob = { user: string; comment?: string; preset?: string }

const MAX_COMMENT_QUEUE = 4
const MAX_DANCE_QUEUE = 15
const USER_COOLDOWN_MS = 15000
const PAUSE_BETWEEN_REPLIES_MS = 700

let nextId = 1
const uid = () => nextId++

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

function readingTime(text: string) {
  return Math.min(9000, Math.max(3200, text.split(/\s+/).length * 380))
}

function speakAloud(text: string): Promise<void> {
  return new Promise((resolve) => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return resolve()
    const utterance = new SpeechSynthesisUtterance(text)
    const voices = window.speechSynthesis.getVoices()
    const spanish =
      voices.find((v) => v.lang.startsWith('es-MX')) ??
      voices.find((v) => v.lang.startsWith('es-US')) ??
      voices.find((v) => v.lang.startsWith('es'))
    if (spanish) utterance.voice = spanish
    utterance.lang = spanish?.lang ?? 'es-MX'
    utterance.rate = 1.08
    utterance.pitch = 1.25
    const safety = setTimeout(resolve, 12000)
    utterance.onend = utterance.onerror = () => {
      clearTimeout(safety)
      resolve()
    }
    window.speechSynthesis.speak(utterance)
  })
}

async function fetchReply(user: string, comment: string): Promise<string> {
  try {
    const res = await fetch('/api/reply', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ user, comment }),
    })
    const data = await res.json()
    return typeof data.reply === 'string' && data.reply ? data.reply : '¡Jeje! ¡Qué emoción!'
  } catch {
    return '¡Uy, se me fue el ki! ¿Me lo repites?'
  }
}

export function useGokuBrain({ voice }: { voice: boolean }) {
  const [dance, setDance] = useState<DanceId>('idle')
  const [ssj, setSsj] = useState(false)
  const [speech, setSpeech] = useState<Speech | null>(null)
  const [thinking, setThinking] = useState(false)
  const [banner, setBanner] = useState<Banner | null>(null)
  const [feed, setFeed] = useState<FeedItem[]>([])

  const voiceRef = useRef(voice)
  useEffect(() => {
    voiceRef.current = voice
  }, [voice])

  const speechQueue = useRef<SpeechJob[]>([])
  const speaking = useRef(false)
  const danceQueue = useRef<{ dance: Dance; title: string; subtitle: string }[]>([])
  const dancing = useRef(false)
  const lastReplyByUser = useRef(new Map<string, number>())
  const ssjTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)

  const pushFeed = useCallback((label: string, detail: string) => {
    setFeed((items) => [{ id: uid(), label, detail }, ...items].slice(0, 30))
  }, [])

  const runSpeechQueue = useCallback(async () => {
    if (speaking.current) return
    speaking.current = true
    while (speechQueue.current.length > 0) {
      const job = speechQueue.current.shift()!
      let text = job.preset
      if (!text && job.comment) {
        setThinking(true)
        text = await fetchReply(job.user, job.comment)
        setThinking(false)
      }
      if (!text) continue
      setSpeech({ id: uid(), user: job.user, text })
      await Promise.all([wait(readingTime(text)), voiceRef.current ? speakAloud(text) : null])
      setSpeech(null)
      await wait(PAUSE_BETWEEN_REPLIES_MS)
    }
    speaking.current = false
  }, [])

  const runDanceQueue = useCallback(async () => {
    if (dancing.current) return
    dancing.current = true
    while (danceQueue.current.length > 0) {
      const job = danceQueue.current.shift()!
      if (job.dance.id === 'ssj') {
        clearTimeout(ssjTimer.current)
        setSsj(true)
        ssjTimer.current = setTimeout(() => setSsj(false), 30000)
      }
      setBanner({ id: uid(), title: job.dance.name, subtitle: job.subtitle })
      setDance(job.dance.id)
      await wait(job.dance.durationMs)
      setDance('idle')
      await wait(250)
    }
    setBanner(null)
    dancing.current = false
  }, [])

  const say = useCallback(
    (job: SpeechJob, priority = false) => {
      if (priority) speechQueue.current.unshift(job)
      else speechQueue.current.push(job)
      void runSpeechQueue()
    },
    [runSpeechQueue],
  )

  const queueDance = useCallback(
    (dance: Dance, title: string, subtitle: string) => {
      if (danceQueue.current.length >= MAX_DANCE_QUEUE) return
      danceQueue.current.push({ dance, title, subtitle })
      void runDanceQueue()
    },
    [runDanceQueue],
  )

  const handleEvent = useCallback(
    (event: LiveEvent) => {
      switch (event.type) {
        case 'chat': {
          pushFeed(event.user, event.comment)
          const now = Date.now()
          const last = lastReplyByUser.current.get(event.user) ?? 0
          if (now - last < USER_COOLDOWN_MS || event.comment.length < 2) return
          lastReplyByUser.current.set(event.user, now)
          const pendingComments = speechQueue.current.filter((job) => job.comment)
          if (pendingComments.length >= MAX_COMMENT_QUEUE) {
            const oldest = speechQueue.current.findIndex((job) => job.comment)
            speechQueue.current.splice(oldest, 1)
          }
          say({ user: event.user, comment: event.comment })
          return
        }
        case 'gift': {
          const dance = danceForGift(event.giftName, event.diamonds)
          const amount = event.count > 1 ? ` x${event.count}` : ''
          pushFeed(event.user, `envió ${event.giftName}${amount}`)
          queueDance(dance, dance.name, `Gracias ${event.user} por ${event.giftName}${amount}`)
          say(
            {
              user: event.user,
              preset:
                dance.id === 'ssj'
                  ? `¡${event.user}, tu ${event.giftName} me hizo llegar al Súper Saiyajin! ¡Increíble!`
                  : `¡Gracias por ${event.giftName === 'Rose' ? 'la rosa' : `el ${event.giftName}`}, ${event.user}! ¡Mira este baile!`,
            },
            true,
          )
          return
        }
        case 'follow':
          pushFeed(event.user, 'te siguió')
          queueDance(DANCES.wave, DANCES.wave.name, `Bienvenido ${event.user}`)
          say({ user: event.user, preset: `¡${event.user}, bienvenido al equipo! ¡Entrenemos juntos!` })
          return
        case 'share':
          pushFeed(event.user, 'compartió el live')
          say({ user: event.user, preset: `¡Gracias por compartir, ${event.user}! ¡Que vengan más guerreros!` })
          return
      }
    },
    [pushFeed, queueDance, say],
  )

  useEffect(() => () => clearTimeout(ssjTimer.current), [])

  return { dance, ssj, speech, thinking, banner, feed, handleEvent }
}

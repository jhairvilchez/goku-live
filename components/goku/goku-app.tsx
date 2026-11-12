'use client'

import { useEffect, useState } from 'react'
import { useGokuBrain } from '@/hooks/use-goku-brain'
import { useTikfinity } from '@/hooks/use-tikfinity'
import { ControlPanel } from './control-panel'
import { Stage } from './stage'

export type StageBackground = 'transparent' | 'green' | 'scene'

type Props = {
  overlay: boolean
  initialVoice: boolean
  initialBackground: StageBackground
  initialWsUrl: string
}

export function GokuApp({ overlay, initialVoice, initialBackground, initialWsUrl }: Props) {
  const [voice, setVoice] = useState(initialVoice)
  const [background, setBackground] = useState<StageBackground>(initialBackground)
  const [wsUrl, setWsUrl] = useState(initialWsUrl)
  const brain = useGokuBrain({ voice })
  const status = useTikfinity(wsUrl, brain.handleEvent)

  useEffect(() => {
    if (!overlay) return
    document.documentElement.style.background = 'transparent'
    document.body.style.background = 'transparent'
  }, [overlay])

  const stage = (
    <Stage
      dance={brain.dance}
      ssj={brain.ssj}
      speech={brain.speech}
      thinking={brain.thinking}
      banner={brain.banner}
      background={background}
    />
  )

  if (overlay) {
    return <main className="h-dvh w-full [container-type:inline-size]">{stage}</main>
  }

  return (
    <main className="min-h-dvh bg-stone-950 text-stone-100">
      <header className="border-b border-stone-800 px-6 py-4">
        <h1 className="font-display text-3xl tracking-wide text-orange-400">Goku Live</h1>
        <p className="text-sm text-stone-400">
          Personaje interactivo para TikTok LIVE Studio + TikFinity
        </p>
      </header>
      <div className="mx-auto flex max-w-6xl flex-col gap-6 p-6 lg:flex-row lg:items-start">
        <section aria-label="Vista previa del overlay" className="mx-auto w-full max-w-[360px] shrink-0 lg:sticky lg:top-6">
          <div className="aspect-[9/16] overflow-hidden rounded-2xl border border-stone-800 bg-[repeating-conic-gradient(#292524_0_25%,#1c1917_0_50%)] bg-[length:24px_24px] [container-type:inline-size]">
            {stage}
          </div>
        </section>
        <ControlPanel
          status={status}
          wsUrl={wsUrl}
          onWsUrlChange={setWsUrl}
          voice={voice}
          onVoiceChange={setVoice}
          background={background}
          onBackgroundChange={setBackground}
          feed={brain.feed}
          onSimulate={brain.handleEvent}
        />
      </div>
    </main>
  )
}

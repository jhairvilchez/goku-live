import { cn } from '@/lib/utils'
import type { DanceId } from '@/lib/dances'
import type { Banner, Speech } from '@/hooks/use-goku-brain'
import { GokuCharacter } from './goku-character'
import type { StageBackground } from './goku-app'

type Props = {
  dance: DanceId
  ssj: boolean
  speech: Speech | null
  thinking: boolean
  banner: Banner | null
  background: StageBackground
  className?: string
}

export function Stage({ dance, ssj, speech, thinking, banner, background, className }: Props) {
  return (
    <div
      className={cn(
        'relative flex h-full w-full flex-col items-center justify-end overflow-hidden',
        background === 'green' && 'bg-[#00ff00]',
        background === 'scene' && 'bg-cover bg-center',
        className,
      )}
      style={background === 'scene' ? { backgroundImage: 'url(/images/stage-bg.png)' } : undefined}
    >
      <div className="absolute inset-x-0 top-[6%] flex justify-center px-4" aria-live="polite">
        {banner && (
          <div key={banner.id} className="animate-banner-pop text-center">
            <p className="font-display text-[clamp(2rem,9cqw,4.5rem)] leading-none tracking-wide text-yellow-300 [-webkit-text-stroke:3px_#1c1917] [paint-order:stroke_fill] drop-shadow-[0_4px_0_#c2410c]">
              {banner.title}
            </p>
            <p className="mt-2 inline-block rounded-full bg-stone-950/80 px-4 py-1 text-[clamp(0.85rem,3.5cqw,1.4rem)] font-semibold text-white">
              {banner.subtitle}
            </p>
          </div>
        )}
      </div>

      <div className="flex min-h-[22%] w-full items-end justify-center px-[6%]" aria-live="polite">
        {speech ? (
          <SpeechBubble key={speech.id} user={speech.user} text={speech.text} />
        ) : thinking ? (
          <div className="animate-bubble-pop mb-2 rounded-full border-4 border-stone-900 bg-white px-6 py-3">
            <span className="sr-only">Goku está pensando</span>
            <span aria-hidden className="flex gap-1.5">
              {[0, 150, 300].map((delay) => (
                <span
                  key={delay}
                  className="size-3 animate-bounce rounded-full bg-orange-500"
                  style={{ animationDelay: `${delay}ms` }}
                />
              ))}
            </span>
          </div>
        ) : null}
      </div>

      <GokuCharacter dance={dance} ssj={ssj} talking={Boolean(speech)} className="mb-[4%] h-[62%] w-auto" />
    </div>
  )
}

function SpeechBubble({ user, text }: { user: string; text: string }) {
  return (
    <div className="animate-bubble-pop relative mb-4 max-w-[92%] rounded-3xl border-4 border-stone-900 bg-white px-5 py-3 shadow-[6px_6px_0_#1c1917]">
      <p className="text-[clamp(0.75rem,3cqw,1.1rem)] font-bold uppercase tracking-wide text-orange-600">@{user}</p>
      <p className="text-pretty text-[clamp(1rem,4.6cqw,1.9rem)] font-bold leading-snug text-stone-900">{text}</p>
      <span
        aria-hidden
        className="absolute -bottom-[18px] left-1/2 size-8 -translate-x-1/2 rotate-45 border-b-4 border-r-4 border-stone-900 bg-white"
      />
    </div>
  )
}

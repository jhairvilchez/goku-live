'use client'

import { useEffect, useState, type FormEvent } from 'react'
import { Check, Copy, Gift, MessageCircle, UserPlus } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { GIFT_DANCE_TABLE, SSJ_DIAMOND_THRESHOLD } from '@/lib/dances'
import type { LiveEvent } from '@/lib/tikfinity'
import type { FeedItem } from '@/hooks/use-goku-brain'
import type { ConnectionStatus } from '@/hooks/use-tikfinity'
import type { StageBackground } from './goku-app'

type Props = {
  status: ConnectionStatus
  wsUrl: string
  onWsUrlChange: (url: string) => void
  voice: boolean
  onVoiceChange: (voice: boolean) => void
  background: StageBackground
  onBackgroundChange: (bg: StageBackground) => void
  feed: FeedItem[]
  onSimulate: (event: LiveEvent) => void
}

const STATUS_LABEL: Record<ConnectionStatus, string> = {
  connected: 'TikFinity conectado',
  connecting: 'Conectando a TikFinity…',
  disconnected: 'TikFinity desconectado',
}

const BACKGROUND_OPTIONS: { value: StageBackground; label: string }[] = [
  { value: 'transparent', label: 'Transparente' },
  { value: 'green', label: 'Pantalla verde' },
  { value: 'scene', label: 'Escenario' },
]

const TEST_GIFTS = [
  { name: 'Rose', label: 'Rosa', diamonds: 1 },
  { name: 'Finger Heart', label: 'Corazón', diamonds: 5 },
  { name: 'GG', label: 'GG', diamonds: 1 },
  { name: 'TikTok', label: 'TikTok', diamonds: 1 },
  { name: 'Ice Cream Cone', label: 'Helado', diamonds: 1 },
  { name: 'Doughnut', label: 'Dona', diamonds: 30 },
  { name: 'Perfume', label: 'Perfume', diamonds: 20 },
  { name: 'Lion', label: 'León', diamonds: 29999 },
]

export function ControlPanel(props: Props) {
  const { status, voice, onVoiceChange, background, onBackgroundChange, feed, onSimulate } = props
  const [draftUrl, setDraftUrl] = useState(props.wsUrl)
  const [testUser, setTestUser] = useState('fan_saiyajin')
  const [testComment, setTestComment] = useState('')
  const [origin, setOrigin] = useState('')
  const [copied, setCopied] = useState(false)

  useEffect(() => setOrigin(window.location.origin), [])

  const overlayParams = new URLSearchParams({ overlay: '1', bg: background === 'scene' ? 'scene' : background })
  if (voice) overlayParams.set('voice', '1')
  if (props.wsUrl !== 'ws://127.0.0.1:21213/') overlayParams.set('ws', props.wsUrl)
  const overlayUrl = `${origin}/?${overlayParams.toString()}`

  const sendComment = (e: FormEvent) => {
    e.preventDefault()
    const comment = testComment.trim()
    if (!comment) return
    onSimulate({ type: 'chat', user: testUser.trim() || 'fan_saiyajin', comment })
    setTestComment('')
  }

  const copyUrl = async () => {
    await navigator.clipboard.writeText(overlayUrl)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="flex min-w-0 flex-1 flex-col gap-6">
      <Panel title="Conexión">
        <div className="flex items-center gap-2">
          <span
            aria-hidden
            className={
              status === 'connected'
                ? 'size-2.5 rounded-full bg-emerald-400'
                : status === 'connecting'
                  ? 'size-2.5 animate-pulse rounded-full bg-amber-400'
                  : 'size-2.5 rounded-full bg-red-500'
            }
          />
          <span className="text-sm font-medium">{STATUS_LABEL[status]}</span>
        </div>
        <form
          className="flex flex-col gap-2 sm:flex-row sm:items-end"
          onSubmit={(e) => {
            e.preventDefault()
            props.onWsUrlChange(draftUrl.trim())
          }}
        >
          <div className="flex flex-1 flex-col gap-1.5">
            <Label htmlFor="ws-url">WebSocket de TikFinity</Label>
            <Input id="ws-url" value={draftUrl} onChange={(e) => setDraftUrl(e.target.value)} className="font-mono" />
          </div>
          <Button type="submit" variant="secondary">
            Reconectar
          </Button>
        </form>
        {status !== 'connected' && (
          <p className="text-sm leading-relaxed text-stone-400">
            Abre la app de escritorio de TikFinity, conéctala a tu live y activa{' '}
            <strong className="text-stone-200">Configuración → WebSocket API</strong>. Este panel debe abrirse en la
            misma computadora.
          </p>
        )}
      </Panel>

      <Panel title="Overlay para TikTok LIVE Studio">
        <div className="flex flex-wrap items-center gap-6">
          <div className="flex items-center gap-2">
            <Switch id="voice" checked={voice} onCheckedChange={onVoiceChange} />
            <Label htmlFor="voice">Voz en español (lee las respuestas)</Label>
          </div>
        </div>
        <fieldset className="flex flex-col gap-2">
          <legend className="mb-2 text-sm font-medium">Fondo</legend>
          <div className="flex flex-wrap gap-2">
            {BACKGROUND_OPTIONS.map((option) => (
              <Button
                key={option.value}
                type="button"
                size="sm"
                variant={background === option.value ? 'default' : 'outline'}
                aria-pressed={background === option.value}
                onClick={() => onBackgroundChange(option.value)}
              >
                {option.label}
              </Button>
            ))}
          </div>
        </fieldset>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="overlay-url">Enlace del overlay</Label>
          <div className="flex gap-2">
            <Input id="overlay-url" readOnly value={overlayUrl} className="font-mono text-xs" />
            <Button type="button" onClick={copyUrl} aria-label="Copiar enlace del overlay">
              {copied ? <Check aria-hidden /> : <Copy aria-hidden />}
              {copied ? 'Copiado' : 'Copiar'}
            </Button>
          </div>
        </div>
        <ol className="list-decimal space-y-1 pl-5 text-sm leading-relaxed text-stone-400">
          <li>Publica este proyecto (botón Publish) y copia el enlace del overlay.</li>
          <li>
            En TikTok LIVE Studio: <strong className="text-stone-200">Agregar fuente → Enlace</strong> y pega el
            enlace. Tamaño recomendado 1080 × 1920.
          </li>
          <li>
            Si tu versión no tiene fuente de enlace, ábrelo en el navegador con fondo verde y usa{' '}
            <strong className="text-stone-200">Captura de ventana + Croma</strong>.
          </li>
          <li>Mantén TikFinity abierto durante el live: los comentarios y regalos llegan por su WebSocket.</li>
        </ol>
      </Panel>

      <Panel title="Probar sin estar en vivo">
        <form onSubmit={sendComment} className="flex flex-col gap-2 sm:flex-row sm:items-end">
          <div className="flex flex-col gap-1.5 sm:w-40">
            <Label htmlFor="test-user">Usuario</Label>
            <Input id="test-user" value={testUser} onChange={(e) => setTestUser(e.target.value)} />
          </div>
          <div className="flex flex-1 flex-col gap-1.5">
            <Label htmlFor="test-comment">Comentario</Label>
            <Input
              id="test-comment"
              value={testComment}
              placeholder="Goku, ¿qué desayunaste hoy?"
              onChange={(e) => setTestComment(e.target.value)}
            />
          </div>
          <Button type="submit">
            <MessageCircle aria-hidden />
            Comentar
          </Button>
        </form>
        <div className="flex flex-wrap gap-2">
          {TEST_GIFTS.map((gift) => (
            <Button
              key={gift.name}
              type="button"
              variant="outline"
              size="sm"
              onClick={() =>
                onSimulate({
                  type: 'gift',
                  user: testUser.trim() || 'fan_saiyajin',
                  giftName: gift.name,
                  count: 1,
                  diamonds: gift.diamonds,
                })
              }
            >
              <Gift aria-hidden />
              {gift.label}
            </Button>
          ))}
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => onSimulate({ type: 'follow', user: testUser.trim() || 'fan_saiyajin' })}
          >
            <UserPlus aria-hidden />
            Seguir
          </Button>
        </div>
      </Panel>

      <div className="grid gap-6 md:grid-cols-2">
        <Panel title="Regalo → Baile">
          <ul className="divide-y divide-stone-800 text-sm">
            {GIFT_DANCE_TABLE.map((row) => (
              <li key={row.gift} className="flex justify-between gap-4 py-1.5">
                <span className="capitalize text-stone-300">{row.gift}</span>
                <span className="text-right font-medium text-orange-300">{row.dance}</span>
              </li>
            ))}
            <li className="flex justify-between gap-4 py-1.5">
              <span className="text-stone-300">{`Regalos de ${SSJ_DIAMOND_THRESHOLD}+ diamantes`}</span>
              <span className="text-right font-medium text-yellow-300">Súper Saiyajin</span>
            </li>
            <li className="flex justify-between gap-4 py-1.5">
              <span className="text-stone-300">Otros regalos</span>
              <span className="text-right font-medium text-orange-300">Baile aleatorio</span>
            </li>
          </ul>
        </Panel>
        <Panel title="Actividad">
          {feed.length === 0 ? (
            <p className="text-sm text-stone-500">Aquí aparecerán los comentarios y regalos.</p>
          ) : (
            <ul className="max-h-72 space-y-2 overflow-y-auto text-sm">
              {feed.map((item) => (
                <li key={item.id} className="flex gap-2">
                  <Badge variant="secondary" className="shrink-0">
                    @{item.label}
                  </Badge>
                  <span className="min-w-0 break-words text-stone-300">{item.detail}</span>
                </li>
              ))}
            </ul>
          )}
        </Panel>
      </div>
    </div>
  )
}

function Panel({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="flex flex-col gap-4 rounded-2xl border border-stone-800 bg-stone-900/60 p-5">
      <h2 className="text-base font-semibold text-stone-100">{title}</h2>
      {children}
    </section>
  )
}

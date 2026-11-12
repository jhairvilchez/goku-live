import { GokuApp, type StageBackground } from '@/components/goku/goku-app'
import { DEFAULT_WS_URL } from '@/lib/tikfinity'

const BACKGROUNDS: StageBackground[] = ['transparent', 'green', 'scene']

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>
}) {
  const params = await searchParams
  const get = (key: string) => (typeof params[key] === 'string' ? (params[key] as string) : undefined)
  const overlay = get('overlay') === '1'
  const bgParam = get('bg') as StageBackground | undefined
  const background = bgParam && BACKGROUNDS.includes(bgParam) ? bgParam : overlay ? 'transparent' : 'scene'

  return (
    <GokuApp
      overlay={overlay}
      initialVoice={get('voice') === '1'}
      initialBackground={background}
      initialWsUrl={get('ws') ?? DEFAULT_WS_URL}
    />
  )
}

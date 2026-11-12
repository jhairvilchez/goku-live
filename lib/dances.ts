export type DanceId =
  | 'idle'
  | 'rose'
  | 'heart'
  | 'jump'
  | 'spin'
  | 'robot'
  | 'fusion'
  | 'kamehameha'
  | 'wave'
  | 'ssj'

export type Dance = {
  id: Exclude<DanceId, 'idle'>
  name: string
  durationMs: number
}

export const DANCES: Record<Dance['id'], Dance> = {
  rose: { id: 'rose', name: 'Baile de la Rosa', durationMs: 4000 },
  heart: { id: 'heart', name: 'Corazón Saiyajin', durationMs: 3600 },
  jump: { id: 'jump', name: 'Salto Nimbus', durationMs: 3200 },
  spin: { id: 'spin', name: 'Torbellino Saiyajin', durationMs: 3200 },
  robot: { id: 'robot', name: 'Paso Robot del Dr. Gero', durationMs: 4000 },
  fusion: { id: 'fusion', name: 'Danza de la Fusión', durationMs: 4400 },
  kamehameha: { id: 'kamehameha', name: 'Kamehameha Dance', durationMs: 4400 },
  wave: { id: 'wave', name: 'Saludo Saiyajin', durationMs: 2400 },
  ssj: { id: 'ssj', name: '¡SÚPER SAIYAJIN!', durationMs: 6000 },
}

/** Gift names as TikTok/TikFinity reports them (English), lowercased. */
const GIFT_TO_DANCE: Record<string, Dance['id']> = {
  rose: 'rose',
  rosa: 'rose',
  'finger heart': 'heart',
  'heart me': 'heart',
  'hand hearts': 'heart',
  'heart': 'heart',
  gg: 'jump',
  tiktok: 'spin',
  'ice cream cone': 'robot',
  doughnut: 'fusion',
  perfume: 'kamehameha',
  'friendship necklace': 'fusion',
  'cap': 'robot',
  'hand wave': 'wave',
}

export const GIFT_DANCE_TABLE = Object.entries(GIFT_TO_DANCE)
  .filter(([gift]) => !['rosa', 'heart', 'cap'].includes(gift))
  .map(([gift, dance]) => ({ gift, dance: DANCES[dance].name }))

const RANDOM_POOL: Dance['id'][] = ['rose', 'heart', 'jump', 'spin', 'robot', 'fusion', 'kamehameha']

/** Gifts worth this many diamonds (per unit) or more trigger the Super Saiyan transformation. */
export const SSJ_DIAMOND_THRESHOLD = 99

export function danceForGift(giftName: string, diamondCount = 0): Dance {
  if (diamondCount >= SSJ_DIAMOND_THRESHOLD) return DANCES.ssj
  const mapped = GIFT_TO_DANCE[giftName.trim().toLowerCase()]
  if (mapped) return DANCES[mapped]
  const fallback = RANDOM_POOL[Math.floor(Math.random() * RANDOM_POOL.length)]
  return DANCES[fallback]
}

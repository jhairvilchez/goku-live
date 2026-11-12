export type LiveEvent =
  | { type: 'chat'; user: string; comment: string }
  | { type: 'gift'; user: string; giftName: string; count: number; diamonds: number }
  | { type: 'follow'; user: string }
  | { type: 'share'; user: string }

export const DEFAULT_WS_URL = 'ws://127.0.0.1:21213/'

type RawData = Record<string, unknown>

function str(value: unknown, fallback = ''): string {
  return typeof value === 'string' ? value : fallback
}

function num(value: unknown, fallback = 0): number {
  const n = typeof value === 'number' ? value : Number(value)
  return Number.isFinite(n) ? n : fallback
}

function userOf(data: RawData): string {
  const user = data.user as RawData | undefined
  return (
    str(data.nickname) ||
    str(data.uniqueId) ||
    str(user?.nickname) ||
    str(user?.uniqueId) ||
    'amigo'
  ).slice(0, 40)
}

/**
 * Parses a TikFinity WebSocket message ({ event, data }).
 * Streakable gifts (giftType 1) emit many messages; only the final one (repeatEnd) is used.
 */
export function parseTikfinityMessage(raw: string): LiveEvent | null {
  let msg: { event?: string; data?: RawData }
  try {
    msg = JSON.parse(raw)
  } catch {
    return null
  }
  const data = msg.data ?? {}
  const user = userOf(data)

  switch (msg.event) {
    case 'chat': {
      const comment = str(data.comment).trim()
      return comment ? { type: 'chat', user, comment: comment.slice(0, 200) } : null
    }
    case 'gift': {
      const isStreakable = num(data.giftType) === 1
      if (isStreakable && data.repeatEnd !== true && data.repeatEnd !== 1) return null
      const giftDetails = data.giftDetails as RawData | undefined
      return {
        type: 'gift',
        user,
        giftName: str(data.giftName) || str(giftDetails?.giftName) || 'Regalo',
        count: Math.max(1, num(data.repeatCount, 1)),
        diamonds: num(data.diamondCount) || num(giftDetails?.diamondCount),
      }
    }
    case 'follow':
      return { type: 'follow', user }
    case 'share':
      return { type: 'share', user }
    default:
      return null
  }
}

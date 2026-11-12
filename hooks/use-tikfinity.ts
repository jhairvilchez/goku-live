'use client'

import { useEffect, useEffectEvent, useState } from 'react'
import { parseTikfinityMessage, type LiveEvent } from '@/lib/tikfinity'

export type ConnectionStatus = 'connecting' | 'connected' | 'disconnected'

const RECONNECT_MS = 3000

export function useTikfinity(url: string, onEvent: (event: LiveEvent) => void) {
  const [status, setStatus] = useState<ConnectionStatus>('connecting')
  const handleEvent = useEffectEvent(onEvent)

  useEffect(() => {
    let socket: WebSocket | null = null
    let retry: ReturnType<typeof setTimeout> | undefined
    let disposed = false

    const connect = () => {
      if (disposed) return
      setStatus('connecting')
      try {
        socket = new WebSocket(url)
      } catch {
        setStatus('disconnected')
        retry = setTimeout(connect, RECONNECT_MS)
        return
      }
      socket.onopen = () => setStatus('connected')
      socket.onmessage = (message) => {
        if (typeof message.data !== 'string') return
        const event = parseTikfinityMessage(message.data)
        if (event) handleEvent(event)
      }
      socket.onclose = () => {
        if (disposed) return
        setStatus('disconnected')
        retry = setTimeout(connect, RECONNECT_MS)
      }
      socket.onerror = () => socket?.close()
    }

    connect()
    return () => {
      disposed = true
      clearTimeout(retry)
      socket?.close()
    }
  }, [url])

  return status
}

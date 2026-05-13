'use client'
import { useEffect } from 'react'
import { useWakeLock } from '@/hooks/useWakeLock'

export function KeepAlive() {
  // Keep screen awake while using the app
  useWakeLock()

  // Ping server every 5 minutes to prevent backend sleep (Render/Railway free tier)
  useEffect(() => {
    const ping = () => {
      fetch('/api/health').catch(() => {
        // Silent fail — keep-alive is best-effort
      })
    }

    // First ping immediately
    ping()

    const interval = setInterval(ping, 5 * 60 * 1000)
    return () => clearInterval(interval)
  }, [])

  return null
}

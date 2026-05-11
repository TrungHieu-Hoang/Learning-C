'use client'
import { useEffect, useRef, useCallback } from 'react'

export function useWakeLock() {
  const wakeLockRef = useRef<WakeLockSentinel | null>(null)

  const requestWakeLock = useCallback(async () => {
    try {
      if ('wakeLock' in navigator) {
        wakeLockRef.current = await navigator.wakeLock.request('screen')
        wakeLockRef.current.addEventListener('release', () => {
          // Auto re-acquire on visibility change
        })
      }
    } catch {
      // Wake lock not supported or denied — silently ignore
    }
  }, [])

  useEffect(() => {
    requestWakeLock()

    const handleVisibility = async () => {
      if (document.visibilityState === 'visible' && !wakeLockRef.current) {
        await requestWakeLock()
      }
    }
    document.addEventListener('visibilitychange', handleVisibility)

    return () => {
      document.removeEventListener('visibilitychange', handleVisibility)
      wakeLockRef.current?.release()
    }
  }, [requestWakeLock])

  return { release: () => wakeLockRef.current?.release() }
}

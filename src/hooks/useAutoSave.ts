'use client'
import { useEffect, useRef } from 'react'
import { useEditorStore } from '@/store/editorStore'

export function useAutoSave(key: string, intervalMs: number = 30000) {
  const code = useEditorStore((s) => s.code)
  const savedRef = useRef(code)

  useEffect(() => {
    const timer = setInterval(() => {
      if (code !== savedRef.current) {
        try {
          localStorage.setItem(key, code)
          savedRef.current = code
        } catch {}
      }
    }, intervalMs)
    return () => clearInterval(timer)
  }, [code, key, intervalMs])

  useEffect(() => {
    try {
      const saved = localStorage.getItem(key)
      if (saved && saved !== code) {
        useEditorStore.getState().setCode(saved)
        savedRef.current = saved
      }
    } catch {}
  }, [key])
}

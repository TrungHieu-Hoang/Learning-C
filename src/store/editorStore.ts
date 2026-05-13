import { create } from 'zustand'

function loadSettings(): { fontSize: number; fontFamily: string } {
  if (typeof window === 'undefined') return { fontSize: 14, fontFamily: 'JetBrains Mono' }
  try {
    const raw = localStorage.getItem('editor-settings')
    if (raw) {
      const parsed = JSON.parse(raw)
      return {
        fontSize: typeof parsed.fontSize === 'number' ? parsed.fontSize : 14,
        fontFamily: typeof parsed.fontFamily === 'string' ? parsed.fontFamily : 'JetBrains Mono',
      }
    }
  } catch {}
  return { fontSize: 14, fontFamily: 'JetBrains Mono' }
}

function saveSettings(fontSize: number, fontFamily: string) {
  if (typeof window === 'undefined') return
  try {
    localStorage.setItem('editor-settings', JSON.stringify({ fontSize, fontFamily }))
  } catch {}
}

interface EditorState {
  code: string
  stdin: string
  output: string
  error: string
  isRunning: boolean
  isSubmitting: boolean
  fontSize: number
  fontFamily: string
  theme: 'vs-dark' | 'light'
  setCode: (code: string) => void
  setStdin: (stdin: string) => void
  setOutput: (output: string) => void
  setError: (error: string) => void
  setIsRunning: (v: boolean) => void
  setIsSubmitting: (v: boolean) => void
  setFontSize: (size: number) => void
  setFontFamily: (family: string) => void
  toggleTheme: () => void
  reset: (starterCode?: string) => void
}

const DEFAULT_CODE = `#include <stdio.h>\n\nint main() {\n    // Nhap code cua ban.\n\n    return 0;\n}`

const initial = loadSettings()

export const useEditorStore = create<EditorState>((set) => ({
  code: DEFAULT_CODE,
  stdin: '',
  output: '',
  error: '',
  isRunning: false,
  isSubmitting: false,
  fontSize: initial.fontSize,
  fontFamily: initial.fontFamily,
  theme: 'vs-dark',
  setCode: (code) => set({ code }),
  setStdin: (stdin) => set({ stdin }),
  setOutput: (output) => set({ output }),
  setError: (error) => set({ error }),
  setIsRunning: (isRunning) => set({ isRunning }),
  setIsSubmitting: (isSubmitting) => set({ isSubmitting }),
  setFontSize: (fontSize) => {
    set((s) => {
      saveSettings(fontSize, s.fontFamily)
      return { fontSize }
    })
  },
  setFontFamily: (fontFamily) => {
    set((s) => {
      saveSettings(s.fontSize, fontFamily)
      return { fontFamily }
    })
  },
  toggleTheme: () => set((s) => ({ theme: s.theme === 'vs-dark' ? 'light' : 'vs-dark' })),
  reset: (starterCode) =>
    set({
      code: starterCode ?? DEFAULT_CODE,
      output: '',
      error: '',
      stdin: '',
    }),
}))

import { create } from 'zustand'

interface EditorState {
  code: string
  stdin: string
  output: string
  error: string
  isRunning: boolean
  isSubmitting: boolean
  fontSize: number
  theme: 'vs-dark' | 'light'
  setCode: (code: string) => void
  setStdin: (stdin: string) => void
  setOutput: (output: string) => void
  setError: (error: string) => void
  setIsRunning: (v: boolean) => void
  setIsSubmitting: (v: boolean) => void
  setFontSize: (size: number) => void
  toggleTheme: () => void
  reset: (starterCode?: string) => void
}

export const useEditorStore = create<EditorState>((set) => ({
  code: `#include <stdio.h>\n\nint main() {\n    printf("Hello, World!\\n");\n    return 0;\n}`,
  stdin: '',
  output: '',
  error: '',
  isRunning: false,
  isSubmitting: false,
  fontSize: 14,
  theme: 'vs-dark',
  setCode: (code) => set({ code }),
  setStdin: (stdin) => set({ stdin }),
  setOutput: (output) => set({ output }),
  setError: (error) => set({ error }),
  setIsRunning: (isRunning) => set({ isRunning }),
  setIsSubmitting: (isSubmitting) => set({ isSubmitting }),
  setFontSize: (fontSize) => set({ fontSize }),
  toggleTheme: () => set((s) => ({ theme: s.theme === 'vs-dark' ? 'light' : 'vs-dark' })),
  reset: (starterCode) =>
    set({
      code: starterCode || `#include <stdio.h>\n\nint main() {\n    printf("Hello, World!\\n");\n    return 0;\n}`,
      output: '',
      error: '',
      stdin: '',
    }),
}))

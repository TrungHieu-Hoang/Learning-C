'use client'
import React, { useRef, useCallback } from 'react'
import dynamic from 'next/dynamic'
import type { OnMount } from '@monaco-editor/react'
import { useEditorStore } from '@/store/editorStore'
import { useThemeStore } from '@/store/themeStore'
import { Button } from '@/components/ui/Button'

const Monaco = dynamic(() => import('@monaco-editor/react'), { ssr: false })

interface CodeEditorProps {
  readOnly?: boolean
  onRun?: () => void
  onSubmit?: () => void
  onReset?: () => void
  onHint?: () => void
  showActions?: boolean
  height?: string
}

export function CodeEditor({
  readOnly = false,
  onRun,
  onSubmit,
  onReset,
  onHint,
  showActions = true,
  height = '100%',
}: CodeEditorProps) {
  const { code, setCode, fontSize, isRunning, isSubmitting } = useEditorStore()
  const appTheme = useThemeStore((s) => s.theme)
  const monacoTheme = appTheme === 'latte' ? 'light' : 'vs-dark'
  const editorRef = useRef<Parameters<OnMount>[0] | null>(null)

  const handleMount: OnMount = useCallback((editor) => {
    editorRef.current = editor
    editor.focus()
  }, [])

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        e.preventDefault()
        onRun?.()
      }
    },
    [onRun]
  )

  return (
    <div className="flex flex-col h-full" onKeyDown={handleKeyDown}>
      <div className="flex items-center justify-between px-3 py-1.5 bg-mantle border-b border-surface0">
        <span className="text-xs text-overlay0 font-mono">main.c</span>
        {showActions && (
          <div className="flex items-center gap-1.5">
            {onHint && (
              <Button variant="ghost" size="sm" onClick={onHint}>
                💡 Gợi ý
              </Button>
            )}
            {onReset && (
              <Button variant="ghost" size="sm" onClick={onReset}>
                ↺ Reset
              </Button>
            )}
            {onRun && (
              <Button variant="secondary" size="sm" onClick={onRun} loading={isRunning}>
                ▶ Run
              </Button>
            )}
            {onSubmit && (
              <Button variant="primary" size="sm" onClick={onSubmit} loading={isSubmitting}>
                ✓ Submit
              </Button>
            )}
          </div>
        )}
      </div>
      <div className="flex-1 min-h-0">
        <Monaco
          height={height === '100%' ? undefined : height}
          defaultLanguage="c"
          theme={monacoTheme}
          value={code}
          onChange={(v) => v && setCode(v)}
          onMount={handleMount}
          options={{
            fontSize,
            fontFamily: '"JetBrains Mono", "Fira Code", monospace',
            fontLigatures: true,
            minimap: { enabled: false },
            lineNumbers: 'on',
            tabSize: 2,
            autoIndent: 'full',
            bracketPairColorization: { enabled: true },
            matchBrackets: 'always',
            padding: { top: 12 },
            scrollBeyondLastLine: false,
            readOnly,
            renderWhitespace: 'selection',
            smoothScrolling: true,
            cursorBlinking: 'smooth',
            cursorSmoothCaretAnimation: 'on',
            wordWrap: 'on',
          }}
        />
      </div>
    </div>
  )
}

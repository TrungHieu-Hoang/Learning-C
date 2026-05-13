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

function defineEditorThemes(monaco: any) {
  // Mocha (Catppuccin)
  monaco.editor.defineTheme('mocha', {
    base: 'vs-dark',
    inherit: true,
    rules: [
      { token: 'comment', foreground: '6c7086', fontStyle: 'italic' },
      { token: 'keyword', foreground: 'cba6f7' },
      { token: 'string', foreground: 'a6e3a1' },
      { token: 'number', foreground: 'fab387' },
      { token: 'type', foreground: '89b4fa' },
      { token: 'function', foreground: '89b4fa' },
      { token: 'predefined', foreground: 'f38ba8' },
      { token: 'operator', foreground: '89dceb' },
    ],
    colors: {
      'editor.background': '#1e1e2e',
      'editor.foreground': '#cdd6f4',
      'editor.lineHighlightBackground': '#313244',
      'editor.selectionBackground': '#585b70',
      'editor.inactiveSelectionBackground': '#45475a',
      'editorCursor.foreground': '#f5e0dc',
      'editorLineNumber.foreground': '#585b70',
      'editorLineNumber.activeForeground': '#a6adc8',
      'editorIndentGuide.background': '#313244',
      'editorIndentGuide.activeBackground': '#45475a',
    },
  })

  // Latte (Catppuccin light)
  monaco.editor.defineTheme('latte', {
    base: 'vs',
    inherit: true,
    rules: [
      { token: 'comment', foreground: '8a8d99', fontStyle: 'italic' },
      { token: 'keyword', foreground: '8839ef' },
      { token: 'string', foreground: '40a02b' },
      { token: 'number', foreground: 'fe640b' },
      { token: 'type', foreground: '1e66f5' },
      { token: 'function', foreground: '1e66f5' },
      { token: 'predefined', foreground: 'd20f39' },
      { token: 'operator', foreground: '04a5e5' },
    ],
    colors: {
      'editor.background': '#d6d8dd',
      'editor.foreground': '#3a3b48',
      'editor.lineHighlightBackground': '#c8cad0',
      'editor.selectionBackground': '#abafb9',
      'editor.inactiveSelectionBackground': '#babdc5',
      'editorCursor.foreground': '#3a3b48',
      'editorLineNumber.foreground': '#abafb9',
      'editorLineNumber.activeForeground': '#8a8d99',
      'editorIndentGuide.background': '#c8cad0',
      'editorIndentGuide.activeBackground': '#abafb9',
    },
  })

  // Ocean (GitHub Dark)
  monaco.editor.defineTheme('ocean', {
    base: 'vs-dark',
    inherit: true,
    rules: [
      { token: 'comment', foreground: '8b949e', fontStyle: 'italic' },
      { token: 'keyword', foreground: 'ff7b72' },
      { token: 'string', foreground: 'a5d6ff' },
      { token: 'number', foreground: '79c0ff' },
      { token: 'type', foreground: 'ffa657' },
      { token: 'function', foreground: 'd2a8ff' },
      { token: 'predefined', foreground: 'ffa657' },
      { token: 'operator', foreground: 'ff7b72' },
    ],
    colors: {
      'editor.background': '#0d1117',
      'editor.foreground': '#e6edf3',
      'editor.lineHighlightBackground': '#161b22',
      'editor.selectionBackground': '#264f78',
      'editor.inactiveSelectionBackground': '#1f3a5a',
      'editorCursor.foreground': '#e6edf3',
      'editorLineNumber.foreground': '#484f58',
      'editorLineNumber.activeForeground': '#8b949e',
      'editorIndentGuide.background': '#21262d',
      'editorIndentGuide.activeBackground': '#30363d',
    },
  })
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
  const { code, setCode, fontSize, fontFamily, isRunning, isSubmitting } = useEditorStore()
  const appTheme = useThemeStore((s) => s.theme)
  const editorRef = useRef<Parameters<OnMount>[0] | null>(null)

  const themeMap: Record<string, string> = {
    mocha: 'mocha',
    latte: 'latte',
    ocean: 'ocean',
  }
  const monacoTheme = themeMap[appTheme] || 'vs-dark'

  const handleMount: OnMount = useCallback((editor, monaco) => {
    defineEditorThemes(monaco)
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

  const fontFamilyValue =
    fontFamily === 'monospace' ? 'monospace' : `${fontFamily}, "Fira Code", monospace`

  return (
    <div className="flex flex-col h-full" onKeyDown={handleKeyDown}>
      <div className="flex items-center justify-between px-3 py-1.5 bg-base border-b border-surface0">
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
          key={`${monacoTheme}-${fontFamily}-${fontSize}`}
          height={height === '100%' ? undefined : height}
          defaultLanguage="c"
          theme={monacoTheme}
          value={code}
          onChange={(v) => v && setCode(v)}
          onMount={handleMount}
          options={{
            fontSize,
            fontFamily: fontFamilyValue,
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

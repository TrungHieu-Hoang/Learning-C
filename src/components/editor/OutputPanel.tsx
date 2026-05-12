'use client'
import React from 'react'
import { useEditorStore } from '@/store/editorStore'


export function OutputPanel() {
  const { output, error, isRunning, stdin, setStdin } = useEditorStore()

  return (
    <div className="h-full flex flex-col bg-base">
      <div className="flex items-center justify-between px-4 py-1.5 border-b border-surface0">
        <span className="text-xs font-mono text-overlay0">Input / Output</span>
        {isRunning && (
          <span className="text-xs text-yellow font-mono animate-pulse">Đang chạy...</span>
        )}
      </div>
      <div className="flex-1 flex min-h-0">
        <div className="w-1/2 flex flex-col border-r border-surface0">
          <span className="text-[10px] font-mono text-overlay0 px-3 py-1">Input</span>
          <textarea
            value={stdin}
            onChange={(e) => setStdin(e.target.value)}
            placeholder="Nhập dữ liệu cho stdin..."
            className="flex-1 bg-transparent text-text font-mono text-sm p-3 resize-none focus:outline-none placeholder-overlay0"
            spellCheck={false}
          />
        </div>
        <div className="w-1/2 flex flex-col">
          <span className="text-[10px] font-mono text-overlay0 px-3 py-1">Output</span>
          <div className="flex-1 overflow-auto p-3 font-mono text-sm">
            {error ? (
              <pre className="text-red whitespace-pre-wrap">{error}</pre>
            ) : output ? (
              <pre className="text-text whitespace-pre-wrap">{output}</pre>
            ) : (
              <span className="text-overlay0 italic">Nhấn ▶ Run để chạy chương trình</span>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

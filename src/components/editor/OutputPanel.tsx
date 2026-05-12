'use client'
import React from 'react'
import { useEditorStore } from '@/store/editorStore'

export function OutputPanel() {
  const { output, error, isRunning, stdin, setStdin } = useEditorStore()

  return (
    <div className="h-full flex flex-col bg-[#1e1e2e]">
      <div className="flex items-center justify-between px-4 py-1.5 border-b border-[#313244]">
        <span className="text-xs font-mono text-[#6c7086]">Input / Output</span>
        {isRunning && (
          <span className="text-xs text-[#f9e2af] font-mono animate-pulse">Đang chạy...</span>
        )}
      </div>
      <div className="flex-1 flex min-h-0">
        <div className="w-1/2 flex flex-col border-r border-[#313244]">
          <span className="text-[10px] font-mono text-[#6c7086] px-3 py-1">Input</span>
          <textarea
            value={stdin}
            onChange={(e) => setStdin(e.target.value)}
            placeholder="Nhập dữ liệu cho stdin..."
            className="flex-1 bg-transparent text-[#cdd6f4] font-mono text-sm p-3 resize-none focus:outline-none placeholder-[#6c7086]"
            spellCheck={false}
          />
        </div>
        <div className="w-1/2 flex flex-col">
          <span className="text-[10px] font-mono text-[#6c7086] px-3 py-1">Output</span>
          <div className="flex-1 overflow-auto p-3 font-mono text-sm">
            {error ? (
              <pre className="text-[#f38ba8] whitespace-pre-wrap">{error}</pre>
            ) : output ? (
              <pre className="text-[#cdd6f4] whitespace-pre-wrap">{output}</pre>
            ) : (
              <span className="text-[#6c7086] italic">Nhấn ▶ Run để chạy chương trình</span>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

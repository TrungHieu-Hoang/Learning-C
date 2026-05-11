'use client'
import React from 'react'
import { useEditorStore } from '@/store/editorStore'

export function OutputPanel() {
  const { output, error, isRunning } = useEditorStore()

  return (
    <div className="h-full flex flex-col bg-[#1e1e2e]">
      <div className="flex items-center justify-between px-4 py-1.5 border-b border-[#313244]">
        <span className="text-xs font-mono text-[#6c7086]">Kết quả</span>
        {isRunning && (
          <span className="text-xs text-[#f9e2af] font-mono animate-pulse">Đang chạy...</span>
        )}
      </div>
      <div className="flex-1 overflow-auto p-4 font-mono text-sm">
        {error ? (
          <pre className="text-[#f38ba8] whitespace-pre-wrap">{error}</pre>
        ) : output ? (
          <pre className="text-[#cdd6f4] whitespace-pre-wrap">{output}</pre>
        ) : (
          <span className="text-[#6c7086] italic">
            Nhấn ▶ Run để chạy chương trình
          </span>
        )}
      </div>
    </div>
  )
}

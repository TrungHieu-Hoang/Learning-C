'use client'
import React from 'react'
import { Card } from '@/components/ui/Card'
import { useEditorStore } from '@/store/editorStore'

export default function SettingsPage() {
  const { fontSize, setFontSize, theme, toggleTheme } = useEditorStore()

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <div className="animate-fade-in mb-6">
        <h1 className="text-2xl font-bold font-mono mb-2">Cài đặt</h1>
        <p className="text-[#a6adc8] text-sm font-mono">Tùy chỉnh trải nghiệm học tập</p>
      </div>

      <div className="space-y-4">
        <Card className="p-5">
          <h2 className="text-sm font-medium text-[#cdd6f4] mb-4 font-mono">Giao diện</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-[#a6adc8] font-mono">Theme</p>
                <p className="text-xs text-[#6c7086] font-mono">Dark mode (luôn bật)</p>
              </div>
              <div className="px-3 py-1.5 bg-[#313244] rounded-lg text-sm text-[#a6e3a1] font-mono">
                {theme === 'vs-dark' ? '🌙 Dark' : '☀️ Light'}
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-[#a6adc8] font-mono">Font size</p>
                <p className="text-xs text-[#6c7086] font-mono">Kích thước chữ trong editor</p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setFontSize(Math.max(10, fontSize - 1))}
                  className="w-8 h-8 rounded-lg bg-[#313244] text-[#a6adc8] hover:bg-[#45475a] transition-colors"
                >
                  -
                </button>
                <span className="w-8 text-center text-sm text-[#cdd6f4] font-mono">{fontSize}</span>
                <button
                  onClick={() => setFontSize(Math.min(24, fontSize + 1))}
                  className="w-8 h-8 rounded-lg bg-[#313244] text-[#a6adc8] hover:bg-[#45475a] transition-colors"
                >
                  +
                </button>
              </div>
            </div>
          </div>
        </Card>

        <Card className="p-5">
          <h2 className="text-sm font-medium text-[#cdd6f4] mb-4 font-mono">Editor</h2>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <p className="text-sm text-[#a6adc8] font-mono">Auto save</p>
              <span className="text-xs text-[#a6e3a1] font-mono">Mỗi 30s</span>
            </div>
            <div className="flex items-center justify-between">
              <p className="text-sm text-[#a6adc8] font-mono">Tab size</p>
              <span className="text-xs text-[#a6adc8] font-mono">2 spaces</span>
            </div>
            <div className="flex items-center justify-between">
              <p className="text-sm text-[#a6adc8] font-mono">Font</p>
              <span className="text-xs text-[#a6adc8] font-mono">JetBrains Mono (Ligatures)</span>
            </div>
            <div className="flex items-center justify-between">
              <p className="text-sm text-[#a6adc8] font-mono">Word wrap</p>
              <span className="text-xs text-[#a6e3a1] font-mono">Bật</span>
            </div>
          </div>
        </Card>

        <Card className="p-5">
          <h2 className="text-sm font-medium text-[#cdd6f4] mb-4 font-mono">Phím tắt</h2>
          <div className="space-y-2">
            {[
              { key: 'Ctrl + Enter', action: 'Chạy code' },
              { key: 'Ctrl + S', action: 'Lưu code' },
              { key: 'Tab', action: 'Tự động thụt lề' },
            ].map((s) => (
              <div key={s.key} className="flex items-center justify-between">
                <span className="text-sm text-[#a6adc8] font-mono">{s.action}</span>
                <kbd className="px-2 py-0.5 bg-[#313244] rounded text-xs text-[#a6e3a1] font-mono">
                  {s.key}
                </kbd>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  )
}

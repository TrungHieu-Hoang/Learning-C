'use client'
import React from 'react'
import { Card } from '@/components/ui/Card'
import { useThemeStore, type AppTheme } from '@/store/themeStore'
import { useEditorStore } from '@/store/editorStore'

const themes: { id: AppTheme; label: string; desc: string; swatches: string[] }[] = [
  {
    id: 'mocha',
    label: 'Mocha',
    desc: 'Tối cổ điển',
    swatches: ['#181825', '#1e1e2e', '#313244', '#cdd6f4', '#a6e3a1'],
  },
  {
    id: 'latte',
    label: 'Latte',
    desc: 'Sáng',
    swatches: ['#c8cad0', '#d6d8dd', '#babdc5', '#3a3b48', '#40a02b'],
  },
  {
    id: 'ocean',
    label: 'Ocean',
    desc: 'Xanh dương đậm',
    swatches: ['#161b22', '#0d1117', '#21262d', '#e6edf3', '#3fb950'],
  },
]

const fonts = [
  { name: 'JetBrains Mono', value: "'JetBrains Mono'", sample: 'Hello, World!' },
  { name: 'Fira Code', value: "'Fira Code'", sample: 'Hello, World!' },
  { name: 'Cascadia Code', value: "'Cascadia Code'", sample: 'Hello, World!' },
  { name: 'Source Code Pro', value: "'Source Code Pro'", sample: 'Hello, World!' },
  { name: 'Monospace', value: 'monospace', sample: 'Hello, World!' },
]

export default function SettingsPage() {
  const { theme, setTheme } = useThemeStore()
  const { fontSize, fontFamily, setFontSize, setFontFamily } = useEditorStore()

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <div className="animate-fade-in mb-6">
        <h1 className="text-2xl font-bold font-mono mb-2">Cài đặt</h1>
        <p className="text-subtext0 text-sm font-mono">Tùy chỉnh trải nghiệm học tập</p>
      </div>

      <div className="space-y-4">
        {/* Theme */}
        <Card className="p-5">
          <h2 className="text-sm font-medium text-text mb-4 font-mono">Giao diện</h2>
          <div className="grid grid-cols-3 gap-3">
            {themes.map((t) => (
              <button
                key={t.id}
                onClick={() => setTheme(t.id)}
                className={`p-4 rounded-xl border-2 transition-all text-left ${
                  theme === t.id
                    ? 'border-green bg-surface0'
                    : 'border-surface0 hover:border-surface1 bg-mantle'
                }`}
              >
                <div className="flex gap-1 mb-3">
                  {t.swatches.map((c, i) => (
                    <div key={i} className="w-5 h-5 rounded" style={{ backgroundColor: c }} />
                  ))}
                </div>
                <p className="text-text text-sm font-mono font-medium">{t.label}</p>
                <p className="text-overlay0 text-xs font-mono mt-0.5">{t.desc}</p>
              </button>
            ))}
          </div>
        </Card>

        {/* Font */}
        <Card className="p-5">
          <h2 className="text-sm font-medium text-text mb-4 font-mono">Font chữ</h2>

          {/* Font family */}
          <div className="mb-4">
            <p className="text-sm text-subtext0 font-mono mb-3">Kiểu chữ</p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {fonts.map((f) => (
                <button
                  key={f.value}
                  onClick={() => setFontFamily(f.value)}
                  className={`p-3 rounded-xl border-2 transition-all text-left ${
                    fontFamily === f.value
                      ? 'border-green bg-surface0'
                      : 'border-surface0 hover:border-surface1 bg-mantle'
                  }`}
                >
                  <p
                    className="text-text text-sm font-medium truncate"
                    style={{ fontFamily: f.value }}
                  >
                    {f.name}
                  </p>
                  <p
                    className="text-overlay0 text-xs mt-1 truncate"
                    style={{ fontFamily: f.value }}
                  >
                    {f.sample}
                  </p>
                </button>
              ))}
            </div>
          </div>

          {/* Font size */}
          <div className="flex items-center justify-between pt-4 border-t border-surface0">
            <div>
              <p className="text-sm text-subtext0 font-mono">Cỡ chữ</p>
              <p className="text-xs text-overlay0 font-mono">Kích thước chữ trong editor</p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setFontSize(Math.max(10, fontSize - 1))}
                className="w-8 h-8 rounded-lg bg-surface0 text-subtext0 hover:bg-surface1 transition-colors"
              >
                -
              </button>
              <span className="w-8 text-center text-sm text-text font-mono">{fontSize}</span>
              <button
                onClick={() => setFontSize(Math.min(24, fontSize + 1))}
                className="w-8 h-8 rounded-lg bg-surface0 text-subtext0 hover:bg-surface1 transition-colors"
              >
                +
              </button>
            </div>
          </div>
        </Card>

        {/* Editor info */}
        <Card className="p-5">
          <h2 className="text-sm font-medium text-text mb-4 font-mono">Editor</h2>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <p className="text-sm text-subtext0 font-mono">Auto save</p>
              <span className="text-xs text-green font-mono">Mỗi 30s</span>
            </div>
            <div className="flex items-center justify-between">
              <p className="text-sm text-subtext0 font-mono">Tab size</p>
              <span className="text-xs text-subtext0 font-mono">2 spaces</span>
            </div>
            <div className="flex items-center justify-between">
              <p className="text-sm text-subtext0 font-mono">Word wrap</p>
              <span className="text-xs text-green font-mono">Bật</span>
            </div>
          </div>
        </Card>

        {/* Shortcuts */}
        <Card className="p-5">
          <h2 className="text-sm font-medium text-text mb-4 font-mono">Phím tắt</h2>
          <div className="space-y-2">
            {[
              { key: 'Ctrl + Enter', action: 'Chạy code' },
              { key: 'Ctrl + S', action: 'Lưu code' },
              { key: 'Tab', action: 'Tự động thụt lề' },
            ].map((s) => (
              <div key={s.key} className="flex items-center justify-between">
                <span className="text-sm text-subtext0 font-mono">{s.action}</span>
                <kbd className="px-2 py-0.5 bg-surface0 rounded text-xs text-green font-mono">
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

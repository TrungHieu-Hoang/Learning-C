'use client'
import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { useParams, useRouter } from 'next/navigation'
import { CodeEditor } from '@/components/editor/CodeEditor'
import { OutputPanel } from '@/components/editor/OutputPanel'
import { TestCasePanel } from '@/components/editor/TestCasePanel'
import { LessonContent } from '@/components/learn/LessonContent'
import { useJudge } from '@/hooks/useJudge'
import { useEditorStore } from '@/store/editorStore'
import { modulesData } from '@/data/lessons'

export default function LessonPage() {
  const params = useParams()
  const slug = params.slug as string
  const [activeTab, setActiveTab] = useState<'theory' | 'editor' | 'result'>('theory')
  const { handleRun, testResults, showTestPanel, isRunning } = useJudge()
  const reset = useEditorStore((s) => s.reset)
  const [isCompleted, setIsCompleted] = useState(false)
  const [saving, setSaving] = useState(false)

  const router = useRouter()
  const moduleData = modulesData.find((m) => m.id === slug) ?? null

  const lesson = moduleData?.lessons?.[0]

  const handleComplete = async () => {
    if (!lesson || saving) return
    setSaving(true)
    setIsCompleted(true)
    // Save to localStorage for offline use
    const done = JSON.parse(localStorage.getItem('completed') || '[]')
    if (!done.includes(lesson.id)) {
      done.push(lesson.id)
      localStorage.setItem('completed', JSON.stringify(done))
    }
    try {
      await fetch('/api/progress', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ lessonId: lesson.id, isCompleted: true }),
      })
    } catch {
      // No DB — fine
    }
    setSaving(false)
    router.push('/learn')
  }

  useEffect(() => {
    if (lesson?.starterCode !== undefined) {
      reset(lesson.starterCode)
    }
  }, [slug, lesson?.starterCode, reset])

  if (!moduleData || !lesson) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-bold text-[#f38ba8] font-mono mb-2">404</h1>
        <p className="text-[#6c7086] font-mono">Bài học không tồn tại</p>
      </div>
    )
  }

  return (
    <div className="h-[calc(100vh-3.5rem)] flex flex-col lg:flex-row">
      {/* Mobile tabs */}
      <div className="lg:hidden flex border-b border-[#313244]">
        {(['theory', 'editor', 'result'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`flex-1 px-4 py-2 text-sm font-mono transition-colors ${
              activeTab === tab
                ? 'text-[#a6e3a1] border-b-2 border-[#a6e3a1] bg-[#181825]'
                : 'text-[#6c7086] hover:text-[#a6adc8]'
            }`}
          >
            {tab === 'theory' ? 'Lý thuyết' : tab === 'editor' ? 'Editor' : 'Kết quả'}
          </button>
        ))}
      </div>

      {/* Theory panel */}
      <div className={`lg:w-1/2 xl:w-3/5 border-r border-[#313244] flex flex-col ${
        activeTab !== 'theory' ? 'hidden lg:flex' : 'flex-1'
      }`}>
        <div className="p-3 border-b border-[#313244] shrink-0">
          <Link
            href="/learn"
            className="inline-flex items-center gap-1 text-sm font-mono text-[#6c7086] hover:text-[#cdd6f4] transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Quay lại
          </Link>
        </div>
        <div className="flex-1 overflow-y-auto min-h-0">
          <LessonContent content={lesson.contentMd} title={lesson.title} />
        </div>
        <div className="p-4 border-t border-[#313244] shrink-0">
          {isCompleted ? (
            <div className="flex items-center justify-between">
              <p className="text-[#a6e3a1] font-mono text-sm">✓ Đã hoàn thành</p>
              <Link
                href="/learn"
                className="px-4 py-2 rounded-lg bg-[#a6e3a1] text-[#1e1e2e] font-mono text-sm font-medium hover:bg-[#8bd88a] transition-colors"
              >
                Bài tiếp theo →
              </Link>
            </div>
          ) : (
            <button
              onClick={handleComplete}
              disabled={saving}
              className="w-full px-4 py-2.5 rounded-lg bg-[#313244] text-[#cdd6f4] font-mono text-sm hover:bg-[#45475a] transition-colors disabled:opacity-50 border border-[#45475a]"
            >
              {saving ? 'Đang lưu...' : 'Đánh dấu hoàn thành'}
            </button>
          )}
        </div>
      </div>

      {/* Right panel: Editor + Output */}
      <div className={`lg:w-1/2 xl:w-2/5 flex flex-col overflow-hidden ${
        activeTab !== 'editor' && activeTab !== 'result' ? 'hidden lg:flex' : 'flex-1'
      }`}>
        <div className="flex-1 min-h-[200px]">
          <CodeEditor
            onRun={handleRun}
            onReset={() => reset(lesson.starterCode)}
          />
        </div>
        <div className="h-1/2 min-h-[150px] border-t border-[#313244]">
          {showTestPanel && testResults.length > 0 ? (
            <TestCasePanel results={testResults} isRunning={isRunning} />
          ) : (
            <OutputPanel />
          )}
        </div>
      </div>
    </div>
  )
}

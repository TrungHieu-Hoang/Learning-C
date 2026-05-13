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
import { challengeData } from '@/data/challenges'
import { Spinner } from '@/components/ui/Spinner'

export default function LessonPage() {
  const params = useParams()
  const slug = params.slug as string
  const [activeTab, setActiveTab] = useState<'theory' | 'editor' | 'result'>('theory')
  const { handleRun, handleTestCases, testResults, showTestPanel, isRunning } = useJudge()
  const reset = useEditorStore((s) => s.reset)
  const [isCompleted, setIsCompleted] = useState(false)
  const [saving, setSaving] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState('')

  const router = useRouter()

  // Resolve slug: could be module ID or lesson ID
  let moduleData = modulesData.find((m) => m.id === slug) ?? null
  let currentLesson
  if (moduleData) {
    // Slug is module ID — pick the first lesson
    currentLesson = moduleData.lessons[0]
  } else {
    // Slug is lesson ID — search across all modules
    for (const mod of modulesData) {
      const found = mod.lessons.find((l) => l.id === slug)
      if (found) {
        moduleData = mod
        currentLesson = found
        break
      }
    }
  }

  // Find sibling theory/challenge for navigation
  const siblingChallenge = moduleData?.lessons.find((l) => l.lessonType === 'challenge')
  const siblingTheory = moduleData?.lessons.find((l) => l.lessonType === 'theory')

  const isChallenge = currentLesson?.lessonType === 'challenge'
  const activeLesson = currentLesson ?? null
  const challengeInfo = activeLesson && challengeData.get(activeLesson.id)

  useEffect(() => {
    if (challengeInfo) {
      reset(challengeInfo.starterCode)
    } else if (activeLesson?.starterCode !== undefined) {
      reset(activeLesson.starterCode)
    }
  }, [slug, activeLesson?.starterCode, challengeInfo, reset])

  const handleComplete = async () => {
    if (!activeLesson || saving) return
    setSaving(true)
    setIsCompleted(true)
    const done = JSON.parse(localStorage.getItem('completed') || '[]')
    if (!done.includes(activeLesson.id)) {
      done.push(activeLesson.id)
      localStorage.setItem('completed', JSON.stringify(done))
    }
    try {
      await fetch('/api/progress', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ lessonId: activeLesson.id, isCompleted: true }),
      })
    } catch {
      // No DB — fine
    }
    setSaving(false)
    router.push('/learn')
  }

  const handleChallengeSubmit = async () => {
    if (!challengeInfo || submitting) return
    setSubmitting(true)
    setSubmitError('')
    setActiveTab('result')

    const results = await handleTestCases(challengeInfo.testCases)
    const allPassed = results.every((r) => r.passed)

    if (allPassed) {
      // Auto-complete on success
      setIsCompleted(true)
      const done = JSON.parse(localStorage.getItem('completed') || '[]')
      if (!done.includes(challengeInfo.id)) {
        done.push(challengeInfo.id)
        localStorage.setItem('completed', JSON.stringify(done))
      }
      try {
        await fetch('/api/progress', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ lessonId: challengeInfo.id, isCompleted: true }),
        })
      } catch {
        // No DB — fine
      }
    } else {
      setSubmitError('Một số test case chưa đúng. Thử lại nhé!')
    }
    setSubmitting(false)
  }

  if (!activeLesson) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-bold text-red font-mono mb-2">404</h1>
        <p className="text-overlay0 font-mono">Bài học không tồn tại</p>
      </div>
    )
  }

  if (isChallenge && !challengeInfo) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <div className="flex items-center justify-center py-20">
          <Spinner />
        </div>
      </div>
    )
  }

  return (
    <div className="h-[calc(100vh-3.5rem)] flex flex-col lg:flex-row">
      {/* Mobile tabs */}
      <div className="lg:hidden flex border-b border-surface0">
        {(['theory', 'editor', 'result'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`flex-1 px-4 py-2 text-sm font-mono transition-colors ${
              activeTab === tab
                ? 'text-green border-b-2 border-green bg-mantle'
                : 'text-overlay0 hover:text-subtext0'
            }`}
          >
            {tab === 'theory' ? (isChallenge ? 'Đề bài' : 'Lý thuyết') : tab === 'editor' ? 'Editor' : 'Kết quả'}
          </button>
        ))}
      </div>

      {/* Theory / Challenge description panel */}
      <div className={`lg:w-1/2 xl:w-3/5 border-r border-surface0 flex flex-col ${
        activeTab !== 'theory' ? 'hidden lg:flex' : 'flex-1'
      }`}>
        <div className="p-3 border-b border-surface0 shrink-0">
          <div className="flex items-center justify-between">
            <Link
              href="/learn"
              className="inline-flex items-center gap-1 text-sm font-mono text-overlay0 hover:text-text transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Quay lại
            </Link>
            {siblingTheory && siblingChallenge && (
              <div className="flex gap-1">
                <Link
                  href={`/learn/${siblingTheory.id}`}
                  className={`px-2.5 py-1 rounded text-xs font-mono transition-colors ${
                    !isChallenge
                      ? 'bg-green text-base font-medium'
                      : 'bg-surface0 text-overlay0 hover:text-text'
                  }`}
                >
                  Lý thuyết
                </Link>
                <Link
                  href={`/learn/${siblingChallenge.id}`}
                  className={`px-2.5 py-1 rounded text-xs font-mono transition-colors ${
                    isChallenge
                      ? 'bg-green text-base font-medium'
                      : 'bg-surface0 text-overlay0 hover:text-text'
                  }`}
                >
                  Thực hành
                </Link>
              </div>
            )}
          </div>
        </div>
        <div className="flex-1 overflow-y-auto min-h-0">
          {isChallenge && challengeInfo ? (
            <LessonContent content={challengeInfo.descriptionMd} title={challengeInfo.title} />
          ) : activeLesson ? (
            <LessonContent content={activeLesson.contentMd} title={activeLesson.title} />
          ) : null}
        </div>
        <div className="p-4 border-t border-surface0 shrink-0">
          {isChallenge ? (
            // Challenge mode
            isCompleted ? (
              <div className="flex items-center justify-between">
                <p className="text-green font-mono text-sm">✓ Hoàn thành! Bạn đã pass hết test cases.</p>
                <Link
                  href="/learn"
                  className="px-4 py-2 rounded-lg bg-green text-base font-mono text-sm font-medium hover:bg-green-hover transition-colors"
                >
                  Bài tiếp theo →
                </Link>
              </div>
            ) : (
              <div>
                <button
                  onClick={handleChallengeSubmit}
                  disabled={submitting || isRunning}
                  className="w-full px-4 py-2.5 rounded-lg bg-green text-base font-mono text-sm font-medium hover:bg-green-hover transition-colors disabled:opacity-50"
                >
                  {submitting ? 'Đang chấm...' : isRunning ? 'Đang chạy...' : 'Nộp bài'}
                </button>
                {submitError && (
                  <p className="text-red text-xs font-mono mt-2 text-center">{submitError}</p>
                )}
              </div>
            )
          ) : (
            // Theory mode
            isCompleted ? (
              <div className="flex items-center justify-between">
                <p className="text-green font-mono text-sm">✓ Đã hoàn thành</p>
                <Link
                  href="/learn"
                  className="px-4 py-2 rounded-lg bg-green text-base font-mono text-sm font-medium hover:bg-green-hover transition-colors"
                >
                  Bài tiếp theo →
                </Link>
              </div>
            ) : (
              <button
                onClick={handleComplete}
                disabled={saving}
                className="w-full px-4 py-2.5 rounded-lg bg-surface0 text-text font-mono text-sm hover:bg-surface1 transition-colors disabled:opacity-50 border border-surface1"
              >
                {saving ? 'Đang lưu...' : 'Đánh dấu hoàn thành'}
              </button>
            )
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
            onSubmit={isChallenge ? handleChallengeSubmit : undefined}
            onReset={() => reset(challengeInfo?.starterCode ?? activeLesson?.starterCode ?? '')}
          />
        </div>
        <div className="h-1/2 min-h-[150px] border-t border-surface0">
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

'use client'
import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { CodeEditor } from '@/components/editor/CodeEditor'
import { OutputPanel } from '@/components/editor/OutputPanel'
import { TestCasePanel } from '@/components/editor/TestCasePanel'
import { Editorial } from '@/components/problems/Editorial'
import { SubmissionHistory } from '@/components/submissions/SubmissionHistory'
import { Button } from '@/components/ui/Button'
import { useJudge } from '@/hooks/useJudge'
import { useEditorStore } from '@/store/editorStore'
import { problemsDetail } from '@/data/problems'
import type { Difficulty, Submission } from '@/types'

const difficultyColors: Record<Difficulty, string> = {
  easy: 'text-green bg-green/10',
  medium: 'text-yellow bg-yellow/10',
  hard: 'text-red bg-red/10',
}

function saveProblemStatus(id: string, status: 'solved' | 'attempted') {
  try {
    const map = JSON.parse(localStorage.getItem('problemStatus') || '{}')
    // Only upgrade: attempted → solved, never downgrade
    if (map[id] === 'solved' && status === 'attempted') return
    map[id] = status
    localStorage.setItem('problemStatus', JSON.stringify(map))
  } catch {}
}

export default function ProblemPage() {
  const params = useParams()
  const id = params.id as string
  const [showEditorial, setShowEditorial] = useState(false)
  const [tab, setTab] = useState<'problem' | 'editor' | 'result'>('problem')
  const [panelTab, setPanelTab] = useState<'result' | 'history'>('result')
  const [submissions, setSubmissions] = useState<Submission[]>([])
  const [subsLoading, setSubsLoading] = useState(false)
  const { data: session } = useSession()
  const { handleRun, handleTestCases, testResults, showTestPanel, isRunning } = useJudge()
  const { code } = useEditorStore()
  const reset = useEditorStore((s) => s.reset)

  const problem = problemsDetail.get(id) ?? null

  useEffect(() => {
    if (problem) reset(problem.starterCode)
  }, [id, problem, reset])

  useEffect(() => {
    if (!id || !session?.user?.id) return
    setSubsLoading(true)
    fetch(`/api/submissions?problemId=${id}`)
      .then((r) => r.json())
      .then((data) => setSubmissions(Array.isArray(data) ? data : []))
      .catch(() => setSubmissions([]))
      .finally(() => setSubsLoading(false))
  }, [id, session])

  const handleSubmit = async () => {
    if (!problem) return
    const testCases = problem.testCases.map((tc) => ({
      input: tc.input,
      expectedOutput: tc.expectedOutput,
      isHidden: tc.isHidden,
    }))
    const results = await handleTestCases(testCases)
    if (results.length === 0) return

    const allPassed = results.every((r) => r.passed)
    saveProblemStatus(id, allPassed ? 'solved' : 'attempted')

    const runtimeMs = Math.max(...results.map((r) => parseInt(r.time) || 0))
    const xpEarned = allPassed ? 30 : 0

    if (session?.user?.id) {
      fetch('/api/submissions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          problemId: id,
          code,
          status: allPassed ? 'AC' : 'WA',
          runtimeMs,
          memoryKb: 1024,
          xpEarned,
        }),
      })
        .then((r) => r.json())
        .then((sub) => {
          if (sub?.id) setSubmissions((prev) => [sub, ...prev])
        })
        .catch(() => {})
    }
  }

  if (!problem) {
    return (
      <div className="h-[calc(100vh-3.5rem)] flex flex-col items-center justify-center gap-4">
        <p className="text-red font-mono text-lg">Bài tập không tồn tại</p>
        <Link href="/problems" className="text-blue font-mono text-sm hover:underline">
          ← Quay lại danh sách
        </Link>
      </div>
    )
  }

  return (
    <div className="h-[calc(100vh-3.5rem)] flex flex-col lg:flex-row">
      {/* Mobile tabs */}
      <div className="lg:hidden flex border-b border-surface0">
        {(['problem', 'editor', 'result'] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`flex-1 px-4 py-2 text-sm font-mono transition-colors ${
              tab === t
                ? 'text-green border-b-2 border-green bg-mantle'
                : 'text-overlay0 hover:text-subtext0'
            }`}
          >
            {t === 'problem' ? 'Đề bài' : t === 'editor' ? 'Editor' : 'Kết quả'}
          </button>
        ))}
      </div>

      {/* Problem description */}
      <div className={`lg:w-2/5 xl:w-1/3 border-r border-surface0 overflow-y-auto ${
        tab !== 'problem' ? 'hidden lg:block' : 'flex-1'
      }`}>
        <div className="p-3 border-b border-surface0">
          <Link
            href="/problems"
            className="inline-flex items-center gap-1 text-sm font-mono text-overlay0 hover:text-text transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Quay lại
          </Link>
        </div>
        <div className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <h1 className="text-lg font-bold font-mono text-text">{problem.title}</h1>
            <span className={`text-xs px-2 py-0.5 rounded-full font-mono ${difficultyColors[problem.difficulty]}`}>
              {problem.difficulty}
            </span>
          </div>

          <div className="space-y-4 text-sm">
            <div>
              <h3 className="text-text font-medium mb-1 font-mono">Mô tả</h3>
              <p className="text-subtext0 leading-relaxed">{problem.description}</p>
            </div>

            <div>
              <h3 className="text-text font-medium mb-1 font-mono">Input Format</h3>
              <pre className="bg-mantle p-3 rounded-lg text-subtext0 text-xs whitespace-pre-wrap">{problem.inputFormat}</pre>
            </div>

            <div>
              <h3 className="text-text font-medium mb-1 font-mono">Constraints</h3>
              <pre className="bg-mantle p-3 rounded-lg text-subtext0 text-xs">{problem.constraints}</pre>
            </div>

            <div>
              <h3 className="text-text font-medium mb-1 font-mono">Sample Input</h3>
              <pre className="bg-mantle p-3 rounded-lg text-green text-xs">{problem.sampleInput}</pre>
            </div>

            <div>
              <h3 className="text-text font-medium mb-1 font-mono">Sample Output</h3>
              <pre className="bg-mantle p-3 rounded-lg text-green text-xs">{problem.sampleOutput}</pre>
            </div>

            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowEditorial(!showEditorial)}
              className="w-full"
            >
              {showEditorial ? 'Ẩn Editorial' : 'Xem Editorial'}
            </Button>

            {showEditorial && (
              <Editorial
                solution={problem.solution}
                explanation={problem.explanation}
                isUnlocked={true}
                hoursUntilUnlock={0}
              />
            )}
          </div>
        </div>
      </div>

      {/* Editor + Results */}
      <div className={`lg:flex-1 flex flex-col ${tab !== 'editor' && tab !== 'result' ? 'hidden lg:flex' : 'flex-1'}`}>
        <div className="flex-1 min-h-[200px]">
          <CodeEditor
            onRun={handleRun}
            onSubmit={handleSubmit}
            onReset={() => reset(problem.starterCode)}
          />
        </div>
        <div className="h-1/2 min-h-[150px] border-t border-surface0 flex flex-col">
          <div className="flex border-b border-surface0">
            <button
              onClick={() => setPanelTab('result')}
              className={`px-4 py-1.5 text-xs font-mono transition-colors ${
                panelTab === 'result'
                  ? 'text-green border-b-2 border-green'
                  : 'text-overlay0 hover:text-subtext0'
              }`}
            >
              Kết quả
            </button>
            <button
              onClick={() => setPanelTab('history')}
              className={`px-4 py-1.5 text-xs font-mono transition-colors ${
                panelTab === 'history'
                  ? 'text-green border-b-2 border-green'
                  : 'text-overlay0 hover:text-subtext0'
              }`}
            >
              Lịch sử
            </button>
          </div>
          <div className="flex-1 overflow-auto">
            {panelTab === 'history' ? (
              <SubmissionHistory submissions={submissions} loading={subsLoading} />
            ) : showTestPanel && testResults.length > 0 ? (
              <TestCasePanel results={testResults} isRunning={isRunning} />
            ) : (
              <OutputPanel />
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

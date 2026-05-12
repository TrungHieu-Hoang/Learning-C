'use client'
import React, { useState, useMemo } from 'react'
import { ProblemCard } from '@/components/problems/ProblemCard'
import { ProblemFilters } from '@/components/problems/ProblemFilters'
import { problemsList } from '@/data/problems'
import type { Difficulty } from '@/types'

function getProblemStatus(): Record<string, 'solved' | 'attempted'> {
  if (typeof window === 'undefined') return {}
  try {
    return JSON.parse(localStorage.getItem('problemStatus') || '{}')
  } catch {
    return {}
  }
}

export default function ProblemsPage() {
  const [difficulty, setDifficulty] = useState<Difficulty | 'all'>('all')
  const [source, setSource] = useState<string | 'all'>('all')
  const [search, setSearch] = useState('')
  const [statusMap, setStatusMap] = useState<Record<string, 'solved' | 'attempted'>>(getProblemStatus)

  const filtered = useMemo(() => {
    let list = problemsList
    if (difficulty !== 'all') list = list.filter((p) => p.difficulty === difficulty)
    if (source !== 'all') list = list.filter((p) => p.source === source)
    if (search) list = list.filter((p) => p.title.toLowerCase().includes(search.toLowerCase()))
    return list
  }, [difficulty, source, search])

  const counts = useMemo(() => ({
    all: problemsList.length,
    easy: problemsList.filter((p) => p.difficulty === 'easy').length,
    medium: problemsList.filter((p) => p.difficulty === 'medium').length,
    hard: problemsList.filter((p) => p.difficulty === 'hard').length,
  }), [])

  // Listen for status changes from other tabs
  React.useEffect(() => {
    const handler = () => setStatusMap(getProblemStatus())
    window.addEventListener('storage', handler)
    return () => window.removeEventListener('storage', handler)
  }, [])

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <div className="animate-fade-in mb-6">
        <h1 className="text-2xl font-bold font-mono mb-2">Bài tập C</h1>
        <p className="text-subtext0 text-sm font-mono">
          {counts.all} bài tập · {counts.easy} Easy · {counts.medium} Medium · {counts.hard} Hard
        </p>
      </div>

      <ProblemFilters
        selectedDifficulty={difficulty}
        selectedSource={source}
        searchQuery={search}
        onDifficultyChange={setDifficulty}
        onSourceChange={setSource}
        onSearchChange={setSearch}
      />

      <div className="grid sm:grid-cols-2 gap-3">
        {filtered.map((p) => (
          <ProblemCard key={p.id} {...p} status={statusMap[p.id] || null} />
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-12">
          <p className="text-overlay0 font-mono">Không tìm thấy bài tập nào</p>
        </div>
      )}
    </div>
  )
}

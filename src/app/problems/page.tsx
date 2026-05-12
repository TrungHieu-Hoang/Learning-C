'use client'
import React, { useState, useEffect, useMemo } from 'react'
import { ProblemCard } from '@/components/problems/ProblemCard'
import { ProblemFilters } from '@/components/problems/ProblemFilters'
import type { Difficulty } from '@/types'

interface ProblemItem {
  id: string
  title: string
  difficulty: Difficulty
  source: string
  description: string
}

export default function ProblemsPage() {
  const [difficulty, setDifficulty] = useState<Difficulty | 'all'>('all')
  const [source, setSource] = useState<string | 'all'>('all')
  const [search, setSearch] = useState('')
  const [problems, setProblems] = useState<ProblemItem[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const params = new URLSearchParams()
    if (difficulty !== 'all') params.set('difficulty', difficulty)
    if (source !== 'all') params.set('source', source)
    if (search) params.set('search', search)

    fetch(`/api/problems?${params.toString()}`)
      .then((res) => res.json())
      .then((data) => setProblems(data.problems || []))
      .catch(() => setProblems([]))
      .finally(() => setLoading(false))
  }, [difficulty, source, search])

  const counts = useMemo(() => ({
    all: problems.length,
    easy: problems.filter((p) => p.difficulty === 'easy').length,
    medium: problems.filter((p) => p.difficulty === 'medium').length,
    hard: problems.filter((p) => p.difficulty === 'hard').length,
  }), [problems])

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <div className="animate-fade-in mb-6">
        <h1 className="text-2xl font-bold font-mono mb-2">Bài tập C</h1>
        <p className="text-[#a6adc8] text-sm font-mono">
          {loading ? 'Đang tải...' : `${counts.all} bài tập · ${counts.easy} Easy · ${counts.medium} Medium · ${counts.hard} Hard`}
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
        {problems.map((p) => (
          <ProblemCard key={p.id} {...p} />
        ))}
      </div>

      {!loading && problems.length === 0 && (
        <div className="text-center py-12">
          <p className="text-[#6c7086] font-mono">Không tìm thấy bài tập nào</p>
        </div>
      )}
    </div>
  )
}

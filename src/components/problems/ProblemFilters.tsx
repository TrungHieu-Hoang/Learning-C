'use client'
import React from 'react'
import type { Difficulty } from '@/types'

interface ProblemFiltersProps {
  selectedDifficulty: Difficulty | 'all'
  selectedSource: string | 'all'
  searchQuery: string
  onDifficultyChange: (d: Difficulty | 'all') => void
  onSourceChange: (s: string | 'all') => void
  onSearchChange: (q: string) => void
}

export function ProblemFilters({
  selectedDifficulty,
  selectedSource,
  searchQuery,
  onDifficultyChange,
  onSourceChange,
  onSearchChange,
}: ProblemFiltersProps) {
  return (
    <div className="flex flex-wrap items-center gap-3 mb-6">
      <input
        type="text"
        placeholder="Tìm kiếm bài tập..."
        value={searchQuery}
        onChange={(e) => onSearchChange(e.target.value)}
        className="flex-1 min-w-[200px] bg-mantle border border-surface0 rounded-lg px-4 py-2 text-sm font-mono text-text placeholder-overlay0 focus:outline-none focus:border-green transition-colors"
      />

      <select
        value={selectedDifficulty}
        onChange={(e) => onDifficultyChange(e.target.value as Difficulty | 'all')}
        className="bg-mantle border border-surface0 rounded-lg px-3 py-2 text-sm font-mono text-text focus:outline-none focus:border-green transition-colors"
      >
        <option value="all">All Difficulties</option>
        <option value="easy">Easy</option>
        <option value="medium">Medium</option>
        <option value="hard">Hard</option>
      </select>

      <select
        value={selectedSource}
        onChange={(e) => onSourceChange(e.target.value)}
        className="bg-mantle border border-surface0 rounded-lg px-3 py-2 text-sm font-mono text-text focus:outline-none focus:border-green transition-colors"
      >
        <option value="all">All Sources</option>
        <option value="hackerrank">HackerRank</option>
        <option value="custom">Custom</option>
      </select>
    </div>
  )
}

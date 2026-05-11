'use client'
import React from 'react'
import Link from 'next/link'
import { Card } from '@/components/ui/Card'
import type { Difficulty } from '@/types'

const difficultyColors: Record<Difficulty, string> = {
  easy: 'text-[#a6e3a1] bg-[#a6e3a1]/10',
  medium: 'text-[#f9e2af] bg-[#f9e2af]/10',
  hard: 'text-[#f38ba8] bg-[#f38ba8]/10',
}

interface ProblemCardProps {
  id: string
  title: string
  difficulty: Difficulty
  source: string
  description: string
}

export function ProblemCard({ id, title, difficulty, source, description }: ProblemCardProps) {
  return (
    <Link href={`/problems/${id}`}>
      <Card hover className="p-4 animate-fade-in">
        <div className="flex items-start justify-between mb-2">
          <h3 className="text-[#cdd6f4] font-medium text-sm font-mono">{title}</h3>
          <span className={`text-xs px-2 py-0.5 rounded-full font-mono ${difficultyColors[difficulty]}`}>
            {difficulty}
          </span>
        </div>
        <p className="text-[#6c7086] text-xs mb-2 line-clamp-2">{description}</p>
        <span className="text-[#45475a] text-xs font-mono">{source === 'hackerrank' ? 'HackerRank' : 'Custom'}</span>
      </Card>
    </Link>
  )
}

'use client'
import React from 'react'
import Link from 'next/link'
import { Card } from '@/components/ui/Card'
import type { Difficulty } from '@/types'

const difficultyColors: Record<Difficulty, string> = {
  easy: 'text-green bg-green/10',
  medium: 'text-yellow bg-yellow/10',
  hard: 'text-red bg-red/10',
}

interface ProblemCardProps {
  id: string
  title: string
  difficulty: Difficulty
  source: string
  description: string
  status?: 'solved' | 'attempted' | null
}

export function ProblemCard({ id, title, difficulty, source, description, status }: ProblemCardProps) {
  return (
    <Link href={`/problems/${id}`}>
      <Card hover className="p-4 animate-fade-in">
        <div className="flex items-start justify-between mb-2">
          <div className="flex items-center gap-2 flex-1 min-w-0">
            {status === 'solved' && (
              <span className="text-green shrink-0" title="Đã hoàn thành">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </span>
            )}
            {status === 'attempted' && (
              <span className="text-yellow shrink-0" title="Đã làm nhưng chưa đúng">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </span>
            )}
            <h3 className="text-text font-medium text-sm font-mono truncate">{title}</h3>
          </div>
          <span className={`text-xs px-2 py-0.5 rounded-full font-mono shrink-0 ${difficultyColors[difficulty]}`}>
            {difficulty}
          </span>
        </div>
        <p className="text-overlay0 text-xs mb-2 line-clamp-2">{description}</p>
        <span className="text-surface1 text-xs font-mono">{source === 'hackerrank' ? 'HackerRank' : 'Custom'}</span>
      </Card>
    </Link>
  )
}

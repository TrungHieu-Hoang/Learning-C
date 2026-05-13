'use client'
import React from 'react'
import Link from 'next/link'
import { Card } from '@/components/ui/Card'

interface ModuleCardProps {
  id: string
  title: string
  description: string
  orderIndex: number
  isLocked: boolean
  lessonCount: number
  completedCount: number
  firstLessonId: string
}

export function ModuleCard({ id, title, description, orderIndex, isLocked, lessonCount, completedCount, firstLessonId }: ModuleCardProps) {
  const allDone = !isLocked && lessonCount > 0 && completedCount >= lessonCount
  const progress = lessonCount > 0 ? Math.round((completedCount / lessonCount) * 100) : 0

  return (
    <Link href={isLocked ? '#' : `/learn/${firstLessonId}`} className={isLocked ? 'pointer-events-none' : ''}>
      <Card hover={!isLocked} className={`p-5 animate-fade-in ${isLocked ? 'opacity-40' : ''}`}>
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-2">
            <span className="text-overlay0 text-xs font-mono">
              Module {orderIndex}
            </span>
            {isLocked && <span className="text-overlay0">🔒</span>}
            {allDone && <span className="text-green text-sm">✓</span>}
          </div>
          <span className="text-xs font-mono text-overlay0">{completedCount}/{lessonCount} bài</span>
        </div>
        <h3 className="text-text font-semibold text-base mb-1.5 font-mono">{title}</h3>
        <p className="text-overlay0 text-sm mb-4 line-clamp-2">{description}</p>
        {!isLocked && (
          <div className="w-full bg-surface0 rounded-full h-1.5">
            <div
              className="bg-green h-1.5 rounded-full transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
        )}
      </Card>
    </Link>
  )
}

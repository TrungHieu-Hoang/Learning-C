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
  progress?: number
  lessonCount: number
}

export function ModuleCard({ id, title, description, orderIndex, isLocked, progress = 0, lessonCount }: ModuleCardProps) {
  return (
    <Link href={isLocked ? '#' : `/learn/${id}`} className={isLocked ? 'pointer-events-none' : ''}>
      <Card hover={!isLocked} className={`p-5 animate-fade-in ${isLocked ? 'opacity-40' : ''}`}>
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-2">
            <span className="text-[#6c7086] text-xs font-mono">
              Module {orderIndex}
            </span>
            {isLocked && <span className="text-[#6c7086]">🔒</span>}
          </div>
          <span className="text-xs font-mono text-[#6c7086]">{lessonCount} bài</span>
        </div>
        <h3 className="text-[#cdd6f4] font-semibold text-base mb-1.5 font-mono">{title}</h3>
        <p className="text-[#6c7086] text-sm mb-4 line-clamp-2">{description}</p>
        {!isLocked && (
          <div className="w-full bg-[#313244] rounded-full h-1.5">
            <div
              className="bg-[#a6e3a1] h-1.5 rounded-full transition-all duration-500"
              style={{ width: `${Math.min(progress, 100)}%` }}
            />
          </div>
        )}
      </Card>
    </Link>
  )
}

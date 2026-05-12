'use client'
import React from 'react'
import { Card } from '@/components/ui/Card'

interface StreakDisplayProps {
  streak: number
  longestStreak?: number
}

export function StreakDisplay({ streak, longestStreak }: StreakDisplayProps) {
  const days = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7']
  const today = new Date().getDay()

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2 text-sm">
        <span className="text-lg">🔥</span>
        <span className="font-mono text-text">
          <strong>{streak}</strong> ngày liên tiếp
        </span>
        {streak >= 7 && (
          <span className="text-xs text-green font-mono">(×1.5 XP bonus active!)</span>
        )}
      </div>
      <div className="flex gap-1">
        {days.map((day, i) => {
          const offset = (i - today + 7) % 7
          const isActive = offset === 0 && streak > 0
          const isPast = offset > 0 && offset <= streak
          return (
            <div
              key={day}
              className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-mono ${
                isActive
                  ? 'bg-green text-base font-bold'
                  : isPast
                  ? 'bg-green/20 text-green'
                  : 'bg-surface0 text-overlay0'
              }`}
              title={day}
            >
              {day}
            </div>
          )
        })}
      </div>
      {longestStreak && (
        <p className="text-overlay0 text-xs font-mono">
          Kỷ lục: {longestStreak} ngày
        </p>
      )}
    </div>
  )
}

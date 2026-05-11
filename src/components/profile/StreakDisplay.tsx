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
        <span className="font-mono text-[#cdd6f4]">
          <strong>{streak}</strong> ngày liên tiếp
        </span>
        {streak >= 7 && (
          <span className="text-xs text-[#a6e3a1] font-mono">(×1.5 XP bonus active!)</span>
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
                  ? 'bg-[#a6e3a1] text-[#1e1e2e] font-bold'
                  : isPast
                  ? 'bg-[#a6e3a1]/20 text-[#a6e3a1]'
                  : 'bg-[#313244] text-[#6c7086]'
              }`}
              title={day}
            >
              {day}
            </div>
          )
        })}
      </div>
      {longestStreak && (
        <p className="text-[#6c7086] text-xs font-mono">
          Kỷ lục: {longestStreak} ngày
        </p>
      )}
    </div>
  )
}

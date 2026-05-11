'use client'
import React from 'react'

interface Badge {
  id: string
  name: string
  icon: string
  description: string
  unlocked: boolean
}

interface BadgeDisplayProps {
  badges: Badge[]
}

export function BadgeDisplay({ badges }: BadgeDisplayProps) {
  if (badges.length === 0) {
    return (
      <p className="text-[#6c7086] font-mono text-sm italic text-center py-4">
        Chưa có huy hiệu nào
      </p>
    )
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
      {badges.map((badge) => (
        <div
          key={badge.id}
          className={`p-3 rounded-xl text-center border transition-all ${
            badge.unlocked
              ? 'bg-[#181825] border-[#313244]'
              : 'bg-[#181825]/50 border-[#313244]/50 opacity-40'
          }`}
          title={badge.description}
        >
          <span className="text-2xl block mb-1">{badge.unlocked ? badge.icon : '🔒'}</span>
          <p className={`text-xs font-mono ${badge.unlocked ? 'text-[#a6adc8]' : 'text-[#6c7086]'}`}>
            {badge.unlocked ? badge.name : '???'}
          </p>
        </div>
      ))}
    </div>
  )
}

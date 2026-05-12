'use client'
import React from 'react'
import { getRank } from '@/types'

interface RankBadgeProps {
  xp: number
  size?: 'sm' | 'md' | 'lg'
}

export function RankBadge({ xp, size = 'md' }: RankBadgeProps) {
  const rank = getRank(xp)
  const sizes = { sm: 'text-xs', md: 'text-sm', lg: 'text-lg' }
  const icons = { sm: 'text-base', md: 'text-xl', lg: 'text-3xl' }

  return (
    <span className={`inline-flex items-center gap-1.5`} title={`${rank.name} (${xp} XP)`}>
      <span className={icons[size]}>{rank.icon}</span>
      <span className={`${sizes[size]} font-mono text-subtext0`}>{rank.name}</span>
    </span>
  )
}

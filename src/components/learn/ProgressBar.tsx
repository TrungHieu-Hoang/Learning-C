'use client'
import React from 'react'

interface ProgressBarProps {
  value: number
  max: number
  showLabel?: boolean
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

export function ProgressBar({ value, max, showLabel = true, size = 'md', className = '' }: ProgressBarProps) {
  const pct = max > 0 ? Math.min(Math.round((value / max) * 100), 100) : 0
  const heights = { sm: 'h-1', md: 'h-1.5', lg: 'h-2' }

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <div className={`flex-1 bg-[#313244] rounded-full ${heights[size]}`}>
        <div
          className={`bg-[#a6e3a1] ${heights[size]} rounded-full transition-all duration-700 ease-out`}
          style={{ width: `${pct}%` }}
        />
      </div>
      {showLabel && (
        <span className="text-xs font-mono text-[#6c7086] shrink-0">
          {value}/{max}
        </span>
      )}
    </div>
  )
}

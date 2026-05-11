'use client'
import React from 'react'
import { Card } from '@/components/ui/Card'

interface StatsCardProps {
  title: string
  value: string | number
  icon: string
  subtitle?: string
}

export function StatsCard({ title, value, icon, subtitle }: StatsCardProps) {
  return (
    <Card className="p-4 flex items-center gap-4">
      <span className="text-2xl">{icon}</span>
      <div>
        <p className="text-[#6c7086] text-xs font-mono">{title}</p>
        <p className="text-[#cdd6f4] text-lg font-semibold font-mono">{value}</p>
        {subtitle && <p className="text-[#6c7086] text-xs font-mono mt-0.5">{subtitle}</p>}
      </div>
    </Card>
  )
}

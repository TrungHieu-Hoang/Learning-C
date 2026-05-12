'use client'
import React, { useState } from 'react'
import { LeaderboardTable } from '@/components/leaderboard/LeaderboardTable'
import { Card } from '@/components/ui/Card'

const mockGlobal: never[] = []
const mockWeekly: never[] = []

export default function LeaderboardPage() {
  const [type, setType] = useState<'global' | 'weekly'>('global')

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="animate-fade-in mb-6">
        <h1 className="text-2xl font-bold font-mono mb-2">Bảng xếp hạng</h1>
        <p className="text-subtext0 text-sm font-mono">
          Cạnh tranh và leo rank cùng cộng đồng
        </p>
      </div>

      <div className="flex gap-2 mb-6">
        <button
          onClick={() => setType('global')}
          className={`px-4 py-2 rounded-lg text-sm font-mono transition-colors ${
            type === 'global'
              ? 'bg-green text-base font-medium'
              : 'bg-surface0 text-subtext0 hover:bg-surface1'
          }`}
        >
          🌍 Global
        </button>
        <button
          onClick={() => setType('weekly')}
          className={`px-4 py-2 rounded-lg text-sm font-mono transition-colors ${
            type === 'weekly'
              ? 'bg-green text-base font-medium'
              : 'bg-surface0 text-subtext0 hover:bg-surface1'
          }`}
        >
          📅 Weekly
        </button>
      </div>

      <Card className="overflow-hidden">
        <LeaderboardTable entries={type === 'global' ? mockGlobal : mockWeekly} type={type} />
      </Card>
    </div>
  )
}

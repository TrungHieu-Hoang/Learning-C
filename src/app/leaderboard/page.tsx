'use client'
import React, { useState } from 'react'
import { LeaderboardTable } from '@/components/leaderboard/LeaderboardTable'
import { Card } from '@/components/ui/Card'

const mockGlobal = [
  { rank: 1, userId: '1', username: 'coder_master', avatar: null, xp: 8500, xpThisWeek: 1200, problemsSolved: 45, streak: 15 },
  { rank: 2, userId: '2', username: 'c_lang_learner', avatar: null, xp: 6200, xpThisWeek: 900, problemsSolved: 32, streak: 8 },
  { rank: 3, userId: '3', username: 'hello_world', avatar: null, xp: 5400, xpThisWeek: 750, problemsSolved: 28, streak: 12 },
  { rank: 4, userId: '4', username: 'pointer_fan', avatar: null, xp: 3900, xpThisWeek: 600, problemsSolved: 22, streak: 5 },
  { rank: 5, userId: '5', username: 'malloc_user', avatar: null, xp: 2100, xpThisWeek: 350, problemsSolved: 15, streak: 3 },
]

const mockWeekly = [
  { rank: 1, userId: '6', username: 'weekly_warrior', avatar: null, xp: 4500, xpThisWeek: 1500, problemsSolved: 10, streak: 7 },
  { rank: 2, userId: '1', username: 'coder_master', avatar: null, xp: 8500, xpThisWeek: 1200, problemsSolved: 45, streak: 15 },
  { rank: 3, userId: '7', username: 'newbie_coder', avatar: null, xp: 300, xpThisWeek: 300, problemsSolved: 3, streak: 2 },
]

export default function LeaderboardPage() {
  const [type, setType] = useState<'global' | 'weekly'>('global')

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="animate-fade-in mb-6">
        <h1 className="text-2xl font-bold font-mono mb-2">Bảng xếp hạng</h1>
        <p className="text-[#a6adc8] text-sm font-mono">
          Cạnh tranh và leo rank cùng cộng đồng
        </p>
      </div>

      <div className="flex gap-2 mb-6">
        <button
          onClick={() => setType('global')}
          className={`px-4 py-2 rounded-lg text-sm font-mono transition-colors ${
            type === 'global'
              ? 'bg-[#a6e3a1] text-[#1e1e2e] font-medium'
              : 'bg-[#313244] text-[#a6adc8] hover:bg-[#45475a]'
          }`}
        >
          🌍 Global
        </button>
        <button
          onClick={() => setType('weekly')}
          className={`px-4 py-2 rounded-lg text-sm font-mono transition-colors ${
            type === 'weekly'
              ? 'bg-[#a6e3a1] text-[#1e1e2e] font-medium'
              : 'bg-[#313244] text-[#a6adc8] hover:bg-[#45475a]'
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

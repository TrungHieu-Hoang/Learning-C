'use client'
import React, { useState, useEffect } from 'react'
import { LeaderboardTable } from '@/components/leaderboard/LeaderboardTable'
import { Spinner } from '@/components/ui/Spinner'
import { Card } from '@/components/ui/Card'

interface LeaderboardEntry {
  rank: number
  id: string
  username: string
  avatar: string | null
  xp: number
  xpThisWeek: number
  problemsSolved: number
  streak: number
}

export default function LeaderboardPage() {
  const [type, setType] = useState<'global' | 'weekly'>('global')
  const [entries, setEntries] = useState<LeaderboardEntry[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  useEffect(() => {
    setLoading(true)
    setError(false)
    fetch(`/api/leaderboard?type=${type}`)
      .then((r) => {
        if (!r.ok) throw new Error('Failed to fetch')
        return r.json()
      })
      .then((data) => setEntries(data.entries || []))
      .catch(() => setError(true))
      .finally(() => setLoading(false))
  }, [type])

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
              ? 'bg-green font-medium'
              : 'bg-surface0 text-subtext0 hover:bg-surface1'
          }`}
        >
          🌍 Global
        </button>
        <button
          onClick={() => setType('weekly')}
          className={`px-4 py-2 rounded-lg text-sm font-mono transition-colors ${
            type === 'weekly'
              ? 'bg-green font-medium'
              : 'bg-surface0 text-subtext0 hover:bg-surface1'
          }`}
        >
          📅 Weekly
        </button>
      </div>

      <Card className="overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Spinner />
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <p className="text-red font-mono text-sm">Không thể tải dữ liệu</p>
          </div>
        ) : (
          <LeaderboardTable entries={entries} type={type} />
        )}
      </Card>
    </div>
  )
}

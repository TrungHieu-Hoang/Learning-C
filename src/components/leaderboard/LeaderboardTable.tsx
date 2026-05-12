'use client'
import React from 'react'
import Link from 'next/link'
import { RankBadge } from './RankBadge'

interface LeaderboardEntry {
  rank: number
  userId: string
  username: string
  avatar: string | null
  xp: number
  xpThisWeek: number
  problemsSolved: number
  streak: number
}

interface LeaderboardTableProps {
  entries: LeaderboardEntry[]
  type: 'global' | 'weekly'
}

export function LeaderboardTable({ entries, type }: LeaderboardTableProps) {
  if (entries.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-overlay0 font-mono text-sm">Chưa có dữ liệu</p>
      </div>
    )
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm font-mono">
        <thead>
          <tr className="text-overlay0 text-xs border-b border-surface0">
            <th className="px-4 py-3 text-left w-12">#</th>
            <th className="px-4 py-3 text-left">User</th>
            <th className="px-4 py-3 text-right">Rank</th>
            <th className="px-4 py-3 text-right">{type === 'weekly' ? 'Week XP' : 'Total XP'}</th>
            <th className="px-4 py-3 text-right">Solved</th>
            <th className="px-4 py-3 text-right">Streak</th>
          </tr>
        </thead>
        <tbody>
          {entries.map((entry) => (
            <tr
              key={entry.userId}
              className="border-b border-surface0 hover:bg-surface0/30 transition-colors"
            >
              <td className="px-4 py-3 text-overlay0">
                {entry.rank <= 3 ? (
                  <span className="text-lg">{['🏆', '🥈', '🥉'][entry.rank - 1]}</span>
                ) : (
                  entry.rank
                )}
              </td>
              <td className="px-4 py-3">
                <Link href={`/profile/${entry.userId}`} className="text-text hover:text-green transition-colors">
                  {entry.username}
                </Link>
              </td>
              <td className="px-4 py-3 text-right">
                <RankBadge xp={entry.xp} size="sm" />
              </td>
              <td className="px-4 py-3 text-right text-yellow">
                {type === 'weekly' ? entry.xpThisWeek.toLocaleString() : entry.xp.toLocaleString()}
              </td>
              <td className="px-4 py-3 text-right text-subtext0">{entry.problemsSolved}</td>
              <td className="px-4 py-3 text-right">
                {entry.streak > 0 ? (
                  <span className="text-green">🔥 {entry.streak}</span>
                ) : (
                  <span className="text-overlay0">-</span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

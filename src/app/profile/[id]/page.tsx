'use client'
import React from 'react'
import { useParams } from 'next/navigation'
import { Card } from '@/components/ui/Card'
import { StatsCard } from '@/components/profile/StatsCard'
import { StreakDisplay } from '@/components/profile/StreakDisplay'
import { BadgeDisplay } from '@/components/profile/BadgeDisplay'
import { RankBadge } from '@/components/leaderboard/RankBadge'

const mockUser = {
  username: 'coder_master',
  avatar: null,
  xp: 8500,
  streak: 15,
  problemsSolved: 45,
  rank: 'Expert',
  memberSince: 'Jan 2025',
}

const mockBadges = [
  { id: '1', name: 'First Code', icon: '🌟', description: 'Hoàn thành bài đầu tiên', unlocked: true },
  { id: '2', name: 'Streak 7', icon: '🔥', description: 'Học 7 ngày liên tiếp', unlocked: true },
  { id: '3', name: 'Problem Solver', icon: '🧩', description: 'Giải 10 bài tập', unlocked: true },
  { id: '4', name: 'Speed Demon', icon: '⚡', description: 'AC trong 5 phút', unlocked: false },
  { id: '5', name: 'Perfect Score', icon: '💯', description: '100% test cases', unlocked: true },
  { id: '6', name: 'HackerRank Hero', icon: '🏆', description: 'Giải 20 bài HackerRank', unlocked: false },
]

const recentSubmissions = [
  { problem: 'Hello World in C', status: 'AC', xp: 30, date: '2024-01-15' },
  { problem: 'Playing With Characters', status: 'AC', xp: 30, date: '2024-01-14' },
  { problem: 'Sum and Difference', status: 'WA', xp: 0, date: '2024-01-13' },
  { problem: 'Conditional Statements', status: 'AC', xp: 30, date: '2024-01-13' },
]

export default function ProfilePage() {
  const params = useParams()

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="animate-fade-in">
        {/* Profile header */}
        <Card className="p-6 mb-6">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-16 h-16 rounded-full bg-[#313244] flex items-center justify-center text-2xl">
              {mockUser.avatar ? (
                <img src={mockUser.avatar} alt="" className="w-full h-full rounded-full" />
              ) : (
                <span>👤</span>
              )}
            </div>
            <div>
              <h1 className="text-xl font-bold font-mono text-[#cdd6f4]">{mockUser.username}</h1>
              <div className="flex items-center gap-2 mt-1">
                <RankBadge xp={mockUser.xp} />
                <span className="text-[#6c7086] text-xs font-mono">· {mockUser.memberSince}</span>
              </div>
            </div>
          </div>
          <div className="text-sm text-[#6c7086] font-mono">
            <strong className="text-[#f9e2af)">{mockUser.xp.toLocaleString()}</strong> Total XP
          </div>
        </Card>

        {/* Stats grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <StatsCard title="XP" value={mockUser.xp.toLocaleString()} icon="⭐" />
          <StatsCard title="Bài đã giải" value={mockUser.problemsSolved} icon="✅" />
          <StatsCard title="Rank" value={mockUser.rank} icon="🏅" />
          <StatsCard title="Streak" value={`${mockUser.streak} ngày`} icon="🔥" />
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Streak */}
          <Card className="p-5">
            <h2 className="text-sm font-medium text-[#cdd6f4] mb-3 font-mono">Hoạt động</h2>
            <StreakDisplay streak={mockUser.streak} longestStreak={30} />
          </Card>

          {/* Badges */}
          <Card className="p-5">
            <h2 className="text-sm font-medium text-[#cdd6f4] mb-3 font-mono">Huy hiệu</h2>
            <BadgeDisplay badges={mockBadges} />
          </Card>
        </div>

        {/* Recent submissions */}
        <Card className="p-5 mt-6">
          <h2 className="text-sm font-medium text-[#cdd6f4] mb-3 font-mono">Lịch sử nộp bài</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm font-mono">
              <thead>
                <tr className="text-[#6c7086] text-xs border-b border-[#313244]">
                  <th className="px-3 py-2 text-left">Bài tập</th>
                  <th className="px-3 py-2 text-left">Status</th>
                  <th className="px-3 py-2 text-right">XP</th>
                  <th className="px-3 py-2 text-right">Ngày</th>
                </tr>
              </thead>
              <tbody>
                {recentSubmissions.map((s, i) => (
                  <tr key={i} className="border-b border-[#313244]">
                    <td className="px-3 py-2 text-[#a6adc8]">{s.problem}</td>
                    <td className="px-3 py-2">
                      <span className={s.status === 'AC' ? 'text-[#a6e3a1]' : 'text-[#f38ba8]'}>
                        {s.status}
                      </span>
                    </td>
                    <td className="px-3 py-2 text-right text-[#f9e2af]">+{s.xp}</td>
                    <td className="px-3 py-2 text-right text-[#6c7086]">{s.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {recentSubmissions.length === 0 && (
            <p className="text-[#6c7086] font-mono text-sm italic text-center py-4">
              Chưa có lịch sử nộp bài
            </p>
          )}
        </Card>
      </div>
    </div>
  )
}

'use client'
import React, { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { Card } from '@/components/ui/Card'
import { StatsCard } from '@/components/profile/StatsCard'
import { StreakDisplay } from '@/components/profile/StreakDisplay'
import { BadgeDisplay } from '@/components/profile/BadgeDisplay'
import { RankBadge } from '@/components/leaderboard/RankBadge'
import { Spinner } from '@/components/ui/Spinner'

interface ProfileData {
  id: string
  username: string
  avatar: string | null
  xp: number
  streak: number
  problemsSolved: number
  rank: number
  createdAt: string
  recentSubmissions: { id: string; problem: string; status: string; xp: number; date: string }[]
}

function getBadges(streak: number, solved: number) {
  const badges = [
    { id: '1', name: 'First Code', icon: '🌟', description: 'Hoàn thành bài đầu tiên', unlocked: solved >= 1 },
    { id: '2', name: 'Streak 7', icon: '🔥', description: 'Học 7 ngày liên tiếp', unlocked: streak >= 7 },
    { id: '3', name: 'Problem Solver', icon: '🧩', description: 'Giải 10 bài tập', unlocked: solved >= 10 },
    { id: '4', name: 'Speed Demon', icon: '⚡', description: 'AC trong 5 phút', unlocked: false },
    { id: '5', name: 'Perfect Score', icon: '💯', description: '100% test cases', unlocked: solved >= 5 },
    { id: '6', name: 'Streak 30', icon: '🔥', description: 'Học 30 ngày liên tiếp', unlocked: streak >= 30 },
    { id: '7', name: 'Code Master', icon: '🏆', description: 'Giải 50 bài tập', unlocked: solved >= 50 },
  ]
  return badges
}

function getRankLabel(xp: number): string {
  if (xp >= 10000) return 'Master'
  if (xp >= 5000) return 'Expert'
  if (xp >= 2000) return 'Advanced'
  if (xp >= 500) return 'Intermediate'
  return 'Beginner'
}

function formatMemberSince(createdAt: string): string {
  const date = new Date(createdAt)
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
  return `${months[date.getMonth()]} ${date.getFullYear()}`
}

export default function ProfilePage() {
  const params = useParams()
  const id = params.id as string

  const [profile, setProfile] = useState<ProfileData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  useEffect(() => {
    if (!id) return
    setLoading(true)
    setError(false)
    fetch(`/api/users/${id}`)
      .then((r) => {
        if (!r.ok) throw new Error('Not found')
        return r.json()
      })
      .then((data) => setProfile(data))
      .catch(() => setError(true))
      .finally(() => setLoading(false))
  }, [id])

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="flex items-center justify-center py-20">
          <Spinner />
        </div>
      </div>
    )
  }

  if (error || !profile) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="animate-fade-in flex flex-col items-center justify-center py-20 gap-4">
          <p className="text-overlay0 font-mono text-lg">Người dùng không tồn tại</p>
          <Link href="/" className="text-blue font-mono text-sm hover:underline">
            ← Quay lại trang chủ
          </Link>
        </div>
      </div>
    )
  }

  const badges = getBadges(profile.streak, profile.problemsSolved)
  const rankLabel = getRankLabel(profile.xp)
  const memberSince = formatMemberSince(profile.createdAt)
  const initials = profile.username.slice(0, 2).toUpperCase()

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="animate-fade-in">
        {/* Profile header */}
        <Card className="p-6 mb-6">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-16 h-16 rounded-full bg-surface0 flex items-center justify-center text-2xl font-mono font-bold text-text overflow-hidden">
              {profile.avatar ? (
                <img src={profile.avatar} alt="" className="w-full h-full rounded-full object-cover" />
              ) : (
                <span>{initials}</span>
              )}
            </div>
            <div>
              <h1 className="text-xl font-bold font-mono text-text">{profile.username}</h1>
              <div className="flex items-center gap-2 mt-1">
                <RankBadge xp={profile.xp} />
                <span className="text-overlay0 text-xs font-mono">· {memberSince}</span>
              </div>
            </div>
          </div>
          <div className="text-sm text-overlay0 font-mono">
            <strong className="text-yellow">{profile.xp.toLocaleString()}</strong> Total XP
          </div>
        </Card>

        {/* Stats grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <StatsCard title="XP" value={profile.xp.toLocaleString()} icon="⭐" />
          <StatsCard title="Bài đã giải" value={profile.problemsSolved} icon="✅" />
          <StatsCard title="Rank" value={rankLabel} icon="🏅" />
          <StatsCard title="Streak" value={`${profile.streak} ngày`} icon="🔥" />
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Streak */}
          <Card className="p-5">
            <h2 className="text-sm font-medium text-text mb-3 font-mono">Hoạt động</h2>
            <StreakDisplay streak={profile.streak} longestStreak={Math.max(profile.streak, 7)} />
          </Card>

          {/* Badges */}
          <Card className="p-5">
            <h2 className="text-sm font-medium text-text mb-3 font-mono">Huy hiệu</h2>
            <BadgeDisplay badges={badges} />
          </Card>
        </div>

        {/* Recent submissions */}
        <Card className="p-5 mt-6">
          <h2 className="text-sm font-medium text-text mb-3 font-mono">Lịch sử nộp bài</h2>
          {profile.recentSubmissions.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-sm font-mono">
                <thead>
                  <tr className="text-overlay0 text-xs border-b border-surface0">
                    <th className="px-3 py-2 text-left">Bài tập</th>
                    <th className="px-3 py-2 text-left">Status</th>
                    <th className="px-3 py-2 text-right">XP</th>
                    <th className="px-3 py-2 text-right">Ngày</th>
                  </tr>
                </thead>
                <tbody>
                  {profile.recentSubmissions.map((s) => (
                    <tr key={s.id} className="border-b border-surface0">
                      <td className="px-3 py-2 text-subtext0">{s.problem}</td>
                      <td className="px-3 py-2">
                        <span className={s.status === 'AC' ? 'text-green' : 'text-red'}>
                          {s.status}
                        </span>
                      </td>
                      <td className="px-3 py-2 text-right text-yellow">+{s.xp}</td>
                      <td className="px-3 py-2 text-right text-overlay0">{s.date}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-overlay0 font-mono text-sm italic text-center py-4">
              Chưa có lịch sử nộp bài
            </p>
          )}
        </Card>
      </div>
    </div>
  )
}

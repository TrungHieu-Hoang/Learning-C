'use client'
import React, { useState, useEffect, useRef } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { useSession } from 'next-auth/react'
import { Card } from '@/components/ui/Card'
import { StatsCard } from '@/components/profile/StatsCard'
import { StreakDisplay } from '@/components/profile/StreakDisplay'
import { BadgeDisplay } from '@/components/profile/BadgeDisplay'
import { getRank } from '@/types'
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

function formatMemberSince(createdAt: string): string {
  const date = new Date(createdAt)
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
  return `${months[date.getMonth()]} ${date.getFullYear()}`
}

export default function ProfilePage() {
  const params = useParams()
  const id = params.id as string
  const { data: session } = useSession()

  const [profile, setProfile] = useState<ProfileData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const [avatarUploading, setAvatarUploading] = useState(false)
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null)
  const [avatarError, setAvatarError] = useState('')
  const [editingUsername, setEditingUsername] = useState(false)
  const [usernameInput, setUsernameInput] = useState('')
  const [usernameSaving, setUsernameSaving] = useState(false)
  const [usernameError, setUsernameError] = useState('')
  const fileInputRef = useRef<HTMLInputElement>(null)
  const usernameInputRef = useRef<HTMLInputElement>(null)

  const isOwnProfile = session?.user?.id === id

  const handleAvatarClick = () => {
    fileInputRef.current?.click()
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setAvatarError('')

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setAvatarError('Chỉ chấp nhận file ảnh')
      return
    }

    // Validate file size (max 2MB)
    if (file.size > 2 * 1024 * 1024) {
      setAvatarError('Ảnh không được quá 2MB')
      return
    }

    const reader = new FileReader()
    reader.onload = (event) => {
      setAvatarPreview(event.target?.result as string)
    }
    reader.readAsDataURL(file)
  }

  const handleAvatarSave = async () => {
    if (!avatarPreview) return
    setAvatarUploading(true)
    setAvatarError('')
    try {
      const res = await fetch(`/api/users/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ avatar: avatarPreview }),
      })
      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || 'Upload failed')
      }
      const updated = await res.json()
      setProfile((prev) => prev ? { ...prev, avatar: updated.avatar } : prev)
      setAvatarPreview(null)
    } catch (err) {
      setAvatarError(err instanceof Error ? err.message : 'Upload thất bại')
    } finally {
      setAvatarUploading(false)
    }
  }

  const handleAvatarCancel = () => {
    setAvatarPreview(null)
    setAvatarError('')
  }

  const handleUsernameEdit = () => {
    setUsernameInput(profile?.username || '')
    setUsernameError('')
    setEditingUsername(true)
    setTimeout(() => usernameInputRef.current?.focus(), 0)
  }

  const handleUsernameSave = async () => {
    const trimmed = usernameInput.trim()
    if (trimmed.length < 2 || trimmed.length > 30) {
      setUsernameError('Username phải từ 2-30 ký tự')
      return
    }
    if (!/^[a-zA-Z0-9_À-ỹ ]+$/.test(trimmed)) {
      setUsernameError('Username không được chứa ký tự đặc biệt')
      return
    }

    setUsernameSaving(true)
    setUsernameError('')
    try {
      const res = await fetch(`/api/users/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: trimmed }),
      })
      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || 'Save failed')
      }
      const updated = await res.json()
      setProfile((prev) => prev ? { ...prev, username: updated.username } : prev)
      setEditingUsername(false)
    } catch (err) {
      setUsernameError(err instanceof Error ? err.message : 'Lưu thất bại')
    } finally {
      setUsernameSaving(false)
    }
  }

  const handleUsernameCancel = () => {
    setEditingUsername(false)
    setUsernameError('')
  }

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
  const memberSince = formatMemberSince(profile.createdAt)
  const initials = profile.username.slice(0, 2).toUpperCase()

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="animate-fade-in">
        {/* Profile header */}
        <Card className="p-6 mb-6">
          <div className="flex items-center gap-4 mb-4">
            <div className="relative">
              <div
                className={`w-16 h-16 rounded-full bg-surface0 flex items-center justify-center text-2xl font-mono font-bold text-text overflow-hidden ${
                  isOwnProfile ? 'cursor-pointer group' : ''
                }`}
                onClick={isOwnProfile ? handleAvatarClick : undefined}
              >
                {(avatarPreview || profile.avatar) ? (
                  <img
                    src={avatarPreview || profile.avatar || ''}
                    alt=""
                    className="w-full h-full rounded-full object-cover"
                  />
                ) : (
                  <span>{initials}</span>
                )}
                {isOwnProfile && !avatarPreview && (
                  <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <span className="text-white text-xs font-mono">Đổi</span>
                  </div>
                )}
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleFileSelect}
              />
              {avatarError && (
                <p className="text-red text-xs font-mono text-center mt-1 absolute -bottom-5 left-0 right-0">
                  {avatarError}
                </p>
              )}
            </div>
            <div className="min-w-0">
              {editingUsername ? (
                <div>
                  <div className="flex items-center gap-2">
                    <input
                      ref={usernameInputRef}
                      type="text"
                      value={usernameInput}
                      onChange={(e) => setUsernameInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') handleUsernameSave()
                        if (e.key === 'Escape') handleUsernameCancel()
                      }}
                      maxLength={30}
                      className="bg-surface0 border border-surface1 rounded-lg px-2 py-1 text-xl font-bold font-mono text-text outline-none focus:border-green transition-colors w-full"
                    />
                    <button
                      onClick={handleUsernameSave}
                      disabled={usernameSaving}
                      className="shrink-0 px-2 py-1 rounded-lg bg-green text-base font-mono text-xs font-medium hover:bg-green-hover transition-colors disabled:opacity-50"
                    >
                      {usernameSaving ? '...' : 'Lưu'}
                    </button>
                    <button
                      onClick={handleUsernameCancel}
                      disabled={usernameSaving}
                      className="shrink-0 px-2 py-1 rounded-lg bg-surface0 text-text font-mono text-xs hover:bg-surface1 transition-colors disabled:opacity-50 border border-surface1"
                    >
                      Hủy
                    </button>
                  </div>
                  {usernameError && (
                    <p className="text-red text-xs font-mono mt-1">{usernameError}</p>
                  )}
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <h1 className="text-xl font-bold font-mono text-text truncate">{profile.username}</h1>
                  {isOwnProfile && (
                    <button
                      onClick={handleUsernameEdit}
                      className="shrink-0 p-1 rounded-lg text-overlay0 hover:text-text hover:bg-surface0 transition-colors"
                      title="Đổi tên"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                      </svg>
                    </button>
                  )}
                </div>
              )}
              <div className="flex items-center gap-2 mt-1">
                <RankBadge xp={profile.xp} />
                <span className="text-overlay0 text-xs font-mono">· {memberSince}</span>
              </div>
              {avatarPreview && (
                <div className="flex items-center gap-2 mt-2">
                  <button
                    onClick={handleAvatarSave}
                    disabled={avatarUploading}
                    className="px-3 py-1 rounded-lg bg-green text-base font-mono text-xs font-medium hover:bg-green-hover transition-colors disabled:opacity-50"
                  >
                    {avatarUploading ? 'Đang lưu...' : 'Lưu'}
                  </button>
                  <button
                    onClick={handleAvatarCancel}
                    disabled={avatarUploading}
                    className="px-3 py-1 rounded-lg bg-surface0 text-text font-mono text-xs hover:bg-surface1 transition-colors disabled:opacity-50 border border-surface1"
                  >
                    Hủy
                  </button>
                </div>
              )}
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
          <StatsCard title="Rank" value={`#${profile.rank}`} icon="🏅" subtitle={getRank(profile.xp).name} />
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

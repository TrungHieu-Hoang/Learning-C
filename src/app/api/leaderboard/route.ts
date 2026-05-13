import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

function getWeekStart(): Date {
  const d = new Date()
  const day = d.getDay()
  const diff = d.getDate() - day + (day === 0 ? -6 : 1) // Monday
  const monday = new Date(d.setDate(diff))
  monday.setHours(0, 0, 0, 0)
  return monday
}

async function getSolvedCounts(): Promise<Record<string, number>> {
  const solved = await prisma.submission.groupBy({
    by: ['userId', 'problemId'],
    where: { status: 'AC' },
  })
  const counts: Record<string, number> = {}
  for (const s of solved) {
    counts[s.userId] = (counts[s.userId] || 0) + 1
  }
  return counts
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const type = searchParams.get('type') || 'global'
    const solvedCounts = await getSolvedCounts()

    if (type === 'weekly') {
      const weekStart = getWeekStart()

      const weeklyEntries = await prisma.leaderboardWeekly.findMany({
        where: { weekStart: { gte: weekStart } },
        orderBy: { xpThisWeek: 'desc' },
        take: 50,
        include: {
          user: { select: { id: true, username: true, avatar: true, xp: true } },
        },
      })

      const entries = weeklyEntries.map((entry, i) => ({
        rank: i + 1,
        id: entry.user.id,
        username: entry.user.username,
        avatar: entry.user.avatar,
        xp: entry.user.xp,
        xpThisWeek: entry.xpThisWeek,
        problemsSolved: solvedCounts[entry.user.id] || 0,
        streak: 0,
      }))

      return NextResponse.json({ type, entries })
    }

    // Global leaderboard: top users by total XP
    const users = await prisma.user.findMany({
      orderBy: { xp: 'desc' },
      take: 50,
      select: {
        id: true,
        username: true,
        avatar: true,
        xp: true,
        streak: true,
      },
    })

    const entries = users.map((user, i) => ({
      rank: i + 1,
      id: user.id,
      username: user.username,
      avatar: user.avatar,
      xp: user.xp,
      xpThisWeek: 0,
      problemsSolved: solvedCounts[user.id] || 0,
      streak: user.streak,
    }))

    return NextResponse.json({ type, entries })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Internal server error'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}

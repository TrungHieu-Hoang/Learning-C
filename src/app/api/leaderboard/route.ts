import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const type = searchParams.get('type') || 'global'

    if (type === 'weekly') {
      const startOfWeek = new Date()
      startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay())
      startOfWeek.setHours(0, 0, 0, 0)

      const entries = await prisma.leaderboardWeekly.findMany({
        where: { weekStart: { gte: startOfWeek } },
        orderBy: { xpThisWeek: 'desc' },
        take: 50,
        include: {
          user: { select: { id: true, username: true, avatar: true, xp: true } },
        },
      })

      return NextResponse.json({ type, entries })
    }

    // Global leaderboard: top users by total XP
    const { PrismaClient } = await import('@prisma/client')
    const entries = await prisma.user.findMany({
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

    return NextResponse.json({ type, entries })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Internal server error'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}

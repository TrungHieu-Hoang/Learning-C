import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { checkStreak } from '@/lib/streak'

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { problemId, code, status, runtimeMs, memoryKb } = await request.json()

    // Server-side XP calculation — don't trust client
    let finalXp = 0
    if (status === 'AC') {
      const problem = await prisma.problem.findUnique({
        where: { id: problemId },
        select: { difficulty: true },
      })
      if (problem) {
        const xpMap: Record<string, number> = { easy: 30, medium: 50, hard: 100 }
        const baseXp = xpMap[problem.difficulty] || 30
        // Only award XP on first AC
        const existingAc = await prisma.submission.findFirst({
          where: { userId: session.user.id, problemId, status: 'AC' },
        })
        if (!existingAc) finalXp = baseXp
      }
    }

    const submission = await prisma.$transaction(async (tx) => {
      // 1. Create submission
      const sub = await tx.submission.create({
        data: {
          userId: session.user.id,
          problemId,
          code,
          status,
          runtimeMs: runtimeMs || 0,
          memoryKb: memoryKb || 0,
          xpEarned: finalXp,
        },
      })

      // 2. Update user XP
      if (finalXp > 0) {
        await tx.user.update({
          where: { id: session.user.id },
          data: { xp: { increment: finalXp } },
        })
      }

      // 3. Update streak and lastActive
      const user = await tx.user.findUnique({
        where: { id: session.user.id },
        select: { streak: true, lastActive: true },
      })

      if (user) {
        const { streak: streakDelta, isNewDay } = checkStreak(user.lastActive)
        let newStreak: number

        if (isNewDay) {
          // New day: increment if consecutive, otherwise restart at 1
          newStreak = streakDelta > 0 ? user.streak + streakDelta : 1
        } else {
          // Same day: set to 1 if never submitted before, otherwise keep
          newStreak = user.streak > 0 ? user.streak : 1
        }

        await tx.user.update({
          where: { id: session.user.id },
          data: { streak: newStreak, lastActive: new Date() },
        })
      }

      // 4. Update weekly XP
      if (finalXp > 0) {
        const now = new Date()
        const day = now.getDay()
        const diff = now.getDate() - day + (day === 0 ? -6 : 1)
        const weekStart = new Date(now.setDate(diff))
        weekStart.setHours(0, 0, 0, 0)

        await tx.leaderboardWeekly.upsert({
          where: {
            userId_weekStart: { userId: session.user.id, weekStart },
          },
          create: {
            userId: session.user.id,
            weekStart,
            xpThisWeek: finalXp,
          },
          update: {
            xpThisWeek: { increment: finalXp },
          },
        })
      }

      return sub
    })

    return NextResponse.json(submission)
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Internal server error'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const problemId = searchParams.get('problemId')

    const where: Record<string, string> = { userId: session.user.id }
    if (problemId) where.problemId = problemId

    const submissions = await prisma.submission.findMany({
      where,
      orderBy: { submittedAt: 'desc' },
      take: 50,
    })

    return NextResponse.json(submissions)
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Internal server error'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}

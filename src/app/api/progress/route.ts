import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { prisma } from '@/lib/prisma'

export async function POST(request: Request) {
  try {
    const session = await getServerSession()
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { lessonId, isCompleted } = await request.json()
    const userId = session.user.id

    const existing = await prisma.userProgress.findUnique({
      where: { userId_lessonId: { userId, lessonId } },
    })

    const wasAlreadyCompleted = existing?.isCompleted === true
    let progress
    if (existing) {
      progress = await prisma.userProgress.update({
        where: { userId_lessonId: { userId, lessonId } },
        data: {
          isCompleted: isCompleted ?? existing.isCompleted,
          attempts: { increment: 1 },
          completedAt: isCompleted ? new Date() : existing.completedAt,
        },
      })
    } else {
      progress = await prisma.userProgress.create({
        data: {
          userId,
          lessonId,
          isCompleted: isCompleted ?? false,
          attempts: 1,
          completedAt: isCompleted ? new Date() : null,
        },
      })
    }

    // Award XP when newly completed (not already completed before)
    let xpEarned = 0
    if (isCompleted && !wasAlreadyCompleted) {
      const isChallenge = lessonId.endsWith('-challenge')
      xpEarned = isChallenge ? 50 : 10
      await prisma.user.update({
        where: { id: userId },
        data: { xp: { increment: xpEarned } },
      })
    }

    return NextResponse.json({ success: true, progress, xpEarned })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Internal server error'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}

export async function GET(request: Request) {
  try {
    const session = await getServerSession()
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const progress = await prisma.userProgress.findMany({
      where: { userId: session.user.id },
    })

    return NextResponse.json({ userId: session.user.id, progress })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Internal server error'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}

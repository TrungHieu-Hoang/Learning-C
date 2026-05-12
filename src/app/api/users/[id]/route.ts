import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    const user = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        username: true,
        avatar: true,
        xp: true,
        streak: true,
        createdAt: true,
      },
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    const solvedCount = await prisma.submission.groupBy({
      by: ['problemId'],
      where: { userId: id, status: 'AC' },
    })

    const recentSubmissions = await prisma.submission.findMany({
      where: { userId: id },
      orderBy: { submittedAt: 'desc' },
      take: 10,
      select: {
        id: true,
        problemId: true,
        status: true,
        xpEarned: true,
        submittedAt: true,
        problem: { select: { title: true } },
      },
    })

    const rank = await prisma.user.count({
      where: { xp: { gt: user.xp } },
    })

    return NextResponse.json({
      ...user,
      problemsSolved: solvedCount.length,
      rank: rank + 1,
      recentSubmissions: recentSubmissions.map((s) => ({
        id: s.id,
        problem: s.problem.title,
        status: s.status,
        xp: s.xpEarned,
        date: s.submittedAt.toISOString().split('T')[0],
      })),
    })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Internal server error'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}

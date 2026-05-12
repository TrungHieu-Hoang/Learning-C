import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { prisma } from '@/lib/prisma'

export async function POST(request: Request) {
  try {
    const session = await getServerSession()
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { problemId, code, status, runtimeMs, memoryKb, xpEarned } = await request.json()

    const submission = await prisma.submission.create({
      data: {
        userId: session.user.id,
        problemId,
        code,
        status,
        runtimeMs: runtimeMs || 0,
        memoryKb: memoryKb || 0,
        xpEarned: xpEarned || 0,
      },
    })

    return NextResponse.json(submission)
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Internal server error'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const problemId = searchParams.get('problemId')
    const userId = searchParams.get('userId')

    const where: Record<string, string> = {}
    if (problemId) where.problemId = problemId
    if (userId) where.userId = userId

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

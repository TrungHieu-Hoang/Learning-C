import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
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

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession()
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params

    // Only allow user to update their own profile
    if (session.user.id !== id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const { avatar, username } = await request.json()

    const data: Record<string, string> = {}

    if (typeof avatar === 'string') {
      // Validate data URL format and image type
      if (!avatar.startsWith('data:image/')) {
        return NextResponse.json({ error: 'Invalid image format' }, { status: 400 })
      }
      // Limit size to ~2MB (base64 is ~33% larger than binary)
      if (avatar.length > 2_800_000) {
        return NextResponse.json({ error: 'Image too large (max 2MB)' }, { status: 400 })
      }
      data.avatar = avatar
    }

    if (typeof username === 'string') {
      const trimmed = username.trim()
      if (trimmed.length < 2 || trimmed.length > 30) {
        return NextResponse.json({ error: 'Username phải từ 2-30 ký tự' }, { status: 400 })
      }
      if (!/^[a-zA-Z0-9_À-ỹ ]+$/.test(trimmed)) {
        return NextResponse.json({ error: 'Username không được chứa ký tự đặc biệt' }, { status: 400 })
      }
      data.username = trimmed
    }

    if (Object.keys(data).length === 0) {
      return NextResponse.json({ error: 'No data to update' }, { status: 400 })
    }

    const updated = await prisma.user.update({
      where: { id },
      data,
      select: { id: true, username: true, avatar: true },
    })

    return NextResponse.json(updated)
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Internal server error'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}

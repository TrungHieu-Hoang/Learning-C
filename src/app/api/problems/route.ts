import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import type { Prisma } from '@prisma/client'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const difficulty = searchParams.get('difficulty')
    const source = searchParams.get('source')
    const search = searchParams.get('search')

    const where: Prisma.ProblemWhereInput = {}
    if (difficulty && difficulty !== 'all') where.difficulty = difficulty
    if (source && source !== 'all') where.source = source
    if (search) where.title = { contains: search, mode: 'insensitive' }

    const problems = await prisma.problem.findMany({
      where,
      orderBy: { createdAt: 'asc' },
      include: {
        testCases: {
          select: { id: true, isHidden: true, input: true, expectedOutput: true, weight: true },
        },
      },
    })

    return NextResponse.json({ problems, filters: { difficulty, source } })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Internal server error'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}

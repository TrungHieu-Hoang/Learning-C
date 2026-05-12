import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

type Params = Promise<{ id: string }>

export async function GET(request: Request, segmentData: { params: Params }) {
  try {
    const { id } = await segmentData.params

    const problem = await prisma.problem.findUnique({
      where: { id },
      include: {
        testCases: {
          select: { id: true, input: true, expectedOutput: true, isHidden: true, weight: true },
        },
        lesson: {
          select: { id: true, title: true, moduleId: true },
        },
      },
    })

    if (!problem) {
      return NextResponse.json({ error: 'Problem not found' }, { status: 404 })
    }

    return NextResponse.json(problem)
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Internal server error'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}

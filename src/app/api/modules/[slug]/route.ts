import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

type Params = Promise<{ slug: string }>

export async function GET(request: Request, segmentData: { params: Params }) {
  try {
    const { slug } = await segmentData.params

    const moduleData = await prisma.module.findUnique({
      where: { id: slug },
      include: {
        lessons: {
          orderBy: { orderIndex: 'asc' },
        },
      },
    })

    if (!moduleData) {
      return NextResponse.json({ error: 'Module not found' }, { status: 404 })
    }

    return NextResponse.json(moduleData)
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Internal server error'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}

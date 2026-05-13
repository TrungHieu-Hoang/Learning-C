import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    const userId = session?.user?.id

    const modules = await prisma.module.findMany({
      orderBy: { orderIndex: 'asc' },
      include: {
        lessons: {
          orderBy: { orderIndex: 'asc' },
          select: { id: true, title: true, orderIndex: true, lessonType: true },
        },
      },
    })

    // Compute isLocked dynamically for authenticated users
    if (userId) {
      const completedLessons = await prisma.userProgress.findMany({
        where: { userId, isCompleted: true },
        select: { lessonId: true },
      })
      const completedIds = new Set(completedLessons.map((c) => c.lessonId))

      const modulesWithLock = modules.map((mod, index) => {
        if (index === 0) return { ...mod, isLocked: false }
        const prevModule = modules[index - 1]
        const prevAllDone = prevModule.lessons.every((l) => completedIds.has(l.id))
        return { ...mod, isLocked: !prevAllDone }
      })

      return NextResponse.json({ modules: modulesWithLock })
    }

    return NextResponse.json({ modules })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Internal server error'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}

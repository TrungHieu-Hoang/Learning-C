'use client'
import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { ModuleCard } from '@/components/learn/ModuleCard'
import { ProgressBar } from '@/components/learn/ProgressBar'
import { modulesData } from '@/data/lessons'

function getLocalCompleted(): string[] {
  return []
}

export default function LearnPage() {
  const modules = modulesData
  const { data: session, status } = useSession()
  const [completed, setCompleted] = useState<string[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (status === 'loading') return

    if (status === 'authenticated') {
      // Fetch progress from API (per-user, stored in DB)
      fetch('/api/progress')
        .then((r) => r.json())
        .then((data) => {
          const ids = (data.progress || [])
            .filter((p: any) => p.isCompleted)
            .map((p: any) => p.lessonId)
          setCompleted(ids)
        })
        .catch(() => {
          setCompleted([])
        })
        .finally(() => setLoading(false))
    } else {
      // Unauthenticated — use localStorage only
      setCompleted(getLocalCompleted())
      setLoading(false)
    }
  }, [status])

  // Compute isLocked: module N unlocks when ALL lessons in module N-1 are done
  const modulesWithLock = modules.map((mod, i) => {
    const completedCount = mod.lessons.filter((l) => completed.includes(l.id)).length
    return { ...mod, isLocked: false, completedCount }
  })

  const totalLessons = modules.reduce((sum, m) => sum + m.lessons.length, 0)

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-8">
        <div className="flex items-center justify-center py-20">
          <div className="w-8 h-8 border-2 border-overlay0 border-t-transparent rounded-full animate-spin" />
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <div className="mb-8 animate-fade-in">
        <h1 className="text-2xl font-bold font-mono mb-2">Lộ trình học C</h1>
        <p className="text-subtext0 text-sm font-mono mb-4">
          {modules.length} module từ cơ bản đến nâng cao
        </p>
        <ProgressBar value={completed.length} max={totalLessons} size="lg" />
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        {modulesWithLock.map((mod, i) => (
          <ModuleCard
            key={mod.id}
            id={mod.id}
            title={mod.title}
            description={mod.description}
            lessonCount={mod.lessons.length}
            orderIndex={i + 1}
            isLocked={mod.isLocked}
            completedCount={mod.completedCount}
            firstLessonId={mod.lessons[0]?.id || mod.id}
          />
        ))}
      </div>
    </div>
  )
}

'use client'
import { useState } from 'react'
import { ModuleCard } from '@/components/learn/ModuleCard'
import { ProgressBar } from '@/components/learn/ProgressBar'
import { modulesData } from '@/data/lessons'

function getCompleted(): string[] {
  if (typeof window === 'undefined') return []
  try {
    return JSON.parse(localStorage.getItem('completed') || '[]')
  } catch {
    return []
  }
}

export default function LearnPage() {
  const modules = modulesData
  const [completed] = useState(getCompleted)

  // Compute isLocked dynamically: module N unlocks when ALL lessons in module N-1 are done
  const modulesWithLock = modules.map((mod, i) => {
    if (i === 0) return { ...mod, isLocked: false }
    const prevLessonId = modules[i - 1].lessons[0]?.id
    return { ...mod, isLocked: !completed.includes(prevLessonId) }
  })

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <div className="mb-8 animate-fade-in">
        <h1 className="text-2xl font-bold font-mono mb-2">Lộ trình học C</h1>
        <p className="text-subtext0 text-sm font-mono mb-4">
          {modules.length} module từ cơ bản đến nâng cao
        </p>
        <ProgressBar value={completed.length} max={modules.length} size="lg" />
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
            completed={completed.includes(mod.lessons[0]?.id)}
            progress={0}
          />
        ))}
      </div>
    </div>
  )
}

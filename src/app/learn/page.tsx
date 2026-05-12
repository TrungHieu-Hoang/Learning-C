'use client'
import React, { useState, useEffect } from 'react'
import { ModuleCard } from '@/components/learn/ModuleCard'
import { ProgressBar } from '@/components/learn/ProgressBar'

interface ModuleData {
  id: string
  title: string
  description: string
  orderIndex: number
  isLocked: boolean
  lessons: { id: string; title: string; orderIndex: number; lessonType: string }[]
}

export default function LearnPage() {
  const [modules, setModules] = useState<ModuleData[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/modules')
      .then((r) => r.json())
      .then((data) => setModules(data.modules || []))
      .catch(() => setModules([]))
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-8">
        <p className="text-[#6c7086] font-mono">Đang tải...</p>
      </div>
    )
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <div className="mb-8 animate-fade-in">
        <h1 className="text-2xl font-bold font-mono mb-2">Lộ trình học C</h1>
        <p className="text-[#a6adc8] text-sm font-mono mb-4">
          {modules.length} module từ cơ bản đến nâng cao
        </p>
        <ProgressBar value={0} max={modules.length} size="lg" />
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        {modules.map((mod, i) => (
          <ModuleCard
            key={mod.id}
            id={mod.id}
            title={mod.title}
            description={mod.description}
            lessonCount={mod.lessons.length}
            orderIndex={i + 1}
            isLocked={mod.isLocked}
            progress={0}
          />
        ))}
      </div>
    </div>
  )
}

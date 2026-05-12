'use client'
import React from 'react'
import { Card } from '@/components/ui/Card'

interface EditorialProps {
  solution: string
  explanation: string
  isUnlocked: boolean
  hoursUntilUnlock: number
}

export function Editorial({ solution, explanation, isUnlocked, hoursUntilUnlock }: EditorialProps) {
  if (!isUnlocked) {
    return (
      <Card className="p-6 text-center">
        <p className="text-overlay0 font-mono text-sm mb-2">🔒 Editorial bị khóa</p>
        <p className="text-overlay0 font-mono text-xs">
          Mở khóa sau khi AC hoặc {hoursUntilUnlock}h nữa
        </p>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      <Card className="p-4">
        <h3 className="text-text font-medium mb-2 font-mono">Giải thích</h3>
        <p className="text-subtext0 text-sm leading-relaxed">{explanation}</p>
      </Card>
      <Card className="p-4">
        <h3 className="text-text font-medium mb-2 font-mono">Solution</h3>
        <pre className="bg-base p-4 rounded-lg overflow-x-auto text-sm font-mono">
          <code className="text-green">{solution}</code>
        </pre>
      </Card>
    </div>
  )
}

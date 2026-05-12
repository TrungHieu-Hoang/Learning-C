'use client'
import React, { useEffect } from 'react'
import type { Submission } from '@/types'

interface CodeViewModalProps {
  submission: Submission
  onClose: () => void
}

const statusLabels: Record<string, { label: string; color: string }> = {
  AC: { label: 'Accepted', color: 'text-green' },
  WA: { label: 'Wrong Answer', color: 'text-red' },
  TLE: { label: 'Time Limit Exceeded', color: 'text-yellow' },
  CE: { label: 'Compilation Error', color: 'text-peach' },
  RE: { label: 'Runtime Error', color: 'text-red' },
  PENDING: { label: 'Pending', color: 'text-overlay0' },
}

export function CodeViewModal({ submission, onClose }: CodeViewModalProps) {
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [onClose])

  const status = statusLabels[submission.status] || statusLabels.PENDING

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/60" onClick={onClose} />
      <div className="relative bg-mantle border border-surface0 rounded-xl w-[90vw] max-w-3xl max-h-[85vh] flex flex-col shadow-2xl">
        <div className="flex items-center justify-between px-5 py-3 border-b border-surface0">
          <div className="flex items-center gap-4">
            <span className={`text-sm font-mono font-medium ${status.color}`}>{status.label}</span>
            <span className="text-xs font-mono text-overlay0">
              {submission.runtimeMs}ms / {submission.memoryKb}KB
            </span>
            <span className="text-xs font-mono text-overlay0">
              +{submission.xpEarned} XP
            </span>
          </div>
          <button
            onClick={onClose}
            className="text-overlay0 hover:text-text transition-colors p-1"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div className="flex-1 overflow-auto p-5">
          <pre className="bg-base p-4 rounded-lg text-sm font-mono text-text overflow-x-auto whitespace-pre-wrap leading-relaxed">
            {submission.code}
          </pre>
        </div>
      </div>
    </div>
  )
}

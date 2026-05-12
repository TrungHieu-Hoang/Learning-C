'use client'
import React, { useState } from 'react'
import type { Submission } from '@/types'
import { CodeViewModal } from './CodeViewModal'

interface SubmissionHistoryProps {
  submissions: Submission[]
  loading?: boolean
}

const statusIcons: Record<string, { icon: string; color: string }> = {
  AC: { icon: '✓', color: 'text-green' },
  WA: { icon: '✗', color: 'text-red' },
  TLE: { icon: '⚠', color: 'text-yellow' },
  CE: { icon: '⚡', color: 'text-peach' },
  RE: { icon: '✗', color: 'text-red' },
  PENDING: { icon: '○', color: 'text-overlay0' },
}

export function SubmissionHistory({ submissions, loading }: SubmissionHistoryProps) {
  const [viewing, setViewing] = useState<Submission | null>(null)

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="w-5 h-5 border-2 border-overlay0 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (submissions.length === 0) {
    return (
      <div className="flex items-center justify-center py-8">
        <span className="text-overlay0 font-mono text-sm italic">Chưa có lần nộp nào</span>
      </div>
    )
  }

  return (
    <>
      <div className="overflow-auto">
        <table className="w-full text-sm font-mono">
          <thead>
            <tr className="text-overlay0 text-xs border-b border-surface0">
              <th className="px-3 py-2 text-left">#</th>
              <th className="px-3 py-2 text-left">Trạng thái</th>
              <th className="px-3 py-2 text-left">Thời gian</th>
              <th className="px-3 py-2 text-left">Runtime</th>
              <th className="px-3 py-2 text-left">Memory</th>
              <th className="px-3 py-2 text-left">XP</th>
              <th className="px-3 py-2 text-left">Code</th>
            </tr>
          </thead>
          <tbody>
            {submissions.map((s, i) => {
              const st = statusIcons[s.status] || statusIcons.PENDING
              return (
                <tr key={s.id} className="border-b border-surface0 hover:bg-surface0/50 transition-colors">
                  <td className="px-3 py-2 text-overlay0">{submissions.length - i}</td>
                  <td className="px-3 py-2">
                    <span className={`${st.color}`}>{st.icon} {s.status}</span>
                  </td>
                  <td className="px-3 py-2 text-subtext0">
                    {new Date(s.submittedAt).toLocaleDateString('vi-VN', {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </td>
                  <td className="px-3 py-2 text-subtext0">{s.runtimeMs}ms</td>
                  <td className="px-3 py-2 text-subtext0">{s.memoryKb}KB</td>
                  <td className="px-3 py-2 text-yellow">+{s.xpEarned}</td>
                  <td className="px-3 py-2">
                    <button
                      onClick={() => setViewing(s)}
                      className="text-blue hover:text-blue-hover transition-colors text-xs"
                    >
                      Xem code
                    </button>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      {viewing && <CodeViewModal submission={viewing} onClose={() => setViewing(null)} />}
    </>
  )
}

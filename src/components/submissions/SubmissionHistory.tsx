'use client'
import React, { useState } from 'react'
import type { Submission } from '@/types'
import { CodeViewModal } from './CodeViewModal'

interface SubmissionHistoryProps {
  submissions: Submission[]
  loading?: boolean
}

const statusIcons: Record<string, { icon: string; color: string }> = {
  AC: { icon: '✓', color: 'text-[#a6e3a1]' },
  WA: { icon: '✗', color: 'text-[#f38ba8]' },
  TLE: { icon: '⚠', color: 'text-[#f9e2af]' },
  CE: { icon: '⚡', color: 'text-[#fab387]' },
  RE: { icon: '✗', color: 'text-[#f38ba8]' },
  PENDING: { icon: '○', color: 'text-[#6c7086]' },
}

export function SubmissionHistory({ submissions, loading }: SubmissionHistoryProps) {
  const [viewing, setViewing] = useState<Submission | null>(null)

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="w-5 h-5 border-2 border-[#6c7086] border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (submissions.length === 0) {
    return (
      <div className="flex items-center justify-center py-8">
        <span className="text-[#6c7086] font-mono text-sm italic">Chưa có lần nộp nào</span>
      </div>
    )
  }

  return (
    <>
      <div className="overflow-auto">
        <table className="w-full text-sm font-mono">
          <thead>
            <tr className="text-[#6c7086] text-xs border-b border-[#313244]">
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
                <tr key={s.id} className="border-b border-[#313244] hover:bg-[#313244]/50 transition-colors">
                  <td className="px-3 py-2 text-[#6c7086]">{submissions.length - i}</td>
                  <td className="px-3 py-2">
                    <span className={`${st.color}`}>{st.icon} {s.status}</span>
                  </td>
                  <td className="px-3 py-2 text-[#a6adc8]">
                    {new Date(s.submittedAt).toLocaleDateString('vi-VN', {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </td>
                  <td className="px-3 py-2 text-[#a6adc8]">{s.runtimeMs}ms</td>
                  <td className="px-3 py-2 text-[#a6adc8]">{s.memoryKb}KB</td>
                  <td className="px-3 py-2 text-[#f9e2af]">+{s.xpEarned}</td>
                  <td className="px-3 py-2">
                    <button
                      onClick={() => setViewing(s)}
                      className="text-[#89b4fa] hover:text-[#b4d0fb] transition-colors text-xs"
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

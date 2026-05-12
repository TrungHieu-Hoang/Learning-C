'use client'
import React from 'react'
import type { TestResult } from '@/types'

interface TestCasePanelProps {
  results: TestResult[]
  isRunning: boolean
}

export function TestCasePanel({ results, isRunning }: TestCasePanelProps) {
  if (results.length === 0) {
    return (
      <div className="h-full flex items-center justify-center bg-base">
        <span className="text-overlay0 font-mono text-sm italic">
          Nhấn ✓ Submit để kiểm tra kết quả
        </span>
      </div>
    )
  }

  const passed = results.filter((r) => r.passed).length

  return (
    <div className="h-full flex flex-col bg-base">
      <div className="flex items-center justify-between px-4 py-1.5 border-b border-surface0">
        <div className="flex items-center gap-3">
          <span className="text-xs font-mono text-overlay0">Test Cases</span>
          <span className="text-xs font-mono text-green">{passed}/{results.length} passed</span>
        </div>
      </div>
      <div className="flex-1 overflow-auto">
        <table className="w-full text-sm font-mono">
          <thead>
            <tr className="text-overlay0 text-xs border-b border-surface0">
              <th className="px-3 py-2 text-left w-10">#</th>
              <th className="px-3 py-2 text-left">Input</th>
              <th className="px-3 py-2 text-left">Expected</th>
              <th className="px-3 py-2 text-left">Actual</th>
              <th className="px-3 py-2 text-left">Status</th>
              <th className="px-3 py-2 text-left">Time</th>
            </tr>
          </thead>
          <tbody>
            {results.map((tc, i) => (
              <tr
                key={tc.testCaseId}
                className={`border-b border-surface0 ${
                  tc.isHidden ? 'opacity-60' : ''
                }`}
              >
                <td className="px-3 py-2 text-overlay0">{i + 1}</td>
                <td className="px-3 py-2 text-subtext0 max-w-[150px] truncate">
                  {tc.isHidden ? '***' : tc.input || '(none)'}
                </td>
                <td className="px-3 py-2 text-yellow max-w-[150px] truncate">
                  {tc.isHidden ? '***' : tc.expected || '(none)'}
                </td>
                <td className="px-3 py-2 text-text max-w-[150px] truncate">
                  {tc.actual || '(none)'}
                </td>
                <td className="px-3 py-2">
                  {isRunning && tc.actual === 'Running...' ? (
                    <span className="text-yellow">⏳</span>
                  ) : tc.passed ? (
                    <span className="text-green">✓ Pass</span>
                  ) : (
                    <span className="text-red">✗ Fail</span>
                  )}
                </td>
                <td className="px-3 py-2 text-overlay0">{tc.time}s</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

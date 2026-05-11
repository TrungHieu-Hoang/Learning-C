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
      <div className="h-full flex items-center justify-center bg-[#1e1e2e]">
        <span className="text-[#6c7086] font-mono text-sm italic">
          Nhấn ✓ Submit để kiểm tra kết quả
        </span>
      </div>
    )
  }

  const passed = results.filter((r) => r.passed).length

  return (
    <div className="h-full flex flex-col bg-[#1e1e2e]">
      <div className="flex items-center justify-between px-4 py-1.5 border-b border-[#313244]">
        <div className="flex items-center gap-3">
          <span className="text-xs font-mono text-[#6c7086]">Test Cases</span>
          <span className="text-xs font-mono text-[#a6e3a1]">{passed}/{results.length} passed</span>
        </div>
      </div>
      <div className="flex-1 overflow-auto">
        <table className="w-full text-sm font-mono">
          <thead>
            <tr className="text-[#6c7086] text-xs border-b border-[#313244]">
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
                className={`border-b border-[#313244] ${
                  tc.isHidden ? 'opacity-60' : ''
                }`}
              >
                <td className="px-3 py-2 text-[#6c7086]">{i + 1}</td>
                <td className="px-3 py-2 text-[#a6adc8] max-w-[150px] truncate">
                  {tc.isHidden ? '***' : tc.input || '(none)'}
                </td>
                <td className="px-3 py-2 text-[#f9e2af] max-w-[150px] truncate">
                  {tc.isHidden ? '***' : tc.expected || '(none)'}
                </td>
                <td className="px-3 py-2 text-[#cdd6f4] max-w-[150px] truncate">
                  {tc.actual || '(none)'}
                </td>
                <td className="px-3 py-2">
                  {isRunning && tc.actual === 'Running...' ? (
                    <span className="text-[#f9e2af]">⏳</span>
                  ) : tc.passed ? (
                    <span className="text-[#a6e3a1]">✓ Pass</span>
                  ) : (
                    <span className="text-[#f38ba8]">✗ Fail</span>
                  )}
                </td>
                <td className="px-3 py-2 text-[#6c7086]">{tc.time}s</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

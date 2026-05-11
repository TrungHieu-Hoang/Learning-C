'use client'
import { useState, useCallback } from 'react'
import { useEditorStore } from '@/store/editorStore'
import { runCode, runTestCase } from '@/lib/judge0'
import type { TestResult } from '@/types'

export function useJudge() {
  const { code, stdin, setIsRunning, setOutput, setError, isRunning } = useEditorStore()
  const [testResults, setTestResults] = useState<TestResult[]>([])
  const [showTestPanel, setShowTestPanel] = useState(false)

  const handleRun = useCallback(async () => {
    setIsRunning(true)
    setOutput('Running...')
    setError('')
    setShowTestPanel(false)

    try {
      const result = await runCode(code, stdin)
      if (result.stderr || result.compile_output) {
        setError(result.stderr || result.compile_output)
      }
      setOutput(result.stdout || '(no output)')
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to run code'
      setError(message)
      setOutput('')
    } finally {
      setIsRunning(false)
    }
  }, [code, stdin, setIsRunning, setOutput, setError])

  const handleTestCases = useCallback(
    async (testCases: { input: string; expectedOutput: string; isHidden: boolean }[]) => {
      setIsRunning(true)
      setShowTestPanel(true)
      const results: TestResult[] = []

      for (let i = 0; i < testCases.length; i++) {
        const tc = testCases[i]
        results.push({
          testCaseId: `tc-${i}`,
          input: tc.input,
          expected: tc.expectedOutput,
          actual: 'Running...',
          passed: false,
          time: '0',
          isHidden: tc.isHidden,
        })
        setTestResults([...results])

        try {
          const r = await runTestCase(code, tc.input, tc.expectedOutput)
          results[i] = {
            testCaseId: `tc-${i}`,
            input: tc.input,
            expected: tc.expectedOutput,
            actual: r.actual,
            passed: r.passed,
            time: r.time,
            isHidden: tc.isHidden,
          }
        } catch {
          results[i] = {
            testCaseId: `tc-${i}`,
            input: tc.input,
            expected: tc.expectedOutput,
            actual: 'Error',
            passed: false,
            time: '0',
            isHidden: tc.isHidden,
          }
        }
        setTestResults([...results])
      }

      setIsRunning(false)
      return results
    },
    [code, setIsRunning]
  )

  return { handleRun, handleTestCases, testResults, showTestPanel, isRunning }
}

import { NextResponse } from 'next/server'
import { runCode, runTestCase } from '@/lib/judge0'

export async function POST(request: Request) {
  try {
    const { code, stdin, language, testCases, timeLimit, memoryLimit } = await request.json()

    if (testCases && Array.isArray(testCases)) {
      const results = await Promise.all(
        testCases.map((tc: { input: string; expectedOutput: string }) =>
          runTestCase(code, tc.input, tc.expectedOutput, language || 'c', timeLimit || 5, memoryLimit || 256)
        )
      )
      return NextResponse.json({ results })
    }

    const result = await runCode(code, stdin || '', language || 'c', timeLimit || 5, memoryLimit || 256)
    return NextResponse.json(result)
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Internal server error'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}

const API_URL = '/api/execute'

async function executeCode(code: string, stdin: string, timeLimit: number, memoryLimit: number) {
  const res = await fetch(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ code, stdin, timeLimit, memoryLimit }),
  })

  if (!res.ok) {
    const text = await res.text().catch(() => '')
    throw new Error(`Server error ${res.status}: ${text}`)
  }

  return res.json()
}

export async function runCode(
  code: string,
  stdin: string = '',
  _language: string = 'c',
  timeLimit: number = 5,
  memoryLimit: number = 256
) {
  return executeCode(code, stdin, timeLimit, memoryLimit)
}

export async function runTestCase(
  code: string,
  input: string,
  expectedOutput: string,
  _language: string = 'c',
  timeLimit: number = 5,
  memoryLimit: number = 256
) {
  const data = await executeCode(code, input, timeLimit, memoryLimit)

  const actual = (data.stdout || '').trimEnd()
  const expected = expectedOutput.trimEnd()
  const passed = actual === expected
  const exitCode = data.exit_code ?? 0

  return {
    passed,
    actual,
    stderr: data.stderr || data.compile_output || '',
    time: data.time || '0',
    memory: data.memory || 0,
    status: exitCode === 124 ? 'TLE' : data.compile_output ? 'CE' : exitCode !== 0 ? 'RE' : passed ? 'AC' : 'WA',
  }
}

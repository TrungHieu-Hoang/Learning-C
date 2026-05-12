const PISTON_URL = process.env.NEXT_PUBLIC_PISTON_URL || process.env.PISTON_URL || 'https://emkc.org/api/v2/piston'

const LANGUAGE_MAP: Record<string, { language: string; version: string }> = {
  c: { language: 'c', version: '10.2.0' },
  cpp: { language: 'cpp', version: '10.2.0' },
  python: { language: 'python', version: '3.10.0' },
}

export interface Judge0Submission {
  source_code: string
  language_id: number
  stdin: string
  expected_output?: string
  cpu_time_limit?: number
  memory_limit?: number
}

async function pistonExecute(code: string, stdin: string, language: string, timeLimit: number, memoryLimit: number) {
  const lang = LANGUAGE_MAP[language] || LANGUAGE_MAP.c
  const res = await fetch(`${PISTON_URL}/execute`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      language: lang.language,
      version: lang.version,
      files: [{ name: 'main.c', content: code }],
      stdin,
      args: [],
      compile_timeout: timeLimit * 1000,
      run_timeout: timeLimit * 1000,
      memory_limit: memoryLimit * 1000,
    }),
  })

  if (!res.ok) {
    const text = await res.text().catch(() => '')
    throw new Error(`Piston error ${res.status}: ${text}`)
  }

  return res.json()
}

export async function createSubmission(
  code: string,
  stdin: string,
  language: string = 'c',
  expectedOutput?: string,
  timeLimit: number = 5,
  memoryLimit: number = 256
) {
  // Piston is synchronous; return a mock token
  const result = await pistonExecute(code, stdin, language, timeLimit, memoryLimit)
  return JSON.stringify(result)
}

export async function getSubmission(token: string) {
  const data = JSON.parse(token)

  const compileOutput = data.compile?.stderr || ''
  const runStdout = data.run?.stdout || ''
  const runStderr = data.run?.stderr || ''
  const exitCode = data.run?.code ?? -1

  // If compile error, report as compile_output
  if (data.compile && data.compile.code !== 0) {
    return {
      stdout: '',
      stderr: '',
      compile_output: data.compile.stderr || data.compile.output || 'Compilation error',
      exit_code: data.compile.code,
      time: '0',
      memory: 0,
      status: { id: 6, description: 'Compilation Error' },
    }
  }

  return {
    stdout: runStdout,
    stderr: runStderr,
    compile_output: compileOutput,
    exit_code: exitCode,
    time: '0',
    memory: 0,
    status: { id: exitCode === 0 ? 3 : 4, description: exitCode === 0 ? 'Accepted' : 'Wrong Answer' },
  }
}

export async function runCode(
  code: string,
  stdin: string = '',
  language: string = 'c',
  timeLimit: number = 5,
  memoryLimit: number = 256
) {
  const data = await pistonExecute(code, stdin, language, timeLimit, memoryLimit)

  const compileOutput = data.compile?.stderr || ''
  const runStdout = data.run?.stdout || ''
  const runStderr = data.run?.stderr || ''

  // Compile error
  if (data.compile && data.compile.code !== 0) {
    return {
      stdout: '',
      stderr: '',
      compile_output: data.compile.stderr || data.compile.output || 'Compilation error',
      exit_code: data.compile.code,
      time: '0',
      memory: 0,
      status: { id: 6, description: 'Compilation Error' },
    }
  }

  return {
    stdout: runStdout,
    stderr: runStderr,
    compile_output: compileOutput,
    exit_code: data.run?.code ?? 0,
    time: '0',
    memory: 0,
    status: { id: 3, description: 'Accepted' },
  }
}

export async function runTestCase(
  code: string,
  input: string,
  expectedOutput: string,
  language: string = 'c',
  timeLimit: number = 5,
  memoryLimit: number = 256
) {
  const data = await pistonExecute(code, input, language, timeLimit, memoryLimit)

  // Compile error
  if (data.compile && data.compile.code !== 0) {
    return {
      passed: false,
      actual: '',
      stderr: data.compile.stderr || data.compile.output || 'Compilation error',
      time: '0',
      memory: 0,
      status: 'CE',
    }
  }

  const actual = (data.run?.stdout || '').trimEnd()
  const stderr = data.run?.stderr || ''
  const exitCode = data.run?.code ?? 0
  const passed = actual === expectedOutput.trimEnd()

  return {
    passed,
    actual,
    stderr,
    time: '0',
    memory: 0,
    status: exitCode !== 0 ? 'RE' : passed ? 'AC' : 'WA',
  }
}

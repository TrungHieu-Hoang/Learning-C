const JUDGE0_URL = process.env.JUDGE0_URL || 'https://judge0-ce.p.rapidapi.com'
const JUDGE0_KEY = process.env.JUDGE0_API_KEY || ''
const JUDGE0_HOST = process.env.JUDGE0_HOST || 'judge0-ce.p.rapidapi.com'

const LANGUAGE_MAP: Record<string, number> = { c: 50, cpp: 54, python: 71 }

export interface Judge0Submission {
  source_code: string
  language_id: number
  stdin: string
  expected_output?: string
  cpu_time_limit?: number
  memory_limit?: number
}

async function judge0Fetch(path: string, options: RequestInit = {}) {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  }
  if (JUDGE0_KEY) headers['X-RapidAPI-Key'] = JUDGE0_KEY
  if (JUDGE0_HOST) headers['X-RapidAPI-Host'] = JUDGE0_HOST

  const res = await fetch(`${JUDGE0_URL}${path}`, { ...options, headers })
  if (!res.ok) {
    const text = await res.text().catch(() => '')
    throw new Error(`Judge0 error ${res.status}: ${text}`)
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
  const body: Judge0Submission = {
    source_code: Buffer.from(code).toString('base64'),
    language_id: LANGUAGE_MAP[language] || 50,
    stdin: Buffer.from(stdin).toString('base64'),
    cpu_time_limit: timeLimit,
    memory_limit: memoryLimit,
  }
  if (expectedOutput !== undefined) {
    body.expected_output = Buffer.from(expectedOutput).toString('base64')
  }

  const data = await judge0Fetch('/submissions?base64_encoded=true&wait=false', {
    method: 'POST',
    body: JSON.stringify(body),
  })
  return data.token as string
}

export async function getSubmission(token: string) {
  const data = await judge0Fetch(
    `/submissions/${token}?base64_encoded=true&fields=stdout,stderr,compile_output,exit_code,time,memory,status`
  )

  const decode = (s: string | null | undefined) => {
    if (!s) return ''
    try {
      return Buffer.from(s, 'base64').toString('utf-8')
    } catch {
      return s
    }
  }

  return {
    stdout: decode(data.stdout),
    stderr: decode(data.stderr),
    compile_output: decode(data.compile_output),
    exit_code: data.exit_code ?? -1,
    time: data.time || '0',
    memory: data.memory || 0,
    status: data.status || { id: 0, description: 'Unknown' },
  }
}

export async function runCode(
  code: string,
  stdin: string = '',
  language: string = 'c',
  timeLimit: number = 5,
  memoryLimit: number = 256
) {
  const token = await createSubmission(code, stdin, language, undefined, timeLimit, memoryLimit)

  let result
  for (let i = 0; i < 30; i++) {
    await new Promise((r) => setTimeout(r, 500))
    result = await getSubmission(token)
    if (result.status.id >= 3) break
  }
  return result!
}

export async function runTestCase(
  code: string,
  input: string,
  expectedOutput: string,
  language: string = 'c',
  timeLimit: number = 5,
  memoryLimit: number = 256
) {
  const token = await createSubmission(code, input, language, expectedOutput, timeLimit, memoryLimit)

  let result
  for (let i = 0; i < 30; i++) {
    await new Promise((r) => setTimeout(r, 500))
    result = await getSubmission(token)
    if (result.status.id >= 3) break
  }

  const r = result!
  const statusId = r.status.id
  const passed = statusId === 3

  return {
    passed,
    actual: r.stdout.trim(),
    stderr: r.stderr,
    time: r.time,
    memory: r.memory,
    status: statusId === 4 ? 'WA' : statusId === 5 ? 'TLE' : statusId === 6 ? 'CE' : statusId >= 7 ? 'RE' : passed ? 'AC' : 'WA',
  }
}

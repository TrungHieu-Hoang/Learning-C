import { NextRequest, NextResponse } from 'next/server'
import { execSync } from 'node:child_process'
import { writeFile, unlink, rmdir, mkdtemp } from 'node:fs/promises'
import { join } from 'node:path'
import { tmpdir } from 'node:os'

const MAX_CODE_SIZE = 64 * 1024  // 64KB
const COMPILE_TIMEOUT = 10_000   // 10s
const RUN_TIMEOUT = 5_000        // 5s
const MAX_OUTPUT_SIZE = 1024 * 1024 // 1MB

export async function POST(req: NextRequest) {
  let tmpDir: string | undefined
  let sourcePath: string | undefined
  let binaryPath: string | undefined
  let stdinPath: string | undefined

  try {
    const body = await req.json()
    const { code, stdin = '', timeLimit = 5 } = body

    if (!code || typeof code !== 'string') {
      return NextResponse.json({ error: 'Missing code' }, { status: 400 })
    }
    if (code.length > MAX_CODE_SIZE) {
      return NextResponse.json({ error: 'Code too large' }, { status: 400 })
    }

    tmpDir = await mkdtemp(join(tmpdir(), 'clearn-'))
    sourcePath = join(tmpDir, 'main.c')
    binaryPath = join(tmpDir, 'main')
    stdinPath = join(tmpDir, 'stdin.txt')

    await writeFile(sourcePath, code)
    await writeFile(stdinPath, stdin)

    // Compile
    try {
      execSync(`gcc "${sourcePath}" -o "${binaryPath}" -O2 -lm -Wall`, {
        timeout: COMPILE_TIMEOUT,
        maxBuffer: MAX_OUTPUT_SIZE,
      })
    } catch (compileErr: unknown) {
      const err = compileErr as any
      return NextResponse.json({
        stdout: '',
        stderr: '',
        compile_output: err.stderr?.toString() || err.message || 'Compilation error',
        exit_code: 1,
        time: '0',
        memory: 0,
        status: { id: 6, description: 'Compilation Error' },
      })
    }

    // Run
    try {
      const stdout = execSync(`"${binaryPath}" < "${stdinPath}"`, {
        timeout: RUN_TIMEOUT,
        maxBuffer: MAX_OUTPUT_SIZE,
      })
      return NextResponse.json({
        stdout: stdout.toString(),
        stderr: '',
        compile_output: '',
        exit_code: 0,
        time: '0',
        memory: 0,
        status: { id: 3, description: 'Accepted' },
      })
    } catch (runErr: unknown) {
      const err = runErr as any
      if (err.killed || err.signal) {
        return NextResponse.json({
          stdout: err.stdout?.toString() || '',
          stderr: 'Time Limit Exceeded',
          compile_output: '',
          exit_code: 124,
          time: timeLimit.toString(),
          memory: 0,
          status: { id: 5, description: 'Time Limit Exceeded' },
        })
      }
      return NextResponse.json({
        stdout: err.stdout?.toString() || '',
        stderr: err.stderr?.toString() || 'Runtime error',
        compile_output: '',
        exit_code: err.status ?? 1,
        time: '0',
        memory: 0,
        status: { id: 7, description: 'Runtime Error' },
      })
    }
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Internal error'
    return NextResponse.json({ error: message }, { status: 500 })
  } finally {
    if (sourcePath) unlink(sourcePath).catch(() => {})
    if (binaryPath) unlink(binaryPath).catch(() => {})
    if (stdinPath) unlink(stdinPath).catch(() => {})
    if (tmpDir) unlink(tmpDir).catch(() => {})
  }
}

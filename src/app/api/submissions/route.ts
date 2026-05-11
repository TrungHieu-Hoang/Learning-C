import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const { problemId, code, testCases } = await request.json()

    // TODO: Run test cases via Judge0, save submission to database
    // For now, return mock result
    const passedPublic = 3
    const totalPublic = 3
    const passedHidden = 2
    const totalHidden = 2

    return NextResponse.json({
      problemId,
      status: passedPublic === totalPublic && passedHidden === totalHidden ? 'AC' : 'WA',
      passedPublic,
      totalPublic,
      passedHidden,
      totalHidden,
      xpEarned: passedPublic === totalPublic ? 30 : 0,
      runtimeMs: 45,
      memoryKb: 1024,
    })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Internal server error'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}

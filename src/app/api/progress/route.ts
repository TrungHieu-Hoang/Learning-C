import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const { lessonId, isCompleted } = await request.json()
    // TODO: Save to database
    return NextResponse.json({ success: true, lessonId, isCompleted })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Internal server error'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const userId = searchParams.get('userId')

  return NextResponse.json({
    userId,
    progress: [],
  })
}

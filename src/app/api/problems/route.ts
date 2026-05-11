import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const difficulty = searchParams.get('difficulty')
  const source = searchParams.get('source')

  // TODO: Fetch from database with filters
  return NextResponse.json({
    problems: [],
    filters: { difficulty, source },
  })
}

import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const type = searchParams.get('type') || 'global'

  // TODO: Fetch from database
  return NextResponse.json({
    type,
    entries: [],
  })
}

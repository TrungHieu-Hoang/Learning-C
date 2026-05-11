import { NextResponse } from 'next/server'
import { checkStreak } from '@/lib/streak'

export async function POST(request: Request) {
  try {
    const { lastActive } = await request.json()
    const result = checkStreak(lastActive)
    return NextResponse.json(result)
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Internal server error'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}

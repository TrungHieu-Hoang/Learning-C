import { NextResponse } from 'next/server'

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  return NextResponse.json({
    id,
    status: 'AC',
    xpEarned: 30,
    runtimeMs: 42,
    memoryKb: 1024,
    submittedAt: new Date().toISOString(),
  })
}

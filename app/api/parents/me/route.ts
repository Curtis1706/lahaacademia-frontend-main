import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'

export async function GET(_req: NextRequest) {
  const apiBase = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api'
  const raw = cookies().get('user_session')?.value
  const token = raw ? (() => { try { return JSON.parse(raw).token } catch { return undefined } })() : undefined
  const res = await fetch(`${apiBase}/parents/me/`, {
    cache: 'no-store',
    headers: token ? { Authorization: `Token ${token}` } : undefined,
  })
  const data = await res.json().catch(() => ({}))
  return NextResponse.json(data, { status: res.status })
}



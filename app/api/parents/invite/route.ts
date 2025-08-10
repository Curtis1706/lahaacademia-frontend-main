import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'

export async function POST(req: NextRequest) {
  const apiBase = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api'
  const body = await req.json()
  const raw = cookies().get('user_session')?.value
  const token = raw ? (() => { try { return JSON.parse(raw).token } catch { return undefined } })() : undefined
  const res = await fetch(`${apiBase}/parents/invite/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: `Token ${token}` } : {}) },
    body: JSON.stringify(body),
  })
  const data = await res.json().catch(() => ({}))
  return NextResponse.json(data, { status: res.status })
}



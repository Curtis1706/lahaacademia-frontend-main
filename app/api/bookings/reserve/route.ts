import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'

export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
  try {
    const userSession = cookies().get('user_session')?.value
    if (!userSession) {
      return NextResponse.json({ error: 'Non authentifié' }, { status: 401 })
    }
    const user = JSON.parse(userSession)

    const body = await request.json().catch(() => ({}))
    const envBase = (process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/api').replace(/\/$/, '')
    const apiBase = (envBase.includes('localhost:3000') || envBase.includes('127.0.0.1:3000')) ? 'http://127.0.0.1:8000/api' : envBase

    const res = await fetch(`${apiBase}/bookings/reserve/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Token ${user.token}`,
      },
      body: JSON.stringify(body),
    })
    let data: any = {}
    try { data = await res.json() } catch {}
    return NextResponse.json(data, { status: res.status })
  } catch (err) {
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}








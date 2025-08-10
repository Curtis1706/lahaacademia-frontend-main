import { NextRequest, NextResponse } from 'next/server'

export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  const apiBase = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api'
  const res = await fetch(`${apiBase}/teachers/${params.id}/availability/`, { cache: 'no-store' })
  const raw = await res.json().catch(() => ({}))
  // Normaliser côté proxy pour un format stable { monday: [{start,end}], ... }
  let normalized: Record<string, Array<{ start: string; end: string }>> = {}
  const avail = raw?.availability
  if (Array.isArray(avail)) {
    for (const item of avail) {
      const day = String(item?.day || '').toLowerCase()
      const slots = Array.isArray(item?.slots) ? item.slots : []
      if (!normalized[day]) normalized[day] = []
      for (const s of slots) {
        if (s?.start && s?.end) normalized[day].push({ start: s.start, end: s.end })
      }
    }
  } else if (avail && typeof avail === 'object') {
    normalized = avail
  }
  return NextResponse.json({ availability: normalized }, { status: res.status })
}



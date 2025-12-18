import { NextRequest, NextResponse } from 'next/server'
import logger from '@/lib/logger'

/**
 * API pour exporter les rapports en PDF
 * GET /api/admin/analytics/export?type=overview|teachers|courses|students&period=month|year
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    
    const cookieTokenRaw =
      request.cookies.get('user_session_client')?.value ||
      request.cookies.get('user_session')?.value

    let token: string | null = null

    if (cookieTokenRaw) {
      try {
        const sessionData = JSON.parse(decodeURIComponent(cookieTokenRaw))
        token = sessionData?.token || null
      } catch (e) {
        logger.error('Failed to parse session cookie', e as Error, { context: 'admin/analytics/export' })
      }
    }

    if (!token) {
      return NextResponse.json({ error: 'Token requis' }, { status: 401 })
    }

    const baseApi = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api').replace(/\/$/, '')
    
    const params = new URLSearchParams()
    const type = searchParams.get('type') || 'overview'
    const period = searchParams.get('period')
    
    params.append('type', type)
    if (period) params.append('period', period)
    
    const endpoint = `${baseApi}/admin/analytics/export/?${params.toString()}`

    logger.info('Exporting analytics report', { type, period }, { context: 'admin/analytics/export' })

    const response = await fetch(endpoint, {
      method: 'GET',
      headers: {
        'Authorization': `Token ${token}`,
        'Content-Type': 'application/json'
      }
    })

    if (!response.ok) {
      const data = await response.json().catch(() => ({}))
      logger.error('Failed to export report', new Error('Django API error'), {
        context: 'admin/analytics/export',
        data: { status: response.status, error: data }
      })
      return NextResponse.json(
        data || { error: 'Erreur lors de l\'export' },
        { status: response.status }
      )
    }

    // Si c'est un fichier PDF, le retourner directement
    const contentType = response.headers.get('content-type')
    if (contentType?.includes('application/pdf')) {
      const blob = await response.blob()
      return new NextResponse(blob, {
        headers: {
          'Content-Type': 'application/pdf',
          'Content-Disposition': response.headers.get('content-disposition') || `attachment; filename="rapport-${type}-${Date.now()}.pdf"`
        }
      })
    }

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    logger.error('Error exporting report', error as Error, { context: 'admin/analytics/export' })
    return NextResponse.json({ error: 'Erreur interne du serveur' }, { status: 500 })
  }
}


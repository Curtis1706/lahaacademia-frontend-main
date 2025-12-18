import { NextRequest, NextResponse } from 'next/server'
import logger from '@/lib/logger'

/**
 * API pour exporter les données financières
 * GET /api/admin/finances/export
 * Query params: ?format=csv|excel&period=monthly|yearly&year=2024&month=12
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
        logger.error('Failed to parse session cookie', e as Error, { context: 'admin/finances/export' })
      }
    }

    if (!token) {
      return NextResponse.json({ error: 'Token requis' }, { status: 401 })
    }

    const baseApi = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api').replace(/\/$/, '')
    
    // Construire les query params
    const params = new URLSearchParams()
    const format = searchParams.get('format') || 'csv'
    const period = searchParams.get('period')
    const year = searchParams.get('year')
    const month = searchParams.get('month')
    
    params.append('format', format)
    if (period) params.append('period', period)
    if (year) params.append('year', year)
    if (month) params.append('month', month)
    
    const endpoint = `${baseApi}/admin/finances/export/?${params.toString()}`

    logger.info('Exporting financial data', { format, period, year, month }, { context: 'admin/finances/export' })

    const response = await fetch(endpoint, {
      method: 'GET',
      headers: {
        'Authorization': `Token ${token}`,
        'Content-Type': 'application/json'
      }
    })

    if (!response.ok) {
      const data = await response.json().catch(() => ({}))
      logger.error('Failed to export financial data', new Error('Django API error'), {
        context: 'admin/finances/export',
        data: { status: response.status, error: data }
      })
      return NextResponse.json(
        data || { error: 'Erreur lors de l\'export' },
        { status: response.status }
      )
    }

    // Si c'est un fichier, le retourner directement
    const contentType = response.headers.get('content-type')
    if (contentType?.includes('text/csv') || contentType?.includes('application/vnd.openxmlformats')) {
      const blob = await response.blob()
      return new NextResponse(blob, {
        headers: {
          'Content-Type': contentType,
          'Content-Disposition': response.headers.get('content-disposition') || `attachment; filename="finances-${Date.now()}.${format}"`
        }
      })
    }

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    logger.error('Error exporting financial data', error as Error, { context: 'admin/finances/export' })
    return NextResponse.json({ error: 'Erreur interne du serveur' }, { status: 500 })
  }
}


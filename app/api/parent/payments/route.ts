import { NextRequest, NextResponse } from "next/server"
import logger from "@/lib/logger"

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"

export async function GET(request: NextRequest) {
  try {
    // Récupérer le token depuis les cookies (prioritaire) ou headers
    const cookieTokenRaw =
      request.cookies.get('user_session_client')?.value ||
      request.cookies.get('user_session')?.value
    const authHeader = request.headers.get('Authorization')

    let token: string | null = null

    if (cookieTokenRaw) {
      try {
        const sessionData = JSON.parse(decodeURIComponent(cookieTokenRaw))
        token = sessionData?.token || null
      } catch (e) {
        logger.error('Failed to parse session cookie', e as Error, { context: 'parent/payments' })
      }
    }

    if (!token && authHeader?.startsWith('Bearer ') || authHeader?.startsWith('Token ')) {
      token = authHeader.replace('Bearer ', '').replace('Token ', '')
    }
    
    if (!token) {
      return NextResponse.json({ error: "Token d'authentification requis" }, { status: 401 })
    }

    const response = await fetch(`${API_BASE_URL}/api/parent/payments/`, {
      method: "GET",
      headers: {
        "Authorization": `Token ${token}`,
        "Content-Type": "application/json",
      },
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      logger.error('Erreur API Django payments', new Error('fetch error'), {
        context: 'parent/payments',
        data: { status: response.status, errorData }
      })
      throw new Error(`Erreur API: ${response.status}`)
    }

    const paymentData = await response.json()
    
    // Normaliser les données pour le frontend
    const normalizedData = {
      paymentMethods: paymentData.payment_methods?.map((method: any) => ({
        id: method.id,
        type: method.type,
        name: method.name,
        details: method.details,
        is_default: method.is_default || false,
        is_verified: method.is_verified || false,
        expiry_date: method.expiry_date
      })) || [],
      transactions: paymentData.transactions?.map((transaction: any) => ({
        id: transaction.id,
        amount: transaction.amount,
        currency: transaction.currency,
        type: transaction.type,
        status: transaction.status,
        description: transaction.description,
        child_name: transaction.child_name,
        course_title: transaction.course_title,
        teacher_name: transaction.teacher_name,
        payment_method: transaction.payment_method,
        transaction_date: transaction.transaction_date,
        due_date: transaction.due_date,
        reference: transaction.reference,
        fees: transaction.fees || 0,
        net_amount: transaction.net_amount || transaction.amount
      })) || [],
      invoices: paymentData.invoices?.map((invoice: any) => ({
        id: invoice.id,
        invoice_number: invoice.invoice_number,
        amount: invoice.amount,
        currency: invoice.currency,
        status: invoice.status,
        due_date: invoice.due_date,
        paid_date: invoice.paid_date,
        child_name: invoice.child_name,
        course_title: invoice.course_title,
        teacher_name: invoice.teacher_name,
        items: invoice.items || [],
        subtotal: invoice.subtotal || invoice.amount,
        tax: invoice.tax || 0,
        total: invoice.total || invoice.amount,
        payment_method: invoice.payment_method,
        created_at: invoice.created_at
      })) || [],
      paymentSummary: {
        total_spent: paymentData.summary?.total_spent || 0,
        monthly_spent: paymentData.summary?.monthly_spent || 0,
        pending_payments: paymentData.summary?.pending_payments || 0,
        upcoming_payments: paymentData.summary?.upcoming_payments || 0,
        active_subscriptions: paymentData.summary?.active_subscriptions || 0,
        average_monthly_cost: paymentData.summary?.average_monthly_cost || 0
      }
    }

    return NextResponse.json({
      success: true,
      data: normalizedData
    })

  } catch (error) {
    logger.error("Erreur lors de la récupération des paiements", error as Error, { context: 'parent/payments' })
    return NextResponse.json(
      { 
        error: "Erreur lors de la récupération des paiements",
        details: error instanceof Error ? error.message : "Erreur inconnue"
      }, 
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    // Récupérer le token depuis les cookies (prioritaire) ou headers
    const cookieTokenRaw =
      request.cookies.get('user_session_client')?.value ||
      request.cookies.get('user_session')?.value
    const authHeader = request.headers.get('Authorization')

    let token: string | null = null

    if (cookieTokenRaw) {
      try {
        const sessionData = JSON.parse(decodeURIComponent(cookieTokenRaw))
        token = sessionData?.token || null
      } catch (e) {
        logger.error('Failed to parse session cookie', e as Error, { context: 'parent/payments/POST' })
      }
    }

    if (!token && authHeader?.startsWith('Bearer ') || authHeader?.startsWith('Token ')) {
      token = authHeader.replace('Bearer ', '').replace('Token ', '')
    }
    
    if (!token) {
      return NextResponse.json({ error: "Token d'authentification requis" }, { status: 401 })
    }

    const body = await request.json()
    const { action, payment_data, invoice_id, payment_method_id } = body

    if (!action) {
      return NextResponse.json({ error: "Action requise" }, { status: 400 })
    }

    let endpoint = ""
    let method = "POST"

    switch (action) {
      case "add_payment_method":
        endpoint = `/api/parent/payments/methods/`
        break
      case "update_payment_method":
        if (!payment_method_id) {
          return NextResponse.json({ error: "payment_method_id requis" }, { status: 400 })
        }
        endpoint = `/api/parent/payments/methods/${payment_method_id}/`
        method = "PUT"
        break
      case "delete_payment_method":
        if (!payment_method_id) {
          return NextResponse.json({ error: "payment_method_id requis" }, { status: 400 })
        }
        endpoint = `/api/parent/payments/methods/${payment_method_id}/`
        method = "DELETE"
        break
      case "pay_invoice":
        if (!invoice_id) {
          return NextResponse.json({ error: "invoice_id requis" }, { status: 400 })
        }
        endpoint = `/api/parent/payments/invoices/${invoice_id}/pay/`
        break
      case "process_payment":
        endpoint = `/api/parent/payments/process/`
        break
      case "request_refund":
        endpoint = `/api/parent/payments/refund/`
        break
      default:
        return NextResponse.json({ error: "Action non supportée" }, { status: 400 })
    }

    const requestBody = action === "delete_payment_method" ? undefined : payment_data

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method,
      headers: {
        "Authorization": `Token ${token}`,
        "Content-Type": "application/json",
      },
      body: requestBody ? JSON.stringify(requestBody) : undefined,
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      logger.error('Erreur API Django action payments', new Error('fetch error'), {
        context: 'parent/payments/POST',
        data: { status: response.status, errorData }
      })
      throw new Error(`Erreur API: ${response.status}`)
    }

    const result = await response.json()

    return NextResponse.json({
      success: true,
      data: result
    })

  } catch (error) {
    logger.error("Erreur lors de l'action sur les paiements", error as Error, { context: 'parent/payments/POST' })
    return NextResponse.json(
      { 
        error: "Erreur lors de l'action sur les paiements",
        details: error instanceof Error ? error.message : "Erreur inconnue"
      }, 
      { status: 500 }
    )
  }
}

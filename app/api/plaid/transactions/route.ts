import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { access_token, start_date, end_date } = await request.json()
    const clientId = process.env.PLAID_CLIENT_ID
    const secret = process.env.PLAID_SECRET
    const env = process.env.PLAID_ENV || 'sandbox'

    if (!clientId || !secret || !access_token) {
      return NextResponse.json(
        { error: 'Missing required parameters' },
        { status: 400 }
      )
    }

    const plaidBaseUrl = env === 'production'
      ? 'https://api.plaid.com'
      : env === 'development'
      ? 'https://development.plaid.com'
      : 'https://sandbox.plaid.com'

    const response = await fetch(`${plaidBaseUrl}/transactions/get`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        client_id: clientId,
        secret: secret,
        access_token: access_token,
        start_date: start_date,
        end_date: end_date,
        options: {
          include_personal_finance_category: true,
        },
      }),
    })

    const data = await response.json()

    if (!response.ok) {
      console.error('Plaid transactions error:', data)
      return NextResponse.json(
        { error: data.error_message || 'Failed to fetch transactions' },
        { status: response.status }
      )
    }

    return NextResponse.json({
      transactions: data.transactions,
      accounts: data.accounts,
      total_transactions: data.total_transactions,
    })
  } catch (error) {
    console.error('Transactions error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

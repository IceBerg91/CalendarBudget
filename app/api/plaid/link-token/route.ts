import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const clientId = process.env.PLAID_CLIENT_ID
    const secret = process.env.PLAID_SECRET
    const env = process.env.PLAID_ENV || 'sandbox'

    if (!clientId || !secret) {
      return NextResponse.json(
        { error: 'Missing Plaid credentials' },
        { status: 500 }
      )
    }

    const plaidBaseUrl = env === 'production'
      ? 'https://api.plaid.com'
      : env === 'development'
        ? 'https://development.plaid.com'
        : 'https://sandbox.plaid.com'

    const response = await fetch(`${plaidBaseUrl}/link/token/create`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        user: {
          client_user_id: 'user-' + Date.now(),
        },
        client_name: 'Lumi',
        products: ['transactions'],
        country_codes: ['US'],
        language: 'en',
        client_id: clientId,
        secret: secret,
      }),
    })

    const data = await response.json()

    if (!response.ok) {
      console.error('Plaid error:', data)
      return NextResponse.json(
        { error: data.error_message || 'Failed to create link token' },
        { status: response.status }
      )
    }

    return NextResponse.json({ link_token: data.link_token })
  } catch (error) {
    console.error('Link token error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

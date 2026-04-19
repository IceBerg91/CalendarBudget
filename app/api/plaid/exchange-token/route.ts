import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { public_token } = await request.json()
    const clientId = process.env.PLAID_CLIENT_ID
    const secret = process.env.PLAID_SECRET
    const env = process.env.PLAID_ENV || 'sandbox'

    if (!clientId || !secret || !public_token) {
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

    const response = await fetch(`${plaidBaseUrl}/item/public_token/exchange`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        client_id: clientId,
        secret: secret,
        public_token: public_token,
      }),
    })

    const data = await response.json()

    if (!response.ok) {
      console.error('Plaid exchange error:', data)
      return NextResponse.json(
        { error: data.error_message || 'Failed to exchange token' },
        { status: response.status }
      )
    }

    // In production, store the access_token securely (database, encrypted session, etc.)
    // For demo purposes, we return it to the client
    return NextResponse.json({
      access_token: data.access_token,
      item_id: data.item_id,
    })
  } catch (error) {
    console.error('Exchange token error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

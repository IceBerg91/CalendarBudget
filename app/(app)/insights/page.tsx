'use client'

import { useState, useCallback } from 'react'
import { PlaidLinkButton } from '@/components/budget/plaid-link-button'
import { SpendingAnalyzer } from '@/components/budget/spending-analyzer'
import { Card } from '@/components/ui/card'
import { AlertCircle, TrendingDown, DollarSign, Target } from 'lucide-react'

export default function InsightsPage() {
  const [accessToken, setAccessToken] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleLinkSuccess = useCallback((publicToken: string) => {
    setLoading(true)
    setError(null)

    // Exchange public token for access token
    fetch('/api/plaid/exchange-token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ public_token: publicToken }),
    })
      .then(res => res.json())
      .then(data => {
        if (data.error) {
          setError(data.error)
        } else {
          setAccessToken(data.access_token)
        }
      })
      .catch(err => {
        console.error('Token exchange error:', err)
        setError('Failed to connect bank account')
      })
      .finally(() => setLoading(false))
  }, [])

  const handleDisconnect = useCallback(() => {
    setAccessToken(null)
    setError(null)
  }, [])

  if (!accessToken) {
    return (
      <div className="min-h-screen bg-background p-4 sm:p-6">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">
              Spending Insights
            </h1>
            <p className="text-muted-foreground">
              Connect your bank account to analyze your spending habits and get personalized recommendations
            </p>
          </div>

          {/* Error */}
          {error && (
            <Card className="mb-6 p-4 border-destructive/50 bg-destructive/5">
              <div className="flex items-start gap-3">
                <AlertCircle className="size-5 text-destructive mt-0.5 shrink-0" />
                <div>
                  <p className="font-medium text-destructive">{error}</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    Please try again or contact support
                  </p>
                </div>
              </div>
            </Card>
          )}

          {/* Info Cards */}
          <div className="grid gap-4 mb-6 sm:grid-cols-3">
            <Card className="p-4">
              <div className="flex items-start gap-3">
                <div className="size-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <DollarSign className="size-5 text-primary" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground font-medium">Secure Connection</p>
                  <p className="text-sm font-semibold text-foreground">
                    Bank-grade encryption
                  </p>
                </div>
              </div>
            </Card>

            <Card className="p-4">
              <div className="flex items-start gap-3">
                <div className="size-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <TrendingDown className="size-5 text-primary" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground font-medium">Full History</p>
                  <p className="text-sm font-semibold text-foreground">
                    90 days of data
                  </p>
                </div>
              </div>
            </Card>

            <Card className="p-4">
              <div className="flex items-start gap-3">
                <div className="size-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Target className="size-5 text-primary" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground font-medium">Smart Analysis</p>
                  <p className="text-sm font-semibold text-foreground">
                    Personalized tips
                  </p>
                </div>
              </div>
            </Card>
          </div>

          {/* Connect Button */}
          <Card className="p-8 text-center">
            <p className="text-muted-foreground mb-6">
              Click the button below to securely connect your bank account via Plaid
            </p>
            <PlaidLinkButton onSuccess={handleLinkSuccess} loading={loading} />
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background p-4 sm:p-6">
      <SpendingAnalyzer
        accessToken={accessToken}
        onDisconnect={handleDisconnect}
      />
    </div>
  )
}

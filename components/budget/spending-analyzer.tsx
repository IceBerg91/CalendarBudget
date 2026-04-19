'use client'

import { useEffect, useState } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Spinner } from '@/components/ui/spinner'
import { SpendingInsights, PlaidTransaction } from '@/lib/budget-types'
import { analyzeSpending } from '@/lib/spending-analysis'
import {
  TrendingDown,
  TrendingUp,
  AlertCircle,
  LogOut,
  RefreshCw,
  PieChart,
  Target,
} from 'lucide-react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { cn } from '@/lib/utils'

interface SpendingAnalyzerProps {
  accessToken: string
  onDisconnect: () => void
}

export function SpendingAnalyzer({ accessToken, onDisconnect }: SpendingAnalyzerProps) {
  const [transactions, setTransactions] = useState<PlaidTransaction[]>([])
  const [insights, setInsights] = useState<SpendingInsights | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchTransactions()
  }, [accessToken])

  const fetchTransactions = async () => {
    setLoading(true)
    setError(null)

    try {
      // Get last 90 days
      const endDate = new Date().toISOString().split('T')[0]
      const startDate = new Date(Date.now() - 90 * 24 * 60 * 60 * 1000)
        .toISOString()
        .split('T')[0]

      const response = await fetch('/api/plaid/transactions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          access_token: accessToken,
          start_date: startDate,
          end_date: endDate,
        }),
      })

      const data = await response.json()

      if (data.error) {
        setError(data.error)
      } else {
        setTransactions(data.transactions)
        const analyzedInsights = analyzeSpending(data.transactions)
        setInsights(analyzedInsights)
      }
    } catch (err) {
      console.error('Failed to fetch transactions:', err)
      setError('Failed to fetch transactions. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Spinner className="size-8 mx-auto mb-4" />
          <p className="text-muted-foreground">Analyzing your spending...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto">
        <Card className="p-6 border-destructive/50 bg-destructive/5">
          <div className="flex items-start gap-3">
            <AlertCircle className="size-5 text-destructive mt-0.5 shrink-0" />
            <div className="flex-1">
              <h3 className="font-semibold text-destructive mb-1">Error loading data</h3>
              <p className="text-sm text-muted-foreground mb-4">{error}</p>
              <Button
                onClick={fetchTransactions}
                variant="outline"
                size="sm"
                className="gap-2"
              >
                <RefreshCw className="size-4" />
                Try Again
              </Button>
            </div>
            <Button
              onClick={onDisconnect}
              variant="ghost"
              size="sm"
              className="text-muted-foreground"
            >
              Disconnect
            </Button>
          </div>
        </Card>
      </div>
    )
  }

  if (!insights) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">No data available</p>
      </div>
    )
  }

  const savingsRate =
    insights.totalIncome > 0
      ? ((insights.totalIncome - insights.totalSpent) / insights.totalIncome) * 100
      : 0

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Spending Insights</h1>
          <p className="text-muted-foreground text-sm mt-1">
            Last 90 days of transaction data
          </p>
        </div>
        <Button
          onClick={onDisconnect}
          variant="outline"
          size="sm"
          className="gap-2"
        >
          <LogOut className="size-4" />
          Disconnect
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="p-4">
          <p className="text-xs text-muted-foreground font-medium mb-2">Total Income</p>
          <p className="text-2xl font-bold text-income">
            ${insights.totalIncome.toFixed(2)}
          </p>
          <p className="text-xs text-muted-foreground mt-2">
            {insights.transactionCount} transactions
          </p>
        </Card>

        <Card className="p-4">
          <p className="text-xs text-muted-foreground font-medium mb-2">Total Spent</p>
          <p className="text-2xl font-bold text-expense">
            ${insights.totalSpent.toFixed(2)}
          </p>
          <p className="text-xs text-muted-foreground mt-2">
            Avg: ${insights.averageTransactionAmount.toFixed(2)}
          </p>
        </Card>

        <Card className="p-4">
          <p className="text-xs text-muted-foreground font-medium mb-2">Net Balance</p>
          <p className={`text-2xl font-bold ${insights.netSpending >= 0 ? 'text-income' : 'text-expense'}`}>
            ${(insights.totalIncome - insights.totalSpent).toFixed(2)}
          </p>
          <p className="text-xs text-muted-foreground mt-2">
            Savings rate: {savingsRate.toFixed(1)}%
          </p>
        </Card>

        <Card className="p-4">
          <div className="flex items-start gap-3">
            <div className="size-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
              <Target className="size-4 text-primary" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground font-medium">Status</p>
              <p className={cn(
                'text-sm font-semibold',
                savingsRate >= 20 ? 'text-income' : savingsRate >= 10 ? 'text-yellow-500' : 'text-expense'
              )}>
                {savingsRate >= 20
                  ? 'Excellent'
                  : savingsRate >= 10
                  ? 'Good'
                  : 'Needs Work'}
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* Charts and Categories */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Monthly Trend */}
        <Card className="p-6">
          <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
            <TrendingDown className="size-5 text-primary" />
            Monthly Trend
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={insights.monthlyTrend}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
              <XAxis dataKey="month" stroke="var(--color-muted-foreground)" style={{ fontSize: '12px' }} />
              <YAxis stroke="var(--color-muted-foreground)" style={{ fontSize: '12px' }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'var(--color-card)',
                  border: '1px solid var(--color-border)',
                  borderRadius: '0.5rem',
                }}
                formatter={(value: number) => `$${value.toFixed(2)}`}
              />
              <Legend />
              <Bar dataKey="income" fill="var(--color-income)" />
              <Bar dataKey="spent" fill="var(--color-expense)" />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        {/* Top Categories */}
        <Card className="p-6">
          <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
            <PieChart className="size-5 text-primary" />
            Top Spending Categories
          </h2>
          <div className="space-y-3">
            {insights.topCategories.map((category, index) => (
              <div key={index}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium text-foreground">
                    {category.category}
                  </span>
                  <span className="text-sm font-semibold text-muted-foreground">
                    ${category.amount.toFixed(2)} ({category.percentage.toFixed(1)}%)
                  </span>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-primary to-accent"
                    style={{ width: `${category.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Recommendations */}
      {insights.budgetRecommendations.length > 0 && (
        <Card className="p-6 bg-primary/5 border-primary/20">
          <h2 className="text-lg font-semibold text-foreground mb-4">Smart Recommendations</h2>
          <div className="space-y-3">
            {insights.budgetRecommendations.map((rec, index) => (
              <div key={index} className="flex gap-3">
                <div className="size-2 rounded-full bg-primary mt-2 shrink-0" />
                <p className="text-sm text-foreground">{rec}</p>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Transaction Count */}
      <Card className="p-6 bg-muted/30">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-muted-foreground font-medium mb-1">
              Transactions Analyzed
            </p>
            <p className="text-2xl font-bold text-foreground">
              {transactions.length.toLocaleString()}
            </p>
          </div>
          <Button
            onClick={fetchTransactions}
            variant="outline"
            size="sm"
            className="gap-2"
          >
            <RefreshCw className="size-4" />
            Refresh
          </Button>
        </div>
      </Card>
    </div>
  )
}

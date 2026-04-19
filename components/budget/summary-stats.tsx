'use client'

import { TrendingUp, TrendingDown, Wallet, ArrowUpRight, ArrowDownRight } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import type { Transaction } from '@/lib/budget-types'

interface SummaryStatsProps {
  transactions: Transaction[]
  currentMonth: Date
}

export function SummaryStats({ transactions, currentMonth }: SummaryStatsProps) {
  const totalIncome = transactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0)
  
  const totalExpense = transactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0)
  
  const netBalance = totalIncome - totalExpense
  
  const monthName = currentMonth.toLocaleString('default', { month: 'long', year: 'numeric' })

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount)
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground font-medium">Total Income</p>
              <p className="text-2xl font-bold text-income mt-1">
                {formatCurrency(totalIncome)}
              </p>
              <p className="text-xs text-muted-foreground mt-1">{monthName}</p>
            </div>
            <div className="size-12 rounded-xl bg-income/10 flex items-center justify-center">
              <ArrowUpRight className="size-6 text-income" />
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground font-medium">Total Expenses</p>
              <p className="text-2xl font-bold text-expense mt-1">
                {formatCurrency(totalExpense)}
              </p>
              <p className="text-xs text-muted-foreground mt-1">{monthName}</p>
            </div>
            <div className="size-12 rounded-xl bg-expense/10 flex items-center justify-center">
              <ArrowDownRight className="size-6 text-expense" />
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground font-medium">Net Balance</p>
              <p className={`text-2xl font-bold mt-1 ${netBalance >= 0 ? 'text-income' : 'text-expense'}`}>
                {netBalance >= 0 ? '+' : ''}{formatCurrency(netBalance)}
              </p>
              <p className="text-xs text-muted-foreground mt-1">{monthName}</p>
            </div>
            <div className={`size-12 rounded-xl flex items-center justify-center ${netBalance >= 0 ? 'bg-income/10' : 'bg-expense/10'}`}>
              {netBalance >= 0 ? (
                <TrendingUp className="size-6 text-income" />
              ) : (
                <TrendingDown className="size-6 text-expense" />
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

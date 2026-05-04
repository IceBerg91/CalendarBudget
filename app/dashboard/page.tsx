'use client'

import { useState, useCallback } from 'react'
import { BudgetCalendar } from '@/components/budget/budget-calendar'
import { SummaryStats } from '@/components/budget/summary-stats'
import { type Transaction } from '@/lib/budget-types'
import { useMonthTransactions } from '@/hooks/use-transactions'
import { useAuth } from '@/hooks/use-auth'
import { addTransaction, deleteTransaction, toggleTransactionPaid } from '@/lib/supabase/transactions'

export default function BudgetPage() {
  const [currentMonth, setCurrentMonth] = useState(() => new Date())
  const { user, isLoading: authLoading } = useAuth()
  
  const { 
    transactions, 
    isLoading: transactionsLoading, 
    mutate 
  } = useMonthTransactions(currentMonth.getFullYear(), currentMonth.getMonth())

  const isLoading = authLoading || transactionsLoading

  const handleMonthChange = useCallback((newMonth: Date) => {
    setCurrentMonth(newMonth)
  }, [])

  const handleAddTransaction = useCallback(async (transaction: Omit<Transaction, 'id'>) => {
    if (!user) {
      console.error('User not authenticated')
      return
    }
    
    const newTransaction = await addTransaction(transaction, user.id)
    if (newTransaction) {
      mutate()
    }
  }, [user, mutate])

  const handleDeleteTransaction = useCallback(async (id: string) => {
    const success = await deleteTransaction(id)
    if (success) {
      mutate()
    }
  }, [mutate])

  const handleTogglePaid = useCallback(async (id: string) => {
    const updated = await toggleTransactionPaid(id)
    if (updated) {
      mutate()
    }
  }, [mutate])

  // Show loading skeleton while data is being fetched
  if (isLoading) {
    return (
      <main className="min-h-screen bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="animate-pulse space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-28 bg-muted rounded-lg" />
              ))}
            </div>
            <div className="h-96 bg-muted rounded-lg" />
          </div>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Summary Stats */}
        <section className="mb-8">
          <SummaryStats 
            transactions={transactions} 
            currentMonth={currentMonth}
          />
        </section>

        {/* Calendar */}
        <section>
          <BudgetCalendar
            currentMonth={currentMonth}
            transactions={transactions}
            onMonthChange={handleMonthChange}
            onAddTransaction={handleAddTransaction}
            onDeleteTransaction={handleDeleteTransaction}
            onTogglePaid={handleTogglePaid}
          />
        </section>

        {/* Footer hint */}
        <footer className="mt-8 text-center">
          <p className="text-sm text-muted-foreground">
            Click on any day to view or add transactions
          </p>
        </footer>
      </div>
    </main>
  )
}

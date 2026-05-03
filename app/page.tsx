'use client'

import { useState, useCallback, useEffect } from 'react'
import { BudgetCalendar } from '@/components/budget/budget-calendar'
import { SummaryStats } from '@/components/budget/summary-stats'
import { generateSampleTransactions, type Transaction } from '@/lib/budget-types'

export default function BudgetPage() {
  const [currentMonth, setCurrentMonth] = useState(() => new Date())
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [isHydrated, setIsHydrated] = useState(false)

  // Initialize sample data only on the client to prevent hydration mismatch
  useEffect(() => {
    if (!isHydrated) {
      const now = new Date()
      setTransactions(generateSampleTransactions(now.getFullYear(), now.getMonth()))
      setIsHydrated(true)
    }
  }, [isHydrated])

  // Filter transactions for the current month view
  const currentMonthTransactions = transactions.filter(t => {
    return (
      t.date.getMonth() === currentMonth.getMonth() &&
      t.date.getFullYear() === currentMonth.getFullYear()
    )
  })

  const handleMonthChange = useCallback((newMonth: Date) => {
    setCurrentMonth(newMonth)
    
    // Generate sample data for the new month if none exists
    const monthTransactions = transactions.filter(t => {
      return (
        t.date.getMonth() === newMonth.getMonth() &&
        t.date.getFullYear() === newMonth.getFullYear()
      )
    })
    
    if (monthTransactions.length === 0) {
      const newTransactions = generateSampleTransactions(
        newMonth.getFullYear(),
        newMonth.getMonth()
      )
      setTransactions(prev => [...prev, ...newTransactions])
    }
  }, [transactions])

  const handleAddTransaction = useCallback((transaction: Omit<Transaction, 'id'>) => {
    const newTransaction: Transaction = {
      ...transaction,
      id: `custom-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    }
    setTransactions(prev => [...prev, newTransaction])
  }, [])

  const handleDeleteTransaction = useCallback((id: string) => {
    setTransactions(prev => prev.filter(t => t.id !== id))
  }, [])

  const handleTogglePaid = useCallback((id: string) => {
    setTransactions(prev =>
      prev.map(t => (t.id === id ? { ...t, paid: !t.paid } : t))
    )
  }, [])

  // Prevent hydration mismatch by not rendering data-dependent content until client-side
  if (!isHydrated) {
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
            transactions={currentMonthTransactions} 
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

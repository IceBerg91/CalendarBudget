'use client'

import { useMemo } from 'react'
import { ChevronLeft, ChevronRight, CheckCircle2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { TransactionDialog } from './transaction-dialog'
import type { Transaction } from '@/lib/budget-types'
import { cn } from '@/lib/utils'

interface BudgetCalendarProps {
  currentMonth: Date
  transactions: Transaction[]
  onMonthChange: (date: Date) => void
  onAddTransaction: (transaction: Omit<Transaction, 'id'>) => void
  onDeleteTransaction: (id: string) => void
  onTogglePaid: (id: string) => void
}

const MAX_VISIBLE = 3

export function BudgetCalendar({
  currentMonth,
  transactions,
  onMonthChange,
  onAddTransaction,
  onDeleteTransaction,
  onTogglePaid,
}: BudgetCalendarProps) {
  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

  const calendarDays = useMemo(() => {
    const year = currentMonth.getFullYear()
    const month = currentMonth.getMonth()

    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)

    const days: { date: Date; isCurrentMonth: boolean }[] = []

    // Days from previous month
    const startDayOfWeek = firstDay.getDay()
    for (let i = startDayOfWeek - 1; i >= 0; i--) {
      const date = new Date(year, month, -i)
      days.push({ date, isCurrentMonth: false })
    }

    // Days from current month
    for (let day = 1; day <= lastDay.getDate(); day++) {
      days.push({ date: new Date(year, month, day), isCurrentMonth: true })
    }

    // Days from next month to fill 6 rows
    const remainingDays = 42 - days.length
    for (let i = 1; i <= remainingDays; i++) {
      const date = new Date(year, month + 1, i)
      days.push({ date, isCurrentMonth: false })
    }

    return days
  }, [currentMonth])

  const getDayTransactions = (date: Date) =>
    transactions.filter(t => t.date.toDateString() === date.toDateString())

  const formatAmount = (value: number) => {
    if (value >= 1000) return `$${(value / 1000).toFixed(1)}k`
    return `$${value.toFixed(0)}`
  }

  const goToPreviousMonth = () => {
    onMonthChange(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1))
  }

  const goToNextMonth = () => {
    onMonthChange(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1))
  }

  const monthYear = currentMonth.toLocaleString('default', {
    month: 'long',
    year: 'numeric',
  })

  const today = new Date()
  const isToday = (date: Date) => date.toDateString() === today.toDateString()

  return (
    <div className="bg-card border border-border rounded-xl overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-border">
        <div className="flex items-center gap-3">
          <h2 className="text-xl font-semibold text-foreground">{monthYear}</h2>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onMonthChange(new Date())}
            className="text-xs"
          >
            Today
          </Button>
        </div>
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="icon" onClick={goToPreviousMonth} className="hover:bg-muted">
            <ChevronLeft className="size-5" />
          </Button>
          <Button variant="ghost" size="icon" onClick={goToNextMonth} className="hover:bg-muted">
            <ChevronRight className="size-5" />
          </Button>
        </div>
      </div>

      {/* Calendar */}
      <div className="p-2 sm:p-4">
        {/* Weekday headers */}
        <div className="grid grid-cols-7 mb-2">
          {weekDays.map(day => (
            <div
              key={day}
              className="p-2 text-center text-xs font-medium text-muted-foreground uppercase tracking-wider"
            >
              {day}
            </div>
          ))}
        </div>

        {/* Day cells */}
        <div className="grid grid-cols-7 gap-1 sm:gap-1.5">
          {calendarDays.map((dayInfo, index) => {
            const { date, isCurrentMonth } = dayInfo
            const dayTransactions = getDayTransactions(date)
            const visible = dayTransactions.slice(0, MAX_VISIBLE)
            const overflow = dayTransactions.length - MAX_VISIBLE

            return (
              <TransactionDialog
                key={index}
                date={date}
                transactions={transactions}
                onAddTransaction={onAddTransaction}
                onDeleteTransaction={onDeleteTransaction}
                onTogglePaid={onTogglePaid}
              >
                <button
                  className={cn(
                    'relative min-h-[90px] sm:min-h-[110px] p-1.5 sm:p-2 rounded-lg transition-colors duration-150',
                    'hover:bg-muted/60 cursor-pointer text-left flex flex-col gap-1',
                    'focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-background',
                    isCurrentMonth ? 'bg-muted/25' : 'bg-transparent opacity-35',
                    isToday(date) && 'ring-2 ring-primary ring-offset-1 ring-offset-background'
                  )}
                >
                  {/* Day number */}
                  <span
                    className={cn(
                      'text-xs sm:text-sm font-semibold leading-none',
                      isToday(date) ? 'text-primary' : 'text-foreground'
                    )}
                  >
                    {date.getDate()}
                  </span>

                  {/* Transaction pills */}
                  {visible.length > 0 && (
                    <div className="flex flex-col gap-0.5 flex-1">
                      {visible.map(t => (
                        <div
                          key={t.id}
                          className={cn(
                            'flex items-center justify-between rounded px-1 py-0.5 min-w-0',
                            t.type === 'income'
                              ? 'bg-income/15 text-income'
                              : t.paid
                              ? 'bg-muted/60 text-muted-foreground'
                              : 'bg-expense/15 text-expense'
                          )}
                        >
                          <span className={cn(
                            'text-[9px] sm:text-[10px] font-medium truncate leading-tight',
                            t.type === 'expense' && t.paid && 'line-through'
                          )}>
                            {t.category}
                          </span>
                          <div className="flex items-center gap-0.5 shrink-0 ml-0.5">
                            {t.type === 'expense' && t.paid && (
                              <CheckCircle2 className="size-2.5 text-primary shrink-0" />
                            )}
                            <span className={cn(
                              'text-[9px] sm:text-[10px] font-semibold leading-tight',
                              t.type === 'expense' && t.paid && 'line-through'
                            )}>
                              {t.type === 'income' ? '+' : '-'}{formatAmount(t.amount)}
                            </span>
                          </div>
                        </div>
                      ))}

                      {overflow > 0 && (
                        <div className="text-[9px] sm:text-[10px] text-muted-foreground font-medium px-1">
                          +{overflow} more
                        </div>
                      )}
                    </div>
                  )}
                </button>
              </TransactionDialog>
            )
          })}
        </div>
      </div>

      {/* Legend */}
      <div className="flex items-center justify-center gap-6 p-4 border-t border-border">
        <div className="flex items-center gap-2">
          <div className="w-3 h-2 rounded-sm bg-income/40 border border-income/60" />
          <span className="text-xs text-muted-foreground">Income</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-2 rounded-sm bg-expense/40 border border-expense/60" />
          <span className="text-xs text-muted-foreground">Expense</span>
        </div>
        <div className="flex items-center gap-2">
          <CheckCircle2 className="size-3 text-primary" />
          <span className="text-xs text-muted-foreground">Paid</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-2 rounded-sm bg-muted-foreground/30 border border-muted-foreground/40" />
          <span className="text-xs text-muted-foreground">Other months</span>
        </div>
      </div>
    </div>
  )
}

'use client'

import { useState, useCallback, useMemo } from 'react'
import { Plus, Pencil, Trash2, RefreshCcw, TrendingDown, TrendingUp, ArrowUpDown } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { RecurringExpenseDialog } from '@/components/budget/recurring-expense-dialog'
import {
  generateSampleRecurringExpenses,
  generateSampleRecurringIncome,
  BILLING_CYCLES,
  MONTHLY_COST,
  type RecurringExpense,
  type RecurringIncome,
} from '@/lib/budget-types'
import { cn } from '@/lib/utils'

const formatCurrency = (value: number) =>
  new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value)

const getCycleLabel = (cycle: RecurringExpense['billingCycle']) =>
  BILLING_CYCLES.find(c => c.value === cycle)?.label ?? cycle

const getDaysUntilDate = (date: Date) => {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const d = new Date(date)
  d.setHours(0, 0, 0, 0)
  return Math.ceil((d.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
}

const getDueBadgeVariant = (days: number, type: 'income' | 'expense') => {
  if (days < 0) return 'overdue'
  if (days <= 3) return 'urgent'
  if (days <= 7) return 'soon'
  return 'upcoming'
}

const DUE_BADGE_STYLES = {
  overdue: 'bg-expense/20 text-expense border-expense/30',
  urgent: 'bg-expense/15 text-expense border-expense/25',
  soon: 'bg-amber-500/15 text-amber-400 border-amber-500/25',
  upcoming: 'bg-muted text-muted-foreground border-border',
}

const INCOME_DUE_BADGE_STYLES = {
  overdue: 'bg-muted text-muted-foreground border-border',
  urgent: 'bg-income/20 text-income border-income/30',
  soon: 'bg-income/15 text-income border-income/25',
  upcoming: 'bg-muted text-muted-foreground border-border',
}

const formatDueLabel = (days: number, type: 'income' | 'expense') => {
  if (days < 0) return type === 'income' ? `${Math.abs(days)}d overdue` : `${Math.abs(days)}d overdue`
  if (days === 0) return type === 'income' ? 'Expected today' : 'Due today'
  if (days === 1) return type === 'income' ? 'Expected tomorrow' : 'Due tomorrow'
  return `In ${days}d`
}

type TabType = 'expenses' | 'income'
type FilterType = 'all' | 'active' | 'inactive'

export default function RecurringPage() {
  const [expenses, setExpenses] = useState<RecurringExpense[]>(() =>
    generateSampleRecurringExpenses()
  )
  const [incomes, setIncomes] = useState<RecurringIncome[]>(() =>
    generateSampleRecurringIncome()
  )
  const [activeTab, setActiveTab] = useState<TabType>('expenses')
  const [filter, setFilter] = useState<FilterType>('all')

  // --- Expense handlers ---
  const handleAddExpense = useCallback((item: Omit<RecurringExpense, 'id'>) => {
    setExpenses(prev => [
      ...prev,
      { ...item, id: `rec-${Date.now()}-${Math.random().toString(36).slice(2, 7)}` },
    ])
  }, [])

  const handleEditExpense = useCallback(
    (id: string) => (item: Omit<RecurringExpense, 'id'>) => {
      setExpenses(prev => prev.map(e => (e.id === id ? { ...item, id } : e)))
    },
    []
  )

  const handleDeleteExpense = useCallback((id: string) => {
    setExpenses(prev => prev.filter(e => e.id !== id))
  }, [])

  const handleToggleExpense = useCallback((id: string) => {
    setExpenses(prev =>
      prev.map(e => (e.id === id ? { ...e, isActive: !e.isActive } : e))
    )
  }, [])

  // --- Income handlers ---
  const handleAddIncome = useCallback((item: Omit<RecurringIncome, 'id'>) => {
    setIncomes(prev => [
      ...prev,
      { ...item, id: `inc-${Date.now()}-${Math.random().toString(36).slice(2, 7)}` },
    ])
  }, [])

  const handleEditIncome = useCallback(
    (id: string) => (item: Omit<RecurringIncome, 'id'>) => {
      setIncomes(prev => prev.map(e => (e.id === id ? { ...item, id } : e)))
    },
    []
  )

  const handleDeleteIncome = useCallback((id: string) => {
    setIncomes(prev => prev.filter(e => e.id !== id))
  }, [])

  const handleToggleIncome = useCallback((id: string) => {
    setIncomes(prev =>
      prev.map(e => (e.id === id ? { ...e, isActive: !e.isActive } : e))
    )
  }, [])

  // --- Filtered lists ---
  const applyFilter = <T extends { isActive: boolean }>(list: T[]) => {
    if (filter === 'active') return list.filter(e => e.isActive)
    if (filter === 'inactive') return list.filter(e => !e.isActive)
    return list
  }

  const filteredExpenses = useMemo(() => {
    const sorted = [...expenses].sort(
      (a, b) => new Date(a.nextDueDate).getTime() - new Date(b.nextDueDate).getTime()
    )
    return applyFilter(sorted)
  }, [expenses, filter])

  const filteredIncomes = useMemo(() => {
    const sorted = [...incomes].sort(
      (a, b) => new Date(a.nextExpectedDate).getTime() - new Date(b.nextExpectedDate).getTime()
    )
    return applyFilter(sorted)
  }, [incomes, filter])

  // --- Stats ---
  const stats = useMemo(() => {
    const activeExpenses = expenses.filter(e => e.isActive)
    const activeIncomes = incomes.filter(i => i.isActive)

    const monthlyExpenses = activeExpenses.reduce(
      (sum, e) => sum + e.amount * MONTHLY_COST[e.billingCycle],
      0
    )
    const monthlyIncome = activeIncomes.reduce(
      (sum, i) => sum + i.amount * MONTHLY_COST[i.billingCycle],
      0
    )

    return {
      expenseCount: activeExpenses.length,
      incomeCount: activeIncomes.length,
      monthlyExpenses,
      monthlyIncome,
      monthlyNet: monthlyIncome - monthlyExpenses,
      annualExpenses: monthlyExpenses * 12,
      annualIncome: monthlyIncome * 12,
    }
  }, [expenses, incomes])

  return (
    <main className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* Page header */}
        <div className="flex items-start justify-between mb-8 gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-foreground text-balance">
              Recurring Items
            </h1>
            <p className="text-muted-foreground mt-1">
              Manage your regular income sources and expenses
            </p>
          </div>
          <RecurringExpenseDialog
            type={activeTab === 'income' ? 'income' : 'expense'}
            onSave={activeTab === 'income' ? handleAddIncome as any : handleAddExpense as any}
          >
            <Button className="bg-primary hover:bg-primary/90 text-primary-foreground shrink-0">
              <Plus className="size-4 mr-2" />
              Add New
            </Button>
          </RecurringExpenseDialog>
        </div>

        {/* Summary cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          <div className="bg-card border border-border rounded-xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="size-4 text-income" />
              <span className="text-xs text-muted-foreground font-medium uppercase tracking-wider">
                Monthly income
              </span>
            </div>
            <p className="text-2xl font-bold text-income">
              {formatCurrency(stats.monthlyIncome)}
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              {stats.incomeCount} active source{stats.incomeCount !== 1 ? 's' : ''}
            </p>
          </div>

          <div className="bg-card border border-border rounded-xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <TrendingDown className="size-4 text-expense" />
              <span className="text-xs text-muted-foreground font-medium uppercase tracking-wider">
                Monthly expenses
              </span>
            </div>
            <p className="text-2xl font-bold text-expense">
              {formatCurrency(stats.monthlyExpenses)}
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              {stats.expenseCount} active item{stats.expenseCount !== 1 ? 's' : ''}
            </p>
          </div>

          <div className="bg-card border border-border rounded-xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <ArrowUpDown className="size-4 text-muted-foreground" />
              <span className="text-xs text-muted-foreground font-medium uppercase tracking-wider">
                Monthly net
              </span>
            </div>
            <p className={cn('text-2xl font-bold', stats.monthlyNet >= 0 ? 'text-income' : 'text-expense')}>
              {stats.monthlyNet >= 0 ? '+' : ''}{formatCurrency(stats.monthlyNet)}
            </p>
          </div>

          <div className="bg-card border border-border rounded-xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <ArrowUpDown className="size-4 text-muted-foreground" />
              <span className="text-xs text-muted-foreground font-medium uppercase tracking-wider">
                Annual net
              </span>
            </div>
            <p className={cn('text-2xl font-bold', stats.monthlyNet >= 0 ? 'text-income' : 'text-expense')}>
              {stats.monthlyNet >= 0 ? '+' : ''}{formatCurrency(stats.monthlyNet * 12)}
            </p>
          </div>
        </div>

        {/* Tabs + Filter */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-5">
          {/* Type tabs */}
          <div className="flex items-center gap-1 bg-muted/40 rounded-lg p-1">
            <button
              onClick={() => setActiveTab('expenses')}
              className={cn(
                'px-4 py-1.5 rounded-md text-sm font-medium transition-colors',
                activeTab === 'expenses'
                  ? 'bg-card text-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              )}
            >
              Expenses
              <span className={cn(
                'ml-2 inline-flex items-center justify-center rounded-full text-xs size-5',
                activeTab === 'expenses' ? 'bg-expense/15 text-expense' : 'bg-muted text-muted-foreground'
              )}>
                {expenses.length}
              </span>
            </button>
            <button
              onClick={() => setActiveTab('income')}
              className={cn(
                'px-4 py-1.5 rounded-md text-sm font-medium transition-colors',
                activeTab === 'income'
                  ? 'bg-card text-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              )}
            >
              Income
              <span className={cn(
                'ml-2 inline-flex items-center justify-center rounded-full text-xs size-5',
                activeTab === 'income' ? 'bg-income/15 text-income' : 'bg-muted text-muted-foreground'
              )}>
                {incomes.length}
              </span>
            </button>
          </div>

          {/* Status filter */}
          <div className="flex items-center gap-1 bg-muted/40 rounded-lg p-1">
            {(['all', 'active', 'inactive'] as const).map(f => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={cn(
                  'px-3 py-1.5 rounded-md text-sm font-medium capitalize transition-colors',
                  filter === f
                    ? 'bg-card text-foreground shadow-sm'
                    : 'text-muted-foreground hover:text-foreground'
                )}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        {/* Expense list */}
        {activeTab === 'expenses' && (
          filteredExpenses.length === 0 ? (
            <div className="bg-card border border-border rounded-xl p-16 text-center">
              <RefreshCcw className="size-10 text-muted-foreground/40 mx-auto mb-3" />
              <p className="text-muted-foreground">No recurring expenses found.</p>
              <RecurringExpenseDialog type="expense" onSave={handleAddExpense}>
                <Button variant="outline" className="mt-4">
                  <Plus className="size-4 mr-2" />
                  Add your first expense
                </Button>
              </RecurringExpenseDialog>
            </div>
          ) : (
            <div className="bg-card border border-border rounded-xl overflow-hidden">
              <div className="hidden sm:grid grid-cols-[1fr_auto_auto_auto_auto] gap-4 items-center px-5 py-3 border-b border-border bg-muted/30">
                <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Name</span>
                <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider text-right">Amount</span>
                <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Cycle</span>
                <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Next Due</span>
                <span className="sr-only">Actions</span>
              </div>
              <ul role="list" className="divide-y divide-border">
                {filteredExpenses.map(expense => {
                  const days = getDaysUntilDate(expense.nextDueDate)
                  const badgeVariant = getDueBadgeVariant(days, 'expense')
                  return (
                    <li
                      key={expense.id}
                      className={cn(
                        'grid grid-cols-1 sm:grid-cols-[1fr_auto_auto_auto_auto] gap-2 sm:gap-4 items-center px-5 py-4 transition-colors hover:bg-muted/20',
                        !expense.isActive && 'opacity-50'
                      )}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="size-9 rounded-lg bg-expense/10 border border-expense/20 flex items-center justify-center shrink-0">
                          <TrendingDown className="size-4 text-expense" />
                        </div>
                        <div className="min-w-0">
                          <p className="font-medium text-foreground truncate">{expense.name}</p>
                          <p className="text-xs text-muted-foreground truncate">
                            {expense.category}{expense.description ? ` · ${expense.description}` : ''}
                          </p>
                        </div>
                        {!expense.isActive && (
                          <Badge variant="secondary" className="text-xs shrink-0">Inactive</Badge>
                        )}
                      </div>

                      <div className="text-right">
                        <p className="font-semibold text-expense">{formatCurrency(expense.amount)}</p>
                        <p className="text-xs text-muted-foreground">
                          {formatCurrency(expense.amount * MONTHLY_COST[expense.billingCycle])}/mo
                        </p>
                      </div>

                      <div>
                        <Badge variant="outline" className="text-xs font-medium">
                          {getCycleLabel(expense.billingCycle)}
                        </Badge>
                      </div>

                      <div>
                        <span className={cn(
                          'inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border',
                          DUE_BADGE_STYLES[badgeVariant]
                        )}>
                          {formatDueLabel(days, 'expense')}
                        </span>
                      </div>

                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          role="switch"
                          aria-checked={expense.isActive}
                          aria-label={`Toggle ${expense.name} active state`}
                          onClick={() => handleToggleExpense(expense.id)}
                          className={cn(
                            'relative inline-flex h-5 w-9 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-ring',
                            expense.isActive ? 'bg-primary' : 'bg-muted'
                          )}
                        >
                          <span className={cn(
                            'inline-block size-3.5 rounded-full bg-white shadow transition-transform',
                            expense.isActive ? 'translate-x-4.5' : 'translate-x-0.5'
                          )} />
                        </button>
                        <RecurringExpenseDialog type="expense" existing={expense} onSave={handleEditExpense(expense.id) as any}>
                          <Button variant="ghost" size="icon" className="size-8 text-muted-foreground hover:text-foreground" aria-label={`Edit ${expense.name}`}>
                            <Pencil className="size-3.5" />
                          </Button>
                        </RecurringExpenseDialog>
                        <Button variant="ghost" size="icon" className="size-8 text-muted-foreground hover:text-expense" aria-label={`Delete ${expense.name}`} onClick={() => handleDeleteExpense(expense.id)}>
                          <Trash2 className="size-3.5" />
                        </Button>
                      </div>
                    </li>
                  )
                })}
              </ul>
            </div>
          )
        )}

        {/* Income list */}
        {activeTab === 'income' && (
          filteredIncomes.length === 0 ? (
            <div className="bg-card border border-border rounded-xl p-16 text-center">
              <TrendingUp className="size-10 text-muted-foreground/40 mx-auto mb-3" />
              <p className="text-muted-foreground">No recurring income sources found.</p>
              <RecurringExpenseDialog type="income" onSave={handleAddIncome}>
                <Button variant="outline" className="mt-4">
                  <Plus className="size-4 mr-2" />
                  Add your first income source
                </Button>
              </RecurringExpenseDialog>
            </div>
          ) : (
            <div className="bg-card border border-border rounded-xl overflow-hidden">
              <div className="hidden sm:grid grid-cols-[1fr_auto_auto_auto_auto] gap-4 items-center px-5 py-3 border-b border-border bg-muted/30">
                <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Name</span>
                <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider text-right">Amount</span>
                <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Cycle</span>
                <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Next Expected</span>
                <span className="sr-only">Actions</span>
              </div>
              <ul role="list" className="divide-y divide-border">
                {filteredIncomes.map(income => {
                  const days = getDaysUntilDate(income.nextExpectedDate)
                  const badgeVariant = getDueBadgeVariant(days, 'income')
                  return (
                    <li
                      key={income.id}
                      className={cn(
                        'grid grid-cols-1 sm:grid-cols-[1fr_auto_auto_auto_auto] gap-2 sm:gap-4 items-center px-5 py-4 transition-colors hover:bg-muted/20',
                        !income.isActive && 'opacity-50'
                      )}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="size-9 rounded-lg bg-income/10 border border-income/20 flex items-center justify-center shrink-0">
                          <TrendingUp className="size-4 text-income" />
                        </div>
                        <div className="min-w-0">
                          <p className="font-medium text-foreground truncate">{income.name}</p>
                          <p className="text-xs text-muted-foreground truncate">
                            {income.category}{income.description ? ` · ${income.description}` : ''}
                          </p>
                        </div>
                        {!income.isActive && (
                          <Badge variant="secondary" className="text-xs shrink-0">Inactive</Badge>
                        )}
                      </div>

                      <div className="text-right">
                        <p className="font-semibold text-income">{formatCurrency(income.amount)}</p>
                        <p className="text-xs text-muted-foreground">
                          {formatCurrency(income.amount * MONTHLY_COST[income.billingCycle])}/mo
                        </p>
                      </div>

                      <div>
                        <Badge variant="outline" className="text-xs font-medium">
                          {getCycleLabel(income.billingCycle)}
                        </Badge>
                      </div>

                      <div>
                        <span className={cn(
                          'inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border',
                          INCOME_DUE_BADGE_STYLES[badgeVariant]
                        )}>
                          {formatDueLabel(days, 'income')}
                        </span>
                      </div>

                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          role="switch"
                          aria-checked={income.isActive}
                          aria-label={`Toggle ${income.name} active state`}
                          onClick={() => handleToggleIncome(income.id)}
                          className={cn(
                            'relative inline-flex h-5 w-9 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-ring',
                            income.isActive ? 'bg-primary' : 'bg-muted'
                          )}
                        >
                          <span className={cn(
                            'inline-block size-3.5 rounded-full bg-white shadow transition-transform',
                            income.isActive ? 'translate-x-4.5' : 'translate-x-0.5'
                          )} />
                        </button>
                        <RecurringExpenseDialog type="income" existing={income} onSave={handleEditIncome(income.id) as any}>
                          <Button variant="ghost" size="icon" className="size-8 text-muted-foreground hover:text-foreground" aria-label={`Edit ${income.name}`}>
                            <Pencil className="size-3.5" />
                          </Button>
                        </RecurringExpenseDialog>
                        <Button variant="ghost" size="icon" className="size-8 text-muted-foreground hover:text-income" aria-label={`Delete ${income.name}`} onClick={() => handleDeleteIncome(income.id)}>
                          <Trash2 className="size-3.5" />
                        </Button>
                      </div>
                    </li>
                  )
                })}
              </ul>
            </div>
          )
        )}

      </div>
    </main>
  )
}

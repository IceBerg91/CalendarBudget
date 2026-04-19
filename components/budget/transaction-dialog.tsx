'use client'

import { useState } from 'react'
import { Plus, ArrowUpRight, ArrowDownRight, Trash2, CheckCircle2, Circle } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ScrollArea } from '@/components/ui/scroll-area'
import type { Transaction } from '@/lib/budget-types'
import { EXPENSE_CATEGORIES, INCOME_CATEGORIES } from '@/lib/budget-types'

interface TransactionDialogProps {
  date: Date
  transactions: Transaction[]
  onAddTransaction: (transaction: Omit<Transaction, 'id'>) => void
  onDeleteTransaction: (id: string) => void
  onTogglePaid: (id: string) => void
  children: React.ReactNode
}

export function TransactionDialog({
  date,
  transactions,
  onAddTransaction,
  onDeleteTransaction,
  onTogglePaid,
  children,
}: TransactionDialogProps) {
  const [open, setOpen] = useState(false)
  const [type, setType] = useState<'income' | 'expense'>('expense')
  const [amount, setAmount] = useState('')
  const [category, setCategory] = useState('')
  const [description, setDescription] = useState('')

  const dateString = date.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })

  const dayTransactions = transactions.filter(
    t => t.date.toDateString() === date.toDateString()
  )

  const totalIncome = dayTransactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0)

  const totalExpense = dayTransactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!amount || !category) return

    onAddTransaction({
      date,
      amount: parseFloat(amount),
      type,
      category,
      description: description || `${category} transaction`,
    })

    setAmount('')
    setCategory('')
    setDescription('')
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }).format(value)
  }

  const categories = type === 'income' ? INCOME_CATEGORIES : EXPENSE_CATEGORIES

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[500px] bg-card border-border">
        <DialogHeader>
          <DialogTitle className="text-foreground">{dateString}</DialogTitle>
          <DialogDescription>
            View and manage transactions for this day.
          </DialogDescription>
        </DialogHeader>

        <div className="flex gap-4 py-4">
          <div className="flex-1 p-3 rounded-lg bg-income/10 border border-income/20">
            <div className="flex items-center gap-2">
              <ArrowUpRight className="size-4 text-income" />
              <span className="text-xs text-muted-foreground">Income</span>
            </div>
            <p className="text-lg font-semibold text-income mt-1">
              {formatCurrency(totalIncome)}
            </p>
          </div>
          <div className="flex-1 p-3 rounded-lg bg-expense/10 border border-expense/20">
            <div className="flex items-center gap-2">
              <ArrowDownRight className="size-4 text-expense" />
              <span className="text-xs text-muted-foreground">Expenses</span>
            </div>
            <p className="text-lg font-semibold text-expense mt-1">
              {formatCurrency(totalExpense)}
            </p>
          </div>
        </div>

        <Tabs defaultValue="transactions" className="w-full">
          <TabsList className="grid w-full grid-cols-2 bg-muted">
            <TabsTrigger value="transactions">Transactions</TabsTrigger>
            <TabsTrigger value="add">Add New</TabsTrigger>
          </TabsList>

          <TabsContent value="transactions" className="mt-4">
            {dayTransactions.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <p>No transactions for this day</p>
              </div>
            ) : (
              <ScrollArea className="h-[200px] pr-4">
                <div className="space-y-2">
                  {dayTransactions.map(transaction => (
                    <div
                      key={transaction.id}
                      className={`flex items-center justify-between p-3 rounded-lg border transition-colors ${
                        transaction.type === 'expense' && transaction.paid
                          ? 'bg-muted/20 border-border/30'
                          : 'bg-muted/50 border-border/50'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`size-8 rounded-full flex items-center justify-center ${
                            transaction.type === 'income'
                              ? 'bg-income/10'
                              : transaction.paid
                              ? 'bg-primary/10'
                              : 'bg-expense/10'
                          }`}
                        >
                          {transaction.type === 'income' ? (
                            <ArrowUpRight className="size-4 text-income" />
                          ) : transaction.paid ? (
                            <CheckCircle2 className="size-4 text-primary" />
                          ) : (
                            <ArrowDownRight className="size-4 text-expense" />
                          )}
                        </div>
                        <div>
                          <p className={`text-sm font-medium ${
                            transaction.type === 'expense' && transaction.paid
                              ? 'text-muted-foreground line-through'
                              : 'text-foreground'
                          }`}>
                            {transaction.category}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {transaction.description}
                            {transaction.type === 'expense' && transaction.paid && (
                              <span className="ml-1 text-primary font-medium no-underline" style={{ textDecoration: 'none' }}>
                                · Paid
                              </span>
                            )}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-1">
                        <span
                          className={`font-semibold text-sm ${
                            transaction.type === 'income'
                              ? 'text-income'
                              : transaction.paid
                              ? 'text-muted-foreground line-through'
                              : 'text-expense'
                          }`}
                        >
                          {transaction.type === 'income' ? '+' : '-'}
                          {formatCurrency(transaction.amount)}
                        </span>
                        {transaction.type === 'expense' && (
                          <Button
                            variant="ghost"
                            size="icon"
                            className={`size-8 ${
                              transaction.paid
                                ? 'text-primary hover:text-muted-foreground'
                                : 'text-muted-foreground hover:text-primary'
                            }`}
                            onClick={() => onTogglePaid(transaction.id)}
                            title={transaction.paid ? 'Mark as unpaid' : 'Mark as paid'}
                          >
                            {transaction.paid
                              ? <CheckCircle2 className="size-4" />
                              : <Circle className="size-4" />
                            }
                          </Button>
                        )}
                        <Button
                          variant="ghost"
                          size="icon"
                          className="size-8 text-muted-foreground hover:text-expense"
                          onClick={() => onDeleteTransaction(transaction.id)}
                        >
                          <Trash2 className="size-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            )}
          </TabsContent>

          <TabsContent value="add" className="mt-4">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-2">
                <Button
                  type="button"
                  variant={type === 'expense' ? 'default' : 'outline'}
                  className={type === 'expense' ? 'bg-expense hover:bg-expense/90 text-white' : ''}
                  onClick={() => {
                    setType('expense')
                    setCategory('')
                  }}
                >
                  <ArrowDownRight className="size-4 mr-2" />
                  Expense
                </Button>
                <Button
                  type="button"
                  variant={type === 'income' ? 'default' : 'outline'}
                  className={type === 'income' ? 'bg-income hover:bg-income/90 text-primary-foreground' : ''}
                  onClick={() => {
                    setType('income')
                    setCategory('')
                  }}
                >
                  <ArrowUpRight className="size-4 mr-2" />
                  Income
                </Button>
              </div>

              <div className="space-y-2">
                <Label htmlFor="amount">Amount</Label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                    $
                  </span>
                  <Input
                    id="amount"
                    type="number"
                    step="0.01"
                    min="0"
                    placeholder="0.00"
                    value={amount}
                    onChange={e => setAmount(e.target.value)}
                    className="pl-7 bg-input border-border"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Select value={category} onValueChange={setCategory}>
                  <SelectTrigger className="bg-input border-border">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map(cat => (
                      <SelectItem key={cat} value={cat}>
                        {cat}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description (optional)</Label>
                <Input
                  id="description"
                  placeholder="Add a note..."
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  className="bg-input border-border"
                />
              </div>

              <Button
                type="submit"
                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
                disabled={!amount || !category}
              >
                <Plus className="size-4 mr-2" />
                Add Transaction
              </Button>
            </form>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}

'use client'

import { useState, useEffect } from 'react'
import { Plus, Pencil } from 'lucide-react'
import {
  Dialog,
  DialogContent,
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
import type { RecurringExpense, RecurringIncome, BillingCycle } from '@/lib/budget-types'
import { EXPENSE_CATEGORIES, INCOME_CATEGORIES, BILLING_CYCLES } from '@/lib/budget-types'

type ItemType = 'expense' | 'income'

interface RecurringExpenseDialogProps {
  type?: ItemType
  onSave: (item: Omit<RecurringExpense, 'id'> | Omit<RecurringIncome, 'id'>) => void
  existing?: RecurringExpense | RecurringIncome
  children: React.ReactNode
}

const toInputDate = (d: Date) => {
  const date = new Date(d)
  return date.toISOString().split('T')[0]
}

const getDateField = (item: RecurringExpense | RecurringIncome): Date =>
  'nextDueDate' in item ? item.nextDueDate : item.nextExpectedDate

export function RecurringExpenseDialog({
  type = 'expense',
  onSave,
  existing,
  children,
}: RecurringExpenseDialogProps) {
  const [open, setOpen] = useState(false)
  const [name, setName] = useState('')
  const [amount, setAmount] = useState('')
  const [category, setCategory] = useState('')
  const [billingCycle, setBillingCycle] = useState<BillingCycle>('monthly')
  const [dateValue, setDateValue] = useState(toInputDate(new Date()))
  const [description, setDescription] = useState('')
  const [isActive, setIsActive] = useState(true)

  useEffect(() => {
    if (open) {
      if (existing) {
        setName(existing.name)
        setAmount(String(existing.amount))
        setCategory(existing.category)
        setBillingCycle(existing.billingCycle)
        setDateValue(toInputDate(getDateField(existing)))
        setDescription(existing.description)
        setIsActive(existing.isActive)
      } else {
        setName('')
        setAmount('')
        setCategory('')
        setBillingCycle('monthly')
        setDateValue(toInputDate(new Date()))
        setDescription('')
        setIsActive(true)
      }
    }
  }, [open, existing])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!name || !amount || !category) return

    const base = {
      name,
      amount: parseFloat(amount),
      category,
      billingCycle,
      description,
      isActive,
    }

    if (type === 'income') {
      onSave({ ...base, nextExpectedDate: new Date(dateValue) } as Omit<RecurringIncome, 'id'>)
    } else {
      onSave({ ...base, nextDueDate: new Date(dateValue) } as Omit<RecurringExpense, 'id'>)
    }

    setOpen(false)
  }

  const categories = type === 'income' ? INCOME_CATEGORIES : EXPENSE_CATEGORIES
  const isValid = name.trim() && amount && parseFloat(amount) > 0 && category
  const dateLabel = type === 'income' ? 'Next Expected Date' : 'Next Due Date'
  const title = existing
    ? type === 'income' ? 'Edit Recurring Income' : 'Edit Recurring Expense'
    : type === 'income' ? 'Add Recurring Income' : 'Add Recurring Expense'

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[460px] bg-card border-border">
        <DialogHeader>
          <DialogTitle className="text-foreground">{title}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 mt-2">
          <div className="space-y-2">
            <Label htmlFor="rec-name">Name</Label>
            <Input
              id="rec-name"
              placeholder={type === 'income' ? 'e.g. Salary, Freelance' : 'e.g. Netflix, Rent'}
              value={name}
              onChange={e => setName(e.target.value)}
              className="bg-input border-border"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label htmlFor="rec-amount">Amount</Label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">
                  $
                </span>
                <Input
                  id="rec-amount"
                  type="number"
                  step="0.01"
                  min="0.01"
                  placeholder="0.00"
                  value={amount}
                  onChange={e => setAmount(e.target.value)}
                  className="pl-7 bg-input border-border"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="rec-cycle">Billing Cycle</Label>
              <Select value={billingCycle} onValueChange={v => setBillingCycle(v as BillingCycle)}>
                <SelectTrigger id="rec-cycle" className="bg-input border-border">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {BILLING_CYCLES.map(c => (
                    <SelectItem key={c.value} value={c.value}>
                      {c.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="rec-category">Category</Label>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger id="rec-category" className="bg-input border-border">
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
            <Label htmlFor="rec-date">{dateLabel}</Label>
            <Input
              id="rec-date"
              type="date"
              value={dateValue}
              onChange={e => setDateValue(e.target.value)}
              className="bg-input border-border"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="rec-description">Description (optional)</Label>
            <Input
              id="rec-description"
              placeholder="Add a note..."
              value={description}
              onChange={e => setDescription(e.target.value)}
              className="bg-input border-border"
            />
          </div>

          <div className="flex items-center gap-3 pt-1">
            <button
              type="button"
              role="switch"
              aria-checked={isActive}
              onClick={() => setIsActive(p => !p)}
              className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-background ${isActive ? 'bg-primary' : 'bg-muted'}`}
            >
              <span
                className={`inline-block size-3.5 rounded-full bg-white shadow transition-transform ${isActive ? 'translate-x-4.5' : 'translate-x-0.5'}`}
              />
            </button>
            <Label className="cursor-pointer" onClick={() => setIsActive(p => !p)}>
              Active
            </Label>
          </div>

          <div className="flex gap-2 pt-2">
            <Button
              type="button"
              variant="outline"
              className="flex-1"
              onClick={() => setOpen(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground"
              disabled={!isValid}
            >
              {existing ? (
                <>
                  <Pencil className="size-4 mr-2" />
                  Save Changes
                </>
              ) : (
                <>
                  <Plus className="size-4 mr-2" />
                  {type === 'income' ? 'Add Income' : 'Add Expense'}
                </>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}

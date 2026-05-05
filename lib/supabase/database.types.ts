export type TransactionType = 'income' | 'expense'
export type BillingCycle = 'weekly' | 'biweekly' | 'monthly' | 'quarterly' | 'annually'

export interface DbCategory {
  id: string
  user_id: string
  name: string
  type: TransactionType
  icon: string | null
  color: string | null
  is_default: boolean
  created_at: string
  updated_at: string
}

export interface DbTransaction {
  id: string
  user_id: string
  category_id: string | null
  type: TransactionType
  amount: number
  description: string
  date: string
  is_paid: boolean
  is_recurring: boolean
  recurring_expense_id: string | null
  recurring_income_id: string | null
  notes: string | null
  created_at: string
  updated_at: string
}

export interface DbRecurringExpense {
  id: string
  user_id: string
  category_id: string | null
  name: string
  amount: number
  billing_cycle: BillingCycle
  start_date: string
  end_date: string | null
  next_due_date: string
  is_active: boolean
  notes: string | null
  created_at: string
  updated_at: string
}

export interface DbRecurringIncome {
  id: string
  user_id: string
  category_id: string | null
  name: string
  amount: number
  billing_cycle: BillingCycle
  start_date: string
  end_date: string | null
  next_due_date: string
  is_active: boolean
  notes: string | null
  created_at: string
  updated_at: string
}

// Insert types (without auto-generated fields)
export interface InsertTransaction {
  user_id: string
  category_id?: string | null
  type: TransactionType
  amount: number
  description: string
  date: string
  is_paid?: boolean
  is_recurring?: boolean
  recurring_expense_id?: string | null
  recurring_income_id?: string | null
  notes?: string | null
}

export interface InsertCategory {
  user_id: string
  name: string
  type: TransactionType
  icon?: string | null
  color?: string | null
  is_default?: boolean
}

export interface InsertRecurringExpense {
  user_id: string
  category_id?: string | null
  name: string
  amount: number
  billing_cycle?: BillingCycle
  start_date: string
  end_date?: string | null
  next_due_date: string
  is_active?: boolean
  notes?: string | null
}

export interface InsertRecurringIncome {
  user_id: string
  category_id?: string | null
  name: string
  amount: number
  billing_cycle?: BillingCycle
  start_date: string
  end_date?: string | null
  next_due_date: string
  is_active?: boolean
  notes?: string | null
}

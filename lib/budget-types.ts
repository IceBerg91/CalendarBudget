export type BillingCycle = 'weekly' | 'biweekly' | 'monthly' | 'quarterly' | 'annually'

export interface RecurringExpense {
  id: string
  name: string
  amount: number
  category: string
  billingCycle: BillingCycle
  nextDueDate: Date
  description: string
  isActive: boolean
}

export interface RecurringIncome {
  id: string
  name: string
  amount: number
  category: string
  billingCycle: BillingCycle
  nextExpectedDate: Date
  description: string
  isActive: boolean
}

export const BILLING_CYCLES: { value: BillingCycle; label: string }[] = [
  { value: 'weekly', label: 'Weekly' },
  { value: 'biweekly', label: 'Bi-weekly' },
  { value: 'monthly', label: 'Monthly' },
  { value: 'quarterly', label: 'Quarterly' },
  { value: 'annually', label: 'Annually' },
]

export const MONTHLY_COST: Record<BillingCycle, number> = {
  weekly: 52 / 12,
  biweekly: 26 / 12,
  monthly: 1,
  quarterly: 1 / 3,
  annually: 1 / 12,
}

export function generateSampleRecurringExpenses(): RecurringExpense[] {
  const now = new Date()
  const nextMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1)

  return [
    {
      id: 'rec-1',
      name: 'Rent',
      amount: 1800,
      category: 'Bills & Utilities',
      billingCycle: 'monthly',
      nextDueDate: new Date(now.getFullYear(), now.getMonth() + 1, 1),
      description: 'Monthly apartment rent',
      isActive: true,
    },
    {
      id: 'rec-2',
      name: 'Netflix',
      amount: 15.99,
      category: 'Entertainment',
      billingCycle: 'monthly',
      nextDueDate: new Date(now.getFullYear(), now.getMonth(), 12),
      description: 'Streaming subscription',
      isActive: true,
    },
    {
      id: 'rec-3',
      name: 'Gym Membership',
      amount: 45,
      category: 'Health',
      billingCycle: 'monthly',
      nextDueDate: new Date(now.getFullYear(), now.getMonth(), 20),
      description: 'Monthly gym membership',
      isActive: true,
    },
    {
      id: 'rec-4',
      name: 'Spotify',
      amount: 9.99,
      category: 'Entertainment',
      billingCycle: 'monthly',
      nextDueDate: new Date(now.getFullYear(), now.getMonth(), 8),
      description: 'Music streaming',
      isActive: true,
    },
    {
      id: 'rec-5',
      name: 'Car Insurance',
      amount: 180,
      category: 'Transportation',
      billingCycle: 'monthly',
      nextDueDate: new Date(now.getFullYear(), now.getMonth() + 1, 3),
      description: 'Auto insurance premium',
      isActive: true,
    },
    {
      id: 'rec-6',
      name: 'Internet',
      amount: 79.99,
      category: 'Bills & Utilities',
      billingCycle: 'monthly',
      nextDueDate: new Date(now.getFullYear(), now.getMonth(), 25),
      description: 'Home internet plan',
      isActive: true,
    },
    {
      id: 'rec-7',
      name: 'Adobe Creative Cloud',
      amount: 599.88,
      category: 'Education',
      billingCycle: 'annually',
      nextDueDate: new Date(now.getFullYear() + 1, 2, 15),
      description: 'Annual creative software plan',
      isActive: true,
    },
    {
      id: 'rec-8',
      name: 'Phone Plan',
      amount: 55,
      category: 'Bills & Utilities',
      billingCycle: 'monthly',
      nextDueDate: new Date(now.getFullYear(), now.getMonth(), 18),
      description: 'Mobile phone plan',
      isActive: false,
    },
  ]
}

export function generateSampleRecurringIncome(): RecurringIncome[] {
  const now = new Date()

  return [
    {
      id: 'inc-1',
      name: 'Primary Salary',
      amount: 4500,
      category: 'Salary',
      billingCycle: 'monthly',
      nextExpectedDate: new Date(now.getFullYear(), now.getMonth() + 1, 1),
      description: 'Monthly salary deposit',
      isActive: true,
    },
    {
      id: 'inc-2',
      name: 'Freelance Client A',
      amount: 800,
      category: 'Freelance',
      billingCycle: 'monthly',
      nextExpectedDate: new Date(now.getFullYear(), now.getMonth(), 20),
      description: 'Retainer contract',
      isActive: true,
    },
    {
      id: 'inc-3',
      name: 'Dividend Income',
      amount: 320,
      category: 'Investments',
      billingCycle: 'quarterly',
      nextExpectedDate: new Date(now.getFullYear(), now.getMonth() + 2, 1),
      description: 'Stock portfolio dividends',
      isActive: true,
    },
    {
      id: 'inc-4',
      name: 'Rental Property',
      amount: 1200,
      category: 'Investments',
      billingCycle: 'monthly',
      nextExpectedDate: new Date(now.getFullYear(), now.getMonth(), 5),
      description: 'Rental unit income',
      isActive: true,
    },
    {
      id: 'inc-5',
      name: 'Side Project',
      amount: 250,
      category: 'Freelance',
      billingCycle: 'monthly',
      nextExpectedDate: new Date(now.getFullYear(), now.getMonth(), 15),
      description: 'SaaS subscription revenue',
      isActive: false,
    },
  ]
}

export interface Transaction {
  id: string
  date: Date
  amount: number
  type: 'income' | 'expense'
  category: string
  description: string
  paid?: boolean
}

export interface DayData {
  date: Date
  transactions: Transaction[]
  totalIncome: number
  totalExpense: number
  net: number
}

export const EXPENSE_CATEGORIES = [
  'Food & Dining',
  'Transportation',
  'Shopping',
  'Entertainment',
  'Bills & Utilities',
  'Health',
  'Travel',
  'Education',
  'Other'
] as const

export const INCOME_CATEGORIES = [
  'Salary',
  'Freelance',
  'Investments',
  'Refunds',
  'Gifts',
  'Other'
] as const

export function generateSampleTransactions(year: number, month: number): Transaction[] {
  const transactions: Transaction[] = []
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  
  // Generate random transactions for the month
  for (let day = 1; day <= daysInMonth; day++) {
    const numTransactions = Math.floor(Math.random() * 4) // 0-3 transactions per day
    
    for (let i = 0; i < numTransactions; i++) {
      const isIncome = Math.random() > 0.7 // 30% chance of income
      const categories = isIncome ? INCOME_CATEGORIES : EXPENSE_CATEGORIES
      const category = categories[Math.floor(Math.random() * categories.length)]
      
      let amount: number
      if (isIncome) {
        amount = Math.floor(Math.random() * 2000) + 100 // $100 - $2100
      } else {
        amount = Math.floor(Math.random() * 200) + 5 // $5 - $205
      }
      
      transactions.push({
        id: `${year}-${month}-${day}-${i}`,
        date: new Date(year, month, day),
        amount,
        type: isIncome ? 'income' : 'expense',
        category,
        description: `${category} transaction`
      })
    }
  }
  
  // Add some recurring transactions
  // Salary on the 1st and 15th
  if (daysInMonth >= 1) {
    transactions.push({
      id: `${year}-${month}-1-salary`,
      date: new Date(year, month, 1),
      amount: 3500,
      type: 'income',
      category: 'Salary',
      description: 'Monthly salary'
    })
  }
  if (daysInMonth >= 15) {
    transactions.push({
      id: `${year}-${month}-15-salary`,
      date: new Date(year, month, 15),
      amount: 3500,
      type: 'income',
      category: 'Salary',
      description: 'Mid-month salary'
    })
  }
  
  // Rent on the 5th
  if (daysInMonth >= 5) {
    transactions.push({
      id: `${year}-${month}-5-rent`,
      date: new Date(year, month, 5),
      amount: 1800,
      type: 'expense',
      category: 'Bills & Utilities',
      description: 'Monthly rent'
    })
  }
  
  return transactions
}

export interface PlaidTransaction {
  id: string
  name: string
  amount: number
  date: string
  merchant_name?: string
  personal_finance_category?: {
    primary: string
    detailed: string
  }
  account_id: string
  account_name: string
}

export interface SpendingByCategory {
  category: string
  amount: number
  count: number
  percentage: number
}

export interface SpendingInsights {
  totalSpent: number
  totalIncome: number
  netSpending: number
  averageTransactionAmount: number
  transactionCount: number
  topCategories: SpendingByCategory[]
  monthlyTrend: Array<{
    month: string
    spent: number
    income: number
  }>
  budgetRecommendations: string[]
}

import { PlaidTransaction, SpendingByCategory, SpendingInsights } from './budget-types'

const PLAID_CATEGORY_MAP: Record<string, string> = {
  'FOOD_AND_DRINK': 'Food & Dining',
  'SHOPS': 'Shopping',
  'TRAVEL': 'Travel',
  'TRANSFER': 'Transfers',
  'ENTERTAINMENT': 'Entertainment',
  'PERSONAL': 'Personal',
  'MEDICAL': 'Health',
  'BILLS_AND_UTILITIES': 'Bills & Utilities',
  'TRANSPORTATION': 'Transportation',
  'EDUCATION': 'Education',
  'WORK': 'Work Expenses',
  'TAXES': 'Taxes',
  'GOVERNMENT': 'Government',
}

export function normalizeCategory(plaidCategory?: { primary: string; detailed: string }): string {
  if (!plaidCategory) return 'Other'
  
  const mapped = PLAID_CATEGORY_MAP[plaidCategory.primary]
  return mapped || plaidCategory.primary || 'Other'
}

export function analyzeSpending(transactions: PlaidTransaction[]): SpendingInsights {
  if (!transactions || transactions.length === 0) {
    return {
      totalSpent: 0,
      totalIncome: 0,
      netSpending: 0,
      averageTransactionAmount: 0,
      transactionCount: 0,
      topCategories: [],
      monthlyTrend: [],
      budgetRecommendations: [],
    }
  }

  // Categorize transactions
  const expenses: PlaidTransaction[] = []
  const income: PlaidTransaction[] = []
  const categorySpending: Record<string, SpendingByCategory> = {}
  const monthlyData: Record<string, { spent: number; income: number }> = {}

  let totalSpent = 0
  let totalIncome = 0

  transactions.forEach(txn => {
    const date = new Date(txn.date)
    const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`

    if (!monthlyData[monthKey]) {
      monthlyData[monthKey] = { spent: 0, income: 0 }
    }

    const amount = Math.abs(txn.amount)
    const category = normalizeCategory(txn.personal_finance_category)

    // Plaid returns negative amounts for expenses, positive for income
    if (txn.amount < 0) {
      expenses.push(txn)
      totalSpent += amount
      monthlyData[monthKey].spent += amount

      if (!categorySpending[category]) {
        categorySpending[category] = {
          category,
          amount: 0,
          count: 0,
          percentage: 0,
        }
      }
      categorySpending[category].amount += amount
      categorySpending[category].count += 1
    } else if (txn.amount > 0) {
      income.push(txn)
      totalIncome += amount
      monthlyData[monthKey].income += amount
    }
  })

  // Calculate percentages and prepare top categories
  const topCategories = Object.values(categorySpending)
    .map(cat => ({
      ...cat,
      percentage: totalSpent > 0 ? (cat.amount / totalSpent) * 100 : 0,
    }))
    .sort((a, b) => b.amount - a.amount)
    .slice(0, 5)

  // Prepare monthly trend
  const monthlyTrend = Object.entries(monthlyData)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([month, data]) => ({
      month,
      spent: data.spent,
      income: data.income,
    }))

  const netSpending = totalSpent - totalIncome
  const averageTransaction = expenses.length > 0 ? totalSpent / expenses.length : 0

  // Generate recommendations
  const recommendations = generateRecommendations(
    totalSpent,
    totalIncome,
    topCategories,
    averageTransaction
  )

  return {
    totalSpent,
    totalIncome,
    netSpending,
    averageTransactionAmount: averageTransaction,
    transactionCount: expenses.length,
    topCategories,
    monthlyTrend,
    budgetRecommendations: recommendations,
  }
}

function generateRecommendations(
  totalSpent: number,
  totalIncome: number,
  topCategories: SpendingByCategory[],
  avgTransaction: number
): string[] {
  const recommendations: string[] = []

  // Check savings rate
  const savingsRate = totalIncome > 0 ? ((totalIncome - totalSpent) / totalIncome) * 100 : 0

  if (savingsRate < 10) {
    recommendations.push(
      'Your savings rate is below 10%. Consider cutting back on discretionary spending to build an emergency fund.'
    )
  } else if (savingsRate > 30) {
    recommendations.push('Great job! Your savings rate is healthy. Keep maintaining this discipline.')
  }

  // Check top spending category
  if (topCategories.length > 0 && topCategories[0].percentage > 40) {
    recommendations.push(
      `${topCategories[0].category} represents over 40% of your spending. Look for ways to optimize this category.`
    )
  }

  // Check average transaction
  if (avgTransaction > 50) {
    recommendations.push(
      'Your average transaction size is relatively large. Consider tracking smaller purchases more carefully.'
    )
  } else if (avgTransaction < 20) {
    recommendations.push(
      'Lots of small transactions detected. Bundle purchases to reduce transaction fees and improve tracking.'
    )
  }

  // Food & Dining specific
  const foodSpending = topCategories.find(c => c.category === 'Food & Dining')
  if (foodSpending && foodSpending.percentage > 15) {
    recommendations.push(
      `Food spending is ${foodSpending.percentage.toFixed(1)}% of budget. Meal planning and cooking at home could help reduce this.`
    )
  }

  // Transportation specific
  const transportSpending = topCategories.find(c => c.category === 'Transportation')
  if (transportSpending && transportSpending.percentage > 10) {
    recommendations.push(
      `Transportation costs are ${transportSpending.percentage.toFixed(1)}% of budget. Explore carpooling, public transit, or bike options.`
    )
  }

  // Shopping specific
  const shoppingSpending = topCategories.find(c => c.category === 'Shopping')
  if (shoppingSpending && shoppingSpending.percentage > 20) {
    recommendations.push(
      'Shopping expenses are high. Create a list before shopping and use the 24-hour rule for non-essentials.'
    )
  }

  return recommendations.slice(0, 4) // Return up to 4 recommendations
}

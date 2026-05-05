import useSWR from 'swr'
import { createClient } from '@/lib/supabase/client'
import { dbToAppTransaction } from '@/lib/supabase/transactions'
import type { DbTransaction } from '@/lib/supabase/database.types'
import type { Transaction } from '@/lib/budget-types'

// Fetcher for transactions by date range
async function fetchTransactionsByRange(key: string): Promise<Transaction[]> {
  const [, startDate, endDate] = key.split('|')
  const supabase = createClient()
  
  const { data, error } = await supabase
    .from('transactions')
    .select('*')
    .gte('date', startDate)
    .lte('date', endDate)
    .order('date', { ascending: true })

  if (error) {
    console.error('Error fetching transactions:', error)
    throw error
  }

  return (data as DbTransaction[]).map(dbToAppTransaction)
}

export function useTransactions(startDate: Date, endDate: Date) {
  const startStr = startDate.toISOString().split('T')[0]
  const endStr = endDate.toISOString().split('T')[0]
  const key = `transactions|${startStr}|${endStr}`

  const { data, error, isLoading, mutate } = useSWR(key, fetchTransactionsByRange, {
    revalidateOnFocus: false,
    dedupingInterval: 5000,
  })

  return {
    transactions: data ?? [],
    isLoading,
    error,
    mutate,
  }
}

export function useMonthTransactions(year: number, month: number) {
  const startDate = new Date(year, month, 1)
  const endDate = new Date(year, month + 1, 0) // Last day of month
  
  return useTransactions(startDate, endDate)
}

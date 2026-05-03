import { createClient } from './client'
import type { DbTransaction, InsertTransaction } from './database.types'
import type { Transaction } from '@/lib/budget-types'

// Convert database transaction to app transaction
export function dbToAppTransaction(db: DbTransaction): Transaction {
  return {
    id: db.id,
    date: new Date(db.date),
    amount: Number(db.amount),
    type: db.type,
    category: db.description, // Using description as category for now
    description: db.description,
    paid: db.is_paid,
  }
}

// Convert app transaction to database format
export function appToDbTransaction(
  transaction: Omit<Transaction, 'id'>,
  userId: string
): InsertTransaction {
  return {
    user_id: userId,
    type: transaction.type,
    amount: transaction.amount,
    description: transaction.description,
    date: transaction.date.toISOString().split('T')[0],
    is_paid: transaction.paid ?? false,
  }
}

export async function getTransactions(
  startDate: Date,
  endDate: Date
): Promise<Transaction[]> {
  const supabase = createClient()
  
  const { data, error } = await supabase
    .from('transactions')
    .select('*')
    .gte('date', startDate.toISOString().split('T')[0])
    .lte('date', endDate.toISOString().split('T')[0])
    .order('date', { ascending: true })

  if (error) {
    console.error('Error fetching transactions:', error)
    return []
  }

  return (data as DbTransaction[]).map(dbToAppTransaction)
}

export async function getTransactionsByMonth(
  year: number,
  month: number
): Promise<Transaction[]> {
  const startDate = new Date(year, month, 1)
  const endDate = new Date(year, month + 1, 0) // Last day of month
  return getTransactions(startDate, endDate)
}

export async function addTransaction(
  transaction: Omit<Transaction, 'id'>,
  userId: string
): Promise<Transaction | null> {
  const supabase = createClient()
  
  const dbTransaction = appToDbTransaction(transaction, userId)
  
  const { data, error } = await supabase
    .from('transactions')
    .insert(dbTransaction)
    .select()
    .single()

  if (error) {
    console.error('Error adding transaction:', error)
    return null
  }

  return dbToAppTransaction(data as DbTransaction)
}

export async function updateTransaction(
  id: string,
  updates: Partial<Omit<Transaction, 'id'>>
): Promise<Transaction | null> {
  const supabase = createClient()
  
  const dbUpdates: Partial<DbTransaction> = {}
  if (updates.amount !== undefined) dbUpdates.amount = updates.amount
  if (updates.description !== undefined) dbUpdates.description = updates.description
  if (updates.type !== undefined) dbUpdates.type = updates.type
  if (updates.date !== undefined) dbUpdates.date = updates.date.toISOString().split('T')[0]
  if (updates.paid !== undefined) dbUpdates.is_paid = updates.paid

  const { data, error } = await supabase
    .from('transactions')
    .update(dbUpdates)
    .eq('id', id)
    .select()
    .single()

  if (error) {
    console.error('Error updating transaction:', error)
    return null
  }

  return dbToAppTransaction(data as DbTransaction)
}

export async function deleteTransaction(id: string): Promise<boolean> {
  const supabase = createClient()
  
  const { error } = await supabase
    .from('transactions')
    .delete()
    .eq('id', id)

  if (error) {
    console.error('Error deleting transaction:', error)
    return false
  }

  return true
}

export async function toggleTransactionPaid(id: string): Promise<Transaction | null> {
  const supabase = createClient()
  
  // First get the current state
  const { data: current, error: fetchError } = await supabase
    .from('transactions')
    .select('is_paid')
    .eq('id', id)
    .single()

  if (fetchError) {
    console.error('Error fetching transaction:', fetchError)
    return null
  }

  // Toggle the is_paid status
  const { data, error } = await supabase
    .from('transactions')
    .update({ is_paid: !(current as { is_paid: boolean }).is_paid })
    .eq('id', id)
    .select()
    .single()

  if (error) {
    console.error('Error toggling transaction paid status:', error)
    return null
  }

  return dbToAppTransaction(data as DbTransaction)
}

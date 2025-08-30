import { createClient } from '@supabase/supabase-js'
import { config } from './config'

export const supabase = createClient(config.supabase.url, config.supabase.anonKey)

// Database types matching the required schema
export interface User {
  id: string
  email: string
  isPremium: boolean
  createdAt: string
  updatedAt: string
}

export interface History {
  id: string
  userId: string
  inputText: string
  resultText: string
  type: 'text' | 'url'
  createdAt: string
}

// Database operations
export const db = {
  // User operations
  async getUser(userId: string): Promise<User | null> {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', userId)
      .single()
    
    if (error) {
      console.error('Error fetching user:', error)
      return null
    }
    
    return data
  },

  async updateUserPremium(userId: string, isPremium: boolean): Promise<boolean> {
    const { error } = await supabase
      .from('users')
      .update({ isPremium, updatedAt: new Date().toISOString() })
      .eq('id', userId)
    
    if (error) {
      console.error('Error updating user premium status:', error)
      return false
    }
    
    return true
  },

  // History operations
  async createHistoryEntry(entry: Omit<History, 'id' | 'createdAt'>): Promise<string | null> {
    const { data, error } = await supabase
      .from('history')
      .insert([{
        ...entry,
        createdAt: new Date().toISOString()
      }])
      .select('id')
      .single()
    
    if (error) {
      console.error('Error creating history entry:', error)
      return null
    }
    
    return data.id
  },

  async getUserHistory(userId: string, limit = 50): Promise<History[]> {
    const { data, error } = await supabase
      .from('history')
      .select('*')
      .eq('userId', userId)
      .order('createdAt', { ascending: false })
      .limit(limit)
    
    if (error) {
      console.error('Error fetching user history:', error)
      return []
    }
    
    return data || []
  },

  async deleteHistoryEntry(entryId: string, userId: string): Promise<boolean> {
    const { error } = await supabase
      .from('history')
      .delete()
      .eq('id', entryId)
      .eq('userId', userId)
    
    if (error) {
      console.error('Error deleting history entry:', error)
      return false
    }
    
    return true
  }
}

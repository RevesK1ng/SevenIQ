import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'

export interface UsageStats {
  runCount: number
  isPro: boolean
  dailyLimit: number
  remainingRuns: number
  totalRuns: number
  favoriteMode: string
  avgConfidence: number
  successRate: number
}

export interface ExplainerRun {
  id: number
  problemText: string
  explanationMode: string
  answer: string
  confidence: number
  method: string
  wordCount: number
  success: boolean
  errorMessage?: string
  createdAt: string
}

export async function getRunCount(userId: string): Promise<number> {
  const supabase = createServerComponentClient({ cookies })
  
  try {
    const { count, error } = await supabase
      .from('explainer_runs')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', userId)
      .gte('created_at', new Date().toISOString().split('T')[0]) // Today

    if (error) {
      console.error('Error fetching run count:', error)
      return 0
    }

    return count || 0
  } catch (error) {
    console.error('Error in getRunCount:', error)
    return 0
  }
}

export async function getUsageStats(userId: string): Promise<UsageStats> {
  const supabase = createServerComponentClient({ cookies })
  
  try {


    // Get user profile to check pro status
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('pro')
      .eq('user_id', userId)
      .single()

    if (profileError) {
      console.error('Error fetching profile:', profileError)
      return { 
        runCount: 0, 
        isPro: false, 
        dailyLimit: 3, 
        remainingRuns: 3,
        totalRuns: 0,
        favoriteMode: 'child',
        avgConfidence: 0,
        successRate: 0
      }
    }

    const isPro = profile.pro
    const dailyLimit = isPro ? -1 : 3 // Free users get 3 runs per day
    const runCount = isPro ? 0 : await getRunCount(userId)
    const remainingRuns = isPro ? -1 : Math.max(0, dailyLimit - runCount)

    // Get detailed usage statistics
    const { data: stats, error: statsError } = await supabase
      .rpc('get_user_usage_stats', { user_uuid: userId })

    if (statsError) {
      console.error('Error fetching usage stats:', statsError)
    }

    const stat = stats?.[0] || {
      total_runs: 0,
      runs_today: 0,
      favorite_mode: 'child',
      avg_confidence: 0,
      success_rate: 0
    }

    return {
      runCount,
      isPro,
      dailyLimit,
      remainingRuns,
      totalRuns: stat.total_runs,
      favoriteMode: stat.favorite_mode,
      avgConfidence: stat.avg_confidence,
      successRate: stat.success_rate
    }
  } catch (error) {
    console.error('Error in getUsageStats:', error)
    return { 
      runCount: 0, 
      isPro: false, 
      dailyLimit: 3, 
      remainingRuns: 3,
      totalRuns: 0,
      favoriteMode: 'child',
      avgConfidence: 0,
      successRate: 0
    }
  }
}

export async function trackUsageEvent(
  userId: string, 
  kind: string, 
  meta: Record<string, any> = {}
): Promise<void> {


  const supabase = createServerComponentClient({ cookies })
  
  try {
    // Track in the legacy usage_events table for backward compatibility
    const { error: legacyError } = await supabase
      .from('usage_events')
      .insert({
        user_id: userId,
        kind,
        meta
      })

    if (legacyError) {
      console.error('Error tracking legacy usage event:', legacyError)
    }

    // Track in the new explainer_runs table if this is an explainer run
    if (kind === 'explainer_run' && meta.mode) {
      const { error: explainerError } = await supabase
        .from('explainer_runs')
        .insert({
          user_id: userId,
          problem_text: meta.problemText || 'Unknown problem',
          explanation_mode: meta.mode,
          answer: meta.answer || null,
          confidence: meta.confidence || null,
          method: meta.method || null,
          word_count: meta.wordCount || 0,
          success: meta.success !== false,
          error_message: meta.errorMessage || null
        })

      if (explainerError) {
        console.error('Error tracking explainer run:', explainerError)
      }
    }
  } catch (error) {
    console.error('Error in trackUsageEvent:', error)
  }
}

export async function getExplainerRuns(userId: string, limit: number = 10): Promise<ExplainerRun[]> {
  const supabase = createServerComponentClient({ cookies })
  
  try {
    const { data, error } = await supabase
      .from('explainer_runs')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(limit)

    if (error) {
      console.error('Error fetching explainer runs:', error)
      return []
    }

    return data?.map(run => ({
      id: run.id,
      problemText: run.problem_text,
      explanationMode: run.explanation_mode,
      answer: run.answer,
      confidence: run.confidence,
      method: run.method,
      wordCount: run.word_count,
      success: run.success,
      errorMessage: run.error_message,
      createdAt: run.created_at
    })) || []
  } catch (error) {
    console.error('Error in getExplainerRuns:', error)
    return []
  }
}

export async function getModeUsageStats(userId: string): Promise<Record<string, number>> {
  const supabase = createServerComponentClient({ cookies })
  
  try {
    const { data, error } = await supabase
      .from('explainer_runs')
      .select('explanation_mode')
      .eq('user_id', userId)

    if (error) {
      console.error('Error fetching mode usage stats:', error)
      return {}
    }

    const modeCounts: Record<string, number> = {}
    data?.forEach(run => {
      modeCounts[run.explanation_mode] = (modeCounts[run.explanation_mode] || 0) + 1
    })

    return modeCounts
  } catch (error) {
    console.error('Error in getModeUsageStats:', error)
    return {}
  }
}

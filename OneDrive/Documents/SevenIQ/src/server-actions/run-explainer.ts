'use server'

import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { revalidatePath } from 'next/cache'
import { getRunCount, trackUsageEvent } from '@/lib/usage'
import { runModel, ExplanationMode } from '@/lib/model'
import { analytics } from '@/lib/analytics'

export interface ExplainRequest {
  text?: string
  url?: string
  mode: ExplanationMode
}

export interface ExplainResponse {
  explanation: string
  usageCount: number
  isPro: boolean
  gated?: boolean
  remainingRuns: number
  mode: ExplanationMode
  timestamp: Date
  wordCount: number
}

export async function runExplainer(request: ExplainRequest): Promise<ExplainResponse> {
  const supabase = createServerComponentClient({ cookies })
  
  try {
    // Get current user session
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError) {
      // In demo mode, allow anonymous users
      if (process.env.NODE_ENV === 'development') {
        console.log('Demo mode - allowing anonymous user')
      } else {
        throw new Error('Authentication error')
      }
    }

    // Check if user exists and get their profile
    let isPro = false
    let usageCount = 0
    let remainingRuns = 3 // Default for anonymous users
    
    if (user) {
      // Handle demo mode user
      if (user.id === 'demo-user') {
        isPro = true
        remainingRuns = -1
      } else {
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('pro')
          .eq('user_id', user.id)
          .single()

        if (profileError) {
          throw new Error('Failed to fetch user profile')
        }

        isPro = profile.pro
      }

      // If not pro, check usage count
      if (!isPro) {
        usageCount = await getRunCount(user.id)
        remainingRuns = Math.max(0, 15 - usageCount) // 15 daily limit for free users

        // Check if user has reached daily limit
        if (usageCount >= 15) {
          // Track gating event
          await analytics.gated('daily_limit_reached', user.id)
          
          return {
            explanation: '',
            usageCount,
            isPro,
            gated: true,
            remainingRuns: 0,
            mode: request.mode,
            timestamp: new Date(),
            wordCount: 0
          }
        }
      } else {
        remainingRuns = -1 // Unlimited for pro users
      }
    } else {
      // Anonymous user - check if they have remaining free uses
      // This would typically be stored in a session or cookie
      // For now, we'll allow anonymous users to proceed
      usageCount = 0
      remainingRuns = 3
    }

    // Generate explanation using AI model
    const modelResponse = await runModel({
      text: request.text || request.url || '',
      mode: request.mode
    })

    // Track usage if user is logged in, not pro, and not demo
    if (user && !isPro && user.id !== 'demo-user') {
      await trackUsageEvent(user.id, 'explainer_run', {
        mode: request.mode,
        text_length: (request.text || request.url || '').length,
        explanation_length: modelResponse.explanation.length,
        word_count: modelResponse.wordCount
      })
    }

    // Track successful explanation (skip analytics in demo mode)
    if (user?.id !== 'demo-user') {
      await analytics.runExplainer(request.mode, (request.text || request.url || '').length, user?.id)
    }

    // Revalidate the app page to show updated usage
    revalidatePath('/app')

    return {
      explanation: modelResponse.explanation,
      usageCount: isPro ? -1 : usageCount + 1, // -1 indicates unlimited
      isPro,
      remainingRuns: isPro ? -1 : remainingRuns - 1,
      mode: modelResponse.mode,
      timestamp: modelResponse.timestamp,
      wordCount: modelResponse.wordCount
    }

  } catch (error) {
    console.error('Explainer error:', error)
    throw error
  }
}

export async function getUsageStats(): Promise<{ usageCount: number; isPro: boolean; remainingRuns: number }> {
  const supabase = createServerComponentClient({ cookies })
  
  try {
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      return { usageCount: 0, isPro: false, remainingRuns: 3 }
    }

    // Handle demo mode user
    if (user.id === 'demo-user') {
      return { usageCount: -1, isPro: true, remainingRuns: -1 }
    }

    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('pro')
      .eq('user_id', user.id)
      .single()

    if (profileError) {
      return { usageCount: 0, isPro: false, remainingRuns: 3 }
    }

    if (profile.pro) {
      return { usageCount: -1, isPro: true, remainingRuns: -1 }
    }

    const usageCount = await getRunCount(user.id)
    const remainingRuns = Math.max(0, 15 - usageCount)

    return { usageCount, isPro: false, remainingRuns }

  } catch (error) {
    console.error('Usage stats error:', error)
    return { usageCount: 0, isPro: false, remainingRuns: 3 }
  }
}

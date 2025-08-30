'use server'

import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { revalidatePath } from 'next/cache'
import Stripe from 'stripe'
import { analytics } from '@/lib/analytics'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16',
})

export interface CreateCheckoutSessionRequest {
  priceId: string
  successUrl: string
  cancelUrl: string
}

export interface CreateCheckoutSessionResponse {
  sessionId: string
  error?: string
}

export async function createCheckoutSession(
  request: CreateCheckoutSessionRequest
): Promise<CreateCheckoutSessionResponse> {
  const supabase = createServerComponentClient({ cookies })
  
  try {
    // Get current user
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      throw new Error('User not authenticated')
    }

    // Get or create Stripe customer
    let customerId: string
    
    // First check if user already has a stripe_customer_id in profiles
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('stripe_customer_id')
      .eq('user_id', user.id)
      .single()

    if (profileError) {
      throw new Error('Failed to fetch user profile')
    }

    if (profile.stripe_customer_id) {
      customerId = profile.stripe_customer_id
    } else {
      // Create new Stripe customer
      const customer = await stripe.customers.create({
        email: user.email,
        metadata: {
          supabase_user_id: user.id,
        },
      })

      customerId = customer.id

      // Update profile with Stripe customer ID
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ stripe_customer_id: customerId })
        .eq('user_id', user.id)

      if (updateError) {
        console.error('Failed to update profile with Stripe customer ID:', updateError)
        // Continue anyway as we have the customer ID
      }
    }

    // Track subscription click
    const planType = request.priceId.includes('yearly') ? 'yearly' : 'monthly'
    await analytics.subscribeClicked(planType, user.id)

    // Create checkout session
    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      payment_method_types: ['card'],
      line_items: [
        {
          price: request.priceId,
          quantity: 1,
        },
      ],
      mode: 'subscription',
      success_url: request.successUrl,
      cancel_url: request.cancelUrl,
      allow_promotion_codes: true,
      metadata: {
        supabase_user_id: user.id,
      },
      subscription_data: {
        metadata: {
          supabase_user_id: user.id,
        },
      },
    })

    return { sessionId: session.id }

  } catch (error) {
    console.error('Checkout session creation error:', error)
    return { 
      sessionId: '', 
      error: error instanceof Error ? error.message : 'Unknown error' 
    }
  }
}

export async function createPortalSession(customerId: string): Promise<string> {
  try {
    const session = await stripe.billingPortal.sessions.create({
      customer: customerId,
      return_url: process.env.STRIPE_PORTAL_RETURN_URL || 'http://localhost:3000/billing',
    })

    return session.url
  } catch (error) {
    console.error('Portal session creation error:', error)
    throw new Error('Failed to create billing portal session')
  }
}

export async function getSubscriptionStatus(): Promise<{
  isPro: boolean
  status: string
  currentPeriodEnd?: Date
  cancelAtPeriodEnd: boolean
}> {
  const supabase = createServerComponentClient({ cookies })
  
  try {
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      return { isPro: false, status: 'unauthenticated', cancelAtPeriodEnd: false }
    }

    const { data: subscription, error: subError } = await supabase
      .from('subscriptions')
      .select('*')
      .eq('user_id', user.id)
      .single()

    if (subError || !subscription) {
      return { isPro: false, status: 'no_subscription', cancelAtPeriodEnd: false }
    }

    return {
      isPro: subscription.status === 'active',
      status: subscription.status,
      currentPeriodEnd: subscription.current_period_end ? new Date(subscription.current_period_end) : undefined,
      cancelAtPeriodEnd: subscription.status === 'canceled' || subscription.status === 'unpaid'
    }

  } catch (error) {
    console.error('Subscription status error:', error)
    return { isPro: false, status: 'error', cancelAtPeriodEnd: false }
  }
}

export async function cancelSubscription(): Promise<{ success: boolean; error?: string }> {
  const supabase = createServerComponentClient({ cookies })
  
  try {
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      throw new Error('User not authenticated')
    }

    const { data: subscription, error: subError } = await supabase
      .from('subscriptions')
      .select('stripe_subscription_id')
      .eq('user_id', user.id)
      .single()

    if (subError || !subscription?.stripe_subscription_id) {
      throw new Error('No active subscription found')
    }

    // Cancel at period end
    await stripe.subscriptions.update(subscription.stripe_subscription_id, {
      cancel_at_period_end: true,
    })

    revalidatePath('/billing')
    return { success: true }

  } catch (error) {
    console.error('Subscription cancellation error:', error)
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    }
  }
}

export async function reactivateSubscription(): Promise<{ success: boolean; error?: string }> {
  const supabase = createServerComponentClient({ cookies })
  
  try {
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      throw new Error('User not authenticated')
    }

    const { data: subscription, error: subError } = await supabase
      .from('subscriptions')
      .select('stripe_subscription_id')
      .eq('user_id', user.id)
      .single()

    if (subError || !subscription?.stripe_subscription_id) {
      throw new Error('No subscription found')
    }

    // Reactivate subscription
    await stripe.subscriptions.update(subscription.stripe_subscription_id, {
      cancel_at_period_end: false,
    })

    revalidatePath('/billing')
    return { success: true }

  } catch (error) {
    console.error('Subscription reactivation error:', error)
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    }
  }
}

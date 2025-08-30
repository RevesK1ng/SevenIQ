import { NextRequest, NextResponse } from 'next/server'
import { stripe, validateStripeConfig, STRIPE_WEBHOOK_EVENTS } from '@/lib/stripe'
import { headers } from 'next/headers'
import type Stripe from 'stripe'

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!

export async function POST(request: NextRequest) {
  try {
    // Validate Stripe configuration
    if (!validateStripeConfig()) {
      console.error('Stripe configuration is incomplete')
      return NextResponse.json(
        { error: 'Stripe configuration is incomplete' },
        { status: 500 }
      )
    }

    const body = await request.text()
    const headersList = await headers()
    const signature = headersList.get('stripe-signature')

    if (!signature) {
      return NextResponse.json(
        { error: 'Missing stripe signature' },
        { status: 400 }
      )
    }

    let event: Stripe.Event

    try {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret)
    } catch (err) {
      console.error('Webhook signature verification failed:', err)
      return NextResponse.json(
        { error: 'Invalid signature' },
        { status: 400 }
      )
    }

    console.log(`Processing webhook event: ${event.type}`)

    // Handle the event
    switch (event.type) {
      case STRIPE_WEBHOOK_EVENTS.CHECKOUT_SESSION_COMPLETED:
        const session = event.data.object as Stripe.Checkout.Session
        
        if (session.mode === 'subscription') {
          console.log('Subscription created:', session.subscription)
          
          // Update user subscription in database
          try {
            const { createClient } = await import('@supabase/supabase-js')
            const supabase = createClient(
              process.env.NEXT_PUBLIC_SUPABASE_URL!,
              process.env.SUPABASE_SERVICE_ROLE_KEY!
            )
            
            // Update user profile to premium
            const { error: profileError } = await supabase
              .from('profiles')
              .update({ 
                pro: true,
                stripe_customer_id: session.customer as string,
                updated_at: new Date().toISOString()
              })
              .eq('user_id', session.metadata?.supabase_user_id)
            
            if (profileError) {
              console.error('Failed to update user profile:', profileError)
            }
            
            // Create subscription record
            const { error: subError } = await supabase
              .from('subscriptions')
              .insert({
                user_id: session.metadata?.supabase_user_id,
                stripe_subscription_id: session.subscription as string,
                stripe_customer_id: session.customer as string,
                status: 'active',
                plan: 'pro',
                current_period_start: new Date().toISOString(),
                current_period_end: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days
                created_at: new Date().toISOString()
              })
            
            if (subError) {
              console.error('Failed to create subscription record:', subError)
            }
            
            console.log('Successfully updated user subscription in database')
          } catch (dbError) {
            console.error('Database update error:', dbError)
          }
        }
        break

      case STRIPE_WEBHOOK_EVENTS.CUSTOMER_SUBSCRIPTION_UPDATED:
        const subscription = event.data.object as Stripe.Subscription
        
        try {
          const { createClient } = await import('@supabase/supabase-js')
          const supabase = createClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.SUPABASE_SERVICE_ROLE_KEY!
          )
          
          if (subscription.status === 'active') {
            console.log('Subscription activated:', subscription.id)
            
            // Update subscription status and user premium status
            const { error: subError } = await supabase
              .from('subscriptions')
              .update({ 
                status: 'active',
                current_period_end: new Date(subscription.current_period_end * 1000).toISOString()
              })
              .eq('stripe_subscription_id', subscription.id)
            
            if (subError) {
              console.error('Failed to update subscription status:', subError)
            }
            
            // Update user profile to premium
            const { error: profileError } = await supabase
              .from('profiles')
              .update({ pro: true })
              .eq('stripe_customer_id', subscription.customer as string)
            
            if (profileError) {
              console.error('Failed to update user profile:', profileError)
            }
            
          } else if (subscription.status === 'canceled' || subscription.status === 'unpaid') {
            console.log('Subscription canceled/unpaid:', subscription.id)
            
            // Update subscription status
            const { error: subError } = await supabase
              .from('subscriptions')
              .update({ status: subscription.status })
              .eq('stripe_subscription_id', subscription.id)
            
            if (subError) {
              console.error('Failed to update subscription status:', subError)
            }
            
            // Update user profile to remove premium
            const { error: profileError } = await supabase
              .from('profiles')
              .update({ pro: false })
              .eq('stripe_customer_id', subscription.customer as string)
            
            if (profileError) {
              console.error('Failed to update user profile:', profileError)
            }
            
          } else if (subscription.status === 'past_due') {
            console.log('Subscription past due:', subscription.id)
            
            // Update subscription status
            const { error: subError } = await supabase
              .from('subscriptions')
              .update({ status: 'past_due' })
              .eq('stripe_subscription_id', subscription.id)
            
            if (subError) {
              console.error('Failed to update subscription status:', subError)
            }
          }
        } catch (dbError) {
          console.error('Database update error:', dbError)
        }
        break

      case STRIPE_WEBHOOK_EVENTS.CUSTOMER_SUBSCRIPTION_DELETED:
        const deletedSubscription = event.data.object as Stripe.Subscription
        console.log('Subscription deleted:', deletedSubscription.id)
        
        try {
          const { createClient } = await import('@supabase/supabase-js')
          const supabase = createClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.SUPABASE_SERVICE_ROLE_KEY!
          )
          
          // Update subscription status
          const { error: subError } = await supabase
            .from('subscriptions')
            .update({ status: 'deleted' })
            .eq('stripe_subscription_id', deletedSubscription.id)
          
          if (subError) {
            console.error('Failed to update subscription status:', subError)
          }
          
          // Update user profile to remove premium
          const { error: profileError } = await supabase
            .from('profiles')
            .update({ pro: false })
            .eq('stripe_customer_id', deletedSubscription.customer as string)
          
          if (profileError) {
            console.error('Failed to update user profile:', profileError)
          }
        } catch (dbError) {
          console.error('Database update error:', dbError)
        }
        break

      case STRIPE_WEBHOOK_EVENTS.INVOICE_PAYMENT_FAILED:
        const invoice = event.data.object as Stripe.Invoice
        console.log('Payment failed for subscription:', invoice.subscription)
        // TODO: Handle failed payment in database
        break

      case STRIPE_WEBHOOK_EVENTS.INVOICE_PAYMENT_SUCCEEDED:
        const successfulInvoice = event.data.object as Stripe.Invoice
        console.log('Payment succeeded for subscription:', successfulInvoice.subscription)
        // TODO: Handle successful payment in database
        break

      default:
        console.log(`Unhandled event type: ${event.type}`)
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error('Webhook error:', error)
    
    if (error instanceof Error) {
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      )
    }
    
    return NextResponse.json(
      { error: 'Webhook handler failed' },
      { status: 500 }
    )
  }
}

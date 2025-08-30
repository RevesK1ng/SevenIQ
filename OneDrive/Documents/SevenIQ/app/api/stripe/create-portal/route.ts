import { NextRequest, NextResponse } from 'next/server'
import { stripe, validateStripeConfig } from '@/lib/stripe'

export async function POST(request: NextRequest) {
  try {
    const { customerId, returnUrl, isDemo } = await request.json()

    // Handle demo mode
    if (isDemo) {
      return NextResponse.json({ 
        url: '/billing?demo=true',
        demo: true,
        message: 'Demo mode - portal would redirect to Stripe in production'
      })
    }

    // Validate Stripe configuration
    if (!validateStripeConfig()) {
      return NextResponse.json(
        { error: 'Stripe configuration is incomplete. Please configure Stripe environment variables.' },
        { status: 500 }
      )
    }

    // Validate required fields
    if (!customerId || !returnUrl) {
      return NextResponse.json(
        { error: 'Missing required fields: customerId, returnUrl' },
        { status: 400 }
      )
    }

    // Create Stripe customer portal session
    const session = await stripe.billingPortal.sessions.create({
      customer: customerId,
      return_url: returnUrl,
    })

    return NextResponse.json({ url: session.url })
  } catch (error) {
    console.error('Stripe portal error:', error)
    
    if (error instanceof Error) {
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      )
    }
    
    return NextResponse.json(
      { error: 'Failed to create portal session' },
      { status: 500 }
    )
  }
}

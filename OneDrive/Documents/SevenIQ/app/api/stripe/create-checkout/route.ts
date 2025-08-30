import { NextRequest, NextResponse } from 'next/server'
import { stripe, validateStripeConfig } from '@/lib/stripe'

export async function POST(request: NextRequest) {
  try {
    const { priceId, successUrl, cancelUrl, isDemo } = await request.json()

    // Handle demo mode
    if (isDemo) {
      return NextResponse.json({ 
        sessionId: 'demo_checkout_session',
        demo: true,
        message: 'Demo mode - checkout would redirect to Stripe in production'
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
    if (!priceId || !successUrl || !cancelUrl) {
      return NextResponse.json(
        { error: 'Missing required fields: priceId, successUrl, cancelUrl' },
        { status: 400 }
      )
    }

    // Create Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: 'subscription',
      success_url: successUrl,
      cancel_url: cancelUrl,
      allow_promotion_codes: true,
      billing_address_collection: 'auto',
      customer_creation: 'always',
      metadata: {
        product: 'seveniq_pro',
        price_id: priceId,
      },
    })

    return NextResponse.json({ sessionId: session.id })
  } catch (error) {
    console.error('Stripe checkout error:', error)
    
    if (error instanceof Error) {
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      )
    }
    
    return NextResponse.json(
      { error: 'Failed to create checkout session' },
      { status: 500 }
    )
  }
}

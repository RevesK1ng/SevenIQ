import Stripe from 'stripe'
import { config } from './config'

// Server-side Stripe instance
export const stripe = new Stripe(config.stripe.secretKey, {
  apiVersion: '2023-10-16',
})

// Client-side Stripe configuration
export const STRIPE_CONFIG = {
  publishableKey: config.stripe.publishableKey,
  priceIds: {
    pro_monthly: config.stripe.priceIds.proMonthly,
    pro_yearly: config.stripe.priceIds.proYearly,
  },
  successUrl: config.siteUrl + '/billing?success=true',
  cancelUrl: config.siteUrl + '/pricing',
}

// Demo mode Stripe configuration
export const DEMO_STRIPE_CONFIG = {
  publishableKey: 'pk_test_demo',
  priceIds: {
    pro_monthly: 'price_demo_monthly',
    pro_yearly: 'price_demo_yearly',
  },
  successUrl: config.siteUrl + '/billing?success=true&demo=true',
  cancelUrl: config.siteUrl + '/pricing',
}

// Validate Stripe configuration
export function validateStripeConfig() {
  if (!config.features.enableStripe) {
    console.warn('Stripe is not configured - payments will not work')
    return false
  }
  
  // Check if we have the minimum required Stripe configuration
  if (!config.stripe.secretKey || config.stripe.secretKey === 'sk_test_placeholder') {
    console.warn('Stripe secret key not configured - payments will not work')
    return false
  }
  
  return true
}

// Stripe webhook event types
export const STRIPE_WEBHOOK_EVENTS = {
  CHECKOUT_SESSION_COMPLETED: 'checkout.session.completed',
  CUSTOMER_SUBSCRIPTION_UPDATED: 'customer.subscription.updated',
  CUSTOMER_SUBSCRIPTION_DELETED: 'customer.subscription.deleted',
  INVOICE_PAYMENT_FAILED: 'invoice.payment_failed',
  INVOICE_PAYMENT_SUCCEEDED: 'invoice.payment_succeeded',
} as const

export type StripeWebhookEventType = typeof STRIPE_WEBHOOK_EVENTS[keyof typeof STRIPE_WEBHOOK_EVENTS]

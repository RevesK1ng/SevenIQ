import { stripe } from './stripe'

export interface StripeCustomer {
  id: string
  email: string
  name?: string
  metadata?: Record<string, string>
}

export interface StripeSubscription {
  id: string
  status: string
  current_period_end: number
  cancel_at_period_end: boolean
  items: {
    data: Array<{
      price: {
        id: string
        unit_amount: number
        currency: string
        recurring: {
          interval: string
        }
      }
    }>
  }
}

/**
 * Create or retrieve a Stripe customer
 */
export async function getOrCreateCustomer(email: string, name?: string, metadata?: Record<string, string>) {
  try {
    // First, try to find existing customer by email
    const existingCustomers = await stripe.customers.list({
      email,
      limit: 1,
    })

    if (existingCustomers.data.length > 0) {
      const customer = existingCustomers.data[0]
      
      // Update customer metadata if provided
      if (metadata && Object.keys(metadata).length > 0) {
        await stripe.customers.update(customer.id, { metadata })
      }
      
      return customer
    }

    // Create new customer if none exists
    const customer = await stripe.customers.create({
      email,
      name,
      metadata,
    })

    return customer
  } catch (error) {
    console.error('Error getting/creating customer:', error)
    throw error
  }
}

/**
 * Get customer subscription details
 */
export async function getCustomerSubscription(customerId: string): Promise<StripeSubscription | null> {
  try {
    const subscriptions = await stripe.subscriptions.list({
      customer: customerId,
      status: 'all',
      limit: 1,
    })

    if (subscriptions.data.length > 0) {
      return subscriptions.data[0] as StripeSubscription
    }

    return null
  } catch (error) {
    console.error('Error getting customer subscription:', error)
    throw error
  }
}

/**
 * Cancel subscription at period end
 */
export async function cancelSubscriptionAtPeriodEnd(subscriptionId: string) {
  try {
    const subscription = await stripe.subscriptions.update(subscriptionId, {
      cancel_at_period_end: true,
    })

    return subscription
  } catch (error) {
    console.error('Error canceling subscription:', error)
    throw error
  }
}

/**
 * Reactivate a canceled subscription
 */
export async function reactivateSubscription(subscriptionId: string) {
  try {
    const subscription = await stripe.subscriptions.update(subscriptionId, {
      cancel_at_period_end: false,
    })

    return subscription
  } catch (error) {
    console.error('Error reactivating subscription:', error)
    throw error
  }
}

/**
 * Get subscription price details
 */
export async function getPriceDetails(priceId: string) {
  try {
    const price = await stripe.prices.retrieve(priceId)
    return price
  } catch (error) {
    console.error('Error getting price details:', error)
    throw error
  }
}

/**
 * Format currency amount
 */
export function formatCurrency(amount: number, currency: string = 'usd'): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency.toUpperCase(),
  }).format(amount / 100)
}

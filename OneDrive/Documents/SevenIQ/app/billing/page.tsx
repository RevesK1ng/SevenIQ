'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/lib/auth-context'
import { useRouter } from 'next/navigation'
import { CreditCard, Calendar, BarChart3, Settings, ArrowRight, Crown, Zap, Check } from 'lucide-react'
import Link from 'next/link'
import toast from 'react-hot-toast'

interface BillingInfo {
  currentPlan: 'free' | 'pro'
  nextBillingDate: string
  usage: {
    explanations: number
    limit: number | null
  }
  subscriptionId?: string
}

export default function BillingPage() {
  const { user, isPremium } = useAuth()
  const router = useRouter()
  const [billingInfo, setBillingInfo] = useState<BillingInfo | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (!user) {
      router.push('/auth')
      return
    }

    // Mock billing info - replace with actual API call
    setBillingInfo({
      currentPlan: isPremium ? 'pro' : 'free',
      nextBillingDate: '2024-02-15',
      usage: {
        explanations: 12,
        limit: isPremium ? null : 15
      },
      subscriptionId: isPremium ? 'sub_123' : undefined
    })
  }, [user, isPremium, router])

  const handleManageBilling = async () => {
    if (!billingInfo?.subscriptionId) {
      toast.error('No active subscription to manage')
      return
    }

    setIsLoading(true)
    
    try {
      const response = await fetch('/api/stripe/create-portal', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          customerId: user?.id || '',
          returnUrl: `${window.location.origin}/billing`,
        }),
      })

      const { url } = await response.json()
      window.location.href = url
    } catch (error) {
      console.error('Portal error:', error)
      toast.error('Failed to open billing portal. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleUpgrade = async () => {
    if (!user) return
    
    setIsLoading(true)
    try {
      const response = await fetch('/api/stripe/create-checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          priceId: process.env.NEXT_PUBLIC_STRIPE_PRO_MONTHLY_PRICE_ID || 'price_monthly_placeholder',
          successUrl: `${window.location.origin}/billing?success=true`,
          cancelUrl: `${window.location.origin}/billing`,
          isDemo: user?.id === 'demo-user'
        })
      })
      
      if (!response.ok) {
        throw new Error('Failed to create checkout session')
      }
      
      const data = await response.json()
      
      if (data.demo) {
        // Demo mode - show success message
        toast.success('Demo mode: Checkout would redirect to Stripe in production')
        return
      }
      
      if (data.sessionId) {
        // Redirect to Stripe checkout
        window.location.href = `https://checkout.stripe.com/pay/${data.sessionId}`
      } else {
        throw new Error('No checkout session ID received')
      }
    } catch (error) {
      console.error('Error creating checkout:', error)
      toast.error('Failed to start upgrade process. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  if (!user || !billingInfo) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-500"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 nav-glass">
        <div className="max-content container-padding">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-primary-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">7</span>
              </div>
              <span className="text-xl font-bold text-text">SevenIQ</span>
            </Link>
            
            <div className="flex items-center space-x-4">
              <Link href="/app" className="nav-link">
                App
              </Link>
              <Link href="/pricing" className="nav-link">
                Pricing
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-content container-padding py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-text mb-2">Billing & Usage</h1>
            <p className="text-text-muted">
              Manage your subscription and view your usage statistics.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Current Plan */}
            <div className="lg:col-span-2">
              <div className="card">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold text-text">Current Plan</h2>
                  {billingInfo.currentPlan === 'pro' && (
                    <span className="bg-primary-100 text-primary-800 px-3 py-1 rounded-full text-sm font-medium">
                      Pro
                    </span>
                  )}
                </div>

                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
                      {billingInfo.currentPlan === 'pro' ? (
                        <Crown className="w-5 h-5 text-primary-600" />
                      ) : (
                        <Zap className="w-5 h-5 text-primary-600" />
                      )}
                    </div>
                    <div>
                      <h3 className="font-medium text-text">
                        {billingInfo.currentPlan === 'pro' ? 'Pro Plan' : 'Free Plan'}
                      </h3>
                      <p className="text-sm text-text-muted">
                        {billingInfo.currentPlan === 'pro' 
                          ? 'Unlimited explanations with priority processing'
                          : '15 explanations per day'
                        }
                      </p>
                    </div>
                  </div>

                  {billingInfo.currentPlan === 'pro' && (
                    <div className="flex items-center space-x-3 text-sm text-text-muted">
                      <Calendar className="w-4 h-4" />
                      <span>Next billing: {billingInfo.nextBillingDate}</span>
                    </div>
                  )}

                  <div className="pt-4 border-t border-border">
                    {billingInfo.currentPlan === 'pro' ? (
                      <button
                        onClick={handleManageBilling}
                        disabled={isLoading}
                        className="btn-secondary w-full disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {isLoading ? 'Loading...' : 'Manage billing'}
                      </button>
                    ) : (
                      <button
                        onClick={handleUpgrade}
                        className="btn-primary w-full"
                      >
                        Upgrade to Pro
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Usage Stats */}
            <div className="lg:col-span-1">
              <div className="card">
                <h2 className="text-xl font-semibold text-text mb-6">Usage This Month</h2>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-text-muted">Explanations</span>
                    <span className="font-medium text-text">
                      {billingInfo.usage.explanations}
                      {billingInfo.usage.limit && ` / ${billingInfo.usage.limit}`}
                    </span>
                  </div>

                  {billingInfo.usage.limit && (
                    <div className="w-full bg-surface-200 rounded-full h-2">
                      <div
                        className="bg-primary-500 h-2 rounded-full transition-all duration-300"
                        style={{
                          width: `${Math.min((billingInfo.usage.explanations / billingInfo.usage.limit) * 100, 100)}%`
                        }}
                      ></div>
                    </div>
                  )}

                  <div className="pt-4 border-t border-border">
                    <Link href="/app" className="btn-secondary w-full">
                      Create explanation
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Plan Features */}
          <div className="mt-8">
            <div className="card">
              <h2 className="text-xl font-semibold text-text mb-6">Plan Features</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <h3 className="font-medium text-text">Free Plan</h3>
                  <ul className="space-y-2 text-sm text-text-muted">
                    <li className="flex items-center space-x-2">
                      <Check className="w-4 h-4 text-success-500" />
                      <span>3 explanations without signup</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <Check className="w-4 h-4 text-success-500" />
                      <span>15 explanations per day</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <Check className="w-4 h-4 text-success-500" />
                      <span>All explanation modes</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <Check className="w-4 h-4 text-success-500" />
                      <span>Basic history</span>
                    </li>
                  </ul>
                </div>

                <div className="space-y-3">
                  <h3 className="font-medium text-text">Pro Plan</h3>
                  <ul className="space-y-2 text-sm text-text-muted">
                    <li className="flex items-center space-x-2">
                      <Check className="w-4 h-4 text-success-500" />
                      <span>Unlimited explanations</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <Check className="w-4 h-4 text-success-500" />
                      <span>Priority processing</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <Check className="w-4 h-4 text-success-500" />
                      <span>Full history + search</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <Check className="w-4 h-4 text-success-500" />
                      <span>Export & sharing</span>
                    </li>
                  </ul>
                </div>
              </div>

              {billingInfo.currentPlan === 'free' && (
                <div className="mt-6 pt-6 border-t border-border text-center">
                  <p className="text-text-muted mb-4">
                    Ready for unlimited explanations?
                  </p>
                  <button
                    onClick={handleUpgrade}
                    className="btn-primary"
                  >
                    Upgrade to Pro — $5/month
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Support */}
          <div className="mt-8">
            <div className="card text-center">
              <h2 className="text-xl font-semibold text-text mb-4">Need Help?</h2>
              <p className="text-text-muted mb-6">
                Have questions about your billing or subscription? Our support team is here to help.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <a
                  href="mailto:support@seveniq.com"
                  className="btn-secondary"
                >
                  Contact Support
                </a>
                <Link href="/pricing" className="btn-secondary">
                  View Plans
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

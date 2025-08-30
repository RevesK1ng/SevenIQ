'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/lib/auth-context'
import { useRouter, useSearchParams } from 'next/navigation'
import { Mail, Lock, Eye, EyeOff, ArrowRight, CheckCircle, AlertTriangle } from 'lucide-react'
import Link from 'next/link'
import toast from 'react-hot-toast'
import Nav from '@/components/nav'

type AuthMode = 'signin' | 'signup'

export default function AuthPage() {
  const { signIn, signUp, signInWithMagicLink } = useAuth()
  const router = useRouter()
  const searchParams = useSearchParams()
  const [mode, setMode] = useState<AuthMode>(searchParams.get('mode') as AuthMode || 'signin')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isMagicLinkSent, setIsMagicLinkSent] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  // Check for error from auth callback
  useEffect(() => {
    const error = searchParams.get('error')
    if (error) {
      setErrors({ general: decodeURIComponent(error) })
    }
  }, [searchParams])

  const validateForm = () => {
    const newErrors: Record<string, string> = {}
    
    if (!email) {
      newErrors.email = 'Email is required'
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Please enter a valid email'
    }
    
    if (mode === 'signup' && !password) {
      newErrors.password = 'Password is required'
    } else if (mode === 'signup' && password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters'
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) return
    
    setIsLoading(true)
    setErrors({})
    
    try {
      // Demo mode - simulate successful auth
      if (mode === 'signin') {
        toast.success('Demo mode: Sign in simulated successfully!')
      } else {
        toast.success('Demo mode: Account creation simulated successfully!')
      }
      
      // Redirect to app in demo mode
      router.push('/app')
    } catch (error: any) {
      console.error('Auth error:', error)
      if (error.message) {
        setErrors({ general: error.message })
      } else {
        setErrors({ general: 'An error occurred. Please try again.' })
      }
    } finally {
      setIsLoading(false)
    }
  }

  const handleMagicLink = async () => {
    if (!email || !/\S+@\S+\.\S+/.test(email)) {
      setErrors({ email: 'Please enter a valid email' })
      return
    }
    
    setIsLoading(true)
    setErrors({})
    
    try {
      // Demo mode - simulate magic link
      toast.success('Demo mode: Magic link simulated successfully!')
      router.push('/app')
    } catch (error: any) {
      console.error('Magic link error:', error)
      if (error.message) {
        setErrors({ general: error.message })
      } else {
        setErrors({ general: 'Failed to send magic link. Please try again.' })
      }
    } finally {
      setIsLoading(false)
    }
  }

  if (isMagicLinkSent) {
    return (
      <div className="min-h-screen bg-background">
        <Nav variant="marketing" />
        <div className="flex items-center justify-center min-h-[calc(100vh-4rem)] p-4">
          <div className="max-w-md w-full">
            <div className="card text-center">
              <div className="w-16 h-16 bg-success-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8 text-success-500" />
              </div>
              <h1 className="text-2xl font-bold text-text mb-2">Check your email</h1>
              <p className="text-text-muted mb-6">
                We've sent a magic link to <strong>{email}</strong>. Click the link to sign in instantly.
              </p>
              <button
                onClick={() => setIsMagicLinkSent(false)}
                className="btn-secondary w-full"
              >
                Back to sign in
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Nav variant="marketing" />
      
      {/* Disclaimer Banner */}
      <div className="bg-amber-50 border-b border-amber-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <div className="flex items-center justify-center space-x-2 text-amber-800">
            <AlertTriangle className="w-5 h-5" />
            <span className="text-sm font-medium">
              Demo Mode: Authentication is simulated. This is a portfolio showcase.
            </span>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-center min-h-[calc(100vh-8rem)] p-4">
        <div className="max-w-md w-full">
          {/* Logo */}
          <div className="text-center mb-8">
            <Link href="/" className="inline-flex items-center space-x-2">
              <div className="w-10 h-10 bg-primary-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl">7</span>
              </div>
              <span className="text-2xl font-bold text-text">SevenIQ</span>
            </Link>
          </div>

          {/* Auth Card */}
          <div className="card">
            {/* Mode Tabs */}
            <div className="flex space-x-1 bg-surface-100 rounded-lg p-1 mb-6">
              <button
                onClick={() => setMode('signin')}
                className={`flex-1 px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                  mode === 'signin'
                    ? 'bg-surface text-text shadow-elevation-1'
                    : 'text-text-muted hover:text-text'
                }`}
              >
                Sign In
              </button>
              <button
                onClick={() => setMode('signup')}
                className={`flex-1 px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                  mode === 'signup'
                    ? 'bg-surface text-text shadow-elevation-1'
                    : 'text-text-muted hover:text-text'
                }`}
              >
                Create Account
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Email Field */}
              <div>
                <label htmlFor="email" className="form-label">
                  Email address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-text-muted" />
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className={`input-field pl-10 ${errors.email ? 'error' : ''}`}
                    placeholder="Enter your email"
                  />
                </div>
                {errors.email && <div className="form-error">{errors.email}</div>}
              </div>

              {/* Password Field */}
              {mode === 'signup' && (
                <div>
                  <label htmlFor="password" className="form-label">
                    Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-text-muted" />
                    <input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className={`input-field pl-10 pr-10 ${errors.password ? 'error' : ''}`}
                      placeholder="Create a password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-text-muted hover:text-text"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                  {errors.password && <div className="form-error">{errors.password}</div>}
                </div>
              )}

              {/* General Error */}
              {errors.general && (
                <div className="alert alert-error">
                  {errors.general}
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  'Processing...'
                ) : (
                  <>
                    {mode === 'signin' ? 'Sign in' : 'Create account'}
                    <ArrowRight className="ml-2 w-4 h-4" />
                  </>
                )}
              </button>
            </form>

            {/* Magic Link Option */}
            {mode === 'signin' && (
              <div className="mt-6 pt-6 border-t border-border">
                <button
                  onClick={handleMagicLink}
                  disabled={isLoading || !email}
                  className="btn-secondary w-full disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? 'Sending...' : 'Email me a one-time sign-in link'}
                </button>
              </div>
            )}

            {/* Demo Notice */}
            <div className="mt-6 p-4 bg-amber-50 border border-amber-200 rounded-lg">
              <div className="flex items-start space-x-3">
                <AlertTriangle className="w-5 h-5 text-amber-600 mt-0.5" />
                <div className="text-sm text-amber-800">
                  <p className="font-medium mb-1">Demo Mode Active</p>
                  <p className="text-amber-700">Authentication is simulated for portfolio purposes. Any email/password combination will work.</p>
                </div>
              </div>
            </div>

            {/* Social Proof */}
            <div className="mt-6 text-center">
              <p className="text-sm text-text-muted">
                No ads. Cancel anytime.
              </p>
            </div>
          </div>

          {/* Footer Links */}
          <div className="text-center mt-6">
            <p className="text-sm text-text-muted">
              {mode === 'signin' ? "Don't have an account? " : 'Already have an account? '}
              <button
                onClick={() => setMode(mode === 'signin' ? 'signup' : 'signin')}
                className="text-primary-500 hover:text-primary-600 font-medium"
              >
                {mode === 'signin' ? 'Create one' : 'Sign in'}
              </button>
            </p>
          </div>

          {/* Back to Home */}
          <div className="text-center mt-4">
            <Link href="/" className="text-sm text-text-muted hover:text-text">
              ← Back to home
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

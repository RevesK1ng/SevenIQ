'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Sparkles, History, Crown, Download, Loader2, Copy, Check, LogOut } from 'lucide-react'
import toast from 'react-hot-toast'
import { useAuth } from '@/lib/auth-context'
import { db, History as HistoryType } from '@/lib/supabase'

export default function DashboardPage() {
  const [input, setInput] = useState('')
  const [inputType, setInputType] = useState<'text' | 'url'>('text')
  const [explanationMode, setExplanationMode] = useState<'child' | 'grandma' | 'ceo' | 'technical'>('child')
  const [isLoading, setIsLoading] = useState(false)
  const [currentExplanation, setCurrentExplanation] = useState<string>('')
  const [explanations, setExplanations] = useState<HistoryType[]>([])
  const [copied, setCopied] = useState(false)
  const [isUpgrading, setIsUpgrading] = useState(false)
  const router = useRouter()
  const { user, session, signOut, isPremium, loading } = useAuth()

  // Redirect if not authenticated
  useEffect(() => {
    if (!loading && !user) {
      router.push('/auth')
    }
  }, [user, loading, router])

  // Load user history
  useEffect(() => {
    if (user && user.id !== 'demo-user') {
      loadUserHistory()
    }
  }, [user])

  const loadUserHistory = async () => {
    if (!user) return
    
    try {
      const history = await db.getUserHistory(user.id, 10)
      setExplanations(history)
    } catch (error) {
      console.error('Error loading history:', error)
      // In demo mode, show empty history
      setExplanations([])
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim()) return

    setIsLoading(true)
    setCurrentExplanation('')

    try {
      const response = await fetch('/api/explain', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          text: inputType === 'url' ? undefined : input,
          url: inputType === 'url' ? input : undefined,
          mode: explanationMode,
          userId: user?.id || '',
          isAnonymous: false
        })
      })
      
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to generate explanation')
      }
      
      const data = await response.json()
      setCurrentExplanation(data.explanation)
      
      // Try to save to history if user is authenticated and not demo
      if (user && user.id !== 'demo-user') {
        try {
          await db.createHistoryEntry({
            userId: user?.id || '',
            inputText: input,
            resultText: data.explanation,
            type: inputType
          })
          // Reload history to show new entry
          await loadUserHistory()
        } catch (error) {
          console.warn('Failed to save to history:', error)
          // Continue without saving - this is not critical
        }
      }
      
      // Update usage stats if available
      if (data.usageCount !== undefined) {
        // This would update the usage counter if we had one
        console.log('Usage updated:', data.usageCount)
      }
      
      toast.success('Explanation generated successfully!')
    } catch (error) {
      console.error('Error:', error)
      toast.error(error instanceof Error ? error.message : 'Failed to generate explanation. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      toast.success('Copied to clipboard!')
      setTimeout(() => setCopied(false), 2000)
    } catch (error) {
      toast.error('Failed to copy to clipboard')
    }
  }

  const downloadPDF = () => {
    if (!isPremium) {
      toast.error('Premium feature. Upgrade to download PDFs.')
      return
    }
    // TODO: Implement PDF download
    toast.success('PDF download started!')
  }

  const handleUpgrade = async () => {
    if (!user) return
    
    setIsUpgrading(true)
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
      setIsUpgrading(false)
    }
  }

  const handleSignOut = async () => {
    try {
      await signOut()
      router.push('/')
      toast.success('Signed out successfully')
    } catch (error) {
      toast.error('Failed to sign out')
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-secondary-50 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary-600" />
      </div>
    )
  }

  if (!user) {
    return null
  }

  return (
    <div className="min-h-screen bg-secondary-50">
      {/* Header */}
      <header className="bg-white border-b border-secondary-200 px-6 py-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">7</span>
            </div>
            <span className="text-xl font-bold text-secondary-900">SevenIQ</span>
          </div>
          
          <div className="flex items-center space-x-4">
            {user?.id === 'demo-user' && (
              <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                Demo Mode
              </span>
            )}
            {!isPremium && user?.id !== 'demo-user' && (
              <button 
                onClick={handleUpgrade}
                disabled={isUpgrading}
                className="flex items-center space-x-2 bg-gradient-to-r from-yellow-400 to-yellow-600 text-white px-4 py-2 rounded-lg font-medium hover:from-yellow-500 hover:to-yellow-700 transition-all disabled:opacity-50"
              >
                {isUpgrading ? (
                  <Loader2 size={16} className="animate-spin" />
                ) : (
                  <Crown size={16} />
                )}
                <span>{isUpgrading ? 'Processing...' : 'Go Premium'}</span>
              </button>
            )}
            <button 
              onClick={handleSignOut}
              className="flex items-center space-x-2 text-secondary-600 hover:text-secondary-900 transition-colors"
            >
              <LogOut size={16} />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Input Section */}
            <div className="card mb-6">
                              <h2 className="text-2xl font-bold text-secondary-900 mb-4">
                  Explain Like I'm 5
                </h2>
                <p className="text-secondary-600 mb-6">
                  Paste any text or URL below and get a simple, friendly explanation
                </p>
                {user?.id === 'demo-user' && (
                  <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                    <p className="text-sm text-blue-700">
                      🎯 <strong>Demo Mode:</strong> AI explanations are working with mock responses. 
                      Configure OpenAI API key for real AI-powered explanations.
                    </p>
                  </div>
                )}
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="flex space-x-2 mb-4">
                  <button
                    type="button"
                    onClick={() => setInputType('text')}
                    className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                      inputType === 'text'
                        ? 'bg-primary-600 text-white'
                        : 'bg-secondary-100 text-secondary-600 hover:bg-secondary-200'
                    }`}
                  >
                    Text
                  </button>
                  <button
                    type="button"
                    onClick={() => setInputType('url')}
                    className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                      inputType === 'url'
                        ? 'bg-primary-600 text-white'
                        : 'bg-secondary-100 text-secondary-600 hover:bg-secondary-200'
                    }`}
                  >
                    URL
                  </button>
                </div>
                
                {/* Explanation Mode Selection */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-secondary-700 mb-2">
                    Explanation Style
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { key: 'child', label: '👶 Child', desc: 'Simple & friendly' },
                      { key: 'grandma', label: '👵 Grandma', desc: 'Warm & patient' },
                      { key: 'ceo', label: '💼 CEO', desc: 'Concise & strategic' },
                      { key: 'technical', label: '⚙️ Technical', desc: 'Detailed & precise' }
                    ].map((mode) => (
                      <button
                        key={mode.key}
                        type="button"
                        onClick={() => setExplanationMode(mode.key as any)}
                        className={`p-3 rounded-lg border-2 transition-all ${
                          explanationMode === mode.key
                            ? 'border-primary-500 bg-primary-50 text-primary-700'
                            : 'border-secondary-200 hover:border-secondary-300 bg-white text-secondary-700'
                        }`}
                      >
                        <div className="font-medium text-sm">{mode.label}</div>
                        <div className="text-xs text-secondary-600">{mode.desc}</div>
                      </button>
                    ))}
                  </div>
                </div>
                
                <div>
                  <textarea
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder={
                      inputType === 'text' 
                        ? 'Paste your text here...' 
                        : 'Enter a URL to explain...'
                    }
                    className="input-field min-h-[120px] resize-none"
                    required
                  />
                </div>
                
                <button
                  type="submit"
                  disabled={isLoading || !input.trim()}
                  className="btn-primary w-full flex items-center justify-center"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                      Explaining...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-5 h-5 mr-2" />
                      Explain This
                    </>
                  )}
                </button>
              </form>
            </div>

            {/* Result Section */}
            {currentExplanation && (
              <div className="card">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-xl font-semibold text-secondary-900">
                      Your Explanation
                    </h3>
                    <p className="text-sm text-secondary-600 capitalize">
                      {explanationMode} Mode • {inputType === 'url' ? 'URL Content' : 'Text Input'}
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => copyToClipboard(currentExplanation)}
                      className="flex items-center space-x-2 px-3 py-2 text-secondary-600 hover:text-secondary-900 rounded-lg hover:bg-secondary-100 transition-colors"
                    >
                      {copied ? <Check size={16} /> : <Copy size={16} />}
                      <span>{copied ? 'Copied!' : 'Copy'}</span>
                    </button>
                    {isPremium && (
                      <button
                        onClick={downloadPDF}
                        className="flex items-center space-x-2 px-3 py-2 text-primary-600 hover:text-primary-700 rounded-lg hover:bg-primary-50 transition-colors"
                      >
                        <Download size={16} />
                        <span>PDF</span>
                      </button>
                    )}
                  </div>
                </div>
                
                <div className="prose prose-secondary max-w-none">
                  <div className="whitespace-pre-wrap text-secondary-700 leading-relaxed">
                    {currentExplanation}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Premium Upgrade */}
            {!isPremium && user?.id !== 'demo-user' && (
              <div className="card bg-gradient-to-br from-yellow-50 to-orange-50 border-yellow-200">
                <div className="text-center">
                  <Crown className="w-12 h-12 text-yellow-600 mx-auto mb-3" />
                  <h3 className="text-lg font-semibold text-secondary-900 mb-2">
                    Upgrade to Premium
                  </h3>
                  <p className="text-secondary-600 mb-4 text-sm">
                    Get unlimited explanations, batch processing, and PDF downloads
                  </p>
                  <button 
                    onClick={handleUpgrade}
                    disabled={isUpgrading}
                    className="bg-yellow-600 hover:bg-yellow-700 text-white px-6 py-2 rounded-lg font-medium transition-colors disabled:opacity-50"
                  >
                    {isUpgrading ? 'Processing...' : 'Upgrade Now'}
                  </button>
                </div>
              </div>
            )}
            
            {/* Demo Mode Info */}
            {user?.id === 'demo-user' && (
              <div className="card bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200">
                <div className="text-center">
                  <Crown className="w-12 h-12 text-blue-600 mx-auto mb-3" />
                  <h3 className="text-lg font-semibold text-secondary-900 mb-2">
                    Demo Mode Active
                  </h3>
                  <p className="text-secondary-600 mb-4 text-sm">
                    You're currently in demo mode with premium features enabled for testing
                  </p>
                  <div className="text-xs text-blue-600">
                    Configure Supabase and Stripe for production use
                  </div>
                </div>
              </div>
            )}

            {/* History */}
            <div className="card">
              <div className="flex items-center space-x-2 mb-4">
                <History className="w-5 h-5 text-secondary-600" />
                <h3 className="text-lg font-semibold text-secondary-900">
                  Recent Explanations
                </h3>
              </div>
              
              {user?.id === 'demo-user' ? (
                <div className="text-center py-4">
                  <p className="text-sm text-secondary-500 mb-2">
                    Demo mode - history not available
                  </p>
                  <p className="text-xs text-blue-600">
                    Configure Supabase to enable history tracking
                  </p>
                </div>
              ) : (
                <>
                  <div className="space-y-3">
                    {explanations.slice(0, 5).map((explanation) => (
                      <div
                        key={explanation.id}
                        className="p-3 bg-secondary-50 rounded-lg cursor-pointer hover:bg-secondary-100 transition-colors"
                        onClick={() => {
                          setInput(explanation.inputText)
                          setInputType(explanation.type as 'text' | 'url')
                          setCurrentExplanation(explanation.resultText)
                        }}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1 min-w-0">
                            <p className="text-sm text-secondary-900 font-medium truncate">
                              {explanation.inputText}
                            </p>
                            <p className="text-xs text-secondary-500 mt-1">
                              {new Date(explanation.createdAt).toLocaleDateString()}
                            </p>
                          </div>
                          <div className="ml-2">
                            <span className={`inline-block w-2 h-2 rounded-full ${
                              explanation.type === 'text' ? 'bg-blue-500' : 'bg-green-500'
                            }`} />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  {explanations.length === 0 && (
                    <p className="text-sm text-secondary-500 text-center py-4">
                      No explanations yet. Start by explaining something!
                    </p>
                  )}
                  
                  {explanations.length > 5 && (
                    <button className="w-full mt-3 text-sm text-primary-600 hover:text-primary-700 font-medium">
                      View All History
                    </button>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

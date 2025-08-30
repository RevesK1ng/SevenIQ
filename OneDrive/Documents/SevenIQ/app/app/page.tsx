'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { useAuth } from '@/lib/auth-context'
import ExplainerForm from '@/components/explainer-form'
import ResultCard from '@/components/result-card'
import { useRouter } from 'next/navigation'
import { Brain, Sparkles, Zap, Shield, AlertTriangle } from 'lucide-react'
import Nav from '@/components/nav'

interface Explanation {
  id: string
  text: string
  mode: string
  timestamp: Date
  wordCount: number
}

export default function AppPage() {
  const { user, signIn } = useAuth()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [explanation, setExplanation] = useState<Explanation | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (text: string, mode: string, isUrl?: boolean) => {
    if (!text.trim()) {
      setError('Please enter some text or a URL to explain')
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch('/api/explain', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text: isUrl ? undefined : text,
          url: isUrl ? text : undefined,
          mode,
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to generate explanation')
      }

      const data = await response.json()
      
      setExplanation({
        id: Date.now().toString(),
        text: data.explanation,
        mode,
        timestamp: new Date(),
        wordCount: data.wordCount || 0,
      })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
    } finally {
      setIsLoading(false)
    }
  }

  const handleUpgrade = () => {
    router.push('/pricing')
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-white">
        <Nav />
        <div className="flex items-center justify-center min-h-[calc(100vh-4rem)]">
          <div className="max-w-md w-full mx-auto p-6">
            <div className="text-center mb-8">
              <Brain className="w-16 h-16 text-blue-600 mx-auto mb-4" />
              <h1 className="text-2xl font-bold text-gray-900 mb-2">Welcome to SevenIQ</h1>
              <p className="text-gray-600">Sign in to start generating AI explanations</p>
            </div>
            
            <button
              onClick={() => router.push('/try-now')}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-6 rounded-lg font-semibold transition-colors"
            >
              Sign In to Continue
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white">
      <Nav />
      
      {/* Disclaimer Banner */}
      <div className="bg-amber-50 border-b border-amber-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <div className="flex items-center justify-center space-x-2 text-amber-800">
            <AlertTriangle className="w-5 h-5" />
            <span className="text-sm font-medium">
              Demo Mode: AI integration and payment features are not configured. This is a portfolio showcase.
            </span>
          </div>
        </div>
      </div>

      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Brain className="w-8 h-8 text-blue-600" />
              <h1 className="text-2xl font-bold text-gray-900">AI Explainer</h1>
            </div>
            
            <div className="flex items-center space-x-4">
              <button
                onClick={() => router.push('/try-now')}
                className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg font-medium transition-colors"
              >
                Dashboard
              </button>
              <button
                onClick={handleUpgrade}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
              >
                Upgrade
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Form */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <ExplainerForm
                onSubmit={handleSubmit}
                isLoading={isLoading}
              />
            </motion.div>

            {error && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg"
              >
                <p className="text-red-700">{error}</p>
              </motion.div>
            )}
          </div>

          {/* Right Column - Features & Info */}
          <div className="space-y-6">
            {/* Features */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="bg-white border border-gray-200 rounded-lg p-6"
            >
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Features</h3>
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <Sparkles className="w-5 h-5 text-blue-600" />
                  <span className="text-sm text-gray-600">Multiple explanation modes</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Zap className="w-5 h-5 text-blue-600" />
                  <span className="text-sm text-gray-600">Lightning fast processing</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Shield className="w-5 h-5 text-blue-600" />
                  <span className="text-sm text-gray-600">Privacy focused</span>
                </div>
              </div>
            </motion.div>

            {/* Usage Info */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="bg-white border border-gray-200 rounded-lg p-6"
            >
              <h3 className="text-lg font-semibold text-gray-900 mb-4">How it works</h3>
              <div className="space-y-3 text-sm text-gray-600">
                <p>1. Enter your text or paste a URL</p>
                <p>2. Choose your preferred explanation mode</p>
                <p>3. Get an AI-generated explanation instantly</p>
                <p>4. Save and manage your explanations</p>
              </div>
            </motion.div>

            {/* Demo Notice */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="bg-amber-50 border border-amber-200 rounded-lg p-6"
            >
              <h3 className="text-lg font-semibold text-amber-800 mb-4">Demo Mode</h3>
              <div className="space-y-3 text-sm text-amber-700">
                <p>• AI explanations are simulated</p>
                <p>• No real OpenAI integration</p>
                <p>• Payment features disabled</p>
                <p>• This is a portfolio showcase</p>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Results */}
        {explanation && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mt-8"
          >
            <ResultCard
              explanation={explanation.text}
              mode={explanation.mode as any}
              timestamp={explanation.timestamp}
              wordCount={explanation.wordCount}
              originalText={explanation.text}
              onRerun={async (newMode) => {
                // Rerun functionality would go here
                console.log('Rerunning with mode:', newMode)
              }}
            />
          </motion.div>
        )}
      </div>
    </div>
  )
}

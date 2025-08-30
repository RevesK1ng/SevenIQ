'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Brain, Sparkles, Zap, Shield, AlertTriangle, Send, Copy, Download } from 'lucide-react'
import Nav from '@/components/nav'
import Footer from '@/components/footer'

interface Explanation {
  id: string
  text: string
  mode: string
  timestamp: Date
  wordCount: number
}

const explanationModes = [
  {
    id: 'child',
    name: 'Child Mode',
    description: 'Simple, friendly explanations perfect for kids and beginners',
    icon: '👶',
    color: 'from-blue-500 to-blue-600'
  },
  {
    id: 'grandma',
    name: 'Grandma Mode',
    description: 'Warm, patient explanations that anyone can understand',
    icon: '👵',
    color: 'from-purple-500 to-purple-600'
  },
  {
    id: 'ceo',
    name: 'CEO Mode',
    description: 'Concise, professional explanations for busy executives',
    icon: '💼',
    color: 'from-green-500 to-green-600'
  },
  {
    id: 'technical',
    name: 'Technical Mode',
    description: 'Detailed technical explanations with depth and precision',
    icon: '⚙️',
    color: 'from-orange-500 to-orange-600'
  }
]

export default function TryNowPage() {
  const [selectedMode, setSelectedMode] = useState('child')
  const [inputText, setInputText] = useState('')
  const [isUrl, setIsUrl] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [explanation, setExplanation] = useState<Explanation | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!inputText.trim()) {
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
          text: isUrl ? undefined : inputText,
          url: isUrl ? inputText : undefined,
          mode: selectedMode,
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to generate explanation')
      }

      const data = await response.json()
      
      setExplanation({
        id: Date.now().toString(),
        text: data.explanation,
        mode: selectedMode,
        timestamp: new Date(),
        wordCount: data.wordCount || 0,
      })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
    } finally {
      setIsLoading(false)
    }
  }

  const copyToClipboard = () => {
    if (explanation) {
      navigator.clipboard.writeText(explanation.text)
    }
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
              Demo Mode: AI integration is not configured. This is a portfolio showcase with simulated responses.
            </span>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <section className="pt-16 pb-12 bg-gradient-to-br from-blue-50 to-purple-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.h1 
            className="text-4xl md:text-5xl font-bold text-gray-900 mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            Try{' '}
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">SevenIQ</span>{' '}
            Now
          </motion.h1>
          <motion.p 
            className="text-xl text-gray-600 max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            Experience the power of AI-powered explanations. Choose your preferred style and get instant results.
          </motion.p>
        </div>
      </section>

      {/* Main Interface */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Input Form */}
            <div className="lg:col-span-2">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="bg-white p-8 rounded-xl shadow-sm border border-gray-100"
              >
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Generate Explanation</h2>
                
                {/* Mode Selection */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-3">Choose Explanation Mode</label>
                  <div className="grid grid-cols-2 gap-3">
                    {explanationModes.map((mode) => (
                      <button
                        key={mode.id}
                        onClick={() => setSelectedMode(mode.id)}
                        className={`p-4 rounded-lg border-2 transition-all duration-200 ${
                          selectedMode === mode.id
                            ? 'border-blue-500 bg-blue-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <div className="text-2xl mb-2">{mode.icon}</div>
                        <div className="text-sm font-semibold text-gray-900">{mode.name}</div>
                        <div className="text-xs text-gray-600 mt-1">{mode.description}</div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Input Form */}
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      What would you like explained?
                    </label>
                    <div className="flex space-x-2 mb-2">
                      <button
                        type="button"
                        onClick={() => setIsUrl(false)}
                        className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                          !isUrl
                            ? 'bg-blue-100 text-blue-700'
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        }`}
                      >
                        Text
                      </button>
                      <button
                        type="button"
                        onClick={() => setIsUrl(true)}
                        className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                          isUrl
                            ? 'bg-blue-100 text-blue-700'
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        }`}
                      >
                        URL
                      </button>
                    </div>
                    <textarea
                      value={inputText}
                      onChange={(e) => setInputText(e.target.value)}
                      placeholder={isUrl ? "Paste a URL here..." : "Enter your text, question, or concept here..."}
                      className="w-full h-32 p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading || !inputText.trim()}
                    className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white py-3 px-6 rounded-lg font-semibold transition-colors flex items-center justify-center space-x-2"
                  >
                    {isLoading ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        <span>Generating...</span>
                      </>
                    ) : (
                      <>
                        <Send className="w-5 h-5" />
                        <span>Generate Explanation</span>
                      </>
                    )}
                  </button>
                </form>

                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg"
                  >
                    <p className="text-red-700">{error}</p>
                  </motion.div>
                )}
              </motion.div>
            </div>

            {/* Right Column - Info & Features */}
            <div className="space-y-6">
              {/* Features */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="bg-white p-6 rounded-xl shadow-sm border border-gray-100"
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

              {/* How it works */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="bg-white p-6 rounded-xl shadow-sm border border-gray-100"
              >
                <h3 className="text-lg font-semibold text-gray-900 mb-4">How it works</h3>
                <div className="space-y-3 text-sm text-gray-600">
                  <p>1. Enter your text or paste a URL</p>
                  <p>2. Choose your preferred explanation mode</p>
                  <p>3. Get an AI-generated explanation instantly</p>
                  <p>4. Copy or download your results</p>
                </div>
              </motion.div>

              {/* Demo Notice */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.6 }}
                className="bg-amber-50 border border-amber-200 rounded-xl p-6"
              >
                <h3 className="text-lg font-semibold text-amber-800 mb-4">Demo Mode</h3>
                <div className="space-y-3 text-sm text-amber-700">
                  <p>• AI explanations are simulated</p>
                  <p>• No real OpenAI integration</p>
                  <p>• This is a portfolio showcase</p>
                  <p>• Full functionality in production</p>
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
              className="mt-8 bg-white p-8 rounded-xl shadow-sm border border-gray-100"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold text-gray-900">Explanation Result</h3>
                <div className="flex space-x-2">
                  <button
                    onClick={copyToClipboard}
                    className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-sm font-medium transition-colors flex items-center space-x-2"
                  >
                    <Copy className="w-4 h-4" />
                    <span>Copy</span>
                  </button>
                  <button className="px-4 py-2 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-lg text-sm font-medium transition-colors flex items-center space-x-2">
                    <Download className="w-4 h-4" />
                    <span>Download</span>
                  </button>
                </div>
              </div>
              
              <div className="bg-gray-50 p-6 rounded-lg">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <Brain className="w-4 h-4 text-blue-600" />
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-500">Mode:</span>
                    <span className="ml-2 text-sm font-semibold text-gray-900 capitalize">{explanation.mode}</span>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-500">Words:</span>
                    <span className="ml-2 text-sm font-semibold text-gray-900">{explanation.wordCount}</span>
                  </div>
                </div>
                
                <div className="prose max-w-none">
                  <p className="text-gray-800 whitespace-pre-wrap">{explanation.text}</p>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  )
}

'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Copy, Download, Share2, RefreshCw, Check, ExternalLink } from 'lucide-react'
import { ExplanationMode, getModeIcon, getModeDescription } from '@/lib/model'
import { analytics } from '@/lib/analytics'
import toast from 'react-hot-toast'

interface ResultCardProps {
  explanation: string
  mode: ExplanationMode
  timestamp: Date
  wordCount: number
  originalText: string
  onRerun: (mode: ExplanationMode) => Promise<void>
  onRerunSameMode?: () => Promise<void>
}

export default function ResultCard({
  explanation,
  mode,
  timestamp,
  wordCount,
  originalText,
  onRerun,
  onRerunSameMode
}: ResultCardProps) {
  const [copied, setCopied] = useState(false)
  const [isRerunning, setIsRerunning] = useState(false)

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(explanation)
      setCopied(true)
      toast.success('Explanation copied to clipboard!')
      
      // Track copy action
      analytics.explanationCopied(mode)
      
      setTimeout(() => setCopied(false), 2000)
    } catch (error) {
      toast.error('Failed to copy to clipboard')
    }
  }

  const handleDownload = () => {
    const blob = new Blob([explanation], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `explanation-${mode}-${timestamp.toISOString().split('T')[0]}.txt`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
    toast.success('Explanation downloaded!')
    
    // Track download action
    analytics.explanationDownloaded(mode)
  }

  const handleRerun = async (newMode: ExplanationMode) => {
    if (newMode === mode && onRerunSameMode) {
      setIsRerunning(true)
      await onRerunSameMode()
      setIsRerunning(false)
    } else {
      setIsRerunning(true)
      await onRerun(newMode)
      setIsRerunning(false)
    }
  }

  const formatTimestamp = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date)
  }

  return (
    <motion.div
      className="card p-6 space-y-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex items-center space-x-3">
          <div className="text-2xl">{getModeIcon(mode)}</div>
          <div>
            <h3 className="text-lg font-semibold text-text capitalize">{mode} Mode</h3>
            <p className="text-sm text-text-muted">{getModeDescription(mode)}</p>
          </div>
        </div>
        
        <div className="text-right text-sm text-text-muted">
          <div>{formatTimestamp(timestamp)}</div>
          <div>{wordCount} words</div>
        </div>
      </div>

      {/* Explanation */}
      <div className="space-y-4">
        <h4 className="text-sm font-medium text-text uppercase tracking-wider">Explanation</h4>
        <div className="prose prose-sm max-w-none">
          <div className="whitespace-pre-wrap text-text leading-relaxed">
            {explanation}
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-border">
        {/* Left side - Copy and Download */}
        <div className="flex items-center space-x-3">
          <motion.button
            onClick={handleCopy}
            className="flex items-center space-x-2 px-3 py-2 rounded-lg border border-border hover:border-primary-300 hover:bg-primary-50 transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {copied ? <Check className="w-4 h-4 text-success-600" /> : <Copy className="w-4 h-4" />}
            <span className="text-sm">{copied ? 'Copied!' : 'Copy'}</span>
          </motion.button>

          <motion.button
            onClick={handleDownload}
            className="flex items-center space-x-2 px-3 py-2 rounded-lg border border-border hover:border-primary-300 hover:bg-primary-50 transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Download className="w-4 h-4" />
            <span className="text-sm">Download</span>
          </motion.button>
        </div>

        {/* Right side - Rerun options */}
        <div className="flex items-center space-x-3">
          {onRerunSameMode && (
            <motion.button
              onClick={() => handleRerun(mode)}
              disabled={isRerunning}
              className="flex items-center space-x-2 px-3 py-2 rounded-lg bg-primary-100 text-primary-700 hover:bg-primary-200 transition-colors disabled:opacity-50"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <RefreshCw className={`w-4 h-4 ${isRerunning ? 'animate-spin' : ''}`} />
              <span className="text-sm">Rerun</span>
            </motion.button>
          )}

          <motion.button
            onClick={() => handleRerun(mode === 'child' ? 'grandma' : 'child')}
            disabled={isRerunning}
            className="flex items-center space-x-2 px-3 py-2 rounded-lg bg-surface border border-border hover:bg-primary-50 transition-colors disabled:opacity-50"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <ExternalLink className="w-4 h-4" />
            <span className="text-sm">Try different mode</span>
          </motion.button>
        </div>
      </div>

      {/* Quick Mode Switcher */}
      <div className="pt-4 border-t border-border">
        <h4 className="text-sm font-medium text-text mb-3">Try other modes:</h4>
        <div className="flex flex-wrap gap-2">
          {(['child', 'grandma', 'ceo', 'technical'] as ExplanationMode[]).map((otherMode) => (
            <motion.button
              key={otherMode}
              onClick={() => handleRerun(otherMode)}
              disabled={isRerunning || otherMode === mode}
              className={`
                flex items-center space-x-2 px-3 py-2 rounded-lg text-sm transition-all
                ${otherMode === mode
                  ? 'bg-primary-100 text-primary-700 cursor-default'
                  : 'bg-surface hover:bg-primary-50 hover:text-primary-700 border border-border hover:border-primary-300'
                }
                ${isRerunning ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
              `}
              whileHover={!isRerunning && otherMode !== mode ? { scale: 1.05 } : {}}
              whileTap={!isRerunning && otherMode !== mode ? { scale: 0.95 } : {}}
            >
              <span>{getModeIcon(otherMode)}</span>
              <span className="capitalize">{otherMode}</span>
            </motion.button>
          ))}
        </div>
      </div>
    </motion.div>
  )
}

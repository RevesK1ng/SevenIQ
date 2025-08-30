'use client'

import { motion } from 'framer-motion'
import { Zap, Crown, AlertTriangle } from 'lucide-react'

interface UsageCounterProps {
  usageCount: number
  isPro: boolean
  remainingRuns: number
  dailyLimit: number
}

export default function UsageCounter({ 
  usageCount, 
  isPro, 
  remainingRuns, 
  dailyLimit 
}: UsageCounterProps) {
  if (isPro) {
    return (
      <motion.div
        className="flex items-center space-x-2 px-3 py-2 bg-gradient-to-r from-primary-500 to-primary-600 text-white rounded-full"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
      >
        <Crown className="w-4 h-4" />
        <span className="text-sm font-medium">Pro - Unlimited</span>
      </motion.div>
    )
  }

  // Calculate status and colors
  let status: 'safe' | 'warn' | 'danger' = 'safe'
  let bgColor = 'bg-success-100'
  let textColor = 'text-success-700'
  let borderColor = 'border-success-200'
  let icon = <Zap className="w-4 h-4" />

  if (remainingRuns <= 2) {
    status = 'danger'
    bgColor = 'bg-error-100'
    textColor = 'text-error-700'
    borderColor = 'border-error-200'
    icon = <AlertTriangle className="w-4 h-4" />
  } else if (remainingRuns <= 5) {
    status = 'warn'
    bgColor = 'bg-warning-100'
    textColor = 'text-warning-700'
    borderColor = 'border-warning-200'
    icon = <AlertTriangle className="w-4 h-4" />
  }

  return (
    <motion.div
      className={`flex items-center space-x-2 px-3 py-2 rounded-full border ${bgColor} ${textColor} ${borderColor}`}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
    >
      {icon}
      <span className="text-sm font-medium">
        {remainingRuns} of {dailyLimit} free runs remaining
      </span>
      
      {status === 'danger' && (
        <motion.div
          className="ml-2 px-2 py-1 bg-error-200 text-error-800 text-xs rounded-full font-medium"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
        >
          Upgrade soon!
        </motion.div>
      )}
    </motion.div>
  )
}

'use client'

import { motion } from 'framer-motion'
import { Crown, Zap, Star, ArrowRight } from 'lucide-react'
import Link from 'next/link'

interface GatingBannerProps {
  onUpgrade: () => void
}

export default function GatingBanner({ onUpgrade }: GatingBannerProps) {
  const benefits = [
    { icon: Zap, text: 'Unlimited explanations' },
    { icon: Star, text: 'Priority processing' },
    { icon: Crown, text: 'Advanced modes' }
  ]

  return (
    <motion.div
      className="card p-6 bg-gradient-to-r from-primary-50 to-accent-50 border-primary-200"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <div className="text-center space-y-4">
        <div className="flex justify-center">
          <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center">
            <Crown className="w-8 h-8 text-primary-600" />
          </div>
        </div>
        
        <div>
          <h3 className="text-xl font-bold text-text mb-2">
            You've reached your daily limit!
          </h3>
          <p className="text-text-muted mb-4">
            Upgrade to Pro for unlimited explanations and premium features.
          </p>
        </div>

        {/* Benefits */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          {benefits.map((benefit, index) => (
            <motion.div
              key={index}
              className="flex items-center space-x-2 text-sm"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <benefit.icon className="w-4 h-4 text-primary-600" />
              <span className="text-text">{benefit.text}</span>
            </motion.div>
          ))}
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <motion.button
            onClick={onUpgrade}
            className="flex items-center justify-center space-x-2 px-6 py-3 bg-primary-500 text-white rounded-lg font-medium hover:bg-primary-600 transition-colors"
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
          >
            <span>Upgrade to Pro</span>
            <ArrowRight className="w-4 h-4" />
          </motion.button>
          
          <Link href="/pricing">
            <motion.button
              className="flex items-center justify-center space-x-2 px-6 py-3 border border-primary-300 text-primary-700 rounded-lg font-medium hover:bg-primary-50 transition-colors"
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
            >
              <span>View Pricing</span>
            </motion.button>
          </Link>
        </div>

        <p className="text-xs text-text-muted">
          💡 Pro users get unlimited explanations, priority processing, and exclusive features
        </p>
      </div>
    </motion.div>
  )
}

'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { ExplanationMode, getModeDescription, getModeIcon } from '@/lib/model'
import { analytics } from '@/lib/analytics'

interface ModeToggleProps {
  selectedMode: ExplanationMode
  onModeChange: (mode: ExplanationMode) => void
  disabled?: boolean
}

const modes: ExplanationMode[] = ['child', 'grandma', 'ceo', 'technical']

export default function ModeToggle({ selectedMode, onModeChange, disabled = false }: ModeToggleProps) {
  const [localMode, setLocalMode] = useState<ExplanationMode>(selectedMode)

  // Persist mode in localStorage
  useEffect(() => {
    const savedMode = localStorage.getItem('seveniq-preferred-mode')
    if (savedMode && modes.includes(savedMode as ExplanationMode)) {
      setLocalMode(savedMode as ExplanationMode)
      onModeChange(savedMode as ExplanationMode)
    }
  }, [onModeChange])

  const handleModeChange = (mode: ExplanationMode) => {
    if (disabled) return
    
    setLocalMode(mode)
    onModeChange(mode)
    localStorage.setItem('seveniq-preferred-mode', mode)
    
    // Track mode change
    analytics.modeChanged(mode)
  }

  return (
    <div className="w-full">
      <label className="block text-sm font-medium text-text mb-3">
        Explanation Mode
      </label>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
        {modes.map((mode) => (
          <motion.button
            key={mode}
            onClick={() => handleModeChange(mode)}
            disabled={disabled}
            className={`
              relative p-4 rounded-xl border-2 transition-all duration-200
              ${localMode === mode 
                ? 'border-primary-500 bg-primary-50 text-primary-700 shadow-md' 
                : 'border-border bg-surface hover:border-primary-300 hover:bg-primary-25'
              }
              ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
            `}
            whileHover={!disabled ? { scale: 1.02, y: -2 } : {}}
            whileTap={!disabled ? { scale: 0.98 } : {}}
          >
            <div className="text-center space-y-2">
              <div className="text-4xl">{getModeIcon(mode)}</div>
              <div className="text-sm font-medium capitalize">{mode}</div>
              <div className="text-xs text-text-muted leading-tight">
                {getModeDescription(mode)}
              </div>
            </div>
            
            {localMode === mode && (
              <motion.div
                className="absolute -top-1 -right-1 w-3 h-3 bg-primary-500 rounded-full"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 500, damping: 30 }}
              />
            )}
          </motion.button>
        ))}
      </div>
    </div>
  )
}

'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { ExplanationMode } from '@/lib/model'
import ModeToggle from './mode-toggle'

interface ExplainerFormProps {
  onSubmit: (text: string, mode: ExplanationMode, isUrl?: boolean) => Promise<void>
  isLoading: boolean
  disabled?: boolean
  initialText?: string
  charLimit?: number
}

export default function ExplainerForm({ 
  onSubmit, 
  isLoading, 
  disabled = false,
  initialText = '',
  charLimit = 2000
}: ExplainerFormProps) {
  const [text, setText] = useState(initialText)
  const [mode, setMode] = useState<ExplanationMode>('child')
  const [isUrl, setIsUrl] = useState(false)
  const [charCount, setCharCount] = useState(initialText.length)

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newText = e.target.value
    setText(newText)
    setCharCount(newText.length)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!text.trim() || isLoading || disabled) return
    
    await onSubmit(text.trim(), mode, isUrl)
  }

  const isSubmitDisabled = !text.trim() || isLoading || disabled
  const isOverLimit = charCount > charLimit

  return (
    <motion.form 
      onSubmit={handleSubmit}
      className="space-y-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      {/* Input Type Toggle */}
      <div className="flex space-x-2 mb-4">
        <button
          type="button"
          onClick={() => setIsUrl(false)}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            !isUrl
              ? 'bg-primary-600 text-white'
              : 'bg-secondary-100 text-secondary-600 hover:bg-secondary-200'
          }`}
        >
          Text
        </button>
        <button
          type="button"
          onClick={() => setIsUrl(true)}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            isUrl
              ? 'bg-primary-600 text-white'
              : 'bg-secondary-100 text-secondary-600 hover:bg-secondary-200'
          }`}
        >
          URL
        </button>
      </div>

      {/* Text Input */}
      <div className="space-y-3">
        <label htmlFor="explain-text" className="block text-sm font-medium text-text">
          {isUrl ? 'Enter a URL to explain:' : 'What would you like me to explain?'}
        </label>
        <div className="relative">
          <textarea
            id="explain-text"
            value={text}
            onChange={handleTextChange}
            disabled={disabled}
            placeholder={isUrl ? "https://example.com/article..." : "Paste text, share a URL, or type your question here..."}
            className={`
              w-full h-32 px-4 py-3 rounded-xl border-2 resize-none
              transition-all duration-200 focus:outline-none focus:ring-2
              ${isOverLimit 
                ? 'border-error-300 focus:border-error-500 focus:ring-error-200' 
                : 'border-border focus:border-primary-500 focus:ring-primary-200'
              }
              ${disabled ? 'opacity-50 cursor-not-allowed bg-surface-100' : 'bg-surface'}
            `}
          />
          
          {/* Character Counter */}
          <div className="absolute bottom-3 right-3 text-xs">
            <span className={isOverLimit ? 'text-error-600' : 'text-text-muted'}>
              {charCount}/{charLimit}
            </span>
          </div>
        </div>
        
        {isOverLimit && (
          <motion.p 
            className="text-sm text-error-600"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            Text is too long. Please keep it under {charLimit} characters.
          </motion.p>
        )}
      </div>

      {/* Mode Toggle */}
      <ModeToggle
        selectedMode={mode}
        onModeChange={setMode}
        disabled={disabled}
      />

      {/* Submit Button */}
      <motion.button
        type="submit"
        disabled={isSubmitDisabled}
        className={`
          w-full py-4 px-6 rounded-xl font-medium text-lg
          transition-all duration-200 transform
          ${isSubmitDisabled
            ? 'opacity-50 cursor-not-allowed bg-surface-300 text-text-muted'
            : 'bg-primary-500 text-white hover:bg-primary-600 hover:shadow-lg hover:scale-[1.02] active:scale-[0.98]'
          }
        `}
        whileHover={!isSubmitDisabled ? { y: -2 } : {}}
        whileTap={!isSubmitDisabled ? { scale: 0.98 } : {}}
      >
        {isLoading ? (
          <div className="flex items-center justify-center space-x-2">
            <motion.div
              className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            />
            <span>Generating explanation...</span>
          </div>
        ) : (
          'Explain this'
        )}
      </motion.button>

      {/* Help Text */}
      <motion.p 
        className="text-sm text-text-muted text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        💡 Tip: Be specific! The more context you provide, the better your explanation will be.
      </motion.p>
    </motion.form>
  )
}

'use client'

import { motion } from 'framer-motion'

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg' | 'xl'
  color?: 'primary' | 'secondary' | 'white' | 'current'
  className?: string
}

export function LoadingSpinner({ 
  size = 'md', 
  color = 'primary',
  className = '' 
}: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8',
    xl: 'w-12 h-12'
  }

  const colorClasses = {
    primary: 'border-primary-200 border-t-primary-500',
    secondary: 'border-secondary-200 border-t-secondary-500',
    white: 'border-white/20 border-t-white',
    current: 'border-current/20 border-t-current'
  }

  return (
    <motion.div
      className={`${sizeClasses[size]} border-2 ${colorClasses[color]} rounded-full ${className}`}
      animate={{ rotate: 360 }}
      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
    />
  )
}

interface LoadingDotsProps {
  size?: 'sm' | 'md' | 'lg'
  color?: 'primary' | 'secondary' | 'white'
  className?: string
}

export function LoadingDots({ 
  size = 'md', 
  color = 'primary',
  className = '' 
}: LoadingDotsProps) {
  const sizeClasses = {
    sm: 'w-1.5 h-1.5',
    md: 'w-2 h-2',
    lg: 'w-3 h-3'
  }

  const colorClasses = {
    primary: 'bg-primary-500',
    secondary: 'bg-secondary-500',
    white: 'bg-white'
  }

  return (
    <div className={`flex items-center space-x-1 ${className}`}>
      {[0, 1, 2].map((index) => (
        <motion.div
          key={index}
          className={`${sizeClasses[size]} ${colorClasses[color]} rounded-full`}
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.5, 1, 0.5]
          }}
          transition={{
            duration: 1.4,
            repeat: Infinity,
            delay: index * 0.2
          }}
        />
      ))}
    </div>
  )
}

interface LoadingBarProps {
  progress?: number
  indeterminate?: boolean
  color?: 'primary' | 'secondary' | 'success' | 'warning' | 'error'
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

export function LoadingBar({ 
  progress = 0,
  indeterminate = false,
  color = 'primary',
  size = 'md',
  className = '' 
}: LoadingBarProps) {
  const sizeClasses = {
    sm: 'h-1',
    md: 'h-2',
    lg: 'h-3'
  }

  const colorClasses = {
    primary: 'bg-primary-500',
    secondary: 'bg-secondary-500',
    success: 'bg-success-500',
    warning: 'bg-warning-500',
    error: 'bg-error-500'
  }

  return (
    <div className={`w-full bg-surface-200 rounded-full overflow-hidden ${sizeClasses[size]} ${className}`}>
      {indeterminate ? (
        <motion.div
          className={`${colorClasses[color]} ${sizeClasses[size]} rounded-full`}
          animate={{
            x: ['-100%', '100%']
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      ) : (
        <motion.div
          className={`${colorClasses[color]} ${sizeClasses[size]} rounded-full`}
          initial={{ width: 0 }}
          animate={{ width: `${Math.min(progress, 100)}%` }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        />
      )}
    </div>
  )
}

interface LoadingSkeletonProps {
  type?: 'text' | 'avatar' | 'card' | 'button'
  lines?: number
  className?: string
}

export function LoadingSkeleton({ 
  type = 'text',
  lines = 1,
  className = '' 
}: LoadingSkeletonProps) {
  if (type === 'avatar') {
    return (
      <div className={`w-10 h-10 bg-surface-200 rounded-full animate-pulse ${className}`} />
    )
  }

  if (type === 'button') {
    return (
      <div className={`w-20 h-10 bg-surface-200 rounded-lg animate-pulse ${className}`} />
    )
  }

  if (type === 'card') {
    return (
      <div className={`p-4 bg-surface-50 border border-border rounded-lg ${className}`}>
        <div className="w-3/4 h-4 bg-surface-200 rounded animate-pulse mb-3" />
        <div className="w-1/2 h-3 bg-surface-200 rounded animate-pulse mb-2" />
        <div className="w-2/3 h-3 bg-surface-200 rounded animate-pulse" />
      </div>
    )
  }

  return (
    <div className={`space-y-2 ${className}`}>
      {Array.from({ length: lines }).map((_, index) => (
        <div
          key={index}
          className={`h-4 bg-surface-200 rounded animate-pulse ${
            index === lines - 1 ? 'w-3/4' : 'w-full'
          }`}
        />
      ))}
    </div>
  )
}

interface LoadingOverlayProps {
  isLoading: boolean
  children: React.ReactNode
  text?: string
  className?: string
}

export function LoadingOverlay({ 
  isLoading, 
  children, 
  text = 'Loading...',
  className = '' 
}: LoadingOverlayProps) {
  if (!isLoading) return <>{children}</>

  return (
    <div className={`relative ${className}`}>
      {children}
      <div className="absolute inset-0 bg-surface-50/80 backdrop-blur-sm flex items-center justify-center rounded-lg">
        <div className="text-center">
          <LoadingSpinner size="lg" className="mx-auto mb-3" />
          <p className="text-sm text-text-muted">{text}</p>
        </div>
      </div>
    </div>
  )
}

interface LoadingButtonProps {
  loading: boolean
  children: React.ReactNode
  loadingText?: string
  className?: string
  disabled?: boolean
  onClick?: () => void
}

export function LoadingButton({ 
  loading, 
  children, 
  loadingText = 'Loading...',
  className = '',
  disabled = false,
  onClick
}: LoadingButtonProps) {
  return (
    <button
      className={`btn-primary ${className}`}
      disabled={disabled || loading}
      onClick={onClick}
    >
      {loading ? (
        <div className="flex items-center">
          <LoadingSpinner size="sm" color="white" className="mr-2" />
          {loadingText}
        </div>
      ) : (
        children
      )}
    </button>
  )
}

'use client'

import { useState, useEffect } from 'react'
import { AlertTriangle, X, RefreshCw, AlertCircle, Info } from 'lucide-react'

interface ErrorBoundaryState {
  hasError: boolean
  error?: Error
  errorInfo?: any
}

interface ErrorDisplayProps {
  error: string | Error
  onRetry?: () => void
  onDismiss?: () => void
  variant?: 'error' | 'warning' | 'info'
  className?: string
}

export function ErrorDisplay({ 
  error, 
  onRetry, 
  onDismiss,
  variant = 'error',
  className = '' 
}: ErrorDisplayProps) {
  const [isVisible, setIsVisible] = useState(true)

  const handleDismiss = () => {
    setIsVisible(false)
    onDismiss?.()
  }

  if (!isVisible) return null

  const variantConfig = {
    error: {
      icon: AlertTriangle,
      bgColor: 'bg-error-50',
      borderColor: 'border-error-200',
      textColor: 'text-error-800',
      iconColor: 'text-error-500'
    },
    warning: {
      icon: AlertTriangle,
      bgColor: 'bg-warning-50',
      borderColor: 'border-warning-200',
      textColor: 'text-warning-800',
      iconColor: 'text-warning-500'
    },
    info: {
      icon: Info,
      bgColor: 'bg-primary-50',
      borderColor: 'border-primary-200',
      textColor: 'text-primary-800',
      iconColor: 'text-primary-500'
    }
  }

  const config = variantConfig[variant]
  const Icon = config.icon
  const errorMessage = error instanceof Error ? error.message : error

  return (
    <div className={`${config.bgColor} border ${config.borderColor} rounded-lg p-4 ${className}`}>
      <div className="flex items-start">
        <Icon className={`w-5 h-5 ${config.iconColor} mt-0.5 flex-shrink-0 mr-3`} />
        
        <div className="flex-1">
          <h3 className={`text-sm font-medium ${config.textColor} mb-1`}>
            {variant === 'error' ? 'Error' : variant === 'warning' ? 'Warning' : 'Information'}
          </h3>
          <p className={`text-sm ${config.textColor}`}>
            {errorMessage}
          </p>
          
          {onRetry && (
            <button
              onClick={onRetry}
              className="mt-2 text-sm font-medium text-primary-600 hover:text-primary-500 flex items-center"
            >
              <RefreshCw className="w-4 h-4 mr-1" />
              Try again
            </button>
          )}
        </div>
        
        {onDismiss && (
          <button
            onClick={handleDismiss}
            className={`ml-3 text-${variant === 'error' ? 'error' : variant === 'warning' ? 'warning' : 'primary'}-400 hover:text-${variant === 'error' ? 'error' : variant === 'warning' ? 'warning' : 'primary'}-500`}
            aria-label="Dismiss"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  )
}

interface ErrorFallbackProps {
  error: Error
  resetError: () => void
  className?: string
}

export function ErrorFallback({ error, resetError, className = '' }: ErrorFallbackProps) {
  return (
    <div className={`text-center p-8 ${className}`}>
      <div className="w-16 h-16 bg-error-100 rounded-full flex items-center justify-center mx-auto mb-4">
        <AlertTriangle className="w-8 h-8 text-error-600" />
      </div>
      
      <h2 className="text-xl font-semibold text-text mb-2">
        Something went wrong
      </h2>
      
      <p className="text-text-muted mb-6 max-w-md mx-auto">
        We encountered an unexpected error. Please try refreshing the page or contact support if the problem persists.
      </p>

      {process.env.NODE_ENV === 'development' && (
        <details className="text-left max-w-md mx-auto mb-6 p-4 bg-surface-100 rounded-lg">
          <summary className="cursor-pointer text-sm font-medium text-text mb-2">
            Error Details (Development)
          </summary>
          <pre className="text-xs text-text-muted overflow-auto">
            {error.toString()}
          </pre>
        </details>
      )}

      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <button
          onClick={resetError}
          className="btn-primary flex items-center justify-center"
        >
          <RefreshCw className="w-4 h-4 mr-2" />
          Try again
        </button>
        
        <button
          onClick={() => window.location.reload()}
          className="btn-secondary flex items-center justify-center"
        >
          Refresh page
        </button>
      </div>
    </div>
  )
}

interface NetworkErrorProps {
  onRetry: () => void
  className?: string
}

export function NetworkError({ onRetry, className = '' }: NetworkErrorProps) {
  return (
    <div className={`text-center p-6 ${className}`}>
      <div className="w-12 h-12 bg-error-100 rounded-full flex items-center justify-center mx-auto mb-3">
        <AlertCircle className="w-6 h-6 text-error-600" />
      </div>
      
      <h3 className="text-lg font-medium text-text mb-2">
        Network Error
      </h3>
      
      <p className="text-text-muted mb-4">
        Unable to connect to the server. Please check your internet connection and try again.
      </p>
      
      <button
        onClick={onRetry}
        className="btn-primary flex items-center justify-center mx-auto"
      >
        <RefreshCw className="w-4 h-4 mr-2" />
        Retry
      </button>
    </div>
  )
}

interface ValidationErrorProps {
  errors: Record<string, string[]>
  className?: string
}

export function ValidationError({ errors, className = '' }: ValidationErrorProps) {
  const errorEntries = Object.entries(errors)
  
  if (errorEntries.length === 0) return null

  return (
    <div className={`bg-error-50 border border-error-200 rounded-lg p-4 ${className}`}>
      <div className="flex items-start">
        <AlertTriangle className="w-5 h-5 text-error-500 mt-0.5 flex-shrink-0 mr-3" />
        
        <div className="flex-1">
          <h3 className="text-sm font-medium text-error-800 mb-2">
            Please fix the following errors:
          </h3>
          
          <ul className="text-sm text-error-700 space-y-1">
            {errorEntries.map(([field, fieldErrors]) => (
              <li key={field}>
                <span className="font-medium capitalize">{field}:</span>{' '}
                {fieldErrors.join(', ')}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}

interface ErrorLogger {
  logError: (error: Error, context?: Record<string, any>) => void
  logWarning: (message: string, context?: Record<string, any>) => void
  logInfo: (message: string, context?: Record<string, any>) => void
}

export const errorLogger: ErrorLogger = {
  logError: (error: Error, context?: Record<string, any>) => {
    console.error('Error logged:', error, context)
    
    // In production, this would send to an error tracking service
    // Example: Sentry.captureException(error, { extra: context })
    
    // For now, just log to console
    if (process.env.NODE_ENV === 'production') {
      // Send to error tracking service
      console.error('Production error logging would happen here')
    }
  },
  
  logWarning: (message: string, context?: Record<string, any>) => {
    console.warn('Warning logged:', message, context)
  },
  
  logInfo: (message: string, context?: Record<string, any>) => {
    console.info('Info logged:', message, context)
  }
}

export function useErrorHandler() {
  const [errors, setErrors] = useState<Error[]>([])

  const addError = (error: Error) => {
    setErrors(prev => [...prev, error])
    errorLogger.logError(error)
  }

  const removeError = (index: number) => {
    setErrors(prev => prev.filter((_, i) => i !== index))
  }

  const clearErrors = () => {
    setErrors([])
  }

  return {
    errors,
    addError,
    removeError,
    clearErrors
  }
}

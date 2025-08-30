'use client'

import { useEffect, useRef } from 'react'

// Skip to main content link for keyboard users
export function SkipToMainContent() {
  return (
    <a
      href="#main-content"
      className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-primary-500 focus:text-white focus:rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-300"
    >
      Skip to main content
    </a>
  )
}

// Focus trap for modals and dropdowns
export function useFocusTrap(enabled: boolean = true) {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!enabled || !containerRef.current) return

    const container = containerRef.current
    const focusableElements = container.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    )
    const firstElement = focusableElements[0] as HTMLElement
    const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Tab') {
        if (e.shiftKey) {
          if (document.activeElement === firstElement) {
            e.preventDefault()
            lastElement.focus()
          }
        } else {
          if (document.activeElement === lastElement) {
            e.preventDefault()
            firstElement.focus()
          }
        }
      }
    }

    container.addEventListener('keydown', handleKeyDown)
    return () => container.removeEventListener('keydown', handleKeyDown)
  }, [enabled])

  return containerRef
}

// Announce changes to screen readers
export function useAnnouncement() {
  const announceRef = useRef<HTMLDivElement>(null)

  const announce = (message: string, priority: 'polite' | 'assertive' = 'polite') => {
    if (announceRef.current) {
      announceRef.current.setAttribute('aria-live', priority)
      announceRef.current.textContent = message
      
      // Clear the message after a short delay
      setTimeout(() => {
        if (announceRef.current) {
          announceRef.current.textContent = ''
        }
      }, 1000)
    }
  }

  return { announce, announceRef }
}

// Live region for announcements
export function LiveRegion() {
  return (
    <div
      ref={useAnnouncement().announceRef}
      aria-live="polite"
      aria-atomic="true"
      className="sr-only"
    />
  )
}

// Keyboard navigation hook
export function useKeyboardNavigation() {
  const handleKeyDown = (e: React.KeyboardEvent, actions: {
    onEnter?: () => void
    onEscape?: () => void
    onArrowUp?: () => void
    onArrowDown?: () => void
    onArrowLeft?: () => void
    onArrowRight?: () => void
    onTab?: () => void
    onSpace?: () => void
  }) => {
    switch (e.key) {
      case 'Enter':
        e.preventDefault()
        actions.onEnter?.()
        break
      case 'Escape':
        e.preventDefault()
        actions.onEscape?.()
        break
      case 'ArrowUp':
        e.preventDefault()
        actions.onArrowUp?.()
        break
      case 'ArrowDown':
        e.preventDefault()
        actions.onArrowDown?.()
        break
      case 'ArrowLeft':
        e.preventDefault()
        actions.onArrowLeft?.()
        break
      case 'ArrowRight':
        e.preventDefault()
        actions.onArrowRight?.()
        break
      case 'Tab':
        actions.onTab?.()
        break
      case ' ':
        e.preventDefault()
        actions.onSpace?.()
        break
    }
  }

  return { handleKeyDown }
}

// Accessible button component
interface AccessibleButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode
  variant?: 'primary' | 'secondary' | 'accent' | 'error'
  size?: 'sm' | 'md' | 'lg'
  loading?: boolean
  icon?: React.ReactNode
  iconPosition?: 'left' | 'right'
}

export function AccessibleButton({
  children,
  variant = 'primary',
  size = 'md',
  loading = false,
  icon,
  iconPosition = 'left',
  className = '',
  disabled,
  ...props
}: AccessibleButtonProps) {
  const baseClasses = 'inline-flex items-center justify-center font-medium transition-all duration-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed'
  
  const variantClasses = {
    primary: 'bg-primary-500 hover:bg-primary-600 text-white focus:ring-primary-500',
    secondary: 'bg-surface-50 hover:bg-surface-100 text-text border border-border hover:border-border-300 focus:ring-secondary-500',
    accent: 'bg-accent-500 hover:bg-accent-600 text-white focus:ring-accent-500',
    error: 'bg-error-500 hover:bg-error-600 text-white focus:ring-error-500'
  }
  
  const sizeClasses = {
    sm: 'px-3 py-2 text-sm',
    md: 'px-4 py-2 text-sm',
    lg: 'px-6 py-3 text-base'
  }

  const isDisabled = disabled || loading

  return (
    <button
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
      disabled={isDisabled}
      aria-busy={loading}
      {...props}
    >
      {loading && (
        <svg className="animate-spin -ml-1 mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
        </svg>
      )}
      
      {!loading && icon && iconPosition === 'left' && (
        <span className="mr-2">{icon}</span>
      )}
      
      <span>{children}</span>
      
      {!loading && icon && iconPosition === 'right' && (
        <span className="ml-2">{icon}</span>
      )}
    </button>
  )
}

// Accessible form field wrapper
interface AccessibleFieldProps {
  id: string
  label: string
  required?: boolean
  error?: string
  helpText?: string
  children: React.ReactNode
  className?: string
}

export function AccessibleField({
  id,
  label,
  required = false,
  error,
  helpText,
  children,
  className = ''
}: AccessibleFieldProps) {
  return (
    <div className={className}>
      <label htmlFor={id} className="block text-sm font-medium text-text mb-2">
        {label}
        {required && <span className="text-error-500 ml-1">*</span>}
      </label>
      
      {children}
      
      {error && (
        <p className="mt-1 text-sm text-error-600" role="alert">
          {error}
        </p>
      )}
      
      {helpText && (
        <p className="mt-1 text-sm text-text-muted">
          {helpText}
        </p>
      )}
    </div>
  )
}

// Screen reader only text
export function SrOnly({ children }: { children: React.ReactNode }) {
  return <span className="sr-only">{children}</span>
}

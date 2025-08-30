'use client'

import { useEffect, useState } from 'react'
import { useMediaQuery } from './hooks/use-media-query'

interface MobileResponsiveProps {
  children: React.ReactNode
  mobileFallback?: React.ReactNode
  className?: string
}

export function MobileResponsive({ 
  children, 
  mobileFallback, 
  className = '' 
}: MobileResponsiveProps) {
  const isMobile = useMediaQuery('(max-width: 768px)')
  
  if (isMobile && mobileFallback) {
    return <div className={className}>{mobileFallback}</div>
  }
  
  return <div className={className}>{children}</div>
}

interface ResponsiveGridProps {
  children: React.ReactNode
  cols?: {
    sm?: number
    md?: number
    lg?: number
    xl?: number
  }
  gap?: string
  className?: string
}

export function ResponsiveGrid({ 
  children, 
  cols = { sm: 1, md: 2, lg: 3, xl: 4 },
  gap = 'gap-4',
  className = '' 
}: ResponsiveGridProps) {
  const gridCols = {
    sm: `grid-cols-${cols.sm || 1}`,
    md: `md:grid-cols-${cols.md || cols.sm || 1}`,
    lg: `lg:grid-cols-${cols.lg || cols.md || cols.sm || 1}`,
    xl: `xl:grid-cols-${cols.xl || cols.lg || cols.md || cols.sm || 1}`
  }

  return (
    <div className={`grid ${gridCols.sm} ${gridCols.md} ${gridCols.lg} ${gridCols.xl} ${gap} ${className}`}>
      {children}
    </div>
  )
}

interface ResponsiveTextProps {
  children: React.ReactNode
  sizes: {
    sm?: string
    md?: string
    lg?: string
    xl?: string
  }
  className?: string
}

export function ResponsiveText({ 
  children, 
  sizes, 
  className = '' 
}: ResponsiveTextProps) {
  const textSizes = {
    sm: sizes.sm || 'text-sm',
    md: `md:${sizes.md || sizes.sm || 'text-sm'}`,
    lg: `lg:${sizes.lg || sizes.md || sizes.sm || 'text-sm'}`,
    xl: `xl:${sizes.xl || sizes.lg || sizes.md || sizes.sm || 'text-sm'}`
  }

  return (
    <div className={`${textSizes.sm} ${textSizes.md} ${textSizes.lg} ${textSizes.xl} ${className}`}>
      {children}
    </div>
  )
}

interface ResponsiveSpacingProps {
  children: React.ReactNode
  spacing: {
    sm?: string
    md?: string
    lg?: string
    xl?: string
  }
  className?: string
}

export function ResponsiveSpacing({ 
  children, 
  spacing, 
  className = '' 
}: ResponsiveSpacingProps) {
  const spacingClasses = {
    sm: spacing.sm || 'p-4',
    md: `md:${spacing.md || spacing.sm || 'p-4'}`,
    lg: `lg:${spacing.lg || spacing.md || spacing.sm || 'p-4'}`,
    xl: `xl:${spacing.xl || spacing.lg || spacing.md || spacing.sm || 'p-4'}`
  }

  return (
    <div className={`${spacingClasses.sm} ${spacingClasses.md} ${spacingClasses.lg} ${spacingClasses.xl} ${className}`}>
      {children}
    </div>
  )
}

interface TouchTargetProps {
  children: React.ReactNode
  minSize?: 'sm' | 'md' | 'lg'
  className?: string
}

export function TouchTarget({ 
  children, 
  minSize = 'md',
  className = '' 
}: TouchTargetProps) {
  const sizeClasses = {
    sm: 'min-w-[32px] min-h-[32px]',
    md: 'min-w-[44px] min-h-[44px]',
    lg: 'min-w-[48px] min-h-[48px]'
  }

  return (
    <div className={`${sizeClasses[minSize]} flex items-center justify-center ${className}`}>
      {children}
    </div>
  )
}

interface SwipeableProps {
  children: React.ReactNode
  onSwipeLeft?: () => void
  onSwipeRight?: () => void
  onSwipeUp?: () => void
  onSwipeDown?: () => void
  threshold?: number
  className?: string
}

export function Swipeable({ 
  children, 
  onSwipeLeft, 
  onSwipeRight, 
  onSwipeUp, 
  onSwipeDown,
  threshold = 50,
  className = '' 
}: SwipeableProps) {
  const [touchStart, setTouchStart] = useState<{ x: number; y: number } | null>(null)
  const [touchEnd, setTouchEnd] = useState<{ x: number; y: number } | null>(null)

  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null)
    setTouchStart({
      x: e.targetTouches[0].clientX,
      y: e.targetTouches[0].clientY,
    })
  }

  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd({
      x: e.targetTouches[0].clientX,
      y: e.targetTouches[0].clientY,
    })
  }

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return

    const distanceX = touchStart.x - touchEnd.x
    const distanceY = touchStart.y - touchEnd.y
    const isHorizontalSwipe = Math.abs(distanceX) > Math.abs(distanceY)

    if (isHorizontalSwipe) {
      if (Math.abs(distanceX) > threshold) {
        if (distanceX > 0 && onSwipeLeft) {
          onSwipeLeft()
        } else if (distanceX < 0 && onSwipeRight) {
          onSwipeRight()
        }
      }
    } else {
      if (Math.abs(distanceY) > threshold) {
        if (distanceY > 0 && onSwipeUp) {
          onSwipeUp()
        } else if (distanceY < 0 && onSwipeDown) {
          onSwipeDown()
        }
      }
    }
  }

  return (
    <div
      className={`touch-pan-y ${className}`}
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
    >
      {children}
    </div>
  )
}

interface MobileMenuProps {
  isOpen: boolean
  onClose: () => void
  children: React.ReactNode
  className?: string
}

export function MobileMenu({ 
  isOpen, 
  onClose, 
  children, 
  className = '' 
}: MobileMenuProps) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }

    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])

  if (!isOpen) return null

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 z-40"
        onClick={onClose}
        aria-hidden="true"
      />
      
      {/* Menu */}
      <div className={`fixed inset-y-0 right-0 w-80 bg-white dark:bg-gray-900 shadow-xl z-50 transform transition-transform duration-300 ease-in-out ${className}`}>
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-semibold">Menu</h2>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
            aria-label="Close menu"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <div className="p-4">
          {children}
        </div>
      </div>
    </>
  )
}

interface MobileDrawerProps {
  isOpen: boolean
  onClose: () => void
  children: React.ReactNode
  position?: 'left' | 'right' | 'top' | 'bottom'
  className?: string
}

export function MobileDrawer({ 
  isOpen, 
  onClose, 
  children, 
  position = 'bottom',
  className = '' 
}: MobileDrawerProps) {
  const positionClasses = {
    left: 'inset-y-0 left-0 w-80',
    right: 'inset-y-0 right-0 w-80',
    top: 'inset-x-0 top-0 h-80',
    bottom: 'inset-x-0 bottom-0 h-80'
  }

  const transformClasses = {
    left: isOpen ? 'translate-x-0' : '-translate-x-full',
    right: isOpen ? 'translate-x-0' : 'translate-x-full',
    top: isOpen ? 'translate-y-0' : '-translate-y-full',
    bottom: isOpen ? 'translate-y-0' : 'translate-y-full'
  }

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }

    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 bg-black/50 z-40 transition-opacity duration-300 ${
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={onClose}
        aria-hidden="true"
      />
      
      {/* Drawer */}
      <div 
        className={`fixed ${positionClasses[position]} bg-white dark:bg-gray-900 shadow-xl z-50 transform transition-transform duration-300 ease-in-out ${transformClasses[position]} ${className}`}
      >
        {children}
      </div>
    </>
  )
}

interface ResponsiveImageProps {
  src: string
  alt: string
  sizes: {
    sm?: string
    md?: string
    lg?: string
    xl?: string
  }
  className?: string
}

export function ResponsiveImage({ 
  src, 
  alt, 
  sizes, 
  className = '' 
}: ResponsiveImageProps) {
  const imageSizes = {
    sm: sizes.sm || 'w-full h-32',
    md: `md:${sizes.md || sizes.sm || 'w-full h-32'}`,
    lg: `lg:${sizes.lg || sizes.md || sizes.sm || 'w-full h-32'}`,
    xl: `xl:${sizes.xl || sizes.lg || sizes.md || sizes.sm || 'w-full h-32'}`
  }

  return (
    <img
      src={src}
      alt={alt}
      className={`${imageSizes.sm} ${imageSizes.md} ${imageSizes.lg} ${imageSizes.xl} object-cover ${className}`}
    />
  )
}

interface MobileOptimizedButtonProps {
  children: React.ReactNode
  onClick?: () => void
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  disabled?: boolean
  className?: string
}

export function MobileOptimizedButton({ 
  children, 
  onClick, 
  variant = 'primary',
  size = 'md',
  disabled = false,
  className = '' 
}: MobileOptimizedButtonProps) {
  const baseClasses = 'inline-flex items-center justify-center font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed'
  
  const variantClasses = {
    primary: 'bg-primary-600 text-white hover:bg-primary-700 focus:ring-primary-500',
    secondary: 'bg-secondary-600 text-white hover:bg-secondary-700 focus:ring-secondary-500',
    outline: 'border border-gray-300 text-gray-700 hover:bg-gray-50 focus:ring-gray-500',
    ghost: 'text-gray-700 hover:bg-gray-100 focus:ring-gray-500'
  }

  const sizeClasses = {
    sm: 'px-3 py-2 text-sm min-h-[44px]',
    md: 'px-4 py-2 text-sm min-h-[48px]',
    lg: 'px-6 py-3 text-base min-h-[52px]'
  }

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
    >
      {children}
    </button>
  )
}

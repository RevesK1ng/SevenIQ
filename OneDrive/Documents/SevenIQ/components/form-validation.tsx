'use client'

import { useState, useEffect } from 'react'
import { AlertCircle, CheckCircle } from 'lucide-react'

export interface ValidationRule {
  required?: boolean
  minLength?: number
  maxLength?: number
  pattern?: RegExp
  custom?: (value: string) => string | null
}

export interface ValidationResult {
  isValid: boolean
  errors: string[]
}

export function useFormValidation<T extends Record<string, any>>(
  initialValues: T,
  validationRules: Record<keyof T, ValidationRule>
) {
  const [values, setValues] = useState<T>(initialValues)
  const [errors, setErrors] = useState<Record<keyof T, string[]>>({} as Record<keyof T, string[]>)
  const [touched, setTouched] = useState<Record<keyof T, boolean>>({} as Record<keyof T, boolean>)

  const validateField = (field: keyof T, value: any): string[] => {
    const rules = validationRules[field]
    const fieldErrors: string[] = []

    if (rules.required && (!value || value.trim() === '')) {
      fieldErrors.push('This field is required')
    }

    if (value && rules.minLength && value.length < rules.minLength) {
      fieldErrors.push(`Must be at least ${rules.minLength} characters`)
    }

    if (value && rules.maxLength && value.length > rules.maxLength) {
      fieldErrors.push(`Must be no more than ${rules.maxLength} characters`)
    }

    if (value && rules.pattern && !rules.pattern.test(value)) {
      fieldErrors.push('Invalid format')
    }

    if (value && rules.custom) {
      const customError = rules.custom(value)
      if (customError) {
        fieldErrors.push(customError)
      }
    }

    return fieldErrors
  }

  const validateForm = (): boolean => {
    const newErrors: Record<keyof T, string[]> = {} as Record<keyof T, string[]>
    let isValid = true

    Object.keys(validationRules).forEach((field) => {
      const fieldKey = field as keyof T
      const fieldErrors = validateField(fieldKey, values[fieldKey])
      newErrors[fieldKey] = fieldErrors
      
      if (fieldErrors.length > 0) {
        isValid = false
      }
    })

    setErrors(newErrors)
    return isValid
  }

  const handleChange = (field: keyof T, value: any) => {
    setValues(prev => ({ ...prev, [field]: value }))
    
    // Clear errors when user starts typing
    if (errors[field] && errors[field].length > 0) {
      setErrors(prev => ({ ...prev, [field]: [] }))
    }
  }

  const handleBlur = (field: keyof T) => {
    setTouched(prev => ({ ...prev, [field]: true }))
    
    // Validate field on blur
    const fieldErrors = validateField(field, values[field])
    setErrors(prev => ({ ...prev, [field]: fieldErrors }))
  }

  const resetForm = () => {
    setValues(initialValues)
    setErrors({} as Record<keyof T, string[]>)
    setTouched({} as Record<keyof T, boolean>)
  }

  return {
    values,
    errors,
    touched,
    handleChange,
    handleBlur,
    validateForm,
    resetForm,
    setValues
  }
}

interface ValidationMessageProps {
  errors: string[]
  touched: boolean
  className?: string
}

export function ValidationMessage({ errors, touched, className = '' }: ValidationMessageProps) {
  if (!touched || errors.length === 0) return null

  return (
    <div className={`flex items-start space-x-2 text-sm ${className}`}>
      <AlertCircle className="w-4 h-4 text-error-500 mt-0.5 flex-shrink-0" />
      <div className="text-error-600">
        {errors.map((error, index) => (
          <div key={index}>{error}</div>
        ))}
      </div>
    </div>
  )
}

interface ValidationSuccessProps {
  message: string
  className?: string
}

export function ValidationSuccess({ message, className = '' }: ValidationSuccessProps) {
  return (
    <div className={`flex items-center space-x-2 text-sm text-success-600 ${className}`}>
      <CheckCircle className="w-4 h-4" />
      <span>{message}</span>
    </div>
  )
}

// Common validation rules
export const commonValidationRules = {
  email: {
    required: true,
    pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    custom: (value: string) => {
      if (!value.includes('@')) return 'Email must contain @ symbol'
      if (!value.includes('.')) return 'Email must contain a domain'
      return null
    }
  },
  password: {
    required: true,
    minLength: 6,
    custom: (value: string) => {
      if (value.length < 6) return 'Password must be at least 6 characters'
      return null
    }
  },
  required: {
    required: true
  },
  url: {
    pattern: /^https?:\/\/.+/,
    custom: (value: string) => {
      try {
        new URL(value)
        return null
      } catch {
        return 'Please enter a valid URL'
      }
    }
  }
}

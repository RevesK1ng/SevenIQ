import { NextRequest, NextResponse } from 'next/server'
import { errorLogger } from '../components/error-handling'

export interface APIError extends Error {
  statusCode?: number
  code?: string
  details?: any
  isOperational?: boolean
}

export class AppError extends Error implements APIError {
  public readonly statusCode: number
  public readonly code: string
  public readonly details: any
  public readonly isOperational: boolean

  constructor(
    message: string,
    statusCode: number = 500,
    code: string = 'INTERNAL_ERROR',
    details: any = null,
    isOperational: boolean = true
  ) {
    super(message)
    this.statusCode = statusCode
    this.code = code
    this.details = details
    this.isOperational = isOperational

    Error.captureStackTrace(this, this.constructor)
  }
}

export class ValidationError extends AppError {
  constructor(message: string, details: any = null) {
    super(message, 400, 'VALIDATION_ERROR', details, true)
  }
}

export class AuthenticationError extends AppError {
  constructor(message: string = 'Authentication required') {
    super(message, 401, 'AUTHENTICATION_ERROR', null, true)
  }
}

export class AuthorizationError extends AppError {
  constructor(message: string = 'Insufficient permissions') {
    super(message, 403, 'AUTHORIZATION_ERROR', null, true)
  }
}

export class NotFoundError extends AppError {
  constructor(message: string = 'Resource not found') {
    super(message, 404, 'NOT_FOUND_ERROR', null, true)
  }
}

export class RateLimitError extends AppError {
  constructor(message: string = 'Rate limit exceeded') {
    super(message, 429, 'RATE_LIMIT_ERROR', null, true)
  }
}

export class ConflictError extends AppError {
  constructor(message: string = 'Resource conflict') {
    super(message, 409, 'CONFLICT_ERROR', null, true)
  }
}

export class ServiceUnavailableError extends AppError {
  constructor(message: string = 'Service temporarily unavailable') {
    super(message, 503, 'SERVICE_UNAVAILABLE_ERROR', null, true)
  }
}

export function createErrorResponse(error: APIError | Error): NextResponse {
  let statusCode = 500
  let code = 'INTERNAL_ERROR'
  let message = 'An unexpected error occurred'
  let details = null

  if (error instanceof AppError) {
    statusCode = error.statusCode
    code = error.code
    message = error.message
    details = error.details
  } else if (error instanceof Error) {
    message = error.message
  }

  // Log the error
  errorLogger.logError(error as Error, {
    statusCode,
    code,
    details,
    url: typeof window !== 'undefined' ? window.location.href : 'server-side'
  })

  const errorResponse = {
    success: false,
    error: {
      code,
      message,
      ...(details && { details }),
      ...(process.env.NODE_ENV === 'development' && { stack: error.stack })
    },
    timestamp: new Date().toISOString(),
    requestId: generateRequestId()
  }

  return NextResponse.json(errorResponse, { status: statusCode })
}

export function createSuccessResponse<T>(data: T, statusCode: number = 200): NextResponse {
  const successResponse = {
    success: true,
    data,
    timestamp: new Date().toISOString(),
    requestId: generateRequestId()
  }

  return NextResponse.json(successResponse, { status: statusCode })
}

export function generateRequestId(): string {
  return `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
}

export function withErrorHandling<T extends any[], R>(
  handler: (...args: T) => Promise<R>
) {
  return async (...args: T): Promise<NextResponse> => {
    try {
      const result = await handler(...args)
      
      if (result instanceof NextResponse) {
        return result
      }
      
      return createSuccessResponse(result)
    } catch (error) {
      return createErrorResponse(error as Error)
    }
  }
}

export async function validateRequest(
  request: NextRequest,
  requiredFields: string[] = [],
  optionalFields: string[] = []
): Promise<{ isValid: boolean; errors: string[]; data: any }> {
  const errors: string[] = []
  let data: any = {}

  try {
    // Try to parse JSON body
    if (request.method !== 'GET') {
      const contentType = request.headers.get('content-type')
      if (contentType?.includes('application/json')) {
        data = request.json ? await request.json() : {}
      } else if (contentType?.includes('application/x-www-form-urlencoded')) {
        const formData = await request.formData()
        formData.forEach((value, key) => {
          data[key] = value
        })
      }
    }

    // Validate required fields
    for (const field of requiredFields) {
      if (!data[field] || (typeof data[field] === 'string' && data[field].trim() === '')) {
        errors.push(`Missing required field: ${field}`)
      }
    }

    // Validate field types and formats
    for (const [field, value] of Object.entries(data)) {
      if (value !== null && value !== undefined) {
        // Email validation
        if (field === 'email' && typeof value === 'string') {
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
          if (!emailRegex.test(value)) {
            errors.push(`Invalid email format: ${field}`)
          }
        }

        // URL validation
        if (field === 'url' && typeof value === 'string') {
          try {
            new URL(value)
          } catch {
            errors.push(`Invalid URL format: ${field}`)
          }
        }

        // Length validation
        if (typeof value === 'string') {
          if (field === 'password' && value.length < 8) {
            errors.push(`Password must be at least 8 characters long`)
          }
          if (value.length > 1000) {
            errors.push(`Field ${field} is too long (max 1000 characters)`)
          }
        }
      }
    }

    return {
      isValid: errors.length === 0,
      errors,
      data
    }
  } catch (error) {
    errors.push('Invalid request format')
    return {
      isValid: false,
      errors,
      data: {}
    }
  }
}

export function rateLimitMiddleware(
  request: NextRequest,
  limit: number = 100,
  windowMs: number = 15 * 60 * 1000 // 15 minutes
): { isAllowed: boolean; remaining: number; resetTime: number } {
  const ip = request.ip || request.headers.get('x-forwarded-for') || 'unknown'
  const key = `rate_limit:${ip}`
  
  // This is a simplified rate limiting implementation
  // In production, you'd want to use Redis or a similar store
  const now = Date.now()
  const windowStart = now - windowMs
  
  // For now, we'll use a simple in-memory approach
  // In production, implement proper rate limiting with Redis
  return {
    isAllowed: true,
    remaining: limit,
    resetTime: now + windowMs
  }
}

export function sanitizeInput(input: string): string {
  return input
    .trim()
    .replace(/[<>]/g, '') // Remove potential HTML tags
    .replace(/javascript:/gi, '') // Remove javascript: protocol
    .substring(0, 1000) // Limit length
}

export function validateAndSanitizeInput(
  input: any,
  fieldName: string,
  options: {
    required?: boolean
    minLength?: number
    maxLength?: number
    pattern?: RegExp
    sanitize?: boolean
  } = {}
): { isValid: boolean; value: any; error?: string } {
  const {
    required = false,
    minLength,
    maxLength,
    pattern,
    sanitize = true
  } = options

  // Check if required
  if (required && (!input || (typeof input === 'string' && input.trim() === ''))) {
    return {
      isValid: false,
      value: input,
      error: `${fieldName} is required`
    }
  }

  // If not required and empty, return valid
  if (!input || (typeof input === 'string' && input.trim() === '')) {
    return { isValid: true, value: input }
  }

  let value = input

  // Sanitize if requested
  if (sanitize && typeof value === 'string') {
    value = sanitizeInput(value)
  }

  // Check length constraints
  if (typeof value === 'string') {
    if (minLength && value.length < minLength) {
      return {
        isValid: false,
        value,
        error: `${fieldName} must be at least ${minLength} characters long`
      }
    }

    if (maxLength && value.length > maxLength) {
      return {
        isValid: false,
        value,
        error: `${fieldName} must be no more than ${maxLength} characters long`
      }
    }
  }

  // Check pattern
  if (pattern && typeof value === 'string' && !pattern.test(value)) {
    return {
      isValid: false,
      value,
      error: `${fieldName} format is invalid`
    }
  }

  return { isValid: true, value }
}

export function createValidationErrorResponse(errors: string[]): NextResponse {
  const error = new ValidationError('Validation failed', errors)
  return createErrorResponse(error)
}

export function createNotFoundErrorResponse(resource: string): NextResponse {
  const error = new NotFoundError(`${resource} not found`)
  return createErrorResponse(error)
}

export function createAuthenticationErrorResponse(): NextResponse {
  const error = new AuthenticationError()
  return createErrorResponse(error)
}

export function createAuthorizationErrorResponse(): NextResponse {
  const error = new AuthorizationError()
  return createErrorResponse(error)
}

export function createRateLimitErrorResponse(): NextResponse {
  const error = new RateLimitError()
  return createErrorResponse(error)
}

export function createConflictErrorResponse(message?: string): NextResponse {
  const error = new ConflictError(message)
  return createErrorResponse(error)
}

export function createServiceUnavailableErrorResponse(): NextResponse {
  const error = new ServiceUnavailableError()
  return createErrorResponse(error)
}

// Middleware for API routes
export function apiErrorHandler(
  request: NextRequest,
  handler: (request: NextRequest) => Promise<NextResponse>
): Promise<NextResponse> {
  return withErrorHandling(handler)(request)
}

// Utility function to check if error is operational
export function isOperationalError(error: Error): boolean {
  if (error instanceof AppError) {
    return error.isOperational
  }
  return false
}

// Utility function to handle async operations with proper error handling
export async function safeAsync<T>(
  operation: () => Promise<T>,
  fallback?: T
): Promise<{ success: boolean; data?: T; error?: Error }> {
  try {
    const data = await operation()
    return { success: true, data }
  } catch (error) {
    const appError = error instanceof AppError ? error : new AppError(
      error instanceof Error ? error.message : 'Unknown error occurred'
    )
    
    errorLogger.logError(appError)
    
    if (fallback !== undefined) {
      return { success: true, data: fallback }
    }
    
    return { success: false, error: appError }
  }
}

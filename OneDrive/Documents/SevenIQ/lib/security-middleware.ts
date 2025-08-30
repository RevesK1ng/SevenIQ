import { NextRequest, NextResponse } from 'next/server'
import { errorLogger } from '../components/error-handling'

export interface SecurityConfig {
  enableCSP: boolean
  enableHSTS: boolean
  enableXSSProtection: boolean
  enableContentTypeSniffing: boolean
  enableFrameOptions: boolean
  enableReferrerPolicy: boolean
  enablePermissionsPolicy: boolean
  cspDirectives: Record<string, string[]>
  hstsMaxAge: number
  frameOptions: 'DENY' | 'SAMEORIGIN'
  referrerPolicy: string
  permissionsPolicy: Record<string, string[]>
  rateLimit: {
    enabled: boolean
    maxRequests: number
    windowMs: number
  }
  cors: {
    enabled: boolean
    allowedOrigins: string[]
    allowedMethods: string[]
    allowedHeaders: string[]
    allowCredentials: boolean
  }
}

export class SecurityMiddleware {
  private config: SecurityConfig
  private rateLimitStore: Map<string, { count: number; resetTime: number }> = new Map()

  constructor(config: Partial<SecurityConfig> = {}) {
    this.config = {
      enableCSP: true,
      enableHSTS: true,
      enableXSSProtection: true,
      enableContentTypeSniffing: true,
      enableFrameOptions: true,
      enableReferrerPolicy: true,
      enablePermissionsPolicy: true,
      cspDirectives: {
        'default-src': ["'self'"],
        'script-src': ["'self'", "'unsafe-inline'", "'unsafe-eval'"],
        'style-src': ["'self'", "'unsafe-inline'"],
        'img-src': ["'self'", 'data:', 'https:'],
        'font-src': ["'self'", 'https:'],
        'connect-src': ["'self'", 'https:'],
        'frame-src': ["'none'"],
        'object-src': ["'none'"],
        'base-uri': ["'self'"],
        'form-action': ["'self'"]
      },
      hstsMaxAge: 31536000, // 1 year
      frameOptions: 'DENY',
      referrerPolicy: 'strict-origin-when-cross-origin',
      permissionsPolicy: {
        'camera': ['none'],
        'microphone': ['none'],
        'geolocation': ['none'],
        'payment': ['none'],
        'usb': ['none'],
        'magnetometer': ['none'],
        'gyroscope': ['none'],
        'accelerometer': ['none']
      },
      rateLimit: {
        enabled: true,
        maxRequests: 100,
        windowMs: 15 * 60 * 1000 // 15 minutes
      },
      cors: {
        enabled: false,
        allowedOrigins: [],
        allowedMethods: ['GET', 'POST'],
        allowedHeaders: ['Content-Type', 'Authorization'],
        allowCredentials: false
      },
      ...config
    }
  }

  async handle(request: NextRequest): Promise<NextResponse | null> {
    try {
      // Rate limiting
      if (this.config.rateLimit.enabled) {
        const rateLimitResult = this.checkRateLimit(request)
        if (!rateLimitResult.allowed) {
          return this.createRateLimitResponse(rateLimitResult)
        }
      }

      // CORS check
      if (this.config.cors.enabled) {
        const corsResult = this.checkCORS(request)
        if (!corsResult.allowed) {
          return this.createCORSResponse(corsResult)
        }
      }

      // Security headers will be added in the response
      return null
    } catch (error) {
      errorLogger.logError(error as Error, { context: 'SecurityMiddleware' })
      return null
    }
  }

  addSecurityHeaders(response: NextResponse): NextResponse {
    // Content Security Policy
    if (this.config.enableCSP) {
      const cspHeader = this.buildCSPHeader()
      response.headers.set('Content-Security-Policy', cspHeader)
    }

    // HTTP Strict Transport Security
    if (this.config.enableHSTS) {
      response.headers.set(
        'Strict-Transport-Security',
        `max-age=${this.config.hstsMaxAge}; includeSubDomains; preload`
      )
    }

    // X-XSS-Protection
    if (this.config.enableXSSProtection) {
      response.headers.set('X-XSS-Protection', '1; mode=block')
    }

    // X-Content-Type-Options
    if (this.config.enableContentTypeSniffing) {
      response.headers.set('X-Content-Type-Options', 'nosniff')
    }

    // X-Frame-Options
    if (this.config.enableFrameOptions) {
      response.headers.set('X-Frame-Options', this.config.frameOptions)
    }

    // Referrer-Policy
    if (this.config.enableReferrerPolicy) {
      response.headers.set('Referrer-Policy', this.config.referrerPolicy)
    }

    // Permissions-Policy
    if (this.config.enablePermissionsPolicy) {
      const permissionsHeader = this.buildPermissionsPolicyHeader()
      response.headers.set('Permissions-Policy', permissionsHeader)
    }

    // Additional security headers
    response.headers.set('X-DNS-Prefetch-Control', 'off')
    response.headers.set('X-Download-Options', 'noopen')
    response.headers.set('X-Permitted-Cross-Domain-Policies', 'none')

    return response
  }

  private buildCSPHeader(): string {
    const directives = Object.entries(this.config.cspDirectives)
      .map(([directive, sources]) => `${directive} ${sources.join(' ')}`)
      .join('; ')

    return directives
  }

  private buildPermissionsPolicyHeader(): string {
    const policies = Object.entries(this.config.permissionsPolicy)
      .map(([feature, values]) => `${feature}=${values.join(', ')}`)
      .join(', ')

    return policies
  }

  private checkRateLimit(request: NextRequest): { allowed: boolean; remaining: number; resetTime: number } {
    const ip = this.getClientIP(request)
    const key = `rate_limit:${ip}`
    const now = Date.now()

    const current = this.rateLimitStore.get(key)
    if (!current || now > current.resetTime) {
      this.rateLimitStore.set(key, {
        count: 1,
        resetTime: now + this.config.rateLimit.windowMs
      })
      return {
        allowed: true,
        remaining: this.config.rateLimit.maxRequests - 1,
        resetTime: now + this.config.rateLimit.windowMs
      }
    }

    if (current.count >= this.config.rateLimit.maxRequests) {
      return {
        allowed: false,
        remaining: 0,
        resetTime: current.resetTime
      }
    }

    current.count++
    this.rateLimitStore.set(key, current)

    return {
      allowed: true,
      remaining: this.config.rateLimit.maxRequests - current.count,
      resetTime: current.resetTime
    }
  }

  private createRateLimitResponse(rateLimitResult: { allowed: boolean; remaining: number; resetTime: number }): NextResponse {
    const response = NextResponse.json(
      {
        error: 'Rate limit exceeded',
        message: 'Too many requests from this IP',
        retryAfter: Math.ceil((rateLimitResult.resetTime - Date.now()) / 1000)
      },
      { status: 429 }
    )

    response.headers.set('Retry-After', Math.ceil((rateLimitResult.resetTime - Date.now()) / 1000).toString())
    response.headers.set('X-RateLimit-Limit', this.config.rateLimit.maxRequests.toString())
    response.headers.set('X-RateLimit-Remaining', rateLimitResult.remaining.toString())
    response.headers.set('X-RateLimit-Reset', rateLimitResult.resetTime.toString())

    return response
  }

  private checkCORS(request: NextRequest): { allowed: boolean; reason?: string } {
    const origin = request.headers.get('origin')
    const method = request.method

    if (!origin) {
      return { allowed: true } // No origin header, allow
    }

    // Check if origin is allowed
    if (!this.config.cors.allowedOrigins.includes('*') && 
        !this.config.cors.allowedOrigins.includes(origin)) {
      return { allowed: false, reason: 'Origin not allowed' }
    }

    // Check if method is allowed
    if (!this.config.cors.allowedMethods.includes(method)) {
      return { allowed: false, reason: 'Method not allowed' }
    }

    return { allowed: true }
  }

  private createCORSResponse(corsResult: { allowed: boolean; reason?: string }): NextResponse {
    return NextResponse.json(
      {
        error: 'CORS error',
        message: corsResult.reason || 'Cross-origin request not allowed'
      },
      { status: 403 }
    )
  }

  private getClientIP(request: NextRequest): string {
    return request.ip || 
           request.headers.get('x-forwarded-for')?.split(',')[0] || 
           request.headers.get('x-real-ip') || 
           'unknown'
  }

  // Input validation and sanitization
  validateInput(input: string, type: 'email' | 'url' | 'text' | 'number'): { isValid: boolean; sanitized?: string; error?: string } {
    if (!input || typeof input !== 'string') {
      return { isValid: false, error: 'Input is required and must be a string' }
    }

    const sanitized = this.sanitizeInput(input)

    switch (type) {
      case 'email':
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if (!emailRegex.test(sanitized)) {
          return { isValid: false, error: 'Invalid email format' }
        }
        break

      case 'url':
        try {
          new URL(sanitized)
        } catch {
          return { isValid: false, error: 'Invalid URL format' }
        }
        break

      case 'number':
        if (isNaN(Number(sanitized))) {
          return { isValid: false, error: 'Invalid number format' }
        }
        break

      case 'text':
        if (sanitized.length > 1000) {
          return { isValid: false, error: 'Text too long (max 1000 characters)' }
        }
        break
    }

    return { isValid: true, sanitized }
  }

  private sanitizeInput(input: string): string {
    return input
      .trim()
      .replace(/[<>]/g, '') // Remove potential HTML tags
      .replace(/javascript:/gi, '') // Remove javascript: protocol
      .replace(/data:/gi, '') // Remove data: protocol
      .replace(/vbscript:/gi, '') // Remove vbscript: protocol
      .substring(0, 1000) // Limit length
  }

  // SQL Injection prevention
  containsSQLInjection(input: string): boolean {
    const sqlPatterns = [
      /(\b(select|insert|update|delete|drop|create|alter|exec|execute|union|script|javascript|vbscript|onload|onerror|onclick)\b)/i,
      /(\b(union|select|insert|update|delete|drop|create|alter|exec|execute)\s+.*\bfrom\b)/i,
      /(\b(union|select|insert|update|delete|drop|create|alter|exec|execute)\s+.*\bwhere\b)/i,
      /(--|\/\*|\*\/|xp_|sp_)/i,
      /(\b(and|or)\s+\d+\s*=\s*\d+)/i,
      /(\b(and|or)\s+['"]?\w+['"]?\s*=\s*['"]?\w+['"]?)/i
    ]

    return sqlPatterns.some(pattern => pattern.test(input))
  }

  // XSS prevention
  containsXSS(input: string): boolean {
    const xssPatterns = [
      /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
      /javascript:/gi,
      /vbscript:/gi,
      /on\w+\s*=/gi,
      /<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi,
      /<object\b[^<]*(?:(?!<\/object>)<[^<]*)*<\/object>/gi,
      /<embed\b[^<]*(?:(?!<\/embed>)<[^<]*)*<\/embed>/gi,
      /<link\b[^<]*(?:(?!<\/link>)<[^<]*)*<\/link>/gi,
      /<meta\b[^<]*(?:(?!<\/meta>)<[^<]*)*>/gi
    ]

    return xssPatterns.some(pattern => pattern.test(input))
  }

  // Path traversal prevention
  containsPathTraversal(input: string): boolean {
    const pathTraversalPatterns = [
      /\.\.\//,
      /\.\.\\/,
      /\.\.%2f/i,
      /\.\.%5c/i,
      /\.\.%2F/i,
      /\.\.%5C/i
    ]

    return pathTraversalPatterns.some(pattern => pattern.test(input))
  }

  // Comprehensive input validation
  validateAndSanitizeInput(
    input: any,
    options: {
      type: 'email' | 'url' | 'text' | 'number'
      required?: boolean
      minLength?: number
      maxLength?: number
      allowHTML?: boolean
      checkSQLInjection?: boolean
      checkXSS?: boolean
      checkPathTraversal?: boolean
    }
  ): { isValid: boolean; sanitized?: string; errors: string[] } {
    const errors: string[] = []
    let sanitized: string | undefined

    // Check if required
    if (options.required && (!input || (typeof input === 'string' && input.trim() === ''))) {
      errors.push('Field is required')
      return { isValid: false, errors }
    }

    // If not required and empty, return valid
    if (!input || (typeof input === 'string' && input.trim() === '')) {
      return { isValid: true, sanitized: input, errors: [] }
    }

    // Type validation
    const typeValidation = this.validateInput(input, options.type)
    if (!typeValidation.isValid) {
      errors.push(typeValidation.error!)
      return { isValid: false, errors }
    }

    sanitized = typeValidation.sanitized!

    // Length validation
    if (options.minLength && sanitized.length < options.minLength) {
      errors.push(`Minimum length is ${options.minLength} characters`)
    }

    if (options.maxLength && sanitized.length > options.maxLength) {
      errors.push(`Maximum length is ${options.maxLength} characters`)
    }

    // Security checks
    if (options.checkSQLInjection !== false && this.containsSQLInjection(sanitized)) {
      errors.push('Input contains potentially dangerous SQL patterns')
    }

    if (options.checkXSS !== false && this.containsXSS(sanitized)) {
      errors.push('Input contains potentially dangerous XSS patterns')
    }

    if (options.checkPathTraversal !== false && this.containsPathTraversal(sanitized)) {
      errors.push('Input contains potentially dangerous path traversal patterns')
    }

    return {
      isValid: errors.length === 0,
      sanitized,
      errors
    }
  }

  // Update configuration
  updateConfig(newConfig: Partial<SecurityConfig>): void {
    this.config = { ...this.config, ...newConfig }
  }

  // Get current configuration
  getConfig(): SecurityConfig {
    return { ...this.config }
  }

  // Clear rate limit store (useful for testing)
  clearRateLimitStore(): void {
    this.rateLimitStore.clear()
  }
}

// Create default instance
export const securityMiddleware = new SecurityMiddleware()

// Utility function to apply security headers to any response
export function applySecurityHeaders(response: NextResponse): NextResponse {
  return securityMiddleware.addSecurityHeaders(response)
}

// Utility function to validate input with default security settings
export function validateInput(input: any, type: 'email' | 'url' | 'text' | 'number'): { isValid: boolean; sanitized?: string; error?: string } {
  return securityMiddleware.validateInput(input, type)
}

// Utility function for comprehensive input validation
export function validateAndSanitizeInput(
  input: any,
  options: {
    type: 'email' | 'url' | 'text' | 'number'
    required?: boolean
    minLength?: number
    maxLength?: number
    allowHTML?: boolean
    checkSQLInjection?: boolean
    checkXSS?: boolean
    checkPathTraversal?: boolean
  }
): { isValid: boolean; sanitized?: string; errors: string[] } {
  return securityMiddleware.validateAndSanitizeInput(input, options)
}

// Export the class for testing
export { SecurityMiddleware }

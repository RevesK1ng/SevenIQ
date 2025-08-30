export enum LogLevel {
  DEBUG = 0,
  INFO = 1,
  WARN = 2,
  ERROR = 3,
  FATAL = 4
}

export interface LogEntry {
  timestamp: string
  level: LogLevel
  message: string
  context?: Record<string, any>
  error?: Error
  requestId?: string
  userId?: string
  sessionId?: string
  ip?: string
  userAgent?: string
  url?: string
  method?: string
  duration?: number
  memory?: {
    used: number
    total: number
    limit: number
  }
}

export interface LogTransport {
  log(entry: LogEntry): void | Promise<void>
  flush?(): void | Promise<void>
}

export interface LoggerConfig {
  level: LogLevel
  transports: LogTransport[]
  enableRequestLogging: boolean
  enablePerformanceLogging: boolean
  enableErrorLogging: boolean
  enableSecurityLogging: boolean
  maxLogSize: number
  logFormat: 'json' | 'text' | 'simple'
  includeTimestamp: boolean
  includeContext: boolean
  includeStack: boolean
}

class ConsoleTransport implements LogTransport {
  private config: LoggerConfig

  constructor(config: LoggerConfig) {
    this.config = config
  }

  log(entry: LogEntry): void {
    const levelName = LogLevel[entry.level]
    const timestamp = this.config.includeTimestamp ? `[${entry.timestamp}] ` : ''
    const context = this.config.includeContext && entry.context ? ` ${JSON.stringify(entry.context)}` : ''
    const error = entry.error ? `\n${entry.error.stack || entry.error.message}` : ''

    const logMessage = `${timestamp}[${levelName}] ${entry.message}${context}${error}`

    switch (entry.level) {
      case LogLevel.DEBUG:
        console.debug(logMessage)
        break
      case LogLevel.INFO:
        console.info(logMessage)
        break
      case LogLevel.WARN:
        console.warn(logMessage)
        break
      case LogLevel.ERROR:
      case LogLevel.FATAL:
        console.error(logMessage)
        break
    }
  }
}

class FileTransport implements LogTransport {
  private config: LoggerConfig
  private logBuffer: LogEntry[] = []
  private maxBufferSize: number = 100

  constructor(config: LoggerConfig) {
    this.config = config
  }

  log(entry: LogEntry): void {
    this.logBuffer.push(entry)

    if (this.logBuffer.length >= this.maxBufferSize) {
      this.flush()
    }
  }

  async flush(): Promise<void> {
    if (this.logBuffer.length === 0) return

    try {
      // In a real implementation, this would write to a file
      // For now, we'll just clear the buffer
      const logs = this.logBuffer.map(entry => this.formatLogEntry(entry)).join('\n')
      
      // This is a placeholder - in production you'd write to actual files
      console.log('File transport flush:', logs)
      
      this.logBuffer = []
    } catch (error) {
      console.error('Error flushing file transport:', error)
    }
  }

  private formatLogEntry(entry: LogEntry): string {
    if (this.config.logFormat === 'json') {
      return JSON.stringify(entry)
    }

    const parts = [
      entry.timestamp,
      LogLevel[entry.level],
      entry.message
    ]

    if (entry.context && Object.keys(entry.context).length > 0) {
      parts.push(JSON.stringify(entry.context))
    }

    if (entry.error) {
      parts.push(entry.error.message)
    }

    return parts.join(' | ')
  }
}

class RemoteTransport implements LogTransport {
  private config: LoggerConfig
  private endpoint: string
  private batchSize: number = 50
  private batchTimeout: number = 5000
  private logBuffer: LogEntry[] = []
  private batchTimer: NodeJS.Timeout | null = null

  constructor(config: LoggerConfig, endpoint: string) {
    this.config = config
    this.endpoint = endpoint
  }

  log(entry: LogEntry): void {
    this.logBuffer.push(entry)

    if (this.logBuffer.length >= this.batchSize) {
      this.flush()
    } else if (!this.batchTimer) {
      this.batchTimer = setTimeout(() => this.flush(), this.batchTimeout)
    }
  }

  async flush(): Promise<void> {
    if (this.logBuffer.length === 0) return

    try {
      const logs = this.logBuffer.splice(0)
      
      // In production, this would send to a remote logging service
      // For now, we'll just log to console
      console.log('Remote transport flush:', logs.length, 'logs')
      
      if (this.batchTimer) {
        clearTimeout(this.batchTimer)
        this.batchTimer = null
      }
    } catch (error) {
      console.error('Error flushing remote transport:', error)
    }
  }
}

class Logger {
  private config: LoggerConfig
  private transports: LogTransport[]
  private requestIdGenerator: () => string
  private logBuffer: LogEntry[] = []

  constructor(config: Partial<LoggerConfig> = {}) {
    this.config = {
      level: LogLevel.INFO,
      transports: [],
      enableRequestLogging: true,
      enablePerformanceLogging: true,
      enableErrorLogging: true,
      enableSecurityLogging: true,
      maxLogSize: 1000,
      logFormat: 'json',
      includeTimestamp: true,
      includeContext: true,
      includeStack: true,
      ...config
    }

    this.transports = this.config.transports.length > 0 
      ? this.config.transports 
      : [new ConsoleTransport(this.config)]

    this.requestIdGenerator = this.createRequestIdGenerator()
  }

  private createRequestIdGenerator(): () => string {
    let counter = 0
    return () => `req_${Date.now()}_${counter++}`
  }

  private shouldLog(level: LogLevel): boolean {
    return level >= this.config.level
  }

  private createLogEntry(
    level: LogLevel,
    message: string,
    context?: Record<string, any>,
    error?: Error
  ): LogEntry {
    const entry: LogEntry = {
      timestamp: new Date().toISOString(),
      level,
      message,
      context,
      error
    }

    // Add to buffer
    this.logBuffer.push(entry)

    // Maintain buffer size
    if (this.logBuffer.length > this.config.maxLogSize) {
      this.logBuffer = this.logBuffer.slice(-this.config.maxLogSize)
    }

    return entry
  }

  private async writeToTransports(entry: LogEntry): Promise<void> {
    const promises = this.transports.map(transport => {
      try {
        return transport.log(entry)
      } catch (error) {
        console.error('Error writing to transport:', error)
      }
    })

    await Promise.all(promises)
  }

  async log(
    level: LogLevel,
    message: string,
    context?: Record<string, any>,
    error?: Error
  ): Promise<void> {
    if (!this.shouldLog(level)) return

    const entry = this.createLogEntry(level, message, context, error)
    await this.writeToTransports(entry)
  }

  async debug(message: string, context?: Record<string, any>): Promise<void> {
    await this.log(LogLevel.DEBUG, message, context)
  }

  async info(message: string, context?: Record<string, any>): Promise<void> {
    await this.log(LogLevel.INFO, message, context)
  }

  async warn(message: string, context?: Record<string, any>): Promise<void> {
    await this.log(LogLevel.WARN, message, context)
  }

  async error(message: string, context?: Record<string, any>, error?: Error): Promise<void> {
    await this.log(LogLevel.ERROR, message, context, error)
  }

  async fatal(message: string, context?: Record<string, any>, error?: Error): Promise<void> {
    await this.log(LogLevel.FATAL, message, context, error)
  }

  // Request logging
  async logRequest(
    request: Request,
    response: Response,
    duration: number,
    context?: Record<string, any>
  ): Promise<void> {
    if (!this.config.enableRequestLogging) return

    const requestId = this.requestIdGenerator()
    const url = new URL(request.url)
    
    const logContext = {
      ...context,
      requestId,
      method: request.method,
      url: url.pathname,
      query: Object.fromEntries(url.searchParams),
      duration,
      status: response.status,
      userAgent: request.headers.get('user-agent'),
      ip: request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip'),
      referer: request.headers.get('referer')
    }

    if (response.status >= 400) {
      await this.warn(`HTTP ${response.status} ${request.method} ${url.pathname}`, logContext)
    } else {
      await this.info(`HTTP ${response.status} ${request.method} ${url.pathname}`, logContext)
    }
  }

  // Performance logging
  async logPerformance(
    operation: string,
    duration: number,
    context?: Record<string, any>
  ): Promise<void> {
    if (!this.config.enablePerformanceLogging) return

    const logContext = {
      ...context,
      operation,
      duration,
      memory: this.getMemoryUsage()
    }

    if (duration > 1000) {
      await this.warn(`Slow operation: ${operation} took ${duration}ms`, logContext)
    } else {
      await this.debug(`Operation: ${operation} took ${duration}ms`, logContext)
    }
  }

  // Error logging
  async logError(
    error: Error,
    context?: Record<string, any>
  ): Promise<void> {
    if (!this.config.enableErrorLogging) return

    const logContext = {
      ...context,
      errorName: error.name,
      errorMessage: error.message,
      stack: this.config.includeStack ? error.stack : undefined
    }

    await this.error(`Error: ${error.message}`, logContext, error)
  }

  // Security logging
  async logSecurity(
    event: string,
    details: Record<string, any>,
    level: LogLevel = LogLevel.WARN
  ): Promise<void> {
    if (!this.config.enableSecurityLogging) return

    const logContext = {
      ...details,
      securityEvent: event,
      timestamp: new Date().toISOString()
    }

    await this.log(level, `Security event: ${event}`, logContext)
  }

  // Memory usage logging
  private getMemoryUsage(): { used: number; total: number; limit: number } | undefined {
    if (typeof performance !== 'undefined' && 'memory' in performance) {
      const memory = (performance as any).memory
      return {
        used: memory.usedJSHeapSize,
        total: memory.totalJSHeapSize,
        limit: memory.jsHeapSizeLimit
      }
    }
    return undefined
  }

  // Get logs from buffer
  getLogs(level?: LogLevel, limit?: number): LogEntry[] {
    let logs = this.logBuffer

    if (level !== undefined) {
      logs = logs.filter(log => log.level >= level)
    }

    if (limit) {
      logs = logs.slice(-limit)
    }

    return logs
  }

  // Export logs
  exportLogs(format: 'json' | 'csv' = 'json'): string {
    const logs = this.getLogs()

    if (format === 'json') {
      return JSON.stringify(logs, null, 2)
    }

    if (format === 'csv') {
      const headers = ['timestamp', 'level', 'message', 'context', 'error']
      const csvRows = [headers.join(',')]

      logs.forEach(log => {
        const row = [
          log.timestamp,
          LogLevel[log.level],
          `"${log.message.replace(/"/g, '""')}"`,
          log.context ? `"${JSON.stringify(log.context).replace(/"/g, '""')}"` : '',
          log.error ? `"${log.error.message.replace(/"/g, '""')}"` : ''
        ]
        csvRows.push(row.join(','))
      })

      return csvRows.join('\n')
    }

    return ''
  }

  // Clear logs
  clearLogs(): void {
    this.logBuffer = []
  }

  // Add transport
  addTransport(transport: LogTransport): void {
    this.transports.push(transport)
  }

  // Remove transport
  removeTransport(transport: LogTransport): void {
    const index = this.transports.indexOf(transport)
    if (index > -1) {
      this.transports.splice(index, 1)
    }
  }

  // Update configuration
  updateConfig(newConfig: Partial<LoggerConfig>): void {
    this.config = { ...this.config, ...newConfig }
  }

  // Get configuration
  getConfig(): LoggerConfig {
    return { ...this.config }
  }

  // Flush all transports
  async flush(): Promise<void> {
    const promises = this.transports
      .filter(transport => transport.flush)
      .map(transport => transport.flush!())

    await Promise.all(promises)
  }
}

// Create default logger instance
export const logger = new Logger()

// Utility functions
export function createLogger(config: Partial<LoggerConfig> = {}): Logger {
  return new Logger(config)
}

export function createConsoleTransport(config: LoggerConfig): LogTransport {
  return new ConsoleTransport(config)
}

export function createFileTransport(config: LoggerConfig): LogTransport {
  return new FileTransport(config)
}

export function createRemoteTransport(config: LoggerConfig, endpoint: string): LogTransport {
  return new RemoteTransport(config, endpoint)
}

// React hook for logging
export function useLogger(): Logger {
  return logger
}

// Export types and classes
export { Logger, LogTransport, ConsoleTransport, FileTransport, RemoteTransport }
export type { LogEntry, LoggerConfig }

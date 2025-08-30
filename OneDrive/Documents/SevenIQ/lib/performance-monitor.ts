import { errorLogger } from '../components/error-handling'

export interface PerformanceMetric {
  name: string
  value: number
  unit: string
  timestamp: number
  metadata?: Record<string, any>
}

export interface PerformanceThreshold {
  name: string
  warning: number
  critical: number
  unit: string
}

export interface PerformanceReport {
  metrics: PerformanceMetric[]
  summary: {
    totalMetrics: number
    warnings: number
    critical: number
    averageResponseTime: number
    slowestOperation: PerformanceMetric | null
    fastestOperation: PerformanceMetric | null
  }
  recommendations: string[]
}

class PerformanceMonitor {
  private metrics: PerformanceMetric[] = []
  private thresholds: Map<string, PerformanceThreshold> = new Map()
  private observers: Set<(metric: PerformanceMetric) => void> = new Set()
  private isEnabled: boolean = true

  constructor() {
    this.setupDefaultThresholds()
    this.setupGlobalPerformanceObserver()
  }

  private setupDefaultThresholds() {
    this.addThreshold({
      name: 'api_response_time',
      warning: 1000, // 1 second
      critical: 3000, // 3 seconds
      unit: 'ms'
    })

    this.addThreshold({
      name: 'page_load_time',
      warning: 2000, // 2 seconds
      critical: 5000, // 5 seconds
      unit: 'ms'
    })

    this.addThreshold({
      name: 'memory_usage',
      warning: 50 * 1024 * 1024, // 50MB
      critical: 100 * 1024 * 1024, // 100MB
      unit: 'bytes'
    })
  }

  private setupGlobalPerformanceObserver() {
    if (typeof window !== 'undefined' && 'PerformanceObserver' in window) {
      try {
        // Observe navigation timing
        const navigationObserver = new PerformanceObserver((list) => {
          list.getEntries().forEach((entry) => {
            if (entry.entryType === 'navigation') {
              const navEntry = entry as PerformanceNavigationTiming
              this.recordMetric('page_load_time', navEntry.loadEventEnd - navEntry.loadEventStart)
              this.recordMetric('dom_content_loaded', navEntry.domContentLoadedEventEnd - navEntry.domContentLoadedEventStart)
              this.recordMetric('first_paint', navEntry.responseStart - navEntry.requestStart)
            }
          })
        })

        navigationObserver.observe({ entryTypes: ['navigation'] })

        // Observe resource timing
        const resourceObserver = new PerformanceObserver((list) => {
          list.getEntries().forEach((entry) => {
            if (entry.entryType === 'resource') {
              const resourceEntry = entry as PerformanceResourceTiming
              this.recordMetric('resource_load_time', resourceEntry.responseEnd - resourceEntry.requestStart, {
                resource: resourceEntry.name,
                type: resourceEntry.initiatorType
              })
            }
          })
        })

        resourceObserver.observe({ entryTypes: ['resource'] })

        // Observe paint timing
        const paintObserver = new PerformanceObserver((list) => {
          list.getEntries().forEach((entry) => {
            if (entry.entryType === 'paint') {
              const paintEntry = entry as PerformancePaintTiming
              this.recordMetric('paint_time', paintEntry.startTime, {
                paint: paintEntry.name
              })
            }
          })
        })

        paintObserver.observe({ entryTypes: ['paint'] })

        // Observe long tasks
        const longTaskObserver = new PerformanceObserver((list) => {
          list.getEntries().forEach((entry) => {
            if (entry.entryType === 'longtask') {
              const longTaskEntry = entry as PerformanceLongTaskTiming
              this.recordMetric('long_task_duration', longTaskEntry.duration, {
                startTime: longTaskEntry.startTime,
                name: longTaskEntry.name
              })
            }
          })
        })

        longTaskObserver.observe({ entryTypes: ['longtask'] })

      } catch (error) {
        errorLogger.logError(error as Error, { context: 'PerformanceMonitor setup' })
      }
    }
  }

  enable() {
    this.isEnabled = true
  }

  disable() {
    this.isEnabled = false
  }

  isMonitoringEnabled(): boolean {
    return this.isEnabled
  }

  addThreshold(threshold: PerformanceThreshold) {
    this.thresholds.set(threshold.name, threshold)
  }

  removeThreshold(name: string) {
    this.thresholds.delete(name)
  }

  recordMetric(name: string, value: number, metadata?: Record<string, any>) {
    if (!this.isEnabled) return

    const metric: PerformanceMetric = {
      name,
      value,
      unit: this.getUnitForMetric(name),
      timestamp: Date.now(),
      metadata
    }

    this.metrics.push(metric)

    // Check thresholds and notify observers
    this.checkThresholds(metric)
    this.notifyObservers(metric)

    // Keep only last 1000 metrics to prevent memory issues
    if (this.metrics.length > 1000) {
      this.metrics = this.metrics.slice(-1000)
    }
  }

  private getUnitForMetric(name: string): string {
    if (name.includes('time') || name.includes('duration')) return 'ms'
    if (name.includes('memory') || name.includes('size')) return 'bytes'
    if (name.includes('count')) return 'count'
    return 'ms'
  }

  private checkThresholds(metric: PerformanceMetric) {
    const threshold = this.thresholds.get(metric.name)
    if (!threshold) return

    if (metric.value >= threshold.critical) {
      errorLogger.logError(new Error(`Critical performance threshold exceeded: ${metric.name} = ${metric.value}${threshold.unit}`), {
        context: 'PerformanceMonitor',
        metric,
        threshold
      })
    } else if (metric.value >= threshold.warning) {
      errorLogger.logWarning(`Performance warning: ${metric.name} = ${metric.value}${threshold.unit}`, {
        context: 'PerformanceMonitor',
        metric,
        threshold
      })
    }
  }

  private notifyObservers(metric: PerformanceMetric) {
    this.observers.forEach(observer => {
      try {
        observer(metric)
      } catch (error) {
        errorLogger.logError(error as Error, { context: 'PerformanceMonitor observer' })
      }
    })
  }

  addObserver(observer: (metric: PerformanceMetric) => void) {
    this.observers.add(observer)
  }

  removeObserver(observer: (metric: PerformanceMetric) => void) {
    this.observers.delete(observer)
  }

  getMetrics(name?: string, timeRange?: { start: number; end: number }): PerformanceMetric[] {
    let filteredMetrics = this.metrics

    if (name) {
      filteredMetrics = filteredMetrics.filter(m => m.name === name)
    }

    if (timeRange) {
      filteredMetrics = filteredMetrics.filter(m => 
        m.timestamp >= timeRange.start && m.timestamp <= timeRange.end
      )
    }

    return filteredMetrics
  }

  getLatestMetric(name: string): PerformanceMetric | null {
    const metrics = this.getMetrics(name)
    return metrics.length > 0 ? metrics[metrics.length - 1] : null
  }

  getAverageMetric(name: string, timeRange?: { start: number; end: number }): number {
    const metrics = this.getMetrics(name, timeRange)
    if (metrics.length === 0) return 0

    const sum = metrics.reduce((acc, m) => acc + m.value, 0)
    return sum / metrics.length
  }

  getMetricSummary(name: string, timeRange?: { start: number; end: number }) {
    const metrics = this.getMetrics(name, timeRange)
    if (metrics.length === 0) return null

    const values = metrics.map(m => m.value)
    return {
      count: metrics.length,
      min: Math.min(...values),
      max: Math.max(...values),
      average: values.reduce((acc, val) => acc + val, 0) / values.length,
      median: this.calculateMedian(values),
      p95: this.calculatePercentile(values, 95),
      p99: this.calculatePercentile(values, 99)
    }
  }

  private calculateMedian(values: number[]): number {
    const sorted = [...values].sort((a, b) => a - b)
    const mid = Math.floor(sorted.length / 2)
    return sorted.length % 2 === 0
      ? (sorted[mid - 1] + sorted[mid]) / 2
      : sorted[mid]
  }

  private calculatePercentile(values: number[], percentile: number): number {
    const sorted = [...values].sort((a, b) => a - b)
    const index = Math.ceil((percentile / 100) * sorted.length) - 1
    return sorted[index] || 0
  }

  generateReport(timeRange?: { start: number; end: number }): PerformanceReport {
    const allMetrics = timeRange ? this.getMetrics(undefined, timeRange) : this.metrics
    const apiMetrics = this.getMetrics('api_response_time', timeRange)
    const pageLoadMetrics = this.getMetrics('page_load_time', timeRange)

    const warnings = allMetrics.filter(m => {
      const threshold = this.thresholds.get(m.name)
      return threshold && m.value >= threshold.warning && m.value < threshold.critical
    }).length

    const critical = allMetrics.filter(m => {
      const threshold = this.thresholds.get(m.name)
      return threshold && m.value >= threshold.critical
    }).length

    const averageResponseTime = apiMetrics.length > 0 
      ? apiMetrics.reduce((acc, m) => acc + m.value, 0) / apiMetrics.length 
      : 0

    const slowestOperation = allMetrics.length > 0 
      ? allMetrics.reduce((max, m) => m.value > max.value ? m : max)
      : null

    const fastestOperation = allMetrics.length > 0 
      ? allMetrics.reduce((min, m) => m.value < min.value ? m : min)
      : null

    const recommendations: string[] = []

    if (averageResponseTime > 1000) {
      recommendations.push('Consider optimizing API response times')
    }

    if (critical > 0) {
      recommendations.push('Address critical performance issues immediately')
    }

    if (warnings > 5) {
      recommendations.push('Monitor performance warnings closely')
    }

    return {
      metrics: allMetrics,
      summary: {
        totalMetrics: allMetrics.length,
        warnings,
        critical,
        averageResponseTime,
        slowestOperation,
        fastestOperation
      },
      recommendations
    }
  }

  clearMetrics() {
    this.metrics = []
  }

  exportMetrics(): string {
    return JSON.stringify(this.metrics, null, 2)
  }

  importMetrics(jsonData: string) {
    try {
      const metrics = JSON.parse(jsonData)
      if (Array.isArray(metrics)) {
        this.metrics = metrics
      }
    } catch (error) {
      errorLogger.logError(error as Error, { context: 'PerformanceMonitor import' })
    }
  }
}

// Create singleton instance
export const performanceMonitor = new PerformanceMonitor()

// Utility functions for common performance measurements
export function measureAsync<T>(
  name: string,
  operation: () => Promise<T>
): Promise<T> {
  const startTime = performance.now()
  
  return operation().finally(() => {
    const duration = performance.now() - startTime
    performanceMonitor.recordMetric(name, duration)
  })
}

export function measureSync<T>(
  name: string,
  operation: () => T
): T {
  const startTime = performance.now()
  
  try {
    return operation()
  } finally {
    const duration = performance.now() - startTime
    performanceMonitor.recordMetric(name, duration)
  }
}

export function measurePageLoad() {
  if (typeof window !== 'undefined') {
    window.addEventListener('load', () => {
      const loadTime = performance.now()
      performanceMonitor.recordMetric('page_load_complete', loadTime)
    })
  }
}

export function measureMemoryUsage() {
  if (typeof performance !== 'undefined' && 'memory' in performance) {
    const memory = (performance as any).memory
    performanceMonitor.recordMetric('memory_used', memory.usedJSHeapSize)
    performanceMonitor.recordMetric('memory_total', memory.totalJSHeapSize)
    performanceMonitor.recordMetric('memory_limit', memory.jsHeapSizeLimit)
  }
}

export function measureNetworkActivity() {
  if (typeof window !== 'undefined' && 'navigator' in window) {
    const connection = (navigator as any).connection
    if (connection) {
      performanceMonitor.recordMetric('network_effective_type', connection.effectiveType === '4g' ? 4 : 3, {
        effectiveType: connection.effectiveType,
        downlink: connection.downlink,
        rtt: connection.rtt
      })
    }
  }
}

// React hook for performance monitoring
export function usePerformanceMonitor() {
  return {
    recordMetric: performanceMonitor.recordMetric.bind(performanceMonitor),
    getMetrics: performanceMonitor.getMetrics.bind(performanceMonitor),
    getLatestMetric: performanceMonitor.getLatestMetric.bind(performanceMonitor),
    generateReport: performanceMonitor.generateReport.bind(performanceMonitor)
  }
}

// Export the class for testing
export { PerformanceMonitor }

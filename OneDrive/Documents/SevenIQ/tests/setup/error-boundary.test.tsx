import { render, screen, fireEvent } from '@testing-library/react'
import { ErrorBoundary, ErrorDisplay, ErrorFallback, NetworkError, ValidationError } from '../../components/error-handling'

// Mock component that throws an error
const ThrowError = ({ shouldThrow }: { shouldThrow: boolean }) => {
  if (shouldThrow) {
    throw new Error('Test error')
  }
  return <div>No error</div>
}

describe('ErrorBoundary', () => {
  beforeEach(() => {
    // Suppress console.error for tests
    jest.spyOn(console, 'error').mockImplementation(() => {})
  })

  afterEach(() => {
    jest.restoreAllMocks()
  })

  it('renders children when there is no error', () => {
    render(
      <ErrorBoundary>
        <div>Test content</div>
      </ErrorBoundary>
    )

    expect(screen.getByText('Test content')).toBeInTheDocument()
  })

  it('renders error fallback when there is an error', () => {
    render(
      <ErrorBoundary>
        <ThrowError shouldThrow={true} />
      </ErrorBoundary>
    )

    expect(screen.getByText('Something went wrong')).toBeInTheDocument()
    expect(screen.getByText('Try again')).toBeInTheDocument()
    expect(screen.getByText('Refresh page')).toBeInTheDocument()
  })

  it('calls resetError when try again button is clicked', () => {
    const resetError = jest.fn()
    
    render(
      <ErrorBoundary>
        <ThrowError shouldThrow={true} />
      </ErrorBoundary>
    )

    fireEvent.click(screen.getByText('Try again'))
    expect(resetError).toHaveBeenCalled()
  })

  it('shows error details in development mode', () => {
    const originalEnv = process.env.NODE_ENV
    process.env.NODE_ENV = 'development'

    render(
      <ErrorBoundary>
        <ThrowError shouldThrow={true} />
      </ErrorBoundary>
    )

    expect(screen.getByText('Error Details (Development)')).toBeInTheDocument()
    expect(screen.getByText(/Error: Test error/)).toBeInTheDocument()

    process.env.NODE_ENV = originalEnv
  })
})

describe('ErrorDisplay', () => {
  it('renders error message correctly', () => {
    render(
      <ErrorDisplay error="Test error message" />
    )

    expect(screen.getByText('Error')).toBeInTheDocument()
    expect(screen.getByText('Test error message')).toBeInTheDocument()
  })

  it('renders error object message correctly', () => {
    const error = new Error('Object error message')
    render(
      <ErrorDisplay error={error} />
    )

    expect(screen.getByText('Object error message')).toBeInTheDocument()
  })

  it('shows retry button when onRetry is provided', () => {
    const onRetry = jest.fn()
    render(
      <ErrorDisplay error="Test error" onRetry={onRetry} />
    )

    expect(screen.getByText('Try again')).toBeInTheDocument()
    fireEvent.click(screen.getByText('Try again'))
    expect(onRetry).toHaveBeenCalled()
  })

  it('shows dismiss button when onDismiss is provided', () => {
    const onDismiss = jest.fn()
    render(
      <ErrorDisplay error="Test error" onDismiss={onDismiss} />
    )

    expect(screen.getByLabelText('Dismiss')).toBeInTheDocument()
    fireEvent.click(screen.getByLabelText('Dismiss'))
    expect(onDismiss).toHaveBeenCalled()
  })

  it('applies correct variant styles', () => {
    const { rerender } = render(
      <ErrorDisplay error="Test error" variant="warning" />
    )

    expect(screen.getByText('Warning')).toBeInTheDocument()

    rerender(
      <ErrorDisplay error="Test error" variant="info" />
    )

    expect(screen.getByText('Information')).toBeInTheDocument()
  })

  it('hides when dismissed', () => {
    const onDismiss = jest.fn()
    render(
      <ErrorDisplay error="Test error" onDismiss={onDismiss} />
    )

    expect(screen.getByText('Test error')).toBeInTheDocument()
    fireEvent.click(screen.getByLabelText('Dismiss'))
    expect(screen.queryByText('Test error')).not.toBeInTheDocument()
  })
})

describe('ErrorFallback', () => {
  it('renders error fallback correctly', () => {
    const error = new Error('Test error')
    const resetError = jest.fn()

    render(
      <ErrorFallback error={error} resetError={resetError} />
    )

    expect(screen.getByText('Something went wrong')).toBeInTheDocument()
    expect(screen.getByText('Try again')).toBeInTheDocument()
    expect(screen.getByText('Refresh page')).toBeInTheDocument()
  })

  it('calls resetError when try again button is clicked', () => {
    const error = new Error('Test error')
    const resetError = jest.fn()

    render(
      <ErrorFallback error={error} resetError={resetError} />
    )

    fireEvent.click(screen.getByText('Try again'))
    expect(resetError).toHaveBeenCalled()
  })

  it('reloads page when refresh button is clicked', () => {
    const error = new Error('Test error')
    const resetError = jest.fn()
    const reloadMock = jest.fn()
    Object.defineProperty(window, 'location', {
      value: { reload: reloadMock },
      writable: true
    })

    render(
      <ErrorFallback error={error} resetError={resetError} />
    )

    fireEvent.click(screen.getByText('Refresh page'))
    expect(reloadMock).toHaveBeenCalled()
  })
})

describe('NetworkError', () => {
  it('renders network error correctly', () => {
    const onRetry = jest.fn()
    render(
      <NetworkError onRetry={onRetry} />
    )

    expect(screen.getByText('Network Error')).toBeInTheDocument()
    expect(screen.getByText('Unable to connect to the server. Please check your internet connection and try again.')).toBeInTheDocument()
    expect(screen.getByText('Retry')).toBeInTheDocument()
  })

  it('calls onRetry when retry button is clicked', () => {
    const onRetry = jest.fn()
    render(
      <NetworkError onRetry={onRetry} />
    )

    fireEvent.click(screen.getByText('Retry'))
    expect(onRetry).toHaveBeenCalled()
  })
})

describe('ValidationError', () => {
  it('renders validation errors correctly', () => {
    const errors = {
      email: ['Invalid email format'],
      password: ['Too short', 'Must contain uppercase']
    }

    render(
      <ValidationError errors={errors} />
    )

    expect(screen.getByText('Please fix the following errors:')).toBeInTheDocument()
    expect(screen.getByText('Email: Invalid email format')).toBeInTheDocument()
    expect(screen.getByText('Password: Too short, Must contain uppercase')).toBeInTheDocument()
  })

  it('renders nothing when no errors', () => {
    const errors = {}
    const { container } = render(
      <ValidationError errors={errors} />
    )

    expect(container.firstChild).toBeNull()
  })

  it('handles multiple errors per field', () => {
    const errors = {
      field1: ['Error 1', 'Error 2'],
      field2: ['Error 3']
    }

    render(
      <ValidationError errors={errors} />
    )

    expect(screen.getByText('Field1: Error 1, Error 2')).toBeInTheDocument()
    expect(screen.getByText('Field2: Error 3')).toBeInTheDocument()
  })
})

describe('errorLogger', () => {
  let consoleSpy: jest.SpyInstance

  beforeEach(() => {
    consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {})
  })

  afterEach(() => {
    consoleSpy.mockRestore()
  })

  it('logs errors to console', () => {
    const error = new Error('Test error')
    const { errorLogger } = require('../../components/error-handling')
    
    errorLogger.logError(error, { context: 'test' })
    
    expect(consoleSpy).toHaveBeenCalledWith('Error logged:', error, { context: 'test' })
  })

  it('logs warnings to console', () => {
    const consoleWarnSpy = jest.spyOn(console, 'warn').mockImplementation(() => {})
    const { errorLogger } = require('../../components/error-handling')
    
    errorLogger.logWarning('Test warning', { context: 'test' })
    
    expect(consoleWarnSpy).toHaveBeenCalledWith('Warning logged:', 'Test warning', { context: 'test' })
    consoleWarnSpy.mockRestore()
  })

  it('logs info to console', () => {
    const consoleInfoSpy = jest.spyOn(console, 'info').mockImplementation(() => {})
    const { errorLogger } = require('../../components/error-handling')
    
    errorLogger.logInfo('Test info', { context: 'test' })
    
    expect(consoleInfoSpy).toHaveBeenCalledWith('Info logged:', 'Test info', { context: 'test' })
    consoleInfoSpy.mockRestore()
  })
})

describe('useErrorHandler', () => {
  it('manages errors correctly', () => {
    const { useErrorHandler } = require('../../components/error-handling')
    const TestComponent = () => {
      const { errors, addError, removeError, clearErrors } = useErrorHandler()
      
      return (
        <div>
          <button onClick={() => addError(new Error('Test error'))}>Add Error</button>
          <button onClick={() => removeError(0)}>Remove Error</button>
          <button onClick={clearErrors}>Clear Errors</button>
          <div data-testid="error-count">{errors.length}</div>
        </div>
      )
    }

    render(<TestComponent />)
    
    expect(screen.getByTestId('error-count')).toHaveTextContent('0')
    
    fireEvent.click(screen.getByText('Add Error'))
    expect(screen.getByTestId('error-count')).toHaveTextContent('1')
    
    fireEvent.click(screen.getByText('Remove Error'))
    expect(screen.getByTestId('error-count')).toHaveTextContent('0')
    
    fireEvent.click(screen.getByText('Add Error'))
    fireEvent.click(screen.getByText('Add Error'))
    expect(screen.getByTestId('error-count')).toHaveTextContent('2')
    
    fireEvent.click(screen.getByText('Clear Errors'))
    expect(screen.getByTestId('error-count')).toHaveTextContent('0')
  })
})

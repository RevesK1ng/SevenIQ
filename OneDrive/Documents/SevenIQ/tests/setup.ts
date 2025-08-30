import '@testing-library/jest-dom'
import { vi, beforeAll, afterAll, beforeEach, afterEach } from 'vitest'
import { cleanup } from '@testing-library/react'

// Mock Next.js router
const mockRouter = {
  push: vi.fn(),
  replace: vi.fn(),
  prefetch: vi.fn(),
  back: vi.fn(),
  forward: vi.fn(),
  refresh: vi.fn(),
  pathname: '/',
  query: {},
  asPath: '/',
  events: {
    on: vi.fn(),
    off: vi.fn(),
    emit: vi.fn()
  }
}

vi.mock('next/navigation', () => ({
  useRouter: () => mockRouter,
  usePathname: () => '/',
  useSearchParams: () => new URLSearchParams(),
  redirect: vi.fn(),
  notFound: vi.fn()
}))

vi.mock('next/link', () => ({
  default: ({ children, href, ...props }: any) => {
    return (
      <a href={href} {...props}>
        {children}
      </a>
    )
  }
}))

vi.mock('next/image', () => ({
  default: ({ src, alt, ...props }: any) => {
    return <img src={src} alt={alt} {...props} />
  }
}))

// Mock Supabase
const mockSupabase = {
  auth: {
    getUser: vi.fn(),
    signInWithPassword: vi.fn(),
    signUp: vi.fn(),
    signOut: vi.fn(),
    onAuthStateChange: vi.fn(),
    getSession: vi.fn()
  },
  from: vi.fn(() => ({
    select: vi.fn().mockReturnThis(),
    insert: vi.fn().mockReturnThis(),
    update: vi.fn().mockReturnThis(),
    delete: vi.fn().mockReturnThis(),
    eq: vi.fn().mockReturnThis(),
    single: vi.fn().mockReturnThis(),
    then: vi.fn().mockResolvedValue({ data: null, error: null })
  })),
  storage: {
    from: vi.fn(() => ({
      upload: vi.fn(),
      download: vi.fn(),
      remove: vi.fn(),
      list: vi.fn()
    }))
  }
}

vi.mock('@/lib/supabase', () => ({
  supabase: mockSupabase,
  createClient: () => mockSupabase
}))

// Mock Stripe
const mockStripe = {
  checkout: {
    sessions: {
      create: vi.fn(),
      retrieve: vi.fn()
    }
  },
  customers: {
    create: vi.fn(),
    retrieve: vi.fn(),
    update: vi.fn()
  },
  subscriptions: {
    create: vi.fn(),
    retrieve: vi.fn(),
    update: vi.fn(),
    cancel: vi.fn()
  },
  billingPortal: {
    sessions: {
      create: vi.fn()
    }
  },
  webhooks: {
    constructEvent: vi.fn()
  }
}

vi.mock('stripe', () => ({
  default: vi.fn(() => mockStripe)
}))

// Mock OpenAI
const mockOpenAI = {
  chat: {
    completions: {
      create: vi.fn()
    }
  }
}

vi.mock('openai', () => ({
  default: vi.fn(() => mockOpenAI)
}))

// Mock environment variables
process.env.NODE_ENV = 'test'
process.env.NEXT_PUBLIC_SITE_URL = 'http://localhost:3000'
process.env.NEXT_PUBLIC_SUPABASE_URL = 'http://localhost:54321'
process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = 'test-key'
process.env.STRIPE_SECRET_KEY = 'sk_test_test'
process.env.STRIPE_WEBHOOK_SECRET = 'whsec_test'
process.env.OPENAI_API_KEY = 'sk-test'

// Mock fetch
global.fetch = vi.fn()

// Mock localStorage
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
  length: 0,
  key: vi.fn()
}

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
  writable: true
})

// Mock sessionStorage
const sessionStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
  length: 0,
  key: vi.fn()
}

Object.defineProperty(window, 'sessionStorage', {
  value: sessionStorageMock,
  writable: true
})

// Mock matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn()
  }))
})

// Mock IntersectionObserver
global.IntersectionObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn()
}))

// Mock ResizeObserver
global.ResizeObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn()
}))

// Mock Performance API
Object.defineProperty(window, 'performance', {
  value: {
    now: vi.fn(() => Date.now()),
    mark: vi.fn(),
    measure: vi.fn(),
    getEntriesByType: vi.fn(() => []),
    getEntriesByName: vi.fn(() => []),
    clearMarks: vi.fn(),
    clearMeasures: vi.fn(),
    memory: {
      usedJSHeapSize: 1000000,
      totalJSHeapSize: 2000000,
      jsHeapSizeLimit: 4000000
    }
  },
  writable: true
})

// Mock requestAnimationFrame
global.requestAnimationFrame = vi.fn(cb => setTimeout(cb, 0))
global.cancelAnimationFrame = vi.fn()

// Mock crypto
Object.defineProperty(global, 'crypto', {
  value: {
    getRandomValues: vi.fn(() => new Uint8Array(16)),
    randomUUID: vi.fn(() => 'test-uuid')
  }
})

// Mock URL.createObjectURL
global.URL.createObjectURL = vi.fn(() => 'blob:test-url')
global.URL.revokeObjectURL = vi.fn()

// Mock FileReader
global.FileReader = vi.fn().mockImplementation(() => ({
  readAsText: vi.fn(),
  readAsDataURL: vi.fn(),
  readAsArrayBuffer: vi.fn(),
  onload: null,
  onerror: null,
  onabort: null,
  result: null,
  readyState: 0
}))

// Mock console methods in tests
const originalConsole = { ...console }
const mockConsole = {
  log: vi.fn(),
  info: vi.fn(),
  warn: vi.fn(),
  error: vi.fn(),
  debug: vi.fn()
}

// Setup and teardown
beforeAll(() => {
  // Replace console methods during tests
  Object.assign(console, mockConsole)
  
  // Setup any global test configuration
  vi.setConfig({
    testTimeout: 10000,
    hookTimeout: 10000
  })
})

afterAll(() => {
  // Restore console methods
  Object.assign(console, originalConsole)
  
  // Clean up any global test state
  vi.clearAllMocks()
  vi.clearAllTimers()
})

beforeEach(() => {
  // Clear all mocks before each test
  vi.clearAllMocks()
  
  // Reset localStorage and sessionStorage
  localStorageMock.getItem.mockClear()
  localStorageMock.setItem.mockClear()
  localStorageMock.removeItem.mockClear()
  localStorageMock.clear.mockClear()
  
  sessionStorageMock.getItem.mockClear()
  sessionStorageMock.setItem.mockClear()
  sessionStorageMock.removeItem.mockClear()
  sessionStorageMock.clear.mockClear()
  
  // Reset fetch mock
  vi.mocked(fetch).mockClear()
  
  // Reset router mock
  Object.values(mockRouter).forEach(mock => {
    if (typeof mock === 'function') {
      mock.mockClear()
    }
  })
  
  // Reset Supabase mock
  Object.values(mockSupabase).forEach(mock => {
    if (typeof mock === 'function') {
      mock.mockClear()
    }
  })
  
  // Reset Stripe mock
  Object.values(mockStripe).forEach(mock => {
    if (typeof mock === 'function') {
      mock.mockClear()
    }
  })
  
  // Reset OpenAI mock
  Object.values(mockOpenAI).forEach(mock => {
    if (typeof mock === 'function') {
      mock.mockClear()
    }
  })
})

afterEach(() => {
  // Clean up React Testing Library
  cleanup()
  
  // Clear all timers
  vi.clearAllTimers()
  
  // Clear all mocks
  vi.clearAllMocks()
})

// Export mocks for use in tests
export {
  mockRouter,
  mockSupabase,
  mockStripe,
  mockOpenAI,
  localStorageMock,
  sessionStorageMock,
  mockConsole
}

// Export testing utilities
export const createMockUser = (overrides = {}) => ({
  id: 'test-user-id',
  email: 'test@example.com',
  user_metadata: {
    full_name: 'Test User'
  },
  app_metadata: {
    provider: 'email'
  },
  ...overrides
})

export const createMockSession = (overrides = {}) => ({
  access_token: 'test-access-token',
  refresh_token: 'test-refresh-token',
  expires_in: 3600,
  token_type: 'bearer',
  user: createMockUser(),
  ...overrides
})

export const createMockSubscription = (overrides = {}) => ({
  id: 'sub_test',
  status: 'active',
  current_period_end: Math.floor(Date.now() / 1000) + 86400,
  cancel_at_period_end: false,
  items: {
    data: [{
      id: 'si_test',
      price: {
        id: 'price_test',
        unit_amount: 1000,
        currency: 'usd',
        recurring: {
          interval: 'month'
        }
      }
    }]
  },
  ...overrides
})

export const createMockCheckoutSession = (overrides = {}) => ({
  id: 'cs_test',
  url: 'https://checkout.stripe.com/test',
  status: 'open',
  ...overrides
})

export const createMockPortalSession = (overrides = {}) => ({
  id: 'ps_test',
  url: 'https://billing.stripe.com/test',
  ...overrides
})

export const createMockAIResponse = (overrides = {}) => ({
  id: 'chatcmpl_test',
  object: 'chat.completion',
  created: Math.floor(Date.now() / 1000),
  model: 'gpt-3.5-turbo',
  choices: [{
    index: 0,
    message: {
      role: 'assistant',
      content: 'This is a test AI response explaining the topic in simple terms.'
    },
    finish_reason: 'stop'
  }],
  usage: {
    prompt_tokens: 50,
    completion_tokens: 100,
    total_tokens: 150
  },
  ...overrides
})

// Mock data factories
export const mockData = {
  user: createMockUser,
  session: createMockSession,
  subscription: createMockSubscription,
  checkoutSession: createMockCheckoutSession,
  portalSession: createMockPortalSession,
  aiResponse: createMockAIResponse
}

// Utility functions for testing
export const waitFor = (condition: () => boolean, timeout = 1000): Promise<void> => {
  return new Promise((resolve, reject) => {
    const startTime = Date.now()
    
    const check = () => {
      if (condition()) {
        resolve()
      } else if (Date.now() - startTime > timeout) {
        reject(new Error('Timeout waiting for condition'))
      } else {
        setTimeout(check, 10)
      }
    }
    
    check()
  })
}

export const mockFetchResponse = (response: any, status = 200) => {
  vi.mocked(fetch).mockResolvedValue({
    ok: status < 400,
    status,
    json: async () => response,
    text: async () => JSON.stringify(response),
    headers: new Headers(),
    statusText: status < 400 ? 'OK' : 'Error'
  } as Response)
}

export const mockFetchError = (error: string, status = 500) => {
  vi.mocked(fetch).mockRejectedValue(new Error(error))
}

// Setup global test environment
Object.defineProperty(global, 'IS_REACT_ACT_ENVIRONMENT', {
  value: true
})

// Export test environment
export const testEnv = {
  isTest: true,
  isDevelopment: false,
  isProduction: false
}

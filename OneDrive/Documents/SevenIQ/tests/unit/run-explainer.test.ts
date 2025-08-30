import { describe, it, expect, vi, beforeEach } from 'vitest'
import { runExplainer } from '@/src/server-actions/run-explainer'

// Mock the usage module
vi.mock('@/lib/usage', () => ({
  getRunCount: vi.fn(),
  incrementRunCount: vi.fn()
}))

// Mock the auth context
vi.mock('@/lib/auth-context', () => ({
  getCurrentUser: vi.fn()
}))

// Mock Supabase
vi.mock('@/lib/supabase', () => ({
  createClient: () => ({
    from: vi.fn(() => ({
      select: vi.fn(() => ({
        eq: vi.fn(() => ({
          single: vi.fn(),
          maybeSingle: vi.fn()
        }))
      })),
      insert: vi.fn()
    }))
  })
}))

// Mock OpenAI
vi.mock('openai', () => ({
  OpenAI: vi.fn().mockImplementation(() => ({
    chat: {
      completions: {
        create: vi.fn().mockResolvedValue({
          choices: [
            {
              message: {
                content: 'This is a test explanation'
              }
            }
          ]
        })
      }
    }
  }))
}))

describe('run-explainer logic', () => {
  const mockGetRunCount = vi.mocked(require('@/lib/usage').getRunCount)
  const mockGetCurrentUser = vi.mocked(require('@/lib/auth-context').getCurrentUser)

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('allows <3 runs for free users', async () => {
    mockGetRunCount.mockResolvedValue(2)
    mockGetCurrentUser.mockResolvedValue({
      id: 'user-1',
      email: 'test@example.com',
      pro: false
    })

    const result = await runExplainer('test input', 'simple')
    
    expect(result.success).toBe(true)
    expect(result.gated).toBe(false)
  })

  it('gates at 3 runs for free users', async () => {
    mockGetRunCount.mockResolvedValue(3)
    mockGetCurrentUser.mockResolvedValue({
      id: 'user-1',
      email: 'test@example.com',
      pro: false
    })

    const result = await runExplainer('test input', 'simple')
    
    expect(result.success).toBe(false)
    expect(result.gated).toBe(true)
    expect(result.message).toContain('upgrade')
  })

  it('allows unlimited runs if pro=true regardless of count', async () => {
    mockGetRunCount.mockResolvedValue(10)
    mockGetCurrentUser.mockResolvedValue({
      id: 'user-1',
      email: 'test@example.com',
      pro: true
    })

    const result = await runExplainer('test input', 'simple')
    
    expect(result.success).toBe(true)
    expect(result.gated).toBe(false)
  })

  it('allows unlimited runs if pro=true at 0 count', async () => {
    mockGetRunCount.mockResolvedValue(0)
    mockGetCurrentUser.mockResolvedValue({
      id: 'user-1',
      email: 'test@example.com',
      pro: true
    })

    const result = await runExplainer('test input', 'simple')
    
    expect(result.success).toBe(true)
    expect(result.gated).toBe(false)
  })

  it('handles unauthenticated users correctly', async () => {
    mockGetRunCount.mockResolvedValue(2)
    mockGetCurrentUser.mockResolvedValue(null)

    const result = await runExplainer('test input', 'simple')
    
    expect(result.success).toBe(false)
    expect(result.message).toContain('authentication')
  })

  it('validates input before processing', async () => {
    mockGetCurrentUser.mockResolvedValue({
      id: 'user-1',
      email: 'test@example.com',
      pro: false
    })

    // Test empty input
    const emptyResult = await runExplainer('', 'simple')
    expect(emptyResult.success).toBe(false)
    expect(emptyResult.message).toContain('input')

    // Test oversized input
    const oversizedInput = 'a'.repeat(10001)
    const oversizedResult = await runExplainer(oversizedInput, 'simple')
    expect(oversizedResult.success).toBe(false)
    expect(oversizedResult.message).toContain('length')
  })
})

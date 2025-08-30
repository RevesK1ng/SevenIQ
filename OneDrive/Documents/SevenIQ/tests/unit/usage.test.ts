import { describe, it, expect, vi, beforeEach } from 'vitest'
import { getRunCount, incrementRunCount } from '@/lib/usage'

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
      upsert: vi.fn(() => ({
        select: vi.fn()
      }))
    }))
  })
}))

describe('usage module', () => {
  const mockSupabase = require('@/lib/supabase').createClient()

  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('getRunCount', () => {
    it('returns accurate count for existing user', async () => {
      mockSupabase.from().select().eq().single.mockResolvedValue({
        data: { run_count: 5 },
        error: null
      })

      const count = await getRunCount('user-123')
      
      expect(count).toBe(5)
      expect(mockSupabase.from).toHaveBeenCalledWith('usage')
      expect(mockSupabase.from().select).toHaveBeenCalledWith('run_count')
    })

    it('returns 0 for new user with no usage record', async () => {
      mockSupabase.from().select().eq().single.mockResolvedValue({
        data: null,
        error: { code: 'PGRST116' } // No rows returned
      })

      const count = await getRunCount('user-123')
      
      expect(count).toBe(0)
    })

    it('handles database errors gracefully', async () => {
      mockSupabase.from().select().eq().single.mockResolvedValue({
        data: null,
        error: { message: 'Database connection failed' }
      })

      const count = await getRunCount('user-123')
      
      expect(count).toBe(0)
    })

    it('returns 0 for null user_id', async () => {
      const count = await getRunCount(null)
      
      expect(count).toBe(0)
      expect(mockSupabase.from).not.toHaveBeenCalled()
    })
  })

  describe('incrementRunCount', () => {
    it('increments count for existing user', async () => {
      mockSupabase.from().upsert().select.mockResolvedValue({
        data: { run_count: 6 },
        error: null
      })

      const result = await incrementRunCount('user-123')
      
      expect(result.success).toBe(true)
      expect(result.newCount).toBe(6)
      expect(mockSupabase.from).toHaveBeenCalledWith('usage')
    })

    it('creates new usage record for first-time user', async () => {
      mockSupabase.from().upsert().select.mockResolvedValue({
        data: { run_count: 1 },
        error: null
      })

      const result = await incrementRunCount('user-123')
      
      expect(result.success).toBe(true)
      expect(result.newCount).toBe(1)
    })

    it('handles database errors during increment', async () => {
      mockSupabase.from().upsert().select.mockResolvedValue({
        data: null,
        error: { message: 'Insert failed' }
      })

      const result = await incrementRunCount('user-123')
      
      expect(result.success).toBe(false)
      expect(result.error).toContain('Failed to increment')
    })

    it('returns error for null user_id', async () => {
      const result = await incrementRunCount(null)
      
      expect(result.success).toBe(false)
      expect(result.error).toContain('User ID required')
      expect(mockSupabase.from).not.toHaveBeenCalled()
    })

    it('maintains data integrity across multiple increments', async () => {
      // First increment
      mockSupabase.from().upsert().select.mockResolvedValueOnce({
        data: { run_count: 1 },
        error: null
      })

      // Second increment
      mockSupabase.from().upsert().select.mockResolvedValueOnce({
        data: { run_count: 2 },
        error: null
      })

      const result1 = await incrementRunCount('user-123')
      const result2 = await incrementRunCount('user-123')
      
      expect(result1.success).toBe(true)
      expect(result1.newCount).toBe(1)
      expect(result2.success).toBe(true)
      expect(result2.newCount).toBe(2)
    })
  })

  describe('integration scenarios', () => {
    it('accurately tracks user progression through free tier', async () => {
      // Simulate user starting with 0 runs
      mockSupabase.from().select().eq().single.mockResolvedValueOnce({
        data: null,
        error: { code: 'PGRST116' }
      })

      let count = await getRunCount('user-123')
      expect(count).toBe(0)

      // First run
      mockSupabase.from().upsert().select.mockResolvedValueOnce({
        data: { run_count: 1 },
        error: null
      })

      const result1 = await incrementRunCount('user-123')
      expect(result1.newCount).toBe(1)

      // Check count after first run
      mockSupabase.from().select().eq().single.mockResolvedValueOnce({
        data: { run_count: 1 },
        error: null
      })

      count = await getRunCount('user-123')
      expect(count).toBe(1)

      // Second run
      mockSupabase.from().upsert().select.mockResolvedValueOnce({
        data: { run_count: 2 },
        error: null
      })

      const result2 = await incrementRunCount('user-123')
      expect(result2.newCount).toBe(2)

      // Third run (should still be allowed)
      mockSupabase.from().upsert().select.mockResolvedValueOnce({
        data: { run_count: 3 },
        error: null
      })

      const result3 = await incrementRunCount('user-123')
      expect(result3.newCount).toBe(3)
    })
  })
})

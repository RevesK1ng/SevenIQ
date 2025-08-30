import { describe, it, expect, vi, beforeEach } from 'vitest'
import { POST } from '@/app/api/explain/route'
import { NextRequest } from 'next/server'

// Mock the model
vi.mock('@/lib/model', () => ({
  runModel: vi.fn()
}))

// Mock the usage tracking
vi.mock('@/lib/usage', () => ({
  trackUsageEvent: vi.fn()
}))

describe('Explain API Route', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  const createMockRequest = (body: any): NextRequest => {
    return {
      json: vi.fn().mockResolvedValue(body)
    } as any
  }

  describe('Input Validation', () => {
    it('should reject requests without text or URL', async () => {
      const request = createMockRequest({ mode: 'child' })
      const response = await POST(request)
      const data = await response.json()
      
      expect(response.status).toBe(400)
      expect(data.error).toBe('Missing required fields')
    })

    it('should reject requests without mode', async () => {
      const request = createMockRequest({ text: 'Test problem' })
      const response = await POST(request)
      const data = await response.json()
      
      expect(response.status).toBe(400)
      expect(data.error).toBe('Missing required fields')
    })

    it('should reject invalid explanation modes', async () => {
      const request = createMockRequest({ text: 'Test problem', mode: 'invalid' })
      const response = await POST(request)
      const data = await response.json()
      
      expect(response.status).toBe(400)
      expect(data.error).toBe('Invalid explanation mode')
    })

    it('should accept valid requests', async () => {
      const mockModel = await import('@/lib/model')
      vi.mocked(mockModel.runModel).mockResolvedValue({
        explanation: 'Test explanation',
        mode: 'child',
        timestamp: new Date(),
        wordCount: 5,
        answer: 'Test answer',
        confidence: 0.9,
        method: 'Test method'
      })

      const request = createMockRequest({ text: 'Test problem', mode: 'child' })
      const response = await POST(request)
      
      expect(response.status).toBe(200)
    })
  })

  describe('Model Integration', () => {
    it('should call runModel with correct parameters', async () => {
      const mockModel = await import('@/lib/model')
      vi.mocked(mockModel.runModel).mockResolvedValue({
        explanation: 'Test explanation',
        mode: 'child',
        timestamp: new Date(),
        wordCount: 5,
        answer: 'Test answer',
        confidence: 0.9,
        method: 'Test method'
      })

      const request = createMockRequest({ text: 'Test problem', mode: 'ceo' })
      await POST(request)

      expect(mockModel.runModel).toHaveBeenCalledWith({
        text: 'Test problem',
        mode: 'ceo'
      })
    })

    it('should handle model failures gracefully', async () => {
      const mockModel = await import('@/lib/model')
      vi.mocked(mockModel.runModel).mockResolvedValue({
        explanation: '',
        mode: 'child',
        timestamp: new Date(),
        wordCount: 0
      })

      const request = createMockRequest({ text: 'Test problem', mode: 'child' })
      const response = await POST(request)
      const data = await response.json()
      
      expect(response.status).toBe(500)
      expect(data.error).toBe('Failed to generate explanation')
    })
  })

  describe('Usage Tracking', () => {
    it('should track usage for logged-in users', async () => {
      const mockModel = await import('@/lib/model')
      const mockUsage = await import('@/lib/usage')
      
      vi.mocked(mockModel.runModel).mockResolvedValue({
        explanation: 'Test explanation',
        mode: 'child',
        timestamp: new Date(),
        wordCount: 5,
        answer: 'Test answer',
        confidence: 0.9,
        method: 'Test method'
      })

      const request = createMockRequest({ 
        text: 'Test problem', 
        mode: 'child',
        userId: 'test-user-id'
      })
      
      await POST(request)

      expect(mockUsage.trackUsageEvent).toHaveBeenCalledWith(
        'test-user-id',
        'explainer_run',
        expect.objectContaining({
          mode: 'child',
          problemText: 'Test problem',
          hasAnswer: true,
          confidence: 0.9,
          method: 'Test method',
          success: true
        })
      )
    })

    it('should not track usage for demo users', async () => {
      const mockModel = await import('@/lib/model')
      const mockUsage = await import('@/lib/usage')
      
      vi.mocked(mockModel.runModel).mockResolvedValue({
        explanation: 'Test explanation',
        mode: 'child',
        timestamp: new Date(),
        wordCount: 5,
        answer: 'Test answer',
        confidence: 0.9,
        method: 'Test method'
      })

      const request = createMockRequest({ 
        text: 'Test problem', 
        mode: 'child',
        userId: 'demo-user'
      })
      
      await POST(request)

      expect(mockUsage.trackUsageEvent).not.toHaveBeenCalled()
    })

    it('should not track usage for anonymous users', async () => {
      const mockModel = await import('@/lib/model')
      const mockUsage = await import('@/lib/usage')
      
      vi.mocked(mockModel.runModel).mockResolvedValue({
        explanation: 'Test explanation',
        mode: 'child',
        timestamp: new Date(),
        wordCount: 5,
        answer: 'Test answer',
        confidence: 0.9,
        method: 'Test method'
      })

      const request = createMockRequest({ 
        text: 'Test problem', 
        mode: 'child',
        isAnonymous: true
      })
      
      await POST(request)

      expect(mockUsage.trackUsageEvent).not.toHaveBeenCalled()
    })
  })

  describe('Response Format', () => {
    it('should return all required fields', async () => {
      const mockModel = await import('@/lib/model')
      vi.mocked(mockModel.runModel).mockResolvedValue({
        explanation: 'Test explanation',
        mode: 'child',
        timestamp: new Date(),
        wordCount: 5,
        answer: 'Test answer',
        confidence: 0.9,
        method: 'Test method'
      })

      const request = createMockRequest({ text: 'Test problem', mode: 'child' })
      const response = await POST(request)
      const data = await response.json()
      
      expect(data).toMatchObject({
        explanation: 'Test explanation',
        mode: 'child',
        readingTime: expect.any(Number),
        timestamp: expect.any(String),
        id: expect.any(String),
        wordCount: expect.any(Number),
        answer: 'Test answer',
        confidence: 0.9,
        method: 'Test method'
      })
    })

    it('should calculate reading time correctly', async () => {
      const mockModel = await import('@/lib/model')
      vi.mocked(mockModel.runModel).mockResolvedValue({
        explanation: 'This is a test explanation with exactly ten words for testing purposes',
        mode: 'child',
        timestamp: new Date(),
        wordCount: 10,
        answer: 'Test answer',
        confidence: 0.9,
        method: 'Test method'
      })

      const request = createMockRequest({ text: 'Test problem', mode: 'child' })
      const response = await POST(request)
      const data = await response.json()
      
      // 10 words / 200 words per minute = 0.05 minutes = 1 minute (ceiled)
      expect(data.readingTime).toBe(1)
    })
  })

  describe('Error Handling', () => {
    it('should handle model errors gracefully', async () => {
      const mockModel = await import('@/lib/model')
      vi.mocked(mockModel.runModel).mockRejectedValue(new Error('Model error'))

      const request = createMockRequest({ text: 'Test problem', mode: 'child' })
      const response = await POST(request)
      const data = await response.json()
      
      expect(response.status).toBe(500)
      expect(data.error).toBe('Failed to generate explanation')
    })

    it('should not fail request if usage tracking fails', async () => {
      const mockModel = await import('@/lib/model')
      const mockUsage = await import('@/lib/usage')
      
      vi.mocked(mockModel.runModel).mockResolvedValue({
        explanation: 'Test explanation',
        mode: 'child',
        timestamp: new Date(),
        wordCount: 5,
        answer: 'Test answer',
        confidence: 0.9,
        method: 'Test method'
      })

      vi.mocked(mockUsage.trackUsageEvent).mockRejectedValue(new Error('Tracking error'))

      const request = createMockRequest({ 
        text: 'Test problem', 
        mode: 'child',
        userId: 'test-user-id'
      })
      
      const response = await POST(request)
      
      // Should still succeed even if tracking fails
      expect(response.status).toBe(200)
    })
  })
})

import { describe, it, expect, vi, beforeEach } from 'vitest'
import { POST } from '@/app/api/webhooks/stripe/route'

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
      update: vi.fn(() => ({
        eq: vi.fn(() => ({
          single: vi.fn()
        }))
      })),
      delete: vi.fn()
    }))
  })
}))

// Mock Stripe
vi.mock('stripe', () => ({
  default: vi.fn().mockImplementation(() => ({
    webhooks: {
      constructEvent: vi.fn()
    }
  }))
}))

describe('Stripe webhook handlers', () => {
  const mockSupabase = require('@/lib/supabase').createClient()
  const mockStripe = require('stripe').default

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('toggles profile to pro=true for completed subscription events', async () => {
    const mockEvent = {
      type: 'customer.subscription.created',
      data: {
        object: {
          id: 'sub_123',
          customer: 'cus_123',
          status: 'active',
          metadata: {
            user_id: 'user-123'
          }
        }
      }
    }

    mockStripe.webhooks.constructEvent.mockReturnValue(mockEvent)
    mockSupabase.from().select().eq().single.mockResolvedValue({
      data: { id: 'user-123', email: 'test@example.com' }
    })
    mockSupabase.from().update().eq().single.mockResolvedValue({
      data: { id: 'user-123', pro: true }
    })

    const request = new Request('http://localhost:3000/api/webhooks/stripe', {
      method: 'POST',
      headers: {
        'stripe-signature': 'test-signature'
      },
      body: JSON.stringify(mockEvent)
    })

    const response = await POST(request)
    const data = await response.json()

    expect(response.status).toBe(200)
    expect(data.success).toBe(true)
    expect(mockSupabase.from).toHaveBeenCalledWith('profiles')
    expect(mockSupabase.from().update).toHaveBeenCalledWith({ pro: true })
  })

  it('toggles profile to pro=false for deleted subscription events', async () => {
    const mockEvent = {
      type: 'customer.subscription.deleted',
      data: {
        object: {
          id: 'sub_123',
          customer: 'cus_123',
          status: 'canceled',
          metadata: {
            user_id: 'user-123'
          }
        }
      }
    }

    mockStripe.webhooks.constructEvent.mockReturnValue(mockEvent)
    mockSupabase.from().select().eq().single.mockResolvedValue({
      data: { id: 'user-123', email: 'test@example.com' }
    })
    mockSupabase.from().update().eq().single.mockResolvedValue({
      data: { id: 'user-123', pro: false }
    })

    const request = new Request('http://localhost:3000/api/webhooks/stripe', {
      method: 'POST',
      headers: {
        'stripe-signature': 'test-signature'
      },
      body: JSON.stringify(mockEvent)
    })

    const response = await POST(request)
    const data = await response.json()

    expect(response.status).toBe(200)
    expect(data.success).toBe(true)
    expect(mockSupabase.from).toHaveBeenCalledWith('profiles')
    expect(mockSupabase.from().update).toHaveBeenCalledWith({ pro: false })
  })

  it('handles updated subscription events correctly', async () => {
    const mockEvent = {
      type: 'customer.subscription.updated',
      data: {
        object: {
          id: 'sub_123',
          customer: 'cus_123',
          status: 'past_due',
          metadata: {
            user_id: 'user-123'
          }
        }
      }
    }

    mockStripe.webhooks.constructEvent.mockReturnValue(mockEvent)
    mockSupabase.from().select().eq().single.mockResolvedValue({
      data: { id: 'user-123', email: 'test@example.com' }
    })
    mockSupabase.from().update().eq().single.mockResolvedValue({
      data: { id: 'user-123', pro: false }
    })

    const request = new Request('http://localhost:3000/api/webhooks/stripe', {
      method: 'POST',
      headers: {
        'stripe-signature': 'test-signature'
      },
      body: JSON.stringify(mockEvent)
    })

    const response = await POST(request)
    const data = await response.json()

    expect(response.status).toBe(200)
    expect(data.success).toBe(true)
  })

  it('returns 400 for invalid webhook signature', async () => {
    mockStripe.webhooks.constructEvent.mockImplementation(() => {
      throw new Error('Invalid signature')
    })

    const request = new Request('http://localhost:3000/api/webhooks/stripe', {
      method: 'POST',
      headers: {
        'stripe-signature': 'invalid-signature'
      },
      body: '{}'
    })

    const response = await POST(request)
    expect(response.status).toBe(400)
  })

  it('handles missing user_id metadata gracefully', async () => {
    const mockEvent = {
      type: 'customer.subscription.created',
      data: {
        object: {
          id: 'sub_123',
          customer: 'cus_123',
          status: 'active',
          metadata: {}
        }
      }
    }

    mockStripe.webhooks.constructEvent.mockReturnValue(mockEvent)

    const request = new Request('http://localhost:3000/api/webhooks/stripe', {
      method: 'POST',
      headers: {
        'stripe-signature': 'test-signature'
      },
      body: JSON.stringify(mockEvent)
    })

    const response = await POST(request)
    expect(response.status).toBe(400)
  })
})

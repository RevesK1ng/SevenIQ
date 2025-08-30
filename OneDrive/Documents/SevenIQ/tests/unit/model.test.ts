import { describe, it, expect, vi, beforeEach } from 'vitest'
import { runModel, getModeDescription, getModeIcon, ExplanationMode } from '@/lib/model'

// Mock the problem solver
vi.mock('@/lib/problem-solver', () => ({
  problemSolver: {
    solve: vi.fn()
  }
}))

// Mock OpenAI
vi.mock('openai', () => ({
  default: vi.fn().mockImplementation(() => ({
    chat: {
      completions: {
        create: vi.fn()
      }
    }
  }))
}))

describe('Model', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('runModel', () => {
    it('should solve problem first, then generate explanation', async () => {
      const mockProblemSolver = await import('@/lib/problem-solver')
      const mockOpenAI = await import('openai')
      
      // Mock problem solver response
      vi.mocked(mockProblemSolver.problemSolver.solve).mockResolvedValue({
        success: true,
        solution: {
          problem: 'What is 2 + 2?',
          answer: '4',
          confidence: 0.95,
          method: 'Mathematical evaluation'
        }
      })

      // Mock OpenAI response
      vi.mocked(mockOpenAI.default).mockImplementation(() => ({
        chat: {
          completions: {
            create: vi.fn().mockResolvedValue({
              choices: [{ message: { content: 'The answer is: 4\n\nHere is a simple explanation...' } }]
            })
          }
        }
      }))

      const result = await runModel({
        text: 'What is 2 + 2?',
        mode: 'child'
      })

      expect(result.answer).toBe('4')
      expect(result.confidence).toBe(0.95)
      expect(result.method).toBe('Mathematical evaluation')
      expect(result.explanation).toContain('The answer is: 4')
    })

    it('should handle problem solver failures gracefully', async () => {
      const mockProblemSolver = await import('@/lib/problem-solver')
      
      vi.mocked(mockProblemSolver.problemSolver.solve).mockResolvedValue({
        success: false,
        error: 'Failed to solve problem'
      })

      const result = await runModel({
        text: 'Invalid problem',
        mode: 'child'
      })

      expect(result.explanation).toContain('The answer is:')
      expect(result.answer).toBeDefined()
    })

    it('should use correct system prompts for each mode', async () => {
      const mockProblemSolver = await import('@/lib/problem-solver')
      const mockOpenAI = await import('openai')
      
      vi.mocked(mockProblemSolver.problemSolver.solve).mockResolvedValue({
        success: true,
        solution: {
          problem: 'Test problem',
          answer: 'Test answer',
          confidence: 0.9,
          method: 'Test method'
        }
      })

      const mockCreate = vi.fn().mockResolvedValue({
        choices: [{ message: { content: 'The answer is: Test answer\n\nExplanation...' } }]
      })

      vi.mocked(mockOpenAI.default).mockImplementation(() => ({
        chat: {
          completions: {
            create: mockCreate
          }
        }
      }))

      // Test child mode
      await runModel({ text: 'Test', mode: 'child' })
      expect(mockCreate).toHaveBeenCalledWith(
        expect.objectContaining({
          messages: expect.arrayContaining([
            expect.objectContaining({
              content: expect.stringContaining('5-year-old')
            })
          ])
        })
      )

      // Test CEO mode
      await runModel({ text: 'Test', mode: 'ceo' })
      expect(mockCreate).toHaveBeenCalledWith(
        expect.objectContaining({
          messages: expect.arrayContaining([
            expect.objectContaining({
              content: expect.stringContaining('busy executives')
            })
          ])
        })
      )
    })

    it('should fallback to mock response when OpenAI fails', async () => {
      const mockProblemSolver = await import('@/lib/problem-solver')
      const mockOpenAI = await import('openai')
      
      vi.mocked(mockProblemSolver.problemSolver.solve).mockResolvedValue({
        success: true,
        solution: {
          problem: 'Test problem',
          answer: 'Test answer',
          confidence: 0.9,
          method: 'Test method'
        }
      })

      vi.mocked(mockOpenAI.default).mockImplementation(() => ({
        chat: {
          completions: {
            create: vi.fn().mockRejectedValue(new Error('OpenAI API error'))
          }
        }
      }))

      const result = await runModel({
        text: 'Test problem',
        mode: 'child'
      })

      expect(result.explanation).toContain('The answer is: Test answer')
      expect(result.answer).toBe('Test answer')
    })
  })

  describe('Mode Descriptions', () => {
    it('should return correct descriptions for all modes', () => {
      expect(getModeDescription('child')).toContain('Simple and friendly')
      expect(getModeDescription('grandma')).toContain('Warm and patient')
      expect(getModeDescription('ceo')).toContain('Concise and strategic')
      expect(getModeDescription('technical')).toContain('Detailed technical')
    })
  })

  describe('Mode Icons', () => {
    it('should return correct icons for all modes', () => {
      expect(getModeIcon('child')).toBe('👶')
      expect(getModeIcon('grandma')).toBe('👵')
      expect(getModeIcon('ceo')).toBe('💼')
      expect(getModeIcon('technical')).toBe('⚙️')
    })
  })

  describe('Answer Formatting', () => {
    it('should always start explanations with "The answer is:"', async () => {
      const mockProblemSolver = await import('@/lib/problem-solver')
      
      vi.mocked(mockProblemSolver.problemSolver.solve).mockResolvedValue({
        success: true,
        solution: {
          problem: 'Test',
          answer: 'Test Answer',
          confidence: 0.9,
          method: 'Test'
        }
      })

      const result = await runModel({
        text: 'Test',
        mode: 'child'
      })

      expect(result.explanation).toMatch(/^The answer is: Test Answer/i)
    })
  })

  describe('Confidence and Method Tracking', () => {
    it('should preserve confidence and method from problem solver', async () => {
      const mockProblemSolver = await import('@/lib/problem-solver')
      
      vi.mocked(mockProblemSolver.problemSolver.solve).mockResolvedValue({
        success: true,
        solution: {
          problem: 'Test',
          answer: 'Test Answer',
          confidence: 0.87,
          method: 'Special Analysis Method'
        }
      })

      const result = await runModel({
        text: 'Test',
        mode: 'technical'
      })

      expect(result.confidence).toBe(0.87)
      expect(result.method).toBe('Special Analysis Method')
    })
  })
})

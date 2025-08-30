import { describe, it, expect } from 'vitest'
import { problemSolver, ProblemSolution } from '@/lib/problem-solver'

describe('ProblemSolver', () => {
  describe('Math Problems', () => {
    it('should identify basic arithmetic problems', async () => {
      const result = await problemSolver.solve('What is 2 + 2?')
      expect(result.success).toBe(true)
      expect(result.solution?.method).toBe('Mathematical evaluation')
    })

    it('should solve simple addition', async () => {
      const result = await problemSolver.solve('Calculate 15 + 27')
      expect(result.success).toBe(true)
      expect(result.solution?.answer).toBe('42')
    })

    it('should solve multiplication', async () => {
      const result = await problemSolver.solve('What is 6 * 8?')
      expect(result.success).toBe(true)
      expect(result.solution?.answer).toBe('48')
    })

    it('should handle complex expressions', async () => {
      const result = await problemSolver.solve('Solve 10 + 5 * 2')
      expect(result.success).toBe(true)
      expect(result.solution?.method).toBe('Mathematical evaluation')
    })
  })

  describe('Code Problems', () => {
    it('should identify bug-related problems', async () => {
      const result = await problemSolver.solve('I have a bug in my code')
      expect(result.success).toBe(true)
      expect(result.solution?.method).toBe('Code analysis and debugging')
      expect(result.solution?.confidence).toBeGreaterThan(0.7)
    })

    it('should identify optimization problems', async () => {
      const result = await problemSolver.solve('How can I optimize this function?')
      expect(result.success).toBe(true)
      expect(result.solution?.method).toBe('Code analysis and debugging')
      expect(result.solution?.confidence).toBeGreaterThan(0.8)
    })

    it('should handle general code issues', async () => {
      const result = await problemSolver.solve('My program is not working')
      expect(result.success).toBe(true)
      expect(result.solution?.method).toBe('Code analysis and debugging')
    })
  })

  describe('Logic Problems', () => {
    it('should identify conditional logic problems', async () => {
      const result = await problemSolver.solve('If A is true, then what happens?')
      expect(result.success).toBe(true)
      expect(result.solution?.method).toBe('Logical reasoning analysis')
      expect(result.solution?.confidence).toBeGreaterThan(0.7)
    })

    it('should identify boolean logic problems', async () => {
      const result = await problemSolver.solve('Is this statement true or false?')
      expect(result.success).toBe(true)
      expect(result.solution?.method).toBe('Logical reasoning analysis')
      expect(result.solution?.confidence).toBeGreaterThan(0.8)
    })
  })

  describe('General Problems', () => {
    it('should handle explanatory questions', async () => {
      const result = await problemSolver.solve('How does photosynthesis work?')
      expect(result.success).toBe(true)
      expect(result.solution?.method).toBe('General problem analysis')
    })

    it('should handle causal questions', async () => {
      const result = await problemSolver.solve('Why does the sky appear blue?')
      expect(result.success).toBe(true)
      expect(result.solution?.method).toBe('General problem analysis')
    })
  })

  describe('Error Handling', () => {
    it('should handle empty input gracefully', async () => {
      const result = await problemSolver.solve('')
      expect(result.success).toBe(false)
      expect(result.error).toBeDefined()
    })

    it('should handle very long input', async () => {
      const longInput = 'a'.repeat(10000)
      const result = await problemSolver.solve(longInput)
      expect(result.success).toBe(true)
    })
  })

  describe('Solution Quality', () => {
    it('should provide solutions with confidence scores', async () => {
      const result = await problemSolver.solve('What is 5 + 3?')
      expect(result.success).toBe(true)
      expect(result.solution?.confidence).toBeGreaterThan(0.8)
      expect(result.solution?.confidence).toBeLessThanOrEqual(1.0)
    })

    it('should provide method descriptions', async () => {
      const result = await problemSolver.solve('Debug this code')
      expect(result.success).toBe(true)
      expect(result.solution?.method).toBeDefined()
      expect(result.solution?.method.length).toBeGreaterThan(0)
    })
  })
})

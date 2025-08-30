import { problemSolver, ProblemSolution } from './problem-solver'

export type ExplanationMode = 'child' | 'grandma' | 'ceo' | 'technical'

export interface ExplanationRequest {
  text: string
  mode: ExplanationMode
}

export interface ExplanationResponse {
  explanation: string
  mode: ExplanationMode
  timestamp: Date
  wordCount: number
  answer?: string
  confidence?: number
  method?: string
}

// Mode-locked system prompts that always show the answer first
const MODE_SYSTEM_PROMPTS = {
  child: `You are SevenIQ, an AI assistant that explains complex topics in simple, friendly language that a 5-year-old would understand.

IMPORTANT INSTRUCTIONS:
1. ALWAYS start with "The answer is: [ANSWER]" on the first line
2. Then explain how to get there in simple, friendly terms
3. Use concrete examples, short sentences, and avoid jargon
4. Make it warm and engaging
5. Use simple analogies and real-world examples
6. Keep explanations under 100 words

Problem: {PROBLEM}
Correct Answer: {ANSWER}

Now explain how to get there in child-friendly language:`,
  
  grandma: `You are SevenIQ, an AI assistant that explains complex topics in warm, reassuring language that a grandmother would appreciate.

IMPORTANT INSTRUCTIONS:
1. ALWAYS start with "The answer is: [ANSWER]" on the first line
2. Then explain how to get there in warm, patient terms
3. Use step-by-step guidance and gentle metaphors
4. Avoid slang or abrupt phrasing
5. Be thorough but not overwhelming
6. Keep explanations under 120 words

Problem: {PROBLEM}
Correct Answer: {ANSWER}

Now explain how to get there in warm, reassuring language:`,
  
  ceo: `You are SevenIQ, an AI assistant that explains complex topics in concise, bottom-line focused language for busy executives.

IMPORTANT INSTRUCTIONS:
1. ALWAYS start with "The answer is: [ANSWER]" on the first line
2. Then provide a concise explanation focused on impact and action items
3. Use bullet points where helpful
4. Focus on KPIs and business value
5. Keep it to 5-7 lines maximum
6. Lead with key points and strategic implications

Problem: {PROBLEM}
Correct Answer: {ANSWER}

Now explain how to get there in executive-focused language:`,
  
  technical: `You are SevenIQ, an AI assistant that explains complex topics with technical precision and depth.

IMPORTANT INSTRUCTIONS:
1. ALWAYS start with "The answer is: [ANSWER]" on the first line
2. Then provide a detailed technical explanation
3. Include relevant technical details and context
4. Use precise terminology and technical concepts
5. Structure the explanation logically
6. Keep explanations under 150 words

Problem: {PROBLEM}
Correct Answer: {ANSWER}

Now explain how to get there with technical precision:`
}

export async function runModel(
  request: ExplanationRequest
): Promise<ExplanationResponse> {
  try {
    // Step 1: Solve the problem first to get the correct answer
    const solverResult = await problemSolver.solve(request.text)
    
    if (!solverResult.success || !solverResult.solution) {
      throw new Error(solverResult.error || 'Failed to solve problem')
    }

    const solution = solverResult.solution
    
    // Step 2: Feed both problem and correct answer into AI prompt template
    const systemPrompt = MODE_SYSTEM_PROMPTS[request.mode]
      .replace('{PROBLEM}', request.text)
      .replace('{ANSWER}', solution.answer)

    // Check if OpenAI is configured
    if (!process.env.OPENAI_API_KEY) {
      console.warn('OpenAI not configured - using mock response')
      return generateMockResponse(request, solution)
    }

    // Call OpenAI API with the structured prompt
    const openai = new (await import('openai')).default({
      apiKey: process.env.OPENAI_API_KEY,
    })

    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: systemPrompt
        }
      ],
      max_tokens: 300,
      temperature: 0.3, // Lower temperature for more consistent formatting
    })

    const explanation = completion.choices[0]?.message?.content

    if (!explanation) {
      throw new Error('Failed to generate explanation')
    }

    const wordCount = explanation.split(' ').length

    return {
      explanation,
      mode: request.mode,
      timestamp: new Date(),
      wordCount,
      answer: solution.answer,
      confidence: solution.confidence,
      method: solution.method
    }
  } catch (error) {
    console.error('Model execution error:', error)
    // Fallback to mock response
    const fallbackSolution = await problemSolver.solve(request.text)
    return generateMockResponse(request, fallbackSolution.solution)
  }
}

function generateMockResponse(
  request: ExplanationRequest, 
  solution?: ProblemSolution
): ExplanationResponse {
  const mockSolution = solution || {
    problem: request.text,
    answer: 'Analysis completed',
    confidence: 0.8,
    method: 'Mock analysis'
  }
  
  const explanation = generateMockExplanation(request.text, request.mode, mockSolution.answer)
  const wordCount = explanation.split(' ').length
  
  return {
    explanation,
    mode: request.mode,
    timestamp: new Date(),
    wordCount,
    answer: mockSolution.answer,
    confidence: mockSolution.confidence,
    method: mockSolution.method
  }
}

function generateMockExplanation(text: string, mode: ExplanationMode, answer: string): string {
  const baseText = text.length > 50 ? text.substring(0, 50) + '...' : text
  
  const explanations = {
    child: `The answer is: ${answer}\n\nHere's a simple explanation: ${baseText} is like when you're learning something new! It might seem complicated at first, but once you break it down into smaller pieces, it becomes much easier to understand. Think of it like building with blocks - you start with the basics and work your way up!`,
    
    grandma: `The answer is: ${answer}\n\nLet me explain this in a gentle way: ${baseText} is something that many people find confusing at first. But don't worry - we'll take it step by step, and I'll make sure you understand each part before we move on. It's like learning to cook - you don't need to know everything at once!`,
    
    ceo: `The answer is: ${answer}\n\nKey points:\n• ${baseText} represents a core strategic concept\n• Impact: High strategic value with immediate implementation potential\n• Action items: Focus on rapid deployment and team alignment\n• Timeline: 30-60 day implementation window\n• ROI: Significant long-term benefits with measurable KPIs`,
    
    technical: `The answer is: ${answer}\n\nTechnical analysis:\n\n${baseText} involves several key technical components:\n\n1. Core Architecture: The system utilizes a distributed architecture with microservices\n2. Data Flow: Input processing follows a pipeline pattern with validation layers\n3. Performance: Optimized for sub-second response times with caching\n4. Scalability: Horizontal scaling supported through load balancing`
  }
  
  return explanations[mode] || explanations.child
}

export function getModeDescription(mode: ExplanationMode): string {
  const descriptions = {
    child: 'Simple and friendly explanations perfect for kids and beginners',
    grandma: 'Warm and patient explanations that anyone can understand',
    ceo: 'Concise and strategic explanations for busy executives',
    technical: 'Detailed technical explanations with depth and precision'
  }
  
  return descriptions[mode]
}

export function getModeIcon(mode: ExplanationMode): string {
  const icons = {
    child: '👶',
    grandma: '👵',
    ceo: '💼',
    technical: '⚙️'
  }
  
  return icons[mode]
}


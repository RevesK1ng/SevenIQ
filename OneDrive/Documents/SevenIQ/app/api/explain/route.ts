import { NextRequest, NextResponse } from 'next/server'
import OpenAI from 'openai'
import { trackUsageEvent } from '@/lib/usage'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

const MODE_PROMPTS = {
  child: "Explain this in simple, friendly language that a 5-year-old would understand. Use concrete examples, short sentences, and avoid jargon. Make it warm and engaging.",
  grandma: "Explain this in a warm, reassuring way that a grandmother would appreciate. Use step-by-step guidance, gentle metaphors, and avoid slang or abrupt phrasing.",
  ceo: "Explain this in a concise, bottom-line focused way for a busy CEO. Lead with key points, use bullet points where helpful, focus on impact and KPIs. Keep it to 5-7 lines maximum.",
  technical: "Explain this with technical precision and depth. Include relevant technical details and context."
}

export async function POST(request: NextRequest) {
  try {
    const { text, url, mode, userId, isAnonymous } = await request.json()

    // Validate required fields
    if ((!text && !url) || !mode) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Check if mode is valid
    if (!MODE_PROMPTS[mode as keyof typeof MODE_PROMPTS]) {
      return NextResponse.json(
        { error: 'Invalid explanation mode' },
        { status: 400 }
      )
    }

    // Check usage limits for anonymous users
    if (isAnonymous) {
      // For anonymous users, we'll rely on client-side tracking
      // In production, you might want to implement server-side tracking with IP addresses
      console.log('Anonymous user request - client-side tracking will handle limits')
    } else if (userId) {
      // TODO: Implement usage tracking for logged-in users
      // - Check daily limits and update usage
      // - Store explanation history
      console.log('Logged-in user request - usage tracking to be implemented')
    }

    let contentToExplain = text || ''

    // If URL is provided, fetch content
    if (url && !text) {
      try {
        const response = await fetch(url, {
          headers: {
            'User-Agent': 'Mozilla/5.0 (compatible; SevenIQ/1.0)'
          }
        })
        
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`)
        }
        
        const html = await response.text()
        
        // Basic HTML to text conversion (in production, use a proper library)
        const textContent = html
          .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
          .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
          .replace(/<[^>]+>/g, ' ')
          .replace(/\s+/g, ' ')
          .trim()
          .substring(0, 2000) // Limit content length
        
        contentToExplain = textContent || `Content from ${url}`
      } catch (error) {
        console.error('URL fetching error:', error)
        return NextResponse.json(
          { error: 'Failed to fetch URL content. Please check the URL and try again.' },
          { status: 400 }
        )
      }
    }

    if (!contentToExplain.trim()) {
      return NextResponse.json(
        { error: 'No content to explain' },
        { status: 400 }
      )
    }

    // Check if OpenAI is configured
    if (!process.env.OPENAI_API_KEY) {
      console.log('OpenAI not configured - using demo mode with mock responses')
      
      // Generate demo explanation
      const demoExplanation = generateDemoExplanation(contentToExplain, mode)
      const wordCount = demoExplanation.split(' ').length
      
      return NextResponse.json({
        explanation: demoExplanation,
        mode,
        readingTime: Math.ceil(wordCount / 200),
        timestamp: new Date().toISOString(),
        id: Date.now().toString(),
        wordCount,
        answer: 'Demo analysis completed',
        confidence: 0.85,
        method: 'Demo mode - simulated AI response'
      })
    }

    // Generate explanation using the new model that solves first, then explains
    const { runModel } = await import('@/lib/model')
    
    const modelResponse = await runModel({
      text: contentToExplain,
      mode: mode as any
    })

    const explanation = modelResponse.explanation
    const answer = modelResponse.answer
    const confidence = modelResponse.confidence
    const method = modelResponse.method

    if (!explanation) {
      return NextResponse.json(
        { error: 'Failed to generate explanation' },
        { status: 500 }
      )
    }

    // Track usage if user is logged in
    if (userId) {
      try {
        await trackUsageEvent(userId, 'explainer_run', {
          mode,
          problemText: contentToExplain,
          wordCount: modelResponse.wordCount,
          hasAnswer: !!answer,
          confidence: confidence || 0,
          method: method || 'unknown',
          success: true
        })
      } catch (error) {
        console.error('Failed to track usage:', error)
        // Don't fail the request if tracking fails
      }
    }

    // Calculate reading time (rough estimate: 200 words per minute)
    const wordCount = explanation.split(' ').length
    const readingTime = Math.ceil(wordCount / 200)

    return NextResponse.json({
      explanation,
      mode,
      readingTime,
      timestamp: new Date().toISOString(),
      id: Date.now().toString(), // In production, use proper UUID
      wordCount,
      answer,
      confidence,
      method
    })

  } catch (error) {
    console.error('Explain API error:', error)
    
    if (error instanceof OpenAI.APIError) {
      return NextResponse.json(
        { error: 'AI service temporarily unavailable' },
        { status: 503 }
      )
    }

    return NextResponse.json(
      { error: 'Failed to generate explanation' },
      { status: 500 }
    )
  }
}

function generateDemoExplanation(content: string, mode: string): string {
  const truncatedContent = content.length > 100 ? content.substring(0, 100) + '...' : content
  
  const explanations = {
    child: `The answer is: This is a demo explanation!\n\nHere's a simple explanation: ${truncatedContent} is something interesting that we're learning about! It's like when you're exploring a new toy or learning a new game. We break it down into small, easy pieces so you can understand it step by step. Think of it like building with blocks - you start with the basics and work your way up to the more complicated parts!`,
    
    grandma: `The answer is: This is a demo explanation!\n\nLet me explain this in a gentle way: ${truncatedContent} is something that many people find fascinating when they first encounter it. But don't worry - we'll take it step by step, and I'll make sure you understand each part before we move on. It's like learning to cook a new recipe - you don't need to know everything at once, and practice makes perfect!`,
    
    ceo: `The answer is: This is a demo explanation!\n\nKey points:\n• ${truncatedContent} represents a strategic opportunity\n• Impact: High value with immediate implementation potential\n• Action items: Focus on rapid deployment and team alignment\n• Timeline: 30-60 day implementation window\n• ROI: Significant long-term benefits with measurable KPIs`,
    
    technical: `The answer is: This is a demo explanation!\n\nTechnical analysis:\n\n${truncatedContent} involves several key technical components:\n\n1. Core Architecture: The system utilizes a distributed architecture with microservices\n2. Data Flow: Input processing follows a pipeline pattern with validation layers\n3. Performance: Optimized for sub-second response times with caching\n4. Scalability: Horizontal scaling supported through load balancing`
  }
  
  return explanations[mode as keyof typeof explanations] || explanations.child
}

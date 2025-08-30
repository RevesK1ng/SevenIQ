import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')
  const next = requestUrl.searchParams.get('next') || '/app'

  if (code) {
    const supabase = createRouteHandlerClient({ cookies })
    
    try {
      const { error } = await supabase.auth.exchangeCodeForSession(code)
      
      if (error) {
        console.error('Auth callback error:', error)
        return NextResponse.redirect(
          new URL(`/auth?error=${encodeURIComponent(error.message)}`, request.url)
        )
      }
      
      // Successful authentication, redirect to the intended page
      return NextResponse.redirect(new URL(next, request.url))
    } catch (error) {
      console.error('Auth callback exception:', error)
      return NextResponse.redirect(
        new URL('/auth?error=Authentication failed', request.url)
      )
    }
  }

  // No code provided, redirect to auth page
  return NextResponse.redirect(new URL('/auth', request.url))
}

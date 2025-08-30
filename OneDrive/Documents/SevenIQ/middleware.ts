import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { config as appConfig } from './lib/config'

export async function middleware(req: NextRequest) {
  const res = NextResponse.next()
  
  // Check if Supabase is configured
  if (!appConfig.features.enableSupabase) {
    // If Supabase is not configured, allow all requests
console.warn('Supabase not configured - authentication disabled')
    return res
  }
  
  let session = null
  try {
    const supabase = createMiddlewareClient({ req, res })
    
    // Refresh session if expired - required for Server Components
    const {
      data: { session: sessionData },
    } = await supabase.auth.getSession()
    session = sessionData
  } catch (error) {
    console.error('Supabase middleware error:', error)
    return res
  }

  // Protected routes that require authentication
  const protectedRoutes = ['/app', '/dashboard', '/billing']
  const isProtectedRoute = protectedRoutes.some(route => 
    req.nextUrl.pathname.startsWith(route)
  )

  // Marketing routes that don't require authentication
  const marketingRoutes = ['/', '/pricing', '/how-it-works', '/changelog', '/auth']
  const isMarketingRoute = marketingRoutes.some(route => 
    req.nextUrl.pathname === route || req.nextUrl.pathname.startsWith(route)
  )

  // If accessing a protected route without authentication, redirect to auth
  if (isProtectedRoute && !session) {
    const redirectUrl = new URL('/auth', req.url)
    redirectUrl.searchParams.set('redirect', req.nextUrl.pathname)
    return NextResponse.redirect(redirectUrl)
  }

  // If accessing auth page while already authenticated, redirect to app
  if (req.nextUrl.pathname === '/auth' && session) {
    const redirectTo = req.nextUrl.searchParams.get('redirect') || '/app'
    return NextResponse.redirect(new URL(redirectTo, req.url))
  }

  // If accessing marketing pages while authenticated, allow but don't redirect
  if (isMarketingRoute && session) {
    // User is authenticated but accessing marketing pages - this is fine
    return res
  }

  return res
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|public).*)',
  ],
}

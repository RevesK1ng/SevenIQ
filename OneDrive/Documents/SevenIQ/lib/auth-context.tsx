'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { User, Session } from '@supabase/supabase-js'
import { supabase } from './supabase'
import { db } from './supabase'
import { config } from './config'

interface AuthContextType {
  user: User | null
  session: Session | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<{ error: any }>
  signUp: (email: string, password: string) => Promise<{ error: any }>
  signInWithMagicLink: (email: string) => Promise<{ error: any }>
  signOut: () => Promise<void>
  isPremium: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)
  const [isPremium, setIsPremium] = useState(false)

  useEffect(() => {
    // Check if Supabase is configured
    if (!config.features.enableSupabase) {
      console.warn('Supabase not configured - running in demo mode')
      setLoading(false)
      return
    }

    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      setUser(session?.user ?? null)
      if (session?.user) {
        checkPremiumStatus(session.user.id)
      }
      setLoading(false)
    }).catch((error) => {
      console.error('Supabase connection failed:', error)
      setLoading(false)
    })

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      setSession(session)
      setUser(session?.user ?? null)
      if (session?.user) {
        checkPremiumStatus(session.user.id)
      } else {
        setIsPremium(false)
      }
      setLoading(false)
    })

    return () => subscription.unsubscribe()
  }, [])

  const checkPremiumStatus = async (userId: string) => {
    try {
      const userData = await db.getUser(userId)
      setIsPremium(userData?.isPremium || false)
    } catch (error) {
      console.error('Error checking premium status:', error)
      setIsPremium(false)
    }
  }

  const signIn = async (email: string, password: string) => {
    try {
      // Demo mode - create mock user
      if (!config.features.enableSupabase) {
        const mockUser = {
          id: 'demo-user-' + Date.now(),
          email: email,
          user_metadata: { full_name: email.split('@')[0] },
          app_metadata: { provider: 'demo' }
        } as User
        
        const mockSession = {
          user: mockUser,
          access_token: 'demo-token',
          refresh_token: 'demo-refresh',
          expires_at: Date.now() + 3600000
        } as Session
        
        setUser(mockUser)
        setSession(mockSession)
        setIsPremium(false)
        return { error: null }
      }

      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })
      return { error }
    } catch (error) {
      console.error('Sign in failed:', error)
      return { error }
    }
  }

  const signUp = async (email: string, password: string) => {
    try {
      // Demo mode - create mock user
      if (!config.features.enableSupabase) {
        const mockUser = {
          id: 'demo-user-' + Date.now(),
          email: email,
          user_metadata: { full_name: email.split('@')[0] },
          app_metadata: { provider: 'demo' }
        } as User
        
        const mockSession = {
          user: mockUser,
          access_token: 'demo-token',
          refresh_token: 'demo-refresh',
          expires_at: Date.now() + 3600000
        } as Session
        
        setUser(mockUser)
        setSession(mockSession)
        setIsPremium(false)
        return { error: null }
      }

      const { error } = await supabase.auth.signUp({
        email,
        password,
      })
      return { error }
    } catch (error) {
      console.error('Sign up failed:', error)
      return { error }
    }
  }

  const signInWithMagicLink = async (email: string) => {
    try {
      // Demo mode - create mock user
      if (!config.features.enableSupabase) {
        const mockUser = {
          id: 'demo-user-' + Date.now(),
          email: email,
          user_metadata: { full_name: email.split('@')[0] },
          app_metadata: { provider: 'demo' }
        } as User
        
        const mockSession = {
          user: mockUser,
          access_token: 'demo-token',
          refresh_token: 'demo-refresh',
          expires_at: Date.now() + 3600000
        } as Session
        
        setUser(mockUser)
        setSession(mockSession)
        setIsPremium(false)
        return { error: null }
      }

      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback?next=${encodeURIComponent(window.location.pathname)}`,
        },
      })
      return { error }
    } catch (error) {
      console.error('Sign in with magic link failed:', error)
      return { error }
    }
  }

  const signOut = async () => {
    try {
      if (config.features.enableSupabase) {
        await supabase.auth.signOut()
      }
    } catch (error) {
      console.error('Sign out failed:', error)
    }
    // Always clear local state
    setUser(null)
    setSession(null)
    setIsPremium(false)
  }

  const value = {
    user,
    session,
    loading,
    signIn,
    signUp,
    signInWithMagicLink,
    signOut,
    isPremium,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

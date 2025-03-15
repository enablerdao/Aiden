import React, { createContext, useContext, useEffect, useState } from 'react'
import { Session, User } from '@supabase/supabase-js'
import supabase from '../lib/supabase'
import { setAuthToken, clearAuthToken } from '../api'

type AuthContextType = {
  session: Session | null
  user: User | null
  loading: boolean
  signOut: () => Promise<void>
  signIn: (email: string, password: string) => Promise<{ error: Error | null }>
}

// Mock user for development
const mockUser: User = {
  id: 'mock-user-id',
  email: 'test@example.com',
  user_metadata: {
    full_name: 'Test User'
  },
  app_metadata: {},
  aud: 'authenticated',
  created_at: new Date().toISOString(),
  role: 'authenticated',
  updated_at: new Date().toISOString()
}

// Mock session for development
const mockSession = {
  access_token: 'mock-access-token',
  refresh_token: 'mock-refresh-token',
  user: mockUser
} as Session

const AuthContext = createContext<AuthContextType>({
  session: null,
  user: null,
  loading: true,
  signOut: async () => {},
  signIn: async () => ({ error: null }),
})

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [session, setSession] = useState<Session | null>(null)
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  
  // For development, use mock mode
  const useMockAuth = true

  useEffect(() => {
    // Get initial session
    const getInitialSession = async () => {
      try {
        if (useMockAuth) {
          // In mock mode, don't actually call Supabase
          setLoading(false)
          return
        }
        
        const { data: { session } } = await supabase.auth.getSession()
        setSession(session)
        setUser(session?.user ?? null)
        
        // Set auth token for API requests if user is logged in
        if (session?.access_token) {
          setAuthToken(session.access_token)
        }
      } catch (error) {
        console.error('Error getting initial session:', error)
      } finally {
        setLoading(false)
      }
    }

    getInitialSession()

    // Listen for auth changes
    if (!useMockAuth) {
      const { data: { subscription } } = supabase.auth.onAuthStateChange(
        (_event, session) => {
          setSession(session)
          setUser(session?.user ?? null)
          
          // Update auth token for API requests
          if (session?.access_token) {
            setAuthToken(session.access_token)
          } else {
            clearAuthToken()
          }
          
          setLoading(false)
        }
      )

      return () => {
        subscription.unsubscribe()
      }
    }
    
    return () => {}
  }, [])

  const signIn = async (email: string, password: string) => {
    try {
      if (useMockAuth) {
        // Mock authentication for development
        if (email === 'test@example.com' && password === 'password123') {
          setSession(mockSession)
          setUser(mockUser)
          setAuthToken('mock-token')
          return { error: null }
        }
        return { error: new Error('Invalid credentials') }
      }
      
      // Real authentication with Supabase
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password
      })
      
      return { error }
    } catch (error) {
      console.error('Sign in error:', error)
      return { error: error instanceof Error ? error : new Error('Unknown error') }
    }
  }

  const signOut = async () => {
    if (useMockAuth) {
      // Mock sign out
      setSession(null)
      setUser(null)
      clearAuthToken()
      return
    }
    
    // Real sign out with Supabase
    await supabase.auth.signOut()
    clearAuthToken()
  }

  const value = {
    session,
    user,
    loading,
    signOut,
    signIn
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = () => useContext(AuthContext)

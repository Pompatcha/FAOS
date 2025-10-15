'use client'

import { useRouter } from 'next/navigation'
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react'

import type { User } from '@supabase/supabase-js'

import { getUser, getUserProfile } from '@/actions/auth'
import { createClient } from '@/utils/supabase/client'

interface UserProfile {
  id: number | null
  role: string | null
}

interface AuthContextType {
  user: User | null
  userProfile: UserProfile | null
  loading: boolean
  refreshUser: () => Promise<void>
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null)
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [initialized, setInitialized] = useState(false)
  const supabase = createClient()

  const fetchUserProfile = async (userId: string) => {
    try {
      const result = await getUserProfile(userId)
      if (result.success && result.data) {
        return result.data
      }
      return null
    } catch (error) {
      console.error('Error fetching user profile:', error)
      return null
    }
  }

  const refreshUser = useCallback(async () => {
    try {
      const result = await getUser()
      if (result.success && result.data) {
        setUser(result.data)
        const profile = await fetchUserProfile(result.data.id)
        setUserProfile(profile)
      } else {
        setUser(null)
        setUserProfile(null)
      }
    } catch (error) {
      console.error('Error refreshing user:', error)
      setUser(null)
      setUserProfile(null)
    }
  }, [])

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut()
      if (error) throw error
      setUser(null)
      setUserProfile(null)
    } catch (error) {
      console.error('Error signing out:', error)
    }
  }

  useEffect(() => {
    const initAuth = async () => {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession()

        if (session?.user) {
          setUser(session.user)
          const profile = await fetchUserProfile(session.user.id)
          setUserProfile(profile)
        } else {
          setUser(null)
          setUserProfile(null)
        }
      } catch (error) {
        console.error('Error initializing auth:', error)
        setUser(null)
        setUserProfile(null)
      } finally {
        setLoading(false)
        setInitialized(true)
      }
    }

    initAuth()

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
        if (session?.user) {
          setUser(session.user)
          const profile = await fetchUserProfile(session.user.id)
          setUserProfile(profile)
        }
      } else if (event === 'SIGNED_OUT') {
        setUser(null)
        setUserProfile(null)
      }
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [supabase.auth])

  const value = {
    user,
    userProfile,
    loading: loading || !initialized,
    refreshUser,
    signOut,
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

export function useRequireAdmin() {
  const { user, userProfile, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading) {
      if (!user) {
        router.push('/login')
        return
      }

      if (userProfile && userProfile.role !== 'admin') {
        router.push('/')
        return
      }
    }
  }, [user, userProfile, loading, router])

  return {
    user,
    userProfile,
    loading,
    isAdmin: userProfile?.role === 'admin',
  }
}

export function useRequireAuth() {
  const { user, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && user === null) {
      router.push('/login')
    }
  }, [user, loading, router])

  return { user, loading }
}

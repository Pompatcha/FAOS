'use client'

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from 'react'
import { User, Session } from '@supabase/supabase-js'
import { Profile, authService } from '@/app/actions/auth'

interface AuthContextType {
  user: User | null
  profile: Profile | null
  session: Session | null
  loading: boolean
  signOut: () => Promise<void>
  refreshProfile: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

interface AuthProviderProps {
  children: ReactNode
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)

  const refreshProfile = async () => {
    if (!user) return

    const result = await authService.getUserProfile(user.id)
    if (result.success && result.profile) {
      setProfile(result.profile)
    }
  }

  const signOut = async () => {
    const result = await authService.signOut()
    if (result.success) {
      setUser(null)
      setProfile(null)
      setSession(null)
    }
  }

  useEffect(() => {
    const getInitialSession = async () => {
      const result = await authService.getCurrentUser()
      if (result.success && result.user) {
        setUser(result.user as User)
        const profileResult = await authService.getUserProfile(result.user.id)
        if (profileResult.success && profileResult.profile) {
          setProfile(profileResult.profile)
        }
      }
      setLoading(false)
    }

    getInitialSession()

    const {
      data: { subscription },
    } = authService.onAuthStateChange(
      async (event: string, session: unknown) => {
        const typedSession = session as Session | null
        setSession(typedSession)

        if (typedSession?.user) {
          setUser(typedSession.user)
          const profileResult = await authService.getUserProfile(
            typedSession.user.id,
          )
          if (profileResult.success && profileResult.profile) {
            setProfile(profileResult.profile)
          }
        } else {
          setUser(null)
          setProfile(null)
        }

        setLoading(false)
      },
    )

    return () => {
      subscription?.unsubscribe()
    }
  }, [])

  const value: AuthContextType = {
    user,
    profile,
    session,
    loading,
    signOut,
    refreshProfile,
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

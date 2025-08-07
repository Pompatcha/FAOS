'use client'

interface User {
  id?: string
  email?: string
  app_metadata?: {
    provider?: string
  }
}

interface Session {
  user?: User
  expires_at?: number
}

interface Profile {
  id?: string
  full_name?: string
  email?: string
  avatar_url?: string
  updated_at?: string
}

export const AuthDebug = {
  log: (message: string, data?: unknown) => {
    if (process.env.NODE_ENV === 'development') {
      console.log(`🔐 Auth Debug: ${message}`, data)
    }
  },

  error: (message: string, error?: unknown) => {
    if (process.env.NODE_ENV === 'development') {
      console.error(`🚨 Auth Error: ${message}`, error)
    }
  },

  warn: (message: string, data?: unknown) => {
    if (process.env.NODE_ENV === 'development') {
      console.warn(`⚠️ Auth Warning: ${message}`, data)
    }
  },

  session: (session: Session | null) => {
    if (process.env.NODE_ENV === 'development') {
      console.log('📱 Session Details:', {
        hasSession: !!session,
        userId: session?.user?.id,
        email: session?.user?.email,
        expiresAt: session?.expires_at
          ? new Date(session.expires_at * 1000).toLocaleString()
          : 'N/A',
        provider: session?.user?.app_metadata?.provider,
        isExpired: session?.expires_at
          ? Date.now() / 1000 > session.expires_at
          : false,
      })
    }
  },

  profile: (profile: Profile | null) => {
    if (process.env.NODE_ENV === 'development') {
      console.log('👤 Profile Details:', {
        hasProfile: !!profile,
        id: profile?.id,
        fullName: profile?.full_name,
        email: profile?.email,
        avatarUrl: profile?.avatar_url,
        updatedAt: profile?.updated_at,
      })
    }
  },

  authState: (
    event: string,
    session: Session | null,
    user: User | null,
    profile: Profile | null,
  ) => {
    if (process.env.NODE_ENV === 'development') {
      console.group(`🔄 Auth State Change: ${event}`)
      console.log('Event:', event)
      console.log('Has Session:', !!session)
      console.log('Has User:', !!user)
      console.log('Has Profile:', !!profile)
      console.log('User Email:', user?.email)
      console.log('Profile Name:', profile?.full_name)
      console.groupEnd()
    }
  },
}

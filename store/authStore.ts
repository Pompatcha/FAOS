import { create } from 'zustand'

import { createClient } from '@/utils/supabase/client'

const supabase = createClient()

interface User {
  id?: string | null
  email?: string | null
  first_name?: string
  last_name?: string
  role?: string
}

interface AuthState {
  user: User | null
  initialized: boolean
  initialize: () => void
  signIn: ({ email, password }: { email: string; password: string }) => void
  signOut: () => void
  fetchUserProfile: (userId: string) => Promise<void>
}

const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  initialized: false,

  fetchUserProfile: async (userId: string) => {
    const currentUser = get().user
    if (
      currentUser?.first_name ||
      currentUser?.last_name ||
      currentUser?.role
    ) {
      return
    }

    try {
      const { data: profile, error } = await supabase
        .from('users')
        .select('first_name, last_name, role')
        .eq('userId', userId)
        .single()

      if (error) {
        console.error('Error fetching profile:', error)
        return
      }

      if (!profile) {
        return
      }

      const currentUser = get().user
      set({
        user: {
          ...currentUser,
          ...profile,
        },
      })
    } catch (error) {
      console.error('Error fetching user profile:', error)
    }
  },

  initialize: async () => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) {
        set({ initialized: true })
        return
      }

      set({
        user: {
          id: user.id,
          email: user.email,
        },
        initialized: true,
      })

      await get().fetchUserProfile(user.id)

      supabase.auth.onAuthStateChange(async (event, session) => {
        if (!session?.user) {
          set({ user: null })
          return
        }

        set({
          user: {
            id: session.user.id,
            email: session.user.email,
          },
        })

        await get().fetchUserProfile(session.user.id)
      })
    } catch (error) {
      console.error('Error initializing auth:', error)
      set({ initialized: true })
    }
  },

  signIn: async ({ email, password }: { email: string; password: string }) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) throw error

      set({
        user: {
          id: data?.user?.id,
          email: data?.user?.email,
        },
      })

      if (data?.user?.id) {
        await get().fetchUserProfile(data.user.id)
      }

      return { data, error: null }
    } catch (error) {
      return { data: null, error }
    }
  },

  signOut: async () => {
    try {
      const { error } = await supabase.auth.signOut()
      if (error) throw error

      set({
        user: null,
      })

      return { error: null }
    } catch (error) {
      return { error }
    }
  },
}))

export default useAuthStore

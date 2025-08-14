import { createClient } from '@/utils/supabase/client'
import type { AuthError, PostgrestError } from '@supabase/supabase-js'

export interface AuthResult {
  success: boolean
  error?: string
  user?: unknown
}

export interface SignUpData {
  email: string
  password: string
  fullName: string
}

export interface SignInData {
  email: string
  password: string
}

export interface Profile {
  id: string
  full_name: string | null
  email: string | null
  avatar_url: string | null
  created_at: string
  updated_at: string
}

class AuthService {
  private supabase = createClient()

  async signUp({ email, password, fullName }: SignUpData): Promise<AuthResult> {
    try {
      const { data, error } = await this.supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
            name: fullName,
          },
        },
      })

      if (error) {
        return { success: false, error: this.getAuthErrorMessage(error) }
      }

      return {
        success: true,
        user: data.user,
      }
    } catch (error) {
      return {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : 'An unexpected error occurred',
      }
    }
  }

  async signIn({ email, password }: SignInData): Promise<AuthResult> {
    try {
      const { data, error } = await this.supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) {
        return { success: false, error: this.getAuthErrorMessage(error) }
      }

      return {
        success: true,
        user: data.user,
      }
    } catch (error) {
      return {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : 'An unexpected error occurred',
      }
    }
  }

  async signInWithGoogle(): Promise<AuthResult> {
    try {
      const { error } = await this.supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${process.env.BASE_URL}/auth/callback`,
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          },
        },
      })

      if (error) {
        return { success: false, error: this.getAuthErrorMessage(error) }
      }

      return { success: true }
    } catch (error) {
      return {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : 'An unexpected error occurred',
      }
    }
  }

  async signInWithFacebook(): Promise<AuthResult> {
    try {
      const { error } = await this.supabase.auth.signInWithOAuth({
        provider: 'facebook',
        options: {
          redirectTo: `${process.env.BASE_URL}/auth/callback`,
          scopes: 'email public_profile',
        },
      })

      if (error) {
        return { success: false, error: this.getAuthErrorMessage(error) }
      }

      return { success: true }
    } catch (error) {
      return {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : 'An unexpected error occurred',
      }
    }
  }

  async signOut(): Promise<AuthResult> {
    try {
      const { error } = await this.supabase.auth.signOut()

      if (error) {
        return { success: false, error: this.getAuthErrorMessage(error) }
      }

      return { success: true }
    } catch (error) {
      return {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : 'An unexpected error occurred',
      }
    }
  }

  async getCurrentUser() {
    try {
      const {
        data: { user },
        error,
      } = await this.supabase.auth.getUser()

      if (error) {
        return { success: false, error: this.getAuthErrorMessage(error) }
      }

      return { success: true, user }
    } catch (error) {
      return {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : 'An unexpected error occurred',
      }
    }
  }

  async getUserProfile(
    userId: string,
  ): Promise<{ success: boolean; profile?: Profile; error?: string }> {
    try {
      const { data, error } = await this.supabase
        .from('customers')
        .select('*')
        .eq('id', userId)
        .single()

      if (error) {
        return { success: false, error: this.getPostgrestErrorMessage(error) }
      }

      return { success: true, profile: data }
    } catch (error) {
      return {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : 'An unexpected error occurred',
      }
    }
  }

  async updateUserProfile(
    userId: string,
    updates: Partial<Profile>,
  ): Promise<AuthResult> {
    try {
      const { data, error } = await this.supabase
        .from('customers')
        .update(updates)
        .eq('id', userId)
        .select()
        .single()

      if (error) {
        return { success: false, error: this.getPostgrestErrorMessage(error) }
      }

      return { success: true, user: data }
    } catch (error) {
      return {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : 'An unexpected error occurred',
      }
    }
  }

  async resetPassword(email: string): Promise<AuthResult> {
    try {
      const { error } = await this.supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${process.env.BASE_URL}/auth/reset-password`,
      })

      if (error) {
        return { success: false, error: this.getAuthErrorMessage(error) }
      }

      return { success: true }
    } catch (error) {
      return {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : 'An unexpected error occurred',
      }
    }
  }

  onAuthStateChange(callback: (event: string, session: unknown) => void) {
    return this.supabase.auth.onAuthStateChange(callback)
  }

  private getAuthErrorMessage(error: AuthError): string {
    switch (error.message) {
      case 'Invalid login credentials':
        return 'Invalid email or password'
      case 'User already registered':
        return 'This email is already in use'
      case 'Password should be at least 6 characters':
        return 'Password must be at least 6 characters long'
      case 'Unable to validate email address: invalid format':
        return 'Invalid email format'
      case 'Email not confirmed':
        return 'Please confirm your email before signing in'
      case 'Too many requests':
        return 'Too many requests. Please try again later'
      default:
        return error.message || 'An unknown error occurred'
    }
  }

  private getPostgrestErrorMessage(error: PostgrestError): string {
    switch (error.code) {
      case 'PGRST116':
        return 'Data not found'
      case 'PGRST202':
        return 'Access denied'
      case '23505':
        return 'Duplicate data'
      case '23503':
        return 'Invalid reference data'
      case '42501':
        return 'Insufficient permissions'
      default:
        return error.message || 'Database error occurred'
    }
  }
}

export const authService = new AuthService()

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
          redirectTo: `${window.location.origin}`,
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
          redirectTo: `${window.location.origin}`,
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
        .from('profiles')
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
        .from('profiles')
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
        redirectTo: `${window.location.origin}/auth/reset-password`,
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
        return 'อีเมลหรือรหัสผ่านไม่ถูกต้อง'
      case 'User already registered':
        return 'อีเมลนี้ถูกใช้งานแล้ว'
      case 'Password should be at least 6 characters':
        return 'รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร'
      case 'Unable to validate email address: invalid format':
        return 'รูปแบบอีเมลไม่ถูกต้อง'
      case 'Email not confirmed':
        return 'กรุณายืนยันอีเมลก่อนเข้าสู่ระบบ'
      case 'Too many requests':
        return 'มีการร้องขอมากเกินไป กรุณาลองใหม่ในภายหลัง'
      default:
        return error.message || 'เกิดข้อผิดพลาดที่ไม่ทราบสาเหตุ'
    }
  }

  private getPostgrestErrorMessage(error: PostgrestError): string {
    switch (error.code) {
      case 'PGRST116':
        return 'ไม่พบข้อมูลที่ต้องการ'
      case 'PGRST202':
        return 'ไม่มีสิทธิ์เข้าถึงข้อมูล'
      case '23505':
        return 'ข้อมูลซ้ำ'
      case '23503':
        return 'ข้อมูลอ้างอิงไม่ถูกต้อง'
      case '42501':
        return 'ไม่มีสิทธิ์ในการดำเนินการ'
      default:
        return error.message || 'เกิดข้อผิดพลาดกับฐานข้อมูล'
    }
  }
}

export const authService = new AuthService()

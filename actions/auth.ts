'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

import type { User } from '@supabase/supabase-js'

import { createClient } from '@/utils/supabase/server'

const createUserRecord = async (supabaseUser: User) => {
  const supabase = await createClient()

  try {
    const { data: existingUser } = await supabase
      .from('users')
      .select('id')
      .eq('userId', supabaseUser.id)
      .single()

    if (existingUser) {
      return { success: true, data: existingUser }
    }

    const { data: newUser, error } = await supabase
      .from('users')
      .insert({
        userId: supabaseUser.id,
        first_name:
          supabaseUser.user_metadata?.first_name ||
          supabaseUser.user_metadata?.given_name ||
          supabaseUser.user_metadata?.name?.split(' ')[0] ||
          null,
        last_name:
          supabaseUser.user_metadata?.last_name ||
          supabaseUser.user_metadata?.family_name ||
          supabaseUser.user_metadata?.name?.split(' ').slice(1).join(' ') ||
          null,
        role: 'customer',
      })
      .select()
      .single()

    if (error) {
      console.error('Error creating user record:', error)
      return { success: false, error }
    }

    return { success: true, data: newUser }
  } catch (error) {
    console.error('Unexpected error creating user record:', error)
    return { success: false, error }
  }
}

const login = async (email: string, password: string) => {
  const supabase = await createClient()

  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      throw error
    }

    if (data.user) {
      await createUserRecord(data.user)
    }

    revalidatePath('/', 'layout')

    return {
      success: true,
      data: data.user,
    }
  } catch (error) {
    return {
      success: false,
      message:
        error instanceof Error
          ? error.message
          : 'An error occurred during login',
    }
  }
}

const register = async (email: string, password: string) => {
  const supabase = await createClient()

  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    })

    if (error) {
      throw error
    }

    if (data.user) {
      await createUserRecord(data.user)
    }

    revalidatePath('/', 'layout')

    return {
      success: true,
      data: data.user,
    }
  } catch (error) {
    return {
      success: false,
      message:
        error instanceof Error
          ? error.message
          : 'An error occurred during registration',
    }
  }
}

const logout = async () => {
  const supabase = await createClient()

  try {
    const { error } = await supabase.auth.signOut()

    if (error) {
      throw error
    }

    revalidatePath('/', 'layout')
    redirect('/login')
  } catch (error) {
    return {
      success: false,
      message:
        error instanceof Error
          ? error.message
          : 'An error occurred during logout',
    }
  }
}

const getUser = async () => {
  const supabase = await createClient()

  try {
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser()

    if (error) {
      throw error
    }

    return {
      success: true,
      data: user,
    }
  } catch (error) {
    return {
      success: false,
      data: null,
      message:
        error instanceof Error
          ? error.message
          : 'An error occurred while fetching user',
    }
  }
}

const loginWithGoogle = async () => {
  const supabase = await createClient()

  try {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback`,
      },
    })

    if (error) {
      throw error
    }

    return {
      success: true,
      data,
    }
  } catch (error) {
    return {
      success: false,
      message:
        error instanceof Error
          ? error.message
          : 'An error occurred during Google login',
    }
  }
}

const loginWithFacebook = async () => {
  const supabase = await createClient()

  try {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'facebook',
      options: {
        redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback`,
      },
    })

    if (error) {
      throw error
    }

    return {
      success: true,
      data,
    }
  } catch (error) {
    return {
      success: false,
      message:
        error instanceof Error
          ? error.message
          : 'An error occurred during Facebook login',
    }
  }
}

export {
  login,
  register,
  logout,
  getUser,
  createUserRecord,
  loginWithGoogle,
  loginWithFacebook,
}

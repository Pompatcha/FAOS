'use server'

import type { Tables } from '@/types/supabase'

import { createClient } from '@/utils/supabase/client'

type UserInput = Omit<Tables<'users'>, 'id' | 'created_at' | 'role'>

const getUserById = async (userId: string) => {
  const supabase = createClient()

  try {
    const { data: user, error: fetchUserError } = await supabase
      .from('users')
      .select('first_name, last_name, telephone, shipping_address')
      .eq('userId', userId)
      .single()

    if (fetchUserError) {
      throw fetchUserError
    }

    return {
      data: user,
      success: true,
    }
  } catch (error) {
    return {
      data: null,
      message:
        error instanceof Error
          ? error.message
          : 'An error occurred while fetching user',
      success: false,
    }
  }
}

const updateUser = async (userId: string, userData: UserInput) => {
  const supabase = createClient()

  try {
    const { data: user, error: updateUserError } = await supabase
      .from('users')
      .update(userData)
      .eq('userId', userId)
      .select()
      .single()

    if (updateUserError) {
      throw updateUserError
    }

    return {
      data: user,
      success: true,
    }
  } catch (error) {
    return {
      data: null,
      message:
        error instanceof Error
          ? error.message
          : 'An error occurred while updating user',
      success: false,
    }
  }
}

export { getUserById, updateUser }

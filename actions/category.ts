'use server'

import { createClient } from '@/utils/supabase/client'

const getCategories = async () => {
  const supabase = createClient()

  try {
    const { data, error } = await supabase.from('categories').select('id, name')

    if (error) throw error

    return data || []
  } catch (error) {
    return error
  }
}

export { getCategories }

'use server'

import { createClient } from '@/utils/supabase/client'

const getCategories = async () => {
  const supabase = createClient()

  try {
    const { data: categories, error: fetchCategoryError } = await supabase
      .from('categories')
      .select('id, name')

    if (fetchCategoryError) {
      throw fetchCategoryError
    }

    return {
      data: categories,
    }
  } catch (error) {
    return {
      data: [],
      message: error instanceof Error ? error.message : 'An error occurred',
    }
  }
}

export { getCategories }

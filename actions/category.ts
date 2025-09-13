'use server'

import { createClient } from '@/utils/supabase/client'

const getCategoryByName = async (slug: string) => {
  const supabase = createClient()

  try {
    const { data: category, error: fetchCategoryError } = await supabase
      .from('categories')
      .select('id, name')
      .ilike('name', `%${slug}%`)
      .limit(1)

    if (fetchCategoryError) {
      throw fetchCategoryError
    }

    return {
      data: category ? category[0] : null,
    }
  } catch (error) {
    return {
      data: [],
      message: error instanceof Error ? error.message : 'An error occurred',
    }
  }
}

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

export { getCategoryByName, getCategories }

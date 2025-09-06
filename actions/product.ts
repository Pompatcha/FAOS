'use server'

import type { Tables } from '@/types/supabase'

import { createClient } from '@/utils/supabase/client'

const getProducts = async () => {
  const supabase = createClient()

  try {
    const { data, error } = await supabase
      .from('products')
      .select(
        `
        id,
        created_at,
        updated_at,
        name,
        sku,
        category:categories(id, name),
        images:product_images(id, image_url)
      `,
      )
      .eq('product_images.is_primary', true)
      .order('created_at', { ascending: false })

    if (error) {
      throw error
    }

    return data ? data : []
  } catch (error) {
    return error
  }
}

const getProduct = async (id: string) => {
  const supabase = createClient()

  try {
    const { data, error } = await supabase
      .from('products')
      .select(
        `
        id,
        created_at,
        updated_at,
        name,
        description,
        short_description,
        sku,
        category:categories(id, name),
        images:product_images(id, image_url),
        options:product_options(id, option_name, option_value, option_price, option_stock)
      `,
      )
      .eq('id', id)
      .single()

    if (error) {
      throw error
    }

    return data ? data : []
  } catch (error) {
    return error
  }
}

const createProduct = async (
  productData: Omit<Tables<'products'>, 'id' | 'created_at' | 'updated_at'>,
  imageData?: Omit<
    Tables<'product_images'>,
    'id' | 'product_id' | 'created_at'
  >[],
  optionData?: Omit<
    Tables<'product_options'>,
    'id' | 'product_id' | 'created_at'
  >[],
) => {
  const supabase = createClient()

  try {
    const { data: product, error: productError } = await supabase
      .from('products')
      .insert([
        {
          ...productData,
          updated_at: new Date().toISOString(),
        },
      ])
      .select()
      .single()

    if (productError) throw productError

    if (imageData && imageData.length > 0) {
      const images = imageData.map((img, index) => ({
        product_id: product.id,
        ...img,
        is_primary: img.is_primary ?? index === 0,
      }))

      await supabase.from('product_images').insert(images)
    }

    if (optionData && optionData.length > 0) {
      const options = optionData.map((option) => ({
        product_id: product.id,
        ...option,
      }))

      await supabase.from('product_options').insert(options)
    }

    return null
  } catch (error) {
    return error
  }
}

const updateProduct = async (
  id: string,
  productData: Omit<Tables<'products'>, 'id' | 'created_at' | 'updated_at'>,
  imageData?: Omit<
    Tables<'product_images'>,
    'id' | 'product_id' | 'created_at'
  >[],
  optionData?: Omit<
    Tables<'product_options'>,
    'id' | 'product_id' | 'created_at'
  >[],
) => {
  const supabase = createClient()

  try {
    await supabase
      .from('products')
      .update({
        ...productData,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)

    if (imageData !== undefined) {
      await supabase.from('product_images').delete().eq('product_id', id)

      if (imageData.length > 0) {
        const images = imageData.map((img, index) => ({
          product_id: parseInt(id),
          ...img,
          is_primary: img.is_primary ?? index === 0,
        }))

        await supabase.from('product_images').insert(images)
      }
    }

    if (optionData !== undefined) {
      await supabase.from('product_options').delete().eq('product_id', id)

      if (optionData.length > 0) {
        const options = optionData.map((option) => ({
          product_id: parseInt(id),
          ...option,
        }))

        await supabase.from('product_options').insert(options)
      }
    }

    return null
  } catch (error) {
    return error
  }
}

const deleteProduct = async (id: string) => {
  const supabase = createClient()
  await supabase.from('products').delete().eq('id', id)
}

const getProductsByCategory = async (categoryId: number) => {
  const supabase = createClient()

  try {
    const { data, error } = await supabase
      .from('products')
      .select(
        `
        *,
        category:categories(*),
        images:product_images(*).eq(is_primary, true).single()
      `,
      )
      .eq('category_id', categoryId)
      .order('created_at', { ascending: false })

    if (error) {
      throw error
    }

    return data ? data : []
  } catch (error) {
    return error
  }
}

export {
  getProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
  getProductsByCategory,
}

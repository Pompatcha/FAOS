'use server'

import { revalidatePath } from 'next/cache'

import type { Tables } from '@/types/supabase'

import { createClient } from '@/utils/supabase/client'

const getProducts = async () => {
  try {
    const supabase = createClient()

    const { data, error } = await supabase
      .from('products')
      .select(
        `
        *,
        category:categories(id, name),
        prices:product_prices(*),
        images:product_images(*),
        options:product_options(*)
      `,
      )
      .order('created_at', { ascending: false })

    if (error) throw error

    return { success: true, data: data || [] }
  } catch {
    return { success: false, error: 'เกิดข้อผิดพลาดในการดึงข้อมูลสินค้า' }
  }
}

const getProduct = async (id: string) => {
  try {
    const supabase = createClient()

    const { data, error } = await supabase
      .from('products')
      .select(
        `
        *,
        category:categories(id, name),
        prices:product_prices(*),
        images:product_images(*),
        options:product_options(*)
      `,
      )
      .eq('id', id)
      .single()

    if (error) throw error

    return { success: true, data }
  } catch {
    return { success: false, error: 'ไม่พบสินค้า' }
  }
}

const createProduct = async (
  productData: Omit<Tables<'products'>, 'id' | 'created_at' | 'updated_at'>,
  priceData: Omit<Tables<'product_prices'>, 'id' | 'product_id' | 'created_at'>,
  imageData?: Omit<
    Tables<'product_images'>,
    'id' | 'product_id' | 'created_at'
  >[],
  optionData?: Omit<
    Tables<'product_options'>,
    'id' | 'product_id' | 'created_at'
  >[],
) => {
  try {
    const supabase = createClient()

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

    await supabase.from('product_prices').insert([
      {
        product_id: product.id,
        ...priceData,
      },
    ])

    if (imageData && imageData.length > 0) {
      const images = imageData.map((img, index) => ({
        product_id: product.id,
        ...img,
        display_order: img.display_order ?? index,
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

    revalidatePath('/products')
    return { success: true, data: product, message: 'สร้างสินค้าสำเร็จ' }
  } catch {
    return { success: false, error: 'เกิดข้อผิดพลาดในการสร้างสินค้า' }
  }
}

const updateProduct = async (
  id: string,
  productData: Omit<Tables<'products'>, 'id' | 'created_at' | 'updated_at'>,
  priceData?: Omit<
    Tables<'product_prices'>,
    'id' | 'product_id' | 'created_at'
  >,
  imageData?: Omit<
    Tables<'product_images'>,
    'id' | 'product_id' | 'created_at'
  >[],
  optionData?: Omit<
    Tables<'product_options'>,
    'id' | 'product_id' | 'created_at'
  >[],
) => {
  try {
    const supabase = createClient()

    await supabase
      .from('products')
      .update({
        ...productData,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)

    if (priceData) {
      await supabase
        .from('product_prices')
        .upsert({ product_id: parseInt(id), ...priceData })
    }

    if (imageData !== undefined) {
      await supabase.from('product_images').delete().eq('product_id', id)

      if (imageData.length > 0) {
        const images = imageData.map((img, index) => ({
          product_id: parseInt(id),
          ...img,
          display_order: img.display_order ?? index,
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

    revalidatePath('/products')
    return { success: true, message: 'อัพเดทสินค้าสำเร็จ' }
  } catch {
    return { success: false, error: 'เกิดข้อผิดพลาดในการอัพเดทสินค้า' }
  }
}

const deleteProduct = async (id: string) => {
  try {
    const supabase = createClient()

    await supabase.from('products').delete().eq('id', id)

    revalidatePath('/products')
    return { success: true, message: 'ลบสินค้าสำเร็จ' }
  } catch {
    return { success: false, error: 'เกิดข้อผิดพลาดในการลบสินค้า' }
  }
}

const getProductsByCategory = async (categoryId: number) => {
  try {
    const supabase = createClient()

    const { data, error } = await supabase
      .from('products')
      .select(
        `
        *,
        category:categories(id, name),
        prices:product_prices(*),
        images:product_images(*),
        options:product_options(*)
      `,
      )
      .eq('category_id', categoryId)
      .eq('is_active', true)
      .order('created_at', { ascending: false })

    if (error) throw error

    return { success: true, data: data || [] }
  } catch {
    return { success: false, error: 'เกิดข้อผิดพลาดในการดึงข้อมูลสินค้า' }
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

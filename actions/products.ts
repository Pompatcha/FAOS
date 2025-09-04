'use server'

import { revalidatePath } from 'next/cache'

import { createClient } from '@/utils/supabase/client'

interface ProductData {
  name: string
  description?: string
  short_description?: string
  category_id?: number
  brand?: string
  sku?: string
  is_active?: boolean
  weight?: number
  dimensions?: Record<string, unknown>
}

interface ProductPriceData {
  base_price: number
  sale_price?: number
  cost_price?: number
  is_on_sale?: boolean
  sale_start_date?: string
  sale_end_date?: string
}

interface ProductOptionData {
  option_name: string
  option_value: string
  additional_price?: number
  stock_quantity?: number
  sku?: string
  is_available?: boolean
}

interface ProductImageData {
  image_url: string
  alt_text?: string
  display_order?: number
  is_primary?: boolean
  product_option_id?: number
}

const validateProductData = (
  data: Partial<ProductData>,
): { isValid: boolean; errors: string[] } => {
  const errors: string[] = []

  if (!data.name || typeof data.name !== 'string' || data.name.trim() === '') {
    errors.push('Product name is required')
  }

  return { isValid: errors.length === 0, errors }
}

const validatePriceData = (
  data: Partial<ProductPriceData>,
): { isValid: boolean; errors: string[] } => {
  const errors: string[] = []

  if (
    !data.base_price ||
    typeof data.base_price !== 'number' ||
    data.base_price <= 0
  ) {
    errors.push('Base price must be a positive number')
  }

  return { isValid: errors.length === 0, errors }
}

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
  } catch (error) {
    console.error('Error fetching products:', error)
    return {
      success: false,
      error: 'Failed to fetch products',
      details: error instanceof Error ? error.message : 'Unknown error',
    }
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
  } catch (error) {
    console.error('Error fetching product:', error)
    return {
      success: false,
      error: 'Failed to fetch product',
      details: error instanceof Error ? error.message : 'Unknown error',
    }
  }
}

const createProduct = async (
  productData: ProductData,
  priceData: ProductPriceData,
  imageData?: ProductImageData[],
  optionData?: ProductOptionData[],
) => {
  try {
    const supabase = createClient()

    const productValidation = validateProductData(productData)
    if (!productValidation.isValid) {
      return {
        success: false,
        error: 'Invalid product data',
        details: productValidation.errors,
      }
    }

    const priceValidation = validatePriceData(priceData)
    if (!priceValidation.isValid) {
      return {
        success: false,
        error: 'Invalid price data',
        details: priceValidation.errors,
      }
    }

    const cleanProduct = {
      name: productData.name.trim(),
      description: productData.description?.trim() || null,
      short_description: productData.short_description?.trim() || null,
      category_id: productData.category_id || null,
      brand: productData.brand?.trim() || null,
      sku: productData.sku?.trim() || null,
      is_active:
        productData.is_active !== undefined ? productData.is_active : true,
      weight: productData.weight || null,
      dimensions: productData.dimensions || null,
      updated_at: new Date().toISOString(),
    }

    const { data: product, error: productError } = await supabase
      .from('products')
      .insert([cleanProduct])
      .select()
      .single()

    if (productError) throw productError

    const cleanPrice = {
      product_id: product.id,
      base_price: priceData.base_price,
      sale_price: priceData.sale_price || null,
      cost_price: priceData.cost_price || null,
      is_on_sale: priceData.is_on_sale || false,
      sale_start_date: priceData.sale_start_date || null,
      sale_end_date: priceData.sale_end_date || null,
    }

    const { error: priceError } = await supabase
      .from('product_prices')
      .insert([cleanPrice])

    if (priceError) {
      console.error('Error creating price:', priceError)
    }

    if (imageData && imageData.length > 0) {
      const cleanImages = imageData.map((img, index) => ({
        product_id: product.id,
        product_option_id: img.product_option_id || null,
        image_url: img.image_url,
        alt_text: img.alt_text || null,
        display_order: img.display_order ?? index,
        is_primary: img.is_primary || index === 0,
      }))

      const { error: imageError } = await supabase
        .from('product_images')
        .insert(cleanImages)

      if (imageError) {
        console.error('Error creating images:', imageError)
      }
    }

    if (optionData && optionData.length > 0) {
      const cleanOptions = optionData.map((option) => ({
        product_id: product.id,
        option_name: option.option_name,
        option_value: option.option_value,
        additional_price: option.additional_price || 0,
        stock_quantity: option.stock_quantity || 0,
        sku: option.sku || null,
        is_available:
          option.is_available !== undefined ? option.is_available : true,
      }))

      const { error: optionError } = await supabase
        .from('product_options')
        .insert(cleanOptions)

      if (optionError) {
        console.error('Error creating options:', optionError)
      }
    }

    const result = await getProduct(product.id.toString())
    if (!result.success) {
      return result
    }

    revalidatePath('/products')
    return {
      success: true,
      data: result.data,
      message: 'Product created successfully',
    }
  } catch (error) {
    console.error('Unexpected error creating product:', error)
    return {
      success: false,
      error: 'Failed to create product',
      details: error instanceof Error ? error.message : 'Unknown error',
    }
  }
}

const updateProduct = async (
  id: string,
  productData: ProductData,
  priceData?: ProductPriceData,
  imageData?: ProductImageData[],
  optionData?: ProductOptionData[],
) => {
  try {
    const supabase = createClient()

    const productValidation = validateProductData(productData)
    if (!productValidation.isValid) {
      return {
        success: false,
        error: 'Invalid product data',
        details: productValidation.errors,
      }
    }

    const cleanProduct = {
      name: productData.name.trim(),
      description: productData.description?.trim() || null,
      short_description: productData.short_description?.trim() || null,
      category_id: productData.category_id || null,
      brand: productData.brand?.trim() || null,
      sku: productData.sku?.trim() || null,
      is_active:
        productData.is_active !== undefined ? productData.is_active : true,
      weight: productData.weight || null,
      dimensions: productData.dimensions || null,
      updated_at: new Date().toISOString(),
    }

    const { error: productError } = await supabase
      .from('products')
      .update(cleanProduct)
      .eq('id', id)

    if (productError) throw productError

    if (priceData) {
      const priceValidation = validatePriceData(priceData)
      if (!priceValidation.isValid) {
        return {
          success: false,
          error: 'Invalid price data',
          details: priceValidation.errors,
        }
      }

      const cleanPrice = {
        base_price: priceData.base_price,
        sale_price: priceData.sale_price || null,
        cost_price: priceData.cost_price || null,
        is_on_sale: priceData.is_on_sale || false,
        sale_start_date: priceData.sale_start_date || null,
        sale_end_date: priceData.sale_end_date || null,
      }

      const { error: priceError } = await supabase
        .from('product_prices')
        .upsert({ product_id: parseInt(id), ...cleanPrice })

      if (priceError) {
        console.error('Error updating price:', priceError)
      }
    }

    if (imageData !== undefined) {
      await supabase.from('product_images').delete().eq('product_id', id)

      if (imageData.length > 0) {
        const cleanImages = imageData.map((img, index) => ({
          product_id: parseInt(id),
          product_option_id: img.product_option_id || null,
          image_url: img.image_url,
          alt_text: img.alt_text || null,
          display_order: img.display_order ?? index,
          is_primary: img.is_primary || index === 0,
        }))

        const { error: imageError } = await supabase
          .from('product_images')
          .insert(cleanImages)

        if (imageError) {
          console.error('Error updating images:', imageError)
        }
      }
    }

    if (optionData !== undefined) {
      await supabase.from('product_options').delete().eq('product_id', id)

      if (optionData.length > 0) {
        const cleanOptions = optionData.map((option) => ({
          product_id: parseInt(id),
          option_name: option.option_name,
          option_value: option.option_value,
          additional_price: option.additional_price || 0,
          stock_quantity: option.stock_quantity || 0,
          sku: option.sku || null,
          is_available:
            option.is_available !== undefined ? option.is_available : true,
        }))

        const { error: optionError } = await supabase
          .from('product_options')
          .insert(cleanOptions)

        if (optionError) {
          console.error('Error updating options:', optionError)
        }
      }
    }

    const result = await getProduct(id)
    if (!result.success) {
      return result
    }

    revalidatePath('/products')
    return {
      success: true,
      data: result.data,
      message: 'Product updated successfully',
    }
  } catch (error) {
    console.error('Unexpected error updating product:', error)
    return {
      success: false,
      error: 'Failed to update product',
      details: error instanceof Error ? error.message : 'Unknown error',
    }
  }
}

const deleteProduct = async (id: string) => {
  try {
    const supabase = createClient()

    const { error } = await supabase.from('products').delete().eq('id', id)

    if (error) throw error

    revalidatePath('/products')
    return {
      success: true,
      message: 'Product deleted successfully',
    }
  } catch (error) {
    console.error('Error deleting product:', error)
    return {
      success: false,
      error: 'Failed to delete product',
      details: error instanceof Error ? error.message : 'Unknown error',
    }
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
  } catch (error) {
    console.error('Error fetching products by category:', error)
    return {
      success: false,
      error: 'Failed to fetch products by category',
      details: error instanceof Error ? error.message : 'Unknown error',
    }
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

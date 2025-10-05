'use server'

import type { Tables } from '@/types/supabase'

import { createClient } from '@/utils/supabase/client'

type ProductInput = Omit<Tables<'products'>, 'id' | 'created_at' | 'updated_at'>
export type ProductOptionInput = Omit<
  Tables<'product_options'>,
  'id' | 'product_id' | 'created_at'
>
type ProductImageInput = Omit<
  Tables<'product_images'>,
  'id' | 'product_id' | 'created_at'
>

export type ProductFormInput = {
  productData: ProductInput
  productOptions: ProductOptionInput[] | null
  productImages: ProductImageInput[] | null
}

const getProducts = async () => {
  const supabase = createClient()

  try {
    const { data: products, error: fetchProductError } = await supabase
      .from('products')
      .select(
        `
        id,
        created_at,
        updated_at,
        name,
        preorder_enabled,
        preorder_day,
        category:categories(id, name),
        images:product_images(id, image_url)
      `,
      )
      .eq('product_images.is_primary', true)
      .order('created_at', { ascending: false })

    if (fetchProductError) {
      throw fetchProductError
    }

    if (!products || products.length === 0) return []

    const productIds = products.map((p) => p.id)

    const { data: priceStats, error: priceError } = await supabase
      .from('product_options')
      .select('product_id, option_price, option_stock')
      .in('product_id', productIds)

    if (priceError) throw priceError

    const productsWithStats = products.map((product) => {
      const options =
        priceStats?.filter((stat) => stat.product_id === product.id) || []

      const prices = options
        .map((opt) => Number(opt.option_price))
        .filter((p) => !isNaN(p))
      const stocks = options
        .map((opt) => Number(opt.option_stock))
        .filter((s) => !isNaN(s))

      return {
        ...product,
        min_price: prices.length > 0 ? Math.min(...prices) : null,
        max_price: prices.length > 0 ? Math.max(...prices) : null,
        min_stock: stocks.length > 0 ? Math.min(...stocks) : null,
        max_stock: stocks.length > 0 ? Math.max(...stocks) : null,
      }
    })

    return productsWithStats
  } catch (error) {
    return {
      data: [],
      message: error instanceof Error ? error.message : 'An error occurred',
    }
  }
}

const getRecommendedProducts = async () => {
  const supabase = createClient()

  try {
    const { data: products, error: productsError } = await supabase
      .from('products')
      .select(
        `
        id,
        name,
        preorder_enabled,
        preorder_day,
        category:categories(id, name),
        images:product_images(id, image_url)
      `,
      )
      .order('created_at', { ascending: false })
      .limit(6)

    if (productsError) throw productsError
    if (!products || products.length === 0) return []

    const productIds = products.map((p) => p.id)

    const { data: priceStats, error: priceError } = await supabase
      .from('product_options')
      .select('product_id, option_price, option_stock')
      .in('product_id', productIds)

    if (priceError) throw priceError

    const productsWithStats = products.map((product) => {
      const options =
        priceStats?.filter((stat) => stat.product_id === product.id) || []

      const prices = options
        .map((opt) => Number(opt.option_price))
        .filter((p) => !isNaN(p))
      const stocks = options
        .map((opt) => Number(opt.option_stock))
        .filter((s) => !isNaN(s))

      return {
        ...product,
        min_price: prices.length > 0 ? Math.min(...prices) : null,
        max_price: prices.length > 0 ? Math.max(...prices) : null,
        min_stock: stocks.length > 0 ? Math.min(...stocks) : null,
        max_stock: stocks.length > 0 ? Math.max(...stocks) : null,
      }
    })

    return productsWithStats
  } catch (error) {
    return error
  }
}

const getProduct = async (productId: string) => {
  const supabase = createClient()

  try {
    const { data: product, error: productError } = await supabase
      .from('products')
      .select(
        `
        *,
        category:categories(id, name),
        images:product_images(id, image_url),
        options:product_options(*)
      `,
      )
      .eq('id', productId)
      .single()

    if (productError) {
      throw productError
    }

    const options = product.options || []

    const prices = options
      .map((opt: { option_price: number }) => Number(opt.option_price))
      .filter((p: number) => !isNaN(p))
    const stocks = options
      .map((opt: { option_stock: number }) => Number(opt.option_stock))
      .filter((s: number) => !isNaN(s))

    const productWithStats = {
      ...product,
      min_price: prices.length > 0 ? Math.min(...prices) : null,
      max_price: prices.length > 0 ? Math.max(...prices) : null,
      min_stock: stocks.length > 0 ? Math.min(...stocks) : null,
      max_stock: stocks.length > 0 ? Math.max(...stocks) : null,
    }

    return productWithStats
  } catch (error) {
    return error
  }
}

const createProduct = async ({
  productData,
  productImages,
  productOptions,
}: ProductFormInput) => {
  const supabase = createClient()

  try {
    const { data: product, error: insertProductError } = await supabase
      .from('products')
      .insert([
        {
          ...productData,
          updated_at: new Date().toISOString(),
        },
      ])
      .select('id')
      .single()

    if (insertProductError) {
      throw insertProductError
    }

    if (productImages && productImages.length > 0) {
      const images = productImages.map((img, index) => ({
        product_id: product.id,
        ...img,
        is_primary: img.is_primary ?? index === 0,
      }))

      const { error: insertImageError } = await supabase
        .from('product_images')
        .insert(images)

      if (insertImageError) {
        throw insertImageError
      }
    }

    if (productOptions && productOptions.length > 0) {
      const options = productOptions.map((option) => ({
        product_id: product.id,
        ...option,
      }))

      const { error: insertOptionError } = await supabase
        .from('product_options')
        .insert(options)

      if (insertOptionError) {
        throw insertOptionError
      }
    }

    return {
      message: 'Product created successfully',
    }
  } catch (error) {
    return {
      message: error instanceof Error ? error.message : 'An error occurred',
    }
  }
}

const updateProduct = async ({
  productId,
  productData,
  productImages,
  productOptions,
}: {
  productId: string
  productData: ProductInput
  productImages?: ProductImageInput[] | null
  productOptions?: ProductOptionInput[] | null
}) => {
  const supabase = createClient()

  try {
    const { error: updateProductError } = await supabase
      .from('products')
      .update({
        ...productData,
        updated_at: new Date().toISOString(),
      })
      .eq('id', productId)

    if (updateProductError) {
      throw updateProductError
    }

    if (productImages !== undefined) {
      const { error: deleteImageError } = await supabase
        .from('product_images')
        .delete()
        .eq('product_id', productId)

      if (deleteImageError) {
        throw deleteImageError
      }

      if (productImages && productImages.length > 0) {
        const images = productImages.map((img, index) => ({
          product_id: parseInt(productId),
          ...img,
          is_primary: img.is_primary ?? index === 0,
        }))

        const { error: insertImageError } = await supabase
          .from('product_images')
          .insert(images)

        if (insertImageError) {
          throw insertImageError
        }
      }
    }

    if (productOptions !== undefined) {
      const { error: deleteOptionError } = await supabase
        .from('product_options')
        .delete()
        .eq('product_id', productId)

      if (deleteOptionError) {
        throw deleteOptionError
      }

      if (productOptions && productOptions.length > 0) {
        const options = productOptions.map((option) => ({
          product_id: parseInt(productId),
          ...option,
        }))

        const { error: insertOptionError } = await supabase
          .from('product_options')
          .insert(options)

        if (insertOptionError) {
          throw insertOptionError
        }
      }
    }

    return {
      message: 'Product updated successfully',
    }
  } catch (error) {
    return {
      message: error instanceof Error ? error.message : 'An error occurred',
    }
  }
}

const deleteProduct = async (productId: string) => {
  const supabase = createClient()

  try {
    const { error: deleteProductError } = await supabase
      .from('products')
      .delete()
      .eq('id', productId)

    if (deleteProductError) {
      throw deleteProductError
    }

    return {
      message: 'Product deleted successfully',
    }
  } catch (error) {
    return {
      data: [],
      message: error instanceof Error ? error.message : 'An error occurred',
    }
  }
}

const getProductsByCategory = async (categoryId: string) => {
  const supabase = createClient()

  try {
    const { data: products, error: productsError } = await supabase
      .from('products')
      .select(
        `
        id,
        name,
        preorder_enabled,
        preorder_day,
        category:categories(id, name),
        images:product_images(id, image_url)
      `,
      )
      .eq('category_id', categoryId)
      .order('created_at', { ascending: false })

    if (productsError) throw productsError
    if (!products || products.length === 0) return []

    const productIds = products.map((p) => p.id)

    const { data: priceStats, error: priceError } = await supabase
      .from('product_options')
      .select('product_id, option_price, option_stock')
      .in('product_id', productIds)

    if (priceError) throw priceError

    const productsWithStats = products.map((product) => {
      const options =
        priceStats?.filter((stat) => stat.product_id === product.id) || []

      const prices = options
        .map((opt) => Number(opt.option_price))
        .filter((p) => !isNaN(p))
      const stocks = options
        .map((opt) => Number(opt.option_stock))
        .filter((s) => !isNaN(s))

      return {
        ...product,
        min_price: prices.length > 0 ? Math.min(...prices) : null,
        max_price: prices.length > 0 ? Math.max(...prices) : null,
        min_stock: stocks.length > 0 ? Math.min(...stocks) : null,
        max_stock: stocks.length > 0 ? Math.max(...stocks) : null,
      }
    })

    return productsWithStats
  } catch (error) {
    return error
  }
}

const getProductsBySearch = async (searchText: string) => {
  const supabase = createClient()

  try {
    const { data: products, error: productsError } = await supabase
      .from('products')
      .select(
        `
        id,
        name,
        preorder_enabled,
        preorder_day,
        category:categories(id, name),
        images:product_images(id, image_url)
      `,
      )
      .ilike('name', `%${searchText}%`)
      .order('created_at', { ascending: false })

    if (productsError) throw productsError
    if (!products || products.length === 0) return []

    const productIds = products.map((p) => p.id)

    const { data: priceStats, error: priceError } = await supabase
      .from('product_options')
      .select('product_id, option_price, option_stock')
      .in('product_id', productIds)

    if (priceError) throw priceError

    const productsWithStats = products.map((product) => {
      const options =
        priceStats?.filter((stat) => stat.product_id === product.id) || []

      const prices = options
        .map((opt) => Number(opt.option_price))
        .filter((p) => !isNaN(p))
      const stocks = options
        .map((opt) => Number(opt.option_stock))
        .filter((s) => !isNaN(s))

      return {
        ...product,
        min_price: prices.length > 0 ? Math.min(...prices) : null,
        max_price: prices.length > 0 ? Math.max(...prices) : null,
        min_stock: stocks.length > 0 ? Math.min(...stocks) : null,
        max_stock: stocks.length > 0 ? Math.max(...stocks) : null,
      }
    })

    return productsWithStats
  } catch (error) {
    return error
  }
}

export {
  getProducts,
  getRecommendedProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
  getProductsByCategory,
  getProductsBySearch,
}

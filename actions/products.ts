'use server'

import { Product, ProductImage } from '@/types/product'
import { createClient } from '@/utils/supabase/client'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'

const productSchema = z.object({
  name: z.string().min(1, 'Product name is required').max(255),
  description: z.string().optional(),
  category: z.string().min(1, 'Category is required').max(100),
  status: z.enum(['active', 'inactive', 'out_of_stock']).default('active'),
})

const productImageSchema = z.object({
  image_url: z.string().url('Invalid image URL'),
  alt_text: z.string().optional(),
  sort_order: z.number().int().min(0).default(0),
})

const productOptionSchema = z.object({
  id: z.string().uuid().optional(), // เพิ่ม id สำหรับการอัปเดต
  option_name: z.string().min(1, 'Option name is required').max(100),
  price: z.number().min(0, 'Price must be a positive number'),
  stock: z.number().int().min(0, 'Stock must be a non-negative integer'),
  reserved_stock: z.number().int().min(0).optional().default(0),
})

export type ProductFormData = z.infer<typeof productSchema>
export type ProductImageData = z.infer<typeof productImageSchema>
export type ProductOptionData = z.infer<typeof productOptionSchema>

const extractFilePathFromUrl = (url: string): string | null => {
  try {
    const urlParts = url.split('/storage/v1/object/public/')
    if (urlParts.length === 2) {
      const pathWithBucket = urlParts[1]
      const pathParts = pathWithBucket.split('/')
      if (pathParts.length > 1) {
        pathParts.shift()
        return pathParts.join('/')
      }
    }
    return null
  } catch (error) {
    console.error('Error extracting file path from URL:', error)
    return null
  }
}

const deleteFileFromStorage = async (imageUrl: string): Promise<boolean> => {
  try {
    const supabase = createClient()
    const filePath = extractFilePathFromUrl(imageUrl)

    if (!filePath) {
      console.warn('Could not extract file path from URL:', imageUrl)
      return false
    }

    const { error } = await supabase.storage.from('images').remove([filePath])

    if (error) {
      console.error('Error deleting file from storage:', error)
      return false
    }

    console.log('Successfully deleted file from storage:', filePath)
    return true
  } catch (error) {
    console.error('Error in deleteFileFromStorage:', error)
    return false
  }
}

const deleteMultipleFilesFromStorage = async (
  imageUrls: string[],
): Promise<void> => {
  const supabase = createClient()
  const filePaths: string[] = []

  imageUrls.forEach((url) => {
    const filePath = extractFilePathFromUrl(url)
    if (filePath) {
      filePaths.push(filePath)
    }
  })

  if (filePaths.length === 0) {
    return
  }

  try {
    const { error } = await supabase.storage.from('images').remove(filePaths)

    if (error) {
      console.error('Error deleting multiple files from storage:', error)
    } else {
      console.log('Successfully deleted files from storage:', filePaths)
    }
  } catch (error) {
    console.error('Error in deleteMultipleFilesFromStorage:', error)
  }
}

const getProducts = async () => {
  const supabase = createClient()

  const { data, error } = await supabase
    .from('products')
    .select(
      `
      *,
      images:product_images(*)
      product_options('option_name', 'price', 'stock')
    `,
    )
    .order('created_at', { ascending: false })
    .order('sort_order', { referencedTable: 'images', ascending: true })

  if (error) {
    console.error('Error fetching products:', error)
    throw new Error('Failed to fetch products')
  }

  return data
}

const getProduct = async (id: string) => {
  const supabase = createClient()

  const { data, error } = await supabase
    .from('products')
    .select(
      `
      *,
      images:product_images(*)
      product_options('option_name', 'price', 'stock')
    `,
    )
    .eq('id', id)
    .order('sort_order', { referencedTable: 'images', ascending: true })
    .single()

  if (error) {
    console.error('Error fetching product:', error)
    throw new Error('Failed to fetch product')
  }

  return data
}

const createProduct = async (
  formData: ProductFormData,
  optionsData: ProductOptionData[] = [],
  imageData?: ProductImageData[],
) => {
  const supabase = createClient()

  const validatedFields = productSchema.safeParse(formData)

  if (!validatedFields.success) {
    return {
      error: 'Invalid fields',
      details: validatedFields.error.flatten().fieldErrors,
    }
  }

  const { data: product, error: productError } = await supabase
    .from('products')
    .insert([validatedFields.data])
    .select()
    .single()

  if (productError) {
    console.error('Error creating product:', productError)
    return {
      error: 'Failed to create product',
      details: productError.message,
    }
  }

  if (optionsData.length > 0) {
    const optionsToInsert = optionsData.map((opt) => ({
      ...opt,
      product_id: product.id,
    }))

    const { error: optionsError } = await supabase
      .from('product_options')
      .insert(optionsToInsert)

    if (optionsError) {
      console.error('Error creating product options:', optionsError)
      await supabase.from('products').delete().eq('id', product.id)
      return {
        error:
          'Failed to create product options. Product creation rolled back.',
        details: optionsError.message,
      }
    }
  }

  if (imageData && imageData.length > 0) {
    const validatedImages = imageData.map((img, index) => ({
      ...img,
      product_id: product.id,
      sort_order: img.sort_order ?? index,
    }))

    const { error: imageError } = await supabase
      .from('product_images')
      .insert(validatedImages)

    if (imageError) {
      console.error('Error creating product images:', imageError)
    }
  }

  const completeProduct = await getProduct(product.id)

  revalidatePath('/products')
  return { data: completeProduct }
}

const updateProduct = async (
  id: string,
  formData: ProductFormData,
  imageData?: ProductImageData[],
) => {
  const supabase = createClient()

  const validatedFields = productSchema.safeParse(formData)

  if (!validatedFields.success) {
    return {
      error: 'Invalid fields',
      details: validatedFields.error.flatten().fieldErrors,
    }
  }

  const { error: productError } = await supabase
    .from('products')
    .update(validatedFields.data)
    .eq('id', id)
    .select()
    .single()

  if (productError) {
    console.error('Error updating product:', productError)
    return {
      error: 'Failed to update product',
      details: productError.message,
    }
  }

  if (imageData !== undefined) {
    const { data: existingImages } = await supabase
      .from('product_images')
      .select('image_url')
      .eq('product_id', id)

    const { error: deleteError } = await supabase
      .from('product_images')
      .delete()
      .eq('product_id', id)

    if (deleteError) {
      console.error('Error deleting product images:', deleteError)
    }

    if (existingImages && existingImages.length > 0) {
      const existingImageUrls = existingImages.map((img) => img.image_url)
      deleteMultipleFilesFromStorage(existingImageUrls).catch((error) => {
        console.error('Failed to delete old images from storage:', error)
      })
    }

    if (imageData.length > 0) {
      const validatedImages = imageData.map((img, index) => ({
        ...img,
        product_id: id,
        sort_order: img.sort_order ?? index,
      }))

      const { error: imageError } = await supabase
        .from('product_images')
        .insert(validatedImages)

      if (imageError) {
        console.error('Error creating product images:', imageError)
      }
    }
  }

  const completeProduct = await getProduct(id)

  revalidatePath('/products')
  return { data: completeProduct }
}

const deleteProduct = async (id: string) => {
  const supabase = createClient()

  const { data: productImages } = await supabase
    .from('product_images')
    .select('image_url')
    .eq('product_id', id)

  const { error } = await supabase.from('products').delete().eq('id', id)

  if (error) {
    console.error('Error deleting product:', error)
    return {
      error: 'Failed to delete product',
      details: error.message,
    }
  }

  if (productImages && productImages.length > 0) {
    const imageUrls = productImages.map((img) => img.image_url)
    deleteMultipleFilesFromStorage(imageUrls).catch((error) => {
      console.error('Failed to delete product images from storage:', error)
    })
  }

  revalidatePath('/products')
  return { success: true }
}

const updateProductStatus = async (
  id: string,
  status: 'active' | 'inactive' | 'out_of_stock',
) => {
  const supabase = createClient()

  const { data, error } = await supabase
    .from('products')
    .update({ status })
    .eq('id', id)
    .select(
      `
      *,
      images:product_images(*)
    `,
    )
    .single()

  if (error) {
    console.error('Error updating product status:', error)
    return {
      error: 'Failed to update product status',
      details: error.message,
    }
  }

  revalidatePath('/products')
  return { data: data as Product }
}

const searchProducts = async (query: string) => {
  const supabase = createClient()

  const { data, error } = await supabase
    .from('products')
    .select(
      `
      *,
      images:product_images(*)
    `,
    )
    .or(
      `name.ilike.%${query}%,category.ilike.%${query}%,description.ilike.%${query}%`,
    )
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error searching products:', error)
    throw new Error('Failed to search products')
  }

  return data as Product[]
}

const getProductsByCategory = async (category: string) => {
  const supabase = createClient()

  const { data, error } = await supabase
    .from('products')
    .select(
      `
      *,
      images:product_images(*)
    `,
    )
    .eq('category', category)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching products by category:', error)
    throw new Error('Failed to fetch products by category')
  }

  return data as Product[]
}

const getLowStockProducts = async (threshold: number = 10) => {
  const supabase = createClient()

  const { data, error } = await supabase
    .from('products')
    .select(
      `
      *,
      images:product_images(*)
    `,
    )
    .lte('stock', threshold)
    .eq('status', 'active')
    .order('stock', { ascending: true })

  if (error) {
    console.error('Error fetching low stock products:', error)
    throw new Error('Failed to fetch low stock products')
  }

  return data as Product[]
}

const getProductImages = async (productId: string) => {
  const supabase = createClient()

  const { data, error } = await supabase
    .from('product_images')
    .select('*')
    .eq('product_id', productId)
    .order('sort_order', { ascending: true })

  if (error) {
    console.error('Error fetching product images:', error)
    throw new Error('Failed to fetch product images')
  }

  return data as ProductImage[]
}

const addProductImage = async (
  productId: string,
  imageData: ProductImageData,
) => {
  const supabase = createClient()

  const validatedImage = productImageSchema.safeParse(imageData)

  if (!validatedImage.success) {
    return {
      error: 'Invalid image data',
      details: validatedImage.error.flatten().fieldErrors,
    }
  }

  const { data, error } = await supabase
    .from('product_images')
    .insert([{ ...validatedImage.data, product_id: productId }])
    .select()
    .single()

  if (error) {
    console.error('Error adding product image:', error)
    return {
      error: 'Failed to add product image',
      details: error.message,
    }
  }

  revalidatePath('/products')
  return { data: data as ProductImage }
}

const updateProductImage = async (
  imageId: string,
  imageData: Partial<ProductImageData>,
) => {
  const supabase = createClient()

  const { data, error } = await supabase
    .from('product_images')
    .update(imageData)
    .eq('id', imageId)
    .select()
    .single()

  if (error) {
    console.error('Error updating product image:', error)
    return {
      error: 'Failed to update product image',
      details: error.message,
    }
  }

  revalidatePath('/products')
  return { data: data as ProductImage }
}

const deleteProductImage = async (imageId: string) => {
  const supabase = createClient()

  const { data: imageData, error: fetchError } = await supabase
    .from('product_images')
    .select('image_url')
    .eq('id', imageId)
    .single()

  if (fetchError) {
    console.error('Error fetching image data:', fetchError)
    return {
      error: 'Failed to fetch image data',
      details: fetchError.message,
    }
  }

  const { error: deleteError } = await supabase
    .from('product_images')
    .delete()
    .eq('id', imageId)

  if (deleteError) {
    console.error('Error deleting product image:', deleteError)
    return {
      error: 'Failed to delete product image',
      details: deleteError.message,
    }
  }

  if (imageData?.image_url) {
    await deleteFileFromStorage(imageData.image_url).catch((error) => {
      console.error('Failed to delete image from storage:', error)
    })
  }

  revalidatePath('/products')
  return { success: true }
}

const reorderProductImages = async (
  productId: string,
  imageOrders: { id: string; sort_order: number }[],
) => {
  const supabase = createClient()

  const updatePromises = imageOrders.map(({ id, sort_order }) =>
    supabase
      .from('product_images')
      .update({ sort_order })
      .eq('id', id)
      .eq('product_id', productId),
  )

  const results = await Promise.all(updatePromises)

  const hasError = results.some((result: { error: unknown }) => result.error)
  if (hasError) {
    console.error('Error reordering product images')
    return {
      error: 'Failed to reorder product images',
    }
  }

  revalidatePath('/products')
  return { success: true }
}

export {
  getProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
  updateProductStatus,
  searchProducts,
  getProductsByCategory,
  getLowStockProducts,
  getProductImages,
  addProductImage,
  updateProductImage,
  deleteProductImage,
  reorderProductImages,
}

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import {
  getProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
  getProductsByCategory,
} from '@/actions/products'

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

export const productKeys = {
  all: ['products'] as const,
  lists: () => [...productKeys.all, 'list'] as const,
  list: (filters: string) => [...productKeys.lists(), { filters }] as const,
  details: () => [...productKeys.all, 'detail'] as const,
  detail: (id: string) => [...productKeys.details(), id] as const,
  categories: (categoryId: number) =>
    [...productKeys.all, 'category', categoryId] as const,
}

export const useProducts = () => {
  return useQuery({
    queryKey: productKeys.lists(),
    queryFn: async () => {
      const result = await getProducts()
      if (!result.success) {
        throw new Error(result.error || 'Failed to fetch products')
      }
      return result.data
    },
    staleTime: 5 * 60 * 1000,
  })
}

export const useProduct = (id: string) => {
  return useQuery({
    queryKey: productKeys.detail(id),
    queryFn: async () => {
      const result = await getProduct(id)
      if (!result.success) {
        throw new Error(result.error || 'Failed to fetch product')
      }
      return result.data
    },
    enabled: !!id,
  })
}

export const useProductsByCategory = (categoryId: number) => {
  return useQuery({
    queryKey: productKeys.categories(categoryId),
    queryFn: async () => {
      const result = await getProductsByCategory(categoryId)
      if (!result.success) {
        throw new Error(result.error || 'Failed to fetch products by category')
      }
      return result.data
    },
    enabled: !!categoryId,
  })
}

export const useCreateProduct = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({
      productData,
      priceData,
      imageData,
      optionData,
    }: {
      productData: ProductData
      priceData: ProductPriceData
      imageData?: ProductImageData[]
      optionData?: ProductOptionData[]
    }) => {
      const result = await createProduct(
        productData,
        priceData,
        imageData,
        optionData,
      )
      if (!result.success) {
        throw new Error(result.error || 'Failed to create product')
      }
      return result.data
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: productKeys.lists() })
      queryClient.setQueryData(productKeys.detail(data.id.toString()), data)
      toast.success('Product created successfully')
    },
    onError: (error: Error) => {
      toast.error(`Failed to create product: ${error.message}`)
    },
  })
}

export const useUpdateProduct = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({
      id,
      productData,
      priceData,
      imageData,
      optionData,
    }: {
      id: string
      productData: ProductData
      priceData?: ProductPriceData
      imageData?: ProductImageData[]
      optionData?: ProductOptionData[]
    }) => {
      const result = await updateProduct(
        id,
        productData,
        priceData,
        imageData,
        optionData,
      )
      if (!result.success) {
        throw new Error(result.error || 'Failed to update product')
      }
      return result.data
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: productKeys.lists() })
      queryClient.setQueryData(productKeys.detail(variables.id), data)
      toast.success('Product updated successfully')
    },
    onError: (error: Error) => {
      toast.error(`Failed to update product: ${error.message}`)
    },
  })
}

export const useDeleteProduct = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (id: string) => {
      const result = await deleteProduct(id)
      if (!result.success) {
        throw new Error(result.error || 'Failed to delete product')
      }
      return result
    },
    onSuccess: (_, deletedId) => {
      queryClient.invalidateQueries({ queryKey: productKeys.lists() })
      queryClient.removeQueries({ queryKey: productKeys.detail(deletedId) })
      toast.success('Product deleted successfully')
    },
    onError: (error: Error) => {
      toast.error(`Failed to delete product: ${error.message}`)
    },
  })
}

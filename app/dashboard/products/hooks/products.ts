'use client'

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import {
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
  type ProductFormData,
  type ProductImageData,
} from '@/actions/products'
import { Product } from '@/types/product'

export const productKeys = {
  all: ['products'] as const,
  lists: () => [...productKeys.all, 'list'] as const,
  list: (filters: Record<string, unknown>) =>
    [...productKeys.lists(), filters] as const,
  details: () => [...productKeys.all, 'detail'] as const,
  detail: (id: string) => [...productKeys.details(), id] as const,
  search: (query: string) => [...productKeys.all, 'search', query] as const,
  category: (category: string) =>
    [...productKeys.all, 'category', category] as const,
  lowStock: (threshold: number) =>
    [...productKeys.all, 'lowStock', threshold] as const,
}

export function useProducts() {
  return useQuery({
    queryKey: productKeys.lists(),
    queryFn: getProducts,
    staleTime: 1000 * 60 * 5,
  })
}

export function useProduct(id: string) {
  return useQuery({
    queryKey: productKeys.detail(id),
    queryFn: () => getProduct(id),
    enabled: !!id,
  })
}

export function useSearchProducts(query: string) {
  return useQuery({
    queryKey: productKeys.search(query),
    queryFn: () => searchProducts(query),
    enabled: query.length > 0,
    staleTime: 1000 * 60 * 2,
  })
}

export function useProductsByCategory(category: string) {
  return useQuery({
    queryKey: productKeys.category(category),
    queryFn: () => getProductsByCategory(category),
    enabled: !!category,
  })
}

export function useLowStockProducts(threshold: number = 10) {
  return useQuery({
    queryKey: productKeys.lowStock(threshold),
    queryFn: () => getLowStockProducts(threshold),
    staleTime: 1000 * 60 * 10,
  })
}

export function useCreateProduct() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      product,
      images,
    }: {
      product: ProductFormData
      images?: ProductImageData[]
    }) => createProduct(product, images),
    onSuccess: (result) => {
      if (result.data) {
        queryClient.invalidateQueries({ queryKey: productKeys.lists() })

        queryClient.setQueryData(
          productKeys.detail(result.data.id),
          result.data,
        )

        toast.success('Product created successfully!')
      } else if (result.error) {
        toast.error(result.error)
      }
    },
    onError: (error) => {
      console.error('Create product error:', error)
      toast.error('Failed to create product')
    },
  })
}

export function useUpdateProduct() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      id,
      product,
      images,
    }: {
      id: string
      product: ProductFormData
      images?: ProductImageData[]
    }) => updateProduct(id, product, images),
    onSuccess: (result, variables) => {
      if (result.data) {
        queryClient.setQueryData(productKeys.detail(variables.id), result.data)

        queryClient.setQueryData(
          productKeys.lists(),
          (oldData: Product[] | undefined) => {
            if (!oldData) return oldData
            return oldData.map((product) =>
              product.id === variables.id ? result.data! : product,
            )
          },
        )

        queryClient.invalidateQueries({ queryKey: productKeys.lists() })

        toast.success('Product updated successfully!')
      } else if (result.error) {
        toast.error(result.error)
      }
    },
    onError: (error) => {
      console.error('Update product error:', error)
      toast.error('Failed to update product')
    },
  })
}

export function useDeleteProduct() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: deleteProduct,
    onSuccess: (result, productId) => {
      if (result.success) {
        queryClient.setQueryData(
          productKeys.lists(),
          (oldData: Product[] | undefined) => {
            if (!oldData) return oldData
            return oldData.filter((product) => product.id !== productId)
          },
        )

        queryClient.removeQueries({ queryKey: productKeys.detail(productId) })

        queryClient.invalidateQueries({ queryKey: productKeys.lists() })

        toast.success('Product deleted successfully!')
      } else if (result.error) {
        toast.error(result.error)
      }
    },
    onError: (error) => {
      console.error('Delete product error:', error)
      toast.error('Failed to delete product')
    },
  })
}

export function useUpdateProductStatus() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      id,
      status,
    }: {
      id: string
      status: 'active' | 'inactive' | 'out_of_stock'
    }) => updateProductStatus(id, status),
    onSuccess: (result, variables) => {
      if (result.data) {
        queryClient.setQueryData(productKeys.detail(variables.id), result.data)

        queryClient.setQueryData(
          productKeys.lists(),
          (oldData: Product[] | undefined) => {
            if (!oldData) return oldData
            return oldData.map((product) =>
              product.id === variables.id ? result.data! : product,
            )
          },
        )

        queryClient.invalidateQueries({ queryKey: productKeys.lists() })

        toast.success('Product status updated successfully!')
      } else if (result.error) {
        toast.error(result.error)
      }
    },
    onError: (error) => {
      console.error('Update product status error:', error)
      toast.error('Failed to update product status')
    },
  })
}

export function useOptimisticProductUpdate() {
  const queryClient = useQueryClient()

  return {
    updateProductOptimistically: (id: string, updates: Partial<Product>) => {
      queryClient.setQueryData(
        productKeys.detail(id),
        (oldData: Product | undefined) => {
          if (!oldData) return oldData
          return { ...oldData, ...updates }
        },
      )

      queryClient.setQueryData(
        productKeys.lists(),
        (oldData: Product[] | undefined) => {
          if (!oldData) return oldData
          return oldData.map((product) =>
            product.id === id ? { ...product, ...updates } : product,
          )
        },
      )
    },
    revertOptimisticUpdate: (id: string) => {
      queryClient.invalidateQueries({ queryKey: productKeys.detail(id) })
      queryClient.invalidateQueries({ queryKey: productKeys.lists() })
    },
  }
}

export function useProductImages(productId: string) {
  return useQuery({
    queryKey: [...productKeys.detail(productId), 'images'],
    queryFn: () => getProductImages(productId),
    enabled: !!productId,
  })
}

export function useAddProductImage() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      productId,
      imageData,
    }: {
      productId: string
      imageData: ProductImageData
    }) => addProductImage(productId, imageData),
    onSuccess: (result, variables) => {
      if (result.data) {
        queryClient.invalidateQueries({
          queryKey: [...productKeys.detail(variables.productId), 'images'],
        })

        queryClient.invalidateQueries({
          queryKey: productKeys.detail(variables.productId),
        })
        queryClient.invalidateQueries({ queryKey: productKeys.lists() })

        toast.success('Image added successfully!')
      } else if (result.error) {
        toast.error(result.error)
      }
    },
    onError: (error) => {
      console.error('Add product image error:', error)
      toast.error('Failed to add image')
    },
  })
}

export function useUpdateProductImage() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      imageId,
      imageData,
    }: {
      imageId: string
      imageData: Partial<ProductImageData>
    }) => updateProductImage(imageId, imageData),
    onSuccess: (result) => {
      if (result.data) {
        queryClient.invalidateQueries({ queryKey: productKeys.all })

        toast.success('Image updated successfully!')
      } else if (result.error) {
        toast.error(result.error)
      }
    },
    onError: (error) => {
      console.error('Update product image error:', error)
      toast.error('Failed to update image')
    },
  })
}

export function useDeleteProductImage() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: deleteProductImage,
    onSuccess: (result) => {
      if (result.success) {
        queryClient.invalidateQueries({ queryKey: productKeys.all })

        toast.success('Image deleted successfully!')
      } else if (result.error) {
        toast.error(result.error)
      }
    },
    onError: (error) => {
      console.error('Delete product image error:', error)
      toast.error('Failed to delete image')
    },
  })
}

export function useReorderProductImages() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      productId,
      imageOrders,
    }: {
      productId: string
      imageOrders: { id: string; sort_order: number }[]
    }) => reorderProductImages(productId, imageOrders),
    onSuccess: (result, variables) => {
      if (result.success) {
        queryClient.invalidateQueries({
          queryKey: [...productKeys.detail(variables.productId), 'images'],
        })

        queryClient.invalidateQueries({
          queryKey: productKeys.detail(variables.productId),
        })

        toast.success('Images reordered successfully!')
      } else if (result.error) {
        toast.error(result.error)
      }
    },
    onError: (error) => {
      console.error('Reorder product images error:', error)
      toast.error('Failed to reorder images')
    },
  })
}

import { useAuth } from '@/contexts/AuthContext'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  getCartItems,
  getCartSummary,
  getCartDetails,
  getCartCount,
  addToCart,
  updateCartItem as updateCartItemAction,
  removeFromCart as removeFromCartAction,
  clearCart as clearCartAction,
  type AddToCartData,
  type UpdateCartItemData,
} from '@/actions/carts'

const useCartItems = () => {
  const { profile } = useAuth()

  return useQuery({
    queryKey: ['cart', 'items', profile?.id],
    queryFn: async () => {
      if (!profile?.id) return []
      return await getCartItems(profile.id)
    },
    enabled: !!profile?.id,
    staleTime: 1000 * 30,
  })
}

const useCartSummary = () => {
  const { profile } = useAuth()

  return useQuery({
    queryKey: ['cart', 'summary', profile?.id],
    queryFn: async () => {
      if (!profile?.id) return null
      return await getCartSummary(profile.id)
    },
    enabled: !!profile?.id,
    staleTime: 1000 * 30,
  })
}

const useCartDetails = () => {
  const { profile } = useAuth()

  return useQuery({
    queryKey: ['cart', 'details', profile?.id],
    queryFn: async () => {
      if (!profile?.id) return []
      return await getCartDetails(profile.id)
    },
    enabled: !!profile?.id,
    staleTime: 1000 * 30,
  })
}

const useCartCount = () => {
  const { profile } = useAuth()

  return useQuery({
    queryKey: ['cart', 'count', profile?.id],
    queryFn: async () => {
      if (!profile?.id) return 0
      return await getCartCount(profile.id)
    },
    enabled: !!profile?.id,
    staleTime: 1000 * 30,
  })
}

const useAddToCart = () => {
  const queryClient = useQueryClient()
  const { profile } = useAuth()

  return useMutation({
    mutationFn: async (data: Omit<AddToCartData, 'customer_id'>) => {
      if (!profile?.id) {
        throw new Error('Please login to add items to cart')
      }

      const result = await addToCart({
        ...data,
        customer_id: profile.id,
      })

      if (result.error) {
        throw new Error(result.details as string)
      }

      return result
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart'] })
    },
    onError: (error) => {
      console.error('Add to cart error:', error)
    },
  })
}

const useUpdateCartItem = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({
      cartItemId,
      updateData,
    }: {
      cartItemId: string
      updateData: UpdateCartItemData
    }) => {
      const result = await updateCartItemAction(cartItemId, updateData)

      if (result.error) {
        throw new Error(result.details as string)
      }

      return result
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart'] })
    },
    onError: (error) => {
      console.error('Update cart item error:', error)
    },
  })
}

const useRemoveFromCart = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (cartItemId: string) => {
      const result = await removeFromCartAction(cartItemId)

      if (result.error) {
        throw new Error(result.details as string)
      }

      return result
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart'] })
    },
    onError: (error) => {
      console.error('Remove from cart error:', error)
    },
  })
}

const useClearCart = () => {
  const queryClient = useQueryClient()
  const { profile } = useAuth()

  return useMutation({
    mutationFn: async () => {
      if (!profile?.id) {
        throw new Error('Please login to clear cart')
      }

      const result = await clearCartAction(profile.id)

      if (result.error) {
        throw new Error(result.details as string)
      }

      return result
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart'] })
    },
    onError: (error) => {
      console.error('Clear cart error:', error)
    },
  })
}

export {
  useCartItems,
  useCartSummary,
  useCartDetails,
  useCartCount,
  useAddToCart,
  useUpdateCartItem,
  useRemoveFromCart,
  useClearCart,
}

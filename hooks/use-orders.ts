import { useAuth } from '@/contexts/AuthContext'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  getCustomerOrders,
  getOrderById,
  createOrder,
  updateOrderStatus,
  cancelOrder,
  getOrderStatistics,
  type CreateOrderData,
  type Order,
} from '@/actions/orders'

const useCustomerOrders = () => {
  const { profile } = useAuth()

  return useQuery({
    queryKey: ['orders', 'customer', profile?.id],
    queryFn: async () => {
      if (!profile?.id) return []
      return await getCustomerOrders(profile.id)
    },
    enabled: !!profile?.id,
    staleTime: 1000 * 60 * 5,
  })
}

const useOrder = (orderId: string) => {
  return useQuery({
    queryKey: ['order', orderId],
    queryFn: async () => {
      if (!orderId) return null
      return await getOrderById(orderId)
    },
    enabled: !!orderId,
    staleTime: 1000 * 60 * 2,
  })
}

const useCreateOrder = () => {
  const queryClient = useQueryClient()
  const { profile } = useAuth()

  return useMutation({
    mutationFn: async (orderData: Omit<CreateOrderData, 'customer_id'>) => {
      if (!profile?.id) {
        throw new Error('Please login to create an order')
      }

      const result = await createOrder({
        ...orderData,
        customer_id: profile.id,
      })

      if (result.error) {
        throw new Error(result.details as string)
      }

      return result
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] })
      queryClient.invalidateQueries({ queryKey: ['order-statistics'] })
    },
    onError: (error) => {
      console.error('Create order error:', error)
    },
  })
}

const useUpdateOrderStatus = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({
      orderId,
      status,
      notes,
      updatedBy,
    }: {
      orderId: string
      status: Order['status']
      notes?: string
      updatedBy?: string
    }) => {
      const result = await updateOrderStatus(orderId, status, notes, updatedBy)

      if (result.error) {
        throw new Error(result.details as string)
      }

      return result
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['orders'] })
      queryClient.invalidateQueries({ queryKey: ['order', variables.orderId] })
      queryClient.invalidateQueries({ queryKey: ['order-statistics'] })
    },
    onError: (error) => {
      console.error('Update order status error:', error)
    },
  })
}

const useCancelOrder = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({
      orderId,
      reason,
    }: {
      orderId: string
      reason?: string
    }) => {
      const result = await cancelOrder(orderId, reason)

      if (result.error) {
        throw new Error(result.details as string)
      }

      return result
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['orders'] })
      queryClient.invalidateQueries({ queryKey: ['order', variables.orderId] })
      queryClient.invalidateQueries({ queryKey: ['order-statistics'] })
    },
    onError: (error) => {
      console.error('Cancel order error:', error)
    },
  })
}

const useOrderStatistics = () => {
  const { profile } = useAuth()

  return useQuery({
    queryKey: ['order-statistics', profile?.id],
    queryFn: async () => {
      if (!profile?.id) return null
      return await getOrderStatistics(profile.id)
    },
    enabled: !!profile?.id,
    staleTime: 1000 * 60 * 10,
  })
}

export {
  useCustomerOrders,
  useOrder,
  useCreateOrder,
  useUpdateOrderStatus,
  useCancelOrder,
  useOrderStatistics,
}

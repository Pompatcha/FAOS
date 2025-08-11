import { useAuth } from '@/contexts/AuthContext'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  getCustomerOrders,
  getOrderById,
  createOrderWithPaymentLink,
  createStripeInstantOrder,
  updateOrderStatus,
  getOrderPaymentLink,
  refreshPaymentLink,
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

const useCreateOrderWithPayment = () => {
  const queryClient = useQueryClient()
  const { profile } = useAuth()

  return useMutation({
    mutationFn: async ({
      orderData,
      paymentMethod = 'card',
    }: {
      orderData: Omit<CreateOrderData, 'customer_id'>
      paymentMethod?: 'card' | 'qr'
    }) => {
      if (!profile?.id) {
        throw new Error('Please login to create an order')
      }

      const result = await createStripeInstantOrder(
        {
          ...orderData,
          customer_id: profile.id,
        },
        paymentMethod,
      )

      if (!result.success) {
        throw new Error(result.error || 'Failed to create order')
      }

      return result
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] })
      queryClient.invalidateQueries({ queryKey: ['order-statistics'] })
    },
    onError: (error) => {
      console.error('Create order with payment error:', error)
    },
  })
}

const useCreateOrder = () => {
  const queryClient = useQueryClient()
  const { profile } = useAuth()

  return useMutation({
    mutationFn: async ({
      orderData,
      paymentMethod = 'card',
    }: {
      orderData: Omit<CreateOrderData, 'customer_id'>
      paymentMethod?: 'card' | 'qr'
    }) => {
      if (!profile?.id) {
        throw new Error('Please login to create an order')
      }

      const result = await createOrderWithPaymentLink(
        {
          ...orderData,
          customer_id: profile.id,
        },
        paymentMethod,
      )

      if (!result.success) {
        throw new Error(result.error || 'Failed to create order')
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

      if (!result.success) {
        throw new Error(result.error || 'Failed to update order status')
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

const useOrderPaymentLink = (orderId: string) => {
  return useQuery({
    queryKey: ['order-payment-link', orderId],
    queryFn: async () => {
      if (!orderId) return null
      return await getOrderPaymentLink(orderId)
    },
    enabled: !!orderId,
    staleTime: 1000 * 60 * 1,
    refetchOnWindowFocus: false,
  })
}

const useRefreshPaymentLink = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({
      orderId,
      paymentMethod = 'card',
    }: {
      orderId: string
      paymentMethod?: 'card' | 'qr'
    }) => {
      const result = await refreshPaymentLink(orderId, paymentMethod)

      if (!result.success) {
        throw new Error(result.error || 'Failed to refresh payment link')
      }

      return result
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['orders'] })
      queryClient.invalidateQueries({ queryKey: ['order', variables.orderId] })
      queryClient.invalidateQueries({
        queryKey: ['order-payment-link', variables.orderId],
      })
    },
    onError: (error) => {
      console.error('Refresh payment link error:', error)
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

      if (!result.success) {
        throw new Error(result.error || 'Failed to cancel order')
      }

      return result
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['orders'] })
      queryClient.invalidateQueries({ queryKey: ['order', variables.orderId] })
      queryClient.invalidateQueries({ queryKey: ['order-statistics'] })
      queryClient.invalidateQueries({
        queryKey: ['order-payment-link', variables.orderId],
      })
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

const usePendingOrdersWithPayment = () => {
  const { profile } = useAuth()

  return useQuery({
    queryKey: ['pending-orders-payment', profile?.id],
    queryFn: async () => {
      if (!profile?.id) return []
      const orders = await getCustomerOrders(profile.id)
      return orders.filter(
        (order) => order.status === 'pending' && order.payment_link,
      )
    },
    enabled: !!profile?.id,
    staleTime: 1000 * 60 * 2,
  })
}

const useExpiredOrdersCheck = () => {
  const { profile } = useAuth()

  return useQuery({
    queryKey: ['expired-orders-check', profile?.id],
    queryFn: async () => {
      if (!profile?.id) return { total: 0, expiringSoon: 0 }

      const orders = await getCustomerOrders(profile.id)
      const pendingOrders = orders.filter((order) => order.status === 'pending')

      const now = new Date()
      const oneDayFromNow = new Date(now.getTime() + 24 * 60 * 60 * 1000)

      const expiringSoon = pendingOrders.filter((order) => {
        if (!order.session_expires_at) return false
        const expiryDate = new Date(order.session_expires_at)
        return expiryDate > now && expiryDate < oneDayFromNow
      })

      return {
        total: pendingOrders.length,
        expiringSoon: expiringSoon.length,
        expiringSoonOrders: expiringSoon,
      }
    },
    enabled: !!profile?.id,
    staleTime: 1000 * 60 * 5,
  })
}

export {
  useCustomerOrders,
  useOrder,
  useCreateOrder,
  useCreateOrderWithPayment,
  useUpdateOrderStatus,
  useOrderPaymentLink,
  useRefreshPaymentLink,
  useCancelOrder,
  useOrderStatistics,
  usePendingOrdersWithPayment,
  useExpiredOrdersCheck,
}

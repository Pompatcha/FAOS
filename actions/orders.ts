'use server'

import { createClient } from '@/utils/supabase/client'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'

export interface Order {
  id: string
  order_number: string
  customer_id: string
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled'
  total_amount: number
  shipping_address: string
  notes?: string
  created_at: string
  updated_at: string
  shipped_at?: string
  delivered_at?: string
}

export interface OrderItem {
  id: string
  order_id: string
  product_id: string
  product_name: string
  quantity: number
  unit_price: number
  total_price: number
  created_at: string
}

export interface OrderStatusHistory {
  id: string
  order_id: string
  status: string
  notes?: string
  created_at: string
  created_by?: string
}

export interface OrderWithDetails extends Order {
  order_items: OrderItem[]
  order_status_history: OrderStatusHistory[]
}

const orderSchema = z.object({
  customer_id: z.string().uuid(),
  total_amount: z.number().positive(),
  shipping_address: z.string().min(1, 'Shipping address is required'),
  notes: z.string().optional(),
  items: z.array(
    z.object({
      product_id: z.string().uuid(),
      product_name: z.string().min(1),
      quantity: z.number().positive(),
      unit_price: z.number().positive(),
      total_price: z.number().positive(),
    }),
  ),
})

export type CreateOrderData = z.infer<typeof orderSchema>

const getCustomerOrders = async (
  customerId: string,
): Promise<OrderWithDetails[]> => {
  const supabase = createClient()

  const { data, error } = await supabase
    .from('orders')
    .select(
      `
      *,
      order_items (*),
      order_status_history (*)
    `,
    )
    .eq('customer_id', customerId)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching customer orders:', error)
    throw new Error('Failed to fetch orders')
  }

  return data || []
}

const getOrderById = async (
  orderId: string,
): Promise<OrderWithDetails | null> => {
  const supabase = createClient()

  const { data, error } = await supabase
    .from('orders')
    .select(
      `
      *,
      order_items (*),
      order_status_history (*)
    `,
    )
    .eq('id', orderId)
    .single()

  if (error) {
    console.error('Error fetching order:', error)
    return null
  }

  return data
}

const createOrder = async (orderData: CreateOrderData) => {
  const supabase = createClient()

  const validatedFields = orderSchema.safeParse(orderData)

  if (!validatedFields.success) {
    return {
      error: 'Invalid fields',
      details: validatedFields.error.flatten().fieldErrors,
    }
  }

  const { items, ...orderFields } = validatedFields.data

  try {
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .insert([orderFields])
      .select()
      .single()

    if (orderError) {
      throw orderError
    }

    const orderItems = items.map((item) => ({
      ...item,
      order_id: order.id,
    }))

    const { error: itemsError } = await supabase
      .from('order_items')
      .insert(orderItems)

    if (itemsError) {
      throw itemsError
    }

    revalidatePath('/orders')
    return { data: order, success: true }
  } catch (error) {
    console.error('Error creating order:', error)
    return {
      error: 'Failed to create order',
      details: error instanceof Error ? error.message : 'Unknown error',
    }
  }
}

const updateOrderStatus = async (
  orderId: string,
  status: Order['status'],
  notes?: string,
  updatedBy?: string,
) => {
  const supabase = createClient()

  try {
    const updateData: Partial<Order> = { status }

    if (status === 'shipped') {
      updateData.shipped_at = new Date().toISOString()
    } else if (status === 'delivered') {
      updateData.delivered_at = new Date().toISOString()
    }

    const { data: order, error: orderError } = await supabase
      .from('orders')
      .update(updateData)
      .eq('id', orderId)
      .select()
      .single()

    if (orderError) {
      throw orderError
    }

    const { error: historyError } = await supabase
      .from('order_status_history')
      .insert([
        {
          order_id: orderId,
          status,
          notes,
          created_by: updatedBy,
        },
      ])

    if (historyError) {
      console.warn('Failed to add status history:', historyError)
    }

    revalidatePath('/orders')
    return { data: order, success: true }
  } catch (error) {
    console.error('Error updating order status:', error)
    return {
      error: 'Failed to update order status',
      details: error instanceof Error ? error.message : 'Unknown error',
    }
  }
}

const cancelOrder = async (orderId: string, reason?: string) => {
  return updateOrderStatus(orderId, 'cancelled', reason)
}

const getOrderStatistics = async (customerId: string) => {
  const supabase = createClient()

  const { data, error } = await supabase
    .from('orders')
    .select('status')
    .eq('customer_id', customerId)

  if (error) {
    console.error('Error fetching order statistics:', error)
    throw new Error('Failed to fetch order statistics')
  }

  const stats = {
    total: data.length,
    pending: data.filter((o) => o.status === 'pending').length,
    processing: data.filter((o) => o.status === 'processing').length,
    shipped: data.filter((o) => o.status === 'shipped').length,
    delivered: data.filter((o) => o.status === 'delivered').length,
    cancelled: data.filter((o) => o.status === 'cancelled').length,
  }

  return stats
}

export {
  getCustomerOrders,
  getOrderById,
  createOrder,
  updateOrderStatus,
  cancelOrder,
  getOrderStatistics,
}

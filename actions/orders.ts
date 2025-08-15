'use server'

import { createClient } from '@/utils/supabase/client'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'
import { generateCartHash } from '@/lib/cart-hash'
import { createPaymentSession } from './stripe'

export interface Order {
  id: string
  order_number: string
  customer_id: string
  status:
    | 'pending'
    | 'processing'
    | 'shipped'
    | 'delivered'
    | 'cancelled'
    | 'expired'
  total_amount: number
  shipping_address: string
  notes?: string
  cart_hash?: string
  payment_link?: string
  payment_session_id?: string
  session_expires_at?: string
  created_at: string
  updated_at: string
  shipped_at?: string
  delivered_at?: string
  tracking?: string
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
  customers: {
    full_name: string
    email: string
  }
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
    .neq('status', 'expired')
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

const createOrderWithPaymentLink = async (
  orderData: CreateOrderData,
  paymentMethod: 'card' | 'qr' = 'card',
) => {
  const supabase = createClient()

  const validatedFields = orderSchema.safeParse(orderData)

  if (!validatedFields.success) {
    return {
      error: 'Invalid fields',
      details: validatedFields.error.flatten().fieldErrors,
    }
  }

  const { items, ...orderFields } = validatedFields.data

  const cartHash = generateCartHash(items)

  try {
    const sessionExpiresAt = new Date()
    sessionExpiresAt.setDate(sessionExpiresAt.getDate() + 7)

    const { data: order, error: orderError } = await supabase
      .from('orders')
      .insert([
        {
          ...orderFields,
          cart_hash: cartHash,
          session_expires_at: sessionExpiresAt.toISOString(),
          status: 'pending',
        },
      ])
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

    const paymentResult = await createPaymentSession({
      orderId: order.id,
      amount: orderData.total_amount,
      paymentMethod,
      metadata: {
        orderId: order.id,
        customerAddress: orderData.shipping_address,
      },
    })

    if (!paymentResult.success) {
      throw new Error(
        `Payment Error: ${paymentResult.error} - ${paymentResult.details}`,
      )
    }

    const { data: updatedOrder, error: updateError } = await supabase
      .from('orders')
      .update({
        payment_link: paymentResult.url,
        payment_session_id: paymentResult.sessionId,
      })
      .eq('id', order.id)
      .select()
      .single()

    if (updateError) {
      console.warn('Failed to update payment link:', updateError)
    }

    await supabase.from('order_status_history').insert([
      {
        order_id: order.id,
        status: 'pending',
        notes: 'Order created with payment link',
      },
    ])

    revalidatePath('/orders')

    return {
      data: updatedOrder || order,
      success: true,
      paymentLink: paymentResult.url,
      sessionId: paymentResult.sessionId,
    }
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

const getOrderPaymentLink = async (orderId: string): Promise<string | null> => {
  const supabase = createClient()

  const { data, error } = await supabase
    .from('orders')
    .select('payment_link, status')
    .eq('id', orderId)
    .single()

  if (error || !data) {
    return null
  }

  if (data.status !== 'pending') {
    return null
  }

  return data.payment_link
}

const refreshPaymentLink = async (
  orderId: string,
  paymentMethod: 'card' | 'qr' = 'card',
) => {
  const supabase = createClient()

  try {
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .select('*, order_items(*)')
      .eq('id', orderId)
      .eq('status', 'pending')
      .single()

    if (orderError || !order) {
      return { error: 'Order not found or not pending' }
    }

    const paymentResult = await createPaymentSession({
      orderId: order.id,
      amount: order.total_amount,
      paymentMethod,
      metadata: {
        orderId: order.id,
        customerAddress: order.shipping_address,
      },
    })

    if (!paymentResult.success) {
      throw new Error(
        `Payment Error: ${paymentResult.error} - ${paymentResult.details}`,
      )
    }

    const { error: updateError } = await supabase
      .from('orders')
      .update({
        payment_link: paymentResult.url,
        payment_session_id: paymentResult.sessionId,
        session_expires_at: new Date(
          Date.now() + 7 * 24 * 60 * 60 * 1000,
        ).toISOString(),
      })
      .eq('id', orderId)

    if (updateError) {
      throw updateError
    }

    return {
      success: true,
      paymentLink: paymentResult.url,
      sessionId: paymentResult.sessionId,
    }
  } catch (error) {
    console.error('Error refreshing payment link:', error)
    return {
      error: 'Failed to refresh payment link',
      details: error instanceof Error ? error.message : 'Unknown error',
    }
  }
}

const cancelOrder = async (orderId: string, reason?: string) => {
  return updateOrderStatus(orderId, 'cancelled', reason)
}

const getAllOrders = async (): Promise<OrderWithDetails[]> => {
  const supabase = createClient()

  const { data, error } = await supabase
    .from('orders')
    .select(
      `
      *,
      order_items (*),
      order_status_history (*),
      customers!customer_id (
        full_name,
        email
      )
    `,
    )
    .neq('status', 'expired')
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching all orders:', error)
    throw new Error('Failed to fetch orders')
  }

  return data || []
}

const getAllOrderStatistics = async () => {
  const supabase = createClient()

  const { data, error } = await supabase
    .from('orders')
    .select('status')
    .neq('status', 'expired')

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

const updateOrderWithTracking = async (
  orderId: string,
  status: Order['status'],
  trackingNumber?: string,
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

    if (trackingNumber) {
      updateData.tracking = trackingNumber
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

    let historyNotes = notes
    if (trackingNumber) {
      historyNotes = historyNotes
        ? `${historyNotes} - Tracking: ${trackingNumber}`
        : `Tracking number: ${trackingNumber}`
    }

    const { error: historyError } = await supabase
      .from('order_status_history')
      .insert([
        {
          order_id: orderId,
          status,
          notes: historyNotes,
          created_by: updatedBy,
        },
      ])

    if (historyError) {
      console.warn('Failed to add status history:', historyError)
    }

    revalidatePath('/orders')
    revalidatePath('/dashboard/orders')
    return { data: order, success: true }
  } catch (error) {
    console.error('Error updating order with tracking:', error)
    return {
      error: 'Failed to update order',
      details: error instanceof Error ? error.message : 'Unknown error',
    }
  }
}

const getOrderStatistics = async (customerId: string) => {
  const supabase = createClient()

  const { data, error } = await supabase
    .from('orders')
    .select('status')
    .eq('customer_id', customerId)
    .neq('status', 'expired')

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

const createStripeInstantOrder = async (
  orderData: CreateOrderData,
  paymentMethod: 'card' | 'qr' = 'card',
) => {
  try {
    const result = await createOrderWithPaymentLink(orderData, paymentMethod)

    if (!result.success || !result.data) {
      return {
        error: 'Failed to create order',
        details: result.error,
      }
    }

    return {
      success: true,
      data: {
        order: result.data,
        paymentLink: result.paymentLink,
        sessionId: result.sessionId,
        type: 'checkout_session',
        paymentMethod,
      },
    }
  } catch (error) {
    console.error('Error creating instant order:', error)
    return {
      error: 'Failed to create instant order',
      details: error instanceof Error ? error.message : 'Unknown error',
    }
  }
}

export {
  getCustomerOrders,
  getAllOrders,
  getOrderById,
  createOrderWithPaymentLink,
  updateOrderStatus,
  updateOrderWithTracking,
  getOrderPaymentLink,
  refreshPaymentLink,
  cancelOrder,
  getOrderStatistics,
  getAllOrderStatistics,
  createStripeInstantOrder,
}

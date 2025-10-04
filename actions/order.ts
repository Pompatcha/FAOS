'use server'

import type { Tables } from '@/types/supabase'

import { createClient } from '@/utils/supabase/client'

type OrderInput = Omit<Tables<'orders'>, 'id' | 'created_at' | 'updated_at'>
type OrderItemInput = Omit<
  Tables<'order_items'>,
  'id' | 'created_at' | 'order_id'
>

interface CreateOrderFromCartInput {
  userId: string
  shippingAddress?: string
  paymentMethod?: string
  notes?: string
}

const generateOrderNumber = () => {
  const year = new Date().getFullYear()
  const timestamp = Date.now().toString().slice(-6)
  return `ORD-${year}-${timestamp}`
}

const createOrderFromCart = async (input: CreateOrderFromCartInput) => {
  const supabase = createClient()

  try {
    const { data: cartItems, error: cartError } = await supabase
      .from('carts')
      .select(
        `
        *,
        products:product_id (
          id,
          name
        ),
        product_options:product_option_id (
          id,
          option_name,
          option_value
        )
      `,
      )
      .eq('user_id', input.userId)

    if (cartError) throw cartError
    if (!cartItems || cartItems.length === 0) {
      return {
        data: null,
        message: 'Cart is empty',
        success: false,
      }
    }

    const { data: user, error: userError } = await supabase
      .from('users')
      .select('id, first_name, last_name, telephone, shipping_address')
      .eq('userId', input.userId)
      .single()

    if (userError) throw userError

    const totalAmount = cartItems.reduce((sum, item) => {
      return sum + Number(item.unit_price) * item.quantity
    }, 0)

    const orderData: OrderInput = {
      order_number: generateOrderNumber(),
      user_id: user.id,
      status: 'pending',
      total_amount: totalAmount,
      payment_status: 'unpaid',
      payment_date: null,
      notes: input.notes || null,
      shipping_address: input.shippingAddress || user.shipping_address,
    }

    const { data: newOrder, error: orderError } = await supabase
      .from('orders')
      .insert(orderData)
      .select()
      .single()

    if (orderError) throw orderError

    const orderItems: OrderItemInput[] = cartItems.map((item) => ({
      product_id: item.product_id,
      product_option_id: item.product_option_id,
      product_name: item.products?.name || 'Unknown Product',
      product_option_details: item.product_options
        ? {
            [item.product_options.option_name]:
              item.product_options.option_value,
          }
        : null,
      quantity: item.quantity,
      unit_price: item.unit_price,
      total_price: Number(item.unit_price) * item.quantity,
    }))

    const { error: itemsError } = await supabase.from('order_items').insert(
      orderItems.map((item) => ({
        ...item,
        order_id: newOrder.id,
      })),
    )

    if (itemsError) throw itemsError

    const { error: clearCartError } = await supabase
      .from('carts')
      .delete()
      .eq('user_id', input.userId)

    if (clearCartError) throw clearCartError

    return {
      data: newOrder,
      success: true,
    }
  } catch (error) {
    console.error('Create order error:', error)
    return {
      data: null,
      message:
        error instanceof Error ? error.message : 'Failed to create order',
      success: false,
    }
  }
}

const getUserOrders = async (userId: string) => {
  const supabase = createClient()

  try {
    const { data: user, error: userError } = await supabase
      .from('users')
      .select('id')
      .eq('userId', userId)
      .single()

    if (userError) throw userError

    const { data: orders, error: ordersError } = await supabase
      .from('orders')
      .select(
        `
        *,
        order_items (
          *
        )
      `,
      )
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })

    if (ordersError) throw ordersError

    return {
      data: orders || [],
      success: true,
    }
  } catch (error) {
    return {
      data: [],
      message:
        error instanceof Error ? error.message : 'Failed to fetch orders',
      success: false,
    }
  }
}

const getAllOrders = async () => {
  const supabase = createClient()

  try {
    const { data: orders, error: ordersError } = await supabase
      .from('orders')
      .select(
        `
        *,
        order_items (*),
        users:user_id (
          first_name,
          last_name,
          telephone,
          userId
        )
      `,
      )
      .order('created_at', { ascending: false })

    if (ordersError) throw ordersError

    return {
      data: orders || [],
      success: true,
    }
  } catch (error) {
    return {
      data: [],
      message:
        error instanceof Error ? error.message : 'Failed to fetch orders',
      success: false,
    }
  }
}

const getOrder = async (orderId: number) => {
  const supabase = createClient()

  try {
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .select(
        `
        *,
        order_items (*),
        users:user_id (
          first_name,
          last_name,
          telephone,
          userId
        )
      `,
      )
      .eq('id', orderId)
      .single()

    if (orderError) throw orderError

    return {
      data: order,
      success: true,
    }
  } catch (error) {
    return {
      data: null,
      message: error instanceof Error ? error.message : 'Failed to fetch order',
      success: false,
    }
  }
}

const updateOrderStatus = async (orderId: number, status: string) => {
  const supabase = createClient()

  try {
    const { data: updatedOrder, error: updateError } = await supabase
      .from('orders')
      .update({
        status,
        updated_at: new Date().toISOString(),
      })
      .eq('id', orderId)
      .select()
      .single()

    if (updateError) throw updateError

    return {
      data: updatedOrder,
      success: true,
    }
  } catch (error) {
    return {
      data: null,
      message:
        error instanceof Error
          ? error.message
          : 'Failed to update order status',
      success: false,
    }
  }
}

const updatePaymentStatus = async (orderId: number, paymentStatus: string) => {
  const supabase = createClient()

  try {
    const updateData: {
      payment_date?: string
      payment_status?: string
      updated_at?: string
    } = {
      payment_status: paymentStatus,
      updated_at: new Date().toISOString(),
    }

    if (paymentStatus === 'paid') {
      updateData.payment_date = new Date().toISOString()
    }

    const { data: updatedOrder, error: updateError } = await supabase
      .from('orders')
      .update(updateData)
      .eq('id', orderId)
      .select()
      .single()

    if (updateError) throw updateError

    return {
      data: updatedOrder,
      success: true,
    }
  } catch (error) {
    return {
      data: null,
      message:
        error instanceof Error
          ? error.message
          : 'Failed to update payment status',
      success: false,
    }
  }
}

const cancelOrder = async (orderId: number) => {
  const supabase = createClient()

  try {
    const { data: updatedOrder, error: updateError } = await supabase
      .from('orders')
      .update({
        status: 'cancelled',
        updated_at: new Date().toISOString(),
      })
      .eq('id', orderId)
      .select()
      .single()

    if (updateError) throw updateError

    return {
      data: updatedOrder,
      success: true,
    }
  } catch (error) {
    return {
      data: null,
      message:
        error instanceof Error ? error.message : 'Failed to cancel order',
      success: false,
    }
  }
}

const getOrderStatistics = async () => {
  const supabase = createClient()

  try {
    const { count: totalOrders, error: totalError } = await supabase
      .from('orders')
      .select('*', { count: 'exact', head: true })

    if (totalError) throw totalError

    const { count: pendingOrders, error: pendingError } = await supabase
      .from('orders')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'pending')

    if (pendingError) throw pendingError

    const { count: processingOrders, error: processingError } = await supabase
      .from('orders')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'processing')

    if (processingError) throw processingError

    const { count: completedOrders, error: completedError } = await supabase
      .from('orders')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'completed')

    if (completedError) throw completedError

    const { data: revenueData, error: revenueError } = await supabase
      .from('orders')
      .select('total_amount')
      .eq('status', 'completed')

    if (revenueError) throw revenueError

    const totalRevenue =
      revenueData?.reduce((sum, order) => {
        return sum + Number(order.total_amount)
      }, 0) || 0

    return {
      data: {
        totalOrders: totalOrders || 0,
        pendingOrders: pendingOrders || 0,
        processingOrders: processingOrders || 0,
        completedOrders: completedOrders || 0,
        totalRevenue,
      },
      success: true,
    }
  } catch (error) {
    return {
      data: {
        totalOrders: 0,
        pendingOrders: 0,
        processingOrders: 0,
        completedOrders: 0,
        totalRevenue: 0,
      },
      message:
        error instanceof Error
          ? error.message
          : 'Failed to fetch order statistics',
      success: false,
    }
  }
}

export {
  createOrderFromCart,
  getUserOrders,
  getAllOrders,
  getOrder,
  updateOrderStatus,
  updatePaymentStatus,
  cancelOrder,
  getOrderStatistics,
}

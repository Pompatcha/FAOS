'use server'

import { CartItem, CartSummary, CartDetails } from '@/types/carts'
import { createClient } from '@/utils/supabase/client'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'

const addToCartSchema = z.object({
  product_id: z.string().uuid('Invalid product ID'),
  quantity: z.number().int().positive('Quantity must be positive'),
  customer_id: z.string().uuid('Customer ID is required'),
})

const updateCartItemSchema = z.object({
  quantity: z.number().int().positive('Quantity must be positive'),
})

export type AddToCartData = z.infer<typeof addToCartSchema>
export type UpdateCartItemData = z.infer<typeof updateCartItemSchema>

const getCartItems = async (customer_id: string) => {
  const supabase = createClient()

  const { data, error } = await supabase
    .from('shopping_cart')
    .select('*')
    .eq('customer_id', customer_id)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching cart items:', error)
    throw new Error('Failed to fetch cart items')
  }

  return data as CartItem[]
}

const getCartSummary = async (customer_id: string) => {
  const supabase = createClient()

  const { data, error } = await supabase
    .from('cart_summary')
    .select('*')
    .eq('customer_id', customer_id)
    .single()

  if (error) {
    if (error.code === 'PGRST116') {
      return null
    }
    console.error('Error fetching cart summary:', error)
    throw new Error('Failed to fetch cart summary')
  }

  return data as CartSummary
}

const getCartDetails = async (customer_id: string) => {
  const supabase = createClient()

  const { data, error } = await supabase
    .from('cart_details')
    .select('*')
    .eq('customer_id', customer_id)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching cart details:', error)
    throw new Error('Failed to fetch cart details')
  }

  return data as CartDetails[]
}

const addToCart = async (cartData: AddToCartData) => {
  const supabase = createClient()

  const validatedFields = addToCartSchema.safeParse(cartData)

  if (!validatedFields.success) {
    return {
      error: 'Invalid fields',
      details: validatedFields.error.flatten().fieldErrors,
    }
  }

  const { product_id, quantity, customer_id } = validatedFields.data

  const { data: product, error: productError } = await supabase
    .from('products')
    .select('id, status, stock')
    .eq('id', product_id)
    .single()

  if (productError || !product) {
    return {
      error: 'Product not found',
      details: 'The requested product does not exist',
    }
  }

  if (product.status !== 'active') {
    return {
      error: 'Product unavailable',
      details: 'This product is currently not available',
    }
  }

  if (product.stock < quantity) {
    return {
      error: 'Insufficient stock',
      details: `Only ${product.stock} items available`,
    }
  }

  const { data: existingItem, error: existingError } = await supabase
    .from('shopping_cart')
    .select('*')
    .eq('product_id', product_id)
    .eq('customer_id', customer_id)
    .single()

  if (existingError && existingError.code !== 'PGRST116') {
    console.error('Error checking existing cart item:', existingError)
    return {
      error: 'Failed to check cart',
      details: existingError.message,
    }
  }

  let result
  if (existingItem) {
    const newQuantity = existingItem.quantity + quantity

    if (product.stock < newQuantity) {
      return {
        error: 'Insufficient stock',
        details: `Only ${product.stock} items available. You currently have ${existingItem.quantity} in cart.`,
      }
    }

    const { data, error } = await supabase
      .from('shopping_cart')
      .update({ quantity: newQuantity })
      .eq('id', existingItem.id)
      .select()
      .single()

    if (error) {
      console.error('Error updating cart item:', error)
      return {
        error: 'Failed to update cart',
        details: error.message,
      }
    }

    result = { data: data as CartItem }
  } else {
    const { data, error } = await supabase
      .from('shopping_cart')
      .insert([{ product_id, quantity, customer_id }])
      .select()
      .single()

    if (error) {
      console.error('Error adding to cart:', error)
      return {
        error: 'Failed to add to cart',
        details: error.message,
      }
    }

    result = { data: data as CartItem }
  }

  revalidatePath('/cart')
  return result
}

const updateCartItem = async (
  cartItemId: string,
  updateData: UpdateCartItemData,
) => {
  const supabase = createClient()

  const validatedFields = updateCartItemSchema.safeParse(updateData)

  if (!validatedFields.success) {
    return {
      error: 'Invalid fields',
      details: validatedFields.error.flatten().fieldErrors,
    }
  }

  const { quantity } = validatedFields.data

  const { data: cartItem, error: cartError } = await supabase
    .from('shopping_cart')
    .select(
      `
      *,
      product:products(id, stock, status)
    `,
    )
    .eq('id', cartItemId)
    .single()

  if (cartError || !cartItem) {
    return {
      error: 'Cart item not found',
      details: 'The requested cart item does not exist',
    }
  }

  if (cartItem.product.status !== 'active') {
    return {
      error: 'Product unavailable',
      details: 'This product is currently not available',
    }
  }

  if (cartItem.product.stock < quantity) {
    return {
      error: 'Insufficient stock',
      details: `Only ${cartItem.product.stock} items available`,
    }
  }

  const { data, error } = await supabase
    .from('shopping_cart')
    .update({ quantity })
    .eq('id', cartItemId)
    .select()
    .single()

  if (error) {
    console.error('Error updating cart item:', error)
    return {
      error: 'Failed to update cart item',
      details: error.message,
    }
  }

  revalidatePath('/cart')
  return { data: data as CartItem }
}

const removeFromCart = async (cartItemId: string) => {
  const supabase = createClient()

  const { error } = await supabase
    .from('shopping_cart')
    .delete()
    .eq('id', cartItemId)

  if (error) {
    console.error('Error removing from cart:', error)
    return {
      error: 'Failed to remove from cart',
      details: error.message,
    }
  }

  revalidatePath('/cart')
  return { success: true }
}

const clearCart = async (customer_id: string) => {
  const supabase = createClient()

  const { error } = await supabase
    .from('shopping_cart')
    .delete()
    .eq('customer_id', customer_id)

  if (error) {
    console.error('Error clearing cart:', error)
    return {
      error: 'Failed to clear cart',
      details: error.message,
    }
  }

  revalidatePath('/cart')
  return { success: true }
}

const getCartCount = async (customer_id: string) => {
  const summary = await getCartSummary(customer_id)
  return summary ? summary.total_quantity : 0
}

export {
  getCartItems,
  getCartSummary,
  getCartDetails,
  addToCart,
  updateCartItem,
  removeFromCart,
  clearCart,
  getCartCount,
}

'use server'

import type { Tables } from '@/types/supabase'

import { createClient } from '@/utils/supabase/client'

type CartInput = Omit<Tables<'carts'>, 'id' | 'created_at' | 'updated_at'>

const addToCart = async (cartData: CartInput) => {
  const supabase = createClient()

  try {
    const { data: existingItem } = await supabase
      .from('carts')
      .select('*')
      .eq('product_id', cartData.product_id)
      .eq('user_id', cartData.user_id)
      .eq('product_option_id', cartData.product_option_id || null)
      .single()

    if (existingItem) {
      const { data: updatedCart, error: updateError } = await supabase
        .from('carts')
        .update({
          quantity: existingItem.quantity + cartData.quantity,
          updated_at: new Date().toISOString(),
        })
        .eq('id', existingItem.id)
        .select()
        .single()

      if (updateError) {
        throw updateError
      }

      return {
        data: updatedCart,
        success: true,
      }
    } else {
      const { data: newCartItem, error: insertError } = await supabase
        .from('carts')
        .insert(cartData)
        .select()
        .single()

      if (insertError) {
        throw insertError
      }

      return {
        data: newCartItem,
        success: true,
      }
    }
  } catch (error) {
    console.log(error)

    return {
      data: null,
      message:
        error instanceof Error
          ? error.message
          : 'An error occurred while adding to cart',
      success: false,
    }
  }
}

const getCartItems = async (userId: string) => {
  const supabase = createClient()

  try {
    const { data: cartItems, error: fetchError } = await supabase
      .from('carts')
      .select(
        `
        *,
        products:product_id (
          name,
          description,
          short_description,
          images:product_images(
            id, 
            image_url,
            alt_text,
            is_primary
          )
        ),
        product_options:product_option_id (
          option_name,
          option_value
        )
      `,
      )
      .eq('user_id', userId)
      .order('created_at', { ascending: false })

    if (fetchError) {
      throw fetchError
    }

    return {
      data: cartItems || [],
      success: true,
    }
  } catch (error) {
    return {
      data: [],
      message:
        error instanceof Error
          ? error.message
          : 'An error occurred while fetching cart items',
      success: false,
    }
  }
}

const updateCartQuantity = async (cartId: number, quantity: number) => {
  const supabase = createClient()

  try {
    const { data: updatedCart, error: updateError } = await supabase
      .from('carts')
      .update({
        quantity,
        updated_at: new Date().toISOString(),
      })
      .eq('id', cartId)
      .select()
      .single()

    if (updateError) {
      throw updateError
    }

    return {
      data: updatedCart,
      success: true,
    }
  } catch (error) {
    return {
      data: null,
      message:
        error instanceof Error
          ? error.message
          : 'An error occurred while updating cart quantity',
      success: false,
    }
  }
}

const removeFromCart = async (cartId: number) => {
  const supabase = createClient()

  try {
    const { error: deleteError } = await supabase
      .from('carts')
      .delete()
      .eq('id', cartId)

    if (deleteError) {
      throw deleteError
    }

    return {
      success: true,
    }
  } catch (error) {
    return {
      message:
        error instanceof Error
          ? error.message
          : 'An error occurred while removing from cart',
      success: false,
    }
  }
}

const clearCart = async (userId: string) => {
  const supabase = createClient()

  try {
    const { error: deleteError } = await supabase
      .from('carts')
      .delete()
      .eq('user_id', userId)

    if (deleteError) {
      throw deleteError
    }

    return {
      success: true,
    }
  } catch (error) {
    return {
      message:
        error instanceof Error
          ? error.message
          : 'An error occurred while clearing cart',
      success: false,
    }
  }
}

const getCartCount = async (userId: string) => {
  const supabase = createClient()

  try {
    const { count, error: countError } = await supabase
      .from('carts')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', userId)

    if (countError) {
      throw countError
    }

    return {
      data: count || 0,
      success: true,
    }
  } catch (error) {
    return {
      data: 0,
      message:
        error instanceof Error
          ? error.message
          : 'An error occurred while counting cart items',
      success: false,
    }
  }
}

export {
  addToCart,
  getCartItems,
  updateCartQuantity,
  removeFromCart,
  clearCart,
  getCartCount,
}

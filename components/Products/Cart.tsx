'use client'

import { useAuth } from '@/contexts/AuthContext'
import { X, Plus, Minus, Trash2, ShoppingCart, Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import Image from 'next/image'
import {
  useCartDetails,
  useUpdateCartItem,
  useRemoveFromCart,
  useClearCart,
} from '@/hooks/use-carts'

interface CartProps {
  isOpen: boolean
  onClose: () => void
}

const Cart = ({ isOpen, onClose }: CartProps) => {
  const { profile } = useAuth()

  const { data: items = [], isLoading, error } = useCartDetails()
  const updateCartItem = useUpdateCartItem()
  const removeFromCart = useRemoveFromCart()
  const clearCart = useClearCart()

  const getTotalPrice = () => {
    return items.reduce((total, item) => total + item.subtotal, 0)
  }

  const handleUpdateQuantity = async (
    cartItemId: string,
    newQuantity: number,
  ) => {
    if (newQuantity <= 0) {
      handleRemoveItem(cartItemId)
      return
    }

    try {
      await updateCartItem.mutateAsync({
        cartItemId,
        updateData: { quantity: newQuantity },
      })
      toast.success('Cart updated successfully')
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : 'Failed to update cart',
      )
    }
  }

  const handleRemoveItem = async (cartItemId: string) => {
    try {
      await removeFromCart.mutateAsync(cartItemId)
      toast.success('Item removed from cart')
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : 'Failed to remove item',
      )
    }
  }

  const handleClearCart = async () => {
    if (!confirm('Are you sure you want to clear your cart?')) return

    try {
      await clearCart.mutateAsync()
      toast.success('Cart cleared successfully')
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : 'Failed to clear cart',
      )
    }
  }

  if (!isOpen) return null

  if (!profile) {
    return (
      <div className='fixed inset-0 z-50'>
        <div className='bg-opacity-50 absolute inset-0' onClick={onClose} />
        <div className='absolute right-10 bottom-0 max-h-[80vh] w-96 overflow-hidden rounded-t-lg bg-white shadow-2xl'>
          <div className='flex items-center justify-between border-b border-gray-200 bg-[#dda700] p-4 text-white'>
            <h2 className='text-lg font-bold'>Shopping Cart</h2>
            <button
              onClick={onClose}
              className='transition-colors hover:text-gray-200'
            >
              <X className='h-6 w-6' />
            </button>
          </div>
          <div className='p-8 text-center text-gray-500'>
            <ShoppingCart className='mx-auto mb-4 h-12 w-12 text-gray-300' />
            <p>Please login to view your cart</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className='fixed inset-0 z-50'>
      <div className='bg-opacity-50 absolute inset-0' onClick={onClose} />
      <div className='absolute right-10 bottom-0 max-h-[80vh] min-w-[450px] overflow-hidden rounded-t-lg bg-white shadow-2xl'>
        <div className='flex items-center justify-between border-b border-gray-200 bg-[#dda700] p-4 text-white'>
          <h2 className='text-lg font-bold'>Shopping Cart</h2>
          <button
            onClick={onClose}
            className='transition-colors hover:text-gray-200'
          >
            <X className='h-6 w-6' />
          </button>
        </div>

        <div className='max-h-96 flex-1 overflow-y-auto'>
          {isLoading ? (
            <div className='p-8 text-center'>
              <Loader2 className='mx-auto mb-4 h-8 w-8 animate-spin text-gray-400' />
              <p className='text-gray-500'>Loading cart...</p>
            </div>
          ) : error ? (
            <div className='p-8 text-center text-red-500'>
              <p>Failed to load cart items</p>
            </div>
          ) : items.length === 0 ? (
            <div className='p-8 text-center text-gray-500'>
              <ShoppingCart className='mx-auto mb-4 h-12 w-12 text-gray-300' />
              <p>Your cart is empty</p>
            </div>
          ) : (
            <div className='space-y-4 p-4'>
              {items.map((item) => (
                <div
                  key={item.id}
                  className='flex items-center gap-3 rounded-lg border border-gray-200 p-3'
                >
                  {item.product_image && (
                    <Image
                      src={item.product_image}
                      alt={item.product_name}
                      width={48}
                      height={48}
                      className='h-12 w-12 rounded object-cover'
                    />
                  )}

                  <div className='flex-1'>
                    <h3 className='font-medium text-gray-900'>
                      {item.product_name}
                    </h3>
                    <p className='text-sm text-gray-600'>
                      ฿{item.product_price.toLocaleString()}
                    </p>
                    <p className='text-xs text-gray-500'>
                      Stock: {item.product_stock}
                    </p>
                  </div>

                  <div className='flex items-center gap-2'>
                    <button
                      onClick={() =>
                        handleUpdateQuantity(item.id, item.quantity - 1)
                      }
                      disabled={updateCartItem.isPending}
                      className='rounded-full p-1 transition-colors hover:bg-gray-100 disabled:opacity-50'
                    >
                      <Minus className='h-4 w-4' />
                    </button>
                    <span className='min-w-[2rem] rounded bg-gray-100 px-2 py-1 text-center text-sm font-medium'>
                      {item.quantity}
                    </span>
                    <button
                      onClick={() =>
                        handleUpdateQuantity(item.id, item.quantity + 1)
                      }
                      disabled={
                        updateCartItem.isPending ||
                        item.quantity >= item.product_stock
                      }
                      className='rounded-full p-1 transition-colors hover:bg-gray-100 disabled:opacity-50'
                    >
                      <Plus className='h-4 w-4' />
                    </button>
                  </div>

                  <div className='text-right'>
                    <p className='text-sm font-medium text-gray-900'>
                      ฿{item.subtotal.toLocaleString()}
                    </p>
                  </div>

                  <button
                    onClick={() => handleRemoveItem(item.id)}
                    disabled={removeFromCart.isPending}
                    className='p-1 text-red-500 transition-colors hover:text-red-700 disabled:opacity-50'
                  >
                    <Trash2 className='h-4 w-4' />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {items.length > 0 && (
          <div className='border-t border-gray-200 bg-gray-50 p-4'>
            <div className='mb-4 flex items-center justify-between'>
              <span className='text-lg font-bold'>Total:</span>
              <span className='text-lg font-bold text-[#e2b007]'>
                ฿{getTotalPrice().toLocaleString()}
              </span>
            </div>

            <div className='space-y-2'>
              <button
                className='w-full rounded-lg bg-[#e2b007] py-3 font-medium text-white transition-colors hover:bg-[#f3d27a] disabled:opacity-50'
                disabled={updateCartItem.isPending || removeFromCart.isPending}
              >
                Checkout
              </button>
              <button
                onClick={handleClearCart}
                disabled={clearCart.isPending}
                className='w-full rounded-lg bg-gray-500 py-2 font-medium text-white transition-colors hover:bg-gray-600 disabled:opacity-50'
              >
                {clearCart.isPending ? 'Clearing...' : 'Clear Cart'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default Cart

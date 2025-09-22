'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Minus, Plus, Trash2, ShoppingCart } from 'lucide-react'
import { toast } from 'sonner'

import type { FC } from 'react'

import {
  getCartItems,
  updateCartQuantity,
  removeFromCart,
  clearCart,
} from '@/actions/cart'
import { IndexLayout } from '@/components/Layout/Index'
import { Loading } from '@/components/Layout/Loading'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { useAuth, useRequireAuth } from '@/contexts/AuthContext.tsx'
import { priceFormatter } from '@/lib/number'

const CartPage: FC = () => {
  const { user } = useAuth()
  useRequireAuth()

  const queryClient = useQueryClient()
  const { data: cartResult, isLoading } = useQuery({
    queryKey: ['cart', user?.id],
    queryFn: () => getCartItems(user?.id || ''),
    enabled: !!user?.id,
  })

  const cartItems = cartResult?.data || []

  const updateQuantityMutation = useMutation({
    mutationFn: ({ cartId, quantity }: { cartId: number; quantity: number }) =>
      updateCartQuantity(cartId, quantity),
    onSuccess: (result) => {
      if (result.success) {
        queryClient.invalidateQueries({
          queryKey: ['cart', user?.id],
          exact: true,
        })
        queryClient.invalidateQueries({
          queryKey: ['cart/count', user?.id],
          exact: true,
        })
        toast.success('Quantity updated successfully!')
      } else {
        toast.error(result.message || 'Failed to update quantity')
      }
    },
    onError: (error: Error) => {
      toast.error(error.message || 'An error occurred while updating quantity')
    },
  })

  const removeItemMutation = useMutation({
    mutationFn: (cartId: number) => removeFromCart(cartId),
    onSuccess: (result) => {
      if (result.success) {
        queryClient.invalidateQueries({
          queryKey: ['cart', user?.id],
          exact: true,
        })
        queryClient.invalidateQueries({
          queryKey: ['cart/count', user?.id],
          exact: true,
        })
        toast.success('Item removed from cart!')
      } else {
        toast.error(result.message || 'Failed to remove item')
      }
    },
    onError: (error: Error) => {
      toast.error(error.message || 'An error occurred while removing item')
    },
  })

  const clearCartMutation = useMutation({
    mutationFn: () => clearCart(user?.id || ''),
    onSuccess: (result) => {
      if (result.success) {
        queryClient.invalidateQueries({
          queryKey: ['cart', user?.id],
          exact: true,
        })
        queryClient.invalidateQueries({
          queryKey: ['cart/count', user?.id],
          exact: true,
        })
        toast.success('Cart cleared successfully!')
      } else {
        toast.error(result.message || 'Failed to clear cart')
      }
    },
    onError: (error: Error) => {
      toast.error(error.message || 'An error occurred while clearing cart')
    },
  })

  const handleQuantityChange = (cartId: number, newQuantity: number) => {
    if (newQuantity < 1) return
    updateQuantityMutation.mutate({ cartId, quantity: newQuantity })
  }

  const handleRemoveItem = (cartId: number) => {
    removeItemMutation.mutate(cartId)
  }

  const handleClearCart = () => {
    if (cartItems.length === 0) return

    if (confirm('Are you sure you want to clear your cart?')) {
      clearCartMutation.mutate()
    }
  }

  const calculateSubtotal = () => {
    return cartItems.reduce((total, item) => {
      return total + Number(item.unit_price) * item.quantity
    }, 0)
  }

  const calculateTotal = () => {
    return calculateSubtotal()
  }

  if (cartItems.length === 0) {
    return (
      <IndexLayout>
        <Card className='bg-white'>
          <CardContent className='flex flex-col items-center justify-center p-12'>
            <ShoppingCart className='mb-4 h-24 w-24 text-gray-300' />
            <h2 className='mb-2 text-2xl font-semibold text-gray-800'>
              Your cart is empty
            </h2>
            <p className='mb-6 text-gray-600'>
              Add some products to get started
            </p>
            <Button
              onClick={() => window.history.back()}
              className='bg-primary'
            >
              Continue Shopping
            </Button>
          </CardContent>
        </Card>
      </IndexLayout>
    )
  }

  return (
    <IndexLayout>
      <Loading isLoading={isLoading} />
      <div className='grid grid-cols-1 gap-6 lg:grid-cols-3'>
        <div className='lg:col-span-2'>
          <Card className='bg-white'>
            <CardHeader className='flex flex-row items-center justify-between'>
              <CardTitle className='text-2xl'>
                Shopping Cart ({cartItems.length} items)
              </CardTitle>
              <Button
                variant='outline'
                size='sm'
                onClick={handleClearCart}
                disabled={clearCartMutation.isPending}
                className='text-red-600 hover:text-red-700'
              >
                {clearCartMutation.isPending ? 'Clearing...' : 'Clear All'}
              </Button>
            </CardHeader>
            <CardContent className='space-y-4'>
              {cartItems?.map((item) => (
                <div key={item.id} className='rounded-lg border p-4'>
                  <div className='flex flex-col gap-5'>
                    <img
                      className='size-20 object-cover'
                      src={
                        item?.products?.images[0]?.image_url ||
                        '/placeholder.svg'
                      }
                    />

                    <div className='min-w-0 flex-1'>
                      <h3 className='text-lg font-semibold text-gray-800'>
                        {item.products?.name}
                      </h3>

                      {item.product_options && (
                        <p className='mt-1 text-sm text-gray-600'>
                          {item.product_options.option_name}:{' '}
                          {item.product_options.option_value}
                        </p>
                      )}

                      <div className='flex flex-col items-center justify-between sm:flex-row'>
                        <div className='flex items-center space-x-2'>
                          <Button
                            variant='outline'
                            size='sm'
                            onClick={() =>
                              handleQuantityChange(item.id, item.quantity - 1)
                            }
                            disabled={
                              item.quantity <= 1 ||
                              updateQuantityMutation.isPending
                            }
                            className='size-8 p-0'
                          >
                            <Minus className='size-4' />
                          </Button>

                          <span className='w-12 text-center text-sm font-medium'>
                            {item.quantity}
                          </span>

                          <Button
                            variant='outline'
                            size='sm'
                            onClick={() =>
                              handleQuantityChange(item.id, item.quantity + 1)
                            }
                            disabled={updateQuantityMutation.isPending}
                            className='size-8 p-0'
                          >
                            <Plus className='size-4' />
                          </Button>
                        </div>

                        <div className='flex items-center space-x-4'>
                          <div className='text-right'>
                            <p className='text-sm text-gray-500'>
                              {priceFormatter.format(Number(item.unit_price))}{' '}
                              each
                            </p>
                            <p className='text-lg font-semibold text-gray-800'>
                              {priceFormatter.format(
                                Number(item.unit_price) * item.quantity,
                              )}
                            </p>
                          </div>

                          <Button
                            variant='outline'
                            size='sm'
                            onClick={() => handleRemoveItem(item.id)}
                            disabled={removeItemMutation.isPending}
                            className='size-8 p-0 text-red-600 hover:text-red-700'
                          >
                            <Trash2 className='h-4 w-4' />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        <div className='lg:col-span-1'>
          <Card className='sticky top-4 bg-white'>
            <CardHeader>
              <CardTitle className='text-xl'>Order Summary</CardTitle>
            </CardHeader>
            <CardContent className='space-y-4'>
              <div className='flex justify-between text-sm'>
                <span className='text-gray-600'>
                  Items ({cartItems?.length})
                </span>
                <span className='font-medium'>
                  {priceFormatter.format(calculateSubtotal())}
                </span>
              </div>

              <div className='flex justify-between text-sm'>
                <span className='text-gray-600'>Shipping</span>
                <span className='font-medium'>
                  {priceFormatter.format(0.0)}
                </span>
              </div>

              <Separator />

              <div className='flex justify-between text-lg font-semibold'>
                <span>Total</span>
                <span className='text-primary'>
                  {priceFormatter.format(calculateTotal())}
                </span>
              </div>

              <Button className='bg-primary mt-6 w-full py-6 text-lg'>
                Proceed to Checkout
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </IndexLayout>
  )
}

export default CartPage

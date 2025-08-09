'use client'

import { X, Plus, Minus, Trash2, ShoppingCart } from 'lucide-react'

interface CartItem {
  id: string
  name: string
  price: number
  quantity: number
  image?: string
}

interface CartProps {
  isOpen: boolean
  onClose: () => void
  items: CartItem[]
  onUpdateQuantity: (id: string, quantity: number) => void
  onRemoveItem: (id: string) => void
  onClearCart: () => void
}

const Cart = ({
  isOpen,
  onClose,
  items,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
}: CartProps) => {
  const getTotalPrice = () => {
    return items.reduce((total, item) => total + item.price * item.quantity, 0)
  }

  if (!isOpen) return null

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

        <div className='max-h-96 flex-1 overflow-y-auto'>
          {items.length === 0 ? (
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
                  <div className='flex-1'>
                    <h3 className='font-medium text-gray-900'>{item.name}</h3>
                    <p className='text-sm text-gray-600'>฿{item.price}</p>
                  </div>

                  <div className='flex items-center gap-2'>
                    <button
                      onClick={() =>
                        onUpdateQuantity(item.id, item.quantity - 1)
                      }
                      className='rounded-full p-1 transition-colors hover:bg-gray-100'
                    >
                      <Minus className='h-4 w-4' />
                    </button>
                    <span className='min-w-[2rem] rounded bg-gray-100 px-2 py-1 text-center text-sm font-medium'>
                      {item.quantity}
                    </span>
                    <button
                      onClick={() =>
                        onUpdateQuantity(item.id, item.quantity + 1)
                      }
                      className='rounded-full p-1 transition-colors hover:bg-gray-100'
                    >
                      <Plus className='h-4 w-4' />
                    </button>
                  </div>

                  <button
                    onClick={() => onRemoveItem(item.id)}
                    className='p-1 text-red-500 transition-colors hover:text-red-700'
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
              <button className='w-full rounded-lg bg-[#e2b007] py-3 font-medium text-white transition-colors hover:bg-[#f3d27a]'>
                Checkout
              </button>
              <button
                onClick={onClearCart}
                className='w-full rounded-lg bg-gray-500 py-2 font-medium text-white transition-colors hover:bg-gray-600'
              >
                Clear Cart
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export { Cart }

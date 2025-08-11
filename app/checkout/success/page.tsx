'use client'

import { useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useOrder } from '@/hooks/use-orders'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { CheckCircle, Package, Loader2 } from 'lucide-react'
import { format } from 'date-fns'

export default function CheckoutSuccessPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const orderId = searchParams.get('order_id')
  const sessionId = searchParams.get('session_id')

  const { data: order, isLoading } = useOrder(orderId || '')

  useEffect(() => {
    if (!orderId) {
      router.push('/')
    }
  }, [orderId, router])

  if (isLoading) {
    return (
      <div className='container mx-auto flex justify-center px-4 py-8'>
        <Loader2 className='h-8 w-8 animate-spin' />
      </div>
    )
  }

  if (!order) {
    return (
      <div className='container mx-auto px-4 py-8 text-center'>
        <h1 className='text-2xl font-bold text-red-600'>Order not found</h1>
        <Button onClick={() => router.push('/')} className='mt-4'>
          Go Home
        </Button>
      </div>
    )
  }

  return (
    <div className='container mx-auto px-4 py-8'>
      <div className='mx-auto max-w-2xl'>
        <div className='mb-8 text-center'>
          <div className='mb-4 flex justify-center'>
            <CheckCircle className='h-16 w-16 text-green-500' />
          </div>
          <h1 className='mb-2 text-3xl font-bold text-green-600'>
            Payment Successful!
          </h1>
          <p className='text-muted-foreground'>
            Thank you for your order. We&apos;ll send you a confirmation email
            shortly.
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className='flex items-center gap-2'>
              <Package className='h-5 w-5' />
              Order Details
            </CardTitle>
          </CardHeader>
          <CardContent className='space-y-6'>
            {/* Order Info */}
            <div className='grid grid-cols-2 gap-4 text-sm'>
              <div>
                <span className='text-muted-foreground'>Order Number:</span>
                <p className='font-medium'>{order.order_number}</p>
              </div>
              <div>
                <span className='text-muted-foreground'>Order Date:</span>
                <p className='font-medium'>
                  {format(new Date(order.created_at), 'PPP')}
                </p>
              </div>
              <div>
                <span className='text-muted-foreground'>Status:</span>
                <Badge variant='secondary' className='mt-1'>
                  {order.status}
                </Badge>
              </div>
              <div>
                <span className='text-muted-foreground'>Total Amount:</span>
                <p className='text-lg font-medium'>
                  ฿{order.total_amount.toLocaleString()}
                </p>
              </div>
            </div>

            <Separator />

            <div>
              <h3 className='mb-4 font-medium'>Order Items</h3>
              <div className='space-y-3'>
                {order.order_items.map((item) => (
                  <div
                    key={item.id}
                    className='flex items-center justify-between py-2'
                  >
                    <div className='flex-1'>
                      <p className='font-medium'>{item.product_name}</p>
                      <p className='text-muted-foreground text-sm'>
                        ฿{item.unit_price.toLocaleString()} × {item.quantity}
                      </p>
                    </div>
                    <div className='text-right'>
                      <p className='font-medium'>
                        ฿{item.total_price.toLocaleString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <Separator />

            <div>
              <span className='text-muted-foreground text-sm'>
                Shipping Address:
              </span>
              <p className='mt-1 font-medium whitespace-pre-wrap'>
                {order.shipping_address}
              </p>
            </div>

            {order.notes && (
              <>
                <Separator />
                <div>
                  <span className='text-muted-foreground text-sm'>
                    Order Notes:
                  </span>
                  <p className='mt-1 font-medium whitespace-pre-wrap'>
                    {order.notes}
                  </p>
                </div>
              </>
            )}
          </CardContent>
        </Card>

        <div className='mt-8 flex flex-col gap-4 sm:flex-row'>
          <Button
            onClick={() => router.push('/profile/orders')}
            className='flex-1'
          >
            View All Orders
          </Button>
          <Button
            variant='outline'
            onClick={() => router.push('/')}
            className='flex-1'
          >
            Continue Shopping
          </Button>
        </div>

        {sessionId && (
          <div className='bg-muted mt-6 rounded-lg p-4'>
            <p className='text-muted-foreground text-sm'>
              <strong>Payment ID:</strong> {sessionId}
            </p>
            <p className='text-muted-foreground mt-1 text-xs'>
              Keep this information for your records
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

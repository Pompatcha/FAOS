'use client'

import { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Package, Truck, CheckCircle, MapPin } from 'lucide-react'
import { OrderWithDetails, Order } from '@/actions/orders'
import { formatDate } from '@/lib/date'
import { formatPrice } from '@/lib/currency'

interface OrderModalProps {
  isOpen: boolean
  onClose: () => void
  order: OrderWithDetails | null
  onUpdateStatus: (
    orderId: string,
    newStatus: Order['status'],
    trackingNumber?: string,
    notes?: string,
  ) => void
  showConfirmModal: (
    orderId: string,
    newStatus: Order['status'],
    actionText: string,
    description: string,
  ) => void
  isLoading?: boolean
}

export function OrderModal({
  isOpen,
  onClose,
  order,
  onUpdateStatus,
  showConfirmModal,
  isLoading = false,
}: OrderModalProps) {
  const [trackingNumber, setTrackingNumber] = useState('')
  const [notes, setNotes] = useState('')
  const [showShippingForm, setShowShippingForm] = useState(false)

  if (!order) return null

  const customerName = order?.customers?.full_name || 'Unknown Customer'
  const customerEmail = order?.customers?.email || ''

  const getStatusBadge = (status: Order['status']) => {
    switch (status) {
      case 'pending':
        return (
          <Badge
            variant='outline'
            className='border-orange-200 text-orange-600'
          >
            Pending Payment
          </Badge>
        )
      case 'processing':
        return (
          <Badge variant='default' className='bg-blue-500 text-white'>
            Processing
          </Badge>
        )
      case 'shipped':
        return (
          <Badge variant='secondary' className='bg-purple-500 text-white'>
            Shipped
          </Badge>
        )
      case 'delivered':
        return (
          <Badge variant='default' className='bg-green-500 text-white'>
            Delivered
          </Badge>
        )
      case 'cancelled':
        return <Badge variant='destructive'>Cancelled</Badge>
      case 'expired':
        return (
          <Badge variant='outline' className='border-gray-400 text-gray-600'>
            Expired
          </Badge>
        )
      default:
        return <Badge variant='outline'>Unknown</Badge>
    }
  }

  const handleShipOrder = () => {
    if (!trackingNumber.trim()) {
      setShowShippingForm(true)
      return
    }

    onUpdateStatus(order.id, 'shipped', trackingNumber, notes || undefined)
    setTrackingNumber('')
    setNotes('')
    setShowShippingForm(false)
  }

  const getNextStatusAction = () => {
    const orderNumber = order.order_number || 'N/A'

    switch (order.status) {
      case 'pending':
        return (
          <Button
            onClick={() => {
              onClose()
              showConfirmModal(
                order.id,
                'processing',
                'Process Order',
                `Do you want to start processing order ${orderNumber}?`,
              )
            }}
            disabled={isLoading}
          >
            <Package className='mr-2 h-4 w-4' />
            Process Order
          </Button>
        )
      case 'processing':
        return (
          <div className='space-y-4'>
            {!showShippingForm ? (
              <Button
                onClick={() => setShowShippingForm(true)}
                disabled={isLoading}
                className='w-full'
              >
                <Truck className='mr-2 h-4 w-4' />
                Ship Order with Tracking
              </Button>
            ) : (
              <div className='space-y-4 rounded-lg border p-4'>
                <h4 className='font-medium'>Shipping Information</h4>
                <div className='space-y-3'>
                  <div>
                    <Label htmlFor='tracking'>Tracking Number</Label>
                    <Input
                      id='tracking'
                      placeholder='Enter tracking number (e.g., TH123456789TH)'
                      value={trackingNumber}
                      onChange={(e) => setTrackingNumber(e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor='notes'>Notes (optional)</Label>
                    <Textarea
                      id='notes'
                      placeholder='Add shipping notes...'
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      rows={2}
                    />
                  </div>
                  <div className='flex gap-2'>
                    <Button
                      onClick={handleShipOrder}
                      disabled={isLoading || !trackingNumber.trim()}
                      className='flex-1'
                    >
                      <Truck className='mr-2 h-4 w-4' />
                      Ship Order
                    </Button>
                    <Button
                      variant='outline'
                      onClick={() => {
                        setShowShippingForm(false)
                        setTrackingNumber('')
                        setNotes('')
                      }}
                      disabled={isLoading}
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )
      case 'shipped':
        return (
          <Button
            onClick={() => {
              onClose()
              showConfirmModal(
                order.id,
                'delivered',
                'Mark as Delivered',
                `Do you want to mark order ${orderNumber} as delivered?`,
              )
            }}
            disabled={isLoading}
          >
            <CheckCircle className='mr-2 h-4 w-4' />
            Mark Delivered
          </Button>
        )
      default:
        return null
    }
  }

  const calculateSubtotal = () => {
    if (!order.order_items || !Array.isArray(order.order_items)) return 0
    return order.order_items.reduce(
      (sum, item) => sum + (item?.total_price || 0),
      0,
    )
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className='max-h-[80vh] overflow-y-auto sm:max-w-[600px]'>
        <DialogHeader>
          <DialogTitle>
            Order Details - {order.order_number || 'N/A'}
          </DialogTitle>
          <DialogDescription>
            Order information and current status
          </DialogDescription>
        </DialogHeader>

        <div className='space-y-4'>
          <div className='flex items-center justify-between'>
            <span className='font-medium'>Status:</span>
            {getStatusBadge(order.status)}
          </div>

          <Separator />

          <div>
            <h4 className='mb-2 font-medium'>Customer Information</h4>
            <div className='space-y-1 text-sm'>
              <div>
                <span className='font-medium'>Name:</span> {customerName}
              </div>
              <div>
                <span className='font-medium'>Email:</span> {customerEmail}
              </div>
              <div className='flex items-start gap-2'>
                <MapPin className='mt-0.5 h-4 w-4 flex-shrink-0 text-gray-600' />
                <div>
                  <span className='font-medium'>Address:</span>{' '}
                  {order.shipping_address || 'No address provided'}
                </div>
              </div>
            </div>
          </div>

          <Separator />

          <div>
            <h4 className='mb-2 font-medium'>Order Items</h4>
            <div className='space-y-2'>
              {order.order_items &&
              Array.isArray(order.order_items) &&
              order.order_items.length > 0 ? (
                order.order_items.map((item) => (
                  <div
                    key={item.id}
                    className='flex items-center justify-between rounded-lg bg-gray-50 p-3 text-sm'
                  >
                    <div className='flex-1'>
                      <div className='font-medium'>
                        {item.product_name || 'Unknown Product'}
                      </div>
                      <div className='text-gray-600'>
                        {formatPrice(item.unit_price || 0)} ×{' '}
                        {item.quantity || 0}
                      </div>
                    </div>
                    <div className='font-medium'>
                      {formatPrice(item.total_price || 0)}
                    </div>
                  </div>
                ))
              ) : (
                <div className='rounded-lg bg-gray-50 p-3 text-sm text-gray-500'>
                  No items found
                </div>
              )}
            </div>
          </div>

          {(order.status === 'shipped' || order.status === 'delivered') &&
            order.tracking && (
              <>
                <Separator />
                <div>
                  <h4 className='mb-2 font-medium'>Tracking Information</h4>
                  <div className='rounded-lg bg-blue-50 p-3'>
                    <p className='text-sm text-blue-900'>{order.tracking}</p>
                    {order.shipped_at && (
                      <p className='mt-1 text-xs text-blue-700'>
                        Shipped on {formatDate(order.shipped_at)}
                      </p>
                    )}
                    {order.delivered_at && (
                      <p className='mt-1 text-xs text-green-700'>
                        Delivered on {formatDate(order.delivered_at)}
                      </p>
                    )}
                  </div>
                </div>
              </>
            )}

          <Separator />

          <div className='space-y-2'>
            <div className='flex justify-between text-sm'>
              <span>Subtotal:</span>
              <span>{formatPrice(calculateSubtotal())}</span>
            </div>
            <div className='flex justify-between text-sm'>
              <span>Shipping:</span>
              <span>Free</span>
            </div>
            <Separator />
            <div className='flex justify-between text-lg font-semibold text-[#dda700]'>
              <span>Total:</span>
              <span>{formatPrice(order.total_amount || 0)}</span>
            </div>
          </div>

          <div className='text-sm text-gray-600'>
            <div className='flex justify-between'>
              <span>Order Date:</span>
              <span>
                {order.created_at ? formatDate(order.created_at) : 'N/A'}
              </span>
            </div>
          </div>

          {order.order_status_history &&
            Array.isArray(order.order_status_history) &&
            order.order_status_history.length > 0 && (
              <>
                <Separator />
                <div>
                  <h4 className='mb-2 font-medium'>Order History</h4>
                  <div className='max-h-32 space-y-2 overflow-y-auto'>
                    {order.order_status_history
                      .filter(
                        (history) =>
                          history && history.created_at && history.status,
                      )
                      .sort((a, b) => {
                        try {
                          return (
                            new Date(b.created_at).getTime() -
                            new Date(a.created_at).getTime()
                          )
                        } catch (error) {
                          console.error('Error sorting dates:', error)
                          return 0
                        }
                      })
                      .map((history) => (
                        <div
                          key={history.id}
                          className='flex items-center justify-between rounded bg-gray-50 p-2 text-xs'
                        >
                          <div>
                            <span className='font-medium capitalize'>
                              {history.status?.replace('_', ' ') ||
                                'Unknown Status'}
                            </span>
                            {history.notes && (
                              <span className='ml-2 text-gray-600'>
                                - {history.notes}
                              </span>
                            )}
                          </div>
                          <span className='text-gray-500'>
                            {history.created_at
                              ? formatDate(history.created_at)
                              : 'N/A'}
                          </span>
                        </div>
                      ))}
                  </div>
                </div>
              </>
            )}
        </div>

        <div className='flex justify-end space-x-2 pt-4'>
          <Button variant='outline' onClick={onClose} disabled={isLoading}>
            Close
          </Button>
          {getNextStatusAction()}
        </div>
      </DialogContent>
    </Dialog>
  )
}

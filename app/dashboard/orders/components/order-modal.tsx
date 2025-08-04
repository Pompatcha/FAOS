'use client'

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
import { Package, Truck, CheckCircle } from 'lucide-react'

type OrderStatus =
  | 'pending'
  | 'processing'
  | 'shipped'
  | 'delivered'
  | 'cancelled'

interface OrderItem {
  name: string
  quantity: number
  price: number
}

interface Order {
  id: string
  customerName: string
  customerEmail: string
  items: OrderItem[]
  total: number
  status: OrderStatus
  orderDate: string
  shippingAddress: string
}

interface OrderModalProps {
  isOpen: boolean
  onClose: () => void
  order: Order | null
  onUpdateStatus: (orderId: string, newStatus: OrderStatus) => void
  showConfirmModal: (
    orderId: string,
    newStatus: OrderStatus,
    actionText: string,
    description: string,
  ) => void
}

export function OrderModal({
  isOpen,
  onClose,
  order,
  showConfirmModal,
}: OrderModalProps) {
  if (!order) return null

  const getStatusBadge = (status: OrderStatus) => {
    switch (status) {
      case 'pending':
        return <Badge variant='outline'>Pending</Badge>
      case 'processing':
        return <Badge variant='default'>Processing</Badge>
      case 'shipped':
        return <Badge variant='secondary'>Shipped</Badge>
      case 'delivered':
        return (
          <Badge variant='default' className='bg-green-500'>
            Delivered
          </Badge>
        )
      case 'cancelled':
        return <Badge variant='destructive'>Cancelled</Badge>
      default:
        return <Badge variant='outline'>Unknown</Badge>
    }
  }

  const getNextStatusAction = () => {
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
                `Do you want to start processing order ${order.id}?`,
              )
            }}
          >
            <Package className='mr-2 h-4 w-4' />
            Process Order
          </Button>
        )
      case 'processing':
        return (
          <Button
            onClick={() => {
              onClose()
              showConfirmModal(
                order.id,
                'shipped',
                'Ship Order',
                `Do you want to ship order ${order.id}?`,
              )
            }}
          >
            <Truck className='mr-2 h-4 w-4' />
            Ship Order
          </Button>
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
                `Do you want to mark order ${order.id} as delivered?`,
              )
            }}
          >
            <CheckCircle className='mr-2 h-4 w-4' />
            Mark Delivered
          </Button>
        )
      default:
        return null
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className='sm:max-w-[500px]'>
        <DialogHeader>
          <DialogTitle>Order Details {order.id}</DialogTitle>
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
            <div>
              <span className='font-medium'>Name:</span> {order.customerName}
            </div>
            <div>
              <span className='font-medium'>Email:</span> {order.customerEmail}
            </div>
            <div>
              <span className='font-medium'>Shipping Address:</span>{' '}
              {order.shippingAddress}
            </div>
          </div>

          <Separator />

          <div>
            <h4 className='mb-2 font-medium'>Order Items</h4>
            <div className='space-y-2'>
              {order.items.map((item: OrderItem, index: number) => (
                <div
                  key={index}
                  className='flex items-center justify-between text-sm'
                >
                  <div>
                    <div className='font-medium'>{item.name}</div>
                    <div className='text-muted-foreground'>
                      Quantity: {item.quantity}
                    </div>
                  </div>
                  <div className='font-medium'>
                    ฿{(item.price * item.quantity).toLocaleString()}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <Separator />

          <div className='flex items-center justify-between font-medium'>
            <span>Total Amount:</span>
            <span className='text-lg'>฿{order.total.toLocaleString()}</span>
          </div>

          <div className='text-muted-foreground flex items-center justify-between text-sm'>
            <span>Order Date:</span>
            <span>{order.orderDate}</span>
          </div>
        </div>

        <div className='flex justify-end space-x-2 pt-4'>
          <Button variant='outline' onClick={onClose}>
            Close
          </Button>
          {getNextStatusAction()}
        </div>
      </DialogContent>
    </Dialog>
  )
}

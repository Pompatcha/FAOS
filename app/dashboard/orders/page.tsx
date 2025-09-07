'use client'
import { useState } from 'react'

import type { FC } from 'react'

import { IndexLayout } from '@/components/Layout/Index'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'
import { DialogHeader } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { formatDate } from '@/lib/date'
import { formatPrice } from '@/lib/price'

import { HeaderCard } from '../components/HeaderCard'

interface Order {
  id: number
  order_number: string
  user_id: number
  status: string
  total_amount: number
  subtotal: number
  tax_amount: number
  shipping_amount: number
  discount_amount: number
  shipping_first_name: string
  shipping_last_name: string
  shipping_address: string
  shipping_city: string
  shipping_postal_code: string
  shipping_phone: string
  payment_method: string
  payment_status: string
  payment_date: string | null
  notes: string
  created_at: string
  user: {
    email: string
  }
  order_items: Array<{
    id: number
    product_name: string
    product_option_details: Record<string, string> | null
    quantity: number
    unit_price: number
    total_price: number
  }>
}

const ORDERS_MOCKUP_DATA = [
  {
    id: 1,
    order_number: 'ORD-2025-001',
    user_id: 1,
    status: 'pending',
    total_amount: 1250.0,
    subtotal: 1150.0,
    tax_amount: 100.0,
    shipping_amount: 0.0,
    discount_amount: 0.0,
    shipping_first_name: 'John',
    shipping_last_name: 'Doe',
    shipping_address: '123 Sukhumvit Road, Watthana',
    shipping_city: 'Bangkok',
    shipping_postal_code: '10110',
    shipping_phone: '+66-81-234-5678',
    payment_method: 'credit_card',
    payment_status: 'unpaid',
    payment_date: null,
    notes: 'Please deliver in the morning',
    created_at: '2025-09-01T10:00:00Z',
    user: {
      email: 'john.doe@email.com',
    },
    order_items: [
      {
        id: 1,
        product_name: 'Premium Coffee Beans',
        product_option_details: { size: 'Large', roast: 'Dark' },
        quantity: 2,
        unit_price: 450.0,
        total_price: 900.0,
      },
      {
        id: 2,
        product_name: 'Coffee Grinder',
        product_option_details: null,
        quantity: 1,
        unit_price: 250.0,
        total_price: 250.0,
      },
    ],
  },
  {
    id: 2,
    order_number: 'ORD-2025-002',
    user_id: 2,
    status: 'processing',
    total_amount: 890.0,
    subtotal: 820.0,
    tax_amount: 70.0,
    shipping_amount: 0.0,
    discount_amount: 0.0,
    shipping_first_name: 'Jane',
    shipping_last_name: 'Smith',
    shipping_address: '456 Silom Road, Bang Rak',
    shipping_city: 'Bangkok',
    shipping_postal_code: '10500',
    shipping_phone: '+66-82-345-6789',
    payment_method: 'promptpay',
    payment_status: 'paid',
    payment_date: '2025-08-31T15:30:00Z',
    notes: '',
    created_at: '2025-08-31T14:00:00Z',
    user: {
      email: 'jane.smith@email.com',
    },
    order_items: [
      {
        id: 3,
        product_name: 'Espresso Machine',
        product_option_details: { color: 'Black', warranty: '2 years' },
        quantity: 1,
        unit_price: 820.0,
        total_price: 820.0,
      },
    ],
  },
]

const PAYMENT_METHOD_OPTIONS = [
  { value: 'credit_card', label: 'Credit Card' },
  { value: 'promptpay', label: 'PromptPay' },
]

const OrderPage: FC = () => {
  const [trackingNumberInput, setTrackingNumberInput] = useState<string>('')
  const [shippedOrderNumbers, setShippedOrderNumbers] = useState<string[]>([])
  const [isTrackingDialogOpen, setIsTrackingDialogOpen] =
    useState<boolean>(false)
  const [isOrderDetailDialogOpen, setIsOrderDetailDialogOpen] =
    useState<boolean>(false)
  const [selectedOrderNumber, setSelectedOrderNumber] = useState<string>('')

  const openShipOrderDialog = (orderNumber: string) => {
    setSelectedOrderNumber(orderNumber)
    setIsTrackingDialogOpen(true)
  }

  const openOrderDetailDialog = (orderNumber: string) => {
    setSelectedOrderNumber(orderNumber)
    setIsOrderDetailDialogOpen(true)
  }

  const confirmShipOrder = () => {
    if (trackingNumberInput.trim()) {
      setShippedOrderNumbers((previousShippedOrders) => [
        ...previousShippedOrders,
        selectedOrderNumber,
      ])
      setTrackingNumberInput('')
      setIsTrackingDialogOpen(false)
    }
  }

  const cancelShipOrder = () => {
    setTrackingNumberInput('')
    setIsTrackingDialogOpen(false)
  }

  const getPaymentMethodDisplayName = (paymentMethodValue: string) => {
    const foundPaymentMethod = PAYMENT_METHOD_OPTIONS.find(
      (method) => method.value === paymentMethodValue,
    )
    return foundPaymentMethod ? foundPaymentMethod.label : paymentMethodValue
  }

  const findOrderByOrderNumber = () => {
    return ORDERS_MOCKUP_DATA.find(
      (order) => order.order_number === selectedOrderNumber,
    )
  }

  const getOrderStatusDisplayName = (order: Order) => {
    const isOrderShipped = shippedOrderNumbers.includes(order.order_number)
    const isProcessingStatus = order.status === 'processing'

    if (isOrderShipped && isProcessingStatus) {
      return 'Shipped'
    }

    return order.status.charAt(0).toUpperCase() + order.status.slice(1)
  }

  const shouldShowShipButton = (order: Order) => {
    const isAlreadyShipped = shippedOrderNumbers.includes(order.order_number)
    const nonShippableStatuses = [
      'shipped',
      'delivered',
      'cancelled',
      'pending',
    ]

    return !isAlreadyShipped && !nonShippableStatuses.includes(order.status)
  }

  const selectedOrderDetails = findOrderByOrderNumber()

  return (
    <IndexLayout>
      <div className='flex justify-between'>
        <div className='flex flex-col gap-2.5 text-white'>
          <span className='text-4xl'>Orders</span>
          <span>
            Track and manage all your customer orders in one place. <br />
            Process payments, update order status, and ensure timely delivery.
          </span>
        </div>
      </div>

      <div>
        <div className='grid grid-cols-4 gap-5 text-[#4a2c00]'>
          <HeaderCard label='New Orders' value={50} href='/dashboard/orders' />
        </div>
      </div>

      <div className='rounded-xl bg-white p-5'>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className='w-[120px]'>Order Number</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Order Status</TableHead>
              <TableHead>Payment Status</TableHead>
              <TableHead>Payment Method</TableHead>
              <TableHead>Items</TableHead>
              <TableHead className='text-right'>Total Amount</TableHead>
              <TableHead>Order Date</TableHead>
              <TableHead className='text-center'>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {ORDERS_MOCKUP_DATA.map((order) => (
              <TableRow key={order.id}>
                <TableCell className='font-medium'>
                  {order.order_number}
                </TableCell>
                <TableCell>
                  {`${order.shipping_first_name} ${order.shipping_last_name}`}
                </TableCell>
                <TableCell>
                  <Badge>{getOrderStatusDisplayName(order)}</Badge>
                </TableCell>
                <TableCell>
                  <Badge>
                    {order.payment_status.charAt(0).toUpperCase() +
                      order.payment_status.slice(1)}
                  </Badge>
                </TableCell>
                <TableCell>
                  {getPaymentMethodDisplayName(order.payment_method)}
                </TableCell>
                <TableCell>
                  {order.order_items.length}{' '}
                  {order.order_items.length === 1 ? 'item' : 'items'}
                </TableCell>
                <TableCell className='text-right'>
                  {formatPrice(order.total_amount)}
                </TableCell>
                <TableCell>{formatDate(order.created_at)}</TableCell>
                <TableCell className='text-center'>
                  <div className='flex justify-center gap-2'>
                    <Button
                      variant='outline'
                      onClick={() => openOrderDetailDialog(order.order_number)}
                    >
                      View
                    </Button>
                    {shouldShowShipButton(order) && (
                      <Button
                        variant='default'
                        onClick={() => openShipOrderDialog(order.order_number)}
                      >
                        Ship Order
                      </Button>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <Dialog
        open={isOrderDetailDialogOpen}
        onOpenChange={setIsOrderDetailDialogOpen}
      >
        <DialogContent className='flex max-h-[90vh] flex-col overflow-hidden sm:max-w-[600px]'>
          <DialogHeader>
            <DialogTitle>Order Details {selectedOrderNumber}</DialogTitle>
            <DialogDescription>
              Complete information about the selected order
            </DialogDescription>
          </DialogHeader>

          {selectedOrderDetails && (
            <div className='-mr-2 space-y-6 overflow-y-auto pr-2'>
              <div>
                <h3 className='mb-3 font-semibold'>Customer Information</h3>
                <div className='grid grid-cols-2 gap-4 text-sm'>
                  <div>
                    <span className='text-gray-600'>Name:</span>
                    <p className='font-medium'>{`${selectedOrderDetails.shipping_first_name} ${selectedOrderDetails.shipping_last_name}`}</p>
                  </div>
                  <div>
                    <span className='text-gray-600'>Email:</span>
                    <p className='font-medium'>
                      {selectedOrderDetails.user.email}
                    </p>
                  </div>
                  <div>
                    <span className='text-gray-600'>Phone:</span>
                    <p className='font-medium'>
                      {selectedOrderDetails.shipping_phone}
                    </p>
                  </div>
                  <div>
                    <span className='text-gray-600'>Order Date:</span>
                    <p className='font-medium'>
                      {formatDate(selectedOrderDetails.created_at)}
                    </p>
                  </div>
                </div>
                <div className='mt-3'>
                  <span className='text-gray-600'>Shipping Address:</span>
                  <p className='font-medium'>
                    {selectedOrderDetails.shipping_address}
                    {selectedOrderDetails.shipping_city &&
                      `, ${selectedOrderDetails.shipping_city}`}
                    {selectedOrderDetails.shipping_postal_code &&
                      ` ${selectedOrderDetails.shipping_postal_code}`}
                  </p>
                </div>
              </div>

              <Separator />

              <div>
                <h3 className='mb-3 font-semibold'>Order Status</h3>
                <div className='grid grid-cols-2 gap-4'>
                  <div>
                    <span className='text-gray-600'>Order Status:</span>
                    <div className='mt-1'>
                      <Badge>
                        {getOrderStatusDisplayName(selectedOrderDetails)}
                      </Badge>
                    </div>
                  </div>
                  <div>
                    <span className='text-gray-600'>Payment Status:</span>
                    <div className='mt-1'>
                      <Badge>
                        {selectedOrderDetails.payment_status
                          .charAt(0)
                          .toUpperCase() +
                          selectedOrderDetails.payment_status.slice(1)}
                      </Badge>
                    </div>
                  </div>
                  <div>
                    <span className='text-gray-600'>Payment Method:</span>
                    <p className='font-medium'>
                      {getPaymentMethodDisplayName(
                        selectedOrderDetails.payment_method,
                      )}
                    </p>
                  </div>
                  {selectedOrderDetails.payment_date && (
                    <div>
                      <span className='text-gray-600'>Payment Date:</span>
                      <p className='font-medium'>
                        {formatDate(selectedOrderDetails.payment_date)}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              <Separator />

              <div>
                <h3 className='mb-3 font-semibold'>Order Items</h3>
                <div className='space-y-3'>
                  {selectedOrderDetails.order_items.map((orderItem) => (
                    <div
                      key={orderItem.id}
                      className='flex items-start justify-between border-b py-3 last:border-0'
                    >
                      <div className='flex-1'>
                        <p className='font-medium'>{orderItem.product_name}</p>
                        {orderItem.product_option_details && (
                          <div className='mt-1 text-sm text-gray-600'>
                            {Object.entries(
                              orderItem.product_option_details,
                            ).map(([optionKey, optionValue]) => (
                              <span key={optionKey} className='mr-3'>
                                {optionKey}: {optionValue}
                              </span>
                            ))}
                          </div>
                        )}
                        <p className='text-sm text-gray-600'>
                          Quantity: {orderItem.quantity}
                        </p>
                      </div>
                      <div className='text-right'>
                        <p className='font-medium'>
                          {formatPrice(orderItem.total_price)}
                        </p>
                        <p className='text-sm text-gray-600'>
                          {formatPrice(orderItem.unit_price)} each
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <Separator />

              <div>
                <h3 className='mb-3 font-semibold'>Order Summary</h3>
                <div className='space-y-2'>
                  <div className='flex justify-between'>
                    <span>Subtotal:</span>
                    <span>{formatPrice(selectedOrderDetails.subtotal)}</span>
                  </div>
                  <div className='flex justify-between'>
                    <span>Tax:</span>
                    <span>{formatPrice(selectedOrderDetails.tax_amount)}</span>
                  </div>
                  <div className='flex justify-between'>
                    <span>Shipping:</span>
                    <span>
                      {formatPrice(selectedOrderDetails.shipping_amount)}
                    </span>
                  </div>
                  {selectedOrderDetails.discount_amount > 0 && (
                    <div className='flex justify-between text-red-600'>
                      <span>Discount:</span>
                      <span>
                        -{formatPrice(selectedOrderDetails.discount_amount)}
                      </span>
                    </div>
                  )}
                  <div className='flex justify-between border-t pt-2.5 text-lg font-semibold'>
                    <span>Total:</span>
                    <span>
                      {formatPrice(selectedOrderDetails.total_amount)}
                    </span>
                  </div>
                </div>
              </div>

              {selectedOrderDetails.notes && (
                <>
                  <Separator />
                  <div>
                    <h3 className='mb-2 font-semibold'>Notes</h3>
                    <p className='text-sm text-gray-600'>
                      {selectedOrderDetails.notes}
                    </p>
                  </div>
                </>
              )}

              <div className='flex justify-end border-t pt-4'>
                <Button
                  variant='outline'
                  onClick={() => setIsOrderDetailDialogOpen(false)}
                >
                  Close
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <Dialog
        open={isTrackingDialogOpen}
        onOpenChange={setIsTrackingDialogOpen}
      >
        <DialogContent className='sm:max-w-[425px]'>
          <DialogHeader>
            <DialogTitle>Ship Order {selectedOrderNumber}</DialogTitle>
            <DialogDescription>
              Please enter the tracking number for this order. This will update
              the order status to &quot;Shipped&quot;.
            </DialogDescription>
          </DialogHeader>
          <div className='mt-4 space-y-4'>
            <div>
              <Label htmlFor='tracking'>Tracking Number</Label>
              <Input
                id='tracking'
                value={trackingNumberInput}
                onChange={(e) => setTrackingNumberInput(e.target.value)}
                placeholder='Enter tracking number'
                className='mt-1'
              />
            </div>
            <div className='flex justify-end space-x-2'>
              <Button variant='outline' onClick={cancelShipOrder}>
                Cancel
              </Button>
              <Button
                variant='default'
                onClick={confirmShipOrder}
                disabled={!trackingNumberInput.trim()}
              >
                Save & Ship
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </IndexLayout>
  )
}

export default OrderPage

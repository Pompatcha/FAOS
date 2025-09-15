'use client'
import { useState } from 'react'

import { HeaderCard } from '@/components/HeaderCard'
import { IndexLayout } from '@/components/Layout/Index'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
  DialogHeader,
} from '@/components/ui/dialog'
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

const mockOrders = [
  {
    id: 1,
    order_number: 'ORD-2025-001',
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
    user: { email: 'john.doe@email.com' },
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
    user: { email: 'jane.smith@email.com' },
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

const paymentMethods = {
  credit_card: 'Credit Card',
  promptpay: 'PromptPay',
}

const OrderPage = () => {
  const [trackingNumber, setTrackingNumber] = useState('')
  const [shippedOrders, setShippedOrders] = useState<string[]>([])
  const [showTrackingDialog, setShowTrackingDialog] = useState(false)
  const [showDetailDialog, setShowDetailDialog] = useState(false)
  const [selectedOrder, setSelectedOrder] = useState('')

  const getPaymentMethod = (method: string) => {
    return paymentMethods[method as keyof typeof paymentMethods] || method
  }

  const getOrderStatus = (order: (typeof mockOrders)[0]) => {
    if (
      shippedOrders.includes(order.order_number) &&
      order.status === 'processing'
    ) {
      return 'Shipped'
    }
    return order.status.charAt(0).toUpperCase() + order.status.slice(1)
  }

  const canShip = (order: (typeof mockOrders)[0]) => {
    const nonShippable = ['shipped', 'delivered', 'cancelled', 'pending']
    return (
      !shippedOrders.includes(order.order_number) &&
      !nonShippable.includes(order.status)
    )
  }

  const openShipDialog = (orderNumber: string) => {
    setSelectedOrder(orderNumber)
    setShowTrackingDialog(true)
  }

  const openDetailDialog = (orderNumber: string) => {
    setSelectedOrder(orderNumber)
    setShowDetailDialog(true)
  }

  const confirmShip = () => {
    if (trackingNumber.trim()) {
      setShippedOrders((prev) => [...prev, selectedOrder])
      setTrackingNumber('')
      setShowTrackingDialog(false)
    }
  }

  const cancelShip = () => {
    setTrackingNumber('')
    setShowTrackingDialog(false)
  }

  const selectedOrderData = mockOrders.find(
    (order) => order.order_number === selectedOrder,
  )

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
        <div className='grid gap-5 text-[#4a2c00] sm:grid-cols-3'>
          <HeaderCard label='New Orders' value={0} href='/dashboard/orders' />
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
            {mockOrders.map((order) => (
              <TableRow key={order.id}>
                <TableCell className='font-medium'>
                  {order.order_number}
                </TableCell>
                <TableCell>{`${order.shipping_first_name} ${order.shipping_last_name}`}</TableCell>
                <TableCell>
                  <Badge>{getOrderStatus(order)}</Badge>
                </TableCell>
                <TableCell>
                  <Badge>
                    {order.payment_status.charAt(0).toUpperCase() +
                      order.payment_status.slice(1)}
                  </Badge>
                </TableCell>
                <TableCell>{getPaymentMethod(order.payment_method)}</TableCell>
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
                      onClick={() => openDetailDialog(order.order_number)}
                    >
                      View
                    </Button>
                    {canShip(order) && (
                      <Button
                        onClick={() => openShipDialog(order.order_number)}
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

      {/* Order Detail Dialog */}
      <Dialog open={showDetailDialog} onOpenChange={setShowDetailDialog}>
        <DialogContent className='flex max-h-[90vh] flex-col overflow-hidden sm:max-w-[600px]'>
          <DialogHeader>
            <DialogTitle>Order Details {selectedOrder}</DialogTitle>
            <DialogDescription>
              Complete information about the selected order
            </DialogDescription>
          </DialogHeader>

          {selectedOrderData && (
            <div className='-mr-2 space-y-6 overflow-y-auto pr-2'>
              <div>
                <h3 className='mb-3 font-semibold'>Customer Information</h3>
                <div className='grid grid-cols-2 gap-4 text-sm'>
                  <div>
                    <span className='text-gray-600'>Name:</span>
                    <p className='font-medium'>
                      {`${selectedOrderData.shipping_first_name} ${selectedOrderData.shipping_last_name}`}
                    </p>
                  </div>
                  <div>
                    <span className='text-gray-600'>Email:</span>
                    <p className='font-medium'>
                      {selectedOrderData.user.email}
                    </p>
                  </div>
                  <div>
                    <span className='text-gray-600'>Phone:</span>
                    <p className='font-medium'>
                      {selectedOrderData.shipping_phone}
                    </p>
                  </div>
                  <div>
                    <span className='text-gray-600'>Order Date:</span>
                    <p className='font-medium'>
                      {formatDate(selectedOrderData.created_at)}
                    </p>
                  </div>
                </div>
                <div className='mt-3'>
                  <span className='text-gray-600'>Shipping Address:</span>
                  <p className='font-medium'>
                    {selectedOrderData.shipping_address}
                    {selectedOrderData.shipping_city &&
                      `, ${selectedOrderData.shipping_city}`}
                    {selectedOrderData.shipping_postal_code &&
                      ` ${selectedOrderData.shipping_postal_code}`}
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
                      <Badge>{getOrderStatus(selectedOrderData)}</Badge>
                    </div>
                  </div>
                  <div>
                    <span className='text-gray-600'>Payment Status:</span>
                    <div className='mt-1'>
                      <Badge>
                        {selectedOrderData.payment_status
                          .charAt(0)
                          .toUpperCase() +
                          selectedOrderData.payment_status.slice(1)}
                      </Badge>
                    </div>
                  </div>
                  <div>
                    <span className='text-gray-600'>Payment Method:</span>
                    <p className='font-medium'>
                      {getPaymentMethod(selectedOrderData.payment_method)}
                    </p>
                  </div>
                  {selectedOrderData.payment_date && (
                    <div>
                      <span className='text-gray-600'>Payment Date:</span>
                      <p className='font-medium'>
                        {formatDate(selectedOrderData.payment_date)}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              <Separator />

              <div>
                <h3 className='mb-3 font-semibold'>Order Items</h3>
                <div className='space-y-3'>
                  {selectedOrderData.order_items.map((item) => (
                    <div
                      key={item.id}
                      className='flex items-start justify-between border-b py-3 last:border-0'
                    >
                      <div className='flex-1'>
                        <p className='font-medium'>{item.product_name}</p>
                        {item.product_option_details && (
                          <div className='mt-1 text-sm text-gray-600'>
                            {Object.entries(item.product_option_details).map(
                              ([key, value]) => (
                                <span key={key} className='mr-3'>
                                  {key}: {value}
                                </span>
                              ),
                            )}
                          </div>
                        )}
                        <p className='text-sm text-gray-600'>
                          Quantity: {item.quantity}
                        </p>
                      </div>
                      <div className='text-right'>
                        <p className='font-medium'>
                          {formatPrice(item.total_price)}
                        </p>
                        <p className='text-sm text-gray-600'>
                          {formatPrice(item.unit_price)} each
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
                    <span>{formatPrice(selectedOrderData.subtotal)}</span>
                  </div>
                  <div className='flex justify-between'>
                    <span>Tax:</span>
                    <span>{formatPrice(selectedOrderData.tax_amount)}</span>
                  </div>
                  <div className='flex justify-between'>
                    <span>Shipping:</span>
                    <span>
                      {formatPrice(selectedOrderData.shipping_amount)}
                    </span>
                  </div>
                  {selectedOrderData.discount_amount > 0 && (
                    <div className='flex justify-between text-red-600'>
                      <span>Discount:</span>
                      <span>
                        -{formatPrice(selectedOrderData.discount_amount)}
                      </span>
                    </div>
                  )}
                  <div className='flex justify-between border-t pt-2.5 text-lg font-semibold'>
                    <span>Total:</span>
                    <span>{formatPrice(selectedOrderData.total_amount)}</span>
                  </div>
                </div>
              </div>

              {selectedOrderData.notes && (
                <>
                  <Separator />
                  <div>
                    <h3 className='mb-2 font-semibold'>Notes</h3>
                    <p className='text-sm text-gray-600'>
                      {selectedOrderData.notes}
                    </p>
                  </div>
                </>
              )}

              <div className='flex justify-end border-t pt-4'>
                <Button
                  variant='outline'
                  onClick={() => setShowDetailDialog(false)}
                >
                  Close
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Tracking Dialog */}
      <Dialog open={showTrackingDialog} onOpenChange={setShowTrackingDialog}>
        <DialogContent className='sm:max-w-[425px]'>
          <DialogHeader>
            <DialogTitle>Ship Order {selectedOrder}</DialogTitle>
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
                value={trackingNumber}
                onChange={(e) => setTrackingNumber(e.target.value)}
                placeholder='Enter tracking number'
                className='mt-1'
              />
            </div>
            <div className='flex justify-end space-x-2'>
              <Button variant='outline' onClick={cancelShip}>
                Cancel
              </Button>
              <Button onClick={confirmShip} disabled={!trackingNumber.trim()}>
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

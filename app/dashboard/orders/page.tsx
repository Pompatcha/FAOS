'use client'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'
import { toast } from 'sonner'

import {
  getAllOrders,
  updateOrderStatus,
  updatePaymentStatus,
  getOrderStatistics,
} from '@/actions/order'
import { HeaderCard } from '@/components/HeaderCard'
import { IndexLayout } from '@/components/Layout/Index'
import { Loading } from '@/components/Layout/Loading'
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { useAuth, useRequireAuth } from '@/contexts/AuthContext.tsx'
import { formatDate } from '@/lib/date'
import { formatPrice } from '@/lib/price'

const orderStatuses = {
  pending: 'Pending',
  processing: 'Processing',
  shipped: 'Shipped',
  delivered: 'Delivered',
  cancelled: 'Cancelled',
}

const paymentStatuses = {
  unpaid: 'Unpaid',
  paid: 'Paid',
  refunded: 'Refunded',
}

const OrderPage = () => {
  useRequireAuth()
  const queryClient = useQueryClient()

  const { userProfile } = useAuth()
  const [trackingNumber, setTrackingNumber] = useState('')
  const [showTrackingDialog, setShowTrackingDialog] = useState(false)
  const [showDetailDialog, setShowDetailDialog] = useState(false)
  const [showStatusDialog, setShowStatusDialog] = useState(false)
  const [showPaymentDialog, setShowPaymentDialog] = useState(false)
  const [selectedOrderId, setSelectedOrderId] = useState<number | null>(null)
  const [newStatus, setNewStatus] = useState('')
  const [newPaymentStatus, setNewPaymentStatus] = useState('')

  const { data: ordersResult, isLoading } = useQuery({
    queryKey: ['orders', 'all'],
    queryFn: () => getAllOrders(),
  })

  const { data: statsResult } = useQuery({
    queryKey: ['orders', 'statistics'],
    queryFn: () => getOrderStatistics(),
  })

  const orders = ordersResult?.data || []
  const stats = statsResult?.data || {
    totalOrders: 0,
    pendingOrders: 0,
    processingOrders: 0,
    completedOrders: 0,
    totalRevenue: 0,
  }

  const updateStatusMutation = useMutation({
    mutationFn: ({ orderId, status }: { orderId: number; status: string }) =>
      updateOrderStatus(orderId, status),
    onSuccess: (result) => {
      if (result.success) {
        queryClient.invalidateQueries({ queryKey: ['orders'] })
        toast.success('Order status updated successfully!')
        setShowStatusDialog(false)
        setShowTrackingDialog(false)
      } else {
        toast.error(result.message || 'Failed to update order status')
      }
    },
    onError: (error: Error) => {
      toast.error(error.message || 'An error occurred')
    },
  })

  const updatePaymentMutation = useMutation({
    mutationFn: ({
      orderId,
      paymentStatus,
    }: {
      orderId: number
      paymentStatus: string
    }) => updatePaymentStatus(orderId, paymentStatus),
    onSuccess: (result) => {
      if (result.success) {
        queryClient.invalidateQueries({ queryKey: ['orders'] })
        toast.success('Payment status updated successfully!')
        setShowPaymentDialog(false)
      } else {
        toast.error(result.message || 'Failed to update payment status')
      }
    },
    onError: (error: Error) => {
      toast.error(error.message || 'An error occurred')
    },
  })

  const getOrderStatusBadge = (status: string) => {
    const variants: Record<string, 'default' | 'secondary' | 'destructive'> = {
      pending: 'secondary',
      processing: 'default',
      shipped: 'default',
      delivered: 'default',
      cancelled: 'destructive',
    }
    return variants[status] || 'default'
  }

  const getPaymentStatusBadge = (status: string) => {
    const variants: Record<string, 'default' | 'secondary' | 'destructive'> = {
      unpaid: 'secondary',
      paid: 'default',
      refunded: 'destructive',
    }
    return variants[status] || 'default'
  }

  const openDetailDialog = (orderId: number) => {
    setSelectedOrderId(orderId)
    setShowDetailDialog(true)
  }

  const openStatusDialog = (orderId: number, currentStatus: string) => {
    setSelectedOrderId(orderId)
    setNewStatus(currentStatus)
    setShowStatusDialog(true)
  }

  const openPaymentDialog = (orderId: number, currentStatus: string) => {
    setSelectedOrderId(orderId)
    setNewPaymentStatus(currentStatus)
    setShowPaymentDialog(true)
  }

  const confirmShip = () => {
    if (trackingNumber.trim() && selectedOrderId) {
      updateStatusMutation.mutate({
        orderId: selectedOrderId,
        status: 'shipped',
      })
      setTrackingNumber('')
    }
  }

  const confirmStatusUpdate = () => {
    if (selectedOrderId && newStatus) {
      updateStatusMutation.mutate({
        orderId: selectedOrderId,
        status: newStatus,
      })
    }
  }

  const confirmPaymentUpdate = () => {
    if (selectedOrderId && newPaymentStatus) {
      updatePaymentMutation.mutate({
        orderId: selectedOrderId,
        paymentStatus: newPaymentStatus,
      })
    }
  }

  const selectedOrder = orders.find((order) => order.id === selectedOrderId)

  return (
    <IndexLayout>
      <Loading isLoading={isLoading} />

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
        <div className='grid gap-5 text-[#4a2c00] sm:grid-cols-4'>
          <HeaderCard
            label='Total Orders'
            value={stats.totalOrders}
            href='/dashboard/orders'
          />
          <HeaderCard
            label='Pending Orders'
            value={stats.pendingOrders}
            href='/dashboard/orders'
          />
          <HeaderCard
            label='Processing Orders'
            value={stats.processingOrders}
            href='/dashboard/orders'
          />
          <HeaderCard
            label='Total Revenue'
            value={stats.totalRevenue}
            href='/dashboard/orders'
          />
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
              <TableHead>Items</TableHead>
              <TableHead className='text-right'>Total Amount</TableHead>
              <TableHead>Order Date</TableHead>
              <TableHead className='text-center'>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className='text-center'>
                  No orders found
                </TableCell>
              </TableRow>
            ) : (
              orders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell className='font-medium'>
                    {order.order_number}
                  </TableCell>
                  <TableCell>
                    {order.users
                      ? `${order.users.first_name || ''} ${order.users.last_name || ''}`.trim() ||
                        'N/A'
                      : 'N/A'}
                  </TableCell>
                  <TableCell>
                    <Badge variant={getOrderStatusBadge(order.status)}>
                      {orderStatuses[
                        order.status as keyof typeof orderStatuses
                      ] || order.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={getPaymentStatusBadge(order.payment_status)}
                    >
                      {paymentStatuses[
                        order.payment_status as keyof typeof paymentStatuses
                      ] || order.payment_status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {order.order_items?.length || 0}{' '}
                    {(order.order_items?.length || 0) === 1 ? 'item' : 'items'}
                  </TableCell>
                  <TableCell className='text-right'>
                    {formatPrice(Number(order.total_amount))}
                  </TableCell>
                  <TableCell>{formatDate(order.created_at)}</TableCell>
                  <TableCell className='text-center'>
                    <div className='flex justify-center gap-2'>
                      <Button
                        variant='outline'
                        size='sm'
                        onClick={() => openDetailDialog(order.id)}
                      >
                        View
                      </Button>

                      {userProfile?.role === 'admin' && (
                        <>
                          <Button
                            variant='outline'
                            size='sm'
                            onClick={() =>
                              openStatusDialog(order.id, order.status)
                            }
                          >
                            Status
                          </Button>
                          <Button
                            variant='outline'
                            size='sm'
                            onClick={() =>
                              openPaymentDialog(order.id, order.payment_status)
                            }
                          >
                            Payment
                          </Button>
                        </>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <Dialog open={showDetailDialog} onOpenChange={setShowDetailDialog}>
        <DialogContent className='flex max-h-[90vh] flex-col overflow-hidden sm:max-w-[600px]'>
          <DialogHeader>
            <DialogTitle>
              Order Details {selectedOrder?.order_number}
            </DialogTitle>
            <DialogDescription>
              Complete information about the selected order
            </DialogDescription>
          </DialogHeader>

          {selectedOrder && (
            <div className='-mr-2 space-y-6 overflow-y-auto pr-2'>
              <div>
                <h3 className='mb-3 font-semibold'>Customer Information</h3>
                <div className='grid grid-cols-2 gap-4 text-sm'>
                  <div>
                    <span className='text-gray-600'>Name:</span>
                    <p className='font-medium'>
                      {selectedOrder.users
                        ? `${selectedOrder.users.first_name || ''} ${selectedOrder.users.last_name || ''}`.trim() ||
                          'N/A'
                        : 'N/A'}
                    </p>
                  </div>
                  <div>
                    <span className='text-gray-600'>Phone:</span>
                    <p className='font-medium'>
                      {selectedOrder.users?.telephone || 'N/A'}
                    </p>
                  </div>
                  <div>
                    <span className='text-gray-600'>Order Date:</span>
                    <p className='font-medium'>
                      {formatDate(selectedOrder.created_at)}
                    </p>
                  </div>
                </div>
                {selectedOrder.shipping_address && (
                  <div className='mt-3'>
                    <span className='text-gray-600'>Shipping Address:</span>
                    <p className='font-medium'>
                      {selectedOrder.shipping_address}
                    </p>
                  </div>
                )}
              </div>

              <Separator />

              <div>
                <h3 className='mb-3 font-semibold'>Order Status</h3>
                <div className='grid grid-cols-2 gap-4'>
                  <div>
                    <span className='text-gray-600'>Order Status:</span>
                    <div className='mt-1'>
                      <Badge
                        variant={getOrderStatusBadge(selectedOrder.status)}
                      >
                        {orderStatuses[
                          selectedOrder.status as keyof typeof orderStatuses
                        ] || selectedOrder.status}
                      </Badge>
                    </div>
                  </div>
                  <div>
                    <span className='text-gray-600'>Payment Status:</span>
                    <div className='mt-1'>
                      <Badge
                        variant={getPaymentStatusBadge(
                          selectedOrder.payment_status,
                        )}
                      >
                        {paymentStatuses[
                          selectedOrder.payment_status as keyof typeof paymentStatuses
                        ] || selectedOrder.payment_status}
                      </Badge>
                    </div>
                  </div>
                  {selectedOrder.payment_date && (
                    <div>
                      <span className='text-gray-600'>Payment Date:</span>
                      <p className='font-medium'>
                        {formatDate(selectedOrder.payment_date)}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              <Separator />

              <div>
                <h3 className='mb-3 font-semibold'>Order Items</h3>
                <div className='space-y-3'>
                  {selectedOrder.order_items?.map(
                    (item: {
                      id?: number
                      product_name: string
                      total_price: number
                      quantity: number
                      unit_price: number
                      product_option_details?: Record<string, string> | null
                    }) => (
                      <div
                        key={item.id}
                        className='flex items-start justify-between border-b py-3 last:border-0'
                      >
                        <div className='flex-1'>
                          <p className='font-medium'>{item.product_name}</p>
                          {item.product_option_details && (
                            <div className='mt-1 text-sm text-gray-600'>
                              {Object.entries(
                                item.product_option_details as Record<
                                  string,
                                  string
                                >,
                              ).map(([key, value]) => (
                                <span key={key} className='mr-3'>
                                  {key}: {value}
                                </span>
                              ))}
                            </div>
                          )}
                          <p className='text-sm text-gray-600'>
                            Quantity: {item.quantity}
                          </p>
                        </div>
                        <div className='text-right'>
                          <p className='font-medium'>
                            {formatPrice(Number(item.total_price))}
                          </p>
                          <p className='text-sm text-gray-600'>
                            {formatPrice(Number(item.unit_price))} each
                          </p>
                        </div>
                      </div>
                    ),
                  )}
                </div>
              </div>

              <Separator />

              <div>
                <h3 className='mb-3 font-semibold'>Order Summary</h3>
                <div className='space-y-2'>
                  <div className='flex justify-between border-t pt-2.5 text-lg font-semibold'>
                    <span>Total:</span>
                    <span>
                      {formatPrice(Number(selectedOrder.total_amount))}
                    </span>
                  </div>
                </div>
              </div>

              {selectedOrder.notes && (
                <>
                  <Separator />
                  <div>
                    <h3 className='mb-2 font-semibold'>Notes</h3>
                    <p className='text-sm text-gray-600'>
                      {selectedOrder.notes}
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

      <Dialog open={showStatusDialog} onOpenChange={setShowStatusDialog}>
        <DialogContent className='sm:max-w-[425px]'>
          <DialogHeader>
            <DialogTitle>Update Order Status</DialogTitle>
            <DialogDescription>
              Change the status of order {selectedOrder?.order_number}
            </DialogDescription>
          </DialogHeader>
          <div className='mt-4 space-y-4'>
            <div>
              <Label htmlFor='status'>Order Status</Label>
              <Select value={newStatus} onValueChange={setNewStatus}>
                <SelectTrigger className='mt-1'>
                  <SelectValue placeholder='Select status' />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(orderStatuses).map(([key, label]) => (
                    <SelectItem key={key} value={key}>
                      {label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className='flex justify-end space-x-2'>
              <Button
                variant='outline'
                onClick={() => setShowStatusDialog(false)}
              >
                Cancel
              </Button>
              <Button
                onClick={confirmStatusUpdate}
                disabled={
                  !newStatus ||
                  newStatus === selectedOrder?.status ||
                  updateStatusMutation.isPending
                }
              >
                {updateStatusMutation.isPending ? 'Updating...' : 'Update'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={showPaymentDialog} onOpenChange={setShowPaymentDialog}>
        <DialogContent className='sm:max-w-[425px]'>
          <DialogHeader>
            <DialogTitle>Update Payment Status</DialogTitle>
            <DialogDescription>
              Change the payment status of order {selectedOrder?.order_number}
            </DialogDescription>
          </DialogHeader>
          <div className='mt-4 space-y-4'>
            <div>
              <Label htmlFor='payment-status'>Payment Status</Label>
              <Select
                value={newPaymentStatus}
                onValueChange={setNewPaymentStatus}
              >
                <SelectTrigger className='mt-1'>
                  <SelectValue placeholder='Select payment status' />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(paymentStatuses).map(([key, label]) => (
                    <SelectItem key={key} value={key}>
                      {label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className='flex justify-end space-x-2'>
              <Button
                variant='outline'
                onClick={() => setShowPaymentDialog(false)}
              >
                Cancel
              </Button>
              <Button
                onClick={confirmPaymentUpdate}
                disabled={
                  !newPaymentStatus ||
                  newPaymentStatus === selectedOrder?.payment_status ||
                  updatePaymentMutation.isPending
                }
              >
                {updatePaymentMutation.isPending ? 'Updating...' : 'Update'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={showTrackingDialog} onOpenChange={setShowTrackingDialog}>
        <DialogContent className='sm:max-w-[425px]'>
          <DialogHeader>
            <DialogTitle>Ship Order {selectedOrder?.order_number}</DialogTitle>
            <DialogDescription>
              Enter tracking number and mark order as shipped
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
              <Button
                variant='outline'
                onClick={() => {
                  setShowTrackingDialog(false)
                  setTrackingNumber('')
                }}
              >
                Cancel
              </Button>
              <Button
                onClick={confirmShip}
                disabled={
                  !trackingNumber.trim() || updateStatusMutation.isPending
                }
              >
                {updateStatusMutation.isPending ? 'Shipping...' : 'Ship Order'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </IndexLayout>
  )
}

export default OrderPage

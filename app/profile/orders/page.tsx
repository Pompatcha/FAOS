'use client'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Input } from '@/components/ui/input'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Alert, AlertDescription } from '@/components/ui/alert'
import {
  Package,
  Eye,
  Truck,
  CheckCircle,
  XCircle,
  ArrowLeft,
  Calendar,
  MapPin,
  Search,
  Clock,
  CreditCard,
  Copy,
  ExternalLink,
  RefreshCw,
  X,
  AlertTriangle,
} from 'lucide-react'
import { useRouter } from 'next/navigation'
import { Header } from '@/components/Layout/Header'
import { Menu } from '@/components/Layout/Menu'
import { Footer } from '@/components/Layout/Footer'
import {
  useCustomerOrders,
  useOrderStatistics,
  useRefreshPaymentLink,
  useCancelOrder,
} from '@/hooks/use-orders'
import { OrderWithDetails, Order } from '@/actions/orders'
import { formatDate } from '@/lib/date'
import { formatPrice } from '@/lib/currency'
import { Loading } from '@/components/Layout/Loading'
import { toast } from 'sonner'
import { formatDistance } from 'date-fns'

export default function CustomerOrdersPage() {
  const router = useRouter()

  const [searchTerm, setSearchTerm] = useState('')
  const [selectedOrder, setSelectedOrder] = useState<OrderWithDetails | null>(
    null,
  )

  const { data: orders = [], isLoading: ordersLoading } = useCustomerOrders()
  const { data: statistics } = useOrderStatistics()
  const refreshPaymentMutation = useRefreshPaymentLink()
  const cancelOrderMutation = useCancelOrder()

  const filteredOrders = orders.filter(
    (order) =>
      order.order_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.order_items.some((item) =>
        item.product_name.toLowerCase().includes(searchTerm.toLowerCase()),
      ),
  )

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
          <Badge variant='default' className='bg-green-500'>
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
        return <Badge variant='outline'>Unknown Status</Badge>
    }
  }

  const getStatusIcon = (status: Order['status']) => {
    switch (status) {
      case 'pending':
        return <Clock className='h-4 w-4 text-orange-600' />
      case 'processing':
        return <Package className='h-4 w-4 text-blue-600' />
      case 'shipped':
        return <Truck className='h-4 w-4 text-purple-600' />
      case 'delivered':
        return <CheckCircle className='h-4 w-4 text-green-600' />
      case 'cancelled':
        return <XCircle className='h-4 w-4 text-red-600' />
      case 'expired':
        return <XCircle className='h-4 w-4 text-gray-600' />
      default:
        return <Package className='h-4 w-4 text-gray-600' />
    }
  }

  const getStatusText = (status: Order['status']) => {
    switch (status) {
      case 'pending':
        return 'Awaiting Payment'
      case 'processing':
        return 'Processing'
      case 'shipped':
        return 'Shipped'
      case 'delivered':
        return 'Delivered'
      case 'cancelled':
        return 'Cancelled'
      case 'expired':
        return 'Expired'
      default:
        return 'Unknown Status'
    }
  }

  const generateTrackingNumber = (orderNumber: string) => {
    return `TH${orderNumber.replace('ORD-', '')}TH`
  }

  const isExpiringSoon = (expiresAt?: string) => {
    if (!expiresAt) return false
    const expiry = new Date(expiresAt)
    const now = new Date()
    const diffHours = (expiry.getTime() - now.getTime()) / (1000 * 60 * 60)
    return diffHours < 24 && diffHours > 0
  }

  const isExpired = (expiresAt?: string) => {
    if (!expiresAt) return false
    return new Date(expiresAt) < new Date()
  }

  const copyPaymentLink = async (orderId: string) => {
    try {
      const paymentLink = `${window.location.origin}/payment/${orderId}`
      await navigator.clipboard.writeText(paymentLink)
      toast.success('Payment link copied to clipboard!')
    } catch (error) {
      toast.error('Failed to copy payment link')
    }
  }

  const openPaymentLink = (order: OrderWithDetails) => {
    if (order.payment_link) {
      window.open(order.payment_link, '_blank')
    } else {
      toast.error('Payment link not available')
    }
  }

  const refreshPayment = async (
    orderId: string,
    paymentMethod: 'card' | 'qr' = 'card',
  ) => {
    try {
      await refreshPaymentMutation.mutateAsync({
        orderId,
        paymentMethod,
      })
      toast.success('Payment link refreshed! Opening new payment page...')
    } catch (error) {
      toast.error('Failed to refresh payment link')
    }
  }

  const cancelOrder = async (orderId: string) => {
    if (!window.confirm('Are you sure you want to cancel this order?')) {
      return
    }

    try {
      await cancelOrderMutation.mutateAsync({
        orderId,
        reason: 'Cancelled by customer',
      })
      toast.success('Order cancelled successfully')
    } catch (error) {
      toast.error('Failed to cancel order')
    }
  }

  if (ordersLoading) {
    return <Loading />
  }

  return (
    <div className='flex min-h-screen flex-col items-center bg-[#fff9df]'>
      <Header />
      <Menu />

      <div className='w-full p-5'>
        <div className='w-full py-6'>
          <div className='container mx-auto max-w-6xl px-4'>
            <div className='mb-6'>
              <div className='mb-4 flex items-center gap-3'>
                <Button
                  variant='ghost'
                  size='sm'
                  onClick={() => router.back()}
                  className='p-2'
                >
                  <ArrowLeft className='h-4 w-4' />
                </Button>
                <div>
                  <h1 className='text-2xl font-bold text-gray-900'>
                    My Orders
                  </h1>
                  <p className='text-gray-600'>
                    Track your order status and complete payments
                  </p>
                </div>
              </div>
            </div>

            <div className='mb-6'>
              <div className='relative bg-white'>
                <Search className='absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-gray-400' />
                <Input
                  type='text'
                  placeholder='Search orders by order number or product name...'
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className='pl-10'
                />
              </div>
            </div>

            <div className='mb-6 grid grid-cols-2 gap-4 md:grid-cols-5'>
              <Card>
                <CardContent className='pt-6'>
                  <div className='text-center'>
                    <div className='text-2xl font-bold text-[#dda700]'>
                      {statistics?.total || 0}
                    </div>
                    <p className='text-sm text-gray-600'>Total Orders</p>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className='pt-6'>
                  <div className='text-center'>
                    <div className='text-2xl font-bold text-orange-600'>
                      {statistics?.pending || 0}
                    </div>
                    <p className='text-sm text-gray-600'>Pending Payment</p>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className='pt-6'>
                  <div className='text-center'>
                    <div className='text-2xl font-bold text-blue-600'>
                      {statistics?.processing || 0}
                    </div>
                    <p className='text-sm text-gray-600'>Processing</p>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className='pt-6'>
                  <div className='text-center'>
                    <div className='text-2xl font-bold text-purple-600'>
                      {statistics?.shipped || 0}
                    </div>
                    <p className='text-sm text-gray-600'>Shipped</p>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className='pt-6'>
                  <div className='text-center'>
                    <div className='text-2xl font-bold text-green-600'>
                      {statistics?.delivered || 0}
                    </div>
                    <p className='text-sm text-gray-600'>Delivered</p>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className='space-y-4'>
              {filteredOrders.length === 0 ? (
                <Card>
                  <CardContent className='pt-6'>
                    <div className='py-8 text-center'>
                      <Package className='mx-auto mb-4 h-12 w-12 text-gray-400' />
                      <h3 className='mb-2 text-lg font-medium text-gray-900'>
                        No Orders Found
                      </h3>
                      <p className='text-gray-600'>
                        {searchTerm
                          ? 'No orders match your search'
                          : "You haven't placed any orders yet"}
                      </p>
                      <Button onClick={() => router.push('/')} className='mt-4'>
                        Start Shopping
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ) : (
                filteredOrders.map((order) => (
                  <Card key={order.id}>
                    <CardContent className='pt-6'>
                      <div className='flex flex-col justify-between gap-4 lg:flex-row'>
                        <div className='flex-1'>
                          <div className='mb-4 flex items-center justify-between'>
                            <div className='flex items-center gap-3'>
                              <h3 className='text-lg font-semibold'>
                                {order.order_number}
                              </h3>
                              {getStatusBadge(order.status)}
                            </div>
                            <div className='flex items-center gap-1 text-sm text-gray-600'>
                              <Calendar className='h-4 w-4' />
                              {formatDate(order.created_at)}
                            </div>
                          </div>

                          {order.status === 'pending' && (
                            <div className='mb-4'>
                              {order.session_expires_at &&
                              isExpired(order.session_expires_at) ? (
                                <Alert className='border-red-200 bg-red-50'>
                                  <AlertTriangle className='h-4 w-4 text-red-600' />
                                  <AlertDescription className='text-red-800'>
                                    <strong>Payment link expired.</strong> Click
                                    Refresh Payment&quot; to get a new link.
                                  </AlertDescription>
                                </Alert>
                              ) : order.session_expires_at &&
                                isExpiringSoon(order.session_expires_at) ? (
                                <Alert className='border-orange-200 bg-orange-50'>
                                  <Clock className='h-4 w-4 text-orange-600' />
                                  <AlertDescription className='text-orange-800'>
                                    <strong>
                                      Payment link expires{' '}
                                      {formatDistance(
                                        new Date(order.session_expires_at),
                                        new Date(),
                                        { addSuffix: true },
                                      )}
                                      .
                                    </strong>{' '}
                                    Complete payment soon.
                                  </AlertDescription>
                                </Alert>
                              ) : (
                                <Alert className='border-blue-200 bg-blue-50'>
                                  <CreditCard className='h-4 w-4 text-blue-600' />
                                  <AlertDescription className='text-blue-800'>
                                    <strong>Payment Required:</strong> Complete
                                    your payment to process this order.
                                  </AlertDescription>
                                </Alert>
                              )}
                            </div>
                          )}

                          <div className='mb-4 space-y-3'>
                            {order.order_items.map((item) => (
                              <div
                                key={item.id}
                                className='flex items-center gap-3 rounded-lg bg-gray-50 p-3'
                              >
                                <div className='flex h-12 w-12 items-center justify-center rounded-md bg-gray-200'>
                                  <Package className='h-6 w-6 text-gray-400' />
                                </div>
                                <div className='flex-1'>
                                  <h4 className='text-sm font-medium'>
                                    {item.product_name}
                                  </h4>
                                  <p className='text-sm text-gray-600'>
                                    Quantity: {item.quantity} ×{' '}
                                    {formatPrice(item.unit_price)}
                                  </p>
                                </div>
                                <div className='text-right'>
                                  <p className='font-medium'>
                                    {formatPrice(item.total_price)}
                                  </p>
                                </div>
                              </div>
                            ))}
                          </div>

                          <div className='mb-4'>
                            <div className='flex items-start gap-2 text-sm text-gray-600'>
                              <MapPin className='mt-0.5 h-4 w-4 flex-shrink-0' />
                              <span>{order.shipping_address}</span>
                            </div>
                          </div>

                          {(order.status === 'shipped' ||
                            order.status === 'delivered') && (
                            <div className='mb-4'>
                              <div className='rounded-lg border border-blue-200 bg-blue-50 p-3'>
                                <div className='flex items-center gap-2'>
                                  <Truck className='h-4 w-4 text-blue-600' />
                                  <span className='text-sm font-medium text-blue-900'>
                                    Tracking Number:{' '}
                                    {generateTrackingNumber(order.order_number)}
                                  </span>
                                </div>
                                {order.shipped_at && (
                                  <p className='mt-1 text-xs text-blue-700'>
                                    Shipped on {formatDate(order.shipped_at)}
                                  </p>
                                )}
                                {order.delivered_at && (
                                  <p className='mt-1 text-xs text-green-700'>
                                    Delivered on{' '}
                                    {formatDate(order.delivered_at)}
                                  </p>
                                )}
                              </div>
                            </div>
                          )}

                          {order.notes && (
                            <div className='mb-4'>
                              <div className='rounded-lg border border-gray-200 bg-gray-50 p-3'>
                                <p className='text-sm text-gray-700'>
                                  <strong>Notes:</strong> {order.notes}
                                </p>
                              </div>
                            </div>
                          )}
                        </div>

                        <div className='lg:w-64 lg:border-l lg:pl-6'>
                          <div className='space-y-3'>
                            <div className='flex items-center gap-2'>
                              {getStatusIcon(order.status)}
                              <span className='font-medium'>
                                {getStatusText(order.status)}
                              </span>
                            </div>

                            <Separator />

                            <div className='space-y-2'>
                              <div className='flex justify-between text-sm'>
                                <span>Subtotal:</span>
                                <span>
                                  {formatPrice(
                                    order.order_items.reduce(
                                      (sum, item) => sum + item.total_price,
                                      0,
                                    ),
                                  )}
                                </span>
                              </div>
                              <div className='flex justify-between text-sm'>
                                <span>Shipping:</span>
                                <span>Free</span>
                              </div>
                              <Separator />
                              <div className='flex justify-between text-lg font-semibold text-[#dda700]'>
                                <span>Total:</span>
                                <span>{formatPrice(order.total_amount)}</span>
                              </div>
                            </div>

                            <div className='space-y-2 pt-2'>
                              <Button
                                variant='outline'
                                size='sm'
                                className='w-full'
                                onClick={() => setSelectedOrder(order)}
                              >
                                <Eye className='mr-2 h-4 w-4' />
                                View Details
                              </Button>

                              {order.status === 'pending' && (
                                <div className='space-y-2'>
                                  {!order.session_expires_at ||
                                  !isExpired(order.session_expires_at) ? (
                                    <>
                                      <Button
                                        size='sm'
                                        className='w-full bg-[#dda700] text-white hover:bg-[#c4950a]'
                                        onClick={() => openPaymentLink(order)}
                                      >
                                        <ExternalLink className='mr-2 h-4 w-4' />
                                        Pay Now
                                      </Button>
                                      <Button
                                        variant='outline'
                                        size='sm'
                                        className='w-full'
                                        onClick={() =>
                                          copyPaymentLink(order.id)
                                        }
                                      >
                                        <Copy className='mr-2 h-4 w-4' />
                                        Copy Payment Link
                                      </Button>
                                    </>
                                  ) : (
                                    <Button
                                      size='sm'
                                      className='w-full'
                                      onClick={() => refreshPayment(order.id)}
                                      disabled={
                                        refreshPaymentMutation.isPending
                                      }
                                    >
                                      {refreshPaymentMutation.isPending ? (
                                        <RefreshCw className='mr-2 h-4 w-4 animate-spin' />
                                      ) : (
                                        <RefreshCw className='mr-2 h-4 w-4' />
                                      )}
                                      Refresh Payment
                                    </Button>
                                  )}
                                </div>
                              )}

                              {(order.status === 'shipped' ||
                                order.status === 'delivered') && (
                                <Button
                                  variant='outline'
                                  size='sm'
                                  className='w-full'
                                  onClick={() =>
                                    window.open(
                                      `https://track.thailandpost.co.th/?trackNumber=${generateTrackingNumber(order.order_number)}`,
                                      '_blank',
                                    )
                                  }
                                >
                                  <Truck className='mr-2 h-4 w-4' />
                                  Track Package
                                </Button>
                              )}

                              {order.status === 'delivered' && (
                                <Button
                                  size='sm'
                                  className='w-full bg-[#dda700] text-white hover:bg-[#c4950a]'
                                  onClick={() => {
                                    toast.info('Reorder feature coming soon!')
                                  }}
                                >
                                  Reorder
                                </Button>
                              )}

                              {order.status === 'pending' && (
                                <Button
                                  variant='destructive'
                                  size='sm'
                                  className='w-full'
                                  onClick={() => cancelOrder(order.id)}
                                  disabled={cancelOrderMutation.isPending}
                                >
                                  <XCircle className='mr-2 h-4 w-4' />
                                  Cancel Order
                                </Button>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </div>
        </div>

        <Footer className='mt-5 text-black' />
      </div>

      <Dialog
        open={!!selectedOrder}
        onOpenChange={() => setSelectedOrder(null)}
      >
        <DialogContent className='max-h-[80vh] max-w-2xl overflow-y-auto'>
          <DialogHeader>
            <DialogTitle className='flex items-center justify-between'>
              Order Details - {selectedOrder?.order_number}
            </DialogTitle>
          </DialogHeader>

          {selectedOrder && (
            <div className='space-y-6'>
              <div className='flex items-center justify-between'>
                <div className='flex items-center gap-3'>
                  {getStatusIcon(selectedOrder.status)}
                  <span className='font-medium'>
                    {getStatusText(selectedOrder.status)}
                  </span>
                  {getStatusBadge(selectedOrder.status)}
                </div>
                <span className='text-sm text-gray-600'>
                  {formatDate(selectedOrder.created_at)}
                </span>
              </div>

              <Separator />

              <div>
                <h3 className='mb-3 font-semibold'>Order Items</h3>
                <div className='space-y-3'>
                  {selectedOrder.order_items?.map((item) => (
                    <div
                      key={item.id}
                      className='flex items-center justify-between rounded-lg bg-gray-50 p-3'
                    >
                      <div>
                        <h4 className='font-medium'>{item.product_name}</h4>
                        <p className='text-sm text-gray-600'>
                          {formatPrice(item.unit_price)} × {item.quantity}
                        </p>
                      </div>
                      <span className='font-medium'>
                        {formatPrice(item.total_price)}
                      </span>
                    </div>
                  )) || <p className='text-sm text-gray-500'>No items found</p>}
                </div>
              </div>

              <Separator />

              <div>
                <h3 className='mb-3 font-semibold'>Shipping Information</h3>
                <div className='rounded-lg bg-gray-50 p-3'>
                  <div className='flex items-start gap-2'>
                    <MapPin className='mt-0.5 h-4 w-4 text-gray-600' />
                    <span className='text-sm'>
                      {selectedOrder.shipping_address ||
                        'No shipping address provided'}
                    </span>
                  </div>
                </div>
              </div>

              {(selectedOrder.status === 'shipped' ||
                selectedOrder.status === 'delivered') && (
                <div>
                  <h3 className='mb-3 font-semibold'>Tracking Information</h3>
                  <div className='rounded-lg bg-blue-50 p-3'>
                    <div className='mb-2 flex items-center gap-2'>
                      <Truck className='h-4 w-4 text-blue-600' />
                      <span className='text-sm font-medium text-blue-900'>
                        Tracking Number:{' '}
                        {generateTrackingNumber(selectedOrder.order_number)}
                      </span>
                    </div>
                    {selectedOrder.shipped_at && (
                      <p className='mb-1 text-xs text-blue-700'>
                        Shipped on {formatDate(selectedOrder.shipped_at)}
                      </p>
                    )}
                    {selectedOrder.delivered_at && (
                      <p className='text-xs text-green-700'>
                        Delivered on {formatDate(selectedOrder.delivered_at)}
                      </p>
                    )}
                  </div>
                </div>
              )}

              {selectedOrder.notes && (
                <div>
                  <h3 className='mb-3 font-semibold'>Order Notes</h3>
                  <div className='rounded-lg bg-gray-50 p-3'>
                    <p className='text-sm'>{selectedOrder.notes}</p>
                  </div>
                </div>
              )}

              <Separator />

              <div className='space-y-2'>
                <div className='flex justify-between text-sm'>
                  <span>Subtotal:</span>
                  <span>
                    {formatPrice(
                      selectedOrder.order_items?.reduce(
                        (sum, item) => sum + (item.total_price || 0),
                        0,
                      ) || 0,
                    )}
                  </span>
                </div>
                <div className='flex justify-between text-sm'>
                  <span>Shipping:</span>
                  <span>Free</span>
                </div>
                <Separator />
                <div className='flex justify-between text-lg font-semibold text-[#dda700]'>
                  <span>Total:</span>
                  <span>{formatPrice(selectedOrder.total_amount || 0)}</span>
                </div>
              </div>

              {selectedOrder.order_status_history &&
                Array.isArray(selectedOrder.order_status_history) &&
                selectedOrder.order_status_history.length > 0 && (
                  <div>
                    <h3 className='mb-3 font-semibold'>Order History</h3>
                    <div className='max-h-32 space-y-2 overflow-y-auto'>
                      {selectedOrder.order_status_history
                        .filter((history) => history && history.created_at)
                        .sort((a, b) => {
                          try {
                            const dateA = new Date(a.created_at).getTime()
                            const dateB = new Date(b.created_at).getTime()
                            return dateB - dateA
                          } catch (error) {
                            console.error('Error sorting dates:', error)
                            return 0
                          }
                        })
                        .map((history, index) => (
                          <div
                            key={history.id || index}
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
                              {(() => {
                                try {
                                  return formatDistance(
                                    new Date(history.created_at),
                                    new Date(),
                                    { addSuffix: true },
                                  )
                                } catch (error) {
                                  console.error('Error formatting date:', error)
                                  return (
                                    formatDate(history.created_at) ||
                                    'Unknown date'
                                  )
                                }
                              })()}
                            </span>
                          </div>
                        ))}
                    </div>
                  </div>
                )}

              {selectedOrder.status === 'pending' && (
                <div className='space-y-2'>
                  <h3 className='font-semibold'>Payment Actions</h3>
                  {selectedOrder.session_expires_at &&
                  isExpired(selectedOrder.session_expires_at) ? (
                    <div className='space-y-2'>
                      <Alert className='border-red-200 bg-red-50'>
                        <AlertTriangle className='h-4 w-4 text-red-600' />
                        <AlertDescription className='text-red-800'>
                          Payment link has expired. Please refresh to get a new
                          payment link.
                        </AlertDescription>
                      </Alert>
                      <Button
                        className='w-full'
                        onClick={() => refreshPayment(selectedOrder.id)}
                        disabled={refreshPaymentMutation.isPending}
                      >
                        {refreshPaymentMutation.isPending ? (
                          <RefreshCw className='mr-2 h-4 w-4 animate-spin' />
                        ) : (
                          <RefreshCw className='mr-2 h-4 w-4' />
                        )}
                        Refresh Payment Link
                      </Button>
                    </div>
                  ) : (
                    <div className='space-y-2'>
                      <Button
                        className='w-full bg-[#dda700] text-white hover:bg-[#c4950a]'
                        onClick={() => openPaymentLink(selectedOrder)}
                      >
                        <ExternalLink className='mr-2 h-4 w-4' />
                        Complete Payment
                      </Button>
                      <Button
                        variant='outline'
                        className='w-full'
                        onClick={() => copyPaymentLink(selectedOrder.id)}
                      >
                        <Copy className='mr-2 h-4 w-4' />
                        Copy Payment Link
                      </Button>
                      <Button
                        variant='destructive'
                        className='w-full'
                        onClick={() => {
                          cancelOrder(selectedOrder.id)
                          setSelectedOrder(null)
                        }}
                        disabled={cancelOrderMutation.isPending}
                      >
                        <XCircle className='mr-2 h-4 w-4' />
                        Cancel Order
                      </Button>
                    </div>
                  )}
                </div>
              )}

              {(selectedOrder.status === 'shipped' ||
                selectedOrder.status === 'delivered') && (
                <div className='space-y-2'>
                  <Button
                    variant='outline'
                    className='w-full'
                    onClick={() =>
                      window.open(
                        `https://track.thailandpost.co.th/?trackNumber=${generateTrackingNumber(selectedOrder.order_number)}`,
                        '_blank',
                      )
                    }
                  >
                    <Truck className='mr-2 h-4 w-4' />
                    Track Package Online
                  </Button>
                </div>
              )}

              {selectedOrder.status === 'delivered' && (
                <div className='space-y-2'>
                  <Button
                    className='w-full bg-[#dda700] text-white hover:bg-[#c4950a]'
                    onClick={() => {
                      toast.info('Reorder feature coming soon!')
                      setSelectedOrder(null)
                    }}
                  >
                    <Package className='mr-2 h-4 w-4' />
                    Reorder Items
                  </Button>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}

'use client'
import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Input } from '@/components/ui/input'
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
} from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import { Header } from '@/components/Layout/Header'
import { Menu } from '@/components/Layout/Menu'
import { Footer } from '@/components/Layout/Footer'
import {
  OrderWithDetails,
  getCustomerOrders,
  getOrderStatistics,
  Order,
} from '@/actions/orders'
import { formatDate } from '@/lib/date'
import { formatPrice } from '@/lib/currency'
import { Loading } from '@/components/Layout/Loading'

export default function CustomerOrdersPage() {
  const router = useRouter()
  const { user } = useAuth()

  const [searchTerm, setSearchTerm] = useState('')
  const [selectedOrder, setSelectedOrder] = useState<OrderWithDetails | null>(
    null,
  )

  const { data: orders = [], isLoading: ordersLoading } = useQuery({
    queryKey: ['customer-orders', user?.id],
    queryFn: () => getCustomerOrders(user!.id),
    enabled: !!user?.id,
  })

  const { data: statistics } = useQuery({
    queryKey: ['order-statistics', user?.id],
    queryFn: () => getOrderStatistics(user!.id),
    enabled: !!user?.id,
  })

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
            Pending
          </Badge>
        )
      case 'processing':
        return (
          <Badge variant='default' className='bg-blue-500'>
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
      default:
        return <Package className='h-4 w-4 text-gray-600' />
    }
  }

  const getStatusText = (status: Order['status']) => {
    switch (status) {
      case 'pending':
        return 'Order Received'
      case 'processing':
        return 'Processing'
      case 'shipped':
        return 'Shipped'
      case 'delivered':
        return 'Delivered'
      case 'cancelled':
        return 'Cancelled'
      default:
        return 'Unknown Status'
    }
  }

  const generateTrackingNumber = (orderNumber: string) => {
    return `TH${orderNumber.replace('ORD-', '')}TH`
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
                    Track your order status and purchase history
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
                    <p className='text-sm text-gray-600'>Pending</p>
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
                                    console.log('Reorder:', order.id)
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
                                  onClick={() => {
                                    console.log('Cancel order:', order.id)
                                  }}
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
    </div>
  )
}

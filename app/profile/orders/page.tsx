'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import {
  Package,
  Search,
  Eye,
  Truck,
  CheckCircle,
  XCircle,
  ArrowLeft,
  User,
  Calendar,
  MapPin,
} from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'

type OrderStatus =
  | 'pending'
  | 'processing'
  | 'shipped'
  | 'delivered'
  | 'cancelled'

interface OrderItem {
  id: string
  name: string
  image: string
  quantity: number
  price: number
}

interface CustomerOrder {
  id: string
  orderDate: string
  items: OrderItem[]
  total: number
  status: OrderStatus
  shippingAddress: string
  trackingNumber?: string
}

export default function CustomerOrdersPage() {
  const router = useRouter()
  const { profile } = useAuth()

  const [orders] = useState<CustomerOrder[]>([
    {
      id: 'ORD-001',
      orderDate: '2024-01-15',
      items: [
        {
          id: '1',
          name: 'Extra Virgin Olive Oil 500ml',
          image: '/placeholder.jpg',
          quantity: 2,
          price: 450,
        },
        {
          id: '2',
          name: 'Organic Honey 250g',
          image: '/placeholder.jpg',
          quantity: 1,
          price: 320,
        },
      ],
      total: 1220,
      status: 'delivered',
      shippingAddress:
        '123 Moo 5 Sukhumvit Soi 21 Klongtan Wattana Bangkok 10110',
      trackingNumber: 'TH1234567890',
    },
    {
      id: 'ORD-002',
      orderDate: '2024-01-20',
      items: [
        {
          id: '3',
          name: 'Premium Olive Oil 750ml',
          image: '/placeholder.jpg',
          quantity: 1,
          price: 680,
        },
      ],
      total: 680,
      status: 'shipped',
      shippingAddress:
        '123 Moo 5 Sukhumvit Soi 21 Klongtan Wattana Bangkok 10110',
      trackingNumber: 'TH0987654321',
    },
    {
      id: 'ORD-003',
      orderDate: '2024-01-22',
      items: [
        {
          id: '4',
          name: 'Wild Honey 500g',
          image: '/placeholder.jpg',
          quantity: 1,
          price: 550,
        },
        {
          id: '5',
          name: 'Organic Olive Oil 250ml',
          image: '/placeholder.jpg',
          quantity: 3,
          price: 380,
        },
      ],
      total: 1690,
      status: 'processing',
      shippingAddress:
        '123 Moo 5 Sukhumvit Soi 21 Klongtan Wattana Bangkok 10110',
    },
  ])

  const [searchTerm, setSearchTerm] = useState('')
  const [selectedOrder, setSelectedOrder] = useState<CustomerOrder | null>(null)

  const filteredOrders = orders.filter(
    (order) =>
      order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.items.some((item) =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase()),
      ),
  )

  const getStatusBadge = (status: OrderStatus) => {
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

  const getStatusIcon = (status: OrderStatus) => {
    switch (status) {
      case 'pending':
        return <Package className='h-4 w-4 text-orange-600' />
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

  const getStatusText = (status: OrderStatus) => {
    switch (status) {
      case 'pending':
        return 'Pending'
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

  return (
    <div className='min-h-screen bg-gray-50 py-6'>
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
              <h1 className='text-2xl font-bold text-gray-900'>My Orders</h1>
              <p className='text-gray-600'>
                Track your order status and purchase history
              </p>
            </div>
          </div>
        </div>

        <div className='mb-6 grid grid-cols-2 gap-4 md:grid-cols-4'>
          <Card>
            <CardContent className='pt-6'>
              <div className='text-center'>
                <div className='text-2xl font-bold text-[#dda700]'>
                  {orders.length}
                </div>
                <p className='text-sm text-gray-600'>Total Orders</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className='pt-6'>
              <div className='text-center'>
                <div className='text-2xl font-bold text-blue-600'>
                  {orders.filter((o) => o.status === 'processing').length}
                </div>
                <p className='text-sm text-gray-600'>Processing</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className='pt-6'>
              <div className='text-center'>
                <div className='text-2xl font-bold text-purple-600'>
                  {orders.filter((o) => o.status === 'shipped').length}
                </div>
                <p className='text-sm text-gray-600'>Shipped</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className='pt-6'>
              <div className='text-center'>
                <div className='text-2xl font-bold text-green-600'>
                  {orders.filter((o) => o.status === 'delivered').length}
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
                      {/* Order Header */}
                      <div className='mb-4 flex items-center justify-between'>
                        <div className='flex items-center gap-3'>
                          <h3 className='text-lg font-semibold'>{order.id}</h3>
                          {getStatusBadge(order.status)}
                        </div>
                        <div className='flex items-center gap-1 text-sm text-gray-600'>
                          <Calendar className='h-4 w-4' />
                          {new Date(order.orderDate).toLocaleDateString(
                            'en-US',
                          )}
                        </div>
                      </div>

                      {/* Order Items */}
                      <div className='mb-4 space-y-3'>
                        {order.items.map((item) => (
                          <div
                            key={item.id}
                            className='flex items-center gap-3 rounded-lg bg-gray-50 p-3'
                          >
                            <div className='flex h-12 w-12 items-center justify-center rounded-md bg-gray-200'>
                              <Package className='h-6 w-6 text-gray-400' />
                            </div>
                            <div className='flex-1'>
                              <h4 className='text-sm font-medium'>
                                {item.name}
                              </h4>
                              <p className='text-sm text-gray-600'>
                                Quantity: {item.quantity}
                              </p>
                            </div>
                            <div className='text-right'>
                              <p className='font-medium'>
                                ฿{(item.price * item.quantity).toLocaleString()}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>

                      <div className='mb-4'>
                        <div className='flex items-start gap-2 text-sm text-gray-600'>
                          <MapPin className='mt-0.5 h-4 w-4 flex-shrink-0' />
                          <span>{order.shippingAddress}</span>
                        </div>
                      </div>

                      {order.trackingNumber && (
                        <div className='mb-4'>
                          <div className='rounded-lg border border-blue-200 bg-blue-50 p-3'>
                            <div className='flex items-center gap-2'>
                              <Truck className='h-4 w-4 text-blue-600' />
                              <span className='text-sm font-medium text-blue-900'>
                                Tracking Number: {order.trackingNumber}
                              </span>
                            </div>
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
                              ฿
                              {order.items
                                .reduce(
                                  (sum, item) =>
                                    sum + item.price * item.quantity,
                                  0,
                                )
                                .toLocaleString()}
                            </span>
                          </div>
                          <div className='flex justify-between text-sm'>
                            <span>Shipping:</span>
                            <span>Free</span>
                          </div>
                          <Separator />
                          <div className='flex justify-between text-lg font-semibold text-[#dda700]'>
                            <span>Total:</span>
                            <span>฿{order.total.toLocaleString()}</span>
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

                          {order.status === 'shipped' &&
                            order.trackingNumber && (
                              <Button
                                variant='outline'
                                size='sm'
                                className='w-full'
                                onClick={() =>
                                  window.open(
                                    `https://track.thailandpost.co.th/?trackNumber=${order.trackingNumber}`,
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
                            >
                              Reorder
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
  )
}

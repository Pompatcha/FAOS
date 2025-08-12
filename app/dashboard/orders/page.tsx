'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Search, Eye, Package, Truck } from 'lucide-react'
import { OrderModal } from './components/order-modal'
import { ConfirmModal } from './components/confirm-modal'
import {
  useAllOrders,
  useAllOrderStatistics,
  useUpdateOrderWithTracking,
} from '@/hooks/use-orders'
import { OrderWithDetails, Order } from '@/actions/orders'
import { formatDate } from '@/lib/date'
import { formatPrice } from '@/lib/currency'
import { Loading } from '@/components/Layout/Loading'
import { toast } from 'sonner'

interface ConfirmModalState {
  isOpen: boolean
  title: string
  description: string
  onConfirm: () => void
}

export default function OrdersPage() {
  const [searchTerm, setSearchTerm] = useState<string>('')
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false)
  const [selectedOrder, setSelectedOrder] = useState<OrderWithDetails | null>(
    null,
  )

  const { data: orders = [], isLoading: ordersLoading } = useAllOrders()
  const { data: statistics } = useAllOrderStatistics()
  const updateOrderMutation = useUpdateOrderWithTracking()

  const [confirmModal, setConfirmModal] = useState<ConfirmModalState>({
    isOpen: false,
    title: '',
    description: '',
    onConfirm: () => {},
  })

  const filteredOrders = orders.filter((order) => {
    if (!order) return false

    const searchLower = searchTerm.toLowerCase()
    const customerName = order?.customers?.full_name || 'Unknown Customer'
    const customerEmail = order?.customers?.email || ''
    const orderNumber = order?.order_number || ''

    return (
      orderNumber.toLowerCase().includes(searchLower) ||
      customerName.toLowerCase().includes(searchLower) ||
      customerEmail.toLowerCase().includes(searchLower) ||
      (order.order_items &&
        order.order_items.some((item) =>
          item?.product_name?.toLowerCase().includes(searchLower),
        ))
    )
  })

  const handleUpdateOrderStatus = async (
    orderId: string,
    newStatus: Order['status'],
    trackingNumber?: string,
    notes?: string,
  ) => {
    try {
      await updateOrderMutation.mutateAsync({
        orderId,
        status: newStatus,
        trackingNumber,
        notes,
        updatedBy: 'admin',
      })
      toast.success(`Order status updated to ${newStatus}`)
      setConfirmModal({
        isOpen: false,
        title: '',
        description: '',
        onConfirm: () => {},
      })
      setIsModalOpen(false)
    } catch (error) {
      toast.error('Failed to update order status')
    }
  }

  const showConfirmModal = (
    orderId: string,
    newStatus: Order['status'],
    actionText: string,
    description: string,
  ) => {
    setConfirmModal({
      isOpen: true,
      title: `Confirm ${actionText}`,
      description: description,
      onConfirm: () => handleUpdateOrderStatus(orderId, newStatus),
    })
  }

  const openOrderModal = (order: OrderWithDetails) => {
    setSelectedOrder(order)
    setIsModalOpen(true)
  }

  if (ordersLoading) {
    return <Loading />
  }

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

  const getStatusActions = (order: OrderWithDetails) => {
    const orderNumber = order.order_number || 'N/A'

    switch (order.status) {
      case 'pending':
        return (
          <Button
            size='sm'
            onClick={() =>
              showConfirmModal(
                order.id,
                'processing',
                'Process Order',
                `Do you want to start processing order ${orderNumber}?`,
              )
            }
          >
            <Package className='mr-1 h-3 w-3' />
            Process
          </Button>
        )
      case 'processing':
        return (
          <Button size='sm' onClick={() => openOrderModal(order)}>
            <Truck className='mr-1 h-3 w-3' />
            Ship
          </Button>
        )
      case 'shipped':
        return (
          <Button
            size='sm'
            onClick={() =>
              showConfirmModal(
                order.id,
                'delivered',
                'Mark as Delivered',
                `Do you want to mark order ${orderNumber} as delivered?`,
              )
            }
          >
            Delivered
          </Button>
        )
      default:
        return null
    }
  }

  const getCustomerInfo = (order: OrderWithDetails) => {
    const customer = order?.customers
    return {
      name: customer?.full_name || 'Unknown Customer',
      email: customer?.email || '',
    }
  }

  return (
    <div className='space-y-6'>
      <div className='flex items-center justify-between'>
        <div>
          <h1 className='text-3xl font-bold'>Order Management</h1>
          <p className='text-muted-foreground'>Manage customer orders</p>
        </div>
      </div>

      <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-5'>
        <Card>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>Total Orders</CardTitle>
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold text-[#dda700]'>
              {statistics?.total || 0}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>
              Pending Payment
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold text-orange-600'>
              {statistics?.pending || 0}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>Processing</CardTitle>
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold text-blue-600'>
              {statistics?.processing || 0}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>Shipped</CardTitle>
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold text-purple-600'>
              {statistics?.shipped || 0}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>Delivered</CardTitle>
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold text-green-600'>
              {statistics?.delivered || 0}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Order List</CardTitle>
          <CardDescription>
            Total {filteredOrders.length} orders
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className='mb-4 flex items-center space-x-2'>
            <div className='relative max-w-sm flex-1'>
              <Search className='text-muted-foreground absolute top-2.5 left-2 h-4 w-4' />
              <Input
                placeholder='Search by order number, customer, or product...'
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className='pl-8'
              />
            </div>
          </div>

          <div className='rounded-md border'>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Order Number</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Items</TableHead>
                  <TableHead>Order Date</TableHead>
                  <TableHead>Total</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className='text-right'>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredOrders.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className='py-8 text-center'>
                      <div className='text-gray-500'>
                        {searchTerm
                          ? 'No orders match your search'
                          : 'No orders found'}
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredOrders.map((order) => {
                    const customerInfo = getCustomerInfo(order)

                    return (
                      <TableRow key={order.id}>
                        <TableCell className='font-medium'>
                          {order.order_number || 'N/A'}
                        </TableCell>
                        <TableCell>
                          <div>
                            <div className='font-medium'>
                              {customerInfo.name}
                            </div>
                            <div className='text-muted-foreground text-sm'>
                              {customerInfo.email}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className='text-sm'>
                            {order.order_items?.length || 0} item
                            {(order.order_items?.length || 0) > 1 ? 's' : ''}
                            <div className='max-w-[200px] truncate text-xs text-gray-500'>
                              {order.order_items
                                ?.map(
                                  (item) =>
                                    item?.product_name || 'Unknown Product',
                                )
                                .join(', ') || 'No items'}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          {order.created_at
                            ? formatDate(order.created_at)
                            : 'N/A'}
                        </TableCell>
                        <TableCell>
                          {order.total_amount
                            ? formatPrice(order.total_amount)
                            : '฿0.00'}
                        </TableCell>
                        <TableCell>{getStatusBadge(order.status)}</TableCell>
                        <TableCell className='text-right'>
                          <div className='flex justify-end space-x-2'>
                            <Button
                              variant='ghost'
                              size='sm'
                              onClick={() => openOrderModal(order)}
                            >
                              <Eye className='h-4 w-4' />
                            </Button>
                            {getStatusActions(order)}
                          </div>
                        </TableCell>
                      </TableRow>
                    )
                  })
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <OrderModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        order={selectedOrder}
        onUpdateStatus={handleUpdateOrderStatus}
        showConfirmModal={showConfirmModal}
        isLoading={updateOrderMutation.isPending}
      />
      <ConfirmModal
        isOpen={confirmModal.isOpen}
        onClose={() =>
          setConfirmModal({
            isOpen: false,
            title: '',
            description: '',
            onConfirm: () => {},
          })
        }
        onConfirm={confirmModal.onConfirm}
        title={confirmModal.title}
        description={confirmModal.description}
      />
    </div>
  )
}

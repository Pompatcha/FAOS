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

interface ConfirmModalState {
  isOpen: boolean
  title: string
  description: string
  onConfirm: () => void
}

const mockOrders: Order[] = [
  {
    id: 'ORD-001',
    customerName: 'John Smith',
    customerEmail: 'john@email.com',
    items: [
      { name: 'iPhone 15 Pro', quantity: 1, price: 39900 },
      { name: 'AirPods Pro', quantity: 1, price: 8900 },
    ],
    total: 48800,
    status: 'pending',
    orderDate: '2024-01-15',
    shippingAddress: '123 Main Street, New York, NY 10001',
  },
  {
    id: 'ORD-002',
    customerName: 'Jane Doe',
    customerEmail: 'jane@email.com',
    items: [{ name: 'MacBook Air M2', quantity: 1, price: 42900 }],
    total: 42900,
    status: 'processing',
    orderDate: '2024-01-14',
    shippingAddress: '456 Oak Avenue, Los Angeles, CA 90210',
  },
  {
    id: 'ORD-003',
    customerName: 'Mike Johnson',
    customerEmail: 'mike@email.com',
    items: [
      { name: 'iPad Air', quantity: 1, price: 22900 },
      { name: 'Apple Watch Series 9', quantity: 1, price: 13900 },
    ],
    total: 36800,
    status: 'shipped',
    orderDate: '2024-01-13',
    shippingAddress: '789 Pine Street, Chicago, IL 60601',
  },
  {
    id: 'ORD-004',
    customerName: 'Sarah Wilson',
    customerEmail: 'sarah@email.com',
    items: [{ name: 'AirPods Pro', quantity: 2, price: 8900 }],
    total: 17800,
    status: 'delivered',
    orderDate: '2024-01-12',
    shippingAddress: '321 Elm Street, Miami, FL 33101',
  },
  {
    id: 'ORD-005',
    customerName: 'David Brown',
    customerEmail: 'david@email.com',
    items: [{ name: 'iPhone 15 Pro', quantity: 1, price: 39900 }],
    total: 39900,
    status: 'cancelled',
    orderDate: '2024-01-11',
    shippingAddress: '654 Maple Avenue, Seattle, WA 98101',
  },
]

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>(mockOrders)
  const [searchTerm, setSearchTerm] = useState<string>('')
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false)
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)

  const [confirmModal, setConfirmModal] = useState<ConfirmModalState>({
    isOpen: false,
    title: '',
    description: '',
    onConfirm: () => {},
  })

  const filteredOrders = orders.filter(
    (order) =>
      order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customerEmail.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleUpdateOrderStatus = (orderId: string, newStatus: OrderStatus) => {
    setOrders(
      orders.map((order) =>
        order.id === orderId ? { ...order, status: newStatus } : order,
      ),
    )
    setConfirmModal({
      isOpen: false,
      title: '',
      description: '',
      onConfirm: () => {},
    })
  }

  const showConfirmModal = (
    orderId: string,
    newStatus: OrderStatus,
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

  const openOrderModal = (order: Order) => {
    setSelectedOrder(order)
    setIsModalOpen(true)
  }

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

  const getStatusActions = (order: Order) => {
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
                `Do you want to start processing order ${order.id}?`,
              )
            }
          >
            <Package className='mr-1 h-3 w-3' />
            Process
          </Button>
        )
      case 'processing':
        return (
          <Button
            size='sm'
            onClick={() =>
              showConfirmModal(
                order.id,
                'shipped',
                'Ship Order',
                `Do you want to ship order ${order.id}?`,
              )
            }
          >
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
                `Do you want to mark order ${order.id} as delivered?`,
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

  return (
    <div className='space-y-6'>
      <div className='flex items-center justify-between'>
        <div>
          <h1 className='text-3xl font-bold'>Order Management</h1>
          <p className='text-muted-foreground'>Manage customer orders</p>
        </div>
      </div>

      <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-4'>
        <Card>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>New Orders</CardTitle>
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold'>
              {orders.filter((o) => o.status === 'pending').length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>Processing</CardTitle>
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold'>
              {orders.filter((o) => o.status === 'processing').length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>Shipped</CardTitle>
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold'>
              {orders.filter((o) => o.status === 'shipped').length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>Delivered</CardTitle>
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold'>
              {orders.filter((o) => o.status === 'delivered').length}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Order List</CardTitle>
          <CardDescription>Total {orders.length} orders</CardDescription>
        </CardHeader>
        <CardContent>
          <div className='mb-4 flex items-center space-x-2'>
            <div className='relative max-w-sm flex-1'>
              <Search className='text-muted-foreground absolute top-2.5 left-2 h-4 w-4' />
              <Input
                placeholder='Search orders...'
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
                  <TableHead>Order ID</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Order Date</TableHead>
                  <TableHead>Total</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className='text-right'>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredOrders.map((order) => (
                  <TableRow key={order.id}>
                    <TableCell className='font-medium'>{order.id}</TableCell>
                    <TableCell>
                      <div>
                        <div className='font-medium'>{order.customerName}</div>
                        <div className='text-muted-foreground text-sm'>
                          {order.customerEmail}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{order.orderDate}</TableCell>
                    <TableCell>฿{order.total.toLocaleString()}</TableCell>
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
                ))}
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

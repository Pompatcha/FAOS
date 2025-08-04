'use client'

import Image from 'next/image'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Mail,
  Phone,
  MapPin,
  Calendar,
  ShoppingBag,
  DollarSign,
} from 'lucide-react'

type CustomerStatus = 'active' | 'inactive' | 'blocked'

interface Customer {
  id: string
  name: string
  email: string
  phone: string
  address: string
  city: string
  country: string
  status: CustomerStatus
  joinDate: string
  totalOrders: number
  totalSpent: number
  lastOrderDate?: string
  avatar?: string
  notes?: string
}

interface RecentOrder {
  id: string
  date: string
  total: number
  status: 'delivered' | 'shipped' | 'processing' | 'pending' | 'cancelled'
}

interface CustomerDetailsModalProps {
  isOpen: boolean
  onClose: () => void
  customer: Customer | null
}

export function CustomerDetailsModal({
  isOpen,
  onClose,
  customer,
}: CustomerDetailsModalProps) {
  if (!customer) return null

  const getStatusBadge = (status: CustomerStatus) => {
    switch (status) {
      case 'active':
        return <Badge variant='default'>Active</Badge>
      case 'inactive':
        return <Badge variant='secondary'>Inactive</Badge>
      case 'blocked':
        return <Badge variant='destructive'>Blocked</Badge>
      default:
        return <Badge variant='outline'>Unknown</Badge>
    }
  }

  const recentOrders: RecentOrder[] = [
    { id: 'ORD-001', date: '2024-01-15', total: 48800, status: 'delivered' },
    { id: 'ORD-002', date: '2024-01-10', total: 25600, status: 'shipped' },
    { id: 'ORD-003', date: '2024-01-05', total: 15900, status: 'delivered' },
  ]

  const getCustomerTier = (totalSpent: number): string => {
    if (totalSpent > 200000) return 'VIP'
    if (totalSpent > 100000) return 'Gold'
    if (totalSpent > 50000) return 'Silver'
    return 'Bronze'
  }

  const getAverageOrderValue = (
    totalSpent: number,
    totalOrders: number,
  ): number => {
    return totalOrders > 0 ? totalSpent / totalOrders : 0
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className='max-h-[90vh] overflow-y-auto sm:max-w-[700px]'>
        <DialogHeader>
          <DialogTitle className='flex items-center gap-3'>
            <Image
              src={customer.avatar || '/placeholder.svg'}
              alt={customer.name}
              width={48}
              height={48}
              className='h-12 w-12 rounded-full object-cover'
            />
            <div>
              <div>{customer.name}</div>
              <div className='text-muted-foreground text-sm font-normal'>
                Customer Details
              </div>
            </div>
          </DialogTitle>
        </DialogHeader>

        <div className='space-y-6'>
          <div className='flex items-start justify-between'>
            <div className='space-y-2'>
              <div className='flex items-center gap-2'>
                <span className='font-medium'>Status:</span>
                {getStatusBadge(customer.status)}
              </div>
              <div className='text-muted-foreground flex items-center gap-2 text-sm'>
                <Calendar className='h-4 w-4' />
                Joined {customer.joinDate}
              </div>
            </div>
          </div>

          <Separator />

          <div>
            <h4 className='mb-3 font-medium'>Contact Information</h4>
            <div className='space-y-2'>
              <div className='flex items-center gap-2'>
                <Mail className='text-muted-foreground h-4 w-4' />
                <span>{customer.email}</span>
              </div>
              <div className='flex items-center gap-2'>
                <Phone className='text-muted-foreground h-4 w-4' />
                <span>{customer.phone}</span>
              </div>
              <div className='flex items-start gap-2'>
                <MapPin className='text-muted-foreground mt-0.5 h-4 w-4' />
                <div>
                  <div>{customer.address}</div>
                  <div className='text-muted-foreground text-sm'>
                    {customer.city}, {customer.country}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <Separator />

          <div className='grid gap-4 md:grid-cols-3'>
            <Card>
              <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                <CardTitle className='text-sm font-medium'>
                  Total Orders
                </CardTitle>
                <ShoppingBag className='text-muted-foreground h-4 w-4' />
              </CardHeader>
              <CardContent>
                <div className='text-2xl font-bold'>{customer.totalOrders}</div>
                <p className='text-muted-foreground text-xs'>
                  Last order: {customer.lastOrderDate || 'Never'}
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                <CardTitle className='text-sm font-medium'>
                  Total Spent
                </CardTitle>
                <DollarSign className='text-muted-foreground h-4 w-4' />
              </CardHeader>
              <CardContent>
                <div className='text-2xl font-bold'>
                  ฿{customer.totalSpent.toLocaleString()}
                </div>
                <p className='text-muted-foreground text-xs'>
                  Avg: ฿
                  {getAverageOrderValue(
                    customer.totalSpent,
                    customer.totalOrders,
                  ).toLocaleString()}
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                <CardTitle className='text-sm font-medium'>
                  Customer Tier
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className='text-2xl font-bold'>
                  {getCustomerTier(customer.totalSpent)}
                </div>
                <p className='text-muted-foreground text-xs'>
                  Based on total spent
                </p>
              </CardContent>
            </Card>
          </div>

          <div>
            <h4 className='mb-3 font-medium'>Recent Orders</h4>
            <div className='space-y-2'>
              {recentOrders.map((order: RecentOrder) => (
                <div
                  key={order.id}
                  className='flex items-center justify-between rounded-lg border p-3'
                >
                  <div>
                    <div className='font-medium'>{order.id}</div>
                    <div className='text-muted-foreground text-sm'>
                      {order.date}
                    </div>
                  </div>
                  <div className='text-right'>
                    <div className='font-medium'>
                      ฿{order.total.toLocaleString()}
                    </div>
                    <Badge
                      variant={
                        order.status === 'delivered' ? 'default' : 'secondary'
                      }
                      className='text-xs'
                    >
                      {order.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {customer.notes && (
            <>
              <Separator />
              <div>
                <h4 className='mb-2 font-medium'>Notes</h4>
                <p className='text-muted-foreground text-sm'>
                  {customer.notes}
                </p>
              </div>
            </>
          )}
        </div>

        <div className='flex justify-end pt-4'>
          <Button variant='outline' onClick={onClose}>
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

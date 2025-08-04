'use client'

import { useState } from 'react'
import Image from 'next/image'
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
import {
  Plus,
  Search,
  Edit,
  Trash2,
  Eye,
  Mail,
  Phone,
  MapPin,
} from 'lucide-react'
import { CustomerModal } from './components/customer-modal'
import { CustomerDetailsModal } from './components/customer-details-modal'

interface CustomerFormData {
  name: string
  email: string
  phone: string
  address: string
  city: string
  country: string
  status: 'active' | 'inactive' | 'blocked'
  notes: string
}

interface Customer {
  id: number
  name: string
  email: string
  phone: string
  address: string
  city: string
  country: string
  status: 'active' | 'inactive' | 'blocked'
  totalOrders: number
  totalSpent: number
  joinDate: string
  lastOrderDate: string | null
  avatar: string
  notes?: string
}

const mockCustomers: Customer[] = [
  {
    id: 1,
    name: 'John Smith',
    email: 'john@email.com',
    phone: '+1 (555) 123-4567',
    address: '123 Main Street, New York, NY 10001',
    city: 'New York',
    country: 'United States',
    status: 'active',
    totalOrders: 12,
    totalSpent: 145600,
    joinDate: '2023-06-15',
    lastOrderDate: '2024-01-15',
    avatar: '/placeholder.svg?height=40&width=40&text=JS',
  },
  {
    id: 2,
    name: 'Jane Doe',
    email: 'jane@email.com',
    phone: '+1 (555) 987-6543',
    address: '456 Oak Avenue, Los Angeles, CA 90210',
    city: 'Los Angeles',
    country: 'United States',
    status: 'active',
    totalOrders: 8,
    totalSpent: 89300,
    joinDate: '2023-08-22',
    lastOrderDate: '2024-01-14',
    avatar: '/placeholder.svg?height=40&width=40&text=JD',
  },
  {
    id: 3,
    name: 'Mike Johnson',
    email: 'mike@email.com',
    phone: '+1 (555) 456-7890',
    address: '789 Pine Street, Chicago, IL 60601',
    city: 'Chicago',
    country: 'United States',
    status: 'active',
    totalOrders: 15,
    totalSpent: 203400,
    joinDate: '2023-03-10',
    lastOrderDate: '2024-01-13',
    avatar: '/placeholder.svg?height=40&width=40&text=MJ',
  },
  {
    id: 4,
    name: 'Sarah Wilson',
    email: 'sarah@email.com',
    phone: '+1 (555) 321-0987',
    address: '321 Elm Street, Miami, FL 33101',
    city: 'Miami',
    country: 'United States',
    status: 'inactive',
    totalOrders: 3,
    totalSpent: 25700,
    joinDate: '2023-11-05',
    lastOrderDate: '2023-12-20',
    avatar: '/placeholder.svg?height=40&width=40&text=SW',
  },
  {
    id: 5,
    name: 'David Brown',
    email: 'david@email.com',
    phone: '+1 (555) 654-3210',
    address: '654 Maple Avenue, Seattle, WA 98101',
    city: 'Seattle',
    country: 'United States',
    status: 'blocked',
    totalOrders: 2,
    totalSpent: 15800,
    joinDate: '2023-12-01',
    lastOrderDate: '2023-12-15',
    avatar: '/placeholder.svg?height=40&width=40&text=DB',
  },
  {
    id: 6,
    name: 'Emily Davis',
    email: 'emily@email.com',
    phone: '+1 (555) 789-0123',
    address: '987 Cedar Lane, Boston, MA 02101',
    city: 'Boston',
    country: 'United States',
    status: 'active',
    totalOrders: 20,
    totalSpent: 312500,
    joinDate: '2023-01-20',
    lastOrderDate: '2024-01-16',
    avatar: '/placeholder.svg?height=40&width=40&text=ED',
  },
]

export default function CustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>(mockCustomers)
  const [searchTerm, setSearchTerm] = useState('')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false)
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null)
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(
    null,
  )

  const filteredCustomers = customers.filter(
    (customer) =>
      customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.phone.includes(searchTerm) ||
      customer.city.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleAddCustomer = (customerData: CustomerFormData) => {
    const newCustomer: Customer = {
      ...customerData,
      id: Math.max(...customers.map((c) => c.id)) + 1,
      totalOrders: 0,
      totalSpent: 0,
      joinDate: new Date().toISOString().split('T')[0],
      lastOrderDate: null,
      avatar: `/placeholder.svg?height=40&width=40&text=${customerData.name
        .split(' ')
        .map((n: string) => n[0])
        .join('')}`,
    }
    setCustomers([...customers, newCustomer])
  }

  const handleEditCustomer = (customerData: CustomerFormData) => {
    if (!editingCustomer) return

    const updatedCustomer: Customer = {
      ...editingCustomer,
      ...customerData,
    }

    setCustomers(
      customers.map((c) => (c.id === editingCustomer.id ? updatedCustomer : c)),
    )
  }

  const handleDeleteCustomer = (id: number) => {
    setCustomers(customers.filter((c) => c.id !== id))
  }

  const openAddModal = () => {
    setEditingCustomer(null)
    setIsModalOpen(true)
  }

  const openEditModal = (customer: Customer) => {
    setEditingCustomer(customer)
    setIsModalOpen(true)
  }

  const openDetailsModal = (customer: Customer) => {
    setSelectedCustomer(customer)
    setIsDetailsModalOpen(true)
  }

  const getStatusBadge = (status: 'active' | 'inactive' | 'blocked') => {
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

  const activeCustomers = customers.filter((c) => c.status === 'active').length
  const totalCustomers = customers.length
  const totalRevenue = customers.reduce((sum, c) => sum + c.totalSpent, 0)
  const avgOrderValue =
    totalRevenue / customers.reduce((sum, c) => sum + c.totalOrders, 0) || 0

  return (
    <div className='space-y-6'>
      <div className='flex items-center justify-between'>
        <div>
          <h1 className='text-3xl font-bold'>Customer Management</h1>
          <p className='text-muted-foreground'>
            Manage your customers and their information
          </p>
        </div>
        <Button onClick={openAddModal}>
          <Plus className='mr-2 h-4 w-4' />
          Add New Customer
        </Button>
      </div>

      {/* Stats Cards */}
      <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-4'>
        <Card>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>
              Total Customers
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold'>{totalCustomers}</div>
            <p className='text-muted-foreground text-xs'>
              {activeCustomers} active customers
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>
              Active Customers
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold'>{activeCustomers}</div>
            <p className='text-muted-foreground text-xs'>
              {((activeCustomers / totalCustomers) * 100).toFixed(1)}% of total
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>Total Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold'>
              ฿{totalRevenue.toLocaleString()}
            </div>
            <p className='text-muted-foreground text-xs'>From all customers</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>
              Avg Order Value
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold'>
              ฿{avgOrderValue.toLocaleString()}
            </div>
            <p className='text-muted-foreground text-xs'>Per order average</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Customer List</CardTitle>
          <CardDescription>Total {customers.length} customers</CardDescription>
        </CardHeader>
        <CardContent>
          <div className='mb-4 flex items-center space-x-2'>
            <div className='relative max-w-sm flex-1'>
              <Search className='text-muted-foreground absolute top-2.5 left-2 h-4 w-4' />
              <Input
                placeholder='Search customers...'
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
                  <TableHead>Customer</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Orders</TableHead>
                  <TableHead>Total Spent</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className='text-right'>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCustomers.map((customer) => (
                  <TableRow key={customer.id}>
                    <TableCell>
                      <div className='flex items-center space-x-3'>
                        <Image
                          src={customer.avatar || '/placeholder.svg'}
                          alt={customer.name}
                          width={40}
                          height={40}
                          className='rounded-full object-cover'
                        />
                        <div>
                          <div className='font-medium'>{customer.name}</div>
                          <div className='text-muted-foreground text-sm'>
                            Joined {customer.joinDate}
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className='space-y-1'>
                        <div className='flex items-center text-sm'>
                          <Mail className='mr-1 h-3 w-3' />
                          {customer.email}
                        </div>
                        <div className='text-muted-foreground flex items-center text-sm'>
                          <Phone className='mr-1 h-3 w-3' />
                          {customer.phone}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className='flex items-center text-sm'>
                        <MapPin className='mr-1 h-3 w-3' />
                        <div>
                          <div>{customer.city}</div>
                          <div className='text-muted-foreground'>
                            {customer.country}
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className='font-medium'>
                          {customer.totalOrders}
                        </div>
                        <div className='text-muted-foreground text-sm'>
                          Last: {customer.lastOrderDate || 'Never'}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className='font-medium'>
                        ฿{customer.totalSpent.toLocaleString()}
                      </div>
                    </TableCell>
                    <TableCell>{getStatusBadge(customer.status)}</TableCell>
                    <TableCell className='text-right'>
                      <div className='flex justify-end space-x-2'>
                        <Button
                          variant='ghost'
                          size='sm'
                          onClick={() => openDetailsModal(customer)}
                        >
                          <Eye className='h-4 w-4' />
                        </Button>
                        <Button
                          variant='ghost'
                          size='sm'
                          onClick={() => openEditModal(customer)}
                        >
                          <Edit className='h-4 w-4' />
                        </Button>
                        <Button
                          variant='ghost'
                          size='sm'
                          onClick={() => handleDeleteCustomer(customer.id)}
                        >
                          <Trash2 className='h-4 w-4' />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <CustomerModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={editingCustomer ? handleEditCustomer : handleAddCustomer}
        customer={editingCustomer}
      />

      <CustomerDetailsModal
        isOpen={isDetailsModalOpen}
        onClose={() => setIsDetailsModalOpen(false)}
        customer={selectedCustomer}
      />
    </div>
  )
}

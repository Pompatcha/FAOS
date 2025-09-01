import { FC } from 'react'
import { SumCard } from '../components/SumCard'
import { IndexLayout } from '@/components/Layout/Index'
import { Button } from '@/components/ui/button'
import { Download } from 'lucide-react'

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'

const OrderPage: FC = () => {
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
        <div className='flex gap-5'>
          <Button className='w-fit cursor-pointer rounded-xl bg-white p-5 text-[#4a2c00] hover:bg-white/50'>
            <Download /> Export Orders
          </Button>
        </div>
      </div>

      <div>
        <div className='grid grid-cols-4 gap-5 text-[#4a2c00]'>
          <SumCard label={'New Orders'} value={50} href={'/dashboard/orders'} />
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
            <TableRow>
              <TableCell className='font-medium'>#ORD-001</TableCell>
              <TableCell>John Doe</TableCell>
              <TableCell>
                <Badge>Pending</Badge>
              </TableCell>
              <TableCell>
                <Badge>Paid</Badge>
                {/* <span className='rounded-full bg-green-100 px-2 py-1 text-xs text-green-800'>
                  Paid
                </span> */}
              </TableCell>
              <TableCell>Credit Card</TableCell>
              <TableCell>3 items</TableCell>
              <TableCell className='text-right'>฿1,250.00</TableCell>
              <TableCell>2025-09-01</TableCell>
              <TableCell className='text-center'>
                <Button variant='outline' size='sm'>
                  View
                </Button>
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell className='font-medium'>#ORD-002</TableCell>
              <TableCell>Jane Smith</TableCell>
              <TableCell>
                <span className='rounded-full bg-blue-100 px-2 py-1 text-xs text-blue-800'>
                  Processing
                </span>
              </TableCell>
              <TableCell>
                <span className='rounded-full bg-red-100 px-2 py-1 text-xs text-red-800'>
                  Unpaid
                </span>
              </TableCell>
              <TableCell>Bank Transfer</TableCell>
              <TableCell>1 item</TableCell>
              <TableCell className='text-right'>฿850.00</TableCell>
              <TableCell>2025-08-31</TableCell>
              <TableCell className='text-center'>
                <Button variant='outline' size='sm'>
                  View
                </Button>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>
    </IndexLayout>
  )
}

export default OrderPage

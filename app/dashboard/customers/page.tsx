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

const CustomerPage: FC = () => {
  return (
    <IndexLayout>
      <div className='flex justify-between'>
        <div className='flex flex-col gap-2.5 text-white'>
          <span className='text-4xl'>Customers</span>
          <span>
            Manage your customer relationships and data. <br />
            View customer profiles, order history, and build lasting
            connections.
          </span>
        </div>
        <div className='flex gap-5'>
          <Button className='w-fit cursor-pointer rounded-xl bg-white p-5 text-[#4a2c00] hover:bg-white/50'>
            <Download /> Export Customers
          </Button>
        </div>
      </div>

      <div>
        <div className='grid grid-cols-4 gap-5 text-[#4a2c00]'>
          <SumCard
            label={'New Customers'}
            value={50}
            href={'/dashboard/customers'}
          />
        </div>
      </div>

      <div className='rounded-xl bg-white p-5'>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className='w-[100px]'>Invoice</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Method</TableHead>
              <TableHead className='text-right'>Amount</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell className='font-medium'>INV001</TableCell>
              <TableCell>Paid</TableCell>
              <TableCell>Credit Card</TableCell>
              <TableCell className='text-right'>$250.00</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>
    </IndexLayout>
  )
}

export default CustomerPage

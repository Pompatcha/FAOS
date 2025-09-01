import { FC } from 'react'
import { SumCard } from './components/SumCard'
import { IndexLayout } from '@/components/Layout/Index'

const DashboardPage: FC = () => {
  return (
    <IndexLayout>
      <div className='flex justify-between'>
        <div className='flex flex-col gap-2.5 text-white'>
          <span className='text-4xl'>Dashboard</span>
          <span>
            Welcome to your store management dashboard. <br /> Monitor your
            sales, orders, and business performance all in one place.
          </span>
        </div>
      </div>

      <div>
        <div className='grid grid-cols-4 gap-5 text-[#4a2c00]'>
          <SumCard label={'Total Revenue'} value={50} />
          <SumCard label={'New Orders'} value={50} href={'/dashboard/orders'} />
          <SumCard
            label={'Total Products'}
            value={50}
            href={'/dashboard/products'}
          />
          <SumCard
            label={'New Customers'}
            value={50}
            href={'/dashboard/customers'}
          />
        </div>
      </div>
    </IndexLayout>
  )
}

export default DashboardPage

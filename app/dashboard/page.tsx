import type { FC } from 'react'

import { IndexLayout } from '@/components/Layout/Index'

import { SumCard } from './components/SumCard'

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
        <div className='grid grid-cols-3 gap-5 text-[#4a2c00]'>
          <SumCard label='Total Revenue' value={50} />
          <SumCard label='New Orders' value={50} href='/dashboard/orders' />
          <SumCard
            label='Total Products'
            value={50}
            href='/dashboard/products'
          />
        </div>
      </div>
    </IndexLayout>
  )
}

export default DashboardPage

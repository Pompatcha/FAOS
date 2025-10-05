'use client'

import type { FC } from 'react'

import { HeaderCard } from '@/components/HeaderCard'
import { IndexLayout } from '@/components/Layout/Index'
import { useRequireAdmin } from '@/contexts/AuthContext.tsx'

const DashboardPage: FC = () => {
  useRequireAdmin()

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
        <div className='grid grid-cols-1 gap-5 text-[#4a2c00] sm:grid-cols-3'>
          <HeaderCard label='Total Revenue' value={0} />
          <HeaderCard label='New Orders' value={0} href='/dashboard/orders' />
          <HeaderCard
            label='Total Products'
            value={0}
            href='/dashboard/products'
          />
        </div>
      </div>
    </IndexLayout>
  )
}

export default DashboardPage

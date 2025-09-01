'use client'

import { useRouter } from 'next/navigation'
import { FC } from 'react'

const ProductCard: FC = () => {
  const router = useRouter()

  const handleClickProduct = () => {
    router.push('/product/098f6bcd4621d373cade4e832627b4f6')
  }

  return (
    <div
      className='flex cursor-pointer flex-col gap-2.5 rounded-xl bg-white'
      onClick={handleClickProduct}
    >
      <img className='h-72 rounded-t-xl object-cover' src='/placeholder.svg' />

      <div className='flex flex-col gap-2.5 p-2.5'>
        <span>ORGANIC THYME HONEY </span>

        <div className='flex justify-between'>
          <span className='text-2xl font-bold text-red-800'>฿250 - ฿500</span>

          <span>50 stock</span>
        </div>
      </div>
    </div>
  )
}

export { ProductCard }

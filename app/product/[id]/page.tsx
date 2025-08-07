'use client'

import { Header } from '@/components/Layout/Header'
import { AuthPanel } from '@/components/Protected/LoginPanel'
import { Menu } from '@/components/Layout/Menu'

// import { use } from 'react'

export default function ProductPage(
  {
    // params,
  }: {
    params: Promise<{ id: string }>
  },
) {
  // const { id } = use(params)

  return (
    <div className='flex flex-col items-center bg-[#dda700]'>
      <Header />
      <Menu />
    </div>
  )
}

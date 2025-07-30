'use client'

import { Header } from '@/components/Header'
import { AuthPanel } from '@/components/LoginPanel'
import { Menu } from '@/components/Menu'

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

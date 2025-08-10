'use client'

import { Banner } from '@/components/Homepage/Banner'
import { Footer } from '@/components/Layout/Footer'
import { Header } from '@/components/Layout/Header'
import { Menu } from '@/components/Layout/Menu'

import { use } from 'react'

export default function ProductPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = use(params)

  return (
    <div className='flex flex-col items-center bg-[#dda700]'>
      <Header />
      <Menu />

      <div className='flex flex-col gap-5 p-5'>
        <Banner />
        <Footer />
      </div>
    </div>
  )
}

'use client'

import { LucideArrowUpRight } from 'lucide-react'
import { useRouter } from 'next/navigation'

import type { FC } from 'react'

type HeaderCardProps = {
  label: string
  value: number
  href?: string
}

const HeaderCard: FC<HeaderCardProps> = ({ label, value, href }) => {
  const router = useRouter()

  return (
    <div className='flex flex-col justify-between rounded-xl bg-white p-5'>
      <div className='flex justify-between'>
        <span className='text-[#0730e9]'>{label}</span>

        {href && (
          <div
            onClick={() => {
              router.push(href)
            }}
            className='flex size-10 cursor-pointer items-center justify-center rounded-full border border-black'
          >
            <LucideArrowUpRight />
          </div>
        )}
      </div>
      <span className='text-bule-800 text-4xl font-bold'>{value}</span>
    </div>
  )
}

export { HeaderCard }

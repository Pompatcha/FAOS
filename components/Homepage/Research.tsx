import Link from 'next/link'
import { FC } from 'react'

const Research: FC = () => {
  return (
    <div className='flex w-full flex-col items-center items-start gap-2.5'>
      <span className='font-bold text-white'>Research & References</span>

      <div className='flex flex-col gap-2.5 text-start'>
        <Link href='' className='text-white'>
          🧪 Olive oil is beneficial for maternal-fetal health
        </Link>
        <Link href='' className='text-white'>
          🍯 Healthline: Benefits of Honey
        </Link>
        <Link href='' className='text-white'>
          📘 Olive Oil~ A Key Component of the Mediterranean Diet
        </Link>
        <Link href='' className='text-white'>
          🌍 Using Greek Honey for Beautiful Skin, Hair, and Anti-Aging
        </Link>
        <Link href='' className='text-white'>
          🔍Everything to Know About the Health Benefits of Honey
        </Link>
      </div>
    </div>
  )
}

export { Research }

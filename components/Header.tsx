import Image from 'next/image'
import { FC } from 'react'

const Header: FC = () => {
  return (
    <div className='flex w-screen justify-center bg-gradient-to-r from-[#f9e6b3] to-[#f3d27a]'>
      <Image src={'/logo.png'} width={120} height={120} alt='faos-logo.png' />
    </div>
  )
}

export { Header }

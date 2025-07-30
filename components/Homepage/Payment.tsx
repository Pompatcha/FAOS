import { FC } from 'react'

const Payment: FC = () => {
  return (
    <div className='flex w-full flex-col items-center gap-2.5'>
      <span className='text-xl font-bold text-white'>Accepted Payments</span>

      <div className='flex gap-2.5'>
        <img
          src='https://img.icons8.com/color/48/000000/visa.png'
          className='size-10'
        />
        <img
          src='https://img.icons8.com/color/48/000000/mastercard.png'
          className='size-10'
        />
      </div>
    </div>
  )
}

export { Payment }

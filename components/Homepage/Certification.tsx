import { FC } from 'react'

const Certification: FC = () => {
  return (
    <div className='flex w-full flex-col items-center gap-2.5 rounded-lg bg-white p-5 text-center shadow'>
      <span className='text-2xl font-bold'>
        Certification compliance with organic, safety, and hygiene standards
      </span>

      <div className='flex gap-5'>
        <img
          className='size-28 object-contain duration-300 hover:scale-102'
          src='https://seajoy.com/images/company-news/AB_eurofeuille.png'
        />
        <img
          className='size-28 object-contain duration-300 hover:scale-102'
          src='https://1.bp.blogspot.com/-lofZ1ZddkjA/VrRvD8Y24KI/AAAAAAAACpM/QsG8-zh5pY8/s1600/iso_icon.png'
        />
        <img
          className='size-28 object-contain duration-300 hover:scale-102'
          src='https://vectorseek.com/wp-content/uploads/2023/09/Bio-nach-EG-Oko-Verordnung-Logo-Vector.svg-.png'
        />
      </div>
    </div>
  )
}

export { Certification }

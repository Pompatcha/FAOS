import type { FC } from 'react'

const NatureGoldBanner: FC = () => {
  return (
    <div className='flex flex-col rounded-xl border-4 border-[#f3d27a] bg-gradient-to-r from-[#f9e6b3] to-[#f3d27a] p-5 text-center'>
      <span className='text-xl text-[#4a2c00] italic'>
        Olive oil and honey 🐝 are the gold of nature—pure, natural, and filled
        with life-enhancing properties.
      </span>

      <span className='text-2xl font-bold text-red-800'>
        Pure Organic Product ECO-System 100% (Healthy Living) (Medical Food care
        yours)
      </span>

      <span className='text-xl text-[#4a2c00] italic'>
        (Medical Food care yours)
      </span>
    </div>
  )
}

export { NatureGoldBanner }

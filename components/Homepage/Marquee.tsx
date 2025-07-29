'use client'

import { FC } from 'react'

const Marquee: FC = () => {
  return (
    <div className='relative w-full overflow-hidden rounded-lg bg-white py-2'>
      <div className='animate-marquee whitespace-nowrap'>
        <span className='px-4 text-sm font-medium'>
          Dear customer, we are acceptable an order via Line official and
          What&apos;s app (add) me +6689 693 1668; Payment Online development is
          on process. acceptable by credit card. Click Here
        </span>
      </div>

      <style jsx>{`
        @keyframes marquee {
          0% {
            transform: translateX(100%);
          }
          100% {
            transform: translateX(-100%);
          }
        }

        .animate-marquee {
          animation: marquee 60s linear infinite;
        }

        .animate-marquee:hover {
          animation-play-state: paused;
        }
      `}</style>
    </div>
  )
}

export { Marquee }

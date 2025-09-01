import type { FC } from 'react'

import { cn } from '@/lib/utils'

type FooterProps = {
  className?: string
}

const Footer: FC<FooterProps> = ({ className }) => {
  return (
    <div className={cn('pb-2.5 text-center text-white', className)}>
      <span>
        © 2024 Premium Organic Collection | Crafted with Passion &
        Sustainability
      </span>
    </div>
  )
}

export { Footer }

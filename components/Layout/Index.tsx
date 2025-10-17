import { Info } from 'lucide-react'

import type { FC, PropsWithChildren } from 'react'

import { Footer } from './Footer'
import { Menu } from './Menu'
import { Alert, AlertDescription } from '../ui/alert'

const IndexLayout: FC<PropsWithChildren> = ({ children }) => {
  return (
    <div className='bg-primary flex min-h-screen flex-col gap-5'>
      <Menu />

      <div className='flex flex-col gap-5 px-2.5 sm:px-10 sm:py-2.5'>
        <Alert variant='destructive' className='gap-0'>
          <Info />
          <AlertDescription className='text-lg'>
            Notification: The Product is havesting. Stock plan to ready on
            November 2025.
          </AlertDescription>
        </Alert>

        {children}
      </div>
      <Footer />
    </div>
  )
}

export { IndexLayout }

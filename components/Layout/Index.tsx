import { Info } from 'lucide-react'

import type { FC, PropsWithChildren } from 'react'

import { Footer } from './Footer'
import { Menu } from './Menu'
import { SearchBar } from '../SearchBar'
import { Alert, AlertDescription } from '../ui/alert'

const IndexLayout: FC<PropsWithChildren> = ({ children }) => {
  return (
    <div className='bg-primary flex min-h-screen flex-col gap-5'>
      <Menu />

      <div className='flex flex-col gap-5 px-2.5 sm:px-10 sm:py-2.5'>
        <SearchBar />
        <Alert variant='destructive' className='gap-0'>
          <Info />
          <AlertDescription className='text-lg'>
            The website is currently under development and new features may be
            added continuously. Please stay tuned to Facebook and other social
            media for updates.
          </AlertDescription>
          <AlertDescription className='text-lg'>
            Dear customer, we are acceptable an order via Line offcial and
            What&apos;s app (add) me +6689 693 1668 ;Payment Online development
            is on proces. acceptable by credit card.
          </AlertDescription>
        </Alert>

        {children}
      </div>
      <Footer />
    </div>
  )
}

export { IndexLayout }

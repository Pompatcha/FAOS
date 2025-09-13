import { Info } from 'lucide-react'

import type { FC, PropsWithChildren } from 'react'

import { Footer } from './Footer'
import { Menu } from './Menu'
import { Alert, AlertDescription, AlertTitle } from '../ui/alert'

const IndexLayout: FC<PropsWithChildren> = ({ children }) => {
  return (
    <div className='bg-primary flex min-h-screen flex-col gap-5'>
      <Menu />

      <div className='flex flex-col gap-5 px-2.5 sm:px-10 sm:py-2.5'>
        <Alert variant='destructive'>
          <Info />
          <AlertTitle>Notification</AlertTitle>
          <AlertDescription>
            The website is currently under development and new features may be
            added continuously. Please stay tuned to Facebook and other social
            media for updates.
          </AlertDescription>
        </Alert>

        {children}
      </div>
      <Footer />
    </div>
  )
}

export { IndexLayout }

'use client'

import { Info } from 'lucide-react'
import Image from 'next/image'
import { useEffect, useState, type FC, type PropsWithChildren } from 'react'

import { Dialog, DialogContent } from '@/components/ui/dialog'

import { Footer } from './Footer'
import { Menu } from './Menu'
import { Alert, AlertDescription } from '../ui/alert'

const IndexLayout: FC<PropsWithChildren> = ({ children }) => {
  const [showMourningDialog, setShowMourningDialog] = useState(false)

  useEffect(() => {
    const hasSeenMourning = sessionStorage.getItem('hasSeenMourningDialog')
    if (!hasSeenMourning) {
      setShowMourningDialog(true)
      sessionStorage.setItem('hasSeenMourningDialog', 'true')
    }
  }, [])

  return (
    <div className='bg-primary flex min-h-screen flex-col gap-5'>
      <Dialog open={showMourningDialog} onOpenChange={setShowMourningDialog}>
        <DialogContent className='max-w-[90vw] sm:max-w-[600px] [&>button]:hidden'>
          <Image
            src='/mourning-the-queen.jpg'
            className='size-full border-4 border-gray-500'
            width={500}
            height={500}
            alt='mourning-the-queen'
          />
        </DialogContent>
      </Dialog>

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

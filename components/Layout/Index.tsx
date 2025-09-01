import { FC, PropsWithChildren } from 'react'
import { Footer } from './Footer'
import { Menu } from './Menu'

const IndexLayout: FC<PropsWithChildren> = ({ children }) => {
  return (
    <div className='bg-primary flex min-h-screen flex-col gap-5'>
      <Menu />
      <div className='flex flex-col gap-5 px-10 py-2.5'>{children}</div>
      <Footer />
    </div>
  )
}

export { IndexLayout }

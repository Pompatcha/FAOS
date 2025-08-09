'use client'

import { Certification } from '@/components/Homepage/Certification'
import { Footer } from '@/components/Layout/Footer'
import { Header } from '@/components/Layout/Header'
import { HeaderImageSlider } from '@/components/Homepage/HeaderImageSlider'
import { Menu } from '@/components/Layout/Menu'
import { FollowUs } from '@/components/Homepage/FollowUs'
import { Research } from '@/components/Homepage/Research'
import { AuthPanel } from '@/components/Protected/LoginPanel'
import { Benefit } from '@/components/Homepage/Benefit'
import { Shipping } from '@/components/Homepage/Shipping'
import { Payment } from '@/components/Homepage/Payment'
import { FacebookProvider, Page } from 'react-facebook'

export default function Home() {
  return (
    <div className='flex flex-col items-center bg-[#dda700]'>
      <Header />
      <Menu />

      <div className='flex w-full gap-5 p-5'>
        <div className='flex flex-1 flex-col gap-5'>
          <div className='flex flex-col rounded-lg border-4 border-[#f3d27a] bg-gradient-to-r from-[#f9e6b3] to-[#f3d27a] p-5 text-center'>
            <span className='text-xl text-[#4a2c00] italic'>
              Olive oil and honey 🐝 are the gold of nature—pure, natural, and
              filled with life-enhancing properties.
            </span>

            <span className='text-2xl font-bold text-red-800'>
              Pure Organic Product ECO-System 100% (Healthy Living) (Medical
              Food care yours)
            </span>

            <span className='text-xl text-[#4a2c00] italic'>
              (Medical Food care yours)
            </span>
          </div>

          <div className='flex justify-center'>
            <HeaderImageSlider />
          </div>

          <div className='flex w-full flex-col rounded-lg bg-[#bfa046] p-2.5 text-center shadow'>
            <span className='text-2xl font-bold text-[#00332f]'>
              🌿 FAOS Premium Organic Collection – Premium Olive Oil and Real
              Honey 🌿
            </span>
          </div>

          <div className='flex w-full items-center gap-5 rounded-lg bg-white p-5'>
            <div className='size-20 flex-shrink-0 overflow-hidden rounded-full'>
              <img
                src='https://i.ibb.co/351rJLyB/IMG-8438.jpg'
                className='h-full w-full object-cover'
              />
            </div>
            <span className='w-full text-xl'>
              Created for Health, Elegance and Well-Being. Elevate patient care
              and hospitality with the FAOS Collection, a luxurious blend of
              Thai-Greek heritage, organic purity and health innovation.
              Designed for discerning healthcare environments that prioritize
              natural healing and quality without compromise.
            </span>
          </div>

          <div className='flex w-full flex-col rounded-lg bg-[#bfa046] p-2.5 text-center shadow'>
            <span className='text-2xl font-bold text-[#00332f]'>
              🌿 🏥 Why FAOS is Needed for Private Hospitals 🏥
            </span>
          </div>

          <div className='flex w-full flex-col rounded-lg bg-white p-5'>
            <span className='text-xl'>
              <span className='font-bold'>✅ Hospital-grade Safety:</span>{' '}
              Complies with hygiene and food handling standards.
            </span>
            <span className='text-xl'>
              <span className='font-bold'>✅ Luxury Branding:</span> Enhances
              the hospital&apos;s premium image and patient experience.
            </span>
            <span className='text-xl'>
              <span className='font-bold'>✅ Sustainably Sourced:</span>{' '}
              Environmentally conscious practices that reflect healthcare&apos;s
              commitment to the planet.
            </span>
          </div>

          <Benefit />

          <Certification />

          <div className='grid w-full grid-cols-2 gap-5'>
            <FollowUs />
            <Research />
            <Shipping />
            <Payment />
          </div>

          <Footer />
        </div>

        <div className='sticky top-5 h-fit w-80 flex-shrink-0'>
          <AuthPanel />

          <div className='mt-5'>
            <FacebookProvider appId='your-app-id'>
              <Page
                href='https://www.facebook.com/FAOShertitagefood'
                tabs='timeline'
              />
            </FacebookProvider>
          </div>
        </div>
      </div>
    </div>
  )
}

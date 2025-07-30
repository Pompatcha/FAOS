import { Certification } from '@/components/Homepage/Certification'
import { Footer } from '@/components/Footer'
import { Header } from '@/components/Header'
import { HeaderImageSlider } from '@/components/Homepage/HeaderImageSlider'
import { Menu } from '@/components/Menu'
import { FollowUs } from '@/components/Homepage/FollowUs'
import { Research } from '@/components/Homepage/Research'
import { AuthPanel } from '@/components/LoginPanel'
import { Benefit } from '@/components/Homepage/Benefit'
import { Shipping } from '@/components/Homepage/Shipping'

export default function Home() {
  return (
    <div className='flex flex-col items-center gap-5 bg-[#dda700]'>
      <div className='flex flex-col'>
        <Header />
        <Menu />
      </div>

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

          <div className='flex w-full flex-col rounded-lg bg-[#bfa046] p-5 text-center shadow'>
            <span className='text-2xl font-bold text-[#00332f]'>
              🌿 FAOS Premium Organic Collection – Premium Olive Oil and Real
              Honey 🌿
            </span>
          </div>

          <div className='flex w-full flex-col rounded-lg bg-white p-5'>
            <span>
              Created for Health, Elegance and Well-Being. Elevate patient care
              and hospitality with the FAOS Collection, a luxurious blend of
              Thai-Greek heritage, organic purity and health innovation.
              Designed for discerning healthcare environments that prioritize
              natural healing and quality without compromise.
            </span>
          </div>

          <div className='flex w-full flex-col rounded-lg bg-[#bfa046] p-5 text-center shadow'>
            <span className='text-2xl font-bold text-[#00332f]'>
              🌿 🏥 Why FAOS is Needed for Private Hospitals 🏥
            </span>
          </div>

          <div className='flex w-full flex-col rounded-lg bg-white p-5'>
            <span>
              ✅ Hospital-grade Safety: Complies with hygiene and food handling
              standards.
            </span>
            <span>
              ✅ Luxury Branding: Enhances the hospital&apos;s premium image and
              patient experience.
            </span>
            <span>
              ✅ Sustainably Sourced: Environmentally conscious practices that
              reflect healthcare&apos;s commitment to the planet.
            </span>
          </div>

          <Benefit />

          <Certification />

          <div className='grid w-full grid-cols-3'>
            <FollowUs />
            <Research />
            <Shipping />
          </div>

          <Footer />
        </div>

        <div className='sticky top-5 h-fit w-80 flex-shrink-0'>
          <AuthPanel />
        </div>
      </div>
    </div>
  )
}

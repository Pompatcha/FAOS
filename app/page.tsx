'use client'

import { NatureGoldBanner } from '@/components/NatureGoldBanner'
import { IndexLayout } from '@/components/Layout/Index'
import { HeaderImageSlider } from '@/components/ImageSlider'
import { ArrowUpRight, CircleCheck } from 'lucide-react'
import { Benefit } from '@/components/Benefit'
import { SocialIcon } from 'react-social-icons'

export default function Home() {
  return (
    <IndexLayout>
      <NatureGoldBanner />
      <HeaderImageSlider />

      <div className='flex flex-col'>
        <div className='bg-secondary flex w-full flex-col rounded-t-lg p-2.5 text-center shadow'>
          <span className='text-2xl font-bold text-red-800'>
            FAOS Premium Organic Collection – Premium Olive Oil and Real Honey
          </span>
        </div>

        <div className='flex w-full flex-col items-center gap-5 rounded-b-lg bg-white p-5 sm:flex-row'>
          <div className='size-28 flex-shrink-0 overflow-hidden'>
            <img
              src='https://i.ibb.co/351rJLyB/IMG-8438.jpg'
              className='h-full w-full rounded-full object-cover'
            />
          </div>
          <span className='w-full text-xl'>
            Created for Health, Elegance and Well-Being. Elevate patient care
            and hospitality with the FAOS Collection, a luxurious blend of
            Thai-Greek heritage, organic purity and health innovation. Designed
            for discerning healthcare environments that prioritize natural
            healing and quality without compromise. (Patcharin Chanaphukdee)
          </span>
        </div>
      </div>

      <div className='flex flex-col'>
        <div className='bg-secondary flex w-full flex-col rounded-t-lg p-2.5 text-center shadow'>
          <span className='text-2xl font-bold text-red-800'>
            Why FAOS is Needed for Private Hospitals
          </span>
        </div>

        <div className='flex w-full flex-col gap-2.5 rounded-b-lg bg-white p-5'>
          <div className='flex gap-2.5'>
            <CircleCheck size={30} className='text-green-800' />
            <span className='w-full text-xl'>
              <b>Hospital-grade Safety:</b> Complies with hygiene and food
              handling standards.
            </span>
          </div>

          <div className='flex gap-2.5'>
            <CircleCheck size={30} className='text-green-800' />
            <span className='w-full text-xl'>
              <b> Luxury Branding:</b> Enhances the hospital&apos;s premium
              image and patient experience.
            </span>
          </div>

          <div className='flex gap-2.5'>
            <CircleCheck size={30} className='text-green-800' />
            <span className='w-full text-xl'>
              <b> Sustainably Sourced:</b> Environmentally conscious practices
              that reflect healthcare&apos;s commitment to the planet.
            </span>
          </div>
        </div>
      </div>

      <Benefit />

      <div className='flex flex-col'>
        <div className='bg-secondary flex w-full flex-col rounded-t-lg p-2.5 text-center shadow'>
          <span className='text-2xl font-bold text-red-800'>
            Certification compliance with organic, safety, and <br /> hygiene
            standards
          </span>
        </div>

        <div className='flex w-full flex-col gap-5 rounded-b-lg bg-white p-5'>
          <div className='flex justify-center gap-5'>
            <img
              className='size-18 object-contain duration-300 hover:scale-102 sm:size-28'
              src='https://seajoy.com/images/company-news/AB_eurofeuille.png'
            />
            <img
              className='size-18 object-contain duration-300 hover:scale-102 sm:size-28'
              src='https://1.bp.blogspot.com/-lofZ1ZddkjA/VrRvD8Y24KI/AAAAAAAACpM/QsG8-zh5pY8/s1600/iso_icon.png'
            />
            <img
              className='size-18 object-contain duration-300 hover:scale-102 sm:size-28'
              src='https://vectorseek.com/wp-content/uploads/2023/09/Bio-nach-EG-Oko-Verordnung-Logo-Vector.svg-.png'
            />
          </div>
        </div>
      </div>

      <div className='flex flex-col justify-between gap-5 lg:flex-row'>
        <div className='flex w-full flex-col'>
          <div className='bg-secondary flex w-full flex-col rounded-t-lg p-2.5 text-center shadow'>
            <span className='text-2xl font-bold text-red-800'>Follow Us</span>
          </div>

          <div className='grid w-full grid-cols-1 gap-5 rounded-b-lg bg-white p-5 sm:grid-cols-2'>
            <div className='flex cursor-pointer items-center gap-2.5'>
              <SocialIcon
                network='facebook'
                style={{ width: 38, height: 38 }}
              />

              <span>Facebook (FAOS.Honey and Olive oil)</span>
            </div>

            <div className='flex cursor-pointer items-center gap-2.5'>
              <SocialIcon
                network='instagram'
                style={{ width: 38, height: 38 }}
              />

              <span>Instagram</span>
            </div>

            <div className='flex cursor-pointer items-center gap-2.5'>
              <SocialIcon
                network='whatsapp'
                style={{ width: 38, height: 38 }}
              />

              <span>WhatsApp</span>
            </div>

            <div className='flex cursor-pointer items-center gap-2.5'>
              <SocialIcon network='tiktok' style={{ width: 38, height: 38 }} />

              <span>TikTok</span>
            </div>

            <div className='flex cursor-pointer items-center gap-2.5'>
              <SocialIcon network='line.me' style={{ width: 38, height: 38 }} />

              <span>LINE Official</span>
            </div>
          </div>
        </div>

        <div className='flex w-full flex-col'>
          <div className='bg-secondary flex w-full flex-col rounded-t-lg p-2.5 text-center shadow'>
            <span className='text-2xl font-bold text-red-800'>
              Research & References
            </span>
          </div>

          <div className='flex w-full flex-col gap-5 rounded-b-lg bg-white p-5'>
            <div className='flex cursor-pointer gap-2.5'>
              <div className='flex size-8 items-center justify-center rounded-full border border-black'>
                <ArrowUpRight />
              </div>
              <span className='w-full text-xl'>
                Olive oil is beneficial for maternal-fetal health
              </span>
            </div>

            <div className='flex cursor-pointer gap-2.5'>
              <div className='flex size-8 items-center justify-center rounded-full border border-black'>
                <ArrowUpRight />
              </div>
              <span className='w-full text-xl'>
                Healthline: Benefits of Honey
              </span>
            </div>

            <div className='flex cursor-pointer gap-2.5'>
              <div className='flex size-8 items-center justify-center rounded-full border border-black'>
                <ArrowUpRight />
              </div>
              <span className='w-full text-xl'>
                Olive Oil~ A Key Component of the Mediterranean Diet
              </span>
            </div>

            <div className='flex cursor-pointer gap-2.5'>
              <div className='flex size-8 items-center justify-center rounded-full border border-black'>
                <ArrowUpRight />
              </div>
              <span className='w-full text-xl'>
                Using Greek Honey for Beautiful Skin, Hair, and Anti-Aging
              </span>
            </div>

            <div className='flex cursor-pointer gap-2.5'>
              <div className='flex size-8 items-center justify-center rounded-full border border-black'>
                <ArrowUpRight />
              </div>
              <span className='w-full text-xl'>
                Everything to Know About the Health Benefits of Honey
              </span>
            </div>
          </div>
        </div>
      </div>
    </IndexLayout>
  )
}

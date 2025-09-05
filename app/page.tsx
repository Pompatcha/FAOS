'use client'

import { ArrowUpRight, Check } from 'lucide-react'
import { SocialIcon } from 'react-social-icons'

import { Benefit } from '@/components/Benefit'
import { HeaderImageSlider } from '@/components/ImageSlider'
import { IndexLayout } from '@/components/Layout/Index'
import { NatureGoldBanner } from '@/components/NatureGoldBanner'

interface HospitalBenefit {
  id: number
  title: string
  description: string
}

interface CertificationImage {
  id: number
  src: string
  alt: string
}

interface SocialMediaPlatform {
  id: number
  network: string
  displayName: string
  href?: string
}

interface ResearchReference {
  id: number
  title: string
  href?: string
}

const HOSPITAL_BENEFITS: HospitalBenefit[] = [
  {
    id: 1,
    title: 'Hospital-grade Safety',
    description: 'Complies with hygiene and food handling standards.',
  },
  {
    id: 2,
    title: 'Luxury Branding',
    description:
      "Enhances the hospital's premium image and patient experience.",
  },
  {
    id: 3,
    title: 'Sustainably Sourced',
    description:
      "Environmentally conscious practices that reflect healthcare's commitment to the planet.",
  },
]

const CERTIFICATION_IMAGES: CertificationImage[] = [
  {
    id: 1,
    src: 'https://seajoy.com/images/company-news/AB_eurofeuille.png',
    alt: 'EU Organic Certification',
  },
  {
    id: 2,
    src: 'https://1.bp.blogspot.com/-lofZ1ZddkjA/VrRvD8Y24KI/AAAAAAAACpM/QsG8-zh5pY8/s1600/iso_icon.png',
    alt: 'ISO Certification',
  },
  {
    id: 3,
    src: 'https://vectorseek.com/wp-content/uploads/2023/09/Bio-nach-EG-Oko-Verordnung-Logo-Vector.svg-.png',
    alt: 'Bio Certification',
  },
]

const SOCIAL_MEDIA_PLATFORMS: SocialMediaPlatform[] = [
  {
    id: 1,
    network: 'facebook',
    displayName: 'Facebook (FAOS.Honey and Olive oil)',
    href: '#',
  },
  {
    id: 2,
    network: 'instagram',
    displayName: 'Instagram',
    href: '#',
  },
  {
    id: 3,
    network: 'whatsapp',
    displayName: 'WhatsApp',
    href: '#',
  },
  {
    id: 4,
    network: 'tiktok',
    displayName: 'TikTok',
    href: '#',
  },
  {
    id: 5,
    network: 'line.me',
    displayName: 'LINE Official',
    href: '#',
  },
]

const RESEARCH_REFERENCES: ResearchReference[] = [
  {
    id: 1,
    title: 'Olive oil is beneficial for maternal-fetal health',
    href: '#',
  },
  {
    id: 2,
    title: 'Healthline: Benefits of Honey',
    href: '#',
  },
  {
    id: 3,
    title: 'Olive Oil~ A Key Component of the Mediterranean Diet',
    href: '#',
  },
  {
    id: 4,
    title: 'Using Greek Honey for Beautiful Skin, Hair, and Anti-Aging',
    href: '#',
  },
  {
    id: 5,
    title: 'Everything to Know About the Health Benefits of Honey',
    href: '#',
  },
]

const FOUNDER_INFO = {
  name: 'Patcharin Chanaphukdee',
  imageUrl: 'https://i.ibb.co/351rJLyB/IMG-8438.jpg',
  imageAlt: 'Portrait of Patcharin Chanaphukdee, FAOS founder',
  description:
    'Created for Health, Elegance and Well-Being. Elevate patient care and hospitality with the FAOS Collection, a luxurious blend of Thai-Greek heritage, organic purity and health innovation. Designed for discerning healthcare environments that prioritize natural healing and quality without compromise.',
}

const COMPANY_DESCRIPTION =
  'FAOS Premium Organic Collection – Premium Olive Oil and Real Honey'

const SectionHeader = ({ title }: { title: string }) => (
  <div className='bg-secondary flex w-full flex-col rounded-t-lg p-2.5 text-center shadow'>
    <h2 className='text-2xl font-bold text-red-800'>{title}</h2>
  </div>
)

const HospitalBenefitItem = ({ benefit }: { benefit: HospitalBenefit }) => (
  <div className='flex gap-2.5'>
    <div className='flex size-8 flex-shrink-0 items-center justify-center rounded-full border'>
      <Check className='text-primary' />
    </div>
    <span className='w-full text-xl'>
      <span className='text-primary font-bold'>{benefit.title}</span>{' '}
      {benefit.description}
    </span>
  </div>
)

const CertificationImageItem = ({
  certification,
}: {
  certification: CertificationImage
}) => (
  <img
    className='size-18 object-contain duration-300 hover:scale-102 sm:size-28'
    src={certification.src}
    alt={certification.alt}
    loading='lazy'
  />
)

const SocialMediaPlatformItem = ({
  platform,
}: {
  platform: SocialMediaPlatform
}) => {
  const handleSocialMediaClick = () => {
    if (platform.href) {
      window.open(platform.href, '_blank', 'noopener,noreferrer')
    }
  }

  return (
    <div
      className='flex cursor-pointer items-center gap-2.5 transition-opacity hover:opacity-80'
      onClick={handleSocialMediaClick}
      role='button'
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          handleSocialMediaClick()
        }
      }}
    >
      <SocialIcon
        network={platform.network}
        style={{ width: 38, height: 38 }}
      />
      <span>{platform.displayName}</span>
    </div>
  )
}

const ResearchReferenceItem = ({
  reference,
}: {
  reference: ResearchReference
}) => {
  const handleReferenceClick = () => {
    if (reference.href) {
      window.open(reference.href, '_blank', 'noopener,noreferrer')
    }
  }

  return (
    <div
      className='flex cursor-pointer gap-2.5 transition-opacity hover:opacity-80'
      onClick={handleReferenceClick}
      role='button'
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          handleReferenceClick()
        }
      }}
    >
      <div className='flex size-8 flex-shrink-0 items-center justify-center rounded-full border'>
        <ArrowUpRight className='text-primary' />
      </div>
      <span className='w-full text-xl'>{reference.title}</span>
    </div>
  )
}

const Homepage = () => {
  return (
    <IndexLayout>
      <NatureGoldBanner />
      <HeaderImageSlider />

      <section className='flex flex-col'>
        <SectionHeader title={COMPANY_DESCRIPTION} />

        <div className='flex w-full flex-col items-center gap-5 rounded-b-lg bg-white p-5 sm:flex-row'>
          <div className='flex shrink-0 flex-col gap-2.5 text-center'>
            <img
              src={FOUNDER_INFO.imageUrl}
              alt={FOUNDER_INFO.imageAlt}
              className='size-52 rounded-xl object-cover'
            />
            <span>({FOUNDER_INFO.name})</span>
          </div>
          <div className='w-full text-xl'>{FOUNDER_INFO.description}</div>
        </div>
      </section>

      <section className='flex flex-col'>
        <SectionHeader title='Why FAOS is Needed for Private Hospitals' />

        <div className='flex w-full flex-col gap-2.5 rounded-b-lg bg-white p-5'>
          {HOSPITAL_BENEFITS.map((hospitalBenefit) => (
            <HospitalBenefitItem
              key={hospitalBenefit.id}
              benefit={hospitalBenefit}
            />
          ))}
        </div>
      </section>

      <Benefit />

      <section className='flex flex-col'>
        <SectionHeader title='Certification compliance with organic, safety, and hygiene standards' />

        <div className='flex w-full flex-col gap-5 rounded-b-lg bg-white p-5'>
          <div className='flex justify-center gap-5'>
            {CERTIFICATION_IMAGES.map((certificationImage) => (
              <CertificationImageItem
                key={certificationImage.id}
                certification={certificationImage}
              />
            ))}
          </div>
        </div>
      </section>

      <div className='flex flex-col justify-between gap-5 lg:flex-row'>
        <section className='flex w-full flex-col'>
          <SectionHeader title='Follow Us' />

          <div className='grid w-full grid-cols-1 gap-5 rounded-b-lg bg-white p-5 sm:grid-cols-2'>
            {SOCIAL_MEDIA_PLATFORMS.map((socialMediaPlatform) => (
              <SocialMediaPlatformItem
                key={socialMediaPlatform.id}
                platform={socialMediaPlatform}
              />
            ))}
          </div>
        </section>

        <section className='flex w-full flex-col'>
          <SectionHeader title='Research & References' />

          <div className='flex w-full flex-col gap-5 rounded-b-lg bg-white p-5'>
            {RESEARCH_REFERENCES.map((researchReference) => (
              <ResearchReferenceItem
                key={researchReference.id}
                reference={researchReference}
              />
            ))}
          </div>
        </section>
      </div>
    </IndexLayout>
  )
}

export default Homepage

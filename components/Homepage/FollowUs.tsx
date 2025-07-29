import { FC } from 'react'
import { SocialIcon } from 'react-social-icons'

const FollowUs: FC = () => {
  return (
    <div className='flex w-full flex-col items-center gap-2.5 text-white'>
      <span className='font-bold'>Follow Us</span>

      <div className='flex w-full items-center justify-center gap-2.5 rounded-lg bg-[#ffffff26] p-2.5 text-white'>
        <SocialIcon
          url='https://www.facebook.com/'
          style={{ width: 40, height: 40 }}
        />
        <span>Facebook</span>
      </div>

      <div className='flex w-full items-center justify-center gap-2.5 rounded-lg bg-[#ffffff26] p-2.5 text-white'>
        <SocialIcon
          url='https://www.instagram.com/'
          style={{ width: 40, height: 40 }}
        />
        <span>Instagram</span>
      </div>

      <div className='flex w-full items-center justify-center gap-2.5 rounded-lg bg-[#ffffff26] p-2.5 text-white'>
        <SocialIcon
          url='https://www.whatsapp.com/'
          style={{ width: 40, height: 40 }}
        />
        <span>WhatsApp</span>
      </div>

      <div className='flex w-full items-center justify-center gap-2.5 rounded-lg bg-[#ffffff26] p-2.5 text-white'>
        <SocialIcon
          url='https://www.tiktok.com/'
          style={{ width: 40, height: 40 }}
        />
        <span>TikTok</span>
      </div>

      <div className='flex w-full items-center justify-center gap-2.5 rounded-lg bg-[#ffffff26] p-2.5 text-white'>
        <SocialIcon
          url='https://www.line.me/'
          style={{ width: 40, height: 40 }}
        />
        <span>LINE Official</span>
      </div>
    </div>
  )
}

export { FollowUs }

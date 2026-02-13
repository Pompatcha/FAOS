import './globals.css'
import { IBM_Plex_Sans_Thai } from 'next/font/google'

import type { Metadata } from 'next'
import type { FC, PropsWithChildren } from 'react'

const IBMPlexSansThai = IBM_Plex_Sans_Thai({
  weight: ['400', '700'],
})

import { Toaster } from '@/components/ui/sonner'
import { AuthProvider } from '@/contexts/AuthContext.tsx'

import Providers from '../contexts/QueryProviders'

const metadata: Metadata = {
  title:
    'FAOS Premium Greek Olive Oil Extra Virgin Olive Oil and Rare Honey in Thailand - Only Greek Olive Oil and honey from Organic Farms',
  description:
    "Explore our premium honey collection, made from nature's finest sources. Premium organic olive oil and honey collection offering the finest quality products.",
  keywords: [
    'organic olive oil',
    'premium honey',
    'raw honey',
    'thyme honey',
    'organic Greek products',
    'Mediterranean organic food',
    'organic superfoods',
    'น้ำมันมะกอกบริสุทธิ์',
    'อาหารเพื่อสุขภาพ',
    'faos',
    'ไวน์พรีเมี่ยม',
    'ขายไวน์',
    'exclusive product',
    'wine testing',
    'ไวน์ออแกนนิกส์',
    'wine cellar',
    'wine bar',
    'แอลกอฮอล์',
    'ขายไวน์ออนไลน์',
    'wine & beverage',
    'ร้านขายไวน์',
    'ร้านอาหาร',
    'โรงแรม',
    'สายไวน์',
    'อาหาร',
    'ไวน์กูรู',
    'wineguru',
    'wine event',
    'wine pairing',
    'wine pairing menu',
    'จับคู่อาหารกับไวน์',
    'ไวน์ราคาขายส่ง',
    'ไวน์ขายส่ง',
    'ไวน์ราคาพิเศษ',
    'wine list',
    'ไวน์สำหรับงานแต่งงาน',
    'ไวน์สำหรับอีเวนต์',
    'พิเศษในโรงแรม',
    'wine connection',
    'the wine merchant',
    'scarlettwine',
    'wine bar',
    'the bar upstairs',
    'wine beverage',
    'mandarin oriental',
    'Extra Virgin Olive Oil',
    'house wine',
    'น้ำมันมะกอกปลอดสาร',
    'ไวน์ปลอดสารเคมี',
    'ไวน์แดง',
    'ไวน์ขาว',
    'ไวน์โรส',
    'ไวน์สปาร์คกิ้ง',
    'Wellness',
    'ฟาร์มผึ้ง',
    'น้ำผึ้งแท้100%',
    'น้ำผึ้งฟาว์ส',
    'เบเกอรี่',
    'น้ำผึ้งกรีก',
    'Greek Honey',
    'Greek Olive Oil',
    'Philosophy',
    'Philosophy of FAOS',
    'Vinegar',
    'Best Olive Oil',
    'Olive oil soap',
    'Olive oil skincare',
    'Athonelia',
    'Koroneiki',
    'Maneki',
    'Oliveoil variety',
    'Olympic olive oil',
    'Greek olive oil',
    'Cold Pressed Olive Oil',
    'Pholyphenol-rich Olive Oil',
    'Pholyphenol',
    '焕颜初榨橄榄皂',
    'antioxidant',
    'handcrafted soap',
    '橄榄油 护肤品',
    '特级初榨橄榄油',
    '橄榄油瓶装设计',
  ].join(', '),
  authors: [{ name: 'Patcharin Chanaphukdee' }],
  openGraph: {
    title: 'FAOS Premium Greek Olive Oil Extra Virgin Olive Oil and Rare Honey in Thailand - Only Greek Olive Oil and honey from Organic Farms',
    description:
      "Explore our premium honey collection, made from nature's finest sources.",
    images: [
      {
        url: 'https://oeisobmqacdbiotylrwm.supabase.co/storage/v1/object/public/images/homepage/italian%20food%20wine%20and%20olive%20oil%20food.%20Greek%20salad,%20hummus%20with%20pita,%20tzatziki,%20tabbouleh.Seafood%20&%20Grilled%20Fish.jpg',
        width: 1200,
        height: 630,
        alt: 'FAOS Premium Organic Collection',
      },
    ],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'FAOS Premium Organic Collection | Premium Olive Oil and Honey',
    description:
      "Explore our premium honey collection, made from nature's finest sources.",
    images: [
      'https://oeisobmqacdbiotylrwm.supabase.co/storage/v1/object/public/images/homepage/Food%20for%20king%20in%20thailand%20see%20sald%20olive%20oil%20wine%20food%20.%20display%20FAOS%20band%20on%20the%20wine%20bottom%20and%20olive%20oil%20bottom.jpg',
    ],
  },
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: '/',
  },
}

const RootLayout: FC<PropsWithChildren> = ({ children }) => {
  return (
    <html lang='en'>
      <body className={`${IBMPlexSansThai.className} antialiased`}>
        <Toaster />
        <Providers>
          <AuthProvider>{children}</AuthProvider>
        </Providers>
      </body>
    </html>
  )
}

export default RootLayout
export { metadata }

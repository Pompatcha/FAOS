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
    'FAOS Premium Organic Collection | Premium Olive Oil and Honey | Organics Olive Oil | Organic Honey',
  description:
    "Explore our premium honey collection, made from nature's finest sources. Premium organic olive oil and honey collection offering the finest quality products.",
  keywords: [
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
    'capella',
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
  ].join(', '),
  authors: [{ name: 'Patcharin Chanaphukdee' }],
  openGraph: {
    title: 'FAOS Premium Organic Collection | Premium Olive Oil and Honey',
    description:
      "Explore our premium honey collection, made from nature's finest sources.",
    images: [
      {
        url: 'https://oeisobmqacdbiotylrwm.supabase.co/storage/v1/object/public/images/homepage/9ce334db-6219-40d7-b091-ea18b655ff13.jpg',
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
      'https://oeisobmqacdbiotylrwm.supabase.co/storage/v1/object/public/images/homepage/9ce334db-6219-40d7-b091-ea18b655ff13.jpg',
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

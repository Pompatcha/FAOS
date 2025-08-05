import type { Metadata } from 'next'
import './globals.css'
import Providers from './providers'

export const metadata: Metadata = {
  title:
    'FAOS Premium Organic Collection | Premium Olive Oil and Honey | Organics Olive Oil | Organic Honey',
  description:
    "Explore our premium honey collection, made from nature's finest sources. Premium organic olive oil and honey collection offering the finest quality products.",
  keywords: [
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
  ].join(', '),
  authors: [{ name: 'Patcharin Chanaphukdee' }],
  openGraph: {
    title: 'FAOS Premium Organic Collection | Premium Olive Oil and Honey',
    description:
      "Explore our premium honey collection, made from nature's finest sources.",
    images: [
      {
        url: 'https://i.ibb.co/h14wZP5X/Screenshot-2568-04-03-at-23-00-10.png',
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
    images: ['https://i.ibb.co/h14wZP5X/Screenshot-2568-04-03-at-23-00-10.png'],
  },
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: '/',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html>
      <body className={`antialiased`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}

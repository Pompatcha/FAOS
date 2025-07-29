import type { Metadata } from "next";
// import { Sarabun } from "next/font/google";
import "./globals.css";

// const sarabun = Sarabun({
//   variable: "--font-sarabun",
//   subsets: ["latin", "thai"],
//   weight: ["100", "200", "300", "400", "500", "600", "700", "800"],
// });

export const metadata: Metadata = {
  title: "",
  description: "",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="th">
      <body className={`antialiased`}>{children}</body>
      {/* <body className={`${sarabun.className} antialiased`}>{children}</body> */}
    </html>
  );
}

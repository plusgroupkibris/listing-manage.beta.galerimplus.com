import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: "Galerim Plus",
  description: "KKTC'nin en büyük araç alım satım platformu",
  generator: "ilyasbozdemir.dev",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}

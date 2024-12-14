import './globals.css'
import ClientLayout from '@/components/ClientLayout/ClientLayout'
import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] })


export const metadata = {
  title: {
    default: 'Trade Finance | AI-Powered Trading Platform',
    template: '%s | Trade Finance'
  },
  description: {
    default: 'Trade Finance offers advanced AI-driven trading solutions with secure investment plans.',
    about: 'Learn about Trade Finance - Your trusted partner in AI-powered trading solutions and investment strategies.',
    plans: 'Explore our diverse trading plans offering competitive returns with AI-driven market analysis and risk management.',
    affiliate: 'Join our lucrative affiliate program and earn rewards by referring traders to our platform.',
    contact: 'Get in touch with Trade Finance - We are here to answer your questions about trading and investments.',
    terms: 'Review our terms and conditions for using Trade Finance trading platform and investment services.'
  },
  keywords: 'AI trading, trade finance, investment plans, secure trading, financial technology, trading platform',
  openGraph: {
    title: 'Trade Finance | AI-Powered Trading Platform',
    description: 'Trade Finance offers advanced AI-driven trading solutions with secure investment plans.',
    url: 'https://tradefinancetf.com',
    siteName: 'Trade Finance',
    images: [
      {
        url: '/tdlogo.png',
        width: 800,
        height: 600,
      },
    ],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Trade Finance | AI-Powered Trading Platform',
    description: 'Trade Finance offers advanced AI-driven trading solutions with secure investment plans.',
    images: ['/tdlogo.png'],
  },
  icons: {
    icon: [
      { url: '/tdlogo.png', sizes: '32x32', type: 'image/png' },
      { url: '/tdlogo.png', sizes: '16x16', type: 'image/png' }
    ],
    shortcut: '/tdlogo.png',
    apple: { url: '/tdlogo.png', sizes: '180x180', type: 'image/png' },
  }
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className} suppressHydrationWarning>
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  )
}


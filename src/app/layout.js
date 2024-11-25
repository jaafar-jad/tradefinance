"use client"
import { Inter } from 'next/font/google'
import { usePathname } from 'next/navigation'
import './globals.css'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import ScrollToTop from '@/components/layout/ScrollToTop'
import ChatBot from '@/components/ChatBot/ChatBot'
import TransactionNotification from '@/components/ui/TransactionNotification/TransactionNotification'

const inter = Inter({ subsets: ['latin'] })



export default function RootLayout({ children }) {
  const pathname = usePathname()
  const isDashboard = pathname?.includes('/dashboard')

  return (
    <html lang="en">
      <body className={inter.className}>
        {!isDashboard && <Navbar />}
        <main className={!isDashboard ? "pt-16 md:pt-[144px]" : ""}>
          {children}
        </main>
        {!isDashboard && (
          <>
            <Footer />
          </>
        )}
            <ScrollToTop />
            <ChatBot/>
            <TransactionNotification />
      </body>
    </html>
  )
}

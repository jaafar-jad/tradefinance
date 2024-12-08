"use client"
import { usePathname } from "next/navigation"
import Navbar from "@/components/layout/Navbar"
import Footer from "@/components/layout/Footer"
import ScrollToTop from "@/components/layout/ScrollToTop"
import ChatBot from "@/components/ChatBot/ChatBot"
import TransactionNotification from "@/components/ui/TransactionNotification/TransactionNotification"
import ChainLoader from "@/components/ui/ChainLoader/ChainLoader"

export default function ClientLayout({ children }) {
  const pathname = usePathname()
  const isDashboard = pathname?.includes("/dashboard")
  const isAuthPage = pathname?.includes("/login") || pathname?.includes("/signup")

  return (
    <>
      <ChainLoader />
      {!isDashboard && !isAuthPage && <Navbar />}
      <main className={!isDashboard && !isAuthPage ? "pt-16 md:pt-[144px]" : ""}>
        {children}
      </main>
      {!isDashboard && !isAuthPage && (
        <>
          <Footer />
          <TransactionNotification />
        </>
      )}
      <ScrollToTop />
      <ChatBot />
    </>
  )
}

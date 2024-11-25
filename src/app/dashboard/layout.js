"use client"
import { useState } from 'react'
import Sidebar from '@/components/dashboard/navigation/Sidebar'
import Header from '@/components/dashboard/navigation/Header'
import MobileNav from '@/components/dashboard/navigation/MobileNav'

export default function DashboardLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="min-h-screen bg-gray-100">
      <Sidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />
      <div className="lg:ml-20">
        <Header onMenuClick={() => setSidebarOpen(true)} />
        <main className="pt-16">
          <div className="px-4 sm:px-6 lg:px-8 py-6">
            {children}
          </div>
        </main>
      </div>
      <MobileNav isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />
    </div>
  )
}


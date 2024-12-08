"use client";
import { useState } from 'react';
import Sidebar from '@/components/dashboard/navigation/Sidebar';
import Header from '@/components/dashboard/navigation/Header';
import MobileNav from '@/components/dashboard/navigation/MobileNav';
import RightSidebar from '@/components/dashboard/conversion/RightSidebar';

export default function DashboardLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [rightSidebarOpen, setRightSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-100">
      <Sidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />
      
      {/* Mobile Conversion Sidebar */}
      <div className={`fixed inset-y-0 right-0 pt-6 transform ${rightSidebarOpen ? 'translate-x-0' : 'translate-x-full'} 
        transition-transform duration-300 ease-in-out z-50 w-80 lg:hidden`}>
        <RightSidebar onClose={() => setRightSidebarOpen(false)} />
      </div>

      {/* Desktop Conversion Sidebar */}
      <div className="hidden lg:block fixed right-0 top-0 h-screen">
        <RightSidebar />
      </div>

      <div className="lg:ml-20 lg:mr-80">
        <Header 
          onMenuClick={() => setSidebarOpen(true)}
          onRightMenuClick={() => setRightSidebarOpen(true)}
        />
        <main className="pt-16">
          {/* Added pb-20 for mobile nav spacing */}
          <div className="px-2 sm:px-2 lg:px-4 py-4 md:py-8 pb-20 md:pb-8">
            {children}
          </div>
        </main>
      </div>

      {/* Overlay for mobile */}
      {rightSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setRightSidebarOpen(false)}
        />
      )}

      <MobileNav 
        isOpen={sidebarOpen} 
        setIsOpen={setSidebarOpen}
        rightSidebarOpen={rightSidebarOpen}
        setRightSidebarOpen={setRightSidebarOpen}
      />
    </div>
  );
}


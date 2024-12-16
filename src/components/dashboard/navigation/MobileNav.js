"use client"

import { useParams } from 'next/navigation';
import { useState, useEffect } from 'react'
import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { IoClose } from 'react-icons/io5'
import { 
  FaHome, 
  FaChartLine, 
  FaWallet, 
  FaHistory, 
  FaUsers, 
  FaCog,
  FaArrowRight
} from 'react-icons/fa'

export default function MobileNav() {
  const pathname = usePathname()
  const params = useParams();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(null)
  const [activeSubItem, setActiveSubItem] = useState({})
  const [selectedItem, setSelectedItem] = useState(null)

  const navigationItems = [
    { 
      name: 'Home', 
      href: `/dashboard/${params.userId}`, 
      icon: FaHome,
      subItems: [
        { name: 'Home', href: `/dashboard/${params.userId}` }
      ]
    },
    { 
      name: 'Invest', 
      href: `/dashboard/${params.userId}/investments/active`, 
      icon: FaChartLine,
      subItems: [
        { name: 'Plans', href: `/dashboard/${params.userId}/investments/active` },
        { name: 'History', href: `/dashboard/${params.userId}/investments/history` }
      ]
    },
    { 
      name: 'Wallet', 
      href: `/dashboard/${params.userId}/deposits`, 
      icon: FaWallet,
      subItems: [
        { name: 'Deposit', href: `/dashboard/${params.userId}/deposits` },
        { name: 'Withdraw', href: `/dashboard/${params.userId}/withdrawals` }
      ]
    },
    { 
      name: 'Transact', 
      href: `/dashboard/${params.userId}/transactions`, 
      icon: FaHistory,
      subItems: [
        { name: 'transactions', href: `/dashboard/${params.userId}/transactions` }
      ]
    },
    { 
      name: 'Referrals', 
      href: `/dashboard/${params.userId}/referrals/list`, 
      icon: FaUsers,
      subItems: [
        { name: 'Referrals', href: `/dashboard/${params.userId}/referrals/list` },
      ]
    },
    { 
      name: 'Settings', 
      href: `/dashboard/${params.userId}/profile/settings/profile`, 
      icon: FaCog,
      subItems: [
        { name: 'Profile', href: `/dashboard/${params.userId}/profile/settings/profile` },
      ]
    },
  ]

  const currentSection = navigationItems.find(
    (section) => section.name === mobileMenuOpen
  )

  useEffect(() => {
    const currentItem = navigationItems.find(item => 
      item.href === pathname || item.subItems?.some(sub => sub.href === pathname)
    )
    if (currentItem) {
      setSelectedItem(currentItem)
      const activeSubItem = currentItem.subItems?.find(sub => sub.href === pathname)
      if (activeSubItem) {
        setActiveSubItem(prev => ({ ...prev, [currentItem.name]: activeSubItem }))
      }
    }
  }, [pathname])

  const handleItemClick = (item) => {
    setMobileMenuOpen(item.name)
    setSelectedItem(item)
  }

  const handleSubItemClick = (section, subItem) => {
    setSelectedItem(section)
    setActiveSubItem(prev => ({ ...prev, [section.name]: subItem }))
    setMobileMenuOpen(null)
  }

  return (
    <>
      <motion.div
        className="lg:hidden fixed bottom-0 left-0 right-0 bg-white/90 shadow-t-lg z-50 border-t border-gray-100"
        initial={{ y: 100 }}
        animate={{ y: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
      >
        <div className="flex justify-around items-center h-16 px-2">
          {navigationItems.map((item) => {
            const isActive = selectedItem?.name === item.name
            
            return (
              <motion.button
                key={item.name}
                className={`flex flex-col items-center justify-center w-full h-full rounded-lg
                  ${isActive ? 'text-red-600 bg-red-50' : 'text-gray-600'}
                  hover:bg-red-50 transition-all duration-300`}
                onClick={() => handleItemClick(item)}
                whileTap={{ scale: 0.95 }}
              >
                <motion.span
                  className={`text-xl ${isActive ? 'scale-110' : ''}`}
                  animate={{ scale: isActive ? [1, 1.2, 1] : 1 }}
                  transition={{ duration: 0.2 }}
                >
                  <item.icon />
                </motion.span>
                <span className="text-[0.7rem] mt-1 font-medium">
                  {activeSubItem[item.name]?.name || item.name}
                </span>
              </motion.button>
            )
          })}
        </div>
      </motion.div>

      <AnimatePresence>
        {mobileMenuOpen && currentSection && (
          <motion.div
            className="fixed inset-0 bg-black/60 z-50 lg:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="absolute bottom-0 left-0 right-0 bg-white rounded-t-3xl p-6"
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 500 }}
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-lg font-bold text-red-600">
                  {currentSection.name}
                </h2>
                <motion.button
                  onClick={() => setMobileMenuOpen(null)}
                  whileTap={{ scale: 0.9 }}
                  className="bg-red-50 p-2 rounded-full"
                >
                  <IoClose className="h-6 w-6 text-red-600" />
                </motion.button>
              </div>

              <div className="space-y-2 max-h-[60vh] overflow-y-auto">
                {currentSection.subItems?.map((item) => (
                  <Link href={item.href} key={item.name}>
                    <motion.div
                      className={`flex items-center justify-between px-4 py-3 rounded-xl
                        ${pathname === item.href
                          ? 'bg-red-100 text-red-700 font-bold'
                          : 'text-gray-700 hover:bg-red-50'
                        } transition-all duration-300`}
                      onClick={() => handleSubItemClick(currentSection, item)}
                      whileHover={{ x: 5 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <span className="text-base">
                        {item.name}
                      </span>
                      <FaArrowRight className="h-4 w-4" />
                    </motion.div>
                  </Link>
                ))}
              </div>

              {currentSection.href && currentSection.subItems?.length > 0 && (
                <Link href={currentSection.href}>
                  <motion.div
                    className="mt-4 flex items-center justify-center px-4 py-3 rounded-xl
                      bg-gradient-to-r from-red-600 to-red-800 text-white
                      hover:from-red-700 hover:to-red-900"
                    onClick={() => setMobileMenuOpen(null)}
                    whileTap={{ scale: 0.98 }}
                  >
                    <span className="text-base font-medium">
                     {currentSection.name}
                    </span>
                  </motion.div>
                </Link>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}





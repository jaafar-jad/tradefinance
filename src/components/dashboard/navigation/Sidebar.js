"use client"

import { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'
import Link from 'next/link'

import Image  from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  FaHome, 
  FaChartLine, 
  FaWallet, 
  FaHistory, 
  FaUsers, 
  FaCog,
  FaMoneyBillWave,
  FaExchangeAlt,
  FaUserCircle,
  FaChartBar
} from 'react-icons/fa'

export default function Sidebar() {
  const pathname = usePathname()
  const [hoveredItem, setHoveredItem] = useState(null)
  const [userId, setUserId] = useState(null)

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'))
    setUserId(user?.id)
  }, [])

  const navigation = userId ? [
    { 
      name: 'Dashboard', 
      href: `/dashboard/${userId}`, 
      icon: FaHome,
      subItems: []
    },
    { 
      name: 'Investments', 
      href: `/dashboard/${userId}/investments/active`, 
      icon: FaChartLine,
      subItems: [
        { name: 'Active Plans', href: `/dashboard/${userId}/investments/active` },
        { name: 'History', href: `/dashboard/${userId}/investments/history` }
      ]
    },
    { 
      name: 'Wallet', 
      href: `/dashboard/${userId}/deposits`, 
      icon: FaWallet,
      subItems: [
        { name: 'Deposits', href: `/dashboard/${userId}/deposits` },
        { name: 'Withdrawals', href: `/dashboard/${userId}/withdrawals` }
      ]
    },
    { 
      name: 'Transactions', 
      href: `/dashboard/${userId}/transactions`, 
      icon: FaHistory,
      subItems: []
    },
    { 
      name: 'Referrals', 
      href: `/dashboard/${userId}/referrals/list`, 
      icon: FaUsers,
      subItems: [
        { name: 'My Referrals', href: `/dashboard/${userId}/referrals/list` },
      ]
    },
    { 
      name: 'Settings', 
      href: `/dashboard/${userId}/profile/settings/profile`, 
      icon: FaCog,
      subItems: [
        { name: 'Profile', href: `/dashboard/${userId}/profile/settings/profile` },
      ]
    },
  ] : []

  return (
    <div className="fixed left-0 top-0 h-full w-20 bg-white shadow-xl z-40 hidden lg:block">
      <div className="flex flex-col h-full">
        <div className="h-16 flex items-center justify-center border-b">
          <Link href={`/dashboard/${userId}`}>
            <div className="relative w-8 h-8 lg:w-12 lg:h-10 rounded-full overflow-hidden transition-all duration-300">
              <Image
               src='/tdlogo.png'
               alt="TF"
               layout="fill"
               className="rounded-full object-cover"
               priority
             />
            </div>
          </Link>
        </div>

        <nav className="flex-1 py-6">
          {navigation.map((item) => (
            <div
              key={item.name}
              className="relative"
              onMouseEnter={() => setHoveredItem(item.name)}
              onMouseLeave={() => setHoveredItem(null)}
            >
              <Link href={item.href}>
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  className={`flex flex-col items-center p-4 ${
                    pathname === item.href
                      ? 'text-red-600'
                      : 'text-gray-600 hover:text-red-600'
                  }`}
                >
                  <item.icon className="h-6 w-6" />
                  <span className="text-xs mt-1">{item.name}</span>
                </motion.div>
              </Link>

              <AnimatePresence>
                {hoveredItem === item.name && item.subItems.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    className="absolute left-20 top-0 bg-white shadow-lg rounded-lg py-2 w-48"
                  >
                    {item.subItems.map((subItem) => (
                      <Link
                        key={subItem.href}
                        href={subItem.href}
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-red-50 hover:text-red-600"
                      >
                        {subItem.name}
                      </Link>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </nav>

        
      </div>
    </div>
  )
}

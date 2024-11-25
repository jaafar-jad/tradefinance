"use client"
import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { useState } from 'react'
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

const navigation = [
  { 
    name: 'Dashboard', 
    href: '/dashboard', 
    icon: FaHome,
    subItems: []
  },
  { 
    name: 'Investments', 
    href: '/dashboard/routes/investments/active', 
    icon: FaChartLine,
    subItems: [
      { name: 'Active Plans', href: '/dashboard/routes/investments/active' },
      { name: 'History', href: '/dashboard/routes/investments//history' }
    ]
  },
  { 
    name: 'Wallet', 
    href: '/dashboard/routes/deposits', 
    icon: FaWallet,
    subItems: [
      { name: 'Deposits', href: '/dashboard/routes/deposits' },
      { name: 'Withdrawals', href: '/dashboard/routes/withdrawals' }
    ]
  },
  { 
    name: 'Transactions', 
    href: '/dashboard/routes/transactions', 
    icon: FaHistory,
    subItems: []
  },
  { 
    name: 'Referrals', 
    href: '/dashboard/routes/referrals/list', 
    icon: FaUsers,
    subItems: [
      { name: 'My Referrals', href: '/dashboard/routes/referrals/list' },
    ]
  },
  { 
    name: 'Settings', 
    href: '/dashboard/route/profile', 
    icon: FaCog,
    subItems: [
      { name: 'Profile', href: '/dashboard/routes/profile/settings/profile' },
      { name: 'Security', href: '/dashboard/routes/profile/settings/profile/security' }
    ]
  },
]

export default function Sidebar() {
  const pathname = usePathname()
  const [hoveredItem, setHoveredItem] = useState(null)

  return (
    <div className="fixed left-0 top-0 h-full w-20 bg-white shadow-xl z-40 hidden lg:block">
      <div className="flex flex-col h-full">
        <div className="h-16 flex items-center justify-center border-b">
          <Link href="/dashboard">
            <motion.div
              whileHover={{ scale: 1.1 }}
              className="text-2xl font-bold text-red-600"
            >
              TF
            </motion.div>
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

        <div className="p-4 border-t">
          <motion.button
            whileHover={{ scale: 1.05 }}
            className="w-full p-2 rounded-lg bg-red-600 text-white flex items-center justify-center"
          >
            <FaUsers className="h-5 w-5" />
          </motion.button>
        </div>
      </div>
    </div>
  )
}


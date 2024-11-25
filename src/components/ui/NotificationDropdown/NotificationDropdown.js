"use client"
import { motion } from 'framer-motion'
import { useState } from 'react'
import { 
  FaBell, 
  FaCircle, 
  FaCheckCircle, 
  FaExclamationCircle,
  FaDollarSign,
  FaUserPlus,
  FaChartLine
} from 'react-icons/fa'

const notifications = [
  {
    id: 1,
    type: 'success',
    title: 'Deposit Successful',
    message: 'Your deposit of $5,000 has been confirmed',
    time: '2 minutes ago',
    icon: FaDollarSign,
    read: false
  },
  {
    id: 2,
    type: 'info',
    title: 'New Referral',
    message: 'John Doe joined using your referral link',
    time: '1 hour ago',
    icon: FaUserPlus,
    read: false
  },
  {
    id: 3,
    type: 'warning',
    title: 'Investment Update',
    message: 'Your investment plan will expire in 24 hours',
    time: '3 hours ago',
    icon: FaChartLine,
    read: true
  }
]

export default function NotificationDropdown() {
  const [isOpen, setIsOpen] = useState(false)
  const unreadCount = notifications.filter(n => !n.read).length

  const getTypeStyles = (type) => {
    switch(type) {
      case 'success':
        return 'text-green-500 bg-green-50'
      case 'warning':
        return 'text-yellow-500 bg-yellow-50'
      case 'info':
        return 'text-blue-500 bg-blue-50'
      default:
        return 'text-gray-500 bg-gray-50'
    }
  }

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-gray-600 hover:text-red-600 focus:outline-none"
      >
        <FaBell className="h-6 w-6" />
        {unreadCount > 0 && (
          <span className="absolute top-0 right-0 inline-flex items-center justify-center w-4 h-4 text-xs font-bold text-white bg-red-600 rounded-full">
            {unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 10 }}
          className="
            absolute right-0 mt-2 w-80 md:w-96
            bg-white rounded-lg shadow-lg
            border border-gray-100
            z-50
          "
        >
          <div className="p-4 border-b border-gray-100">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Notifications</h3>
              <span className="text-xs text-gray-500">{unreadCount} unread</span>
            </div>
          </div>

          <div className="max-h-96 overflow-y-auto">
            {notifications.map((notification) => (
              <motion.div
                key={notification.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className={`
                  p-4 border-b border-gray-100 last:border-0
                  ${notification.read ? 'bg-white' : 'bg-gray-50'}
                `}
              >
                <div className="flex items-start space-x-3">
                  <div className={`p-2 rounded-full ${getTypeStyles(notification.type)}`}>
                    <notification.icon className="h-4 w-4" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium">{notification.title}</p>
                      <span className="text-xs text-gray-500">{notification.time}</span>
                    </div>
                    <p className="text-xs text-gray-600 mt-1">{notification.message}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="p-4 border-t border-gray-100">
            <button
              className="
                w-full px-4 py-2 text-sm text-center
                text-red-600 hover:text-red-700
                focus:outline-none
              "
            >
              Mark all as read
            </button>
          </div>
        </motion.div>
      )}
    </div>
  )
}

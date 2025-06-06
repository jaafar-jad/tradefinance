"use client"
import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useState, useEffect } from 'react'
import { FaBell, FaChartLine, FaArrowUp, FaArrowDown, FaHeart, FaTimes } from 'react-icons/fa'
import { client } from '@/lib/contentful'

export default function NotificationDropdown() {
  const [isOpen, setIsOpen] = useState(false)
  const [notifications, setNotifications] = useState([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [lastROIDate, setLastROIDate] = useState(null)

  const createSystemNotification = async (message) => {
    try {
      const userString = localStorage.getItem("user")
      const user = JSON.parse(userString)
      
      const userProfileResponse = await client.getEntries({
        content_type: 'userProfile',
        'fields.email': user.email,
        include: 3
      })

      if (!userProfileResponse.items.length) return

      await client.createEntry('transaction', {
        fields: {
          type: { 'en-US': 'SYSTEM' },
          message: { 'en-US': message },
          timestamp: { 'en-US': new Date().toISOString() },
          status: { 'en-US': 'COMPLETED' },
          read: { 'en-US': false },
          user: {
            'en-US': {
              sys: {
                type: 'Link',
                linkType: 'Entry',
                id: userProfileResponse.items[0].sys.id
              }
            }
          }
        }
      })

      fetchUserNotifications()
    } catch (error) {
      console.error('Error creating notification:', error)
    }
  }

  const checkROIAndCycle = async () => {
    const now = new Date()
    const currentTime = now.getHours() * 60 + now.getMinutes()
    const targetTime = 23 * 60 + 59 // 23:59

    if (currentTime === targetTime && (!lastROIDate || !isSameDay(lastROIDate, now))) {
      await createSystemNotification("Your daily ROI has been distributed! 📈 Check your balance.")
      await createSystemNotification("New trading cycle begins in 1 minute! 🚀")
      setLastROIDate(now)
    }
  }

  const sendAppreciationMessage = async () => {
    const messages = [
      "Thank you for choosing us as your trusted trading partner! 🌟",
      "Your success is our priority. How's your trading journey going? 💫",
      "We appreciate your continued trust and investment! 🎉",
      "You're part of an elite trading community. Thank you! 🙏",
      "Your growth matters to us. Keep winning! 🏆"
    ]
    await createSystemNotification(messages[Math.floor(Math.random() * messages.length)])
  }

  const fetchUserNotifications = async () => {
    try {
      const userString = localStorage.getItem("user")
      const user = JSON.parse(userString)
      
      const readNotificationsString = localStorage.getItem(`readNotifications_${user.email}`)
      const readNotifications = readNotificationsString ? JSON.parse(readNotificationsString) : []
      
      const [depositsResponse, withdrawalsResponse, systemResponse] = await Promise.all([
        client.getEntries({
          content_type: 'transaction',
          'fields.type': 'DEPOSIT',
          order: '-sys.createdAt',
          include: 3
        }),
        client.getEntries({
          content_type: 'transaction',
          'fields.type': 'WITHDRAWAL',
          order: '-sys.createdAt',
          include: 3
        }),
        client.getEntries({
          content_type: 'transaction',
          'fields.type': 'SYSTEM',
          order: '-sys.createdAt',
          include: 3
        })
      ])

      const userTransactions = [
        ...depositsResponse.items,
        ...withdrawalsResponse.items,
        ...systemResponse.items
      ].filter(item => item.fields.user?.fields?.email === user.email)

      const formattedNotifications = userTransactions
        .sort((a, b) => new Date(b.fields.timestamp) - new Date(a.fields.timestamp))
        .map(item => ({
          id: item.sys.id,
          type: item.fields.type,
          amount: item.fields.amount,
          status: item.fields.status,
          message: item.fields.message,
          read: readNotifications.includes(item.sys.id),
          timestamp: new Date(item.fields.timestamp),
          email: item.fields.user?.fields?.email
        }))

      setNotifications(formattedNotifications)
      setUnreadCount(formattedNotifications.filter(n => !n.read).length)
    } catch (error) {
      console.error('Error Details:', error)
    }
  }

  const markAllAsRead = () => {
    const userString = localStorage.getItem("user")
    const user = JSON.parse(userString)
    
    const readNotificationsString = localStorage.getItem(`readNotifications_${user.email}`)
    const readNotifications = readNotificationsString ? JSON.parse(readNotificationsString) : []
    
    const newReadNotifications = [
      ...readNotifications,
      ...notifications.map(n => n.id)
    ]
    
    localStorage.setItem(
      `readNotifications_${user.email}`, 
      JSON.stringify([...new Set(newReadNotifications)])
    )
    
    setNotifications(notifications.map(n => ({ ...n, read: true })))
    setUnreadCount(0)
    setIsOpen(false)
  }

  useEffect(() => {
    fetchUserNotifications()
    
    // Check ROI and cycle every minute
    const roiInterval = setInterval(checkROIAndCycle, 60000)
    
    // Send appreciation message every 3 days
    const appreciationInterval = setInterval(sendAppreciationMessage, 259200000)
    
    // Regular notification refresh
    const refreshInterval = setInterval(fetchUserNotifications, 30000)

    return () => {
      clearInterval(roiInterval)
      clearInterval(appreciationInterval)
      clearInterval(refreshInterval)
    }
  }, [])

  
  const getTypeStyles = (type) => {
    const styles = {
      DEPOSIT: 'text-green-500 bg-green-50',
      WITHDRAWAL: 'text-yellow-500 bg-yellow-50',
      ROI: 'text-blue-500 bg-blue-50',
      SYSTEM: 'text-red-500 bg-red-50'
    };
    return styles[type] || 'text-gray-500 bg-gray-50';
  };

  const getIcon = (type) => {
    const icons = {
      DEPOSIT: FaArrowDown,
      WITHDRAWAL: FaArrowUp,
      SYSTEM: FaHeart,
      ROI: FaChartLine
    };
    return icons[type] || FaChartLine;
  };

  const getNotificationMessage = (notification) => {
    if (notification.type === 'SYSTEM') return notification.message;

    const messages = {
      DEPOSIT: `Your deposit of $${notification.amount} has been ${notification.status.toLowerCase()}`,
      WITHDRAWAL: `Your withdrawal of $${notification.amount} has been ${notification.status.toLowerCase()}`,
      ROI: `Daily return of $${notification.amount} has been credited to your account`
    };
    
    return messages[notification.type] || notification.message || 'Transaction processed';
  };

  useEffect(() => {
    fetchUserNotifications();
    const interval = setInterval(fetchUserNotifications, 30000); // Refresh every 30 seconds
    return () => clearInterval(interval);
  }, []);

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

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute right-0 mt-2 w-80 md:w-96 bg-white rounded-lg shadow-lg border border-gray-100 z-50"
          >
            <div className="p-4 border-b border-gray-100">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Notifications</h3>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-500">{unreadCount} unread</span>
                  <button 
                    onClick={() => setIsOpen(false)}
                    className="p-1 hover:bg-gray-100 rounded-full"
                  >
                    <FaTimes className="h-4 w-4 text-red-500" />
                  </button>
                </div>
              </div>
            </div>

            <div className="max-h-96 overflow-y-auto">
              {notifications.length === 0 ? (
                <div className="p-4 text-center text-gray-500">
                  No notifications yet
                </div>
              ) : (
                <AnimatePresence>
                  {notifications.map((notification) => (
                    <motion.div
                      key={notification.id}
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className={`p-4 border-b border-gray-100 last:border-0 ${notification.read ? 'bg-white' : 'bg-gray-50'}`}
                    >
                      <div className="flex items-start space-x-3">
                        <div className={`p-2 rounded-full ${getTypeStyles(notification.type)}`}>
                          {React.createElement(getIcon(notification.type), { className: "h-4 w-4" })}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <p className="text-sm font-medium">{notification.type}</p>
                            <span className="text-xs text-gray-500">
                              {new Date(notification.timestamp).toLocaleString()}
                            </span>
                          </div>
                          <p className="text-xs text-gray-600 mt-1">
                            {getNotificationMessage(notification)}
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              )}
            </div>

            {notifications.length > 0 && (
              <div className="p-4 border-t border-gray-100">
                <button
                  onClick={markAllAsRead}
                  className="w-full px-4 py-2 text-sm text-center text-red-600 hover:text-red-700 focus:outline-none"
                >
                  Mark all as read
                </button>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}



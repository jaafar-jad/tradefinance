"use client"
import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FaCheckCircle, FaTimes, FaArrowUp, FaArrowDown } from 'react-icons/fa'

const generateTransaction = () => {
    const countries = [
        'USA', 'UK', 'Germany', 'France', 'Japan', 'Canada', 'Australia', 'Brazil', 'India', 'Singapore',
        'Spain', 'Italy', 'Netherlands', 'Switzerland', 'Sweden', 'Norway', 'Denmark', 'Finland', 'Ireland', 'Belgium',
        'Mexico', 'Argentina', 'Chile', 'Colombia', 'Peru', 'Venezuela', 'Ecuador', 'Bolivia', 'Paraguay', 'Uruguay',
        'China', 'South Korea', 'Indonesia', 'Malaysia', 'Thailand', 'Vietnam', 'Philippines', 'Pakistan', 'Bangladesh', 'Sri Lanka',
        'Russia', 'Ukraine', 'Poland', 'Romania', 'Czech Republic', 'Hungary', 'Bulgaria', 'Greece', 'Turkey', 'Egypt',
        'Saudi Arabia', 'UAE', 'Qatar', 'Kuwait', 'Bahrain', 'Oman', 'Jordan', 'Lebanon', 'Israel', 'Iraq',
        'Iran', 'Afghanistan', 'Kazakhstan', 'Uzbekistan', 'Azerbaijan', 'Georgia', 'Armenia', 'Mongolia', 'Nepal', 'Myanmar',
        'Cambodia', 'Laos', 'Brunei', 'East Timor', 'Papua New Guinea', 'New Zealand', 'Fiji', 'Samoa', 'Tonga', 'Vanuatu',
        'South Africa', 'Nigeria', 'Kenya', 'Ethiopia', 'Ghana', 'Morocco', 'Tunisia', 'Algeria', 'Libya', 'Sudan',
        'Uganda', 'Tanzania', 'Rwanda', 'Burundi', 'Congo', 'Angola', 'Zambia', 'Zimbabwe', 'Mozambique', 'Madagascar',
        'Senegal', 'Mali', 'Burkina Faso', 'Niger', 'Chad', 'Somalia', 'Djibouti', 'Eritrea', 'Namibia', 'Botswana',
        'Portugal', 'Austria', 'Croatia', 'Serbia', 'Slovakia', 'Slovenia', 'Estonia', 'Latvia', 'Lithuania', 'Belarus',
        'Moldova', 'Cyprus', 'Malta', 'Iceland', 'Luxembourg', 'Monaco', 'Liechtenstein', 'Andorra', 'San Marino', 'Vatican City',
        'Yemen', 'Syria', 'Palestine', 'Turkmenistan', 'Tajikistan', 'Kyrgyzstan', 'Maldives', 'Bhutan', 'North Korea', 'Taiwan',
        'Jamaica', 'Trinidad', 'Barbados', 'Bahamas', 'Cuba', 'Haiti', 'Dominican Republic', 'Guatemala', 'Honduras', 'Nicaragua',
        'Costa Rica', 'Panama', 'Belize', 'El Salvador', 'Guyana', 'Suriname', 'French Guiana', 'Mauritius', 'Seychelles', 'Comoros'
      ]
      
  const types = ['deposit', 'withdrawal']
  const amounts = Array.from({ length: 50 }, () => Math.floor(Math.random() * 250000) + 1000)
  
  return {
    id: Math.random().toString(36).substr(2, 9),
    type: types[Math.floor(Math.random() * types.length)],
    amount: amounts[Math.floor(Math.random() * amounts.length)],
    country: countries[Math.floor(Math.random() * countries.length)],
    time: new Date().toISOString()
  }
}

export default function TransactionNotification() {
  const [notifications, setNotifications] = useState([])
  
  useEffect(() => {
    const interval = setInterval(() => {
      const newTransaction = generateTransaction()
      setNotifications(prev => {
        const updated = [...prev, newTransaction]
        if (updated.length > 1) {
          return [updated[updated.length - 1]]
        }
        return updated
      })
      
      // Remove notification after 5 seconds
      setTimeout(() => {
        setNotifications(prev => prev.filter(n => n.id !== newTransaction.id))
      }, 5000)
    }, 8000)

    return () => clearInterval(interval)
  }, [])

  return (
    <AnimatePresence>
  {notifications.map((notification) => (
    <motion.div
      key={notification.id}
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 50 }}
      className="fixed bottom-4 left-0 right-0 -translate-x-1/2 z-50 w-full px-4 md:px-0 md:w-auto"
    >
      <div className="bg-white rounded-lg shadow-2xl p-1 relative mx-auto max-w-[260px] md:max-w-[290px]">
        <button
          onClick={() => setNotifications(prev => prev.filter(n => n.id !== notification.id))}
          className="absolute top-1 right-1 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <FaTimes className="text-xs" />
        </button>
        <div className="flex items-center gap-2">
          <div className="flex-shrink-0">
            {notification.type === 'deposit' ? (
              <div className="w-5 h-5 md:w-8 md:h-8 bg-green-100 rounded-full flex items-center justify-center">
                <FaArrowDown className="text-green-500 text-xs md:text-sm" />
              </div>
            ) : (
              <div className="w-5 h-5 md:w-8 md:h-8 bg-red-100 rounded-full flex items-center justify-center">
                <FaArrowUp className="text-red-500 text-xs md:text-sm" />
              </div>
            )}
          </div>

          <div className="flex-1 min-w-0">
            <p className="text-[0.5rem] md:text-xs text-gray-900">
              An Investor from{' '}
              <span className="font-semibold">{notification.country}</span>{' '}
              {notification.type === 'deposit' ? 'deposited' : 'withdrew'}{' '}
              <span className="font-semibold">
                ${notification.amount.toLocaleString()}
              </span>
            </p>
            <p className="text-[0.7rem] text-green-500">
              Just now
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  ))}
</AnimatePresence>

  )
}

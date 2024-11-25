"use client"
import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { FaArrowUp, FaArrowDown, FaClock, FaCheckCircle, FaHourglassHalf } from 'react-icons/fa'

// Generate random transactions
const generateTransactions = (type) => {
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
const amounts = Array.from({ length: 50 }, () => Math.floor(Math.random() * 250000) + 1000)
  const wallets = Array.from({ length: 50 }, () => 
    Array.from({ length: 64 }, () => 
      '0123456789abcdef'[Math.floor(Math.random() * 16)]
    ).join('')
  )
  
  return Array.from({ length: 50 }, (_, i) => ({
    id: `${type}-${i}`,
    type,
    amount: amounts[i],
    wallet: wallets[i],
    country: countries[Math.floor(Math.random() * countries.length)],
    status: Math.random() > 0.2 ? 'Confirmed' : 'Confirmed',
    time: new Date(Date.now() - Math.random() * 86400000).toISOString()
  }))
}

const deposits = generateTransactions('deposit')
const withdrawals = generateTransactions('withdrawal')

export default function HomeTransactions() {
  const [activeTab, setActiveTab] = useState('deposits')
  

  const containerStyle = {
    '--scroll-speed': '110s',
  }
  const TransactionCard = ({ transaction }) => (
    <div className="bg-white rounded-lg shadow-md p-2 md:p-3 mb-2 md:mb-3 hover:shadow-lg transition-shadow duration-300">
      <div className="flex items-center justify-between gap-2 md:gap-4">
        {/* Left Section: Icon + Amount + Country */}
        <div className="flex items-center gap-2 md:gap-3 flex-1">
          {transaction.type === 'deposit' ? (
            <FaArrowDown className="text-green-500 text-sm md:text-xl shrink-0" />
          ) : (
            <FaArrowUp className="text-red-500 text-sm md:text-xl shrink-0" />
          )}
          
          <div className="min-w-[100px] md:min-w-[120px]">
            <p className="font-semibold text-gray-900 text-sm md:text-base">
              ${transaction.amount.toLocaleString()}
            </p>
            <p className="text-xs md:text-sm text-gray-500">
              {transaction.country}
            </p>
          </div>
        </div>
  
       {/* Middle Section: Wallet */}
       <div className="flex-1 hidden md:block lg:block ">
          <p className="text-xs text-gray-500 font-mono truncate">
            {transaction.wallet}
          </p>
        </div>
  
        {/* Right Section: Status + Time */}
        <div className="flex items-center gap-2 md:gap-4 shrink-0">
          <div className="flex items-center gap-1">
            <FaCheckCircle className="text-green-500 text-xs md:text-sm" />
            <span className="text-green-500 text-xs md:text-sm hidden sm:inline">
              {transaction.status}
            </span>
          </div>
          
          <div className="flex items-center gap-1 text-xs md:text-sm text-gray-400">
            <FaClock className="shrink-0" />
            <span className="hidden sm:inline">
              {new Date(transaction.time).toLocaleTimeString()}
            </span>
          </div>
        </div>
         
      </div>
       {/* Middle Section: Wallet */}
       <div className="flex-1 ">
          <p className="text-xs text-gray-500 md:hidden lg:hidden font-mono truncate">
            {transaction.wallet}
          </p>
        </div>
    </div>
  )
  

  return (
    <section className="py-12 bg-gray-50">
      <div className="container mx-auto px-2">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mx-lg mx-auto"
        >
          <div className="flex justify-center gap-4 mb-8">
            <button
              onClick={() => setActiveTab('deposits')}
              className={`px-3 py-2  text-sm rounded-full font-semibold transition-all duration-300 ${
                activeTab === 'deposits'
                  ? 'bg-green-500 text-white'
                  : 'bg-white text-gray-600 hover:bg-gray-100'
              }`}
            >
              Latest Deposits
            </button>
            <button
              onClick={() => setActiveTab('withdrawals')}
              className={`px-3 py-2 rounded-full text-sm font-semibold transition-all duration-300 ${
                activeTab === 'withdrawals'
                  ? 'bg-red-500 text-white'
                  : 'bg-white text-gray-600 hover:bg-gray-100'
              }`}
            >
              Latest Withdrawals
            </button>
          </div>

          <div className="relative h-[400px] overflow-hidden rounded-xl bg-gray-100 px-2 py-4">
          <div className="absolute inset-0 pointer-events-none  z-10" />
          
          <div 
            className="animate-scroll"
            style={containerStyle}
          >
            <div className="space-y-2">
              {(activeTab === 'deposits' ? deposits : withdrawals).map((transaction) => (
                <TransactionCard key={transaction.id} transaction={transaction} />
              ))}
              {/* Duplicate transactions for seamless loop */}
              {(activeTab === 'deposits' ? deposits : withdrawals).map((transaction) => (
                <TransactionCard 
                  key={`${transaction.id}-duplicate`} 
                  transaction={transaction} 
                />
              ))}
            </div>
          </div>
        </div>
        </motion.div>
      </div>
    </section>
  )
}

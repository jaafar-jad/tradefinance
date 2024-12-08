"use client"
import { useState } from 'react'
import { motion } from 'framer-motion'
import { FaWallet, FaCoins, FaQuestionCircle,FaHome,FaCheckCircle, FaArrowLeft, FaBitcoin, FaEthereum, FaDollarSign } from 'react-icons/fa'
import {  SiBinance, SiDogecoin } from 'react-icons/si'
import Link from 'next/link'
import Head from 'next/head'


const cryptoOptions = [
  { value: 'bitcoin', label: 'Bitcoin (BTC)', icon: FaBitcoin },
  { value: 'eth', label: 'Ethereum (ETH)', icon: FaEthereum },
  { value: 'usdt', label: 'USDT', icon: FaDollarSign },
  { value: 'bnb', label: 'BNB', icon: SiBinance },
  { value: 'doge', label: 'Dogecoin', icon: SiDogecoin },
  { value: 'tron', label: 'TRON', icon: FaCoins }
]

const faqItems = [
  {
    question: 'Withdrawing Funds – How Does It Work?',
    answer: 'Our withdrawal process is simple and secure. Select your preferred cryptocurrency, enter the amount and your wallet address, then submit your request.'
  },
  {
    question: 'What Methods Are There For Withdrawal Of Funds?',
    answer: 'We support multiple cryptocurrencies including Bitcoin, Ethereum, USDT, BNB, Dogecoin, and TRON.'
  },
  {
    question: 'Must Withdrawal Requests Only Be Made At Certain Times?',
    answer: 'No, you can make withdrawal requests 24/7. However, processing times may vary depending on network conditions.'
  },
  {
    question: 'Is There A Withdrawal Limit?',
    answer: 'Withdrawal limits vary based on your account level and verification status.'
  },
  {
    question: 'How Long Does It Take To Get My Money?',
    answer: 'Most withdrawals are processed within 24-48 hours after request approval.'
  }
]

export default function WithdrawalPage() {
const [isSubmitted, setIsSubmitted] = useState(false)

  const [formData, setFormData] = useState({
    username: '',
    email: '',
    amount: '',
    coin: '',
    walletAddress: ''
  })
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
  e.preventDefault()
  setLoading(true)
   // Add withdrawal logic here
  await new Promise(resolve => setTimeout(resolve, 1500))
  setLoading(false)
  setIsSubmitted(true)
}


const userString = localStorage.getItem('user');
const user = JSON.parse(userString);

// Add this confirmation view
const renderConfirmation = () => (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="text-center space-y-4 py-4"
    >
      <div className="flex justify-center">
        <FaCheckCircle className="h-16 w-16 text-green-500" />
      </div>
      <h3 className="text-lg font-semibold">Withdrawal Request Submitted!</h3>
      <p className="text-sm text-gray-600">
        Your withdrawal request has been received and will be processed within 24-48 hours.
      </p>
    </motion.div>
  )



  return (
    <>
    <Head>
      <title>Withdraw Funds | Trade Finance Dashboard</title>
      
      {/* Critical Security Headers */}
      <meta name="robots" content="noindex, nofollow" />
      <meta http-equiv="Content-Security-Policy" content="default-src 'self'; frame-ancestors 'none'" />
      <meta http-equiv="X-Frame-Options" content="DENY" />
      
      {/* Prevent Caching */}
      <meta http-equiv="Cache-Control" content="private, no-cache, no-store, must-revalidate" />
      <meta http-equiv="Pragma" content="no-cache" />
      <meta http-equiv="Expires" content="0" />
      
      {/* Additional Security */}
      <meta http-equiv="X-Content-Type-Options" content="nosniff" />
      <meta http-equiv="Referrer-Policy" content="strict-origin-when-cross-origin" />
    </Head>

    <div className=" mx-auto ">
      {/* Header */}
      <div className="bg-gradient-to-r from-red-900 via-red-800 to-black p-2 md:p-4 rounded-lg shadow-lg  mb-4">
        <h1 className="text-2xl md:text-4xl lg:text-5xl font-bold text-white tracking-wide">
          Withdraw Funds
        </h1>
        <p className="text-sm md:text-base text-red-100/80 mt-2">
          Fast and secure withdrawals to your preferred cryptocurrency
        </p>
      </div>


      {isSubmitted ? renderConfirmation() : (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Withdrawal Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl shadow-sm p-4 md:p-6"
        >
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label className="text-xs font-medium text-gray-700">Username</label>
              <input
                type="text"
                required
                className="w-full px-3 py-2 text-sm border rounded-lg focus:ring-1 focus:ring-red-500"
                value={formData.username}
                onChange={(e) => setFormData({...formData, username: e.target.value})}
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-medium text-gray-700">Email</label>
              <input
                type="email"
                required
                className="w-full px-3 py-2 text-sm border rounded-lg focus:ring-1 focus:ring-red-500"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-medium text-gray-700">Amount</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                <input
                  type="number"
                  required
                  className="w-full pl-8 pr-3 py-2 text-sm border rounded-lg focus:ring-1 focus:ring-red-500"
                  value={formData.amount}
                  onChange={(e) => setFormData({...formData, amount: e.target.value})}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-medium text-gray-700">Select Coin</label>
              <select
                required
                className="w-full px-3 py-2 text-sm border rounded-lg focus:ring-1 focus:ring-red-500"
                value={formData.coin}
                onChange={(e) => setFormData({...formData, coin: e.target.value})}
              >
                <option value="">Choose option</option>
                {cryptoOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-medium text-gray-700">Wallet Address</label>
              <input
                type="text"
                required
                className="w-full px-3 py-2 text-sm border rounded-lg focus:ring-1 focus:ring-red-500"
                value={formData.walletAddress}
                onChange={(e) => setFormData({...formData, walletAddress: e.target.value})}
              />
            </div>


            <button
              type="submit"
              disabled={loading}
              className={`
                w-full py-2.5 text-sm  font-medium text-white rounded-lg
                bg-gradient-to-r from-red-600 to-red-800
                hover:from-red-700 hover:to-red-900
                focus:ring-2 focus:ring-red-500 focus:ring-offset-2
                disabled:opacity-70
                flex items-center justify-center space-x-2
              `}
            >
              {loading ? (
                'Processing...'
              ) : (
                <>
                  <FaWallet className="h-4 w-4" />
                  <span>Submit Withdrawal</span>
                </>
              )}
            </button>
          </form>
        </motion.div>

        {/* FAQ Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4"
        >
          <h3 className="text-lg md:text-xl font-semibold text-gray-900 flex items-center space-x-2">
            <FaQuestionCircle className="text-red-600" />
            <span>Withdrawal FAQ</span>
          </h3>

          <div className="space-y-4">
            {faqItems.map((item, index) => (
              <div
                key={index}
                className="bg-white rounded-lg shadow-sm p-4"
              >
                <h4 className="text-sm font-medium text-gray-900 mb-2">
                  {item.question}
                </h4>
                <p className="text-xs text-gray-600">
                  {item.answer}
                </p>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
      )}

      {/* Back Button */}
      <Link
  href={`/dashboard/${user.id}`}
  className="
    inline-flex mt-4 items-center space-x-2
    px-4 py-2 text-sm font-medium text-white rounded-lg
    bg-gradient-to-r from-red-600 to-red-800
    hover:from-red-700 hover:to-red-900
  "
>
  <FaHome className="h-4 w-4" />
  <span>Back to Dashboard</span>
</Link>

    </div>
    </>
  )
}

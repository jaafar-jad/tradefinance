"use client"
import { useState } from 'react'
import { motion } from 'framer-motion'
import { FaUsers, FaCopy, FaLink, FaWhatsapp, FaTelegram, FaTwitter, FaFacebook, FaEnvelope } from 'react-icons/fa'

export default function ReferralPage() {
  const [copied, setCopied] = useState(false)
  const referralLink = "https://trade-finance.org/ref/user123"
  const referralCode = "USER123"

  const referralStats = [
    { label: 'Total Referrals', value: '25' },
    { label: 'Active Referrals', value: '18' },
    { label: 'Total Earnings', value: '$2,500' },
    { label: 'Pending Rewards', value: '$300' }
  ]

  const referralHistory = [
    {
      id: 1,
      username: 'John Doe',
      date: '2024-01-15',
      status: 'Active',
      earnings: 150
    },
    {
      id: 2,
      username: 'Sarah Smith',
      date: '2024-01-14',
      status: 'Active',
      earnings: 200
    },
    {
      id: 3,
      username: 'Mike Johnson',
      date: '2024-01-13',
      status: 'Inactive',
      earnings: 100
    }
  ]

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const shareLinks = [
    {
      name: 'WhatsApp',
      icon: FaWhatsapp,
      color: 'bg-green-500',
      link: `https://wa.me/?text=Join%20me%20on%20Trade%20Finance:%20${referralLink}`
    },
    {
      name: 'Telegram',
      icon: FaTelegram,
      color: 'bg-blue-500',
      link: `https://t.me/share/url?url=${referralLink}&text=Join%20me%20on%20Trade%20Finance`
    },
    {
      name: 'Twitter',
      icon: FaTwitter,
      color: 'bg-sky-500',
      link: `https://twitter.com/intent/tweet?text=Join%20me%20on%20Trade%20Finance:%20${referralLink}`
    },
    {
      name: 'Facebook',
      icon: FaFacebook,
      color: 'bg-blue-600',
      link: `https://www.facebook.com/sharer/sharer.php?u=${referralLink}`
    },
    {
      name: 'Email',
      icon: FaEnvelope,
      color: 'bg-gray-600',
      link: `mailto:?subject=Join%20Trade%20Finance&body=Check%20out%20this%20investment%20platform:%20${referralLink}`
    }
  ]

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-red-900 via-red-800 to-black p-6 md:p-8 rounded-lg shadow-lg text-center mb-8">
        <h1 className="text-xl md:text-3xl font-bold text-white tracking-wide mb-2">
          Referral Program
        </h1>
        <p className="text-sm md:text-base text-red-100/80">
          Earn rewards by inviting your friends
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {referralStats.map((stat, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white rounded-lg shadow-sm p-4"
          >
            <p className="text-xs text-gray-600">{stat.label}</p>
            <p className="text-lg md:text-xl font-bold text-gray-900">{stat.value}</p>
          </motion.div>
        ))}
      </div>

      {/* Referral Link Section */}
      <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
        <h2 className="text-lg font-semibold mb-4">Your Referral Link</h2>
        
        <div className="space-y-4">
          {/* Referral Link */}
          <div className="relative">
            <input
              type="text"
              readOnly
              value={referralLink}
              className="w-full px-4 py-3 text-sm bg-gray-50 rounded-lg"
            />
            <button
              onClick={() => handleCopy(referralLink)}
              className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-red-600 hover:bg-red-50 rounded-md"
            >
              <FaCopy className="h-4 w-4" />
            </button>
          </div>

          {/* Referral Code */}
          <div className="relative">
            <input
              type="text"
              readOnly
              value={referralCode}
              className="w-full px-4 py-3 text-sm bg-gray-50 rounded-lg"
            />
            <button
              onClick={() => handleCopy(referralCode)}
              className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-red-600 hover:bg-red-50 rounded-md"
            >
              <FaCopy className="h-4 w-4" />
            </button>
          </div>

          {copied && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-sm text-green-600"
            >
              Copied to clipboard!
            </motion.div>
          )}
        </div>

        {/* Share Buttons */}
        <div className="mt-6">
          <h3 className="text-sm font-medium mb-3">Share via</h3>
          <div className="flex flex-wrap gap-2">
            {shareLinks.map((platform) => (
              <a
                key={platform.name}
                href={platform.link}
                target="_blank"
                rel="noopener noreferrer"
                className={`
                  inline-flex items-center space-x-2 px-4 py-2
                  text-sm font-medium text-white rounded-lg
                  ${platform.color} hover:opacity-90 transition-opacity
                `}
              >
                <platform.icon className="h-4 w-4" />
                <span>{platform.name}</span>
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* Referral History */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-lg font-semibold mb-4">Referral History</h2>
        <div className="space-y-4">
          {referralHistory.map((referral) => (
            <motion.div
              key={referral.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
            >
              <div className="flex items-center space-x-3">
                <div className="bg-red-100 p-2 rounded-full">
                  <FaUsers className="h-4 w-4 text-red-600" />
                </div>
                <div>
                  <p className="text-sm font-medium">{referral.username}</p>
                  <p className="text-xs text-gray-600">{referral.date}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium">${referral.earnings}</p>
                <p className={`text-xs ${
                  referral.status === 'Active' ? 'text-green-600' : 'text-gray-600'
                }`}>
                  {referral.status}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Referral Terms */}
      <div className="mt-8 bg-red-50 rounded-lg p-4">
        <h3 className="text-sm font-medium text-red-800 mb-2">Referral Program Terms</h3>
        <ul className="text-xs text-red-600 space-y-1">
          <li>• Earn 10% commission on referral deposits</li>
          <li>• Referral must complete KYC verification</li>
          <li>• Minimum withdrawal amount for referral earnings: $50</li>
          <li>• Commission paid instantly on qualified deposits</li>
        </ul>
      </div>
    </div>
  )
}

"use client"

import { useState } from 'react'
import { motion } from 'framer-motion'
import { FaChartLine, FaRocket, FaClock, FaPercent, FaDollarSign, FaShieldAlt, FaChevronRight } from 'react-icons/fa'
import { useRouter } from 'next/navigation'
import { investmentPlans } from '@/config/investmentPlans'
import Head from 'next/head'
  

const allPlans = [
  // Single Plans
  {
    ...investmentPlans.single.starter,
    color: 'from-red-600 to-red-800',
    features: ['Daily Bonus: 0.15%', `Duration: ${investmentPlans.single.starter.duration} months`, 'Instant Withdrawal']
  },
  {
    ...investmentPlans.single.basic,
    color: 'from-red-700 to-red-900',
    features: ['Daily Bonus: 0.20%', `Duration: ${investmentPlans.single.basic.duration} months`, 'Priority Support']
  },
  {
    ...investmentPlans.single.premium,
    color: 'from-red-800 to-black',
    features: ['Daily Bonus: 0.35%', `Duration: ${investmentPlans.single.premium.duration} months`, 'VIP Benefits']
  },
  // joint Plans
  {
    ...investmentPlans.joint.starter,
    color: 'from-red-600 to-red-800',
    features: ['Daily Bonus: 0.20%', `Duration: ${investmentPlans.joint.starter.duration} months`, 'Joint Account Benefits']
  },
  {
    ...investmentPlans.joint.basic,
    color: 'from-red-700 to-red-900',
    features: ['Daily Bonus: 0.25%', `Duration: ${investmentPlans.joint.basic.duration} months`, 'Dedicated Account Manager']
  },
  {
    ...investmentPlans.joint.premium,
    color: 'from-red-800 to-black',
    features: ['Daily Bonus: 0.40%', `Duration: ${investmentPlans.joint.premium.duration} months`, 'Premium joint Benefits']
  }
]

export default function InvestmentActivePlansPage() {
  const [selectedPlan, setSelectedPlan] = useState(null)
  const [amount, setAmount] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleInvest = async (planId) => {
    setLoading(true)
    await new Promise(resolve => setTimeout(resolve, 1500))
    const userString = localStorage.getItem('user')
    const user = JSON.parse(userString)
    router.push(`/dashboard/${user.id}/deposits`)
    setLoading(false)
  }

  return (
    <>
    <Head>
      <title>Investment Plans | Trade Finance</title>
      
      {/* Security Headers */}
      <meta name="robots" content="noindex, nofollow" />
      <meta http-equiv="Content-Security-Policy" content="default-src 'self'; img-src 'self' data:; style-src 'self' 'unsafe-inline'" />
      <meta http-equiv="X-Frame-Options" content="DENY" />
      
      {/* SEO Prevention (since this is a private page) */}
      <meta name="googlebot" content="noindex, nofollow" />
      <meta name="description" content="Private investment plans page" />
      
      {/* Additional Security */}
      <meta http-equiv="X-Content-Type-Options" content="nosniff" />
      <meta http-equiv="Referrer-Policy" content="strict-origin" />
      
      {/* Cache Control */}
      <meta http-equiv="Cache-Control" content="private, no-store" />
    </Head>

    <div className=" mx-auto ">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-red-900 via-red-800 to-black p-4 md:p-8 rounded-lg shadow-lg  mb-4">
        <h1 className="text-2xl md:text-4xl lg:text-5xl font-bold text-white tracking-wide mb-2">
          Investment Plans
        </h1>
        <p className="text-sm md:text-base text-red-100/80">
          Choose the perfect investment plan for your financial goals
        </p>
      </div>

      {/* Investment Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
        {[
          { icon: FaRocket, label: 'ROI', value: '200%' },
          { icon: FaDollarSign, label: 'Min Investment', value: '$500' },
          { icon: FaPercent, label: 'Daily Bonus', value: '0.15-0.40%' },
          { icon: FaClock, label: 'Duration', value: '2-6 Months' }
        ].map((stat, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white rounded-lg shadow-sm p-4"
          >
            <div className="flex items-center space-x-3">
              <stat.icon className="h-8 w-8 text-red-600" />
              <div>
                <p className="text-xs text-gray-600">{stat.label}</p>
                <p className="text-sm md:text-base font-semibold">{stat.value}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Investment Plans */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {allPlans.map((plan, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.2 }}
            className="bg-white rounded-xl shadow-sm overflow-hidden"
          >
            <div className={`bg-gradient-to-r ${plan.color} p-6 text-white`}>
              <h3 className="text-lg md:text-xl font-bold mb-2">{plan.name}</h3>
              <div className="flex items-baseline space-x-1">
                <span className="text-2xl md:text-3xl font-bold">${plan.minAmount}</span>
                <span className="text-sm opacity-80">Minimum</span>
              </div>
            </div>

            <div className="p-6 space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">ROI:</span>
                  <span className="font-medium text-red-600">{plan.roi}%</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Maximum:</span>
                  <span className="font-medium">
                    ${plan.maxAmount === Infinity ? 'Unlimited' : plan.maxAmount.toLocaleString()}
                  </span>
                </div>
              </div>

              <div className="space-y-2">
                {plan.features.map((feature, idx) => (
                  <div key={idx} className="flex items-center text-xs text-gray-600">
                    <FaChevronRight className="h-3 w-3 text-red-600 mr-2" />
                    {feature}
                  </div>
                ))}
              </div>

              <button
                onClick={() => handleInvest(index)}
                disabled={loading}
                className={`
                  w-full py-2.5 text-sm font-medium text-white rounded-lg
                  bg-gradient-to-r ${plan.color}
                  hover:opacity-90 transition-opacity
                  focus:ring-2 focus:ring-red-500 focus:ring-offset-2
                  disabled:opacity-70
                  flex items-center justify-center space-x-2
                `}
              >
                {loading ? 'Processing...' : (
                  <>
                    <FaRocket className="h-4 w-4" />
                    <span>Start Investing</span>
                  </>
                )}
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Security Notice */}
      <div className="mt-8 bg-red-50 rounded-lg p-4 flex items-start space-x-3">
        <FaShieldAlt className="h-5 w-5 text-red-600 mt-0.5" />
        <div>
          <h4 className="text-sm font-medium text-red-800 mb-1">Secure Investment</h4>
          <p className="text-xs text-red-600">
            Your investments are protected by our advanced security protocols and insurance policies.
            We ensure maximum safety for your funds.
          </p>
        </div>
      </div>
    </div>
    </>
  )
}

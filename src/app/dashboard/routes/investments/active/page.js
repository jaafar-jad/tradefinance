"use client"
import { useState } from 'react'
import { motion } from 'framer-motion'
import { FaChartLine, FaRocket, FaClock, FaPercent, FaDollarSign, FaShieldAlt, FaChevronRight } from 'react-icons/fa'

const investmentPlans = [
  {
    id: 1,
    name: 'Starter Plan',
    minAmount: 100,
    maxAmount: 999,
    duration: '24 Hours',
    roi: '2.5% Daily',
    features: ['Instant Withdrawal', '24/7 Support', 'Real-time Analytics'],
    color: 'from-red-600 to-red-800'
  },
  {
    id: 2,
    name: 'Advanced Plan',
    minAmount: 1000,
    maxAmount: 4999,
    duration: '48 Hours',
    roi: '3.5% Daily',
    features: ['Priority Support', 'Investment Insurance', 'Portfolio Management'],
    color: 'from-red-700 to-red-900'
  },
  {
    id: 3,
    name: 'Premium Plan',
    minAmount: 5000,
    maxAmount: 10000,
    duration: '72 Hours',
    roi: '5% Daily',
    features: ['VIP Support', 'Risk Management', 'Dedicated Account Manager'],
    color: 'from-red-800 to-black'
  }
]

export default function InvestmentActivePlansPage() {
  const [selectedPlan, setSelectedPlan] = useState(null)
  const [amount, setAmount] = useState('')
  const [loading, setLoading] = useState(false)

  const handleInvest = async (planId) => {
    setLoading(true)
    // Add investment logic here
    await new Promise(resolve => setTimeout(resolve, 1500))
    setLoading(false)
  }

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-6">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-red-900 via-red-800 to-black p-6 md:p-8 rounded-lg shadow-lg text-center mb-8">
        <h1 className="text-xl md:text-3xl font-bold text-white tracking-wide mb-2">
          Investment Plans
        </h1>
        <p className="text-sm md:text-base text-red-100/80">
          Choose the perfect investment plan for your financial goals
        </p>
      </div>

      {/* Investment Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {[
          { icon: FaRocket, label: 'Active Investors', value: '12,000,000+' },
          { icon: FaDollarSign, label: 'Total Invested', value: '$248M+' },
          { icon: FaPercent, label: 'Avg. ROI', value: '3.5% Daily' },
          { icon: FaClock, label: 'Processing Time', value: '24-72 Hours' }
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
        {investmentPlans.map((plan, index) => (
          <motion.div
            key={plan.id}
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
                  <span className="text-gray-600">Duration:</span>
                  <span className="font-medium">{plan.duration}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">ROI:</span>
                  <span className="font-medium text-red-600">{plan.roi}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Maximum:</span>
                  <span className="font-medium">${plan.maxAmount}</span>
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
                onClick={() => handleInvest(plan.id)}
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
  )
}

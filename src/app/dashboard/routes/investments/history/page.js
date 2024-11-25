"use client"
import { useState } from 'react'
import { motion } from 'framer-motion'
import { FaHistory, FaSearch, FaDownload, FaFilter, FaCircle, FaChevronRight, FaChartLine } from 'react-icons/fa'

const mockInvestments = [
  {
    id: 1,
    plan: 'Premium Plan',
    amount: 5000,
    date: '2024-01-15',
    status: 'Active',
    roi: '5% Daily',
    earned: 750,
    duration: '72 Hours',
    progress: 65
  },
  {
    id: 2,
    plan: 'Starter Plan',
    amount: 500,
    date: '2024-01-10',
    status: 'Completed',
    roi: '2.5% Daily',
    earned: 37.5,
    duration: '24 Hours',
    progress: 100
  },
  {
    id: 3,
    plan: 'Advanced Plan',
    amount: 2500,
    date: '2024-01-08',
    status: 'Completed',
    roi: '3.5% Daily',
    earned: 262.5,
    duration: '48 Hours',
    progress: 100
  },
  {
    id: 4,
    plan: 'Premium Plan',
    amount: 7500,
    date: '2024-01-05',
    status: 'Completed',
    roi: '5% Daily',
    earned: 1125,
    duration: '72 Hours',
    progress: 100
  },
  {
    id: 5,
    plan: 'Advanced Plan',
    amount: 3000,
    date: '2024-01-01',
    status: 'Completed',
    roi: '3.5% Daily',
    earned: 315,
    duration: '48 Hours',
    progress: 100
  }
]

export default function InvestmentHistory() {
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')
  const [sortBy, setSortBy] = useState('date')

  const getStatusColor = (status) => {
    switch(status) {
      case 'Active':
        return 'text-green-500'
      case 'Completed':
        return 'text-blue-500'
      default:
        return 'text-gray-500'
    }
  }

  const filteredInvestments = mockInvestments
    .filter(investment => {
      const matchesSearch = investment.plan.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesFilter = filterStatus === 'all' || investment.status === filterStatus
      return matchesSearch && matchesFilter
    })
    .sort((a, b) => {
      if (sortBy === 'date') {
        return new Date(b.date) - new Date(a.date)
      }
      return b.amount - a.amount
    })

  const totalInvested = mockInvestments.reduce((sum, inv) => sum + inv.amount, 0)
  const totalEarned = mockInvestments.reduce((sum, inv) => sum + inv.earned, 0)

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-red-900 via-red-800 to-black p-6 md:p-8 rounded-lg shadow-lg text-center mb-8">
        <h1 className="text-xl md:text-3xl font-bold text-white tracking-wide mb-2">
          Investment History
        </h1>
        <p className="text-sm md:text-base text-red-100/80">
          Track and manage your investment portfolio
        </p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        {[
          {
            label: 'Total Invested',
            value: `$${totalInvested.toLocaleString()}`,
            icon: FaChartLine
          },
          {
            label: 'Total Earned',
            value: `$${totalEarned.toLocaleString()}`,
            icon: FaHistory
          },
          {
            label: 'Active Investments',
            value: mockInvestments.filter(i => i.status === 'Active').length,
            icon: FaCircle
          }
        ].map((stat, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white rounded-lg shadow-sm p-4"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-600">{stat.label}</p>
                <p className="text-lg md:text-xl font-bold text-gray-900">{stat.value}</p>
              </div>
              <stat.icon className="h-8 w-8 text-red-600" />
            </div>
          </motion.div>
        ))}
      </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative">
            <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search investments..."
              className="w-full pl-10 pr-4 py-2 text-sm border rounded-lg focus:ring-1 focus:ring-red-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <select
            className="w-full px-3 py-2 text-sm border rounded-lg focus:ring-1 focus:ring-red-500"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option value="all">All Status</option>
            <option value="Active">Active</option>
            <option value="Completed">Completed</option>
          </select>

          <select
            className="w-full px-3 py-2 text-sm border rounded-lg focus:ring-1 focus:ring-red-500"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="date">Sort by Date</option>
            <option value="amount">Sort by Amount</option>
          </select>
        </div>
      </div>

      {/* Investments List */}
      <div className="space-y-4">
        {filteredInvestments.map((investment) => (
          <motion.div
            key={investment.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-lg shadow-sm overflow-hidden"
          >
            <div className="p-4 md:p-6">
              <div className="flex flex-col md:flex-row md:items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="bg-red-50 p-2 rounded-lg">
                    <FaChartLine className="h-6 w-6 text-red-600" />
                  </div>
                  <div>
                    <h3 className="text-sm md:text-base font-semibold">{investment.plan}</h3>
                    <p className="text-xs text-gray-600">Invested on {investment.date}</p>
                  </div>
                </div>
                <div className="mt-2 md:mt-0 flex items-center space-x-2">
                  <FaCircle className={`h-2 w-2 ${getStatusColor(investment.status)}`} />
                  <span className="text-xs font-medium">{investment.status}</span>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <p className="text-xs text-gray-600">Amount</p>
                  <p className="text-sm font-semibold">${investment.amount.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-600">ROI</p>
                  <p className="text-sm font-semibold text-red-600">{investment.roi}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-600">Earned</p>
                  <p className="text-sm font-semibold text-green-600">${investment.earned.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-600">Duration</p>
                  <p className="text-sm font-semibold">{investment.duration}</p>
                </div>
              </div>

              {investment.status === 'Active' && (
                <div className="mt-4">
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span>Progress</span>
                    <span>{investment.progress}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-red-600 rounded-full h-2"
                      style={{ width: `${investment.progress}%` }}
                    />
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Export Button */}
      <div className="mt-6 flex justify-end">
        <button
          className="
            inline-flex items-center space-x-2
            px-4 py-2 text-sm font-medium text-white rounded-lg
            bg-gradient-to-r from-red-600 to-red-800
            hover:from-red-700 hover:to-red-900
          "
        >
          <FaDownload className="h-4 w-4" />
          <span>Export History</span>
        </button>
      </div>
    </div>
  )
}

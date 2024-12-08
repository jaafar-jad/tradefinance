"use client"

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { FaHistory, FaSearch, FaDownload, FaFilter, FaCircle, FaChevronRight, FaChartLine } from 'react-icons/fa'
import { client } from '@/lib/contentful'
import { investmentPlans } from '@/config/investmentPlans'
import Head from 'next/head'


  export default function InvestmentHistory({ userId }) {
    const [searchTerm, setSearchTerm] = useState('')
    const [filterStatus, setFilterStatus] = useState('all')
    const [sortBy, setSortBy] = useState('date')
    const [loading, setLoading] = useState(true)
    const [userData, setUserData] = useState(null)
    const [transactions, setTransactions] = useState([])
  
    useEffect(() => {
      const fetchUserData = async () => {
        try {
          const userString = localStorage.getItem("user");
          const user = JSON.parse(userString);
    
          // Enhanced user identification with multiple fields
          const response = await client.getEntries({
            content_type: "userProfile",
            'fields.email': user.email,
            'fields.firstName': user.firstName,
            'fields.lastName': user.lastName,
            'fields.dateOfBirth': user.dateOfBirth,
            include: 3
          });
          
          if (response.items.length > 0) {
            const user = response.items[0]
            setUserData(user.fields)
  
            const transactions = await client.getEntries({
              content_type: 'transaction',
              'fields.user.sys.id': user.sys.id,
              'fields.type': 'DEPOSIT',
              order: '-fields.timestamp'
            })
  
            const formattedTransactions = transactions.items.map((transaction, index) => {
              const plan = user.fields.currentPlan
              const planDetails = getPlanDetails(plan)
              const status = index === 0 ? 'Active' : 'Completed'
              
              return {
                id: transaction.sys.id,
                plan: plan,
                amount: transaction.fields.amount,
                date: new Date(transaction.fields.timestamp).toLocaleDateString(),
                status: status,
                roi: `${planDetails.dailyBonus}% Daily`,
                earned: calculateEarnings(transaction.fields.amount, planDetails),
                duration: `${planDetails.duration} Months`,
                progress: status === 'Active' ? calculateProgress(transaction.fields.timestamp, planDetails.duration) : 100
              }
            })
  
            setTransactions(formattedTransactions)
          }
        } catch (error) {
          console.error('Error fetching data:', error)
        } finally {
          setLoading(false)
        }
      }
  
      fetchUserData()
    }, [userId])

  const getPlanDetails = (planName) => {
    const accountType = planName.toLowerCase().includes('couple') ? 'couple' : 'single'
    const level = planName.toLowerCase().includes('starter') ? 'starter' : 
                 planName.toLowerCase().includes('basic') ? 'basic' : 'premium'
    return investmentPlans[accountType][level]
  }

  const calculateEarnings = (amount, planDetails) => {
    // Main ROI earnings (150%)
    const mainROI = (amount * planDetails.roi) / 100
    
    // Daily bonus accumulated over the duration
    const dailyBonusTotal = (planDetails.dailyBonus * 30 * amount * planDetails.duration) / 100
    
    // Total expected return = Original amount + ROI + Bonus
    return mainROI + dailyBonusTotal
  }
  

  const calculateProgress = (startDate, duration) => {
    const start = new Date(startDate)
    const now = new Date()
    const totalDays = duration * 30
    const daysPassed = Math.floor((now - start) / (1000 * 60 * 60 * 24))
    return Math.min(Math.round((daysPassed / totalDays) * 100), 100)
  }

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

  
  const filteredInvestments = transactions
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

  const totalInvested = transactions.reduce((sum, inv) => sum + inv.amount, 0)
  const totalEarned = transactions.reduce((sum, inv) => sum + inv.earned, 0)

  return (
    <>
    <Head>
      <title>Investment History | Trade Finance</title>
      
      {/* Security Headers */}
      <meta name="robots" content="noindex, nofollow" />
      <meta http-equiv="Content-Security-Policy" content="default-src 'self'; connect-src 'self' https://cdn.contentful.com" />
      <meta http-equiv="X-Frame-Options" content="DENY" />
      
      {/* Cache Control for Real-time Data */}
      <meta http-equiv="Cache-Control" content="private, no-cache, no-store, must-revalidate" />
      <meta http-equiv="Pragma" content="no-cache" />
      <meta http-equiv="Expires" content="0" />
      
      {/* Additional Security */}
      <meta http-equiv="X-Content-Type-Options" content="nosniff" />
      <meta http-equiv="Referrer-Policy" content="strict-origin-when-cross-origin" />
    </Head>

    <div className=" mx-auto">
      {/* Header */}
      <div className="bg-gradient-to-r from-red-900 via-red-800 to-black p-2 md:p-2 rounded-lg shadow-lg  mb-4">
        <h1 className="text-2xl md:text-4xl lg:text-5xl font-bold text-white tracking-wide mb-2">
          Investment History
        </h1>
        <p className="text-sm md:text-base text-red-100/80">
          Track and manage your investment portfolio
        </p>
      </div>
  
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        {[
          {
            label: 'Total Invested',
            value: `$${totalInvested.toLocaleString()}`,
            icon: FaChartLine
          },
          {
            label: 'Projected Earnings',
            value: `$${totalEarned.toLocaleString()}`,
            icon: FaHistory
          },
          {
            label: 'Active Investments',
            value: transactions.filter(i => i.status === 'Active').length,
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
        {loading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto"></div>
            <p className="mt-4 text-gray-600"></p>
          </div>
        ) : filteredInvestments.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-600">No investments found</p>
          </div>
        ) : (
          filteredInvestments.map((investment) => (
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
          ))
        )}
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
    </>
  )
}

"use client"
import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { FaExchangeAlt, FaSearch, FaDownload, FaArrowUp, FaArrowDown } from 'react-icons/fa'
import { client } from '@/lib/contentful'
import Head from 'next/head'

export default function TransactionsPage({ userId }) {
  const [searchTerm, setSearchTerm] = useState('')
  const [filterType, setFilterType] = useState('all')
  const [filterStatus, setFilterStatus] = useState('all')
  const [dateRange, setDateRange] = useState('all')
  const [transactions, setTransactions] = useState([])
  const [stats, setStats] = useState({
    totalDeposits: 0,
    totalWithdrawals: 0,
    totalInvestments: 0,
    totalProfits: 0
  })

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const userString = localStorage.getItem("user");
        const user = JSON.parse(userString);
  
        // Enhanced user identification with multiple fields
        const userResponse = await client.getEntries({
          content_type: "userProfile",
          'fields.email': user.email,
          'fields.firstName': user.firstName,
          'fields.lastName': user.lastName,
          'fields.dateOfBirth': user.dateOfBirth,
          include: 3
        });
  
        if (!userResponse?.items?.length) return;
  
        const userData = userResponse.items[0].fields;
  
        // Fetch transactions with enhanced user reference
        const transactionsResponse = await client.getEntries({
          content_type: 'transaction',
          'fields.user.sys.id': userResponse.items[0].sys.id,
          include: 2
        });
  
        const formattedTransactions = transactionsResponse.items.map(entry => ({
          id: entry.sys.id,
          type: entry.fields.type,
          amount: Number(entry.fields.amount) || 0,
          status: entry.fields.status,
          date: new Date(entry.fields.timestamp).toLocaleString(),
          method: entry.fields.method,
          txId: entry.fields.transactionId,
          description: entry.fields.description
        }))
  
        const totals = formattedTransactions.reduce((acc, tx) => {
          if (tx.status === 'COMPLETED') {
            const amount = Number(tx.amount) || 0
            if (tx.type === 'DEPOSIT') {
              acc.totalDeposits += amount
            }
            if (tx.type === 'WITHDRAWAL') {
              acc.totalWithdrawals += amount
            }
          }
          return acc
        }, {
          totalDeposits: 0,
          totalWithdrawals: 0,
          totalInvestments: 0,
          totalProfits: 0
        })
  
        setTransactions(formattedTransactions)
        setStats(totals)
      } catch (error) {
        console.error('Error fetching transactions:', error)
      }
    }
  
    fetchTransactions()
  }, [userId])
  

  const getStatusColor = (status) => {
    switch(status) {
      case 'COMPLETED':
        return 'text-green-500 bg-green-50'
      case 'PENDING':
        return 'text-yellow-500 bg-yellow-50'
      case 'FAILED':
        return 'text-red-500 bg-red-50'
      default:
        return 'text-gray-500 bg-gray-50'
    }
  }

  const getTypeIcon = (type) => {
    switch(type) {
      case 'DEPOSIT':
        return <FaArrowDown className="text-green-500" />
      case 'WITHDRAWAL':
        return <FaArrowUp className="text-red-500" />
      case 'INVESTMENT':
        return <FaExchangeAlt className="text-blue-500" />
      case 'PROFIT':
        return <FaArrowDown className="text-purple-500" />
      default:
        return <FaExchangeAlt className="text-gray-500" />
    }
  }

  const filteredTransactions = transactions.filter(transaction => {
    const txId = transaction.txId || ''
    const description = transaction.description || ''
    
    const matchesSearch = 
      txId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      description.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesType = filterType === 'all' || transaction.type === filterType
    const matchesStatus = filterStatus === 'all' || transaction.status === filterStatus
    
    if (dateRange !== 'all') {
      const txDate = new Date(transaction.date)
      const now = new Date()
      switch(dateRange) {
        case 'today':
          return txDate.toDateString() === now.toDateString() && matchesSearch && matchesType && matchesStatus
        case 'week':
          const weekAgo = new Date(now.setDate(now.getDate() - 7))
          return txDate >= weekAgo && matchesSearch && matchesType && matchesStatus
        case 'month':
          const monthAgo = new Date(now.setMonth(now.getMonth() - 1))
          return txDate >= monthAgo && matchesSearch && matchesType && matchesStatus
      }
    }
    
    return matchesSearch && matchesType && matchesStatus
  })
  
  const handleExport = () => {
    const csv = [
      ['Date', 'Type', 'Amount', 'Status', 'Method', 'Transaction ID', 'Description'],
      ...filteredTransactions.map(tx => [
        tx.date,
        tx.type,
        tx.amount,
        tx.status,
        tx.method,
        tx.txId,
        tx.description
      ])
    ].map(row => row.join(',')).join('\n')

    const blob = new Blob([csv], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'transactions.csv'
    a.click()
  }
  return (
    <>
<Head>
  <title>Transaction History | Trade Finance Dashboard</title>
  
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
  <meta http-equiv="Referrer-Policy" content="same-origin" />
</Head>

<div className="mx-auto">
  {/* Header - Improved contrast */}
  <div className="bg-gradient-to-r from-red-950 via-red-900 to-black p-2 md:p-4 rounded-lg shadow-lg mb-4">
    <h1 className="text-2xl md:text-4xl lg:text-5xl font-bold text-white tracking-wide mb-2">
      Transaction History
    </h1>
    <p className="text-sm md:text-base text-red-50">
      View and track all your transactions
    </p>
  </div>

  {/* Transaction Stats - Enhanced text contrast */}
  <div className="grid grid-cols-2 md:grid-cols-2 gap-4 mb-4">
    {[
      {
        label: 'Total Deposits',
        value: `$${stats.totalDeposits.toLocaleString()}`,
        icon: FaArrowDown,
        color: 'text-green-700'
      },
      {
        label: 'Total Withdrawals',
        value: `$${stats.totalWithdrawals.toLocaleString()}`,
        icon: FaArrowUp,
        color: 'text-red-700'
      },
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
            <p className="text-xs text-gray-700">{stat.label}</p>
            <p className="text-lg md:text-xl font-bold text-gray-900">{stat.value}</p>
          </div>
          <stat.icon className={`h-8 w-8 ${stat.color}`} />
        </div>
      </motion.div>
    ))}
  </div>

  {/* Filters - Improved text contrast */}
  <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      <div className="relative">
        <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-600" />
        <input
          type="text"
          placeholder="Search transactions..."
          className="w-full pl-10 pr-4 py-2 text-sm border rounded-lg focus:ring-1 focus:ring-red-500 text-gray-900 placeholder-gray-600"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <select
        className="w-full px-3 py-2 text-sm border rounded-lg focus:ring-1 focus:ring-red-500 text-gray-900"
        value={filterType}
        onChange={(e) => setFilterType(e.target.value)}
      >
        <option value="all">All Types</option>
        <option value="DEPOSIT">Deposits</option>
        <option value="WITHDRAWAL">Withdrawals</option>
      </select>

      <select
        className="w-full px-3 py-2 text-sm border rounded-lg focus:ring-1 focus:ring-red-500 text-gray-900"
        value={filterStatus}
        onChange={(e) => setFilterStatus(e.target.value)}
      >
        <option value="all">All Status</option>
        <option value="COMPLETED">Completed</option>
        <option value="PENDING">Pending</option>
        <option value="FAILED">Failed</option>
      </select>

      <select
        className="w-full px-3 py-2 text-sm border rounded-lg focus:ring-1 focus:ring-red-500 text-gray-900"
        value={dateRange}
        onChange={(e) => setDateRange(e.target.value)}
      >
        <option value="all">All Time</option>
        <option value="today">Today</option>
        <option value="week">This Week</option>
        <option value="month">This Month</option>
      </select>
    </div>
  </div>

  {/* Transactions List - Enhanced contrast */}
  <div className="space-y-4">
    {filteredTransactions.map((transaction) => (
      <motion.div
        key={transaction.id}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-lg shadow-sm overflow-hidden"
      >
        <div className="p-4 md:p-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className="bg-gray-100 p-2 rounded-lg">
                {getTypeIcon(transaction.type)}
              </div>
              <div>
                <h3 className="text-sm md:text-base font-semibold text-gray-900">{transaction.type}</h3>
                <p className="text-xs text-gray-700">{transaction.date}</p>
              </div>
            </div>
            <div className="mt-2 md:mt-0">
              <span className={`
                px-2 py-1 rounded-full text-xs font-medium
                ${getStatusColor(transaction.status)}
              `}>
                {transaction.status}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <p className="text-xs text-gray-700">Amount</p>
              <p className="text-sm font-semibold text-gray-900">${transaction.amount.toLocaleString()}</p>
            </div>
            <div>
              <p className="text-xs text-gray-700">Method</p>
              <p className="text-sm font-semibold text-gray-900">{transaction.method}</p>
            </div>
            <div>
              <p className="text-xs text-gray-700">Transaction ID</p>
              <p className="text-sm font-medium text-red-700">{transaction.txId}</p>
            </div>
            <div>
              <p className="text-xs text-gray-700">Description</p>
              <p className="text-sm text-gray-900">{transaction.description}</p>
            </div>
          </div>
        </div>
      </motion.div>
    ))}
  </div>

  {/* Export Button - Enhanced contrast */}
  <div className="mt-6 flex justify-end">
    <button
      onClick={handleExport}
      className="
        inline-flex items-center space-x-2
        px-4 py-2 text-sm font-medium text-white rounded-lg
        bg-gradient-to-r from-red-700 to-red-900
        hover:from-red-800 hover:to-red-950
      "
    >
      <FaDownload className="h-4 w-4" />
      <span>Export Transactions</span>
    </button>
  </div>
</div>
</>

  )
}
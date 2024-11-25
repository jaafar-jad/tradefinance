"use client"
import { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  FaExchangeAlt, 
  FaSearch, 
  FaDownload, 
  FaArrowUp, 
  FaArrowDown,
  FaFilter,
  FaCalendar
} from 'react-icons/fa'

const mockTransactions = [
  {
    id: 1,
    type: 'Deposit',
    amount: 5000,
    status: 'Completed',
    date: '2024-01-15 14:30',
    method: 'Bitcoin',
    txId: '0x1234...5678',
    description: 'Account funding'
  },
  {
    id: 2,
    type: 'Withdrawal',
    amount: 2500,
    status: 'Pending',
    date: '2024-01-14 09:15',
    method: 'Ethereum',
    txId: '0x9876...4321',
    description: 'Withdrawal request'
  },
  {
    id: 3,
    type: 'Investment',
    amount: 3000,
    status: 'Completed',
    date: '2024-01-13 16:45',
    method: 'Platform',
    txId: 'INV123456',
    description: 'Premium Plan Investment'
  },
  {
    id: 4,
    type: 'Profit',
    amount: 450,
    status: 'Completed',
    date: '2024-01-12 11:20',
    method: 'Platform',
    txId: 'PRF789012',
    description: 'Investment returns'
  },
  {
    id: 5,
    type: 'Withdrawal',
    amount: 1000,
    status: 'Completed',
    date: '2024-01-11 13:10',
    method: 'Bitcoin',
    txId: '0x5432...8765',
    description: 'Profit withdrawal'
  }
]

export default function TransactionsPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [filterType, setFilterType] = useState('all')
  const [filterStatus, setFilterStatus] = useState('all')
  const [dateRange, setDateRange] = useState('all')

  const getStatusColor = (status) => {
    switch(status) {
      case 'Completed':
        return 'text-green-500 bg-green-50'
      case 'Pending':
        return 'text-yellow-500 bg-yellow-50'
      case 'Failed':
        return 'text-red-500 bg-red-50'
      default:
        return 'text-gray-500 bg-gray-50'
    }
  }

  const getTypeIcon = (type) => {
    switch(type) {
      case 'Deposit':
        return <FaArrowDown className="text-green-500" />
      case 'Withdrawal':
        return <FaArrowUp className="text-red-500" />
      case 'Investment':
        return <FaExchangeAlt className="text-blue-500" />
      case 'Profit':
        return <FaArrowDown className="text-purple-500" />
      default:
        return <FaExchangeAlt className="text-gray-500" />
    }
  }

  const filteredTransactions = mockTransactions.filter(transaction => {
    const matchesSearch = 
      transaction.txId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesType = filterType === 'all' || transaction.type === filterType
    const matchesStatus = filterStatus === 'all' || transaction.status === filterStatus
    return matchesSearch && matchesType && matchesStatus
  })

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-red-900 via-red-800 to-black p-6 md:p-8 rounded-lg shadow-lg text-center mb-8">
        <h1 className="text-xl md:text-3xl font-bold text-white tracking-wide mb-2">
          Transaction History
        </h1>
        <p className="text-sm md:text-base text-red-100/80">
          View and track all your transactions
        </p>
      </div>

      {/* Transaction Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {[
          {
            label: 'Total Deposits',
            value: '$8,000',
            icon: FaArrowDown,
            color: 'text-green-500'
          },
          {
            label: 'Total Withdrawals',
            value: '$3,500',
            icon: FaArrowUp,
            color: 'text-red-500'
          },
          {
            label: 'Total Investments',
            value: '$3,000',
            icon: FaExchangeAlt,
            color: 'text-blue-500'
          },
          {
            label: 'Total Profits',
            value: '$450',
            icon: FaArrowDown,
            color: 'text-purple-500'
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
                <p className="text-lg md:text-xl font-bold">{stat.value}</p>
              </div>
              <stat.icon className={`h-8 w-8 ${stat.color}`} />
            </div>
          </motion.div>
        ))}
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="relative">
            <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search transactions..."
              className="w-full pl-10 pr-4 py-2 text-sm border rounded-lg focus:ring-1 focus:ring-red-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <select
            className="w-full px-3 py-2 text-sm border rounded-lg focus:ring-1 focus:ring-red-500"
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
          >
            <option value="all">All Types</option>
            <option value="Deposit">Deposits</option>
            <option value="Withdrawal">Withdrawals</option>
            <option value="Investment">Investments</option>
            <option value="Profit">Profits</option>
          </select>

          <select
            className="w-full px-3 py-2 text-sm border rounded-lg focus:ring-1 focus:ring-red-500"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option value="all">All Status</option>
            <option value="Completed">Completed</option>
            <option value="Pending">Pending</option>
            <option value="Failed">Failed</option>
          </select>

          <select
            className="w-full px-3 py-2 text-sm border rounded-lg focus:ring-1 focus:ring-red-500"
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

      {/* Transactions List */}
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
                  <div className="bg-gray-50 p-2 rounded-lg">
                    {getTypeIcon(transaction.type)}
                  </div>
                  <div>
                    <h3 className="text-sm md:text-base font-semibold">{transaction.type}</h3>
                    <p className="text-xs text-gray-600">{transaction.date}</p>
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
                  <p className="text-xs text-gray-600">Amount</p>
                  <p className="text-sm font-semibold">${transaction.amount.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-600">Method</p>
                  <p className="text-sm font-semibold">{transaction.method}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-600">Transaction ID</p>
                  <p className="text-sm font-medium text-red-600">{transaction.txId}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-600">Description</p>
                  <p className="text-sm">{transaction.description}</p>
                </div>
              </div>
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
          <span>Export Transactions</span>
        </button>
      </div>
    </div>
  )
}

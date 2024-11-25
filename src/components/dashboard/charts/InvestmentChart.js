"use client"
import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { FaChartLine, FaArrowUp, FaArrowDown, FaCalendarAlt, FaChartBar } from 'react-icons/fa'
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from 'recharts'

const calculateReturns = (initialAmount, roi, days) => {
  return Array.from({ length: days }, (_, index) => ({
    day: `Day ${index + 1}`,
    amount: initialAmount * (1 + (roi / 100 / 365) * (index + 1)),
    profit: (initialAmount * (1 + (roi / 100 / 365) * (index + 1))) - initialAmount,
    roi: ((initialAmount * (1 + (roi / 100 / 365) * (index + 1))) - initialAmount) / initialAmount * 100
  }))
}

export default function InvestmentChart() {
  const [timeframe, setTimeframe] = useState('30')
  const [initialInvestment, setInitialInvestment] = useState(1000)
  const [annualRoi, setAnnualRoi] = useState(120) // 120% annual ROI
  const [chartData, setChartData] = useState([])
  const [chartType, setChartType] = useState('area')

  useEffect(() => {
    const data = calculateReturns(initialInvestment, annualRoi, parseInt(timeframe))
    setChartData(data)
  }, [timeframe, initialInvestment, annualRoi])

  const renderChart = () => {
    switch(chartType) {
      case 'area':
        return (
          <AreaChart data={chartData}>
            <defs>
              <linearGradient id="investmentGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#DC2626" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="#DC2626" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="2 2" stroke="#f0f0f0" />
            <XAxis dataKey="day" tick={{ fontSize: 10 }} />
            <YAxis tick={{ fontSize: 10 }} />
            <Tooltip 
              contentStyle={{ fontSize: '0.75rem' }}
              formatter={(value) => `$${value.toFixed(2)}`}
            />
            <Area 
              type="monotone" 
              dataKey="amount" 
              stroke="#DC2626" 
              fill="url(#investmentGradient)"
            />
          </AreaChart>
        )
      case 'bar':
        return (
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="2 2" stroke="#f0f0f0" />
            <XAxis dataKey="day" tick={{ fontSize: 10 }} />
            <YAxis tick={{ fontSize: 10 }} />
            <Tooltip 
              contentStyle={{ fontSize: '0.75rem' }}
              formatter={(value) => `$${value.toFixed(2)}`}
            />
            <Bar dataKey="profit" fill="#DC2626" />
          </BarChart>
        )
      default:
        return null
    }
  }

  return (
    <div className="bg-white rounded-lg shadow-sm p-3 md:p-4">
      <div className="space-y-4">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between space-y-2 md:space-y-0">
          <h2 className="text-sm md:text-base font-semibold text-gray-900">Investment Performance</h2>
          <div className="flex items-center space-x-2 text-xs md:text-sm">
            <button 
              onClick={() => setChartType('area')}
              className={`p-1.5 rounded ${chartType === 'area' ? 'bg-red-50 text-red-600' : 'text-gray-500'}`}
            >
              <FaChartLine className="h-3.5 w-3.5" />
            </button>
            <button 
              onClick={() => setChartType('bar')}
              className={`p-1.5 rounded ${chartType === 'bar' ? 'bg-red-50 text-red-600' : 'text-gray-500'}`}
            >
              <FaChartBar className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>

        {/* Controls */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2 md:gap-4">
          <div>
            <label className="block text-xs text-gray-600 mb-1">Initial Investment</label>
            <input
              type="number"
              value={initialInvestment}
              onChange={(e) => setInitialInvestment(Number(e.target.value))}
              className="w-full text-xs md:text-sm p-1.5 border rounded focus:ring-1 focus:ring-red-500"
            />
          </div>
          <div>
            <label className="block text-xs text-gray-600 mb-1">Annual ROI (%)</label>
            <input
              type="number"
              value={annualRoi}
              onChange={(e) => setAnnualRoi(Number(e.target.value))}
              className="w-full text-xs md:text-sm p-1.5 border rounded focus:ring-1 focus:ring-red-500"
            />
          </div>
          <div>
            <label className="block text-xs text-gray-600 mb-1">Timeframe (Days)</label>
            <select
              value={timeframe}
              onChange={(e) => setTimeframe(e.target.value)}
              className="w-full text-xs md:text-sm p-1.5 border rounded focus:ring-1 focus:ring-red-500"
            >
              <option value="7">7 Days</option>
              <option value="30">30 Days</option>
              <option value="90">90 Days</option>
              <option value="180">180 Days</option>
              <option value="365">365 Days</option>
            </select>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-4">
          {[
            { label: 'Current Value', value: chartData[chartData.length - 1]?.amount || 0 },
            { label: 'Total Profit', value: chartData[chartData.length - 1]?.profit || 0 },
            { label: 'ROI', value: chartData[chartData.length - 1]?.roi || 0, isPercentage: true },
            { label: 'Daily Avg', value: (chartData[chartData.length - 1]?.profit / parseInt(timeframe)) || 0 }
          ].map((stat, index) => (
            <div key={index} className="bg-gray-50 p-2 rounded">
              <p className="text-[0.65rem] text-gray-500">{stat.label}</p>
              <p className="text-sm md:text-base font-semibold text-gray-900">
                {stat.isPercentage ? 
                  `${stat.value.toFixed(2)}%` : 
                  `$${stat.value.toFixed(2)}`
                }
              </p>
            </div>
          ))}
        </div>

        {/* Chart */}
        <div className="h-[200px] md:h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            {renderChart()}
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  )
}

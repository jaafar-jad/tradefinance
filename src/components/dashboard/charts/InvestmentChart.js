"use client"
import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { FaChartLine, FaChartBar } from 'react-icons/fa'
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { client } from '@/lib/contentful'
import { investmentPlans } from "@/config/investmentPlans"

const calculateReturns = (investment, startDate, planDetails, days) => {
  const now = new Date()
  const start = new Date(startDate)
  const dailyROI = (planDetails.roi / (planDetails.duration * 30)) / 100
  const dailyBonus = planDetails.dailyBonus / 100
  const totalDailyRate = dailyROI + dailyBonus

  return Array.from({ length: days }, (_, index) => {
    const dayAmount = investment * (1 + totalDailyRate * (index + 1))
    const dayProfit = dayAmount - investment
    return {
      day: `Day ${index + 1}`,
      amount: dayAmount,
      profit: dayProfit,
      roi: (dayProfit / investment) * 100
    }
  })
}

export default function InvestmentChart({ userId }) {
  const [timeframe, setTimeframe] = useState('30')
  const [chartData, setChartData] = useState([])
  const [chartType, setChartType] = useState('area')
  const [userData, setUserData] = useState(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userString = localStorage.getItem("user");
        const user = JSON.parse(userString);
  
        // Using multiple fields for stronger identification
        const userResponse = await client.getEntries({
          content_type: "userProfile",
          'fields.email': user.email,
          'fields.firstName': user.firstName,
          'fields.lastName': user.lastName,
          'fields.dateOfBirth': user.dateOfBirth,
          include: 3
        });
  

        if (!userResponse?.items?.length) return

        const userData = userResponse.items[0].fields

        // Fetch transactions
        const transactionsResponse = await client.getEntries({
          content_type: 'transaction',
          'fields.user.sys.id': userResponse.items[0].sys.id,
          include: 2
        })

        const transactions = transactionsResponse.items.map(entry => ({
          type: entry.fields.type,
          amount: entry.fields.amount,
          status: entry.fields.status,
          timestamp: entry.fields.timestamp
        }))

        // Calculate total investment from completed deposits
        const totalInvestment = transactions
          .filter(tx => tx.status === 'COMPLETED' && tx.type === 'DEPOSIT')
          .reduce((sum, tx) => sum + tx.amount, 0)

        const startDate = userData.startDate
        const planType = userData.currentPlan.toLowerCase()
                        .replace(' plan', '')
                        .replace('couple ', '')
        const accountType = userData.accountType
        const planDetails = investmentPlans[accountType][planType]

        // Calculate returns based on user's actual investment and plan
        const data = calculateReturns(
          totalInvestment,
          startDate,
          planDetails,
          parseInt(timeframe)
        )

        setChartData(data)
        setUserData({ ...userData, totalInvestment })
      } catch (error) {
        console.error('Error fetching data:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [userId, timeframe])

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

  if (isLoading) return <div></div>

  return (
    <div className="bg-white rounded-lg shadow-sm p-3 md:p-4">
      <div className="space-y-4">
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

        <div className="grid grid-cols-1 md:grid-cols-3 gap-2 md:gap-4">
          <div>
            <label className="block text-xs text-gray-600 mb-1">Your Investment</label>
            <div className="w-full text-xs md:text-sm p-1.5 border rounded bg-gray-50">
              ${userData?.totalInvestment?.toFixed(2)}
            </div>
          </div>
          <div>
            <label className="block text-xs text-gray-600 mb-1">Plan ROI</label>
            <div className="w-full text-xs md:text-sm p-1.5 border rounded bg-gray-50">
              {investmentPlans[userData?.accountType][userData?.currentPlan.toLowerCase().replace(' plan', '').replace('couple ', '')].roi}%
            </div>
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
              <option value="60">60 Days</option>
              <option value="90">90 Days</option>
              <option value="120">120 Days</option>
              <option value="150">150 Days</option>
              <option value="180">180 Days</option>
              <option value="210">210 Days</option>
              <option value="240">240 Days</option>
              <option value="270">270 Days</option>
              <option value="300">300 Days</option>
              <option value="330">330 Days</option>
              <option value="360">360 Days</option>
              <option value="365">365 Days</option>
            </select>
          </div>
        </div>

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

        <div className="h-[200px] md:h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            {renderChart()}
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  )
}


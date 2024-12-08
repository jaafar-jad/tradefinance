"use client"
import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { FaChartPie, FaDollarSign, FaPercent, FaArrowUp, FaArrowDown } from 'react-icons/fa'
import { LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts'
import { client } from '@/lib/contentful'
import { investmentPlans } from "@/config/investmentPlans"

const COLORS = ['#DC2626', '#991B1B', '#7F1D1D', '#450A0A']

export default function ProfitChart({ userId }) {
  const [profitData, setProfitData] = useState([])
  const [distributionData, setDistributionData] = useState([])
  const [selectedPeriod, setSelectedPeriod] = useState('week')
  const [totalProfit, setTotalProfit] = useState(0)
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
        const startDate = new Date(userData.startDate)
        const planType = userData.currentPlan.toLowerCase()
                        .replace(' plan', '')
                        .replace('couple ', '')
        const accountType = userData.accountType
        const planDetails = investmentPlans[accountType][planType]

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
          timestamp: new Date(entry.fields.timestamp)
        }))

        // Calculate profits based on period
        const calculatePeriodData = () => {
          const periods = {
            week: 7,
            month: 30,
            year: 12
          }

          const periodLength = periods[selectedPeriod]
          const dailyROI = (planDetails.roi / (planDetails.duration * 30)) / 100
          const dailyBonus = planDetails.dailyBonus / 100

          const totalInvestment = transactions
            .filter(tx => tx.status === 'COMPLETED' && tx.type === 'DEPOSIT')
            .reduce((sum, tx) => sum + tx.amount, 0)

          const data = Array.from({ length: periodLength }, (_, index) => {
            const dayProfit = totalInvestment * (dailyROI + dailyBonus)
            const tradingProfit = dayProfit * 0.75
            const stakingReward = dayProfit * 0.15
            const referralBonus = dayProfit * 0.10

            return {
              period: selectedPeriod === 'year' ? `Month ${index + 1}` : `Day ${index + 1}`,
              totalProfit: dayProfit,
              tradingProfit,
              stakingReward,
              referralBonus
            }
          })

          return data
        }

        const profitData = calculatePeriodData()
        setProfitData(profitData)
        setTotalProfit(profitData.reduce((acc, curr) => acc + curr.totalProfit, 0))

        setDistributionData([
          { name: 'Trading', value: 75 },
          { name: 'Staking', value: 15 },
          { name: 'General', value: 10 }
        ])

      } catch (error) {
        console.error('Error fetching data:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [userId, selectedPeriod])

  const ProfitCard = ({ title, amount, percentage, icon: Icon }) => (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gradient-to-br from-red-600 to-red-800 p-2 rounded-lg"
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-[0.65rem] text-white/80">{title}</p>
          <h3 className="text-sm md:text-base font-bold text-white">${amount.toLocaleString()}</h3>
        </div>
        <Icon className="h-4 w-4 text-white/80" />
      </div>
      <div className="mt-2 flex items-center">
        <span className="text-[0.65rem] text-white flex items-center">
          {percentage >= 0 ? <FaArrowUp className="mr-1 h-2.5 w-2.5" /> : <FaArrowDown className="mr-1 h-2.5 w-2.5" />}
          {Math.abs(percentage)}%
        </span>
      </div>
    </motion.div>
  )

  if (isLoading) return <div></div>
  return (
    <div className="bg-white rounded-lg shadow-sm p-3 md:p-4">
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h2 className="text-sm md:text-base font-semibold">Profit Analysis</h2>
          <select
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
            className="text-xs md:text-sm p-1 border rounded focus:ring-1 focus:ring-red-500"
          >
            <option value="week">Weekly</option>
            <option value="month">Monthly</option>
            <option value="year">Yearly</option>
          </select>
        </div>

        {/* Profit Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          <ProfitCard
            title="Total Profit"
            amount={totalProfit}
            percentage={8.5}
            icon={FaDollarSign}
          />
          <ProfitCard
            title="Trading Profit"
            amount={totalProfit * 0.75}
            percentage={12.3}
            icon={FaChartPie}
          />
          <ProfitCard
            title="Staking Rewards"
            amount={totalProfit * 0.15}
            percentage={5.7}
            icon={FaPercent}
          />
          <ProfitCard
            title="General  Bonus"
            amount={totalProfit * 0.10}
            percentage={3.2}
            icon={FaArrowUp}
          />
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Line Chart */}
          <div className="h-[200px] md:h-[250px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={profitData}>
                <CartesianGrid strokeDasharray="2 2" stroke="#f0f0f0" />
                <XAxis dataKey="period" tick={{ fontSize: 10 }} />
                <YAxis tick={{ fontSize: 10 }} />
                <Tooltip
                  contentStyle={{ fontSize: '0.75rem' }}
                  formatter={(value) => `$${value.toFixed(2)}`}
                />
                <Line
                  type="monotone"
                  dataKey="totalProfit"
                  stroke="#DC2626"
                  strokeWidth={2}
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Pie Chart */}
          <div className="h-[200px] md:h-[250px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={distributionData}
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {distributionData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ fontSize: '0.75rem' }}
                  formatter={(value) => `${value}%`}
                />
                <Legend
                  verticalAlign="bottom"
                  height={36}
                  content={({ payload }) => (
                    <div className="flex justify-center space-x-4">
                      {payload.map((entry, index) => (
                        <div key={`legend-${index}`} className="flex items-center">
                          <div
                            className="w-2 h-2 rounded-full mr-1"
                            style={{ backgroundColor: entry.color }}
                          />
                          <span className="text-xs text-gray-600">{entry.value}</span>
                        </div>
                      ))}
                    </div>
                  )}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  )
}

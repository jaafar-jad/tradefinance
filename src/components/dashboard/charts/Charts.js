"use client"
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FaChartLine, FaChartBar, FaChartPie } from 'react-icons/fa'
import BalanceCharts from './BalanceChart'
import InvestmentCharts from './InvestmentChart'
import ProfitCharts from './ProfitChart'

export default function Charts() {
  const [activeChart, setActiveChart] = useState('balance')

  const chartButtons = [
    {
      id: 'balance',
      label: 'Balance',
      icon: FaChartLine,
    },
    {
      id: 'investment',
      label: 'Investment',
      icon: FaChartBar,
    },
    {
      id: 'profit',
      label: 'Profit',
      icon: FaChartPie,
    }
  ]

  const renderChart = () => {
    switch(activeChart) {
      case 'balance':
        return <BalanceCharts />
      case 'investment':
        return <InvestmentCharts />
      case 'profit':
        return <ProfitCharts />
      default:
        return <BalanceCharts />
    }
  }

  return (
    <div className="space-y-2 md:space-y-2 ">
      {/* Chart Toggle Buttons */}
      <div className="grid grid-cols-3 gap-2 md:gap-4 bg-gradient-to-r from-red-900 via-red-800 to-red-900 p-2 rounded-lg">
  {chartButtons.map((button) => (
    <button
      key={button.id}
      onClick={() => setActiveChart(button.id)}
      className={`
        flex items-center justify-center space-x-1.5 
        w-full px-3 py-2 md:px-4 md:py-3
        rounded-md text-xs md:text-sm font-medium
        transition-all duration-200 ease-in-out
        ${activeChart === button.id 
          ? 'bg-white text-red-600 shadow-lg' 
          : 'bg-red-800/40 text-white hover:bg-red-700/50'
        }
      `}
    >
      <button.icon className="h-3.5 w-3.5 md:h-4 md:w-4" />
      <span>{button.label}</span>
    </button>
  ))}
</div>


      {/* Chart Display Area */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeChart}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
        >
          {renderChart()}
        </motion.div>
      </AnimatePresence>
    </div>
  )
}

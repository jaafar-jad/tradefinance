'use client'
import { useState } from 'react'
import { motion } from 'framer-motion'
import { FaBitcoin, FaEthereum } from 'react-icons/fa'
import { SiLitecoin, SiDogecoin, SiRipple } from 'react-icons/si'
import { HiArrowsRightLeft } from 'react-icons/hi2'

const cryptoOptions = [
  { name: 'Bitcoin', icon: FaBitcoin, symbol: 'BTC', rate: 45000 },
  { name: 'Litecoin', icon: SiLitecoin, symbol: 'LTC', rate: 180 },
  { name: 'Ripple', icon: SiRipple, symbol: 'XRP', rate: 0.92 },
  { name: 'Dogecoin', icon: SiDogecoin, symbol: 'DOGE', rate: 0.24 }
]

export default function RightSidebar({ onClose }) {
  const [fromCrypto, setFromCrypto] = useState('BTC')
  const [toCrypto, setToCrypto] = useState('USD')
  const [amount, setAmount] = useState('')


  return (
    <div className="h-screen w-80 bg-gradient-to-b from-red-900 via-black to-red-900 text-white p-6 overflow-y-auto">
     
     <button 
        onClick={onClose}
        className="lg:hidden absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-red-600 hover:bg-red-700 transition-colors"
      >
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          className="h-5 w-5" 
          viewBox="0 0 20 20" 
          fill="currentColor"
        >
          <path 
            fillRule="evenodd" 
            d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" 
            clipRule="evenodd" 
          />
        </svg>
      </button>
     
      <div className="space-y-6 ">
        <h2 className="text-xl mt-2 font-bold">Quick Conversion</h2>
        {/* Conversion Form */}
        <div className="space-y-4">
        <h2 className="text-xl font-bold hidden md:block">Quick Conversion</h2>

          <div className="space-y-2">
            <label className="text-sm">From</label>
            <select 
              className="w-full bg-black/30 border border-red-500/30 rounded-lg p-2"
              value={fromCrypto}
              onChange={(e) => setFromCrypto(e.target.value)}
            >
              {cryptoOptions.map((crypto) => (
                <option key={crypto.symbol} value={crypto.symbol}>
                  {crypto.name}
                </option>
              ))}
            </select>
          </div>

          <div className="flex justify-center">
            <HiArrowsRightLeft className="text-red-500 text-xl" />
          </div>

          <div className="space-y-2">
            <label className="text-sm">To</label>
            <select 
              className="w-full bg-black/30 border border-red-500/30 rounded-lg p-2"
              value={toCrypto}
              onChange={(e) => setToCrypto(e.target.value)}
            >
              <option value="USD">USD</option>
              {cryptoOptions.map((crypto) => (
                <option key={crypto.symbol} value={crypto.symbol}>
                  {crypto.name}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-sm">Amount</label>
            <input
              type="number"
              className="w-full bg-black/30 border border-red-500/30 rounded-lg p-2"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="Enter amount"
            />
          </div>

          <button className="w-full bg-gradient-to-r from-red-600 to-red-700 py-2 rounded-lg font-semibold hover:from-red-700 hover:to-red-800 transition-all">
            Transfer Now
          </button>
        </div>

        {/* Profile Completion */}
        <div className="space-y-4">
          <h3 className="font-semibold">Profile Completion</h3>
          <div className="w-full bg-black/30 rounded-full h-2">
            <div className="bg-red-500 h-2 rounded-full w-[65%]" />
          </div>
          <p className="text-sm text-red-400">65% Complete</p>
        </div>

        {/* Status Items */}
        <div className="space-y-4">
          {[
            { title: 'Connect Wallet Address', subtitle: 'You have connected 2 accounts', completed: true },
            { title: 'Verify Account', subtitle: 'Account information verified', completed: true },
            { title: 'Deposit Money', subtitle: 'You can deposit from your account', completed: false }
          ].map((item, index) => (
            <div key={index} className="flex items-center space-x-3">
              <div className={`w-4 h-4 rounded-full ${item.completed ? 'bg-green-500' : 'bg-gray-500'}`} />
              <div>
                <p className="font-medium">{item.title}</p>
                <p className="text-sm text-gray-400">{item.subtitle}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

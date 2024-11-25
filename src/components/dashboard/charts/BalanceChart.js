"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  FaBitcoin,
  FaEthereum,
  FaChartLine,
  FaWallet,
  FaHistory,
  FaArrowUp,
  FaArrowDown,
} from "react-icons/fa";
import { SiRipple, SiLitecoin, SiDogecoin } from "react-icons/si";
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const cryptoData = [
  {
    name: "Bitcoin",
    symbol: "BTC",
    icon: FaBitcoin,
    value: 2.34,
    change: "+5.2%",
    color: "from-orange-400 to-orange-600",
  },
  {
    name: "Ripple",
    symbol: "RPX",
    icon: SiRipple,
    value: 1.55,
    change: "+3.1%",
    color: "from-blue-400 to-blue-600",
  },
  {
    name: "Ethereum",
    symbol: "ETH",
    icon: FaEthereum,
    value: 1.12,
    change: "+4.5%",
    color: "from-purple-400 to-purple-600",
  },
  {
    name: "Litecoin",
    symbol: "LTC",
    icon: SiLitecoin,
    value: 1.22,
    change: "+2.8%",
    color: "from-gray-400 to-gray-600",
  },
  {
    name: "Dogecoin",
    symbol: "DGC",
    icon: SiDogecoin,
    value: 1.02,
    change: "+1.9%",
    color: "from-yellow-400 to-yellow-600",
  },
  {
    name: "Newcoin",
    symbol: "NCN",
    icon: SiRipple,
    value: 1.02,
    change: "+2.9%",
    color: "from-yellow-400 to-yellow-600",
  },
];

const dailyEarningsData = Array.from({ length: 30 }, (_, i) => ({
  day: `Day ${i + 1}`,
  earnings: Math.random() * 100,
  profit: Math.random() * 50,
}));

export default function BalanceCharts() {
  const [totalBalance, setTotalBalance] = useState(10200);
  const [profitBalance, setProfitBalance] = useState(1080);
  const [selectedTimeframe, setSelectedTimeframe] = useState("1W");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => setIsLoading(false), 1000);
  }, []);

  const BalanceCard = ({ title, amount, icon: Icon, color, percentage }) => (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`bg-white rounded-lg md:rounded-2xl shadow md:shadow-xl overflow-hidden`}
    >
      <div className={`bg-gradient-to-r ${color} p-2 md:p-4`}>
        <div className="flex justify-between items-center">
          <div>
            <p className="text-[0.55rem] md:text-sm text-white/80">{title}</p>
            <h3 className="text-xs md:text-2xl font-bold text-white">
              ${amount.toLocaleString()}
            </h3>
          </div>
          <Icon className="text-base md:text-3xl text-white" />
        </div>
        <div className="mt-2 md:mt-4 flex items-center">
          <span
            className={`text-[0.5rem] md:text-sm ${
              percentage > 0 ? "text-green-300" : "text-red-300"
            } flex items-center`}
          >
            {percentage > 0 ? (
              <FaArrowUp className="w-2 h-2 md:w-3 md:h-3 mr-0.5 md:mr-1" />
            ) : (
              <FaArrowDown className="w-2 h-2 md:w-3 md:h-3 mr-0.5 md:mr-1" />
            )}
            {Math.abs(percentage)}%
          </span>
          <span className="text-[0.5rem] md:text-sm text-white/80 ml-1 md:ml-2">
            vs last week
          </span>
        </div>
      </div>
    </motion.div>
  );

  return (
    <div className="p-2 space-y-3">
      {/* Main Balance Cards */}
      <div className="grid grid-cols-3 md:grid-cols-3 gap-2">
        <BalanceCard
          title="Main Balance"
          amount={totalBalance}
          icon={FaWallet}
          color="from-red-600 to-red-800"
          percentage={8.2}
        />
        <BalanceCard
          title="Profit Balance"
          amount={profitBalance}
          icon={FaChartLine}
          color="from-red-800 to-black"
          percentage={5.4}
        />
        <BalanceCard
          title="Total Earnings"
          amount={totalBalance + profitBalance}
          icon={FaHistory}
          color="from-black to-red-900"
          percentage={6.8}
        />
      </div>

      {/* Charts Section */}
      <div className="grid md:grid-cols-2 gap-2">
        {/* Earnings Chart */}
        <motion.div
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white p-2 rounded-lg shadow"
        >
          <h3 className="text-[0.65rem] md:text-xs font-semibold mb-1">
            Earnings Overview
          </h3>
          <div className="h-[150px] md:h-[200px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={dailyEarningsData}>
                <defs>
                  <linearGradient id="earnings" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#DC2626" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#DC2626" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="2 2" stroke="#f0f0f0" />
                <XAxis dataKey="day" tick={{ fontSize: 8 }} />
                <YAxis tick={{ fontSize: 8 }} />
                <Tooltip contentStyle={{ fontSize: "0.65rem" }} />
                <Area
                  type="monotone"
                  dataKey="earnings"
                  stroke="#DC2626"
                  fillOpacity={1}
                  fill="url(#earnings)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Profit Distribution */}
        <motion.div
          initial={{ opacity: 0, x: 10 }}
          animate={{ opacity: 1, x: 0 }}
          className="hidden md:block bg-white p-2 rounded-lg shadow"
        >
          <h3 className="text-[0.65rem] md:text-xs font-semibold mb-1">
            Profit Distribution
          </h3>
          <div className="h-[150px] md:h-[200px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={dailyEarningsData}>
                <CartesianGrid strokeDasharray="2 2" stroke="#f0f0f0" />
                <XAxis dataKey="day" tick={{ fontSize: 8 }} />
                <YAxis tick={{ fontSize: 8 }} />
                <Tooltip contentStyle={{ fontSize: "0.65rem" }} />
                <Bar dataKey="profit" fill="#DC2626" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
        <motion.div
        initial={{ opacity: 0, x: 10 }}
        animate={{ opacity: 1, x: 0 }}
        className="md:hidden  bg-white p-2 rounded-lg shadow"
      >
        <h3 className="text-[0.65rem] md:text-xs font-semibold mb-1">
          Profit Distribution
        </h3>
        <div className="h-[150px] md:h-[200px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={dailyEarningsData}>
              <CartesianGrid strokeDasharray="2 2" stroke="#f0f0f0" />
              <XAxis dataKey="day" tick={{ fontSize: 8 }} />
              <YAxis tick={{ fontSize: 8 }} />
              <Tooltip contentStyle={{ fontSize: "0.65rem" }} />
              <Bar dataKey="profit" fill="#DC2626" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </motion.div>
      </div>

      {/* Crypto Assets */}
      <div className="grid grid-cols-3 md:grid-cols-6 gap-2">
        {cryptoData.map((crypto, index) => (
          <motion.div
            key={crypto.symbol}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className="bg-white rounded-md shadow p-2"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-1">
                <crypto.icon className="text-base" />
                <div>
                  <h4 className="text-[0.65rem] font-medium">{crypto.name}</h4>
                  <p className="text-[0.6rem] text-gray-500">{crypto.symbol}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-[0.65rem] font-semibold">{crypto.value}</p>
                <p
                  className={`text-[0.6rem] ${
                    crypto.change.startsWith("+")
                      ? "text-green-500"
                      : "text-red-500"
                  }`}
                >
                  {crypto.change}
                </p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
      
    </div>
  );
}

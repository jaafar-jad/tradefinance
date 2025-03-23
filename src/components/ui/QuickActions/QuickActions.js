"use client";

import Link from 'next/link';
import { motion } from 'framer-motion';
import { FaChartLine, FaHistory, FaWallet, FaMoneyBillWave, FaExchangeAlt, FaUsers, FaCog, FaArrowRight } from 'react-icons/fa';

const navigation = (userId) => [
  { 
    name: 'Deposits', 
    href: `/dashboard/${userId}/deposits`,
    icon: FaWallet,
    description: 'Add funds to your account',
    color: 'bg-gradient-to-br from-green-400 to-emerald-600',
  },
  { 
    name: 'Withdrawals', 
    href: `/dashboard/${userId}/withdrawals`,
    icon: FaMoneyBillWave,
    description: 'Withdraw your earnings',
    color: 'bg-gradient-to-br from-amber-400 to-orange-600',
  },
  { 
    name: 'History', 
    href: `/dashboard/${userId}/investments/history`,
    icon: FaHistory,
    description: 'View your investment history',
    color: 'bg-gradient-to-br from-blue-400 to-indigo-600',
  },
  { 
    name: 'Transactions', 
    href: `/dashboard/${userId}/transactions`,
    icon: FaExchangeAlt,
    description: 'Track all your transactions',
    color: 'bg-gradient-to-br from-purple-400 to-violet-600',
  },
  { 
    name: 'Referrals', 
    href: `/dashboard/${userId}/referrals/list`,
    icon: FaUsers,
    description: 'Manage your referral network',
    color: 'bg-gradient-to-br from-pink-400 to-rose-600',
  },
  { 
    name: 'Plans', 
    href: `/dashboard/${userId}/investments/active`,
    icon: FaChartLine,
    description: 'View your active investments',
    color: 'bg-gradient-to-br from-red-400 to-red-600',
  },
  { 
    name: 'Settings', 
    href: `/dashboard/${userId}/profile/settings/profile`,
    icon: FaCog,
    description: 'Manage your account settings',
    color: 'bg-gradient-to-br from-gray-400 to-gray-600',
  },
];

const QuickActions = ({ userId }) => {
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { 
      opacity: 1, 
      y: 0,
      transition: {
        type: "spring",
        stiffness: 200,
        damping: 20
      }
    }
  };

  return (
    <div className="w-full p-6 bg-white dark:bg-gray-900 rounded-2xl shadow-xl">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white">
          Quick Actions
        </h2>
        <Link href={`/dashboard/${userId}`} className="text-sm font-medium text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 flex items-center">
          Dashboard <FaArrowRight className="ml-1" />
        </Link>
      </div>
      
      <div className="overflow-x-auto scrollbar-hide">
        <motion.div 
          variants={container}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
        >
          {navigation(userId).map((navItem) => (
            <motion.div 
              key={navItem.name} 
              variants={item}
              whileHover={{ 
                scale: 1.03,
                boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)"
              }}
              className="relative"
            >
              <Link href={navItem.href} className="block h-full">
                <div className="flex items-center p-5 rounded-xl bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 shadow-sm h-full">
                  <div className={`w-12 h-12 flex items-center justify-center rounded-lg ${navItem.color} shadow-lg mr-4 flex-shrink-0`}>
                    <navItem.icon className="text-white text-lg" />
                  </div>
                  
                  <div className="flex-1">
                    <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-1">
                      {navItem.name}
                    </h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {navItem.description}
                    </p>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
};

export default QuickActions;

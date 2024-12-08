"use client";
import Link from 'next/link';
import { motion } from 'framer-motion';
import { FaChartLine, FaHistory, FaWallet, FaMoneyBillWave, FaExchangeAlt, FaUsers, FaCog } from 'react-icons/fa';

const navigation = (userId) => [
  { 
    name: 'Deposits', 
    href: `/dashboard/${userId}/deposits`,
    icon: FaWallet,
   
  },
  { 
    name: 'Withdrawals', 
    href: `/dashboard/${userId}/withdrawals`,
    icon: FaMoneyBillWave,

  },
 
  { 
    name: 'History', 
    href: `/dashboard/${userId}/investments/history`,
    icon: FaHistory,
    
  },
  { 
    name: 'Transactions', 
    href: `/dashboard/${userId}/transactions`,
    icon: FaExchangeAlt,
  },
  { 
    name: 'Referrals', 
    href: `/dashboard/${userId}/referrals/list`,
    icon: FaUsers,

  },
  { 
    name: 'Plans', 
    href: `/dashboard/${userId}/investments/active`,
    icon: FaChartLine,
  
  },
  { 
    name: 'Settings', 
    href: `/dashboard/${userId}/profile/settings/profile`,
    icon: FaCog,

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
    show: { opacity: 1, y: 0 }
  };

  return (
    <div className="w-full px-4 py-6 bg-gradient-to-br from-black via-red-950 to-black rounded-2xl shadow-xl">
      <div className="overflow-x-auto scrollbar-hide pb-4">
        <motion.div 
          variants={container}
          initial="hidden"
          animate="show"
          className="flex gap-3 min-w-max"
        >
          {navigation(userId).map((item) => (
            <motion.div 
              key={item.name} 
              variants={item}
              className="relative group w-[150px]"
            >
              <Link href={item.href}>
                <div className="flex flex-col items-center p-4 rounded-xl bg-gradient-to-br from-red-900/50 via-black/50 to-red-950/50 border border-red-800/20 backdrop-blur-sm hover:backdrop-blur-lg transition-all duration-300 group-hover:scale-105 group-hover:shadow-2xl group-hover:shadow-red-500/20">
                  <div className="relative mb-3">
                    <div className="absolute inset-0 bg-red-500/20 blur-xl rounded-full group-hover:bg-red-500/30 transition-all duration-300" />
                    <item.icon className="relative text-2xl md:text-3xl text-white group-hover:text-red-400 transition-colors duration-300" />
                  </div>
                  
                  <span className="text-xs md:text-sm font-medium text-white/90 text-center group-hover:text-white transition-colors duration-300 mb-2">
                    {item.name}
                  </span>
                 
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


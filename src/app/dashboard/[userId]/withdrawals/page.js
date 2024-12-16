"use client";

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaLock, FaUnlock, FaExclamationTriangle, FaArrowRight, FaBitcoin, FaEthereum, FaWallet, FaInfoCircle, FaCheckCircle } from 'react-icons/fa';
import { SiBinance, SiDogecoin, SiTether } from 'react-icons/si';
import Link from 'next/link';
import Head from 'next/head';
import BalanceCharts from '@/components/dashboard/charts/BalanceChart';
import { client } from '@/lib/contentful';
import { investmentPlans } from '@/config/investmentPlans';
import { useParams } from 'next/navigation';
const calculateRealTimeBalances = (investment, startDate, planDetails) => {
  const now = new Date();
  const start = new Date(startDate);
  const planEndDate = new Date(start.getTime() + planDetails.duration * 30 * 24 * 60 * 60 * 1000);

  if (now > planEndDate) {
    return {
      mainBalance: (investment * (1 + planDetails.roi / 100)).toFixed(2),
      dailyEarning: 0,
      dailyBonus: 0,
      totalEarnings: (investment * (planDetails.roi / 100)).toFixed(2),
      weeklyPercentage: 0,
      isComplete: true,
    };
  }

  const millisecondsPassed = now - start;
  const secondsPassed = millisecondsPassed / 1000;
  const dailyROI = planDetails.roi / (planDetails.duration * 30) / 100;
  const secondlyROI = dailyROI / (24 * 60 * 60);
  const dailyBonusRate = planDetails.dailyBonus / 100;
  const secondlyBonus = dailyBonusRate / (24 * 60 * 60);
  const roiEarnings = investment * secondlyROI * secondsPassed;
  const bonusEarnings = investment * secondlyBonus * secondsPassed;
  const totalEarnings = roiEarnings + bonusEarnings;

  return {
    mainBalance: (investment + totalEarnings).toFixed(2),
    dailyEarning: (investment * dailyROI).toFixed(2),
    dailyBonus: (investment * dailyBonusRate).toFixed(2),
    totalEarnings: totalEarnings.toFixed(2),
    weeklyPercentage: ((dailyROI + dailyBonusRate) * 7 * 100).toFixed(2),
    isComplete: false,
  };
};

const withdrawalRules = [
  {
    title: "Regular Withdrawal",
    description: "Available after investment plan duration is complete",
    icon: FaCheckCircle
  },
  {
    title: "Early Withdrawal - 50%",
    description: "Pay 5% fee to unlock 50% of current balance",
    icon: FaUnlock
  },
  {
    title: "Early Termination",
    description: "Pay 10% fee to withdraw entire balance and close investment",
    icon: FaLock
  }
];

const cryptoOptions = [
  { value: 'bitcoin', label: 'Bitcoin (BTC)', icon: FaBitcoin },
  { value: 'ethereum', label: 'Ethereum (ETH)', icon: FaEthereum },
  { value: 'usdt', label: 'USDT', icon: SiTether },
  { value: 'bnb', label: 'BNB', icon: SiBinance },
  { value: 'doge', label: 'Dogecoin', icon: SiDogecoin }
];

export default function WithdrawalPage() {
  const [currentBalance, setCurrentBalance] = useState(0);
  const [unlockFee, setUnlockFee] = useState(0);
  const [terminationFee, setTerminationFee] = useState(0);
  const [daysRemaining, setDaysRemaining] = useState(0);
  const [isPlanComplete, setIsPlanComplete] = useState(false);
  const [selectedOption, setSelectedOption] = useState(null);
  const [withdrawalForm, setWithdrawalForm] = useState({
    amount: '',
    crypto: '',
    walletAddress: ''
  });
  const [loading, setLoading] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [userData, setUserData] = useState(null);
  const params = useParams();

  useEffect(() => {
    const fetchBalanceData = async () => {
      try {
        const userString = localStorage.getItem("user");
        if (!userString) return;
        
        const user = JSON.parse(userString);
        
        const userResponse = await client.getEntries({
          content_type: "userProfile",
          'fields.email': user.email,
          include: 3,
        });

        if (!userResponse?.items?.length) return;
        
        const userData = userResponse.items[0].fields;
        setUserData(userData);
        
        const planType = userData.currentPlan.toLowerCase().replace(" plan", "").replace("couple ", "");
        const accountType = userData.accountType;
        const planDetails = investmentPlans[accountType][planType];

        const transactionsResponse = await client.getEntries({
          content_type: "transaction",
          "fields.user.sys.id": userResponse.items[0].sys.id,
          include: 2,
        });

        const transactions = transactionsResponse.items
          .filter(entry => entry.fields.status === "COMPLETED")
          .map(entry => ({
            type: entry.fields.type,
            amount: entry.fields.amount,
          }));

        const totalInvestment = transactions
          .filter(tx => tx.type === "DEPOSIT")
          .reduce((sum, tx) => sum + tx.amount, 0);

        const balances = calculateRealTimeBalances(
          totalInvestment,
          userData.startDate,
          planDetails
        );

        setCurrentBalance(parseFloat(balances.mainBalance));
        setUnlockFee(parseFloat(balances.mainBalance) * 0.05);
        setTerminationFee(parseFloat(balances.mainBalance) * 0.10);

        const now = new Date();
        const startDate = new Date(userData.startDate);
        const planEndDate = new Date(startDate.getTime() + planDetails.duration * 30 * 24 * 60 * 60 * 1000);
        const daysLeft = Math.max(0, Math.ceil((planEndDate - now) / (1000 * 60 * 60 * 24)));
        setDaysRemaining(daysLeft);
        setIsPlanComplete(now >= planEndDate);

        const updateInterval = setInterval(() => {
          const newBalances = calculateRealTimeBalances(
            totalInvestment,
            userData.startDate,
            planDetails
          );
          
          setCurrentBalance(parseFloat(newBalances.mainBalance));
          setUnlockFee(parseFloat(newBalances.mainBalance) * 0.05);
          setTerminationFee(parseFloat(newBalances.mainBalance) * 0.10);
          
          if (newBalances.isComplete) {
            clearInterval(updateInterval);
          }
        }, 1000);

        return () => clearInterval(updateInterval);

      } catch (error) {
        console.error("Error fetching balance data:", error);
      }
    };

    fetchBalanceData();
  }, []);

  const handleWithdrawalSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const withdrawal = {
        fields: {
          type: "WITHDRAWAL",
          amount: parseFloat(withdrawalForm.amount),
          status: "PENDING",
          timestamp: new Date().toISOString(),
          user: { sys: { id: userData.sys.id } },
          crypto: withdrawalForm.crypto,
          walletAddress: withdrawalForm.walletAddress
        }
      };

      await client.createEntry("transaction", withdrawal);
      setShowConfirmation(true);
    } catch (error) {
      console.error("Withdrawal error:", error);
    } finally {
      setLoading(false);
    }
  };
  const renderWithdrawalRules = () => (
    <div className="bg-gradient-to-br from-red-50 to-white p-6 rounded-xl shadow-xl">
      <h3 className="text-xl font-bold text-gray-900 mb-4">Withdrawal Rules</h3>
      <div className="grid gap-4">
        {withdrawalRules.map((rule, index) => (
          <div key={index} className="flex items-start space-x-3 p-4 bg-white rounded-lg shadow">
            <rule.icon className="text-red-600 text-xl flex-shrink-0 mt-1" />
            <div>
              <h4 className="font-semibold text-gray-900">{rule.title}</h4>
              <p className="text-sm text-gray-800">{rule.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
  
  const renderWithdrawalForm = () => (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="bg-white p-6 rounded-xl shadow-xl"
    >
      <h3 className="text-xl font-bold text-gray-900 mb-4">
        {isPlanComplete ? 'Regular Withdrawal' : 'Early Withdrawal'}
      </h3>
      
      <form onSubmit={handleWithdrawalSubmit} className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-bold text-gray-900">Amount ($)</label>
          <input
            type="number"
            required
            className="w-full px-3 py-2 text-base font-semibold border rounded-lg focus:ring-2 focus:ring-red-500"
            value={withdrawalForm.amount}
            onChange={(e) => setWithdrawalForm({...withdrawalForm, amount: e.target.value})}
          />
        </div>
  
        <div className="space-y-2">
          <label className="text-sm font-bold text-gray-900">Select Cryptocurrency</label>
          <select
            required
            className="w-full px-3 py-2 text-base font-semibold border rounded-lg focus:ring-2 focus:ring-red-500"
            value={withdrawalForm.crypto}
            onChange={(e) => setWithdrawalForm({...withdrawalForm, crypto: e.target.value})}
          >
            <option value="">Choose option</option>
            {cryptoOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
  
        <div className="space-y-2">
          <label className="text-sm font-bold text-gray-900">Wallet Address</label>
          <input
            type="text"
            required
            className="w-full px-3 py-2 text-base font-semibold border rounded-lg focus:ring-2 focus:ring-red-500"
            value={withdrawalForm.walletAddress}
            onChange={(e) => setWithdrawalForm({...withdrawalForm, walletAddress: e.target.value})}
          />
        </div>
  
        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 text-base font-bold text-white rounded-lg bg-gradient-to-r from-red-600 to-red-800 hover:from-red-700 hover:to-red-900 focus:ring-2 focus:ring-red-500 disabled:opacity-70"
        >
          {loading ? "Processing..." : "Submit Withdrawal"}
        </button>
      </form>
    </motion.div>
  );
  
  const renderEarlyWithdrawalOptions = () => (
    <div className="grid md:grid-cols-2 gap-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-br from-red-50 to-white p-6 rounded-xl shadow-xl border-2 border-red-100"
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold text-gray-900">Partial Withdrawal</h3>
          <FaUnlock className="text-2xl text-red-600" />
        </div>
  
        <div className="space-y-3 text-gray-900">
          <p className="font-medium">
            Unlock Fee (5%): <span className="font-bold text-red-600">${unlockFee.toLocaleString()}</span>
          </p>
          <p className="font-medium">
            Available (50%): <span className="font-bold text-green-600">${(currentBalance * 0.5).toLocaleString()}</span>
          </p>
        </div>
  
        <Link
  href={`/dashboard/${params.userId}/deposits?amount=${unlockFee}&purpose=unlock`}
  className="mt-6 block w-full py-3 text-center font-bold text-white rounded-lg bg-gradient-to-r from-red-600 to-red-800 hover:from-red-700 hover:to-red-900"
>
  Pay Unlock Fee
</Link>


      </motion.div>
  
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-br from-red-50 to-white p-6 rounded-xl shadow-xl border-2 border-red-100"
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold text-gray-900">Full Termination</h3>
          <FaLock className="text-2xl text-red-800" />
        </div>
  
        <div className="space-y-3 text-gray-900">
          <p className="font-medium">
            Termination Fee (10%): <span className="font-bold text-red-600">${terminationFee.toLocaleString()}</span>
          </p>
          <p className="font-medium">
            Available (100%): <span className="font-bold text-green-600">${currentBalance.toLocaleString()}</span>
          </p>
        </div>
  
        <Link
          href={`/dashboard/${params.userId}/deposits?amount=${terminationFee}&purpose=termination`}
          className="mt-6 block w-full py-3 text-center font-bold text-white rounded-lg bg-gradient-to-r from-red-600 to-red-800 hover:from-red-700 hover:to-red-900"
        >
          Pay Termination Fee
        </Link>
      </motion.div>
    </div>
  );
  
  return (
    <>
      <Head>
        <title>Withdraw Funds | Investment Platform</title>
        <meta name="description" content="Secure withdrawal system for your investments" />
      </Head>
  
      <div className=" mx-auto p-2 space-y-2">
        <div className="bg-gradient-to-r from-red-900 via-red-800 to-black p-6 rounded-xl shadow-xl">
          <h1 className="text-3xl font-bold text-white mb-2">Withdraw Funds</h1>
          <p className="text-red-100 font-medium">
            {isPlanComplete 
              ? "Your investment plan is complete - full withdrawal available" 
              : `${daysRemaining} days remaining until regular withdrawal`}
          </p>
        </div>
  
        
  
        {renderWithdrawalRules()}
  
        {isPlanComplete ? (
          renderWithdrawalForm()
        ) : (
          <>
            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-r-xl">
              <div className="flex items-center">
                <FaExclamationTriangle className="text-yellow-400 text-xl mr-3" />
                <p className="text-gray-900 font-semibold">
                  Early withdrawal requires additional fees
                </p>
              </div>
            </div>
            {renderEarlyWithdrawalOptions()}
          </>
        )}
  
        <AnimatePresence>
          {showConfirmation && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 flex items-center justify-center p-4"
            >
              <motion.div
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0.9 }}
                className="bg-white p-6 rounded-xl shadow-xl max-w-md w-full"
              >
                <FaCheckCircle className="text-green-500 text-4xl mx-auto mb-4" />
                <h3 className="text-xl font-bold text-center text-gray-900 mb-2">
                  Withdrawal Request Submitted
                </h3>
                <p className="text-center text-gray-800 mb-4">
                  Your withdrawal request has been received and will be processed within 24 hours.
                </p>
                <button
                  onClick={() => setShowConfirmation(false)}
                  className="w-full py-2 text-white font-bold rounded-lg bg-gradient-to-r from-red-600 to-red-800"
                >
                  Close
                </button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
}

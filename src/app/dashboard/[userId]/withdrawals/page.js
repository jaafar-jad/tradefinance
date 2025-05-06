"use client";
import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaLock, FaUnlock, FaExclamationTriangle, FaArrowRight, FaBitcoin, FaEthereum, FaWallet, FaInfoCircle, FaCheckCircle } from 'react-icons/fa';
import { SiBinance, SiDogecoin, SiTether } from 'react-icons/si';
import Link from 'next/link';
import Head from 'next/head';
import { client } from '@/lib/contentful';
import { investmentPlans } from '@/config/investmentPlans';
import { useParams } from 'next/navigation';

// Import the calculation functions from BalanceChart or redefine them here
const calculateRealTimeBalances = (
  investment,
  startDate,
  planDetails,
  accountStatus = "Active",
  lastSuspensionDate = null,
  totalSuspendedDays = 0,
  bonusDays = 0
) => {
  // Use current timestamp for real-time calculations
  const now = new Date();
  const start = new Date(startDate);
  // Calculate calendar days since account started
  const calendarDays = Math.floor((now - start) / (1000 * 60 * 60 * 24));
  // Add milliseconds for real-time updates
  const millisecondsPassed = now - start;
  const dayFraction =
    millisecondsPassed / (1000 * 60 * 60 * 24) -
    Math.floor(millisecondsPassed / (1000 * 60 * 60 * 24));

  // For suspended accounts, calculate up to suspension date
  if (accountStatus === "Suspended" && lastSuspensionDate) {
    const suspensionDate = new Date(lastSuspensionDate);
    const daysUntilSuspension = Math.floor(
      (suspensionDate - start) / (1000 * 60 * 60 * 24)
    );
    // Keep original suspension logic but add bonus days
    const activeDays = daysUntilSuspension - totalSuspendedDays + bonusDays;
    // Calculate earnings based on active days only
    const dailyROI = planDetails.roi / (planDetails.duration * 30) / 100;
    const dailyBonusRate = planDetails.dailyBonus / 100;
    const totalDailyRate = dailyROI + dailyBonusRate;
    const earnings = investment * totalDailyRate * activeDays;
    const weeklyPercentage = (dailyROI + dailyBonusRate) * 7 * 100;
    return {
      mainBalance: (investment + earnings).toFixed(2),
      dailyEarning: (investment * dailyROI).toFixed(2),
      dailyBonus: (investment * dailyBonusRate).toFixed(2),
      totalEarnings: earnings.toFixed(2),
      weeklyPercentage: weeklyPercentage.toFixed(2),
      isSuspended: true,
    };
  }

  // For active accounts, subtract suspended days but add bonus days
  const activeDays =
    calendarDays - totalSuspendedDays + bonusDays + dayFraction;

  // Check if plan has ended based on active days
  if (activeDays >= planDetails.duration * 30) {
    return {
      mainBalance: (investment * (1 + planDetails.roi / 100)).toFixed(2),
      dailyEarning: 0,
      dailyBonus: 0,
      totalEarnings: (investment * (planDetails.roi / 100)).toFixed(2),
      weeklyPercentage: 0,
      isComplete: true,
    };
  }

  // Regular calculation for active accounts with real-time updates
  const dailyROI = planDetails.roi / (planDetails.duration * 30) / 100;
  const dailyBonusRate = planDetails.dailyBonus / 100;
  const totalDailyRate = dailyROI + dailyBonusRate;
  const earnings = investment * totalDailyRate * activeDays;
  const weeklyPercentage = (dailyROI + dailyBonusRate) * 7 * 100;

  return {
    mainBalance: (investment + earnings).toFixed(2),
    dailyEarning: (investment * dailyROI).toFixed(2),
    dailyBonus: (investment * dailyBonusRate).toFixed(2),
    totalEarnings: earnings.toFixed(2),
    weeklyPercentage: weeklyPercentage.toFixed(2),
    isComplete: false,
  };
};

const calculatePlanDates = (
  startDate,
  planDuration,
  totalSuspendedDays = 0,
  bonusDays = 0
) => {
  const start = new Date(startDate);
  const today = new Date();
  const calendarDays = Math.floor((today - start) / (1000 * 60 * 60 * 24));
  // Subtract suspended days but add bonus days
  const activeDays = Math.max(0, calendarDays - totalSuspendedDays + bonusDays);
  // Adjust end date to account for both suspended days and bonus days
  const adjustedEndDate = new Date(
    start.getTime() +
      (planDuration * 30 + totalSuspendedDays - bonusDays) * 24 * 60 * 60 * 1000
  );
  const totalDays = planDuration * 30;
  const daysRemaining = Math.max(0, totalDays - activeDays);
  return {
    startDate: start.toLocaleDateString(),
    endDate: adjustedEndDate.toLocaleDateString(),
    currentDay: activeDays,
    totalDays,
    daysRemaining,
    progress: Math.min(100, (activeDays / totalDays) * 100),
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
    description: "Pay 20% fee to unlock 50% of current balance",
    icon: FaUnlock
  },
  {
    title: "Early Termination",
    description: "Pay 40% fee to withdraw entire balance and close investment",
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
  const [accountStatus, setAccountStatus] = useState("Active");
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
        
        const userFields = userResponse.items[0].fields;
        // Store the complete user data including sys.id
        setUserData({
          ...userFields,
          sys: {
            id: userResponse.items[0].sys.id
          }
        });
        setAccountStatus(userFields.accountStatus || "Active");
        
        // Add error handling for plan type extraction
        let planType = "";
        try {
          planType = userFields.currentPlan.toLowerCase().replace(" plan", "").replace("joint ", "");
        } catch (err) {
          console.error("Error processing plan type:", err);
          return; // Exit if we can't process the plan type
        }
        
        const accountType = userFields.accountType || "individual"; // Default to individual if not specified
        
        // Check if the plan exists before trying to access it
        if (!investmentPlans[accountType] || !investmentPlans[accountType][planType]) {
          console.error(`Plan not found: accountType=${accountType}, planType=${planType}`);
          return; // Exit if plan doesn't exist
        }
        
        const planDetails = investmentPlans[accountType][planType];
        // Get suspension data and bonus days
        const totalSuspendedDays = userFields.totalSuspendedDays || 0;
        const bonusDays = userFields.bonusDays || 0;
        const lastSuspensionDate = userFields.lastSuspensionDate || null;

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

        // Use the updated calculation function
        const balances = calculateRealTimeBalances(
          totalInvestment,
          userFields.startDate,
          planDetails,
          userFields.accountStatus,
          lastSuspensionDate,
          totalSuspendedDays,
          bonusDays
        );

        setCurrentBalance(parseFloat(balances.mainBalance));
        
        // Updated fee calculations
        const partialAmount = parseFloat(balances.mainBalance) * 0.5;
        setUnlockFee(partialAmount * 0.2); // 20% of the 50% available
        setTerminationFee(parseFloat(balances.mainBalance) * 0.4); // 40% of total balance

        // Calculate plan dates with suspended and bonus days
        const planDates = calculatePlanDates(
          userFields.startDate,
          planDetails.duration,
          totalSuspendedDays,
          bonusDays
        );
        
        setDaysRemaining(planDates.daysRemaining);
        setIsPlanComplete(planDates.daysRemaining === 0 || balances.isComplete);

        // Set up real-time balance updates
        const updateInterval = setInterval(() => {
          const newBalances = calculateRealTimeBalances(
            totalInvestment,
            userFields.startDate,
            planDetails,
            userFields.accountStatus,
            lastSuspensionDate,
            totalSuspendedDays,
            bonusDays
          );
          
          setCurrentBalance(parseFloat(newBalances.mainBalance));
          
          // Update fees with new calculations
          const newPartialAmount = parseFloat(newBalances.mainBalance) * 0.5;
          setUnlockFee(newPartialAmount * 0.2);
          setTerminationFee(parseFloat(newBalances.mainBalance) * 0.4);
          
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
      // Validate that userData exists and has the necessary properties
      if (!userData || !userData.sys || !userData.sys.id) {
        throw new Error("User data is not properly loaded");
      }
      
      const withdrawal = {
        fields: {
          type: "WITHDRAWAL",
          amount: parseFloat(withdrawalForm.amount),
          status: "PENDING",
          timestamp: new Date().toISOString(),
          user: { 
            sys: { 
              type: "Link",
              linkType: "Entry",
              id: userData.sys.id 
            } 
          },
          crypto: withdrawalForm.crypto,
          walletAddress: withdrawalForm.walletAddress
        }
      };
      
      await client.createEntry("transaction", withdrawal);
      setShowConfirmation(true);
    } catch (error) {
      console.error("Withdrawal error:", error);
      alert("There was an error processing your withdrawal. Please try again.");
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
            Available (50%): <span className="font-bold text-green-600">${(currentBalance * 0.5).toLocaleString()}</span>
          </p>
          <p className="font-medium">
            Unlock Fee (20%): <span className="font-bold text-red-600">${unlockFee.toLocaleString()}</span>
          </p>
          <p className="font-medium">
            You Receive: <span className="font-bold text-blue-600">${((currentBalance * 0.5) - unlockFee).toLocaleString()}</span>
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
            Available (100%): <span className="font-bold text-green-600">${currentBalance.toLocaleString()}</span>
          </p>
          <p className="font-medium">
            Termination Fee (40%): <span className="font-bold text-red-600">${terminationFee.toLocaleString()}</span>
          </p>
          <p className="font-medium">
            You Receive: <span className="font-bold text-blue-600">${(currentBalance - terminationFee).toLocaleString()}</span>
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
  
  // Add a suspended account message
  const renderSuspendedMessage = () => (
    <div className="bg-red-50 border-l-4 border-red-500 p-6 rounded-xl shadow-xl">
      <div className="flex items-start space-x-3">
        <FaExclamationTriangle className="text-red-600 text-xl flex-shrink-0 mt-1" />
        <div>
          <h3 className="text-xl font-bold text-red-700 mb-2">Account Suspended</h3>
          <p className="text-red-600 mb-4">
            {userData?.suspensionReason ||
              "Your account is currently suspended. Withdrawals are not available until your account is reactivated."}
          </p>
          <p className="text-sm text-red-500">
            Please contact customer support for assistance.
          </p>
        </div>
      </div>
    </div>
  );

  return (
    <>
      <Head>
        <title>Withdraw Funds | Investment Platform</title>
        <meta name="description" content="Secure withdrawal system for your investments" />
      </Head>
      <div className="mx-auto p-2 space-y-2">
        <div className="bg-gradient-to-r from-red-900 via-red-800 to-black p-6 rounded-xl shadow-xl">
          <h1 className="text-3xl font-bold text-white mb-2">Withdraw Funds</h1>
          <p className="text-red-100 font-medium">
            {accountStatus === "Suspended" ? (
              "Account suspended - withdrawals unavailable"
            ) : isPlanComplete ? (
              "Your investment plan is complete - full withdrawal available"
            ) : (
              `${daysRemaining} days remaining until regular withdrawal`
            )}
          </p>
        </div>
        {renderWithdrawalRules()}
        {accountStatus === "Suspended" ? (
          renderSuspendedMessage()
        ) : isPlanComplete ? (
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
              className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
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

"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaBitcoin,
  FaEthereum,
  FaChartLine,
  FaWallet,
  FaHistory,
  FaArrowUp,
  FaExclamationTriangle,
} from "react-icons/fa";
import { SiRipple, SiLitecoin, SiDogecoin, SiNear } from "react-icons/si";
import {
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
import { client } from "@/lib/contentful";
import { investmentPlans } from "@/config/investmentPlans";

// --- Helper Functions ---

export const calculatePlanDates = (
  startDate,
  planDuration,
  totalSuspendedDays = 0,
  bonusDays = 0
) => {
  const start = new Date(startDate);
  const today = new Date();

  const calendarDays = Math.floor((today - start) / (1000 * 60 * 60 * 24));

  const activeDays = Math.max(0, calendarDays - totalSuspendedDays + bonusDays);

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

export const generateDailyStats = (
  deposits,
  planDetails,
  totalSuspendedDays = 0
) => {
  if (!deposits || deposits.length === 0) return [];

  const stats = [];
  const totalDays = planDetails.duration * 30;
  const dailyROI = planDetails.roi / totalDays / 100;
  const dailyBonusRate = planDetails.dailyBonus / 100;
  const totalDailyRate = dailyROI + dailyBonusRate;

  for (let day = 1; day <= totalDays; day++) {
    const dayData = {
      day: `Day ${day}`,
      earnings: 0,
      balance: 0,
    };

    deposits.forEach((deposit) => {
      const start = new Date(deposit.timestamp);
      const daysSinceDeposit = Math.floor(
        (new Date(start.getTime() + day * 24 * 60 * 60 * 1000) - start) /
          (1000 * 60 * 60 * 24)
      );

      const earnings = deposit.amount * totalDailyRate * daysSinceDeposit;
      const balance = deposit.amount + earnings;

      dayData.earnings += Math.max(0, earnings);
      dayData.balance += Math.max(0, balance);
    });

    stats.push(dayData);
  }

  return stats;
};

// --- Sliding Notification Component ---

const SlidingNotification = ({ notification }) => {
  if (!notification) return null;

  const fullMessage = notification;

  const marqueeVariants = {
    animate: {
      x: ["0%", "-100%"],
      transition: {
        x: {
          repeat: Infinity,
          repeatType: "loop",
          duration: 20,
          ease: "linear",
        },
      },
    },
  };

  return (
    <div className="relative w-full overflow-hidden bg-green-100 rounded-xl border-1-4 border-green-500 shadow-lg ">
      <div className="flex items-center p-2">
        <FaExclamationTriangle className="text-green-500 mr-3 flex-shrink-0" />
        <div className="flex-1 overflow-hidden">
          <motion.div
            className="whitespace-nowrap flex"
            variants={marqueeVariants}
            animate="animate"
          >
            <span className="text-sm font-semibold text-green-800">
              {fullMessage}
            </span>
            <span className="text-sm font-semibold text-green-800 pl-8">
              {fullMessage}
            </span>
             <span className="text-sm font-semibold text-green-800 pl-8">
              {fullMessage}
            </span>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

// --- Transaction Modal Component ---

const TransactionModal = ({
  show,
  onClose,
  deposits,
  planDetails,
  totalSuspendedDays,
  bonusDays,
}) => {
  if (!show) return null;

  const calculateIndividualEarnings = (deposit) => {
    const start = new Date(deposit.timestamp);
    const now = new Date();
    const dailyROI = planDetails.roi / (planDetails.duration * 30) / 100;
    const dailyBonusRate = planDetails.dailyBonus / 100;
    const totalDailyRate = dailyROI + dailyBonusRate;

    const millisecondsPassed = now - start;
    const dayFraction =
      millisecondsPassed / (1000 * 60 * 60 * 24) -
      Math.floor(millisecondsPassed / (1000 * 60 * 60 * 24));
    const calendarDays = Math.floor(millisecondsPassed / (1000 * 60 * 60 * 24));
    const activeDays = Math.max(
      0,
      calendarDays - totalSuspendedDays + bonusDays + dayFraction
    );

    return (deposit.amount * totalDailyRate * activeDays).toFixed(2);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 z-50 flex justify-center items-center p-4">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-white rounded-lg shadow-xl w-full max-w-lg p-6 relative"
      >
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-800"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
        <h2 className="text-xl font-bold text-red-700 mb-4">
          Investment Transactions
        </h2>
        <div className="space-y-4 max-h-96 overflow-y-auto">
          {deposits.length > 0 ? (
            deposits.map((deposit, index) => (
              <div
                key={index}
                className="border-b border-gray-200 pb-4 last:border-b-0"
              >
                <div className="flex justify-between items-start mb-2">
                  <span className="font-semibold text-gray-800">
                    Deposit: ${deposit.amount.toFixed(2)}
                  </span>
                  <span className="text-sm text-gray-500">
                    {new Date(deposit.timestamp).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">
                    Earnings: ${calculateIndividualEarnings(deposit)}
                  </span>
                  <div className="flex items-center text-sm text-gray-500">
                    <div className="w-16 h-1.5 bg-gray-200 rounded-full mr-2">
                      <div
                        className="h-full rounded-full bg-green-500"
                        style={{
                          width: `${Math.min(
                            100,
                            ((new Date() - new Date(deposit.timestamp)) /
                              (planDetails.duration *
                                30 *
                                24 *
                                60 *
                                60 *
                                1000)) *
                              100
                          )}%`,
                        }}
                      ></div>
                    </div>
                    <span>
                      {Math.min(
                        100,
                        ((new Date() - new Date(deposit.timestamp)) /
                          (planDetails.duration *
                            30 *
                            24 *
                            60 *
                            60 *
                            1000)) *
                          100
                      ).toFixed(0)}
                      %
                    </span>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p className="text-center text-gray-500">
              No completed deposit transactions found.
            </p>
          )}
        </div>
      </motion.div>
    </div>
  );
};

// --- BalanceCard Component ---
const BalanceCard = ({
  title,
  amount,
  icon: Icon,
  color,
  percentage,
  subtitle,
  planInfo,
  onViewAllInvestments,
  showViewAllButton,
}) => {
  // ✅ Calculate progress if planInfo exists
  let currentDay = 0;
  let totalDays = 0;
  let daysRemaining = 0;

  if (planInfo) {
    const today = new Date();
    const startDate = new Date(planInfo.startDate);
    const endDate = new Date(planInfo.endDate);

    let elapsedDays = Math.floor((today - startDate) / (1000 * 60 * 60 * 24)) + 1;

    totalDays = Math.floor((endDate - startDate) / (1000 * 60 * 60 * 24)) + 1;
    if (elapsedDays > totalDays) elapsedDays = totalDays;

    daysRemaining = Math.max(0, totalDays - elapsedDays);
    currentDay = elapsedDays;
  }

  return (
    <div
      key={`card-wrapper-${title}`}
      className="relative overflow-hidden bg-black/20 rounded-xl shadow-2xl transition-all duration-300 hover:scale-[1.02] hover:shadow-red-500/20"
    >
      <div
        key={`card-inner-${title}`}
        className={`bg-gradient-to-br ${color} p-4 h-full rounded-xl border border-white/10`}
      >
        <div
          key={`overlay-${title}`}
          className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent pointer-events-none"
        />
        <div
          key={`content-${title}`}
          className="relative flex justify-between items-start"
        >
          <div key={`info-container-${title}`} className="flex-1 min-w-0">
            <h3
              key={`title-${title}`}
              className="font-medium text-xs sm:text-sm md:text-base text-white/90 tracking-wide mb-1"
            >
              {title}
            </h3>

            <motion.div
              key={`amount-${title}`}
              className="font-bold text-sm sm:text-lg md:text-2xl text-white tracking-tight"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              $
              {typeof amount === "number"
                ? amount.toLocaleString("en-US", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })
                : amount}
            </motion.div>

            {planInfo && (
              <div key={`plan-info-${title}`} className="mt-3 space-y-2">
                <div
                  key={`dates-${title}`}
                  className="flex items-center text-[0.65rem] sm:text-xs md:text-sm text-white/80 font-medium"
                >
                  <span key={`start-date-${title}`}>{planInfo.startDate}</span>
                  <span key={`arrow-${title}`} className="mx-2 text-white/40">
                    →
                  </span>
                  <span key={`end-date-${title}`}>{planInfo.endDate}</span>
                </div>

                <div
                  key={`progress-bar-${title}`}
                  className="w-full bg-black/30 rounded-full h-1.5 sm:h-2"
                >
                  <motion.div
                    key={`progress-fill-${title}`}
                    className="bg-gradient-to-r from-green-400 to-emerald-500 h-full rounded-full"
                    style={{
                      width: `${(currentDay / totalDays) * 100}%`,
                    }}
                    initial={{ width: 0 }}
                    animate={{ width: `${(currentDay / totalDays) * 100}%` }}
                    transition={{ duration: 1, ease: "easeOut" }}
                  />
                </div>

                <div
                  key={`days-info-${title}`}
                  className="flex justify-between text-[0.6rem] sm:text-xs md:text-sm text-white/70 font-medium"
                >
                  <span key={`current-day-${title}`}>
                    Day {currentDay}/{totalDays}
                  </span>
                  <span key={`remaining-days-${title}`}>
                    {daysRemaining}d remaining
                  </span>
                </div>
              </div>
            )}

            {subtitle && (
              <div
                key={`subtitle-container-${title}`}
                className="mt-2 space-y-0.5"
              >
                {subtitle}
              </div>
            )}
          </div>

          <Icon
            key={`icon-${title}`}
            className="text-lg sm:text-xl md:text-2xl text-white/90 ml-3"
          />
        </div>

        <div
          key={`footer-${title}`}
          className="mt-3 flex items-center justify-between"
        >
          <motion.div
            key={`percentage-container-${title}`}
            className="flex items-center text-[0.65rem] sm:text-xs md:text-sm text-emerald-300 font-semibold"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <FaArrowUp
              key={`arrow-icon-${title}`}
              className="w-2 h-2 sm:w-3 sm:h-3 mr-1"
            />
            {percentage}%
            <span
              key={`weekly-return-${title}`}
              className="text-[0.6rem] sm:text-xs md:text-xs text-white/60 ml-2 font-medium"
            >
              weekly return
            </span>
          </motion.div>
          {showViewAllButton && (
            <button
              onClick={onViewAllInvestments}
              className="bg-red-800 text-white text-xs px-2 py-1 rounded-full hover:bg-red-900 transition-colors"
            >
              View all
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

// --- BalanceCards Component ---

const BalanceCards = ({
  realTimeBalances,
  userData,
  investmentPlans,
  planDates,
  onViewAllInvestments,
}) => {
  const [mounted, setMounted] = useState(false);
  const [activeCard, setActiveCard] = useState("main");

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  const mobileButtons = [
    { id: "main", label: "Balance", icon: FaWallet },
    { id: "earnings", label: "Earnings", icon: FaChartLine },
    { id: "investment", label: "Investment", icon: FaHistory },
  ];

  return (
    <>
      <div key="mobile-view-container" className="block lg:hidden">
        <div key="mobile-buttons-container" className="flex gap-2 mb-4 px-2">
          {mobileButtons.map((button, index) => (
            <motion.button
              key={`mobile-btn-${button.id}-${index}`}
              onClick={() => setActiveCard(button.id)}
              whileTap={{ scale: 0.95 }}
              className={`flex-1 px-3 py-2 rounded-xl text-xs font-medium transition-all duration-300 flex items-center justify-center gap-2 ${
                activeCard === button.id
                  ? "bg-gradient-to-r from-red-900 to-red-950 text-white shadow-lg shadow-red-900/20"
                  : "bg-black/50 text-white/70 hover:bg-black/70"
              }`}
            >
              <button.icon
                key={`btn-icon-${button.id}-${index}`}
                className="w-3 h-3"
              />
              <span key={`btn-label-${button.id}-${index}`}>
                {button.label}
              </span>
            </motion.button>
          ))}
        </div>

        <motion.div
          key={`mobile-card-container-${activeCard}`}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full px-2"
        >
          {activeCard === "main" && (
            <BalanceCard
              key="mobile-main-balance-card"
              title="Main Balance"
              amount={parseFloat(realTimeBalances.mainBalance)}
              icon={FaWallet}
              color="from-red-600 via-red-700 to-red-900"
              percentage={realTimeBalances.weeklyPercentage}
              planInfo={planDates}
            />
          )}
          {activeCard === "earnings" && (
            <BalanceCard
              key="mobile-earnings-card"
              title="Total Earnings"
              amount={parseFloat(realTimeBalances.totalEarnings)}
              subtitle={
                <div
                  key="mobile-earnings-subtitle gap-6"
                  className="flex flex-col space-y-4"
                >
                  <span
                    key="mobile-daily-earnings"
                    className="text-white/80 text-[0.65rem] sm:text-xs md:text-sm font-medium"
                  >
                    ${parseFloat(realTimeBalances.dailyEarning)} earnings/day
                  </span>
                  <span
                    key="mobile-daily-bonus"
                    className="text-emerald-300 text-[0.65rem] sm:text-xs md:text-sm font-medium"
                  >
                    +${parseFloat(realTimeBalances.dailyBonus)} bonus/day
                  </span>
                  <span
                    key="mobile-daily-total"
                    className="text-white/90 text-[0.65rem] sm:text-xs md:text-sm font-semibold"
                  >
                    Daily Total: $
                    {(
                      parseFloat(realTimeBalances.dailyEarning) +
                      parseFloat(realTimeBalances.dailyBonus)
                    ).toFixed(2)}
                  </span>
                </div>
              }
              icon={FaChartLine}
              color="from-red-800 via-red-900 to-black"
              percentage={realTimeBalances.weeklyPercentage}
            />
          )}

          {activeCard === "investment" && (
            <BalanceCard
              key="mobile-investment-card"
              title="Total Investment"
              amount={userData?.totalInvestment || 0}
              icon={FaHistory}
              color="from-black via-red-950 to-red-900"
              percentage={realTimeBalances.weeklyPercentage}
              showViewAllButton={true}
              onViewAllInvestments={onViewAllInvestments}
              subtitle={
                <div
                  key="mobile-investment-subtitle"
                  className="flex flex-col space-y-1"
                >
                  <span
                    key="mobile-plan-info"
                    className="text-white/80 text-[0.65rem] sm:text-xs md:text-sm font-medium"
                  >
                    Plan: {userData.currentPlan}
                  </span>
                  <span
                    key="mobile-roi-info"
                    className="text-emerald-300 text-[0.65rem] sm:text-xs md:text-sm font-medium"
                  >
                    ROI:{" "}
                    {
                      investmentPlans[userData.accountType][
                        userData.currentPlan
                          .toLowerCase()
                          .replace(" plan", "")
                          .replace("joint ", "")
                      ].roi
                    }{" "}
                    %
                  </span>
                  <span
                    key="mobile-account-info"
                    className="text-white/80 text-[0.65rem] sm:text-xs md:text-sm font-medium"
                  >
                    Account: {userData.accountType}
                  </span>
                  <span
                    key="mobile-deposits-info"
                    className="text-white/60 text-[0.65rem] sm:text-xs md:text-sm font-medium"
                  >
                    Total Deposits:{" "}
                    {userData?.transactions
                      ? userData.transactions.filter(
                          (tx) => tx.fields.type === "DEPOSIT"
                        ).length
                      : 0}
                  </span>
                </div>
              }
            />
          )}
        </motion.div>
      </div>

      {/* Desktop View - Original Grid Layout */}
      <div
        key="desktop-view-container"
        className="hidden lg:grid lg:grid-cols-3 gap-6"
      >
        <BalanceCard
          key="desktop-main-balance-card"
          title="Main Balance"
          amount={parseFloat(realTimeBalances.mainBalance)}
          icon={FaWallet}
          color="from-red-600 via-red-700 to-red-900"
          percentage={realTimeBalances.weeklyPercentage}
          planInfo={planDates}
        />

        <BalanceCard
          key="desktop-earnings-card"
          title="Total Earnings"
          amount={parseFloat(realTimeBalances.totalEarnings)}
          subtitle={
            <div
              key="desktop-earnings-subtitle"
              className="flex flex-col space-y-1"
            >
              <span
                key="desktop-daily-earnings"
                className="text-white/80 text-[0.65rem] sm:text-xs md:text-sm font-medium"
              >
                ${parseFloat(realTimeBalances.dailyEarning)} earnings/day
              </span>
              <span
                key="desktop-daily-bonus"
                className="text-emerald-300 text-[0.65rem] sm:text-xs md:text-sm font-medium"
              >
                +${parseFloat(realTimeBalances.dailyBonus)} bonus/day
              </span>
              <span
                key="desktop-daily-total"
                className="text-white/90 text-[0.65rem] sm:text-xs md:text-sm font-semibold"
              >
                Daily Total: $
                {(
                  parseFloat(realTimeBalances.dailyEarning) +
                  parseFloat(realTimeBalances.dailyBonus)
                ).toFixed(2)}
              </span>
            </div>
          }
          icon={FaChartLine}
          color="from-red-800 via-red-900 to-black"
          percentage={realTimeBalances.weeklyPercentage}
        />

        <BalanceCard
          key="desktop-investment-card"
          title="Total Investment"
          amount={userData?.totalInvestment || 0}
          icon={FaHistory}
          color="from-black via-red-950 to-red-900"
          percentage={realTimeBalances.weeklyPercentage}
          showViewAllButton={true}
          onViewAllInvestments={onViewAllInvestments}
          subtitle={
            <div
              key="desktop-investment-subtitle"
              className="flex flex-col space-y-1"
            >
              <span
                key="desktop-plan-info"
                className="text-white/80 text-[0.65rem] sm:text-xs md:text-sm font-medium"
              >
                Plan: {userData.currentPlan}
              </span>
              <span
                key="desktop-roi-info"
                className="text-emerald-300 text-[0.65rem] sm:text-xs md:text-sm font-medium"
              >
                ROI:{" "}
                {
                  investmentPlans[userData.accountType][
                    userData.currentPlan
                      .toLowerCase()
                      .replace(" plan", "")
                      .replace("joint ", "")
                  ].roi
                }{" "}
                %
              </span>
              <span
                key="desktop-account-info"
                className="text-white/80 text-[0.65rem] sm:text-xs md:text-sm font-medium"
              >
                Account: {userData.accountType}
              </span>
              <span
                key="desktop-deposits-info"
                className="text-white/60 text-[0.65rem] sm:text-xs md:text-sm font-medium"
              >
                Total Deposits:{" "}
                {userData?.transactions
                  ? userData.transactions.filter(
                      (tx) => tx.fields.type === "DEPOSIT"
                    ).length
                  : 0}
              </span>
            </div>
          }
        />
      </div>
    </>
  );
};

// --- Main Component ---

export default function BalanceCharts({ userId }) {
  const [userData, setUserData] = useState(null);
  const [dailyStats, setDailyStats] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeChart, setActiveChart] = useState("earnings");
  const [showTransactions, setShowTransactions] = useState(false);
  const [notification, setNotification] = useState(null); // Updated state for a single notification
  const [realTimeBalances, setRealTimeBalances] = useState({
    mainBalance: 0.0,
    dailyEarning: 0.0,
    dailyBonus: 0.0,
    totalEarnings: 0.0,
    weeklyPercentage: 0.0,
  });

  const calculateRealTimeBalances = useCallback((deposits, planDetails) => {
  let totalMainBalance = 0;
  let totalEarnings = 0;
  const now = new Date();

  deposits.forEach((deposit) => {
    const start = new Date(deposit.timestamp);
    const endDate = new Date(
      start.getTime() + planDetails.duration * 30 * 24 * 60 * 60 * 1000
    );

    // ❌ Do not add beyond the plan end date
    const effectiveDate = now > endDate ? endDate : now;

    const daysActive = Math.max(
      0,
      (effectiveDate - start) / (1000 * 60 * 60 * 24)
    );

    const dailyROI = planDetails.roi / (planDetails.duration * 30) / 100;
    const dailyBonusRate = planDetails.dailyBonus / 100;
    const totalDailyRate = dailyROI + dailyBonusRate;

    const earnings = deposit.amount * totalDailyRate * daysActive;

    totalEarnings += earnings;
    totalMainBalance += deposit.amount + earnings;
  });

  const totalInvestment = deposits.reduce((sum, dep) => sum + dep.amount, 0);

  const dailyROI = planDetails.roi / (planDetails.duration * 30) / 100;
  const dailyBonusRate = planDetails.dailyBonus / 100;
  const dailyEarning = totalInvestment * dailyROI;
  const dailyBonus = totalInvestment * dailyBonusRate;
  const weeklyPercentage = (dailyROI + dailyBonusRate) * 7 * 100;

  return {
    mainBalance: totalMainBalance.toFixed(2),
    dailyEarning: dailyEarning.toFixed(2),
    dailyBonus: dailyBonus.toFixed(2),
    totalEarnings: totalEarnings.toFixed(2),
    weeklyPercentage: weeklyPercentage.toFixed(2),
  };
}, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userString = localStorage.getItem("user");
        const user = JSON.parse(userString);

        const userResponse = await client.getEntries({
          content_type: "userProfile",
          "fields.email": user.email,
          include: 3,
        });

        if (!userResponse?.items?.length) return;

        const userData = userResponse.items[0].fields;

        // Corrected: Directly get the notification field from the user data
        const fetchedNotification = userData.notification || null;
        setNotification(fetchedNotification);

        if (
          userData.accountStatus === "Suspended" ||
          userData.accountStatus === "Pending"
        ) {
          setUserData({ ...userData });
          setIsLoading(false);
          return;
        }

        const planType = userData.currentPlan
          .toLowerCase()
          .replace(" plan", "")
          .replace("joint ", "");
        const accountType = userData.accountType;
        const planDetails = investmentPlans[accountType][planType];
        const totalSuspendedDays = userData.totalSuspendedDays || 0;
        const bonusDays = userData.bonusDays || 0;
        const lastSuspensionDate = userData.lastSuspensionDate || null;

        const deposits = (userData.transactions || [])
          .filter(
            (entry) =>
              entry.fields.type === "DEPOSIT" &&
              entry.fields.status === "COMPLETED"
          )
          .map((entry) => ({
            amount: entry.fields.amount,
            timestamp: entry.fields.timestamp,
          }));

        const totalInvestment = deposits.reduce((sum, dep) => sum + dep.amount, 0);

        const initialBalances = calculateRealTimeBalances(
          deposits,
          planDetails,
          userData.accountStatus,
          lastSuspensionDate,
          totalSuspendedDays,
          bonusDays
        );

        setRealTimeBalances(initialBalances);
        setUserData({ ...userData, totalInvestment, deposits });

        const stats = generateDailyStats(
          deposits,
          planDetails,
          totalSuspendedDays
        );
        setDailyStats(stats);

        const planDates = calculatePlanDates(
          userData.startDate,
          planDetails.duration,
          totalSuspendedDays,
          bonusDays
        );

        if (userData.accountStatus === "Active") {
          const updateInterval = setInterval(() => {
            const newBalances = calculateRealTimeBalances(
              deposits,
              planDetails,
              userData.accountStatus,
              lastSuspensionDate,
              totalSuspendedDays,
              bonusDays
            );

            if (newBalances.isComplete) {
              clearInterval(updateInterval);
            }

            setRealTimeBalances(newBalances);
          }, 100);
          return () => clearInterval(updateInterval);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [userId, calculateRealTimeBalances]);

  if (isLoading) return <div></div>;

  if (userData?.accountStatus === "Suspended") {
    return (
      <div className="p-6 bg-red-50 rounded-xl border border-red-200 shadow-md">
        <div className="flex items-start space-x-3">
          <FaExclamationTriangle className="text-red-600 mt-1 flex-shrink-0 h-5 w-5" />
          <div>
            <h2 className="text-xl font-bold text-red-700 mb-2">
              Account Suspended
            </h2>
            <p className="text-red-600 mb-3">
              {userData.suspensionReason ||
                "Your account has been suspended. Please contact customer support for assistance."}
            </p>
            {userData.totalSuspendedDays > 0 && (
              <div className="mt-2 pt-2 border-t border-red-200">
                <p className="text-sm text-red-500">
                  Total suspended days:{" "}
                  <span className="font-semibold">
                    {userData.totalSuspendedDays}
                  </span>
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  if (userData?.accountStatus === "Pending") {
    return (
      <div className="p-6 bg-yellow-50 rounded-xl border border-yellow-200 shadow-md">
        <h2 className="text-xl font-bold text-yellow-700 mb-3">
          Account Pending Activation
        </h2>
        <p className="text-yellow-600">
          Your account is pending activation. This usually takes 24-48 hours.
          Please check back later or contact support if it's been longer.
        </p>
      </div>
    );
  }

  const planDates =
    userData?.startDate && userData?.accountType && userData?.currentPlan
      ? calculatePlanDates(
          userData.startDate,
          investmentPlans[userData.accountType][
            userData.currentPlan
              .toLowerCase()
              .replace(" plan", "")
              .replace("joint ", "")
          ].duration,
          userData.totalSuspendedDays || 0,
          userData.bonusDays || 0
        )
      : null;

  return (
    <div key="balance-charts-container" className="p-2 space-y-3">
      {/* Sliding Notification Bar */}
      <SlidingNotification notification={notification} />

      <BalanceCards
        key="balance-cards-component"
        realTimeBalances={realTimeBalances}
        userData={userData}
        investmentPlans={investmentPlans}
        planDates={planDates}
        onViewAllInvestments={() => setShowTransactions(true)}
      />

      <div key="charts-grid" className="grid md:grid-cols-2 gap-2">
        <div key="mobile-chart-buttons" className="flex gap-2 md:hidden mb-2">
          <button
            key="earnings-button"
            onClick={() => setActiveChart("earnings")}
            className={`flex-1 p-2 rounded-lg text-white text-sm font-semibold
        bg-gradient-to-r from-red-700 via-red-600 to-red-700
        shadow-lg shadow-red-500/30 transition-all duration-300
        ${
          activeChart === "earnings"
            ? "scale-105 ring-2 ring-red-400"
            : "opacity-90"
        }`}
          >
            Earnings Overview
          </button>
          <button
            key="balance-button"
            onClick={() => setActiveChart("balance")}
            className={`flex-1 p-2 rounded-lg text-white text-sm font-semibold
        bg-gradient-to-r from-red-700 via-red-600 to-red-700
        shadow-lg shadow-red-500/30 transition-all duration-300
        ${
          activeChart === "balance"
            ? "scale-105 ring-2 ring-red-400"
            : "opacity-90"
        }`}
          >
            Balance Overview
          </button>
        </div>

        <AnimatePresence mode="wait">
          {(activeChart === "earnings" || window.innerWidth >= 768) && (
            <motion.div
              key="earnings-chart-container"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="bg-gradient-to-br from-white via-red-50 to-white p-3 rounded-lg shadow-lg h-full"
            >
              <h3
                key="earnings-title"
                className="text-sm md:text-base font-semibold mb-2 text-red-700"
              >
                Earnings Overview
              </h3>
              <div
                key="earnings-chart"
                className="h-[210px] shadow-lg p-2 rounded-lg"
              >
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={dailyStats}>
                    <defs>
                      <linearGradient
                        key="earnings-gradient"
                        id="earnings"
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                      >
                        <stop
                          offset="5%"
                          stopColor="#DC2626"
                          stopOpacity={0.8}
                        />
                        <stop
                          offset="95%"
                          stopColor="#DC2626"
                          stopOpacity={0.1}
                        />
                      </linearGradient>
                    </defs>
                    <CartesianGrid
                      key="earnings-grid"
                      strokeDasharray="3 3"
                      stroke="#f0f0f0"
                    />
                    <XAxis
                      key="earnings-xaxis"
                      dataKey="day"
                      tick={{ fontSize: 10 }}
                    />
                    <YAxis key="earnings-yaxis" tick={{ fontSize: 10 }} />
                    <Tooltip
                      key="earnings-tooltip"
                      contentStyle={{
                        fontSize: "0.75rem",
                        background: "rgba(255,255,255,0.95)",
                        border: "1px solid #DC2626",
                        borderRadius: "8px",
                      }}
                    />
                    <Area
                      key="earnings-area"
                      type="monotone"
                      dataKey="earnings"
                      stroke="#DC2626"
                      strokeWidth={2}
                      fillOpacity={1}
                      fill="url(#earnings)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </motion.div>
          )}

          {(activeChart === "balance" || window.innerWidth >= 768) && (
            <motion.div
              key="balance-chart-container"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="bg-gradient-to-br from-white via-red-50 to-white p-3 rounded-lg shadow-lg h-full"
            >
              <h3
                key="balance-title"
                className="text-sm md:text-base font-semibold mb-2 text-red-700"
              >
                Balance Overview
              </h3>
              <div
                key="balance-chart-wrapper"
                className="h-[200px] md:h-[200px]"
              >
                <motion.div
                  key="balance-chart-motion"
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="p-2 rounded-lg shadow-lg"
                >
                  <div key="balance-chart" className="h-[150px] md:h-[200px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={dailyStats}>
                        <CartesianGrid
                          key="balance-grid"
                          strokeDasharray="2 2"
                          stroke="#f0f0f0"
                        />
                        <XAxis
                          key="balance-xaxis"
                          dataKey="day"
                          tick={{ fontSize: 8 }}
                        />
                        <YAxis key="balance-yaxis" tick={{ fontSize: 8 }} />
                        <Tooltip
                          key="balance-tooltip"
                          contentStyle={{ fontSize: "0.65rem" }}
                        />
                        <Bar
                          key="balance-bar"
                          dataKey="balance"
                          fill="#DC2626"
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      <AnimatePresence>
        {showTransactions && (
          <TransactionModal
            show={showTransactions}
            onClose={() => setShowTransactions(false)}
            deposits={userData?.deposits || []}
            planDetails={
              investmentPlans[userData.accountType][
                userData.currentPlan
                  .toLowerCase()
                  .replace(" plan", "")
                  .replace("joint ", "")
              ]
            }
            totalSuspendedDays={userData?.totalSuspendedDays || 0}
            bonusDays={userData?.bonusDays || 0}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
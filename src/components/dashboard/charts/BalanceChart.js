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

export const calculatePlanDates = (startDate, planDuration) => {
  const start = new Date(startDate);
  const end = new Date(
    start.getTime() + planDuration * 30 * 24 * 60 * 60 * 1000
  );
  const today = new Date();
  const daysPassed = Math.floor((today - start) / (1000 * 60 * 60 * 24));
  const totalDays = planDuration * 30;
  const daysRemaining = totalDays - daysPassed;

  return {
    startDate: start.toLocaleDateString(),
    endDate: end.toLocaleDateString(),
    currentDay: daysPassed,
    totalDays,
    daysRemaining,
    progress: (daysPassed / totalDays) * 100,
  };
};

export const generateDailyStats = (investment, startDate, planDetails) => {
  const stats = [];
  const dailyROI = planDetails.roi / (planDetails.duration * 30) / 100;
  const dailyBonusRate = planDetails.dailyBonus / 100;
  const totalDailyRate = dailyROI + dailyBonusRate;

  for (let day = 1; day <= planDetails.duration * 30; day++) {
    const earnings = investment * totalDailyRate * day;
    const balance = investment + earnings;
    stats.push({
      day: `Day ${day}`,
      earnings: earnings,
      balance: balance,
    });
  }
  return stats;
};

const BalanceCard = ({
  title,
  amount,
  icon: Icon,
  color,
  percentage,
  subtitle,
  planInfo,
}) => (
  <div
    key={`card-wrapper-${title}`}
    className="relative overflow-hidden  bg-black/20 rounded-xl shadow-2xl transition-all duration-300 hover:scale-[1.02] hover:shadow-red-500/20"
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
                  style={{ width: `${planInfo.progress}%` }}
                  initial={{ width: 0 }}
                  animate={{ width: `${planInfo.progress}%` }}
                  transition={{ duration: 1, ease: "easeOut" }}
                />
              </div>

              <div
                key={`days-info-${title}`}
                className="flex justify-between text-[0.6rem] sm:text-xs md:text-sm text-white/70 font-medium"
              >
                <span key={`current-day-${title}`}>
                  Day {planInfo.currentDay}/{planInfo.totalDays}
                </span>
                <span key={`remaining-days-${title}`}>
                  {planInfo.daysRemaining}d remaining
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

      <div key={`footer-${title}`} className="mt-3 flex items-center">
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
        </motion.div>
        <span
          key={`weekly-return-${title}`}
          className="text-[0.6rem] sm:text-xs md:text-xs text-white/60 ml-2 font-medium"
        >
          weekly return
        </span>
      </div>
    </div>
  </div>
);

const BalanceCards = ({
  realTimeBalances,
  userData,
  investmentPlans,
  planDates,
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
              percentage={
                (parseFloat(realTimeBalances.dailyEarning) +
                  parseFloat(realTimeBalances.dailyBonus)) *
                7
              }
            />
          )}

          {activeCard === "investment" && (
            <BalanceCard
              key="mobile-investment-card"
              title="Investment Stats"
              amount={userData?.totalInvestment || 0}
              icon={FaHistory}
              color="from-black via-red-950 to-red-900"
              percentage={realTimeBalances.weeklyPercentage}
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
                          .replace("couple ", "")
                      ].roi
                    }
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
                    {
                      userData.transactions.filter(
                        (tx) => tx.type === "DEPOSIT"
                      ).length
                    }
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
          percentage={
            (parseFloat(realTimeBalances.dailyEarning) +
              parseFloat(realTimeBalances.dailyBonus)) *
            7
          }
        />

        <BalanceCard
          key="desktop-investment-card"
          title="Investment Stats"
          amount={userData?.totalInvestment || 0}
          icon={FaHistory}
          color="from-black via-red-950 to-red-900"
          percentage={realTimeBalances.weeklyPercentage}
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
                      .replace("couple ", "")
                  ].roi
                }
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
                {
                  userData.transactions.filter((tx) => tx.type === "DEPOSIT")
                    .length
                }
              </span>
            </div>
          }
        />
      </div>
    </>
  );
};

export default function BalanceCharts({ userId }) {
  const [userData, setUserData] = useState(null);
  const [dailyStats, setDailyStats] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeChart, setActiveChart] = useState("earnings");
  const [realTimeBalances, setRealTimeBalances] = useState({
    mainBalance: 0.0,
    dailyEarning: 0.0,
    dailyBonus: 0.0,
    totalEarnings: 0.0,
    weeklyPercentage: 0.0,
  });

  const calculateRealTimeBalances = useCallback(
    (investment, startDate, planDetails) => {
      const now = new Date();
      const start = new Date(startDate);
      const planEndDate = new Date(
        start.getTime() + planDetails.duration * 30 * 24 * 60 * 60 * 1000
      );

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
      const weeklyROI = dailyROI * 7 * 100;
      const weeklyBonus = dailyBonusRate * 7 * 100;
      const weeklyPercentage = weeklyROI + weeklyBonus;

      return {
        mainBalance: (investment + totalEarnings).toFixed(2),
        dailyEarning: (investment * dailyROI).toFixed(2),
        dailyBonus: (investment * dailyBonusRate).toFixed(2),
        totalEarnings: totalEarnings.toFixed(2),
        weeklyPercentage: weeklyPercentage.toFixed(2),
        isComplete: false,
      };
    },
    []
  );

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
        const planType = userData.currentPlan
          .toLowerCase()
          .replace(" plan", "")
          .replace("couple ", "");
        const accountType = userData.accountType;
        const planDetails = investmentPlans[accountType][planType];

        const transactionsResponse = await client.getEntries({
          content_type: "transaction",
          "fields.user.sys.id": userResponse.items[0].sys.id,
          include: 2,
        });

        const transactions = transactionsResponse.items
          .map((entry) => ({
            type: entry.fields.type,
            amount: entry.fields.amount,
            status: entry.fields.status,
            timestamp: entry.fields.timestamp,
            userId: entry.fields.userId,
          }))
          .filter((tx) => tx.userId === userId);

        const totalInvestment = transactions
          .filter((tx) => tx.status === "COMPLETED" && tx.type === "DEPOSIT")
          .reduce((sum, tx) => sum + tx.amount, 0);

        const initialBalances = calculateRealTimeBalances(
          totalInvestment,
          userData.startDate,
          planDetails
        );
        setRealTimeBalances(initialBalances);
        setUserData({ ...userData, transactions, totalInvestment });

        const stats = generateDailyStats(
          totalInvestment,
          userData.startDate,
          planDetails
        );
        setDailyStats(stats);

        const updateInterval = setInterval(() => {
          const newBalances = calculateRealTimeBalances(
            totalInvestment,
            userData.startDate,
            planDetails
          );
          if (newBalances.isComplete) {
            clearInterval(updateInterval);
          }
          setRealTimeBalances(newBalances);
        }, 1000);

        return () => clearInterval(updateInterval);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [userId, calculateRealTimeBalances]);

  if (isLoading) return <div></div>;

  const planDates = calculatePlanDates(
    userData.startDate,
    investmentPlans[userData.accountType][
      userData.currentPlan
        .toLowerCase()
        .replace(" plan", "")
        .replace("couple ", "")
    ].duration
  );

  return (
    <div key="balance-charts-container" className="p-2 space-y-3">
      <BalanceCards
        key="balance-cards-component"
        realTimeBalances={realTimeBalances}
        userData={userData}
        investmentPlans={investmentPlans}
        planDates={planDates}
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

        {/* Charts */}
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

          {/* Balance Chart - Always visible on desktop, conditionally on mobile */}
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
    </div>
  );
}

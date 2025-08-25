"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams } from "next/navigation";
import { client } from "@/lib/contentful";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { HiArrowsRightLeft } from 'react-icons/hi2';
import {
  FaBell,
  FaSearch,
  FaWallet,
  FaCheckCircle,
  FaArrowUp,
  FaExclamationTriangle,
} from "react-icons/fa";
import NotificationDropdown from "@/components/ui/NotificationDropdown/NotificationDropdown";
import SignOutButton from "@/components/ui/SignOutButton/SignOutButton";
import { investmentPlans } from "@/config/investmentPlans";

export default function Headerr({ onMenuClick, onRightMenuClick }) {
  const params = useParams();
  const [showProfile, setShowProfile] = useState(false);
  const [showPortfolios, setShowPortfolios] = useState(false);
  const [userProfile, setUserProfile] = useState(null);
  const [realTimeBalances, setRealTimeBalances] = useState({
    mainBalance: 0,
    dailyEarning: 0,
    dailyBonus: 0,
    totalEarnings: 0,
    weeklyPercentage: 0,
  });

  const getAvatarImage = (userProfile) => {
    if (userProfile?.profileImage?.fields?.file?.url) {
      return `https:${userProfile.profileImage.fields.file.url}`;
    }
    return userProfile?.gender?.toLowerCase() === 'female'
      ? "/avatarfemale.webp"
      : "/avatarmale.jpeg";
  };

  // NEW: Refactored function to calculate based on multiple deposits
  const calculateRealTimeBalances = useCallback(
    (deposits, accountStatus, planDetails, lastSuspensionDate, totalSuspendedDays = 0, bonusDays = 0) => {
      if (!deposits || deposits.length === 0 || !planDetails?.duration) {
        return {
          mainBalance: '0.00',
          dailyEarning: '0.00',
          dailyBonus: '0.00',
          totalEarnings: '0.00',
          weeklyPercentage: '0.00',
          isComplete: false
        };
      }

      // Calculate for each deposit and sum the results
      let totalMainBalance = 0;
      let totalDailyEarning = 0;
      let totalDailyBonus = 0;
      let totalEarnings = 0;
      let isAnyPlanComplete = false;

      const now = new Date();
      const dailyROI = planDetails.roi / (planDetails.duration * 30) / 100;
      const dailyBonusRate = planDetails.dailyBonus / 100;
      const totalDailyRate = dailyROI + dailyBonusRate;

      deposits.forEach(deposit => {
        const start = new Date(deposit.fields.timestamp);
        let activeDays;
        
        if (accountStatus === "Suspended" && lastSuspensionDate) {
          const suspensionDate = new Date(lastSuspensionDate);
          const daysUntilSuspension = Math.floor((suspensionDate - start) / (1000 * 60 * 60 * 24));
          activeDays = (daysUntilSuspension - totalSuspendedDays) + bonusDays;
        } else {
          const millisecondsPassed = now - start;
          const dayFraction = millisecondsPassed / (1000 * 60 * 60 * 24) - Math.floor(millisecondsPassed / (1000 * 60 * 60 * 24));
          activeDays = (Math.floor(millisecondsPassed / (1000 * 60 * 60 * 24)) - totalSuspendedDays + bonusDays) + dayFraction;
        }

        if (activeDays >= planDetails.duration * 30) {
          totalMainBalance += deposit.fields.amount * (1 + planDetails.roi / 100);
          totalEarnings += deposit.fields.amount * (planDetails.roi / 100);
          isAnyPlanComplete = true;
        } else {
          const earnings = deposit.fields.amount * totalDailyRate * activeDays;
          totalMainBalance += deposit.fields.amount + earnings;
          totalDailyEarning += deposit.fields.amount * dailyROI;
          totalDailyBonus += deposit.fields.amount * dailyBonusRate;
          totalEarnings += earnings;
        }
      });

      const weeklyPercentage = (totalDailyEarning / totalMainBalance * 7 * 100).toFixed(2);

      return {
        mainBalance: totalMainBalance.toFixed(2),
        dailyEarning: totalDailyEarning.toFixed(2),
        dailyBonus: totalDailyBonus.toFixed(2),
        totalEarnings: totalEarnings.toFixed(2),
        weeklyPercentage: weeklyPercentage,
        isComplete: isAnyPlanComplete,
      };
    },
    []
  );

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userString = localStorage.getItem("user");
        if (!userString) throw new Error("User data not found");

        const user = JSON.parse(userString);
        const userResponse = await client.getEntries({
          content_type: "userProfile",
          'fields.email': user.email,
          'fields.firstName': user.firstName,
          'fields.lastName': user.lastName,
          'fields.dateOfBirth': user.dateOfBirth,
          include: 3
        });

        if (!userResponse.items.length) throw new Error("User profile not found");

        const userData = userResponse.items[0].fields;

        const totalSuspendedDays = userData.totalSuspendedDays || 0;
        const bonusDays = userData.bonusDays || 0;
        const lastSuspensionDate = userData.lastSuspensionDate || null;
        const accountStatus = userData.accountStatus || "Active";
        const suspensionReason = userData.suspensionReason || "Please contact customer support for assistance.";

        if (accountStatus === "Suspended" || accountStatus === "Pending") {
          setUserProfile({
            ...userData,
            totalInvestment: 0,
            transactions: [],
            accountStatus,
            suspensionReason
          });
          setRealTimeBalances({
            mainBalance: '0.00',
            dailyEarning: '0.00',
            dailyBonus: '0.00',
            totalEarnings: '0.00',
            weeklyPercentage: '0.00',
            isSuspended: accountStatus === "Suspended",
            isPending: accountStatus === "Pending"
          });
          return;
        }

        const transactionsResponse = await client.getEntries({
          content_type: "transaction",
          "fields.user.sys.id": userResponse.items[0].sys.id,
          "fields.type": "DEPOSIT",
          "fields.status": "COMPLETED", // Only include completed deposits
          order: "-fields.timestamp",
        });

        const deposits = transactionsResponse.items;
        const totalInvestment = deposits.reduce((sum, tx) => sum + tx.fields.amount, 0);

        const planType = userData.currentPlan?.toLowerCase()
          .replace(" plan", "")
          .replace("joint ", "");
        
        const accountType = userData.accountType?.toLowerCase() === 'joint' ? 'joint' : 'single';

        if (!investmentPlans[accountType]?.[planType]) {
          throw new Error("Invalid plan configuration");
        }

        const planDetails = investmentPlans[accountType][planType];
        setUserProfile({
          ...userData,
          totalInvestment,
          transactions: transactionsResponse.items,
          accountStatus,
          suspensionReason
        });

        const initialBalances = calculateRealTimeBalances(
          deposits, // Pass the array of deposits
          accountStatus,
          planDetails,
          lastSuspensionDate,
          totalSuspendedDays,
          bonusDays
        );
        
        setRealTimeBalances(initialBalances);

        if (accountStatus === "Active") {
          const updateInterval = setInterval(() => {
            const newBalances = calculateRealTimeBalances(
              deposits,
              accountStatus,
              planDetails,
              lastSuspensionDate,
              totalSuspendedDays,
              bonusDays
            );
            
            if (newBalances.isComplete) {
              clearInterval(updateInterval);
            }
            
            setRealTimeBalances(newBalances);
          }, 1000);

          return () => clearInterval(updateInterval);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        setRealTimeBalances({
          mainBalance: '0.00',
          dailyEarning: '0.00',
          dailyBonus: '0.00',
          totalEarnings: '0.00',
          weeklyPercentage: '0.00'
        });
      }
    };

    fetchData();
  }, [calculateRealTimeBalances]);

  const renderAccountStatusContent = () => {
    if (userProfile?.accountStatus === "Suspended") {
      return (
        <div className="bg-red-600 text-white px-3 py-1 rounded-lg text-xs font-medium">
          Account Suspended
        </div>
      );
    } else if (userProfile?.accountStatus === "Pending") {
      return (
        <div className="bg-yellow-500 text-white px-3 py-1 rounded-lg text-xs font-medium">
          Pending Activation
        </div>
      );
    } else {
      return (
        <p className="flex items-center text-xs text-red-300">
          {userProfile?.currentPlan}
          <FaCheckCircle className="text-green-400 ml-1" />
        </p>
      );
    }
  };

  return (
    <header className="bg-gradient-to-r from-red-900 via-red-800 to-black shadow-xl fixed top-0 right-0 left-0 lg:left-20 z-30">
      <div className="px-2 sm:px-4 lg:px-6">
        <div className="flex items-center justify-between h-16 lg:h-20">
          <div className="flex-1 flex items-center justify-between">
            <div className="relative">
              <button
                onMouseEnter={() => setShowPortfolios(true)}
                onMouseLeave={() => setShowPortfolios(false)}
                className="flex items-center space-x-1 px-3 py-2 rounded-lg transition-all duration-300 hover:bg-white/10"
              >
                <FaWallet className="h-6 w-6 lg:h-8 lg:w-8 text-red-400" />
                <div className="ml-2 hidden sm:block">
                  <p className="text-xs font-medium text-gray-100">Current Plan</p>
                  {renderAccountStatusContent()}
                </div>
              </button>

              <AnimatePresence>
                {showPortfolios && (
                  <motion.div
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 5 }}
                    className="absolute left-0 mt-2 w-[280px] md:w-96 rounded-xl shadow-2xl bg-white/95 border border-red-100"
                    onMouseEnter={() => setShowPortfolios(true)}
                    onMouseLeave={() => setShowPortfolios(false)}
                  >
                    <div className="p-4">
                      {userProfile?.accountStatus === "Suspended" ? (
                        <div className="bg-red-100 p-4 rounded-lg">
                          <div className="flex items-center justify-between mb-3">
                            <div>
                              <h3 className="text-sm font-bold text-red-700">Account Suspended</h3>
                              <p className="text-xs text-red-600">
                                <FaExclamationTriangle className="inline-block mr-1" />
                                Reason: {userProfile.suspensionReason || "Please contact support."}
                              </p>
                            </div>
                            <FaWallet className="h-6 w-6 text-red-500" />
                          </div>
                          {userProfile?.totalSuspendedDays > 0 && (
                            <div className="mt-2 text-xs text-red-600">
                              Total suspended days: {userProfile.totalSuspendedDays}
                            </div>
                          )}
                          <div className="mt-3 pt-2 border-t border-red-200">
                            <p className="text-xs text-red-600">
                              If you believe this is an error, please contact our support team.
                            </p>
                          </div>
                        </div>
                      ) : userProfile?.accountStatus === "Pending" ? (
                        <div className="bg-yellow-100 p-4 rounded-lg">
                          <div className="flex items-center justify-between mb-3">
                            <div>
                              <h3 className="text-sm font-bold text-yellow-700">Account Pending</h3>
                              <p className="text-xs text-yellow-600">
                                Your account is pending activation. This usually takes 24-48 hours.
                              </p>
                            </div>
                            <FaWallet className="h-6 w-6 text-yellow-500" />
                          </div>
                        </div>
                      ) : (
                        <>
                          <div className="bg-gradient-to-r from-red-600 to-red-800 p-4 rounded-lg text-white">
                            <div className="flex items-center justify-between mb-3">
                              <div>
                                <h3 className="text-sm font-bold">
                                  {userProfile?.currentPlan}
                                </h3>
                               
                              </div>
                              <FaWallet className="h-6 w-6" />
                            </div>
                          </div>
                        </>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
          <div className="flex items-center space-x-2 md:space-x-6">
            <div className="relative hidden md:block">
              <input
                type="text"
                placeholder="Search..."
                className="w-40 lg:w-64 pl-10 pr-4 py-2 text-sm rounded-lg bg-white/10 border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-400 focus:border-transparent transition-all duration-300"
              />
              <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            </div>
            <button className="md:hidden p-2 text-white hover:bg-white/10 rounded-lg">
              <FaSearch className="h-5 w-5" />
            </button>
            <div className="relative">
              <NotificationDropdown>
                <button className="p-2 text-white hover:bg-white/10 rounded-lg transition-all duration-300">
                  <FaBell className="h-5 w-5 lg:h-6 lg:w-6" />
                  <span className="absolute top-1 right-1 block h-2 w-2 rounded-full bg-red-400 ring-2 ring-black" />
                </button>
              </NotificationDropdown>
            </div>
            <button
              className="lg:hidden p-2 text-white hover:bg-white/10 rounded-lg"
              onClick={onRightMenuClick}
            >
              <HiArrowsRightLeft className="h-5 w-5" />
            </button>
            <div className="relative">
              <button
                onMouseEnter={() => setShowProfile(true)}
                onMouseLeave={() => setShowProfile(false)}
                className="flex items-center space-x-3 focus:outline-none"
              >
                <div className="relative w-8 h-8 lg:w-10 lg:h-10 rounded-full overflow-hidden ring-2 ring-red-400 hover:ring-red-300 transition-all duration-300">
                  <Image
                    src={getAvatarImage(userProfile)}
                    alt="Profile"
                    layout="fill"
                    className="rounded-full object-cover"
                    priority
                  />
                </div>
              </button>
              <AnimatePresence>
                {showProfile && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="absolute right-0 mt-2 w-72 rounded-xl shadow-2xl bg-white/95 border border-red-100"
                    onMouseEnter={() => setShowProfile(true)}
                    onMouseLeave={() => setShowProfile(false)}
                  >
                    <div className="p-4 border-b border-gray-100">
                      <div className="flex items-center space-x-3">
                        <div className="relative w-16 h-16 rounded-full overflow-hidden ring-2 ring-red-400">
                          <Image
                            src={getAvatarImage(userProfile)}
                            alt="Profile"
                            layout="fill"
                            className="rounded-full object-cover"
                            priority
                          />
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900">
                            {userProfile ? `${userProfile.firstName} ${userProfile.lastName}` : "Loading..."}
                          </h3>
                          <p className="text-sm text-gray-500">
                            {userProfile?.email || "Loading..."}
                          </p>
                         
                        </div>
                      </div>
                     
                    </div>
                    <div className="py-2">
                      <Link
                        href={`/dashboard/${params.userId}/profile/settings/profile`}
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-red-50 hover:text-red-600 transition-colors duration-200"
                      >
                        Profile Settings
                      </Link>
                      <SignOutButton />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
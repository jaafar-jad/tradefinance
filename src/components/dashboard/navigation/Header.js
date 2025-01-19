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

  const calculateRealTimeBalances = useCallback((investment, startDate, planDetails) => {
    if (!investment || !startDate || !planDetails?.duration) {
      return {
        mainBalance: '0.00',
        dailyEarning: '0.00',
        dailyBonus: '0.00',
        totalEarnings: '0.00',
        weeklyPercentage: '0.00',
        isComplete: false
      };
    }

    const now = new Date();
    const start = new Date(startDate);
    const planEndDate = new Date(
      start.getTime() + planDetails.duration * 30 * 24 * 60 * 60 * 1000
    );

    if (now > planEndDate) {
      return {
        mainBalance: (investment * (1 + planDetails.roi / 100)).toFixed(2),
        dailyEarning: '0.00',
        dailyBonus: '0.00',
        totalEarnings: (investment * (planDetails.roi / 100)).toFixed(2),
        weeklyPercentage: '0.00',
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
  }, []);

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
        const transactionsResponse = await client.getEntries({
          content_type: "transaction",
          "fields.user.sys.id": userResponse.items[0].sys.id,
          "fields.type": "DEPOSIT",
          order: "-fields.timestamp",
        });

        const totalInvestment = transactionsResponse.items
          .filter((tx) => tx.fields.status === "COMPLETED")
          .reduce((sum, tx) => sum + tx.fields.amount, 0);

          const planType = userData.currentPlan?.toLowerCase()
          .replace(" plan", "")
          .replace("joint ", ""); // Changed from 'joint' to 'joint'
        
        const accountType = userData.accountType?.toLowerCase() === 'joint' ? 'joint' : 'single'; // Add this line

        if (!investmentPlans[accountType]?.[planType]) {
          throw new Error("Invalid plan configuration");
        }

        const planDetails = investmentPlans[accountType][planType];
        setUserProfile({
          ...userData,
          totalInvestment,
          transactions: transactionsResponse.items,
        });

        const initialBalances = calculateRealTimeBalances(
          totalInvestment,
          userData.startDate,
          planDetails
        );
        setRealTimeBalances(initialBalances);

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
                  <p className="flex items-center text-xs text-red-300">
                    {userProfile?.currentPlan}
                    <FaCheckCircle className="text-green-400 ml-1" />
                  </p>
                </div>
              </button>
  
              <AnimatePresence>
                {showPortfolios && (
                  <motion.div
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 5 }}
                    className="absolute left-0 mt-2 w-[280px] md:w-96 rounded-xl shadow-2xl bg-white/95  border border-red-100"
                    onMouseEnter={() => setShowPortfolios(true)}
                    onMouseLeave={() => setShowPortfolios(false)}
                  >
                    <div className="p-4">
                      <div className="bg-gradient-to-r from-red-600 to-red-800 p-4 rounded-lg text-white">
                        <div className="flex items-center justify-between mb-3">
                          <div>
                            <h3 className="text-sm font-bold">
                              {userProfile?.currentPlan}
                            </h3>
                            <p className="text-xs opacity-90">
                              Initial: ${userProfile?.totalInvestment?.toLocaleString()}
                            </p>
                          </div>
                          <FaWallet className="h-6 w-6" />
                        </div>
  
                        <div className="grid grid-cols-2 gap-4 mb-3">
                          <div>
                            <p className="text-xs opacity-75">Current Balance</p>
                            <p className="text-sm font-bold">
                              ${parseFloat(realTimeBalances.mainBalance).toLocaleString()}
                            </p>
                          </div>
                          <div>
                            <p className="text-xs opacity-75">Daily Return</p>
                            <p className="text-sm font-bold">
                              +${(parseFloat(realTimeBalances.dailyEarning) + parseFloat(realTimeBalances.dailyBonus)).toLocaleString()}
                            </p>
                          </div>
                        </div>
  
                        <div className="mt-2">
                          <div className="flex items-center justify-between text-xs mb-1">
                            <span>Weekly ROI</span>
                            <span className="flex items-center text-green-300">
                              <FaArrowUp className="mr-1 h-2 w-2" />
                              {realTimeBalances.weeklyPercentage}%
                            </span>
                          </div>
                        </div>
                      </div>
  
                      <div className="mt-4 grid grid-cols-2 gap-4 text-xs">
                        <div>
                          <p className="text-gray-500">Total Invested</p>
                          <p className="font-bold text-gray-900">
                            ${userProfile?.totalInvestment?.toLocaleString()}
                          </p>
                        </div>
                        <div>
                          <p className="text-gray-500">Total Earnings</p>
                          <p className="font-bold text-green-600">
                            +${parseFloat(realTimeBalances.totalEarnings).toLocaleString()}
                          </p>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
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
                      className="absolute right-0 mt-2 w-72 rounded-xl shadow-2xl bg-white/95  border border-red-100"
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
  
                        <div className="mt-3 p-3 bg-gradient-to-r from-red-50 to-red-100 rounded-lg">
                          <p className="text-xs font-semibold text-red-600">Investment Summary</p>
                          <div className="mt-2 grid grid-cols-2 gap-3 text-xs text-gray-600">
                            <div>
                              <p>Total Invested</p>
                              <p className="font-semibold">
                                ${userProfile?.totalInvestment?.toLocaleString()}
                              </p>
                            </div>
                            <div>
                              <p>Total Earnings</p>
                              <p className="font-semibold text-green-600">
                                +${parseFloat(realTimeBalances.totalEarnings).toLocaleString()}
                              </p>
                            </div>
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
      </div>
    </header>
  );
  
}

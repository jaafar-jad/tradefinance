"use client";
import { useState } from "react";
import {
  FaBell,
  FaSearch,
  FaUserCircle,
  FaWallet,
  FaBitcoin,
  FaEthereum,
  FaRocket,
  FaCrown,
  FaGem,
  FaSubscript,
} from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import NotificationDropdown from "@/components/ui/NotificationDropdown/NotificationDropdown";
import SignOutButton from "@/components/ui/SignOutButton/SignOutButton";
const portfolios = [
  {
    name: "Starter Weekly",
    symbol: "STW",
    balance: "100.00 - 999.00",
    roi: "3% Weekly",
    icon: FaRocket,
    color: "from-red-500 to-red-400",
  },
  {
    name: "Professional Monthly",
    symbol: "PRM",
    balance: "3,000.00 - 9,999.00",
    roi: "10% Monthly",
    icon: FaCrown,
    color: "from-red-700 to-red-600",
  },
  {
    name: "Expert Quarterly",
    symbol: "EXQ",
    balance: "10,000.00 - 49,999.00",
    roi: "33.33% Monthly",
    icon: FaGem,
    color: "from-red-800 to-red-700",
  },
  {
    name: "Enterprise Annual",
    symbol: "ENT",
    balance: "50,000.00+",
    roi: "25% Monthly",
    icon: FaGem,
    color: "from-black to-red-900",
  },
];

export default function Header({ onMenuClick }) {
  const [showProfile, setShowProfile] = useState(false);
  const [showPortfolios, setShowPortfolios] = useState(false);

  return (
    <header className="bg-white shadow-sm fixed top-0 right-0 left-0 lg:left-20 z-30">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          <div className="flex-1 flex items-center justify-between">
            {/* Portfolios Dropdown */}
            <div className="flex-1 flex items-center justify-between">
              <div className="relative">
                <button
                  onMouseEnter={() => setShowPortfolios(true)}
                  onMouseLeave={() => setShowPortfolios(false)}
                  className="flex items-center space-x-1 px-2 py-1 rounded-md hover:bg-gray-50"
                >
                  <FaWallet className="h-8 w-8 text-red-600" />
                 
                </button>

                <AnimatePresence>
                  {showPortfolios && (
                    <motion.div
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 5 }}
                      className="absolute left-0 mt-1 w-56 rounded-md shadow-md bg-white ring-1 ring-black ring-opacity-5"
                      onMouseEnter={() => setShowPortfolios(true)}
                      onMouseLeave={() => setShowPortfolios(false)}
                    >
                      {portfolios.map((portfolio, index) => (
                        <motion.div
                          key={portfolio.symbol}
                          className={`p-2 ${
                            index !== portfolios.length - 1
                              ? "border-b border-gray-100"
                              : ""
                          }`}
                          whileHover={{ scale: 1.01 }}
                        >
                          <div
                            className={`bg-gradient-to-r ${portfolio.color} p-2 rounded-md text-white`}
                          >
                            <div className="flex items-center justify-between">
                              <div>
                                <h3 className="text-xs font-semibold">
                                  {portfolio.name}
                                </h3>
                                <p className="text-[0.65rem] opacity-90">
                                  {portfolio.symbol}
                                </p>
                              </div>
                              <portfolio.icon className="h-5 w-5" />
                            </div>
                            <p className="mt-1 text-sm font-bold">
                              ${portfolio.balance}
                            </p>
                          </div>
                        </motion.div>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            <div className="flex items-center space-x-6">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search..."
                  className="w-full sm:w-44 pl-10 pr-4 py-1 md:py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                />
                <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              </div>

              <div className="relative">
                <NotificationDropdown>
                  <button className="relative p-2 text-gray-600 hover:text-gray-900">
                    <FaBell className="h-6 w-6" />
                    <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-500 ring-2 ring-white" />
                  </button>
                </NotificationDropdown>
              </div>

              <div className="relative">
                <button
                  onMouseEnter={() => setShowProfile(true)}
                  onMouseLeave={() => setShowProfile(false)}
                  className="flex items-center space-x-3 focus:outline-none"
                >
                  <div className="relative w-10 h-10 rounded-full overflow-hidden bg-gradient-to-r from-red-500 to-red-600 p-[2px]">
                    <Image
                      src="/path-to-profile-image.jpg" // Add your profile image path
                      alt="Profile"
                      layout="fill"
                      className="rounded-full"
                    />
                  </div>
                </button>

                <AnimatePresence>
                  {showProfile && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="absolute right-0 mt-2 w-72 rounded-lg shadow-lg bg-white ring-1 ring-black ring-opacity-5"
                      onMouseEnter={() => setShowProfile(true)}
                      onMouseLeave={() => setShowProfile(false)}
                    >
                      <div className="p-4 border-b">
                        <div className="flex items-center space-x-3">
                          <div className="relative w-16 h-16 rounded-full overflow-hidden bg-gradient-to-r from-red-500 to-red-600 p-[2px]">
                            <Image
                              src="/path-to-profile-image.jpg" // Add your profile image path
                              alt="Profile"
                              layout="fill"
                              className="rounded-full"
                            />
                          </div>
                          <div>
                            <h3 className="font-semibold text-gray-900">
                              John Doe
                            </h3>
                            <p className="text-sm text-gray-500">
                              john@example.com
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="">
                       
                        <div className="py-2">
                          <a
                            href="/dashboard/routes/profile/settings/profile"
                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-red-50 hover:text-red-600"
                          >
                            Profile
                          </a>
                          <SignOutButton />
                        </div>{" "}
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

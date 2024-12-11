"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import {
  FaRocket,
  FaChartLine,
  FaCrown,
  FaGem,
  FaCalculator,
  FaUsers,
  FaUserFriends,
} from "react-icons/fa";
import dynamic from "next/dynamic";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { investmentPlans } from "@/config/investmentPlans";

const plans = [
  // Single Plans
  {
    name: investmentPlans.single.starter.name,
    icon: <FaRocket className="text-4xl text-white" />,
    duration: `${investmentPlans.single.starter.duration} Months`,
    roi: `${investmentPlans.single.starter.roi}% Total ROI`,
    monthlyRoi: `${investmentPlans.single.starter.dailyBonus}% Daily`,
    minimum: `$${investmentPlans.single.starter.minAmount}`,
    maximum: `$${investmentPlans.single.starter.maxAmount}`,
    referral: "5%",
    features: [
      `${investmentPlans.single.starter.dailyBonus}% Daily Bonus`,
      "Basic Portfolio Access",
      "Email Support",
      "Basic Trading Tools",
    ],
    color: "from-red-500 to-red-400",
    popular: false,
    category: "single",
  },
  {
    name: investmentPlans.single.basic.name,
    icon: <FaChartLine className="text-4xl text-white" />,
    duration: `${investmentPlans.single.basic.duration} Months`,
    roi: `${investmentPlans.single.basic.roi}% Total ROI`,
    monthlyRoi: `${investmentPlans.single.basic.dailyBonus}% Daily`,
    minimum: `$${investmentPlans.single.basic.minAmount}`,
    maximum: `$${investmentPlans.single.basic.maxAmount}`,
    referral: "5%",
    features: [
      `${investmentPlans.single.basic.dailyBonus}% Daily Bonus`,
      "Enhanced Portfolio Tools",
      "Priority Support",
      "Advanced Trading Features",
    ],
    color: "from-red-600 to-red-500",
    popular: true,
    category: "single",
  },
  {
    name: investmentPlans.single.premium.name,
    icon: <FaCrown className="text-4xl text-white" />,
    duration: `${investmentPlans.single.premium.duration} Months`,
    roi: `${investmentPlans.single.premium.roi}% Total ROI`,
    monthlyRoi: `${investmentPlans.single.premium.dailyBonus}% Daily`,
    minimum: `$${investmentPlans.single.premium.minAmount}`,
    maximum: `$${
      investmentPlans.single.premium.maxAmount === Infinity
        ? "Unlimited"
        : `$${investmentPlans.single.premium.maxAmount}`
    }`,
    referral: "5%",
    features: [
      `${investmentPlans.single.premium.dailyBonus}% Daily Bonus`,
      "Premium Trading Suite",
      "VIP Support",
      "Advanced AI Trading",
      "Custom Strategies",
    ],
    color: "from-red-700 to-red-600",
    popular: false,
    category: "single",
  },

  // Couple Plans
  {
    name: investmentPlans.couple.starter.name,
    icon: <FaUsers className="text-4xl text-white" />,
    duration: `${investmentPlans.couple.starter.duration} Months`,
    roi: `${investmentPlans.couple.starter.roi}% Total ROI`,
    monthlyRoi: `${investmentPlans.couple.starter.dailyBonus}% Daily`,
    minimum: `$${investmentPlans.couple.starter.minAmount}`,
    maximum: `$${investmentPlans.couple.starter.maxAmount}`,
    referral: "5%",
    features: [
      `${investmentPlans.couple.starter.dailyBonus}% Daily Bonus`,
      `${investmentPlans.couple.starter.coupleBonus}% Couple Bonus`,
      "Joint Portfolio Access",
      "Couple Support",
    ],
    color: "from-red-500 to-red-400",
    popular: false,
    category: "couple",
  },
  {
    name: investmentPlans.couple.basic.name,
    icon: <FaUserFriends className="text-4xl text-white" />,
    duration: `${investmentPlans.couple.basic.duration} Months`,
    roi: `${investmentPlans.couple.basic.roi}% Total ROI`,
    monthlyRoi: `${investmentPlans.couple.basic.dailyBonus}% Daily`,
    minimum: `$${investmentPlans.couple.basic.minAmount}`,
    maximum: `$${investmentPlans.couple.basic.maxAmount}`,
    referral: "5%",
    features: [
      `${investmentPlans.couple.basic.dailyBonus}% Daily Bonus`,
      `${investmentPlans.couple.basic.coupleBonus}% Couple Bonus`,
      "Enhanced Joint Tools",
      "Priority Couple Support",
    ],
    color: "from-red-600 to-red-500",
    popular: true,
    category: "couple",
  },
  {
    name: investmentPlans.couple.premium.name,
    icon: <FaGem className="text-4xl text-white" />,
    duration: `${investmentPlans.couple.premium.duration} Months`,
    roi: `${investmentPlans.couple.premium.roi}% Total ROI`,
    monthlyRoi: `${investmentPlans.couple.premium.dailyBonus}% Daily`,
    minimum: `$${investmentPlans.couple.premium.minAmount}`,
    maximum: `${
      investmentPlans.couple.premium.maxAmount === Infinity
        ? "Unlimited"
        : `$${investmentPlans.couple.premium.maxAmount}`
    }`,
    referral: "5%",
    features: [
      `${investmentPlans.couple.premium.dailyBonus}% Daily Bonus`,
      `${investmentPlans.couple.premium.coupleBonus}% Couple Bonus`,
      "Premium Couple Suite",
      "VIP Couple Benefits",
      "Advanced Joint Trading",
    ],
    color: "from-red-700 to-red-600",
    popular: false,
    category: "couple",
  },
];

const chartData = [
  {
    period: "Month 1",
    [investmentPlans.single.starter.name]:
      investmentPlans.single.starter.dailyBonus * 30,
    [investmentPlans.single.basic.name]:
      investmentPlans.single.basic.dailyBonus * 30,
    [investmentPlans.single.premium.name]:
      investmentPlans.single.premium.dailyBonus * 30,
    [investmentPlans.couple.starter.name]:
      investmentPlans.couple.starter.dailyBonus * 30,
    [investmentPlans.couple.basic.name]:
      investmentPlans.couple.basic.dailyBonus * 30,
    [investmentPlans.couple.premium.name]:
      investmentPlans.couple.premium.dailyBonus * 30,
  },
  {
    period: "Month 2",
    [investmentPlans.single.starter.name]:
      investmentPlans.single.starter.dailyBonus * 60,
    [investmentPlans.single.basic.name]:
      investmentPlans.single.basic.dailyBonus * 60,
    [investmentPlans.single.premium.name]:
      investmentPlans.single.premium.dailyBonus * 60,
    [investmentPlans.couple.starter.name]:
      investmentPlans.couple.starter.dailyBonus * 60,
    [investmentPlans.couple.basic.name]:
      investmentPlans.couple.basic.dailyBonus * 60,
    [investmentPlans.couple.premium.name]:
      investmentPlans.couple.premium.dailyBonus * 60,
  },
  {
    period: "Month 4",
    [investmentPlans.single.starter.name]:
      investmentPlans.single.starter.dailyBonus * 120,
    [investmentPlans.single.basic.name]:
      investmentPlans.single.basic.dailyBonus * 120,
    [investmentPlans.single.premium.name]:
      investmentPlans.single.premium.dailyBonus * 120,
    [investmentPlans.couple.starter.name]:
      investmentPlans.couple.starter.dailyBonus * 120,
    [investmentPlans.couple.basic.name]:
      investmentPlans.couple.basic.dailyBonus * 120,
    [investmentPlans.couple.premium.name]:
      investmentPlans.couple.premium.dailyBonus * 120,
  },
  {
    period: "Month 6",
    [investmentPlans.single.starter.name]:
      investmentPlans.single.starter.dailyBonus * 180,
    [investmentPlans.single.basic.name]:
      investmentPlans.single.basic.dailyBonus * 180,
    [investmentPlans.single.premium.name]:
      investmentPlans.single.premium.dailyBonus * 180,
    [investmentPlans.couple.starter.name]:
      investmentPlans.couple.starter.dailyBonus * 180,
    [investmentPlans.couple.basic.name]:
      investmentPlans.couple.basic.dailyBonus * 180,
    [investmentPlans.couple.premium.name]:
      investmentPlans.couple.premium.dailyBonus * 180,
  },
];

export default function HomePlans() {
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [investment, setInvestment] = useState("");

  const calculateReturns = (amount, plan) => {
    if (!amount) return 0;

    const principal = parseFloat(amount);
    const dailyReturn = principal * (plan.dailyBonus / 100);
    const daysInPeriod = plan.duration * 30;
    const totalDailyReturns = dailyReturn * daysInPeriod;

    // Base ROI (150% for all plans)
    const baseROI = principal * 1.5;

    // Add couple bonus if applicable
    if (plan.accountType === "couple") {
      const coupleBonus = (principal * plan.coupleBonus) / 100;
      return (baseROI + totalDailyReturns + coupleBonus).toFixed(2);
    }

    return (baseROI + totalDailyReturns).toFixed(2);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Plans Grid */}
      <section className="py-8">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl md:text-4xl my-4 font-bold text-center mb-12 bg-gradient-to-r from-gray-900 via-red-900 to-gray-900 text-white py-6 rounded-lg shadow-lg">
            Investment Plans
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {plans.map((plan, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className={`relative bg-white rounded-2xl shadow-xl overflow-hidden ${
                  plan.popular ? "ring-2 ring-red-600" : ""
                }`}
              >
                <div className={`bg-gradient-to-r ${plan.color} p-6`}>
                  <div className="flex items-center justify-between gap-4">
                    <span className="flex-shrink-0">{plan.icon}</span>
                    <p className="text-white opacity-90">{plan.duration}</p>
                  </div>

                  <h3 className="text-2xl font-bold text-white mb-2">
                    {plan.name}
                  </h3>
                  {plan.popular && (
                    <div className="absolute text-center center-6 right-0 left-0 bg-red-600 text-white px-3 py-1 rounded-full text-sm">
                      Popular
                    </div>
                  )}
                </div>

                <div className="p-6 space-y-6">
                  <div className="text-center">
                    <p className="text-3xl font-bold text-gray-900 mb-2">
                      {plan.roi}
                    </p>
                    <p className="text-gray-600">{plan.monthlyRoi}</p>
                  </div>
                  <div className="space-y-2">
                    <p className="flex justify-between text-gray-600">
                      <span>Minimum</span>
                      <span className="font-semibold text-gray-900">
                        {plan.minimum}
                      </span>
                    </p>
                    <p className="flex justify-between text-gray-600">
                      <span>Maximum</span>
                      <span className="font-semibold text-gray-900">
                        {plan.maximum}
                      </span>
                    </p>
                    <p className="flex justify-between text-gray-600">
                      <span>Referral Bonus</span>
                      <span className="font-semibold text-gray-900">
                        {plan.referral}
                      </span>
                    </p>
                  </div>
                  <div className="space-y-3">
                    {plan.features.map((feature, i) => (
                      <p key={i} className="flex items-center text-gray-600">
                        <span className="w-2 h-2 bg-red-600 rounded-full mr-2" />
                        {feature}
                      </p>
                    ))}
                  </div>
                  <div className="pt-4">
                    <a
                      href="/auth/signup"
                      className="block w-full text-center px-4 bg-red-600 text-white py-3 rounded-lg hover:bg-red-700 transition-colors duration-300"
                    >
                      Invest Now
                    </a>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ROI Chart */}
      <section className="py-8 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl my-4 font-bold text-center mb-12 bg-gradient-to-r from-gray-900 via-red-900 to-gray-900 text-white py-6 rounded-lg shadow-lg">
            Projected Returns Over Time
          </h2>
          <div className="h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="period" />
                <YAxis />
                <Tooltip />
                {/* Single Plans */}
                <Line
                  type="monotone"
                  dataKey={investmentPlans.single.starter.name}
                  stroke="#DC2626"
                />
                <Line
                  type="monotone"
                  dataKey={investmentPlans.single.basic.name}
                  stroke="#991B1B"
                />
                <Line
                  type="monotone"
                  dataKey={investmentPlans.single.premium.name}
                  stroke="#7F1D1D"
                />
                {/* Couple Plans */}
                <Line
                  type="monotone"
                  dataKey={investmentPlans.couple.starter.name}
                  stroke="#1D4ED8"
                />
                <Line
                  type="monotone"
                  dataKey={investmentPlans.couple.basic.name}
                  stroke="#1E40AF"
                />
                <Line
                  type="monotone"
                  dataKey={investmentPlans.couple.premium.name}
                  stroke="#1E3A8A"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </section>

      {/* Calculator Section */}
      <section className="py-4 md:py-8 bg-gradient-to-br from-slate-900 via-gray-900 to-red-900">
        <div className="container mx-auto px-3 md:px-4">
          <div className="max-w-2xl mx-auto">
            <div className="text-center mb-2 md:mb-4">
              <h2 className="text-2xl md:text-3xl font-bold text-white mb-2 md:mb-4">
                <FaCalculator className="text-2xl md:text-5xl text-red-500 mx-auto mb-3 md:mb-4 animate-pulse" />
                Investment Calculator
              </h2>

              <p className="text-sm md:text-base text-justify text-gray-300">
                Calculate your potential returns based on investment amount
              </p>
            </div>

            <div className="bg-white rounded-xl md:rounded-2xl p-4 md:p-8 shadow-xl border border-red-100">
              <div className="space-y-4 md:space-y-6">
                <div>
                  <label className="block text-gray-700 text-sm md:text-base mb-2 font-medium">
                    Investment Amount ($)
                  </label>
                  <input
                    type="number"
                    value={investment}
                    onChange={(e) => setInvestment(e.target.value)}
                    className="w-full border-2 border-gray-200 rounded-lg px-3 py-2 md:px-4 md:py-3 
    focus:ring-2 focus:ring-red-500 focus:border-transparent
    text-sm md:text-base transition-all duration-300
    text-gray-900 font-medium
    [appearance:textfield]
    [&::-webkit-outer-spin-button]:appearance-none
    [&::-webkit-inner-spin-button]:appearance-none"
                    placeholder="Enter amount"
                  />
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-2 gap-3 md:gap-6">
                  {plans.map((plan, index) => {
                    // Get the corresponding investment plan data
                    const planData =
                      plan.category === "single"
                        ? investmentPlans.single[
                            plan.name.toLowerCase().split(" ")[0]
                          ]
                        : investmentPlans.couple[
                            plan.name.toLowerCase().split(" ")[1]
                          ];

                    return (
                      <div
                        key={index}
                        className="bg-gradient-to-br from-gray-50 to-gray-100 p-3 md:p-4 
        rounded-lg border border-gray-200 hover:border-red-200 
        transition-all duration-300 hover:shadow-md"
                      >
                        <h3 className="font-semibold text-gray-900 text-xs md:text-base mb-1 md:mb-2">
                          {plan.name}
                        </h3>
                        <p className="text-[0.7rem] md:text-2xl overflow-x-auto font-bold text-red-600">
                          ${calculateReturns(investment, planData)}
                        </p>
                        <p className="text-xs md:text-sm text-gray-600">
                          Total Return
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

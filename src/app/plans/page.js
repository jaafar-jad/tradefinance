"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import Head from "next/head";
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

  // joint Plans
  {
    name: investmentPlans.joint.starter.name,
    icon: <FaUsers className="text-4xl text-white" />,
    duration: `${investmentPlans.joint.starter.duration} Months`,
    roi: `${investmentPlans.joint.starter.roi}% Total ROI`,
    monthlyRoi: `${investmentPlans.joint.starter.dailyBonus}% Daily`,
    minimum: `$${investmentPlans.joint.starter.minAmount}`,
    maximum: `$${investmentPlans.joint.starter.maxAmount}`,
    referral: "5%",
    features: [
      `${investmentPlans.joint.starter.dailyBonus}% Daily Bonus`,
      `${investmentPlans.joint.starter.jointBonus}% joint Bonus`,
      "Joint Portfolio Access",
      "joint Support",
    ],
    color: "from-red-500 to-red-400",
    popular: false,
    category: "joint",
  },
  {
    name: investmentPlans.joint.basic.name,
    icon: <FaUserFriends className="text-4xl text-white" />,
    duration: `${investmentPlans.joint.basic.duration} Months`,
    roi: `${investmentPlans.joint.basic.roi}% Total ROI`,
    monthlyRoi: `${investmentPlans.joint.basic.dailyBonus}% Daily`,
    minimum: `$${investmentPlans.joint.basic.minAmount}`,
    maximum: `$${investmentPlans.joint.basic.maxAmount}`,
    referral: "5%",
    features: [
      `${investmentPlans.joint.basic.dailyBonus}% Daily Bonus`,
      `${investmentPlans.joint.basic.jointBonus}% joint Bonus`,
      "Enhanced Joint Tools",
      "Priority joint Support",
    ],
    color: "from-red-600 to-red-500",
    popular: true,
    category: "joint",
  },
  {
    name: investmentPlans.joint.premium.name,
    icon: <FaGem className="text-4xl text-white" />,
    duration: `${investmentPlans.joint.premium.duration} Months`,
    roi: `${investmentPlans.joint.premium.roi}% Total ROI`,
    monthlyRoi: `${investmentPlans.joint.premium.dailyBonus}% Daily`,
    minimum: `$${investmentPlans.joint.premium.minAmount}`,
    maximum: `${
      investmentPlans.joint.premium.maxAmount === Infinity
        ? "Unlimited"
        : `$${investmentPlans.joint.premium.maxAmount}`
    }`,
    referral: "5%",
    features: [
      `${investmentPlans.joint.premium.dailyBonus}% Daily Bonus`,
      `${investmentPlans.joint.premium.jointBonus}% joint Bonus`,
      "Premium joint Suite",
      "VIP joint Benefits",
      "Advanced Joint Trading",
    ],
    color: "from-red-700 to-red-600",
    popular: false,
    category: "joint",
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
    [investmentPlans.joint.starter.name]:
      investmentPlans.joint.starter.dailyBonus * 30,
    [investmentPlans.joint.basic.name]:
      investmentPlans.joint.basic.dailyBonus * 30,
    [investmentPlans.joint.premium.name]:
      investmentPlans.joint.premium.dailyBonus * 30,
  },
  {
    period: "Month 2",
    [investmentPlans.single.starter.name]:
      investmentPlans.single.starter.dailyBonus * 60,
    [investmentPlans.single.basic.name]:
      investmentPlans.single.basic.dailyBonus * 60,
    [investmentPlans.single.premium.name]:
      investmentPlans.single.premium.dailyBonus * 60,
    [investmentPlans.joint.starter.name]:
      investmentPlans.joint.starter.dailyBonus * 60,
    [investmentPlans.joint.basic.name]:
      investmentPlans.joint.basic.dailyBonus * 60,
    [investmentPlans.joint.premium.name]:
      investmentPlans.joint.premium.dailyBonus * 60,
  },
  {
    period: "Month 4",
    [investmentPlans.single.starter.name]:
      investmentPlans.single.starter.dailyBonus * 120,
    [investmentPlans.single.basic.name]:
      investmentPlans.single.basic.dailyBonus * 120,
    [investmentPlans.single.premium.name]:
      investmentPlans.single.premium.dailyBonus * 120,
    [investmentPlans.joint.starter.name]:
      investmentPlans.joint.starter.dailyBonus * 120,
    [investmentPlans.joint.basic.name]:
      investmentPlans.joint.basic.dailyBonus * 120,
    [investmentPlans.joint.premium.name]:
      investmentPlans.joint.premium.dailyBonus * 120,
  },
  {
    period: "Month 6",
    [investmentPlans.single.starter.name]:
      investmentPlans.single.starter.dailyBonus * 180,
    [investmentPlans.single.basic.name]:
      investmentPlans.single.basic.dailyBonus * 180,
    [investmentPlans.single.premium.name]:
      investmentPlans.single.premium.dailyBonus * 180,
    [investmentPlans.joint.starter.name]:
      investmentPlans.joint.starter.dailyBonus * 180,
    [investmentPlans.joint.basic.name]:
      investmentPlans.joint.basic.dailyBonus * 180,
    [investmentPlans.joint.premium.name]:
      investmentPlans.joint.premium.dailyBonus * 180,
  },
];

export default function Plans() {
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [investment, setInvestment] = useState("");


  const calculateReturns = (amount, plan) => {
    if (!amount) return 0;
  
    const principal = parseFloat(amount);
    const dailyReturn = principal * (plan.dailyBonus / 100);
    const daysInPeriod = plan.duration * 30;
    const totalDailyReturns = dailyReturn * daysInPeriod;
  
    // Base ROI (200% for all plans)
    const baseROI = principal * 2; // Changed from 1.5 to 2 for 200% ROI
  
    // Add joint bonus if applicable
    if (plan.accountType === "joint" || plan.accountType === "Joint") {
      const jointBonus = (principal * plan.jointBonus) / 100;
      return (baseROI + totalDailyReturns + jointBonus).toFixed(2);
    }
  
    return (baseROI + totalDailyReturns).toFixed(2);
  };
  

  return (
    <>
      <Head>
        <title>
          Investment Plans | Trade Finance - Single & joint Investment Options
        </title>
        <meta
          name="description"
          content="Explore Trade Finance's diverse investment plans with ROIs up to 200%. Choose from Single and joint plans starting from $100. Calculate potential returns with our investment calculator."
        />

        {/* Open Graph */}
        <meta property="og:title" content="Investment Plans | Trade Finance" />
        <meta
          property="og:description"
          content="Discover our range of investment plans with daily bonuses, referral rewards, and premium trading features. Start investing from $100."
        />
        <meta property="og:type" content="website" />
        <meta property="og:image" content="/investment-plans.png" />

        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Trade Finance Investment Plans" />
        <meta
          name="twitter:description"
          content="Single & joint investment plans with daily bonuses and premium trading features. Use our ROI calculator to plan your investment."
        />

        {/* Additional SEO */}
        <meta
          name="keywords"
          content="investment plans, trading ROI, joint investment, single investment, investment calculator, daily bonus, trading platform, investment returns"
        />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href="https://tradefinancetf.com/plans" />

        {/* Structured Data */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Product",
            name: "Trade Finance Investment Plans",
            description:
              "Investment plans for singles and joint with daily bonuses and premium trading features",
            offers: {
              "@type": "AggregateOffer",
              lowPrice: "500",
              highPrice: "unlimitted",
              priceCurrency: "USD",
            },
          })}
        </script>
      </Head>
      <div className="min-h-screen bg-gray-50">
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-red-800 via-black to-red-900 fr h-[30vh] md:h-[80vh] pt-32 md:pt-60">
          <div className="container mx-auto px-4">
            <div className="text-center max-w-3xl mx-auto">
              <h1 className="text-2xl md:text-5xl font-bold text-white mb-6">
                Investment Plans
              </h1>
              <p className="text-gray-400 text-sm md:text-xl px-4 md:px-0">
                Invest smarter today for a comfortable tomorrow.
              </p>
            </div>
          </div>
        </section>

        {/* ROI Chart */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl my-4 font-bold text-center mb-12 bg-red-600 text-white py-6 rounded-lg shadow-lg">
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
                  {/* joint Plans */}
                  <Line
                    type="monotone"
                    dataKey={investmentPlans.joint.starter.name}
                    stroke="#1D4ED8"
                  />
                  <Line
                    type="monotone"
                    dataKey={investmentPlans.joint.basic.name}
                    stroke="#1E40AF"
                  />
                  <Line
                    type="monotone"
                    dataKey={investmentPlans.joint.premium.name}
                    stroke="#1E3A8A"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </section>

        {/* Plans Grid */}
        <section className="py-20">
          <div className="container mx-auto px-4">
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
                          : investmentPlans.joint[
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
    </>
  );
}

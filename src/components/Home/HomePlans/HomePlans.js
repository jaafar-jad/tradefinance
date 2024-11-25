"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import {
  FaRocket,
  FaChartLine,
  FaCrown,
  FaGem,
  FaCalculator,
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
const Chart = dynamic(
  () =>
    import("recharts").then((mod) => ({
      LineChart: mod.LineChart,
      Line: mod.Line,
      XAxis: mod.XAxis,
      YAxis: mod.YAxis,
      CartesianGrid: mod.CartesianGrid,
      Tooltip: mod.Tooltip,
      ResponsiveContainer: mod.ResponsiveContainer,
    })),
  { ssr: false }
);

const plans = [
  // Small Plans (Weekly)
  {
    name: "Starter Weekly",
    icon: <FaRocket className="text-4xl text-white" />,
    duration: "1 Week",
    roi: "3% Weekly ROI",
    weeklyRoi: "3%",
    minimum: "$100",
    maximum: "$999",
    referral: "5%",
    features: [
      "Basic Portfolio Access",
      "Weekly Market Updates",
      "Email Support",
      "Basic Trading Tools",
    ],
    color: "from-red-500 to-red-400",
    popular: false,
    category: "small",
  },
  {
    name: "Growth Weekly",
    icon: <FaChartLine className="text-4xl text-white" />,
    duration: "2 Weeks",
    roi: "7% Total ROI",
    weeklyRoi: "3.5%",
    minimum: "$1,000",
    maximum: "$2,999",
    referral: "5%",
    features: [
      "Enhanced Portfolio Tools",
      "Bi-Weekly Reports",
      "Priority Email Support",
      "Advanced Charts",
    ],
    color: "from-red-600 to-red-500",
    popular: false,
    category: "small",
  },
  // Medium Plans (1-3 Months)
  {
    name: "Professional Monthly",
    icon: <FaCrown className="text-4xl text-white" />,
    duration: "1-3 Months",
    roi: "30% Total ROI",
    monthlyRoi: "10%",
    minimum: "$3,000",
    maximum: "$9,999",
    referral: "5%",
    features: [
      "Professional Trading Suite",
      "Monthly Strategy Review",
      "24/7 Support Access",
      "Risk Management Tools",
      "Portfolio Rebalancing",
    ],
    color: "from-red-700 to-red-600",
    popular: false,
    category: "medium",
  },
  {
    name: "Expert Quarterly",
    icon: <FaGem className="text-4xl text-white" />,
    duration: "3 Months",
    roi: "100% Total ROI",
    monthlyRoi: "33.33%",
    minimum: "$10,000",
    maximum: "$49,999",
    referral: "5%",
    features: [
      "Expert Trading Systems",
      "Quarterly Performance Review",
      "VIP Support Channel",
      "Advanced AI Trading",
      "Custom Strategies",
    ],
    color: "from-red-800 to-red-700",
    popular: false,
    category: "medium",
  },
  // Large Plans (3-12 Months)
  {
    name: "Enterprise Annual",
    icon: <FaGem className="text-4xl text-white" />,
    duration: "6-12 Months",
    roi: "300% Total ROI",
    monthlyRoi: "25%",
    minimum: "$50,000",
    maximum: "Unlimited",
    referral: "5%",
    features: [
      "Enterprise-Grade Tools",
      "Dedicated Account Manager",
      "Custom API Access",
      "Institutional Trading",
      "Tax Advisory",
      "Private Events Access",
    ],
    color: "from-black to-red-900",
    popular: true,
    category: "large",
  },
];

const chartData = [
  // Weekly tracking
  {
    period: "Week 1",
    Starter: 3,
    Growth: 3.5,
    Professional: 2.5,
    Expert: 8.3,
    Enterprise: 6.25,
  },
  {
    period: "Week 2",
    Starter: 6,
    Growth: 7,
    Professional: 5,
    Expert: 16.6,
    Enterprise: 12.5,
  },

  // Monthly tracking
  {
    period: "Month 1",
    Starter: 12,
    Growth: 14,
    Professional: 10,
    Expert: 33.3,
    Enterprise: 25,
  },
  {
    period: "Month 3",
    Starter: 36,
    Growth: 42,
    Professional: 30,
    Expert: 100,
    Enterprise: 75,
  },
  {
    period: "Month 6",
    Starter: 72,
    Growth: 84,
    Professional: 60,
    Expert: 200,
    Enterprise: 150,
  },

  // Annual tracking
  {
    period: "Month 9",
    Starter: 108,
    Growth: 126,
    Professional: 90,
    Expert: 300,
    Enterprise: 225,
  },
  {
    period: "Month 12",
    Starter: 144,
    Growth: 168,
    Professional: 120,
    Expert: 400,
    Enterprise: 300,
  },
];

export default function HomePlans() {
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [investment, setInvestment] = useState("");

  const calculateReturns = (amount, roi) => {
    if (!amount) return 0;
    return ((parseFloat(amount) * parseFloat(roi)) / 100).toFixed(2);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Plans Grid */}
      <section className="py-8">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl md:text-4xl my-4 font-bold text-center mb-12 bg-gradient-to-r from-gray-900 via-red-900 to-gray-900 text-white py-6 rounded-lg shadow-lg">
            Investment Plans
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
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
                {plan.popular && (
                  <div className="absolute top-4 right-4 bg-red-600 text-white px-3 py-1 rounded-full text-sm">
                    Popular
                  </div>
                )}
                <div className={`bg-gradient-to-r ${plan.color} p-6`}>
                  <div className="flex items-center justify-between gap-4">
                    <span className="flex-shrink-0">{plan.icon}</span>
                    <p className="text-white opacity-90">{plan.duration}</p>
                  </div>

                  <h3 className="text-2xl font-bold text-white mb-2">
                    {plan.name}
                  </h3>
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
                <Line type="monotone" dataKey="Starter" stroke="#DC2626" />
                <Line type="monotone" dataKey="Growth" stroke="#991B1B" />
                <Line type="monotone" dataKey="Professional" stroke="#7F1D1D" />
                <Line type="monotone" dataKey="Expert" stroke="#450A0A" />
                <Line type="monotone" dataKey="Enterprise" stroke="#000000" />
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
                text-sm md:text-base transition-all duration-300"
                    placeholder="Enter amount"
                  />
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-2 gap-3 md:gap-6">
                  {plans.map((plan, index) => (
                    <div
                      key={index}
                      className="bg-gradient-to-br from-gray-50 to-gray-100 p-3 md:p-4 
                  rounded-lg border border-gray-200 hover:border-red-200 
                  transition-all duration-300 hover:shadow-md"
                    >
                      <h3 className="font-semibold text-gray-900 text-xs md:text-base mb-1 md:mb-2">
                        {plan.name}
                      </h3>
                      <p className="text-[0.7rem]  md:text-2xl overflow-x-auto font-bold text-red-600">
                        ${calculateReturns(investment, parseInt(plan.roi))}
                      </p>
                      <p className="text-xs md:text-sm text-gray-600">
                        Total Return
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

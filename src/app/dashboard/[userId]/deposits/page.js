"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaBitcoin, FaFileInvoice, FaCopy, FaCamera, FaCheckCircle, FaHome } from "react-icons/fa";
import Image from "next/image";
import Link from "next/link";
import { investmentPlans } from '@/config/investmentPlans';
import Head from 'next/head'

export default function DepositPage() {
  const [formData, setFormData] = useState({
    email: "",
    amount: "",
    date: "",
    name: "",
    accountType: "single",
    planType: "starter",
  });
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [receipt, setReceipt] = useState(null);

  const btcAddress = "bc1qlhmjwm2s8mrgrv26eut5h7ey0e243g0rk5glus";
  const userString = localStorage.getItem('user');
  const user = JSON.parse(userString);

  const handlePlanChange = (e) => {
    const [accountType, planType] = e.target.value.split('-');
    const selectedPlan = investmentPlans[accountType][planType];
    setFormData({
      ...formData,
      accountType,
      planType,
      amount: selectedPlan.minAmount
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setStep(2);
    setLoading(false);
  };

  const handleCopyAddress = () => {
    navigator.clipboard.writeText(btcAddress);
    alert("Bitcoin address copied!");
  };

  const handleFileUpload = (e) => {
    setReceipt(e.target.files[0]);
    setStep(3);
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <motion.form
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-4"
            onSubmit={handleSubmit}
          >
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-900">Select Investment Plan</label>
              <select
                required
                className="w-full px-3 py-2 text-base font-semibold border text-gray-900 rounded-lg focus:ring-2 focus:ring-red-500"
                onChange={handlePlanChange}
                value={`${formData.accountType}-${formData.planType}`}
              >
                {Object.entries(investmentPlans).map(([accountType, plans]) =>
                  Object.entries(plans).map(([planType, plan]) => (
                    <option key={`${accountType}-${planType}`} value={`${accountType}-${planType}`}>
                      {plan.name} (${plan.minAmount.toLocaleString()} - {plan.maxAmount === Infinity ? '∞' : `$${plan.maxAmount.toLocaleString()}`})
                    </option>
                  ))
                )}
              </select>
            </div>
  
            <div className="bg-red-100 p-4 rounded-lg">
              <h4 className="font-bold text-red-900 mb-2 text-base">Selected Plan Details</h4>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <span className="text-gray-900 font-semibold">ROI:</span>
                  <span className="font-bold text-gray-900 ml-2">{investmentPlans[formData.accountType][formData.planType].roi}%</span>
                </div>
                <div>
                  <span className="text-gray-900 font-semibold">Duration:</span>
                  <span className="font-bold text-gray-900 ml-2">{investmentPlans[formData.accountType][formData.planType].duration} months</span>
                </div>
                <div>
                  <span className="text-gray-900 font-semibold">Daily Bonus:</span>
                  <span className="font-bold text-gray-900 ml-2">{investmentPlans[formData.accountType][formData.planType].dailyBonus}%</span>
                </div>
                {formData.accountType === 'couple' && (
                  <div>
                    <span className="text-gray-900 font-semibold">Couple Bonus:</span>
                    <span className="font-bold text-gray-900 ml-2">${investmentPlans[formData.accountType][formData.planType].coupleBonus}</span>
                  </div>
                )}
              </div>
            </div>
  
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-900">Email Address</label>
              <input
                type="email"
                required
                className="w-full px-3 py-2 text-base font-semibold border rounded-lg text-gray-900 focus:ring-2 focus:ring-red-500"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>
  
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-900">Amount ($)</label>
              <input
                type="number"
                required
                min={investmentPlans[formData.accountType][formData.planType].minAmount}
                max={investmentPlans[formData.accountType][formData.planType].maxAmount === Infinity ? "" : investmentPlans[formData.accountType][formData.planType].maxAmount}
                className="w-full px-3 py-2 text-base font-semibold border text-gray-900 rounded-lg focus:ring-2 focus:ring-red-500"
                value={formData.amount}
                onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
              />
            </div>
  
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-900">Date of Transaction</label>
              <input
                type="date"
                required
                className="w-full px-3 py-2 text-base font-semibold border rounded-lg text-gray-900 focus:ring-2 focus:ring-red-500"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              />
            </div>
  
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 text-base font-bold text-white rounded-lg bg-gradient-to-r from-red-600 to-red-800 hover:from-red-700 hover:to-red-900 focus:ring-2 focus:ring-red-500 focus:ring-offset-2 disabled:opacity-70"
            >
              {loading ? "Processing..." : "Make Deposit"}
            </button>
          </motion.form>
        );
  
      case 2:
        return (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-6"
          >
            <div className="bg-gradient-to-r from-red-100 to-red-200 p-4 rounded-lg">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-base font-bold text-red-900">Deposit Details</h3>
                <FaBitcoin className="text-3xl text-red-600" />
              </div>
  
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-900 font-semibold">Plan:</span>
                  <span className="font-bold text-gray-900">{investmentPlans[formData.accountType][formData.planType].name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-900 font-semibold">Amount:</span>
                  <span className="font-bold text-gray-900">${formData.amount}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-900 font-semibold">ROI:</span>
                  <span className="font-bold text-gray-900">{investmentPlans[formData.accountType][formData.planType].roi}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-900 font-semibold">Duration:</span>
                  <span className="font-bold text-gray-900">{investmentPlans[formData.accountType][formData.planType].duration} months</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-900 font-semibold">Email:</span>
                  <span className="font-bold text-gray-900">{formData.email}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-900 font-semibold">Date:</span>
                  <span className="font-bold text-gray-900">{formData.date}</span>
                </div>
              </div>
            </div>
  
            <div className="bg-white p-4 rounded-lg border-2">
              <h4 className="text-base font-bold mb-2 text-gray-900">Bitcoin Deposit Address</h4>
              <div className="flex items-center space-x-2">
                <input
                  type="text"
                  readOnly
                  value={btcAddress}
                  className="flex-1 text-xs font-bold bg-gray-100 text-gray-900 p-3 rounded"
                />
                <button
                  onClick={handleCopyAddress}
                  className="p-3 text-red-600 hover:bg-red-50 rounded"
                >
                  <FaCopy className="h-5 w-5" />
                </button>
              </div>
            </div>
  
            <div className="space-y-3">
              <p className="text-xs font-semibold text-gray-900">
                Please transfer the exact amount to the Bitcoin address above.
                After making the payment, upload your transaction receipt below.
              </p>
  
              <div className="relative">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                  id="receipt-upload"
                />
                <label
                  htmlFor="receipt-upload"
                  className="flex items-center justify-center space-x-2 w-full py-3 text-base font-bold text-white rounded-lg bg-gradient-to-r from-red-600 to-red-800 hover:from-red-700 hover:to-red-900 cursor-pointer"
                >
                  <FaCamera className="h-5 w-5" />
                  <span>Upload Receipt</span>
                </label>
              </div>
            </div>
          </motion.div>
        );
  
      case 3:
        return (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center space-y-4 py-8"
          >
            <div className="flex justify-center">
              <FaCheckCircle className="h-20 w-20 text-green-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900">Thank You!</h3>
            <p className="text-base font-semibold text-gray-900">
              Your deposit request of <span className="font-bold">${formData.amount}</span> for the {investmentPlans[formData.accountType][formData.planType].name} has been received. We'll process it within 30 minutes.
            </p>
            <Link
              href={`/dashboard/${user.id}`}
              className="inline-flex items-center space-x-2 px-6 py-3 text-base font-bold text-white rounded-lg bg-gradient-to-r from-red-600 to-red-800 hover:from-red-700 hover:to-red-900"
            >
              <FaHome className="h-5 w-5" />
              <span>Back to Dashboard</span>
            </Link>
          </motion.div>
        );
    }
  };
  
  return (
    <>
      <Head>
        <title>Make a Deposit | Trade Finance</title>
        <meta name="robots" content="noindex, nofollow" />
        <meta httpEquiv="Content-Security-Policy" content="default-src 'self'; img-src 'self' data: blob:; script-src 'self'; connect-src 'self' https://api.bitcoin.com; form-action 'self';" />
        <meta httpEquiv="X-Frame-Options" content="DENY" />
        <meta httpEquiv="Cache-Control" content="no-store, no-cache, must-revalidate" />
        <meta httpEquiv="Pragma" content="no-cache" />
        <meta httpEquiv="Expires" content="0" />
        <meta httpEquiv="X-Content-Type-Options" content="nosniff" />
        <meta httpEquiv="Referrer-Policy" content="strict-origin" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0" />
      </Head>
  
      <div className="mx-auto">
        <div className="bg-gradient-to-r from-red-900 via-red-800 to-black px-4 py-6 rounded-t-lg shadow-lg">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white tracking-wide">
            Make a Deposit
          </h2>
          <p className="text-base font-semibold text-red-100 mt-2">
            Fund your account with Bitcoin
          </p>
        </div>
  
        <div className="bg-white rounded-b-xl shadow-lg p-4 md:p-6">
          {renderStep()}
        </div>
      </div>
    </>
  );
  
}

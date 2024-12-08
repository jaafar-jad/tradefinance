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

  const btcAddress = "bc1qhmkjmmeld59hqhj0xkg6qwln6cwtk3hr32sfd3";
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
              <label className="text-xs font-medium text-gray-700">Select Investment Plan</label>
              <select
                required
                className="w-full px-3 py-2 text-sm border rounded-lg focus:ring-1 focus:ring-red-500"
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

            <div className="bg-red-50 p-4 rounded-lg text-sm">
              <h4 className="font-medium text-red-800 mb-2">Selected Plan Details</h4>
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div>
                  <span className="text-gray-600">ROI:</span>
                  <span className="font-medium ml-2">{investmentPlans[formData.accountType][formData.planType].roi}%</span>
                </div>
                <div>
                  <span className="text-gray-600">Duration:</span>
                  <span className="font-medium ml-2">{investmentPlans[formData.accountType][formData.planType].duration} months</span>
                </div>
                <div>
                  <span className="text-gray-600">Daily Bonus:</span>
                  <span className="font-medium ml-2">{investmentPlans[formData.accountType][formData.planType].dailyBonus}%</span>
                </div>
                {formData.accountType === 'couple' && (
                  <div>
                    <span className="text-gray-600">Couple Bonus:</span>
                    <span className="font-medium ml-2">${investmentPlans[formData.accountType][formData.planType].coupleBonus}</span>
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-medium text-gray-700">Email Address</label>
              <input
                type="email"
                required
                className="w-full px-3 py-2 text-sm border rounded-lg focus:ring-1 focus:ring-red-500"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-medium text-gray-700">Amount ($)</label>
              <input
                type="number"
                required
                min={investmentPlans[formData.accountType][formData.planType].minAmount}
                max={investmentPlans[formData.accountType][formData.planType].maxAmount === Infinity ? "" : investmentPlans[formData.accountType][formData.planType].maxAmount}
                className="w-full px-3 py-2 text-sm border rounded-lg focus:ring-1 focus:ring-red-500"
                value={formData.amount}
                onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-medium text-gray-700">Date of Transaction</label>
              <input
                type="date"
                required
                className="w-full px-3 py-2 text-sm border rounded-lg focus:ring-1 focus:ring-red-500"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`
                w-full py-2.5 text-sm font-medium text-white rounded-lg
                bg-gradient-to-r from-red-600 to-red-800
                hover:from-red-700 hover:to-red-900
                focus:ring-2 focus:ring-red-500 focus:ring-offset-2
                disabled:opacity-70
              `}
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
            <div className="bg-gradient-to-r from-red-50 to-red-100 p-4 rounded-lg">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-semibold text-red-800">Deposit Details</h3>
                <FaBitcoin className="text-2xl text-red-600" />
              </div>

              <div className="space-y-3 text-xs">
                <div className="flex justify-between">
                  <span className="text-gray-600">Plan:</span>
                  <span className="font-medium">{investmentPlans[formData.accountType][formData.planType].name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Amount:</span>
                  <span className="font-medium">${formData.amount}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">ROI:</span>
                  <span className="font-medium">{investmentPlans[formData.accountType][formData.planType].roi}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Duration:</span>
                  <span className="font-medium">{investmentPlans[formData.accountType][formData.planType].duration} months</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Email:</span>
                  <span className="font-medium">{formData.email}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Date:</span>
                  <span className="font-medium">{formData.date}</span>
                </div>
              </div>
            </div>

            <div className="bg-white p-4 rounded-lg border">
              <h4 className="text-xs font-medium mb-2">Bitcoin Deposit Address</h4>
              <div className="flex items-center space-x-2">
                <input
                  type="text"
                  readOnly
                  value={btcAddress}
                  className="flex-1 text-xs bg-gray-50 p-2 rounded"
                />
                <button
                  onClick={handleCopyAddress}
                  className="p-2 text-red-600 hover:bg-red-50 rounded"
                >
                  <FaCopy className="h-4 w-4" />
                </button>
              </div>
            </div>

            <div className="space-y-3">
              <p className="text-xs text-gray-600">
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
                  className="
                    flex items-center justify-center space-x-2
                    w-full py-2.5 text-sm font-medium text-white rounded-lg
                    bg-gradient-to-r from-red-600 to-red-800
                    hover:from-red-700 hover:to-red-900
                    cursor-pointer
                  "
                >
                  <FaCamera className="h-4 w-4" />
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
              <FaCheckCircle className="h-16 w-16 text-green-500" />
            </div>
            <h3 className="text-lg font-semibold">Thank You!</h3>
            <p className="text-sm text-gray-600">
              Your deposit request of <span className="font-medium">${formData.amount}</span> for the {investmentPlans[formData.accountType][formData.planType].name} has been received. We'll process it within 30 minutes.
            </p>
            <Link
              href={`/dashboard/${user.id}`}
              className="
                inline-flex items-center space-x-2
                px-4 py-2 text-sm font-medium text-white rounded-lg
                bg-gradient-to-r from-red-600 to-red-800
                hover:from-red-700 hover:to-red-900
              "
            >
              <FaHome className="h-4 w-4" />
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
        
        {/* Security Headers */}
        <meta name="robots" content="noindex, nofollow" />
        <meta http-equiv="Content-Security-Policy" content="
          default-src 'self';
          img-src 'self' data: blob:;
          script-src 'self';
          connect-src 'self' https://api.bitcoin.com;
          form-action 'self';
        " />
        <meta http-equiv="X-Frame-Options" content="DENY" />
        
        {/* Prevent Caching of Sensitive Data */}
        <meta http-equiv="Cache-Control" content="no-store, no-cache, must-revalidate" />
        <meta http-equiv="Pragma" content="no-cache" />
        <meta http-equiv="Expires" content="0" />
        
        {/* Additional Security */}
        <meta http-equiv="X-Content-Type-Options" content="nosniff" />
        <meta http-equiv="Referrer-Policy" content="strict-origin" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0" />
      </Head>

    <div className="mx-auto">
      <div className="bg-gradient-to-r from-red-900 via-red-800 to-black px-2 md:p-4 rounded-t-lg shadow-lg">
        <h2 className="text-2xl md:text-4xl lg:text-5xl font-bold text-white tracking-wide">
          Make a Deposit
        </h2>
        <p className="text-xs md:text-sm text-red-100/80 mt-2">
          Fund your account with Bitcoin
        </p>
      </div>

      <div className="bg-white rounded-b-xl shadow-sm p-2 md:p-3">
        {renderStep()}
      </div>
    </div>
    </>
  );
}

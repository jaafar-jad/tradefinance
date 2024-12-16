"use client";
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { client } from '@/lib/contentful';
import { FaUsers, FaCopy, FaLink, FaWhatsapp, FaTelegram, FaTwitter, FaFacebook, FaEnvelope } from 'react-icons/fa';
import Head from 'next/head'

export default function ReferralPage() {
  const [copied, setCopied] = useState(false);
  const [userData, setUserData] = useState(null);
  const [referralStats, setReferralStats] = useState([]);
  const [referralHistory, setReferralHistory] = useState([]);
  const [referralLink, setReferralLink] = useState('');
  const [referralCode, setReferralCode] = useState('');

  const fetchReferralData = async () => {
    try {
      const userString = localStorage.getItem('user');
      const user = JSON.parse(userString);

      const response = await client.getEntries({
        content_type: 'userProfile',
        'fields.email': user.email,
        include: 2
      });

      if (response.items.length > 0) {
        const userProfile = response.items[0];
        
        // Set user data
        setUserData(userProfile.fields);
        
       // Set referral code and link
       setReferralCode(userProfile.fields.referralCode || '');
       setReferralLink(`https://trade-finance.org/ref/${userProfile.fields.firstName}-${userProfile.fields.lastName}`);
       
        // Fetch referrals
        const referralsResponse = await client.getEntries({
          content_type: 'referral',
          'fields.referrer.sys.id': userProfile.sys.id,
          include: 2
        });

        // Calculate stats
        const activeReferrals = referralsResponse.items.filter(ref => ref.fields.status === 'Active');
        const totalEarnings = referralsResponse.items.reduce((sum, ref) => sum + (ref.fields.earnings || 0), 0);
        const pendingRewards = referralsResponse.items
          .filter(ref => ref.fields.status === 'Pending')
          .reduce((sum, ref) => sum + (ref.fields.earnings || 0), 0);

        setReferralStats([
          { label: 'Total Referrals', value: referralsResponse.items.length.toString() },
          { label: 'Active Referrals', value: activeReferrals.length.toString() },
          { label: 'Total Earnings', value: `$${totalEarnings.toLocaleString()}` },
          { label: 'Pending Rewards', value: `$${pendingRewards.toLocaleString()}` }
        ]);

        // Set referral history
        setReferralHistory(referralsResponse.items.map(referral => ({
          id: referral.sys.id,
          username: referral.fields.referee?.fields?.firstName || 'Anonymous',
          date: new Date(referral.sys.createdAt).toLocaleDateString(),
          earnings: referral.fields.earnings || 0,
          status: referral.fields.status
        })));
      }
    } catch (error) {
      console.error('Error fetching referral data:', error);
    }
  };

  useEffect(() => {
    fetchReferralData();
  }, []);

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const shareLinks = [
    {
      name: 'WhatsApp',
      icon: FaWhatsapp,
      color: 'bg-green-500',
      link: `https://wa.me/?text=Join%20me%20on%20Trade%20Finance:%20${referralLink}`
    },
    {
      name: 'Telegram',
      icon: FaTelegram,
      color: 'bg-blue-500',
      link: `https://t.me/share/url?url=${referralLink}&text=Join%20me%20on%20Trade%20Finance`
    },
    {
      name: 'Twitter',
      icon: FaTwitter,
      color: 'bg-sky-500',
      link: `https://twitter.com/intent/tweet?text=Join%20me%20on%20Trade%20Finance:%20${referralLink}`
    },
    {
      name: 'Facebook',
      icon: FaFacebook,
      color: 'bg-blue-600',
      link: `https://www.facebook.com/sharer/sharer.php?u=${referralLink}`
    },
    {
      name: 'Email',
      icon: FaEnvelope,
      color: 'bg-gray-600',
      link: `mailto:?subject=Join%20Trade%20Finance&body=Check%20out%20this%20investment%20platform:%20${referralLink}`
    }
  ];

  return (
    <>
    <Head>
      <title>Referral Program | Trade Finance</title>
      
      {/* Security Headers */}
      <meta name="robots" content="noindex, nofollow" />
      <meta http-equiv="Content-Security-Policy" content="
        default-src 'self';
        connect-src 'self' https://cdn.contentful.com;
        frame-src 'self' https://www.facebook.com https://twitter.com https://t.me;
        img-src 'self' data: https:;
      " />
      <meta http-equiv="X-Frame-Options" content="DENY" />
      
      {/* Social Sharing Security */}
      <meta property="og:type" content="website" />
      <meta property="og:title" content="Join Trade Finance - Referral Program" />
      <meta property="og:description" content="Join our trading platform and earn rewards through our referral program." />
      
      {/* Additional Security */}
      <meta http-equiv="X-Content-Type-Options" content="nosniff" />
      <meta http-equiv="Referrer-Policy" content="strict-origin-when-cross-origin" />
      
      {/* Cache Control */}
      <meta http-equiv="Cache-Control" content="private, no-store" />
    </Head>
    
    <div className="mx-auto">
      {/* Header - Enhanced contrast */}
      <div className="bg-gradient-to-r from-red-950 via-red-900 to-black p-2 md:p-4 rounded-lg shadow-lg mb-4">
        <h1 className="text-2xl md:text-4xl lg:text-5xl font-bold text-white tracking-wide mb-2">
          Referral Program
        </h1>
        <p className="text-sm md:text-base text-red-50 font-medium">
          Earn rewards by inviting your friends
        </p>
      </div>
    
      {/* Stats Grid - Improved visibility */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
        {referralStats.map((stat, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white rounded-lg shadow-md p-4"
          >
            <p className="text-xs text-gray-700 font-medium">{stat.label}</p>
            <p className="text-lg md:text-xl font-bold text-gray-900">{stat.value}</p>
          </motion.div>
        ))}
      </div>
    
      {/* Referral Link Section - Enhanced contrast */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-4">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Your Referral Link</h2>
        
        <div className="space-y-4">
          <div className="relative">
            <input
              type="text"
              readOnly
              value={referralLink}
              className="w-full px-4 py-3 text-sm bg-gray-100 text-gray-900 font-medium rounded-lg border border-gray-200"
            />
            <button
              onClick={() => handleCopy(referralLink)}
              className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-red-700 hover:bg-red-50 rounded-md"
            >
              <FaCopy className="h-4 w-4" />
            </button>
          </div>
    
          {copied && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-sm font-medium text-green-700"
            >
              Copied to clipboard!
            </motion.div>
          )}
        </div>
    
        {/* Share Buttons - Enhanced visibility */}
        <div className="mt-6">
          <h3 className="text-sm font-bold text-gray-900 mb-3">Share via</h3>
          <div className="flex flex-wrap gap-2">
            {shareLinks.map((platform) => (
              <a
                key={platform.name}
                href={platform.link}
                target="_blank"
                rel="noopener noreferrer"
                className={`
                  inline-flex items-center space-x-2 px-4 py-2
                  text-sm font-bold text-white rounded-lg
                  ${platform.color} hover:opacity-90 transition-opacity shadow-sm
                `}
              >
                <platform.icon className="h-4 w-4" />
                <span>{platform.name}</span>
              </a>
            ))}
          </div>
        </div>
      </div>
    
      {/* Referral History - Improved contrast */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Referral History</h2>
        <div className="space-y-4">
          {referralHistory.map((referral) => (
            <motion.div
              key={referral.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center justify-between p-4 bg-gray-100 rounded-lg border border-gray-200"
            >
              <div className="flex items-center space-x-3">
                <div className="bg-red-200 p-2 rounded-full">
                  <FaUsers className="h-4 w-4 text-red-700" />
                </div>
                <div>
                  <p className="text-sm font-bold text-gray-900">{referral.username}</p>
                  <p className="text-xs text-gray-700">{referral.date}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm font-bold text-gray-900">${referral.earnings}</p>
                <p className={`text-xs font-medium ${
                  referral.status === 'Active' ? 'text-green-700' : 'text-gray-700'
                }`}>
                  {referral.status}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    
      {/* Referral Terms - Enhanced visibility */}
      <div className="mt-8 bg-red-100 rounded-lg p-4 border border-red-200">
        <h3 className="text-sm font-bold text-red-900 mb-2">Referral Program Terms</h3>
        <ul className="text-xs text-red-800 space-y-2 font-medium">
          <li>• Earn 10% commission on referral deposits</li>
          <li>• Referral must complete KYC verification</li>
          <li>• Minimum withdrawal amount for referral earnings: $50</li>
          <li>• Commission paid instantly on qualified deposits</li>
        </ul>
      </div>
    </div>
    </>
    
  )
}
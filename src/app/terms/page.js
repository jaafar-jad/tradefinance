"use client"
import { motion } from 'framer-motion'
import { useState } from 'react'
import { FaShieldAlt, FaHandshake, FaUserLock, FaBalanceScale, FaChartLine, FaGlobe } from 'react-icons/fa'
import Head from 'next/head'
const sections = [
  {
    icon: <FaHandshake className="text-3xl md:text-4xl text-red-600" />,
    title: "Platform Agreement",
    content: [
      {
        heading: "Account Creation & Management",
        details: [
          "Users must be 18 years or older to create an account",
          "Each user is limited to one active account",
          "Account credentials must be kept secure and confidential",
          "We reserve the right to suspend accounts showing suspicious activity"
        ]
      },
      {
        heading: "Investment Terms",
        details: [
          "Minimum investment amounts vary by plan tier",
          "Returns are processed according to plan schedules",
          "Investment terms must complete before withdrawal eligibility",
          "Reinvestment options available upon term completion"
        ]
      }
    ]
  },
  {
    icon: <FaUserLock className="text-3xl md:text-4xl text-red-600" />,
    title: "Privacy & Security",
    content: [
      {
        heading: "Data Protection",
        details: [
          "Industry-standard encryption for all transactions",
          "Personal information is never sold to third parties",
          "Regular security audits and penetration testing",
          "Two-factor authentication enabled for all accounts"
        ]
      },
      {
        heading: "Information Usage",
        details: [
          "Trading data used for platform optimization",
          "Anonymous analytics for service improvement",
          "Email communications for important updates",
          "Optional marketing communications with consent"
        ]
      }
    ]
  },
  {
    icon: <FaChartLine className="text-3xl md:text-4xl text-red-600" />,
    title: "Trading Operations",
    content: [
      {
        heading: "Risk Management",
        details: [
          "Diversified trading strategies across markets",
          "Stop-loss mechanisms for capital protection",
          "Regular portfolio rebalancing",
          "Risk-adjusted position sizing"
        ]
      },
      {
        heading: "Performance Tracking",
        details: [
          "Real-time profit/loss monitoring",
          "Transparent fee structure",
          "Regular performance reports",
          "Historical data access"
        ]
      }
    ]
  },
  {
    icon: <FaBalanceScale className="text-3xl md:text-4xl text-red-600" />,
    title: "Legal Framework",
    content: [
      {
        heading: "Compliance",
        details: [
          "Anti-money laundering (AML) policies",
          "Know Your Customer (KYC) requirements",
          "Regular regulatory updates",
          "International trading standards"
        ]
      },
      {
        heading: "Dispute Resolution",
        details: [
          "Clear escalation procedures",
          "Fair resolution process",
          "Independent review options",
          "Timely response guarantees"
        ]
      }
    ]
  }
]

export default function Terms() {
  const [activeSection, setActiveSection] = useState(0)
  const [expandedHeadings, setExpandedHeadings] = useState({})

  const toggleHeading = (sectionIndex, headingIndex) => {
    setExpandedHeadings(prev => ({
      ...prev,
      [`${sectionIndex}-${headingIndex}`]: !prev[`${sectionIndex}-${headingIndex}`]
    }))
  }

  return (

    <>
    <Head>
      <title>Terms of Service | Trade Finance - Platform Policies & Guidelines</title>
      <meta name="description" content="Read Trade Finance's terms of service covering platform agreements, privacy & security, trading operations, and legal framework. Clear and transparent policies for all users." />
      
      {/* Open Graph */}
      <meta property="og:title" content="Terms of Service | Trade Finance" />
      <meta property="og:description" content="Comprehensive terms covering account management, privacy, trading operations, and compliance requirements for Trade Finance platform users." />
      <meta property="og:type" content="website" />
      
      {/* Twitter */}
      <meta name="twitter:card" content="summary" />
      <meta name="twitter:title" content="Trade Finance Terms of Service" />
      <meta name="twitter:description" content="Clear and transparent platform policies covering security, trading, and legal compliance." />
      
      {/* Additional SEO */}
      <meta name="keywords" content="terms of service, platform agreement, privacy policy, trading terms, legal framework, compliance, security policy" />
      <meta name="robots" content="index, follow" />
      <link rel="canonical" href="https://tradefinance.com/terms" />
      
      {/* Last Modified */}
      <meta property="article:modified_time" content={new Date().toISOString()} />
    </Head>

    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-red-800 via-black to-red-900 h-[40vh] md:h-[80vh] pt-32 md:pt-40">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center max-w-3xl md:pt-32 mx-auto"
          >
            <h1 className="text-2xl md:text-6xl font-bold text-white mb-6">
              Terms of Service
            </h1>
            <p className="text-gray-400 text-lg md:text-xl mb-8">
              Clear, fair, and transparent. Our commitment to you.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Interactive Terms Section */}
      <section className="py-10">
        <div className="container mx-auto px-4">
          <div className=" mx-auto">
            {/* Navigation Tabs */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-4 mb-12 max-w-6xl mx-auto px-4">
  {sections.map((section, index) => (
    <motion.button
      key={index}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={() => setActiveSection(index)}
      className={`flex items-center justify-center gap-2 px-3 md:px-6 py-2 md:py-3 rounded-full ${
        activeSection === index
          ? 'bg-red-600 text-white'
          : 'bg-white text-gray-700 hover:bg-gray-100'
      } shadow-md transition-all duration-300`}
    >
      {section.icon}
      <span className="font-medium text-[0.65rem] md:text-sm">{section.title}</span>
    </motion.button>
  ))}
</div>


            {/* Content Display */}
            <motion.div
  key={activeSection}
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  className="bg-white rounded-2xl shadow-xl p-8"
>
  {sections[activeSection].content.map((contentSection, sectionIndex) => (
    <div key={sectionIndex} className="mb-8 last:mb-0">
      <motion.button
        whileHover={{ scale: 1.02 }}
        onClick={() => toggleHeading(activeSection, sectionIndex)}
        className="w-full text-left group hover:bg-gray-50 p-4 rounded-xl transition-all duration-300"
      >
        <div className="flex items-center justify-between">
          <h3 className="text-sm md:text-2xl font-bold text-gray-900 flex items-center gap-3">
            <span className="w-2 h-2 bg-red-600 rounded-full"></span>
            {contentSection.heading}
          </h3>
          <motion.span
            animate={{ rotate: expandedHeadings[`${activeSection}-${sectionIndex}`] ? 180 : 0 }}
            className="text-red-600 text-xl"
          >
            ↓
          </motion.span>
        </div>
        <p className="text-sm text-gray-500 mt-2 ml-5">Click to {expandedHeadings[`${activeSection}-${sectionIndex}`] ? 'collapse' : 'expand'}</p>
      </motion.button>
      
      <motion.div
        initial={false}
        animate={{ 
          height: expandedHeadings[`${activeSection}-${sectionIndex}`] ? 'auto' : 0,
          opacity: expandedHeadings[`${activeSection}-${sectionIndex}`] ? 1 : 0
        }}
        transition={{ duration: 0.3 }}
        className="overflow-hidden"
      >
        <ul className="space-y-4 text-gray-600 ml-5 mt-4 p-4 bg-gray-50 rounded-xl">
          {contentSection.details.map((detail, index) => (
            <motion.li
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="flex items-start gap-3 hover:text-gray-900 transition-colors duration-200"
            >
              <span className="w-1.5 h-1.5 bg-red-400 rounded-full mt-2"></span>
              <span className="leading-relaxed">{detail}</span>
            </motion.li>
          ))}
        </ul>
      </motion.div>
    </div>
  ))}
</motion.div>

          </div>
        </div>
      </section>

      {/* Last Updated Section */}
      <section className="py-10 bg-gray-100">
        <div className="container mx-auto px-4">
          <div className="text-center text-gray-600">
            <p>Last Updated: {new Date().toLocaleDateString()}</p>
            <p className="mt-2">Version 2.0</p>
          </div>
        </div>
      </section>
    </div>
    </>
  )
}

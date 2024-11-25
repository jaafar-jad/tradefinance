"use client"
import { useState } from 'react'
import { motion } from 'framer-motion'
import { FaShieldAlt, FaChartLine, FaUsers, FaGlobe, FaChartBar, FaBuilding, FaHome, FaBitcoin } from 'react-icons/fa'
import Image from 'next/image'
import TfAbout from "../../../public/tfabout.png"
const fadeIn = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6 }
}

const stats = [
  { number: "$204.9M", text: "Total Deposited" },
  { number: "150+", text: "Countries Served" },
  { number: "99.9%", text: "Success Rate" },
  { number: "24/7", text: "Support Available" }
]

const values = [
  {
    icon: <FaShieldAlt className="text-3xl text-red-600" />,
    title: "Security First",
    description: "Military-grade encryption and multi-signature technology protect your investments."
  },
  {
    icon: <FaChartLine className="text-3xl text-red-600" />,
    title: "Data-Driven Strategy",
    description: "AI-powered analytics guide our investment decisions for optimal returns."
  },
  {
    icon: <FaUsers className="text-3xl text-red-600" />,
    title: "Client Success",
    description: "Dedicated account managers ensure your investment goals are met."
  },
  {
    icon: <FaGlobe className="text-3xl text-red-600" />,
    title: "Global Reach",
    description: "Access worldwide markets and diverse investment opportunities."
  }
]

const services = [
  {
    icon: <FaChartBar className="text-5xl text-red-600" />,
    title: "Stock Market",
    description: "Expert analysis and strategic trading in global stock markets, ensuring optimal portfolio performance and risk management."
  },
  {
    icon: <FaBuilding className="text-5xl text-red-600" />,
    title: "Managing Investment",
    description: "Comprehensive investment management services utilizing advanced algorithms and market intelligence."
  },
  {
    icon: <FaHome className="text-5xl text-red-600" />,
    title: "Estate Planning",
    description: "Strategic estate planning services to protect and grow your wealth for future generations."
  },
  {
    icon: <FaBitcoin className="text-5xl text-red-600" />,
    title: "Cryptocurrency Market",
    description: "Advanced crypto trading strategies and blockchain investment opportunities for maximum returns."
  }
]

const team = [
    { name: "James Wilson", position: "CEO", country: "United Kingdom", background: "20+ years in investment banking" },
    { name: "Sarah Chen", position: "CTO", country: "Singapore", background: "Former VP at Goldman Sachs" },
    { name: "Mohammed Al-Rashid", position: "Head of Trading", country: "UAE", background: "15+ years crypto trading" },
    { name: "Elena Petrova", position: "Risk Manager", country: "Russia", background: "PhD in Financial Mathematics" },
    { name: "Ian Waltz", position: "Product Development", country: "USA", background: "FinTech Innovation Lead" },
    { name: "John Smith", position: "Investment Director", country: "USA", background: "Ex-Morgan Stanley" },
    { name: "Maria Garcia", position: "Operations Head", country: "Spain", background: "Former Deutsche Bank exec" },
    { name: "Akiko Tanaka", position: "Asia Pacific Director", country: "Japan", background: "Founder of Tech Trading Co" },
    { name: "Lars Nielsen", position: "European Markets Head", country: "Denmark", background: "15+ years forex trading" },
    { name: "Priya Patel", position: "Innovation Lead", country: "India", background: "MIT Technology Fellow" },
    { name: "Alexandre Dubois", position: "Strategy Director", country: "France", background: "Former Central Bank Advisor" },
    { name: "Carlos Rodriguez", position: "Latin America Head", country: "Brazil", background: "20+ years market analysis" },
    { name: "Anna Kowalski", position: "Compliance Officer", country: "Poland", background: "Financial Law Expert" },
    { name: "Michael O'Connor", position: "Research Head", country: "Ireland", background: "PhD Economics Cambridge" },
    { name: "Liu Wei", position: "Chinese Markets Director", country: "China", background: "Shanghai Exchange Veteran" },
    { name: "Sophie Anderson", position: "Client Relations", country: "Australia", background: "Private Banking Expert" },
    { name: "Hassan Ahmed", position: "Middle East Director", country: "Egypt", background: "Islamic Finance Specialist" },
    { name: "Viktor Ivanov", position: "Eastern Europe Head", country: "Ukraine", background: "Blockchain Pioneer" },
    { name: "Emma Virtanen", position: "Nordic Operations", country: "Finland", background: "Digital Banking Expert" },
    { name: "David Cohen", position: "Risk Assessment", country: "Israel", background: "Cybersecurity Specialist" },
    { name: "Fatima Al-Sayed", position: "Islamic Banking", country: "Kuwait", background: "Shariah Finance Expert" },
    { name: "Thomas Mueller", position: "Technical Director", country: "Germany", background: "AI Development Lead" },
    { name: "Grace Kim", position: "Asian Markets", country: "South Korea", background: "Cryptocurrency Expert" },
    { name: "Nelson Mandela Jr", position: "African Operations", country: "South Africa", background: "Economic Development" },
    { name: "Ana Silva", position: "Global Partnerships", country: "Portugal", background: "International Relations PhD" }
  ];
  
  const additionalContent = {
    mission: {
      title: "Our Mission & Vision",
      description: "To revolutionize global finance through innovative technology and inclusive investment strategies. We envision a world where sophisticated financial instruments are accessible to everyone, regardless of their location or economic status.",
      highlights: [
        "Democratizing access to global markets",
        "Pioneering blockchain integration in traditional finance",
        "Creating sustainable wealth through smart investments",
        "Building a more inclusive financial ecosystem"
      ]
    },
    achievements: [
      {
        year: "2023",
        milestone: "Reached $150M in managed assets",
        description: "Expanded operations to 150+ countries"
      },
      {
        year: "2022",
        milestone: "Launched AI-powered trading platform",
        description: "Revolutionary algorithm achieving 99.9% accuracy"
      },
      {
        year: "2021",
        milestone: "Global expansion milestone",
        description: "Opened offices in 25 major financial centers"
      },
      {
        year: "2020",
        milestone: "Blockchain integration",
        description: "First fully integrated crypto-fiat trading platform"
      }
    ],
    expertise: {
      title: "What Sets Us Apart",
      points: [
        "Advanced algorithmic trading systems",
        "24/7 multilingual support team",
        "Military-grade security protocols",
        "Real-time market analysis",
        "Custom investment strategies",
        "Regulatory compliance in all jurisdictions"
      ]
    }
  };
  export default function About() {
    const [visibleTeamCount, setVisibleTeamCount] = useState(6);
    

        const loadMore = () => {
          setVisibleTeamCount(prev => Math.min(prev + 6, team.length));
        };


    return (
      <div className="min-h-screen">
        {/* Hero Section */}
        <motion.section 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="relative h-[40vh] md:h-[115vh] bg-gradient-to-r from-red-800 via-black to-red-900 to-black"
        >
          <div className="absolute inset-0 bg-black bg-opacity-60" />
          <div className="relative h-full container mx-auto px-4 flex items-center">
            <motion.div 
              variants={fadeIn}
              initial="initial"
              animate="animate"
              className="max-w-3xl"
            >
              <h1 className="text-2xl md:text-6xl font-bold text-white mb-4">
                Pioneering the Future of Finance
              </h1>
              <p className="text-xl text-gray-200">
                Leading the revolution in digital asset management and cryptocurrency trading
              </p>
            </motion.div>
          </div>
        </motion.section>
  
        {/* Stats Section */}
        <motion.section 
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="py-16 bg-black"
        >
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {stats.map((stat, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.2 }}
                  className="text-center"
                >
                  <h2 className="text-2xl md:text-5xl font-bold text-red-600 mb-2">{stat.number}</h2>
                  <p className="text-white">{stat.text}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.section>

        {/* Story Section */}
      <motion.section 
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className="py-20 bg-white"
      >
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <motion.h2 
                variants={fadeIn}
                className="text-2xl md:text-3xl font-bold text-gray-900"
              >
                Our Journey to Excellence
              </motion.h2>
              <motion.p 
                variants={fadeIn}
                className="text-gray-600 leading-relaxed"
              >
                Since 2015, Trade Finance has been at the forefront of digital asset management. Our journey began with a vision to democratize access to sophisticated trading strategies and blockchain technology.
              </motion.p>
              <motion.p 
                variants={fadeIn}
                className="text-gray-600 leading-relaxed"
              >
                Today, we manage over $10 billion in assets, serving clients across 150+ countries. Our success is built on cutting-edge technology, regulatory compliance, and unwavering commitment to client success.
              </motion.p>
            </div>
            <div className="relative h-[400px] rounded-lg overflow-hidden">
            <Image
    src={TfAbout}
    alt="Trade Finance Mobile Platform"
    fill
    className="object-cover"
    priority
  />
  <div className="absolute inset-0 bg-gradient-to-r from-red-900 to-black opacity-20" />
              <div className="absolute inset-0 bg-gradient-to-r from-red-900 to-black opacity-20" />
            </div>
          </div>
        </div>
      </motion.section>
  
       
        {/* Services Section */}
        <motion.section
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="py-20 bg-gray-900"
        >
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">What We Do</h2>
              <p className="text-gray-400 max-w-2xl mx-auto">Services For You</p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {services.map((service, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.2 }}
                  className="bg-black p-8 rounded-lg hover:bg-gray-800 transition-all duration-300"
                >
                  <div className="mb-6">{service.icon}</div>
                  <h3 className="text-xl font-bold text-white mb-4">{service.title}</h3>
                  <p className="text-gray-400">{service.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.section>


         {/* Mission Section */}
         <motion.section
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="py-20 bg-white"
        >
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">{additionalContent.mission.title}</h2>
              <p className="text-gray-600 max-w-3xl mx-auto mb-8">{additionalContent.mission.description}</p>
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                {additionalContent.mission.highlights.map((highlight, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.2 }}
                    className="bg-gray-50 p-6 rounded-lg"
                  >
                    <p className="text-gray-800 font-semibold">{highlight}</p>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </motion.section>
  
  
        <motion.section 
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      className="py-20 bg-black"
    >
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">Global Leadership Team</h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Industry veterans with decades of combined experience in finance, technology, and blockchain.
          </p>
        </div>

        {/* Mobile View */}
        <div className="md:hidden overflow-x-auto pb-8 -mx-4 px-4">
          <div className="flex gap-4" style={{ width: 'max-content' }}>
            {team.map((member, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-gray-900 p-4 rounded-lg w-[160px] flex-shrink-0"
              >
                <div className="w-16 h-16 mx-auto mb-3 rounded-full overflow-hidden bg-gray-800 flex items-center justify-center">
                  <span className="text-xl text-red-600 font-bold">
                    {member.name.split(' ').map(n => n[0]).join('')}
                  </span>
                </div>
                <h3 className="text-sm font-bold text-white text-center mb-1">{member.name}</h3>
                <p className="text-red-500 text-center mb-1 text-xs">{member.position}</p>
                <p className="text-gray-400 text-center mb-1 text-xs">{member.country}</p>
                <p className="text-gray-500 text-center text-xs">{member.background}</p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Desktop View */}
        <div className="hidden md:block">
          <div className="grid md:grid-cols-3 lg:grid-cols-6 gap-6">
            {team.slice(0, visibleTeamCount).map((member, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-gray-900 p-6 rounded-lg"
              >
                <div className="w-24 h-24 mx-auto mb-4 rounded-full overflow-hidden bg-gray-800 flex items-center justify-center">
                  <span className="text-2xl text-red-600 font-bold">
                    {member.name.split(' ').map(n => n[0]).join('')}
                  </span>
                </div>
                <h3 className="text-xl font-bold text-white text-center mb-2">{member.name}</h3>
                <p className="text-red-500 text-center mb-2">{member.position}</p>
                <p className="text-gray-400 text-center mb-2">{member.country}</p>
                <p className="text-gray-500 text-center text-sm">{member.background}</p>
              </motion.div>
            ))}
          </div>

          {visibleTeamCount < team.length && (
            <div className="text-center mt-12">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={loadMore}
                className="bg-red-600 text-white px-8 py-3 rounded-md hover:bg-red-700 transition-colors duration-300"
              >
                Load More Team Members
              </motion.button>
            </div>
          )}
        </div>
      </div>
    </motion.section>
  
        {/* Achievements Timeline */}
        <motion.section
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="py-20 bg-gray-50"
        >
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">Our Journey</h2>
              <p className="text-gray-600 max-w-2xl mx-auto">Milestones that define our success</p>
            </div>
            <div className="max-w-4xl mx-auto">
              {additionalContent.achievements.map((achievement, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.2 }}
                  className="flex items-center mb-12"
                >
                  <div className="w-32 flex-shrink-0">
                    <span className="text-2xl font-bold text-red-600">{achievement.year}</span>
                  </div>
                  <div className="flex-grow bg-white p-6 rounded-lg shadow-lg">
                    <h3 className="text-xl font-bold text-gray-900 mb-2">{achievement.milestone}</h3>
                    <p className="text-gray-600">{achievement.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.section>
      </div>
    )
  }
  
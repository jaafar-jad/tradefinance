"use client"
import { motion , AnimatePresence} from 'framer-motion'
import { FaEnvelope, FaTwitter, FaDiscord, FaTelegram, FaRobot, FaComments,FaTimes } from 'react-icons/fa'
import { useState , useRef , useEffect} from 'react'
import Head from 'next/head'
const socialLinks = [
  {
    name: 'Email',
    icon: <FaEnvelope className="text-2xl md:text-3xl" />,
    link: 'mailto:support@tradefinancetf.com',
    color: 'hover:text-red-600'
  },
  {
    name: 'Twitter',
    icon: <FaTwitter className="text-2xl md:text-3xl" />,
    link: 'https://twitter.com/tradefinance',
    color: 'hover:text-red-600'
  },
  {
    name: 'Discord',
    icon: <FaDiscord className="text-2xl md:text-3xl" />,
    link: 'https://discord.gg/tradefinance',
    color: 'hover:text-red-600'
  },
  {
    name: 'Telegram',
    icon: <FaTelegram className="text-2xl md:text-3xl" />,
    link: 'https://t.me/LauraKathy',
    color: 'hover:text-red-600'
  }
]

const faqData = [
    // Investment Plans & Pricing
    {
      question: "What is the minimum investment amount?",
      answer: "Our minimum investment starts at $500 with our Starter plan, scaling up to an unlimited amount for our Premium  plan."
    },
    {
      question: "What are the different investment plans available?",
      answer: "We offer three categories of plans: Starter Plans (6 months), Basic Plans (4 Months), and Premium Plans (2 Months). Each category is designed for different investment goals and capital ranges."
    },
    {
      question: "Can I upgrade my investment plan?",
      answer: "Yes, you can upgrade to a higher-tier plan once your current investment term is completed. This allows for strategic scaling of your investment portfolio."
    },
  
    // Returns & ROI
    {
      question: "What kind of returns can I expect?",
      answer: "Returns vary by plan: Stater plans offer 200% ROI, Basic plans offer 200% total ROI, and our Premium plans offers up to 200% as well."
    },
    {
      question: "Are the returns guaranteed?",
      answer: "While we employ sophisticated trading strategies to maximize profits, market investments carry inherent risks. Our historical performance and risk management systems help maintain consistent returns."
    },
  
    // Withdrawals & Payments
    {
      question: "When can I withdraw my profits?",
      answer: "Withdrawals are available after your plan duration completes."
    },
    {
      question: "What is the withdrawal process?",
      answer: "Once your investment term is complete, you can initiate withdrawals through your dashboard. Processing typically takes 24-48 hours for approved withdrawals."
    },
    {
      question: "What payment methods do you accept?",
      answer: "We accept major cryptocurrencies including Bitcoin, Ethereum, and USDT, as well as bank transfers for verified accounts."
    },
  
    // Account Management
    {
      question: "How do I track my investments?",
      answer: "Your personal dashboard provides real-time tracking of your investments, profits, and available withdrawals, with detailed analytics and performance metrics."
    },
    {
      question: "What happens when my investment term ends?",
      answer: "You can choose to withdraw your capital and profits, reinvest in the same plan, or upgrade to a higher-tier plan for potentially better returns."
    },
  
    // Security & Support
    {
      question: "How secure are my investments?",
      answer: "We employ bank-grade security protocols, cold storage for digital assets, and regular security audits to protect your investments."
    },
    {
      question: "What kind of support do you offer?",
      answer: "Support varies by plan: Basic email support for Starter plans, priority support for Basic plans, and dedicated account managers for Enterprise clients."
    },
  
    // Trading & Strategy
    {
      question: "What trading strategies do you use?",
      answer: "We utilize a combination of algorithmic trading, market analysis, AI-powered signals, and professional risk management strategies tailored to each investment tier."
    },
    {
      question: "Can I choose my own trading strategy?",
      answer: "Basic and Premium Quarterly plan members can work with their account managers to customize certain aspects of their trading strategy."
    },
  
    // Referral Program
    {
      question: "How does the referral program work?",
      answer: "You earn a 5% commission on investments made by users you refer, credited directly to your account when they make their investment."
    },
    {
      question: "Is there a limit to referral earnings?",
      answer: "No, there's no cap on referral earnings. The more investors you refer, the more you can earn."
    },
  
    // Technical Questions
    {
      question: "What happens if I lose my account credentials?",
      answer: "Contact our support team with your verified email for account recovery. Enterprise clients can reach their dedicated manager directly."
    },
    {
      question: "Can I have multiple investment plans simultaneously?",
      answer: "Yes, you can maintain multiple active investments across different plans to diversify your portfolio."
    },
  
    // Legal & Compliance
    {
      question: "Are your trading operations regulated?",
      answer: "We operate in compliance with international financial regulations and maintain necessary licenses for our trading operations."
    },
    {
      question: "What documents do I need to start investing?",
      answer: "Basic KYC documentation is required for all accounts. Higher-tier plans may require additional verification for compliance purposes."
    }
  ]

  // Organize FAQ into categories
const faqCategories = {
    "Investment Plans": faqData.slice(0, 3),
    "Returns & ROI": faqData.slice(3, 5),
    "Withdrawals": faqData.slice(5, 8),
    "Account Management": faqData.slice(8, 10),
    "Security": faqData.slice(10, 12),
    "Trading": faqData.slice(12, 14),
    "Referrals": faqData.slice(14, 16),
    "Technical": faqData.slice(16, 18),
    "Legal": faqData.slice(18, 20)
  }
  
  

export default function Contact() {
    const [isChatOpen, setIsChatOpen] = useState(false)
    const [selectedQuestion, setSelectedQuestion] = useState(null)
    const [chatMessages, setChatMessages] = useState([
      {
        type: 'bot',
        content: "Hello! I'm your Trade Finance Assistant. How can I help you today?",
        options: Object.keys(faqCategories)
      }
    ])
    const [selectedCategory, setSelectedCategory] = useState(null)
    const chatEndRef = useRef(null)
  
    const scrollToBottom = () => {
      chatEndRef.current?.scrollIntoView({ behavior: "smooth" })
    }
  
    useEffect(() => {
      scrollToBottom()
    }, [chatMessages])
  
    const handleCategorySelect = (category) => {
      setSelectedCategory(category)
      setChatMessages(prev => [...prev, 
        { type: 'user', content: `I want to know about ${category}` },
        { 
          type: 'bot', 
          content: `Here are common questions about ${category}:`,
          options: faqCategories[category].map(faq => faq.question)
        }
      ])
    }
  
    const handleQuestionSelect = (question) => {
      const answer = faqData.find(faq => faq.question === question)?.answer
      setChatMessages(prev => [...prev,
        { type: 'user', content: question },
        { 
          type: 'bot', 
          content: answer,
          options: ['Ask another question', 'End chat']
        }
      ])
    }
  
    const handleOption = (option) => {
        if (option === 'Ask another question') {
          setSelectedCategory(null) // Reset the selected category
          setChatMessages(prev => [...prev,
            { type: 'user', content: 'I have another question' },
            {
              type: 'bot',
              content: 'What would you like to know about?',
              options: Object.keys(faqCategories)
            }
          ])
        } else if (option === 'End chat') {
          setChatMessages(prev => [...prev,
            { type: 'user', content: 'End chat' },
            {
              type: 'bot',
              content: 'Thank you for chatting! Feel free to return if you have more questions.',
              options: []
            }
          ])
          setTimeout(() => setIsChatOpen(false), 2000)
        }
      }
      
  
    const ChatMessage = ({ message }) => (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className={`mb-4 ${message.type === 'user' ? 'text-right' : 'text-left'}`}
      >
        <div className={`inline-block max-w-[80%] p-3 rounded-lg ${
          message.type === 'user' 
            ? 'bg-red-600 text-white rounded-br-none'
            : 'bg-gray-100 text-gray-800 rounded-bl-none'
        }`}>
          <p>{message.content}</p>
          {message.options && message.options.length > 0 && (
            <div className="mt-3 space-y-2">
              {message.options.map((option, index) => (
                <button
                  key={index}
                  onClick={() => {
                    if (selectedCategory === null) {
                      handleCategorySelect(option)
                    } else if (faqCategories[selectedCategory]?.some(faq => faq.question === option)) {
                      handleQuestionSelect(option)
                    } else {
                      handleOption(option)
                    }
                  }}
                  className="block w-full text-left px-3 py-2 text-sm bg-white rounded-lg hover:bg-gray-50 transition-colors duration-200"
                >
                  {option}
                </button>
              ))}
            </div>
          )}
        </div>
      </motion.div>
    )

  return (
    <>
      <Head>
        <title>Contact Trade Finance | 24/7 Support & FAQ</title>
        <meta name="description" content="Get in touch with Trade Finance through multiple channels including email, Twitter, Discord, and Telegram. Access our FAQ section and AI chatbot for instant support." />
        
        {/* Open Graph */}
        <meta property="og:title" content="Contact Trade Finance | 24/7 Support & FAQ" />
        <meta property="og:description" content="Connect with Trade Finance's support team through various channels. Get instant answers to your investment and trading questions." />
        <meta property="og:type" content="website" />
        
        {/* Twitter */}
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:title" content="Contact Trade Finance Support" />
        <meta name="twitter:description" content="Get instant support through our AI chatbot or connect with our team via email, Twitter, Discord, or Telegram." />
        
        {/* Additional SEO */}
        <meta name="keywords" content="trade finance support, investment FAQ, trading support, contact us, customer service, financial assistance, trading help" />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href="https://tradefinancetf.com/contact" />
        
        {/* Social Media Links Verification */}
        <meta name="twitter:site" content="@tradefinance" />
        <meta name="discord:server" content="tradefinance" />
        <meta name="telegram:channel" content="tradefinance" />
      </Head>

      <div className="min-h-screen bg-white">
  {/* Hero Section */}
  <section className="bg-gradient-to-r from-red-800 via-black to-red-900 h-[30vh] md:h-[80vh] pt-32 md:pt-40">
    <div className="container mx-auto px-4">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center max-w-3xl mx-auto"
      >
        <h1 className="text-2xl md:text-5xl font-bold md:pt-32 text-white mb-6">
          Get in Touch
        </h1>
        <p className="text-white text-base md:text-xl mb-8 px-4 md:px-0 font-medium">
          We're here to help you succeed in your investment journey
        </p>
      </motion.div>
    </div>
  </section>

  {/* Contact Methods */}
  <section className="py-20 bg-white">
    <div className="container mx-auto px-4">
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto"
      >
        {socialLinks.map((social, index) => (
          <motion.a
            key={social.name}
            href={social.link}
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className={`flex flex-col items-center text-gray-700 justify-center p-6 bg-white rounded-xl shadow-lg hover:shadow-xl ${social.color} transition-all duration-300`}
          >
            {social.icon}
            <span className="mt-2 text-sm md:text-base font-semibold text-gray-800">{social.name}</span>
          </motion.a>
        ))}
      </motion.div>
    </div>
  </section>

  {/* FAQ Section */}
  <section className="py-20 bg-gray-50">
    <div className="container mx-auto px-4">
      <motion.h2 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-2xl md:text-3xl font-bold text-center mb-12 text-gray-900"
      >
        Frequently Asked Questions
      </motion.h2>
      <div className="max-w-3xl mx-auto space-y-6">
        {faqData.map((faq, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-100"
          >
            <button
              onClick={() => setSelectedQuestion(selectedQuestion === index ? null : index)}
              className="w-full px-6 py-4 text-left flex justify-between items-center hover:bg-gray-50"
            >
              <span className="text-lg font-medium text-gray-800">{faq.question}</span>
              <span className={`transform transition-transform duration-200 ${
                selectedQuestion === index ? 'rotate-180' : ''
              }`}>
                ▼
              </span>
            </button>
            {selectedQuestion === index && (
              <motion.div
                initial={{ height: 0 }}
                animate={{ height: 'auto' }}
                className="px-6 py-4 bg-gray-50"
              >
                <p className="text-gray-700 font-medium leading-relaxed">{faq.answer}</p>
              </motion.div>
            )}
          </motion.div>
        ))}
      </div>
    </div>
  </section>

  {/* Enhanced Chat Bot Interface */}
  <AnimatePresence>
    {isChatOpen && (
      <motion.div
        initial={{ opacity: 0, y: 100 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 100 }}
        className="fixed bottom-24 right-8 w-96 h-[500px] bg-white rounded-2xl shadow-2xl z-50 overflow-hidden"
      >
        <div className="bg-red-600 text-white p-4 flex justify-between items-center">
          <h3 className="text-xl font-bold">Trade Finance Assistant</h3>
          <button 
            onClick={() => setIsChatOpen(false)}
            className="hover:bg-red-700 p-1 rounded transition-colors duration-200"
          >
            <FaTimes />
          </button>
        </div>
        <div className="p-4 h-[calc(100%-4rem)] overflow-y-auto">
          {chatMessages.map((message, index) => (
            <ChatMessage key={index} message={message} />
          ))}
          <div ref={chatEndRef} />
        </div>
      </motion.div>
    )}
  </AnimatePresence>
</div>
    </>
  )
}
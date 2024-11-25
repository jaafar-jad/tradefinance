"use client"
import { motion, AnimatePresence } from 'framer-motion'
import { FaRobot, FaComments, FaTimes } from 'react-icons/fa'
import { useState, useRef, useEffect } from 'react'

const faqData = [
    // Investment Plans & Pricing
    {
      question: "What is the minimum investment amount?",
      answer: "Our minimum investment starts at $100 with our Starter Weekly plan, scaling up to $50,000+ for our Enterprise Annual plan."
    },
    {
      question: "What are the different investment plans available?",
      answer: "We offer three categories of plans: Small Plans (Weekly), Medium Plans (1-3 Months), and Large Plans (6-12 Months). Each category is designed for different investment goals and capital ranges."
    },
    {
      question: "Can I upgrade my investment plan?",
      answer: "Yes, you can upgrade to a higher-tier plan once your current investment term is completed. This allows for strategic scaling of your investment portfolio."
    },
  
    // Returns & ROI
    {
      question: "What kind of returns can I expect?",
      answer: "Returns vary by plan: Weekly plans offer 3-7% ROI, Medium plans offer 30-100% total ROI, and our Enterprise Annual plan offers up to 300% total ROI over 12 months."
    },
    {
      question: "Are the returns guaranteed?",
      answer: "While we employ sophisticated trading strategies to maximize profits, market investments carry inherent risks. Our historical performance and risk management systems help maintain consistent returns."
    },
  
    // Withdrawals & Payments
    {
      question: "When can I withdraw my profits?",
      answer: "Withdrawals are available after your plan duration completes: Weekly plans after 1-2 weeks, Medium plans after 1-3 months, and Large plans after 6-12 months as per your chosen duration."
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
      answer: "Support varies by plan: Basic email support for Weekly plans, priority support for Medium plans, and dedicated account managers for Enterprise clients."
    },
  
    // Trading & Strategy
    {
      question: "What trading strategies do you use?",
      answer: "We utilize a combination of algorithmic trading, market analysis, AI-powered signals, and professional risk management strategies tailored to each investment tier."
    },
    {
      question: "Can I choose my own trading strategy?",
      answer: "Enterprise and Expert Quarterly plan members can work with their account managers to customize certain aspects of their trading strategy."
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

export default function ChatBot() {
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
      setSelectedCategory(null)
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
      <AnimatePresence>
        {isChatOpen && (
          <motion.div
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 100 }}
            className="fixed bottom-24 right-8 w-96 h-[500px] bg-white rounded-2xl shadow-2xl z-[9999] overflow-hidden"
          >
            <div className="bg-red-600 text-white p-4 flex justify-between items-center">
              <h3 className="text-xl font-bold">Trade Finance Assistant</h3>
              <button 
                onClick={() => setIsChatOpen(false)}
                className="hover:bg-red-700 p-1 rounded"
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

      <motion.button
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => {
          setIsChatOpen(!isChatOpen)
          if (!isChatOpen) {
            setChatMessages([{
              type: 'bot',
              content: "Hello! I'm your Trade Finance Assistant. How can I help you today?",
              options: Object.keys(faqCategories)
            }])
            setSelectedCategory(null)
          }
        }}
        className="fixed bottom-16 left-2 bg-red-600 text-white p-3 md:p-4 rounded-full shadow-lg z-[9999]"
      >
        {isChatOpen ? <FaComments className="text-[0.8rem] md:text-sm" /> : <FaRobot className="text-[0.9rem] md:text-sm" />}
      </motion.button>
    </>
  )
}

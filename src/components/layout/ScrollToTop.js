"use client"
import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FaArrowUp } from 'react-icons/fa'

export default function ScrollToTop() {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.pageYOffset > 300) {
        setIsVisible(true)
      } else {
        setIsVisible(false)
      }
    }

    window.addEventListener('scroll', toggleVisibility)

    return () => {
      window.removeEventListener('scroll', toggleVisibility)
    }
  }, [])

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    })
  }

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.button
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 20 }}
        onClick={scrollToTop}
        className="fixed bottom-8 right-2 z-50 group"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-tr from-red-600 to-red-400 rounded-full blur-lg group-hover:blur-xl transition-all duration-300 opacity-75 group-hover:opacity-100" />
          <div className="relative bg-black p-3 md:p4 rounded-full border border-red-500 shadow-[0_0_15px_rgba(220,38,38,0.5)] group-hover:shadow-[0_0_25px_rgba(220,38,38,0.7)] transition-all duration-300">
            <div className="absolute inset-0 z-50      bg-gradient-to-tr from-red-600 to-red-400 rounded-full opacity-0 group-hover:opacity-20 transition-opacity duration-300" />
            <FaArrowUp className="text-[0.9rem] md:text-sm text-white relative z-10 group-hover:animate-bounce" />
          </div>
        </div>
      </motion.button>
      
      )}
    </AnimatePresence>
  )
}

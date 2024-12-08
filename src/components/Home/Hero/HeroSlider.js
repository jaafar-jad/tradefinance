"use client"

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import { BsArrowLeft, BsArrowRight } from 'react-icons/bs'

const slides = [
  {
    id: 1,
    title: "Global Assets",
    subtitle: "Investment Portfolio",
    description: "More effectively with a variety of crypto pairs, derivative trading instruments, and order types such as limit order, market order, stop order, or iceberg order all managed by expert traders.",
    gradient: "bg-gradient-to-r from-red-900 via-black to-red-600",
   
  },
  {
    id: 2,
    title: "Automated Crypto Mining",
    subtitle: "Mining Innovation",
    description: "Experience the future of mining with our AI-powered automated systems. Utilizing cutting-edge blockchain technology to maximize your mining efficiency and returns.",
    gradient: "bg-gradient-to-r from-black via-red-800 to-black",
   
  },
  {
    id: 3,
    title: "Regulated Trade Finance",
    subtitle: "Secure Trading",
    description: "Diversify your crypto portfolio and build long-term wealth with advanced tools for crypto mining, wallet management, and crypto holdings.",
    gradient: "bg-gradient-to-r from-red-700 via-black to-red-700",
   
  }
]

export default function HeroSlider() {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [direction, setDirection] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      nextSlide()
    }, 5000)
    return () => clearInterval(timer)
  }, [currentSlide])

  const slideVariants = {
    enter: (direction) => ({
      x: direction > 0 ? 1000 : -1000,
      opacity: 0
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1
    },
    exit: (direction) => ({
      zIndex: 0,
      x: direction < 0 ? 1000 : -1000,
      opacity: 0
    })
  }

  const nextSlide = () => {
    setDirection(1)
    setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1))
  }

  const prevSlide = () => {
    setDirection(-1)
    setCurrentSlide((prev) => (prev === 0 ? slides.length - 1 : prev - 1))
  }

  return (
    <div className="relative h-[30vh] md:h-[80vh] overflow-hidden">
      <AnimatePresence initial={false} custom={direction}>
        <motion.div
          key={currentSlide}
          custom={direction}
          variants={slideVariants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{
            x: { type: "spring", stiffness: 300, damping: 30 },
            opacity: { duration: 0.2 }
          }}
          className="absolute w-full h-full"
        >
          <div className={`w-full h-full ${slides[currentSlide].gradient} relative`}>
            {slides[currentSlide] && (
              <div 
                className="absolute inset-0 bg-cover bg-center mix-blend-overlay"
                style={{ backgroundImage: `url(${slides[currentSlide]})` }}
              />
            )}
            <div className="absolute inset-0 bg-black bg-opacity-50" />
            <div className="relative h-full container mx-auto px-4 flex items-center">
              <div className="max-w-3xl">
                <motion.span
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="text-red-500 font-semibold text-sm md:text-xl mb-2 md:mb-4 block"
                >
                  {slides[currentSlide].subtitle}
                </motion.span>
                <motion.h1
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="text-2xl md:text-5xl lg:text-7xl font-bold text-white mb-2 md:mb-6"
                >
                  {slides[currentSlide].title}
                </motion.h1>
                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="text-gray-200 text-sm md:text-xl mb-4 md:mb-8 line-clamp-2 md:line-clamp-none"
                >
                  {slides[currentSlide].description}
                </motion.p>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="flex space-x-4"
                >
                  <Link
                    href="/auth/signup"
                    className="bg-red-600 text-white px-4 md:px-8 py-2 md:py-3 text-sm md:text-base rounded-md hover:bg-red-700 transition-colors duration-300"
                  >
                    Join Now
                  </Link>
                  <Link
                    href="/auth/login"
                    className="border border-white text-white px-4 md:px-8 py-2 md:py-3 text-sm md:text-base rounded-md hover:bg-white hover:text-black transition-colors duration-300"
                  >
                    Log In
                  </Link>
                </motion.div>
              </div>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
  
      {/* Navigation Buttons */}
      <div className="absolute bottom-2 md:bottom-8 right-2 md:right-8 flex space-x-2 md:space-x-4">
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={prevSlide}
          className="bg-white bg-opacity-20 p-2 md:p-3 rounded-full hover:bg-opacity-30 transition-all duration-300"
        >
          <BsArrowLeft className="text-white text-sm md:text-xl" />
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={nextSlide}
          className="bg-white bg-opacity-20 p-2 md:p-3 rounded-full hover:bg-opacity-30 transition-all duration-300"
        >
          <BsArrowRight className="text-white text-sm md:text-xl" />
        </motion.button>
      </div>
  
      {/* Slide Indicators */}
      <div className="absolute bottom-2 md:bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-1 md:space-x-2">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => {
              setDirection(index > currentSlide ? 1 : -1)
              setCurrentSlide(index)
            }}
            className={`w-1 md:w-2 h-1 md:h-2 rounded-full transition-all duration-300 ${
              index === currentSlide ? 'bg-red-600 w-4 md:w-8' : 'bg-white bg-opacity-50'
            }`}
          />
        ))}
      </div>
    </div>
  )
}  
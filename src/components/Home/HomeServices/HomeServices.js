"use client"
import { useState, useEffect, useRef } from 'react'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { FaTimes,FaChevronLeft,FaChevronRight } from 'react-icons/fa'
import { 
  FaChartLine, 
  FaMoneyBillWave, 
  FaBitcoin, 
  FaFileContract 
} from 'react-icons/fa'

const services = [
  {
    id: 1,
    title: "Stock Markets",
    description: "Proper management of stock trading produces stable profits. Expert analysis and strategic trading in global stock markets, ensuring optimal portfolio performance and risk management.",
    image: "/stockmarkets.jpg",
    icon: FaChartLine,
    borderColor: "border-blue-500"
  },
  {
    id: 2,
    title: "Managing Investments",
    description: "Some investors enjoy managing their own plan. Comprehensive investment management services utilizing advanced algorithms and market intelligence.",
    image: "/managinginvestment.jpg",
    icon: FaMoneyBillWave,
    borderColor: "border-green-500"
  },
  {
    id: 3,
    title: "Cryptocurrency Markets",
    description: "High volatility of crypto markets brings multiple profits. Advanced crypto trading strategies and blockchain investment opportunities for maximum returns.",
    image: "/cryptocurrencymarkets.jpg",
    icon: FaBitcoin,
    borderColor: "border-yellow-500"
  },
  {
    id: 4,
    title: "Estate Planning",
    description: "An estate plan can also take care of you as you get older or if you become ill or incapacitated. Strategic estate planning services to protect and grow your wealth for future generations.",
    image: "/Estateplanning.jpg",
    icon: FaFileContract,
    borderColor: "border-purple-500"
  }
]

export default function HomeServices() {
  const [selectedImage, setSelectedImage] = useState(null)
  const [items, setItems] = useState(services)
  const [isAnimating, setIsAnimating] = useState(false)
  const isMobile = useRef(false)
  const [currentIndex, setCurrentIndex] = useState(0)


  const nextSlide = () => {
    setIsAnimating(true)
    setItems(prevItems => {
      const newItems = [...prevItems]
      const firstItem = newItems.shift()
      newItems.push(firstItem)
      return newItems
    })
    setTimeout(() => setIsAnimating(false), 500)
  }
  
  const prevSlide = () => {
    setIsAnimating(true)
    setItems(prevItems => {
      const newItems = [...prevItems]
      const lastItem = newItems.pop()
      newItems.unshift(lastItem)
      return newItems
    })
    setTimeout(() => setIsAnimating(false), 500)
  }
  


  useEffect(() => {
    const checkMobile = () => {
      isMobile.current = window.innerWidth < 768
    }
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  useEffect(() => {
    const interval = setInterval(() => {
      if (!isAnimating) {
        rotateItems()
      }
    }, 5000)
    return () => clearInterval(interval)
  }, [items, isAnimating])

  const rotateItems = () => {
    setIsAnimating(true)
    setItems(prevItems => {
      const newItems = [...prevItems]
      const firstItem = newItems.shift()
      newItems.push(firstItem)
      return newItems
    })
    setTimeout(() => setIsAnimating(false), 500)
  }

  const ServiceCard = ({ service, index }) => {
    const Icon = service.icon
    return (
      <div
        className={`
          w-full 
          md:w-[calc(33.333%-1rem)] 
          shrink-0 
          ${index >= (isMobile.current ? 2 : 3) ? 'hidden' : ''}
          transition-transform duration-500 ease-in-out
        `}
      >
        <div className={`
          bg-white rounded-2xl shadow-lg overflow-hidden 
          border-2 ${service.borderColor} 
          hover:shadow-2xl transition-all duration-300
          h-full
        `}>


        
        <div 
          className="relative h-48 md:h-56 w-full cursor-pointer"
          onClick={() => setSelectedImage(service.image)}
        >
          <Image
            src={service.image}
            alt={service.title}
            fill
            className="object-cover hover:scale-110 transition-transform duration-300"
          />
        </div>
        <div className="p-4 md:p-6">
        <Icon className="text-2xl md:text-3xl mb-3 md:mb-4 text-red-600" />
          <h3 className="text-lg md:text-xl font-bold mb-2 md:mb-4 text-gray-900">
            {service.title}
          </h3>
          <p className="text-sm md:text-base text-gray-600 leading-relaxed line-clamp-3">
            {service.description}
          </p>
        </div>
      </div>
    </div>
  )
}



  return (
    <section className="py-6 md:py-10 bg-white overflow-hidden">
      <div className="container mx-auto px-4">
     <div className="relative mb-6 bg-gradient-to-r from-gray-900 via-red-900 to-gray-900 rounded-2xl shadow-2xl">
  <div className="absolute inset-0 bg-grid-white/[0.05] bg-[size:20px_20px]"></div>
  <div className="flex items-center justify-between p-8 md:p-10">
    <motion.div 
      initial={{ opacity: 0, x: -20 }}
      whileInView={{ opacity: 1, x: 0 }}
      className="max-w-2xl"
    >
      <h2 className="text-2xl md:text-5xl font-bold mb-4 text-white">What We Do</h2>
      <p className="text-lg text-gray-300">Services For You</p>
    </motion.div>
    
    <div className="flex gap-4">
      <button 
        onClick={prevSlide}
        className="p-3 rounded-full bg-white/10 backdrop-blur text-white hover:bg-white/20 transition-colors duration-300 shadow-lg"
      >
        <FaChevronLeft className="text-xl" />
      </button>
      <button 
        onClick={nextSlide}
        className="p-3 rounded-full bg-white/10 backdrop-blur text-white hover:bg-white/20 transition-colors duration-300 shadow-lg"
      >
        <FaChevronRight className="text-xl" />
      </button>
    </div>
  </div>
</div>



        {/* Main Services Slider */}
        <div className="flex gap-4 md:gap-8 ">
          <AnimatePresence mode="popLayout">
            {items.map((service, index) => (
              <ServiceCard key={service.id} service={service} index={index} />
            ))}
          </AnimatePresence>
        </div>

       

        {/* Image Modal */}
        <AnimatePresence>
          {selectedImage && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
              onClick={() => setSelectedImage(null)}
            >
              <motion.div
                initial={{ scale: 0.5 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0.5 }}
                className="relative max-w-4xl w-full aspect-video"
              >
                <Image
                  src={selectedImage}
                  alt="Selected service"
                  fill
                  className="object-contain"
                />
                <button
                  onClick={() => setSelectedImage(null)}
                  className="absolute top-4 right-4 text-white p-2 rounded-full bg-red-600 hover:bg-red-700"
                >
                  <FaTimes />
                  </button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  )
}


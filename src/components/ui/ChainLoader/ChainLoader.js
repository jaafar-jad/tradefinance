"use client"
import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'

const ChainLoader = () => {
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 2000)
    return () => clearTimeout(timer)
  }, [])

  if (!loading) return null

  return (
    <div className="fixed inset-0 bg-black/90 backdrop-blur-sm z-50 flex items-center justify-center">
      <div className="relative">
        <motion.div
          className="w-16 h-16 rounded-full border-4 border-red-600"
          animate={{
            scale: [1, 1.2, 1],
            rotate: 360,
            borderRadius: ["50%", "30%", "50%"]
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "linear"
          }}
        />
        <motion.div
          className="absolute top-0 left-0 w-16 h-16 rounded-full border-4 border-t-white border-r-white border-b-transparent border-l-transparent"
          animate={{
            rotate: -360
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: "linear"
          }}
        />
        <motion.div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8"
          animate={{
            scale: [1, 0.8, 1],
            rotate: -180
          }}
          transition={{
            duration: 1,
            repeat: Infinity,
            ease: "linear"
          }}
        >
          <div className="w-full h-full bg-gradient-to-br from-red-500 to-white rounded-full opacity-80" />
        </motion.div>
      </div>
    </div>
  )
}

export default ChainLoader

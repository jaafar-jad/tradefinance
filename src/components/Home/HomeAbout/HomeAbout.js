"use client"
import Image from 'next/image'
import { motion } from 'framer-motion'
import Link from 'next/link'

export default function HomeAbout() {
  return (
    <section className="py-8 bg-white">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Image Column */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="relative h-[400px] lg:h-[600px] rounded-2xl overflow-hidden"
          >
            <Image
              src="/tfabout.png"
              alt="Trade Finance About"
              fill
              className="object-cover"
              priority
            />
          </motion.div>

          {/* Content Column */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="space-y-8"
          >
            <div>
              <h2 className="text-3xl lg:text-5xl font-bold text-gray-900 mb-4">
                About Us
              </h2>
              <p className="text-xl text-red-600 font-semibold">
                Our Company Building Profits Since 28 March, 2015.
              </p>
            </div>

            <p className="text-lg text-gray-600 leading-relaxed italic">
              "We support and empower clients through new aspirations, changing circumstances, and all of life's transitions."
            </p>

            <p className="text-gray-700 leading-relaxed">
              trade-finances.org is an offshore private equity firm with headquarters based in New London. We are a multi-asset company with a strong, diversified portfolio of investments across real estate and fintech sectors. For over 8 years, our founding partners and directors have been utilising personal, institutional and private capital to invest in and manage an innovative portfolio of projects and business, to deliver strong, sustainable yields. We have operated businesses across multiple industry sectors and our portfolio continues to grow, helping property developments and nascent businesses thrive.
            </p>

            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Link 
                href="/about"
                className="inline-flex items-center gap-2 px-6 py-3 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 transition-colors duration-300"
              >
                More About
                <svg 
                  className="w-5 h-5" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M17 8l4 4m0 0l-4 4m4-4H3" 
                  />
                </svg>
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

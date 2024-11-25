"use client"
import Image from 'next/image'
import { motion } from 'framer-motion'

export default function HomeAffiliate() {
  return (
    <section className="py-8 bg-white">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="relative h-[200px] md:h-[400px] rounded-2xl overflow-hidden shadow-2xl"
        >
          <Image
            src="/affiliatebanks.png"
            alt="Affiliate Program"
            fill
            className="object-fit"
            priority
          />
        </motion.div>
      </div>
    </section>
  )
}

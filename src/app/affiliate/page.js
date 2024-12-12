"use client"
import { motion } from 'framer-motion'
import Image from 'next/image'
import Head from 'next/head'

const affiliateBanks = [
  {
    name: "Deutsche Apotheker-und Ärztebank",
    description: "Germany's largest cooperative primary bank, specializing in healthcare sector services."
  },
  {
    name: "BT Financial Group",
    description: "Leading provider of wealth management services in Australia."
  },
  {
    name: "Coutts",
    description: "Prestigious private bank and wealth manager, serving clients since 1692."
  },
  {
    name: "Deutsche Bank",
    description: "Global investment bank and financial services provider."
  },
  {
    name: "Edmond de Rothschild",
    description: "Independent family-owned financial group specializing in private banking and asset management."
  },
  {
    name: "HSBC",
    description: "One of the world's largest banking and financial services organizations."
  },
  {
    name: "Maybank",
    description: "Malaysia's largest financial services group and leading banking group in Southeast Asia."
  },
  {
    name: "Raiffeisen",
    description: "Leading Swiss retail bank and third largest banking group in Switzerland."
  },
  {
    name: "Societe Generale",
    description: "Major French multinational investment bank and financial services company."
  },
  {
    name: "Barclays",
    description: "British multinational universal bank with operations in retail, wholesale and investment banking."
  },
  {
    name: "DBS",
    description: "Multinational banking and financial services corporation headquartered in Singapore."
  },
  {
    name: "LGT",
    description: "Largest family-owned private banking and asset management group in the world."
  }
]

export default function Affiliate() {
  return (
    <>
    <Head>
      <title>Banking Partners & Affiliates | Trade Finance</title>
      <meta name="description" content="Discover Trade Finance's global banking partnerships with leading institutions like Deutsche Bank, HSBC, Barclays, and more. Access international markets with enhanced security and premium services." />
      
      {/* Open Graph */}
      <meta property="og:title" content="Banking Partners & Affiliates | Trade Finance" />
      <meta property="og:description" content="Partner with world-class financial institutions through Trade Finance's extensive global banking network." />
      <meta property="og:image" content="/affiliatebanks.png" />
      <meta property="og:type" content="website" />
      
      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content="Banking Partners & Affiliates | Trade Finance" />
      <meta name="twitter:description" content="Access premium banking services through our partnerships with Deutsche Bank, HSBC, Barclays, and more." />
      <meta name="twitter:image" content="/affiliatebanks.png" />
      
      {/* Additional SEO */}
      <meta name="keywords" content="banking partners, affiliate banks, Deutsche Bank, HSBC, Barclays, global banking, financial partnerships, trade finance partners" />
      <link rel="canonical" href="https://tradefinancetf.com/affiliate" />
    </Head>


    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="relative h-[30vh]   md:h-[80vh] overflow-hidden">
        <Image
          src="/affiliatebanks.png"
          alt="Affiliate Banks"
          fill
          className="object-cover "
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-transparent">
          <div className="container mx-auto px-4 h-full flex flex-col justify-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="max-w-4xl"
            >
              
            </motion.div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 bg-gray-900">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center max-w-3xl mx-auto mb-16"
          >
            <h2 className="text-2xl md:text-5xl font-bold mb-6 text-white font-serif">
              Partnership Benefits
            </h2>
            <p className="text-sm md:text-xl text-gray-300 leading-relaxed">
              Our strategic banking partnerships provide exceptional advantages for our clients
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-7xl mx-auto">
            {[
              {
                title: "Global Reach",
                description: "Access to international markets and cross-border banking services through our extensive network."
              },
              {
                title: "Enhanced Security",
                description: "Multi-layered security protocols and advanced fraud prevention systems."
              },
              {
                title: "Premium Services",
                description: "Exclusive banking products and preferential rates for our clients."
              }
            ].map((benefit, index) => (
              <motion.div
                key={benefit.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.2 }}
                className="bg-gray-800 rounded-2xl p-8 hover:bg-gray-700 transition-colors duration-300"
              >
                <h3 className="text-xl md:text-2xl font-bold mb-4 text-white font-serif">
                  {benefit.title}
                </h3>
                <p className="text-gray-300 leading-relaxed">
                  {benefit.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Partners Grid */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-center max-w-3xl mx-auto mb-16"
          >
            <h2 className="text-2xl md:text-4xl font-bold mb-6 text-gray-900 font-serif">
            Our Global Banking Partners
            </h2>
            <p className="text-lg md:text-xl text-gray-600 leading-relaxed">
              Our strategic partnerships with these prestigious financial institutions enable us to provide unparalleled services and solutions to our clients worldwide.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
            {affiliateBanks.map((bank, index) => (
              <motion.div
                key={bank.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-gray-50 rounded-2xl p-8 hover:shadow-xl transition-shadow duration-300"
              >
                <h3 className="text-xl md:text-2xl font-bold mb-4 text-gray-900 font-serif">
                  {bank.name}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {bank.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
    </>
  )
}

  
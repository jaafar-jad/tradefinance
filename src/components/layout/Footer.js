"use client"
import Link from 'next/link';
import { motion } from 'framer-motion';
import { MdLocationOn, MdEmail } from 'react-icons/md';
import { BiTime } from 'react-icons/bi';
import { FaTelegram } from 'react-icons/fa';


const navigationLinks = [
  { name: 'Home', path: '/' },
  { name: 'About', path: '/about' },
  { name: 'Plans', path: '/plans' },
  { name: 'Login', path: '/auth/login' },
  { name: 'Signup', path: '/auth/signup' },
  { name: 'Contact', path: '/contact' }
];


export default function Footer() {
  const fadeInUp = {
    initial: { y: 50, opacity: 0 },
    animate: { y: 0, opacity: 1 },
    transition: { duration: 0.5 }
  };

  return (
    <footer className="bg-gray-900 text-gray-300 pt-16 pb-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* About Section */}
          <motion.div 
            {...fadeInUp}
            className="space-y-4"
          >
            <h3 className="text-2xl font-bold text-white mb-4">Trade Finance</h3>
            <p className="text-gray-400 leading-relaxed">
              Being one of the ways we generate income, we have built this platform to make it easy for investors to diversify and invest their capital into cryptocurrency.
            </p>
          </motion.div>

        {/* Useful Links */}
<motion.div 
  {...fadeInUp}
  transition={{ delay: 0.2 }}
  className="space-y-4"
>
  <h3 className="text-xl font-semibold text-white mb-4">Useful Links</h3>
  <ul className="space-y-2">
    {navigationLinks.map((link) => (
      <li key={link.name}>
        <Link 
          href={link.path}
          className="hover:text-red-400 transition-colors duration-300 block py-1"
        >
          {link.name}
        </Link>
      </li>
    ))}
  </ul>
</motion.div>


          {/* Contact Info */}
          <motion.div 
            {...fadeInUp}
            transition={{ delay: 0.4 }}
            className="space-y-4"
          >
            <h3 className="text-xl font-semibold text-white mb-4">Contact Info</h3>
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <BiTime className="text-red-400 text-xl mt-1" />
                <div>
                  <p className="font-medium text-white">Day Started</p>
                  <p className="text-gray-400">28 March, 2015</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <MdLocationOn className="text-red-400 text-xl mt-1" />
                <p className="text-gray-400">
                  78 Drury Lane, Strand, London, United Kingdom, WC2B 5RH
                </p>
              </div>
              <div className="flex items-start space-x-3">
                <FaTelegram className="text-red-400 text-xl mt-1" />
                <a 
                  href="https://t.me/LauraKathy"
                  className="text-gray-400 hover:text-red-400 transition-colors duration-300"
                >
                  admin@tradefinancetf.com
                </a>
              </div>
            </div>
          </motion.div>

          {/* Additional Links */}
          <motion.div 
            {...fadeInUp}
            transition={{ delay: 0.6 }}
            className="space-y-4"
          >
            <h3 className="text-xl font-semibold text-white mb-4">Legal</h3>
            <ul className="space-y-2">
              <li>
                <Link 
                  href="/contact"
                  className="hover:text-red-400 transition-colors duration-300 block py-1"
                >
                  Contact Us
                </Link>
              </li>
              <li>
                <Link 
                  href="/terms"
                  className="hover:text-red-400 transition-colors duration-300 block py-1"
                >
                  Terms & Conditions
                </Link>
              </li>
            </ul>
          </motion.div>
        </div>

        {/* Copyright */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="border-t border-gray-800 mt-12 pt-8 text-center"
        >
          <p className="text-gray-400">
            © {new Date().getFullYear()} trade-finances.org. All Rights Reserved.
          </p>
        </motion.div>
      </div>
    </footer>
  );
}

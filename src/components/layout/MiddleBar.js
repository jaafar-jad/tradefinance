import { MdLocationOn } from 'react-icons/md';
import { BiTime } from 'react-icons/bi';
import { motion } from 'framer-motion';

export default function MiddleBar() {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="bg-white py-3 hidden lg:block"
    >
      <div className="container mx-auto">
        <div className="flex justify-between items-center px-4">
          <div className="flex items-center space-x-4">
            <MdLocationOn className="text-3xl text-red-600" />
            <div>
              <p className="font-medium">Address</p>
              <p className="text-sm text-gray-600">78 Drury Lane, Strand, London, United Kingdom, WC2B 5RH</p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <BiTime className="text-3xl text-red-600" />
            <div>
              <p className="font-medium">Days Online</p>
              <p className="text-sm text-gray-600">365</p>
            </div>
          </div>
          <a
          href='/auth/signup'
          className="bg-red-600 text-white px-6 py-2 rounded-md hover:bg-red-700 transition-colors">
            Join Now
          </a>
        </div>
      </div>
    </motion.div>
  );
}











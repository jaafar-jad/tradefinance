import { MdEmail, MdLocationOn } from 'react-icons/md';
import { BiTime } from 'react-icons/bi';
import { FaFacebookF, FaTwitter, FaGooglePlusG, FaLinkedinIn } from 'react-icons/fa';
import { motion } from 'framer-motion';

export default function TopBar() {
  return (
    <motion.div 
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="hidden lg:block bg-gray-100 text-sm"
    >
      <div className="container mx-auto">
        <div className="flex justify-between items-center py-2 px-4">
          <div className="flex items-center space-x-2">
            <span className="font-semibold text-red-900">
              We Are Leading Provider Of Industrial Solutions.
            </span>
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <MdEmail className="text-red-600 text-xl" />
             <a 
                  href="mailto:admin@trade-finances.org"
                  className="text-gray-400 hover:text-red-400 transition-colors duration-300"
                >
                  admin@trade-finances.org
                </a> </div>
            <div className="flex items-center space-x-4">
              <FaFacebookF className="text-red-600 hover:text-red-800 cursor-pointer" />
              <FaTwitter className="text-red-400 hover:text-red-600 cursor-pointer" />
              <FaGooglePlusG className="text-red-500 hover:text-red-700 cursor-pointer" />
              <FaLinkedinIn className="text-red-700 hover:text-red-900 cursor-pointer" />
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

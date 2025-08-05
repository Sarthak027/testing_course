import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const Header: React.FC = () => {
  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="bg-white shadow-sm sticky top-0 z-40"
    >
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-start">
          <Link to="/" className="flex items-center group">
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="w-16 h-16 md:w-20 md:h-20 rounded-full overflow-hidden shadow-lg mr-4"
            >
              <img
                src="/jesse_course_logo.jpg"
                alt="Jesse Course World"
                className="w-full h-full object-cover"
              />
            </motion.div>
            <div className="flex flex-col">
              <motion.h1
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="text-xl md:text-2xl font-bold text-gray-800 group-hover:text-blue-600 transition-colors"
              >
                Jesse Course World
              </motion.h1>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="text-sm md:text-base text-gray-600 font-medium"
              >
                Empowering Traders Worldwide
              </motion.p>
            </div>
          </Link>
        </div>
      </div>
    </motion.header>
  );
};

export default Header;
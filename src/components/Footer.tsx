import React from 'react';
import { motion } from 'framer-motion';
import { Mail, MessageCircle } from 'lucide-react';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <motion.footer
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className="bg-gray-800 text-white py-12"
    >
      <div className="container mx-auto px-4">
        <div className="text-center">
          <div className="flex items-center justify-center mb-4">
            <img
              src="/jesse_course_logo.jpg"
              alt="Jesse Course World"
              className="w-12 h-12 rounded-full mr-3"
            />
            <h3 className="text-xl font-bold">Jesse Course World</h3>
          </div>
          <p className="text-gray-400 mb-6 max-w-2xl mx-auto">
            Master trading & investment skills and transform your financial future with our premium courses.
          </p>
          
          <div className="flex justify-center space-x-4 mb-6">
            <motion.a
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              href={`https://t.me/${import.meta.env.VITE_TELEGRAM_USERNAME || 'jessecourseworld'}`}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-blue-600 p-3 rounded-full hover:bg-blue-700 transition-colors"
            >
              <MessageCircle size={20} />
            </motion.a>
            <motion.a
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              href="mailto:contact@jessecourseworld.com"
              className="bg-green-600 p-3 rounded-full hover:bg-green-700 transition-colors"
            >
              <Mail size={20} />
            </motion.a>
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="border-t border-gray-700 mt-8 pt-8 text-center"
        >
          <p className="text-gray-400">
            © {currentYear} Jesse Course World. All rights reserved.
          </p>
        </motion.div>
      </div>
    </motion.footer>
  );
};

export default Footer;
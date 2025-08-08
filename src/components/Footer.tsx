import React from 'react';
import { motion } from 'framer-motion';
import { MessageCircle } from 'lucide-react';

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
          
          <div className="flex justify-center mb-6">
            <motion.a
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              href={`https://t.me/${import.meta.env.VITE_TELEGRAM_USERNAME || 'jessecourseworld'}`}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-blue-500 p-4 rounded-full hover:bg-blue-600 transition-colors shadow-lg hover:shadow-xl flex items-center justify-center"
              title="Join our Telegram Channel"
            >
              <MessageCircle size={24} />
            </motion.a>
          </div>
          
          <p className="text-gray-400 text-sm mb-4">
            📱 Join our Telegram channel for course updates and support
          </p>
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
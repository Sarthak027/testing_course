import React from 'react';
import { motion } from 'framer-motion';
import { Course } from '../types';

interface CourseCardProps {
  course: Course;
  index?: number;
}

const CourseCard: React.FC<CourseCardProps> = ({ course, index = 0 }) => {
  const handleBuyNow = () => {
    const telegramUsername = import.meta.env.VITE_TELEGRAM_USERNAME || 'jessecourseworld';
    const message = encodeURIComponent(`Hi, I want to buy the course: ${course.title}`);
    const telegramUrl = `https://t.me/${telegramUsername}?text=${message}`;
    window.open(telegramUrl, '_blank');
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      whileHover={{ y: -5 }}
      className="bg-white rounded-xl shadow-lg overflow-hidden group hover:shadow-xl transition-all duration-300"
    >
      <div className="relative overflow-hidden">
        <motion.img
          whileHover={{ scale: 1.05 }}
          src={course.thumbnail}
          alt={course.title}
          className="w-full h-48 object-cover transition-transform duration-300"
        />
        <div className="absolute top-4 right-4">
          <span className="bg-red-500 text-white px-2 py-1 rounded-full text-xs font-bold">
            {course.discountPercentage}% OFF
          </span>
        </div>
      </div>

      <div className="p-6">
        <div className="mb-2">
          <span className="text-xs font-semibold text-blue-600 bg-blue-100 px-2 py-1 rounded-full">
            {course.category}
          </span>
        </div>

        <h3 className="text-xl font-bold text-gray-800 mb-3 group-hover:text-blue-600 transition-colors">
          {course.title}
        </h3>

        <p className="text-gray-600 text-sm mb-4 line-clamp-3">
          {course.description}
        </p>

        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <span className="text-2xl font-bold text-green-600">
              ₹{course.discountPrice}
            </span>
            <span className="text-lg text-gray-400 line-through">
              ₹{course.originalPrice}
            </span>
          </div>
        </div>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleBuyNow}
          className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-bold py-3 px-6 rounded-lg transition-all duration-300 shadow-md hover:shadow-lg"
        >
          Buy Now
        </motion.button>
      </div>
    </motion.div>
  );
};

export default CourseCard;
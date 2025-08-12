import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Course } from '../types';

interface CourseCardProps {
  course: Course;
  index?: number;
}

const CourseCard: React.FC<CourseCardProps> = ({ course, index = 0 }) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageDimensions, setImageDimensions] = useState({ width: 0, height: 0 });
  const imgRef = useRef<HTMLImageElement>(null);

  const handleImageLoad = () => {
    if (imgRef.current) {
      setImageDimensions({
        width: imgRef.current.naturalWidth,
        height: imgRef.current.naturalHeight
      });
      setImageLoaded(true);
    }
  };

  const handleBuyNow = () => {
    const telegramUsername = import.meta.env.VITE_TELEGRAM_USERNAME || 'jessecourseworld';
    const message = encodeURIComponent(`Hi, I want to buy the course: ${course.title}`);
    const telegramUrl = `https://t.me/${telegramUsername}?text=${message}`;
    window.open(telegramUrl, '_blank');
  };

  // Calculate aspect ratio for responsive sizing
  const aspectRatio = imageDimensions.height > 0 ? imageDimensions.width / imageDimensions.height : 16/9;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      whileHover={{ y: -5 }}
      className="bg-white rounded-xl shadow-lg overflow-hidden group hover:shadow-xl transition-all duration-300"
    >
      {/* Dynamic Image Container */}
      <div className="relative w-full overflow-hidden">
        {!imageLoaded && (
          <div className="w-full h-48 bg-gray-200 animate-pulse flex items-center justify-center">
            <div className="text-gray-400">Loading...</div>
          </div>
        )}
        
        <motion.img
          ref={imgRef}
          whileHover={{ scale: 1.02 }}
          src={course.thumbnail}
          alt={course.title}
          onLoad={handleImageLoad}
          className={`w-full h-auto object-contain transition-transform duration-300 ${
            !imageLoaded ? 'hidden' : 'block'
          }`}
          style={{
            maxHeight: '400px',
            minHeight: '200px'
          }}
        />
        
        {/* Discount Badge */}
        <div className="absolute top-4 right-4">
          <span className="bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold shadow-lg">
            {course.discountPercentage}% OFF
          </span>
        </div>
      </div>

      {/* Content Section */}
      <div className="p-6">
        {/* Category Badge */}
        <div className="mb-3">
          <span className="text-xs font-semibold text-blue-600 bg-blue-100 px-3 py-1 rounded-full">
            {course.category}
          </span>
        </div>

        {/* Title */}
        <h3 className="text-xl font-bold text-gray-800 mb-3 group-hover:text-blue-600 transition-colors line-clamp-2">
          {course.title}
        </h3>

        {/* Description */}
        <p className="text-gray-600 text-sm mb-4 line-clamp-3 leading-relaxed">
          {course.description}
        </p>

        {/* Pricing */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <span className="text-2xl font-bold text-green-600">
              ₹{course.discountPrice.toLocaleString()}
            </span>
            <span className="text-lg text-gray-400 line-through">
              ₹{course.originalPrice.toLocaleString()}
            </span>
          </div>
          <div className="text-sm text-green-600 font-semibold">
            Save ₹{(course.originalPrice - course.discountPrice).toLocaleString()}
          </div>
        </div>

        {/* Buy Button */}
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
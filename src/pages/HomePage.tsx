import React from 'react';
import { motion } from 'framer-motion';
import PromoBar from '../components/PromoBar';
import Header from '../components/Header';
import CategorySection from '../components/CategorySection';
import CourseGrid from '../components/CourseGrid';
import GallerySection from '../components/GallerySection';
import Footer from '../components/Footer';

const HomePage: React.FC = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="min-h-screen bg-white"
    >
      <PromoBar />
      <Header />
      
      {/* Hero Section */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="py-16 bg-gradient-to-br from-blue-50 to-indigo-100"
      >
        <div className="container mx-auto px-4 text-center">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-4xl md:text-6xl font-bold text-gray-800 mb-6"
          >
            Transform Your Trading Journey
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="text-xl md:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto"
          >
            Access premium courses designed by industry experts to help you master trading, investing, and digital marketing
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => document.getElementById('courses')?.scrollIntoView({ behavior: 'smooth' })}
              className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold py-4 px-8 rounded-lg text-lg shadow-lg transition-all duration-300"
            >
              Explore Courses
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => document.getElementById('categories')?.scrollIntoView({ behavior: 'smooth' })}
              className="bg-white text-gray-800 font-bold py-4 px-8 rounded-lg text-lg shadow-lg hover:shadow-xl transition-all duration-300 border-2 border-gray-200 hover:border-gray-300"
            >
              Browse Categories
            </motion.button>
          </motion.div>
        </div>
      </motion.section>

      <div id="categories">
        <CategorySection />
      </div>
      
      <div id="courses">
        <CourseGrid />
      </div>
      
      <GallerySection />
      
      <Footer />
    </motion.div>
  );
};

export default HomePage;
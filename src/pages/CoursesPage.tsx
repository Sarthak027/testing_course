import React from 'react';
import { motion } from 'framer-motion';
import { useSearchParams, Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import Header from '../components/Header';
import CourseGrid from '../components/CourseGrid';
import GallerySection from '../components/GallerySection';
import Footer from '../components/Footer';

const CoursesPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const category = searchParams.get('category');

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="min-h-screen bg-white"
    >
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <Link
            to="/"
            className="inline-flex items-center text-blue-600 hover:text-blue-700 font-semibold transition-colors"
          >
            <ArrowLeft size={20} className="mr-2" />
            Back to Home
          </Link>
        </motion.div>

        {category && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-center mb-12"
          >
            <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
              {category} Courses
            </h1>
            <p className="text-lg text-gray-600">
              Discover our premium {category.toLowerCase()} courses
            </p>
          </motion.div>
        )}
      </div>

      <CourseGrid />
       <GallerySection />
      <Footer />
    </motion.div>
  );
};

export default CoursesPage;
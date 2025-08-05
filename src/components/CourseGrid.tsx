import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useSearchParams } from 'react-router-dom';
import { Course } from '../types';
import { storageUtils, storageEvents } from '../utils/storage';
import CourseCard from './CourseCard';

const CourseGrid: React.FC = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [filteredCourses, setFilteredCourses] = useState<Course[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const loadCourses = async () => {
      const loadedCourses = await storageUtils.getCourses();
      setCourses(loadedCourses);
    };
    
    loadCourses();
    
    const categoryParam = searchParams.get('category');
    if (categoryParam) {
      setSelectedCategory(categoryParam);
    }

    // Listen for course changes from admin panel
    const handleCoursesChanged = (newCourses: Course[]) => {
      setCourses(newCourses);
    };

    storageEvents.on('coursesChanged', handleCoursesChanged);

    return () => {
      storageEvents.off('coursesChanged', handleCoursesChanged);
    };
  }, [searchParams]);

  useEffect(() => {
    if (selectedCategory === 'All') {
      setFilteredCourses(courses);
    } else {
      setFilteredCourses(courses.filter(course => course.category === selectedCategory));
    }
  }, [courses, selectedCategory]);

  const categories = ['All', ...Array.from(new Set(courses.map(course => course.category)))];

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
            Our Premium Courses
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Invest in your future with our expertly crafted courses
          </p>
        </motion.div>

        {/* Category Filter */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="flex flex-wrap justify-center gap-3 mb-12"
        >
          {categories.map((category) => (
            <motion.button
              key={category}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setSelectedCategory(category)}
              className={`px-6 py-2 rounded-full font-semibold transition-all duration-300 ${
                selectedCategory === category
                  ? 'bg-blue-600 text-white shadow-lg'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {category}
            </motion.button>
          ))}
        </motion.div>

        {/* Course Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredCourses.map((course, index) => (
            <CourseCard key={course.id} course={course} index={index} />
          ))}
        </div>

        {filteredCourses.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <p className="text-gray-500 text-lg">No courses found in this category.</p>
          </motion.div>
        )}
      </div>
    </section>
  );
};

export default CourseGrid;
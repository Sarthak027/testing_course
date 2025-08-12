import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { TrendingUp, DollarSign, Megaphone, Bitcoin, BarChart3, Users, BookOpen, Target } from 'lucide-react';

const categories = [
  {
    name: 'Latest Course',
    icon: Target,
    description: 'Our newest and most updated courses',
    gradient: 'from-emerald-500 to-emerald-600',
    hoverGradient: 'from-emerald-600 to-emerald-700'
  },
  {
    name: 'Forex Courses',
    icon: DollarSign,
    description: 'Master currency trading and market analysis',
    gradient: 'from-green-500 to-green-600',
    hoverGradient: 'from-green-600 to-green-700'
  },
  {
    name: 'Option Trading',
    icon: TrendingUp,
    description: 'Learn advanced options strategies and risk management',
    gradient: 'from-blue-500 to-blue-600',
    hoverGradient: 'from-blue-600 to-blue-700'
  },
  {
    name: 'Swing Trading',
    icon: BarChart3,
    description: 'Master swing trading techniques and timing',
    gradient: 'from-purple-500 to-purple-600',
    hoverGradient: 'from-purple-600 to-purple-700'
  },
  {
    name: 'Technical Trader',
    icon: Target,
    description: 'Advanced technical analysis and chart patterns',
    gradient: 'from-red-500 to-red-600',
    hoverGradient: 'from-red-600 to-red-700'
  },
  {
    name: 'Price Action',
    icon: TrendingUp,
    description: 'Pure price action trading without indicators',
    gradient: 'from-orange-500 to-orange-600',
    hoverGradient: 'from-orange-600 to-orange-700'
  },
  {
    name: 'Fundamentals',
    icon: BookOpen,
    description: 'Learn fundamental analysis and market basics',
    gradient: 'from-teal-500 to-teal-600',
    hoverGradient: 'from-teal-600 to-teal-700'
  },
  {
    name: 'SMC & ICT',
    icon: Bitcoin,
    description: 'Smart Money Concepts and ICT methodology',
    gradient: 'from-indigo-500 to-indigo-600',
    hoverGradient: 'from-indigo-600 to-indigo-700'
  },
  {
    name: 'For Beginners',
    icon: Users,
    description: 'Start your trading journey with basics',
    gradient: 'from-pink-500 to-pink-600',
    hoverGradient: 'from-pink-600 to-pink-700'
  }
];

const CategorySection: React.FC = () => {
  const navigate = useNavigate();

  const handleExplore = (category: string) => {
    navigate(`/courses?category=${encodeURIComponent(category)}`);
  };

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
            Explore Our Course Categories
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Choose from our comprehensive selection of professional courses designed to elevate your skills
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((category, index) => {
            const Icon = category.icon;
            return (
              <motion.div
                key={category.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ y: -5 }}
                className="group cursor-pointer"
                onClick={() => handleExplore(category.name)}
              >
                <div className={`bg-gradient-to-br ${category.gradient} group-hover:${category.hoverGradient} p-6 rounded-xl shadow-lg text-white transition-all duration-300`}>
                  <div className="flex flex-col items-center text-center">
                    <motion.div
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      className="mb-4"
                    >
                      <Icon size={48} />
                    </motion.div>
                    <h3 className="text-xl font-bold mb-2">{category.name}</h3>
                    <p className="text-sm opacity-90 mb-4">{category.description}</p>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="bg-white text-gray-800 px-4 py-2 rounded-lg font-semibold text-sm hover:bg-gray-100 transition-colors"
                    >
                      Explore Courses
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default CategorySection;
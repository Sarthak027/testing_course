import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { storageUtils, storageEvents } from '../utils/storage';
import { PromoConfig } from '../types';

const PromoBar: React.FC = () => {
  const [promo, setPromo] = useState<PromoConfig>({ text: '53% OFF. Use code: SAVE53', isActive: true });
  const [isVisible, setIsVisible] = useState(true);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadPromo = async () => {
      try {
        const loadedPromo = await storageUtils.getPromo();
        setPromo(loadedPromo);
      } catch (error) {
        console.error('Error loading promo:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadPromo();

    // Listen for promo changes from admin panel
    const handlePromoChanged = (newPromo: PromoConfig) => {
      setPromo(newPromo);
    };

    storageEvents.on('promoChanged', handlePromoChanged);

    return () => {
      storageEvents.off('promoChanged', handlePromoChanged);
    };
  }, []);

  if (isLoading || !promo.isActive || !isVisible) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: -100, opacity: 0 }}
        className="bg-gradient-to-r from-green-500 to-blue-600 text-white py-3 px-4 relative overflow-hidden"
      >
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="container mx-auto flex items-center justify-center relative z-10">
          <motion.p
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            className="text-center font-semibold text-sm md:text-base"
          >
            🎉 {promo.text}
          </motion.p>
          <button
            onClick={() => setIsVisible(false)}
            className="absolute right-4 p-1 hover:bg-white/20 rounded-full transition-colors"
          >
            <X size={18} />
          </button>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default PromoBar;
import { Course, PromoConfig, GalleryItem } from '../types';
import { supabase, TABLES, initializeDatabase } from '../lib/supabase';

// Event emitter for real-time updates
class StorageEventEmitter {
  private listeners: { [key: string]: Function[] } = {};

  on(event: string, callback: Function) {
    if (!this.listeners[event]) {
      this.listeners[event] = [];
    }
    this.listeners[event].push(callback);
  }

  emit(event: string, data: any) {
    if (this.listeners[event]) {
      this.listeners[event].forEach(callback => callback(data));
    }
  }

  off(event: string, callback: Function) {
    if (this.listeners[event]) {
      this.listeners[event] = this.listeners[event].filter(cb => cb !== callback);
    }
  }
}

export const storageEvents = new StorageEventEmitter();

// Initialize database on first load
let isInitialized = false;
const ensureInitialized = async () => {
  if (!isInitialized) {
    await initializeDatabase();
    isInitialized = true;
  }
};

export const storageUtils = {
  // Courses
  getCourses: async (): Promise<Course[]> => {
    try {
      await ensureInitialized();
      
      const { data, error } = await supabase
        .from(TABLES.COURSES)
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error loading courses from Supabase:', error);
        return getDefaultCourses();
      }

      return data && data.length > 0 ? data.map(transformCourseFromDB) : getDefaultCourses();
    } catch (error) {
      console.error('Error loading courses:', error);
      return getDefaultCourses();
    }
  },

  saveCourses: async (courses: Course[]) => {
    try {
      await ensureInitialized();
      
      // Clear existing courses
      await supabase.from(TABLES.COURSES).delete().neq('id', '');
      
      // Insert new courses
      const coursesToInsert = courses.map(transformCourseForDB);
      const { error } = await supabase
        .from(TABLES.COURSES)
        .insert(coursesToInsert);

      if (error) {
        console.error('Error saving courses to Supabase:', error);
        return false;
      }

      storageEvents.emit('coursesChanged', courses);
      return true;
    } catch (error) {
      console.error('Error saving courses:', error);
      return false;
    }
  },

  // Promo
  getPromo: async (): Promise<PromoConfig> => {
    try {
      await ensureInitialized();
      
      const { data, error } = await supabase
        .from(TABLES.PROMO)
        .select('*')
        .limit(1)
        .single();

      if (error || !data) {
        const defaultPromo = { text: '53% OFF. Use code: SAVE53', isActive: true };
        // Save default promo to database
        await supabase.from(TABLES.PROMO).insert([{
          text: defaultPromo.text,
          is_active: defaultPromo.isActive,
          updated_at: new Date().toISOString()
        }]);
        return defaultPromo;
      }

      return {
        text: data.text,
        isActive: data.is_active
      };
    } catch (error) {
      console.error('Error loading promo:', error);
      return { text: '53% OFF. Use code: SAVE53', isActive: true };
    }
  },

  savePromo: async (promo: PromoConfig) => {
    try {
      await ensureInitialized();
      
      // Upsert promo config
      const { error } = await supabase
        .from(TABLES.PROMO)
        .upsert({
          id: 1, // Single promo config
          text: promo.text,
          is_active: promo.isActive,
          updated_at: new Date().toISOString()
        });

      if (error) {
        console.error('Error saving promo to Supabase:', error);
        return false;
      }

      storageEvents.emit('promoChanged', promo);
      return true;
    } catch (error) {
      console.error('Error saving promo:', error);
      return false;
    }
  },

  // Gallery
  getGallery: async (): Promise<GalleryItem[]> => {
    try {
      await ensureInitialized();
      
      const { data, error } = await supabase
        .from(TABLES.GALLERY)
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error loading gallery from Supabase:', error);
        return [];
      }

      return data ? data.map(transformGalleryFromDB) : [];
    } catch (error) {
      console.error('Error loading gallery:', error);
      return [];
    }
  },

  saveGallery: async (gallery: GalleryItem[]) => {
    try {
      await ensureInitialized();
      
      // Clear existing gallery
      await supabase.from(TABLES.GALLERY).delete().neq('id', '');
      
      // Insert new gallery items
      const galleryToInsert = gallery.map(transformGalleryForDB);
      const { error } = await supabase
        .from(TABLES.GALLERY)
        .insert(galleryToInsert);

      if (error) {
        console.error('Error saving gallery to Supabase:', error);
        return false;
      }

      storageEvents.emit('galleryChanged', gallery);
      return true;
    } catch (error) {
      console.error('Error saving gallery:', error);
      return false;
    }
  }
};

// Transform functions for database compatibility
const transformCourseFromDB = (dbCourse: any): Course => ({
  id: dbCourse.id,
  title: dbCourse.title,
  description: dbCourse.description,
  category: dbCourse.category,
  originalPrice: dbCourse.original_price,
  discountPrice: dbCourse.discount_price,
  discountPercentage: dbCourse.discount_percentage,
  thumbnail: dbCourse.thumbnail,
  createdAt: dbCourse.created_at
});

const transformCourseForDB = (course: Course) => ({
  id: course.id,
  title: course.title,
  description: course.description,
  category: course.category,
  original_price: course.originalPrice,
  discount_price: course.discountPrice,
  discount_percentage: course.discountPercentage,
  thumbnail: course.thumbnail,
  created_at: course.createdAt
});

const transformGalleryFromDB = (dbItem: any): GalleryItem => ({
  id: dbItem.id,
  image: dbItem.image,
  description: dbItem.description,
  createdAt: dbItem.created_at
});

const transformGalleryForDB = (item: GalleryItem) => ({
  id: item.id,
  image: item.image,
  description: item.description,
  created_at: item.createdAt
});

// Set up real-time subscriptions
export const setupRealtimeSubscriptions = () => {
  // Courses subscription
  supabase
    .channel('courses-changes')
    .on('postgres_changes', 
      { event: '*', schema: 'public', table: TABLES.COURSES },
      async () => {
        const courses = await storageUtils.getCourses();
        storageEvents.emit('coursesChanged', courses);
      }
    )
    .subscribe();

  // Promo subscription
  supabase
    .channel('promo-changes')
    .on('postgres_changes',
      { event: '*', schema: 'public', table: TABLES.PROMO },
      async () => {
        const promo = await storageUtils.getPromo();
        storageEvents.emit('promoChanged', promo);
      }
    )
    .subscribe();

  // Gallery subscription
  supabase
    .channel('gallery-changes')
    .on('postgres_changes',
      { event: '*', schema: 'public', table: TABLES.GALLERY },
      async () => {
        const gallery = await storageUtils.getGallery();
        storageEvents.emit('galleryChanged', gallery);
      }
    )
    .subscribe();

  // Add immediate local event broadcasting for faster UI updates
  const originalSaveCourses = storageUtils.saveCourses;
  const originalSavePromo = storageUtils.savePromo;
  const originalSaveGallery = storageUtils.saveGallery;

  storageUtils.saveCourses = async (courses: Course[]) => {
    // Immediately update UI
    storageEvents.emit('coursesChanged', courses);
    // Then save to database
    return await originalSaveCourses(courses);
  };

  storageUtils.savePromo = async (promo: PromoConfig) => {
    // Immediately update UI
    storageEvents.emit('promoChanged', promo);
    // Then save to database
    return await originalSavePromo(promo);
  };

  storageUtils.saveGallery = async (gallery: GalleryItem[]) => {
    // Immediately update UI
    storageEvents.emit('galleryChanged', gallery);
    // Then save to database
    return await originalSaveGallery(gallery);
  };
};

function getDefaultCourses(): Course[] {
  return [
    {
      id: '1',
      title: 'Complete Forex Trading Mastery',
      description: 'Learn advanced forex strategies, technical analysis, and risk management from industry experts.',
      category: 'Forex Courses',
      originalPrice: 15999,
      discountPrice: 7999,
      discountPercentage: 50,
      thumbnail: 'https://images.pexels.com/photos/6801648/pexels-photo-6801648.jpeg?auto=compress&cs=tinysrgb&w=800',
      createdAt: new Date().toISOString()
    },
    {
      id: '2',
      title: 'Options Trading Strategies',
      description: 'Master options trading with proven strategies, Greeks analysis, and professional trading techniques.',
      category: 'Option Trading',
      originalPrice: 12999,
      discountPrice: 6499,
      discountPercentage: 50,
      thumbnail: 'https://images.pexels.com/photos/7567443/pexels-photo-7567443.jpeg?auto=compress&cs=tinysrgb&w=800',
      createdAt: new Date().toISOString()
    },
    {
      id: '3',
      title: 'Swing Trading Mastery',
      description: 'Complete guide to swing trading including position sizing, timing, and risk management strategies.',
      category: 'Swing Trading',
      originalPrice: 9999,
      discountPrice: 4999,
      discountPercentage: 50,
      thumbnail: 'https://images.pexels.com/photos/265087/pexels-photo-265087.jpeg?auto=compress&cs=tinysrgb&w=800',
      createdAt: new Date().toISOString()
    },
    {
      id: '4',
      title: 'Technical Analysis Pro',
      description: 'Advanced technical analysis course covering chart patterns, indicators, and market psychology.',
      category: 'Technical Trader',
      originalPrice: 11999,
      discountPrice: 5999,
      discountPercentage: 50,
      thumbnail: 'https://images.pexels.com/photos/8369648/pexels-photo-8369648.jpeg?auto=compress&cs=tinysrgb&w=800',
      createdAt: new Date().toISOString()
    },
    {
      id: '5',
      title: 'Pure Price Action Trading',
      description: 'Learn to trade using pure price action without indicators. Master support, resistance, and patterns.',
      category: 'Price Action',
      originalPrice: 13999,
      discountPrice: 6999,
      discountPercentage: 50,
      thumbnail: 'https://images.pexels.com/photos/6802049/pexels-photo-6802049.jpeg?auto=compress&cs=tinysrgb&w=800',
      createdAt: new Date().toISOString()
    },
    {
      id: '6',
      title: 'Trading Fundamentals for Beginners',
      description: 'Start your trading journey with comprehensive basics, market understanding, and risk management.',
      category: 'For Beginners',
      originalPrice: 7999,
      discountPrice: 3999,
      discountPercentage: 50,
      thumbnail: 'https://images.pexels.com/photos/267389/pexels-photo-267389.jpeg?auto=compress&cs=tinysrgb&w=800',
      createdAt: new Date().toISOString()
    },
    {
      id: '7',
      title: 'Market Fundamentals & Analysis',
      description: 'Deep dive into fundamental analysis, economic indicators, and market-moving events.',
      category: 'Fundamentals',
      originalPrice: 10999,
      discountPrice: 5499,
      discountPercentage: 50,
      thumbnail: 'https://images.pexels.com/photos/6801648/pexels-photo-6801648.jpeg?auto=compress&cs=tinysrgb&w=800',
      createdAt: new Date().toISOString()
    },
    {
      id: '8',
      title: 'Smart Money Concepts & ICT',
      description: 'Learn institutional trading concepts, order blocks, and Inner Circle Trader methodology.',
      category: 'SMC & ICT',
      originalPrice: 16999,
      discountPrice: 8499,
      discountPercentage: 50,
      thumbnail: 'https://images.pexels.com/photos/7567443/pexels-photo-7567443.jpeg?auto=compress&cs=tinysrgb&w=800',
      createdAt: new Date().toISOString()
    }
  ];
}
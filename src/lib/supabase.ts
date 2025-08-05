import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || import.meta.env.VITE_NEXT_PUBLIC_SUPABASE_URL || import.meta.env.VITE_SUPABASE_URL_FALLBACK;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || import.meta.env.VITE_NEXT_PUBLIC_SUPABASE_ANON_KEY || import.meta.env.VITE_SUPABASE_ANON_KEY_FALLBACK;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Database table names
export const TABLES = {
  COURSES: 'courses',
  PROMO: 'promo_config',
  GALLERY: 'gallery_items'
} as const;

// Initialize database tables if they don't exist
export const initializeDatabase = async () => {
  try {
    // Check if tables exist by trying to select from them
    const { error: coursesError } = await supabase
      .from(TABLES.COURSES)
      .select('id')
      .limit(1);

    const { error: promoError } = await supabase
      .from(TABLES.PROMO)
      .select('id')
      .limit(1);

    const { error: galleryError } = await supabase
      .from(TABLES.GALLERY)
      .select('id')
      .limit(1);

    // If tables don't exist, we'll handle it gracefully
    if (coursesError || promoError || galleryError) {
      console.log('Database tables may need to be created. Please run the SQL setup.');
    }

    return true;
  } catch (error) {
    console.error('Database initialization error:', error);
    return false;
  }
};
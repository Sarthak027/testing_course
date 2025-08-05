-- Jesse Course World Database Setup
-- Run this SQL in your Supabase SQL Editor

-- Create courses table
CREATE TABLE IF NOT EXISTS courses (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  category TEXT NOT NULL,
  original_price INTEGER NOT NULL,
  discount_price INTEGER NOT NULL,
  discount_percentage INTEGER NOT NULL,
  thumbnail TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create promo_config table
CREATE TABLE IF NOT EXISTS promo_config (
  id INTEGER PRIMARY KEY DEFAULT 1,
  text TEXT NOT NULL,
  is_active BOOLEAN NOT NULL DEFAULT true,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create gallery_items table
CREATE TABLE IF NOT EXISTS gallery_items (
  id TEXT PRIMARY KEY,
  image TEXT NOT NULL,
  description TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security (RLS)
ALTER TABLE courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE promo_config ENABLE ROW LEVEL SECURITY;
ALTER TABLE gallery_items ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access
CREATE POLICY "Allow public read access on courses" ON courses
  FOR SELECT USING (true);

CREATE POLICY "Allow public read access on promo_config" ON promo_config
  FOR SELECT USING (true);

CREATE POLICY "Allow public read access on gallery_items" ON gallery_items
  FOR SELECT USING (true);

-- Create policies for admin write access (you can modify this based on your auth setup)
CREATE POLICY "Allow all operations on courses" ON courses
  FOR ALL USING (true);

CREATE POLICY "Allow all operations on promo_config" ON promo_config
  FOR ALL USING (true);

CREATE POLICY "Allow all operations on gallery_items" ON gallery_items
  FOR ALL USING (true);

-- Insert default promo config
INSERT INTO promo_config (id, text, is_active) 
VALUES (1, '53% OFF. Use code: SAVE53', true)
ON CONFLICT (id) DO NOTHING;

-- Insert default courses
INSERT INTO courses (id, title, description, category, original_price, discount_price, discount_percentage, thumbnail) VALUES
('1', 'Complete Forex Trading Mastery', 'Learn advanced forex strategies, technical analysis, and risk management from industry experts.', 'Forex Courses', 15999, 7999, 50, 'https://images.pexels.com/photos/6801648/pexels-photo-6801648.jpeg?auto=compress&cs=tinysrgb&w=800'),
('2', 'Options Trading Strategies', 'Master options trading with proven strategies, Greeks analysis, and professional trading techniques.', 'Option Trading', 12999, 6499, 50, 'https://images.pexels.com/photos/7567443/pexels-photo-7567443.jpeg?auto=compress&cs=tinysrgb&w=800'),
('3', 'Swing Trading Mastery', 'Complete guide to swing trading including position sizing, timing, and risk management strategies.', 'Swing Trading', 9999, 4999, 50, 'https://images.pexels.com/photos/265087/pexels-photo-265087.jpeg?auto=compress&cs=tinysrgb&w=800'),
('4', 'Technical Analysis Pro', 'Advanced technical analysis course covering chart patterns, indicators, and market psychology.', 'Technical Trader', 11999, 5999, 50, 'https://images.pexels.com/photos/8369648/pexels-photo-8369648.jpeg?auto=compress&cs=tinysrgb&w=800'),
('5', 'Pure Price Action Trading', 'Learn to trade using pure price action without indicators. Master support, resistance, and patterns.', 'Price Action', 13999, 6999, 50, 'https://images.pexels.com/photos/6802049/pexels-photo-6802049.jpeg?auto=compress&cs=tinysrgb&w=800'),
('6', 'Trading Fundamentals for Beginners', 'Start your trading journey with comprehensive basics, market understanding, and risk management.', 'For Beginners', 7999, 3999, 50, 'https://images.pexels.com/photos/267389/pexels-photo-267389.jpeg?auto=compress&cs=tinysrgb&w=800'),
('7', 'Market Fundamentals & Analysis', 'Deep dive into fundamental analysis, economic indicators, and market-moving events.', 'Fundamentals', 10999, 5499, 50, 'https://images.pexels.com/photos/6801648/pexels-photo-6801648.jpeg?auto=compress&cs=tinysrgb&w=800'),
('8', 'Smart Money Concepts & ICT', 'Learn institutional trading concepts, order blocks, and Inner Circle Trader methodology.', 'SMC & ICT', 16999, 8499, 50, 'https://images.pexels.com/photos/7567443/pexels-photo-7567443.jpeg?auto=compress&cs=tinysrgb&w=800')
ON CONFLICT (id) DO NOTHING;
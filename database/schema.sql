-- Taverna Zeus CMS Database Schema
-- This file contains the complete SQL schema for the restaurant CMS system

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

-- ============================================
-- ENUMS
-- ============================================

-- User roles
CREATE TYPE user_role AS ENUM ('admin', 'editor', 'viewer');

-- ============================================
-- TABLES
-- ============================================

-- Languages table
CREATE TABLE IF NOT EXISTS languages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  code VARCHAR(10) NOT NULL UNIQUE,
  name VARCHAR(50) NOT NULL,
  is_active BOOLEAN DEFAULT true,
  is_default BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Restaurant Settings table
CREATE TABLE IF NOT EXISTS restaurant_settings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  description TEXT,
  short_description VARCHAR(500),
  address VARCHAR(255),
  city VARCHAR(100),
  postal_code VARCHAR(20),
  country VARCHAR(100),
  phone VARCHAR(50),
  email VARCHAR(255),
  website VARCHAR(255),
  opening_hours JSONB DEFAULT '[]',
  hero_image_url TEXT,
  logo_url TEXT,
  google_maps_url TEXT,
  google_maps_iframe TEXT,
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Menu Categories table
CREATE TABLE IF NOT EXISTS menu_categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  description TEXT,
  display_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  image_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Allergens table
CREATE TABLE IF NOT EXISTS allergens (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  code VARCHAR(10) NOT NULL UNIQUE,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  icon TEXT,
  display_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Additives table
CREATE TABLE IF NOT EXISTS additives (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  code VARCHAR(10) NOT NULL UNIQUE,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  display_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Menu Items table
CREATE TABLE IF NOT EXISTS menu_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  category_id UUID REFERENCES menu_categories(id) ON DELETE CASCADE,
  number VARCHAR(20),
  name VARCHAR(255) NOT NULL,
  description TEXT,
  price DECIMAL(10, 2),
  price_note VARCHAR(100),
  image_url TEXT,
  is_vegetarian BOOLEAN DEFAULT false,
  is_vegan BOOLEAN DEFAULT false,
  is_gluten_free BOOLEAN DEFAULT false,
  is_spicy BOOLEAN DEFAULT false,
  is_new BOOLEAN DEFAULT false,
  is_recommended BOOLEAN DEFAULT false,
  display_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  allergen_ids UUID[] DEFAULT '{}',
  additive_ids UUID[] DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Pages table for additional CMS pages
CREATE TABLE IF NOT EXISTS pages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  slug VARCHAR(255) NOT NULL UNIQUE,
  title VARCHAR(255) NOT NULL,
  content TEXT,
  is_active BOOLEAN DEFAULT true,
  show_in_navigation BOOLEAN DEFAULT false,
  navigation_order INTEGER DEFAULT 0,
  meta_title VARCHAR(255),
  meta_description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Translations table for multilingual support
CREATE TABLE IF NOT EXISTS translations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  language_id UUID REFERENCES languages(id) ON DELETE CASCADE,
  table_name VARCHAR(100) NOT NULL,
  record_id UUID NOT NULL,
  field_name VARCHAR(100) NOT NULL,
  value TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(language_id, table_name, record_id, field_name)
);

-- Image uploads tracking table
CREATE TABLE IF NOT EXISTS image_uploads (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  path VARCHAR(500) NOT NULL UNIQUE,
  url TEXT NOT NULL,
  thumbnail_url TEXT,
  size INTEGER,
  mime_type VARCHAR(100),
  width INTEGER,
  height INTEGER,
  used_in TEXT[],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Users table for CMS authentication
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email VARCHAR(255) NOT NULL UNIQUE,
  name VARCHAR(255),
  role user_role DEFAULT 'viewer',
  is_active BOOLEAN DEFAULT true,
  last_login TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- INDEXES
-- ============================================

-- Restaurant settings index
CREATE INDEX IF NOT EXISTS idx_restaurant_settings_name ON restaurant_settings(name);

-- Menu categories indexes
CREATE INDEX IF NOT EXISTS idx_menu_categories_name ON menu_categories(name);
CREATE INDEX IF NOT EXISTS idx_menu_categories_display_order ON menu_categories(display_order);
CREATE INDEX IF NOT EXISTS idx_menu_categories_active ON menu_categories(is_active);

-- Menu items indexes
CREATE INDEX IF NOT EXISTS idx_menu_items_name ON menu_items(name);
CREATE INDEX IF NOT EXISTS idx_menu_items_category ON menu_items(category_id);
CREATE INDEX IF NOT EXISTS idx_menu_items_display_order ON menu_items(display_order);
CREATE INDEX IF NOT EXISTS idx_menu_items_active ON menu_items(is_active);
CREATE INDEX IF NOT EXISTS idx_menu_items_vegetarian ON menu_items(is_vegetarian);
CREATE INDEX IF NOT EXISTS idx_menu_items_vegan ON menu_items(is_vegan);
CREATE INDEX IF NOT EXISTS idx_menu_items_gluten_free ON menu_items(is_gluten_free);
CREATE INDEX IF NOT EXISTS idx_menu_items_new ON menu_items(is_new);
CREATE INDEX IF NOT EXISTS idx_menu_items_recommended ON menu_items(is_recommended);
CREATE INDEX IF NOT EXISTS idx_menu_items_price ON menu_items(price);
CREATE INDEX IF NOT EXISTS idx_menu_items_gin ON menu_items USING gin(name gin_trgm_ops);

-- Allergens indexes
CREATE INDEX IF NOT EXISTS idx_allergens_code ON allergens(code);
CREATE INDEX IF NOT EXISTS idx_allergens_name ON allergens(name);
CREATE INDEX IF NOT EXISTS idx_allergens_display_order ON allergens(display_order);

-- Additives indexes
CREATE INDEX IF NOT EXISTS idx_additives_code ON additives(code);
CREATE INDEX IF NOT EXISTS idx_additives_name ON additives(name);

-- Pages indexes
CREATE INDEX IF NOT EXISTS idx_pages_slug ON pages(slug);
CREATE INDEX IF NOT EXISTS idx_pages_active ON pages(is_active);
CREATE INDEX IF NOT EXISTS idx_pages_navigation ON pages(show_in_navigation);

-- Translations indexes
CREATE INDEX IF NOT EXISTS idx_translations_language ON translations(language_id);
CREATE INDEX IF NOT EXISTS idx_translations_table ON translations(table_name);
CREATE INDEX IF NOT EXISTS idx_translations_record ON translations(record_id);

-- Image uploads indexes
CREATE INDEX IF NOT EXISTS idx_image_uploads_path ON image_uploads(path);
CREATE INDEX IF NOT EXISTS idx_image_uploads_created ON image_uploads(created_at);

-- Users indexes
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
CREATE INDEX IF NOT EXISTS idx_users_active ON users(is_active);

-- ============================================
-- TRIGGERS
-- ============================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply trigger to all tables with updated_at column
CREATE TRIGGER update_restaurant_settings_updated_at
  BEFORE UPDATE ON restaurant_settings
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_menu_categories_updated_at
  BEFORE UPDATE ON menu_categories
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_allergens_updated_at
  BEFORE UPDATE ON allergens
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_additives_updated_at
  BEFORE UPDATE ON additives
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_menu_items_updated_at
  BEFORE UPDATE ON menu_items
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_pages_updated_at
  BEFORE UPDATE ON pages
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_translations_updated_at
  BEFORE UPDATE ON translations
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_users_updated_at
  BEFORE UPDATE ON users
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================

-- Enable RLS on all tables
ALTER TABLE restaurant_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE menu_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE menu_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE allergens ENABLE ROW LEVEL SECURITY;
ALTER TABLE additives ENABLE ROW LEVEL SECURITY;
ALTER TABLE pages ENABLE ROW LEVEL SECURITY;
ALTER TABLE translations ENABLE ROW LEVEL SECURITY;
ALTER TABLE image_uploads ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Policies for authenticated users (read access)
CREATE POLICY "Allow read access to restaurant settings for authenticated users"
  ON restaurant_settings
  FOR SELECT
  USING (true);

CREATE POLICY "Allow read access to menu categories for authenticated users"
  ON menu_categories
  FOR SELECT
  USING (true);

CREATE POLICY "Allow read access to menu items for authenticated users"
  ON menu_items
  FOR SELECT
  USING (true);

CREATE POLICY "Allow read access to allergens for authenticated users"
  ON allergens
  FOR SELECT
  USING (true);

CREATE POLICY "Allow read access to additives for authenticated users"
  ON additives
  FOR SELECT
  USING (true);

CREATE POLICY "Allow read access to pages for authenticated users"
  ON pages
  FOR SELECT
  USING (true);

CREATE POLICY "Allow read access to translations for authenticated users"
  ON translations
  FOR SELECT
  USING (true);

CREATE POLICY "Allow read access to image uploads for authenticated users"
  ON image_uploads
  FOR SELECT
  USING (true);

-- Policies for admin users (full access)
CREATE POLICY "Allow full access to restaurant settings for admins"
  ON restaurant_settings
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE email = auth.jwt()->>'email' 
      AND role = 'admin'
    )
  );

CREATE POLICY "Allow full access to menu categories for admins"
  ON menu_categories
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE email = auth.jwt()->>'email' 
      AND role IN ('admin', 'editor')
    )
  );

CREATE POLICY "Allow full access to menu items for admins"
  ON menu_items
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE email = auth.jwt()->>'email' 
      AND role IN ('admin', 'editor')
    )
  );

CREATE POLICY "Allow full access to allergens for admins"
  ON allergens
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE email = auth.jwt()->>'email' 
      AND role IN ('admin', 'editor')
    )
  );

CREATE POLICY "Allow full access to additives for admins"
  ON additives
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE email = auth.jwt()->>'email' 
      AND role IN ('admin', 'editor')
    )
  );

CREATE POLICY "Allow full access to pages for admins"
  ON pages
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE email = auth.jwt()->>'email' 
      AND role IN ('admin', 'editor')
    )
  );

CREATE POLICY "Allow full access to translations for admins"
  ON translations
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE email = auth.jwt()->>'email' 
      AND role IN ('admin', 'editor')
    )
  );

CREATE POLICY "Allow full access to image uploads for admins"
  ON image_uploads
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE email = auth.jwt()->>'email' 
      AND role IN ('admin', 'editor')
    )
  );

CREATE POLICY "Allow full access to users for admins"
  ON users
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE email = auth.jwt()->>'email' 
      AND role = 'admin'
    )
  );

-- Public read access for restaurant settings (for public website)
CREATE POLICY "Allow public read access to restaurant settings"
  ON restaurant_settings
  FOR SELECT
  USING (true);

-- Public read access for menu categories and items
CREATE POLICY "Allow public read access to menu categories"
  ON menu_categories
  FOR SELECT
  USING (is_active = true);

CREATE POLICY "Allow public read access to menu items"
  ON menu_items
  FOR SELECT
  USING (is_active = true);

-- Public read access for allergens and additives
CREATE POLICY "Allow public read access to allergens"
  ON allergens
  FOR SELECT
  USING (is_active = true);

CREATE POLICY "Allow public read access to additives"
  ON additives
  FOR SELECT
  USING (is_active = true);

-- Public read access for pages
CREATE POLICY "Allow public read access to pages"
  ON pages
  FOR SELECT
  USING (is_active = true);

-- ============================================
-- STORAGE BUCKETS
-- ============================================

-- Note: Storage buckets are created through the Supabase dashboard or API
-- You'll need to create these buckets manually:
-- 1. restaurant-images - for all restaurant images (hero, menu items, etc.)
-- 2. documents - for PDFs and other documents
-- 3. backups - for database backups

-- ============================================
-- COMMENTS
-- ============================================

COMMENT ON TABLE restaurant_settings IS 'Restaurant metadata and configuration settings';
COMMENT ON TABLE menu_categories IS 'Menu item categories with display order';
COMMENT ON TABLE menu_items IS 'Individual menu items with all attributes';
COMMENT ON TABLE allergens IS 'Allergen definitions with codes (A-N for EU allergens)';
COMMENT ON TABLE additives IS 'Additive definitions with codes';
COMMENT ON TABLE pages IS 'Additional CMS pages';
COMMENT ON TABLE translations IS 'Content translations for multilingual support';
COMMENT ON TABLE image_uploads IS 'Tracking table for uploaded images';
COMMENT ON TABLE users IS 'CMS user accounts with roles';
COMMENT ON TABLE languages IS 'Supported languages for the CMS';

COMMENT ON COLUMN menu_items.allergen_ids IS 'Array of allergen UUIDs associated with this menu item';
COMMENT ON COLUMN menu_items.additive_ids IS 'Array of additive UUIDs associated with this menu item';
COMMENT ON COLUMN restaurant_settings.opening_hours IS 'JSON array of opening hours objects with day, open, close, is_open, all_day properties';
COMMENT ON COLUMN pages.content IS 'HTML content for the page';
COMMENT ON COLUMN translations.table_name IS 'Name of the table being translated (e.g., menu_items, menu_categories)';
COMMENT ON COLUMN translations.record_id IS 'UUID of the record being translated';
COMMENT ON COLUMN translations.field_name IS 'Name of the field being translated (e.g., name, description)';
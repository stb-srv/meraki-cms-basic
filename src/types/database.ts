// Database Types for Taverna Zeus CMS

export interface RestaurantSettings {
  id: string;
  name: string;
  description: string;
  short_description: string;
  address: string;
  city: string;
  postal_code: string;
  country: string;
  phone: string;
  email: string;
  website: string;
  opening_hours: OpeningHours[];
  hero_image_url: string | null;
  logo_url: string | null;
  google_maps_url: string | null;
  google_maps_iframe: string | null;
  latitude: number | null;
  longitude: number | null;
  created_at: string;
  updated_at: string;
}

export interface OpeningHours {
  day: string; // e.g., "Montag", "Dienstag", etc.
  open: string | null; // e.g., "12:00"
  close: string | null; // e.g., "22:00"
  is_open: boolean;
  all_day: boolean;
}

export interface MenuCategory {
  id: string;
  name: string;
  description: string | null;
  display_order: number;
  is_active: boolean;
  image_url: string | null;
  created_at: string;
  updated_at: string;
}

export interface MenuItem {
  id: string;
  category_id: string;
  number: string; // e.g., "1", "2a", "3"
  name: string;
  description: string | null;
  price: number | null;
  price_note: string | null; // e.g., "ab 12,50 €"
  image_url: string | null;
  is_vegetarian: boolean;
  is_vegan: boolean;
  is_gluten_free: boolean;
  is_spicy: boolean;
  is_new: boolean;
  is_recommended: boolean;
  display_order: number;
  is_active: boolean;
  allergen_ids: string[];
  additive_ids: string[];
  created_at: string;
  updated_at: string;
}

export interface Allergen {
  id: string;
  code: string; // e.g., "A", "B", "C"
  name: string;
  description: string | null;
  icon: string | null;
  display_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Additive {
  id: string;
  code: string; // e.g., "1", "2", "3"
  name: string;
  description: string | null;
  display_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Page {
  id: string;
  slug: string;
  title: string;
  content: string;
  is_active: boolean;
  show_in_navigation: boolean;
  navigation_order: number;
  meta_title: string | null;
  meta_description: string | null;
  created_at: string;
  updated_at: string;
}

export interface Language {
  id: string;
  code: string; // e.g., "de", "en"
  name: string; // e.g., "Deutsch", "English"
  is_active: boolean;
  is_default: boolean;
  created_at: string;
  updated_at: string;
}

export interface Translation {
  id: string;
  language_id: string;
  table_name: string; // e.g., "menu_items", "menu_categories"
  record_id: string;
  field_name: string; // e.g., "name", "description"
  value: string;
  created_at: string;
  updated_at: string;
}

export interface User {
  id: string;
  email: string;
  name: string | null;
  role: 'admin' | 'editor' | 'viewer';
  is_active: boolean;
  last_login: string | null;
  created_at: string;
  updated_at: string;
}

export interface ImageUpload {
  id: string;
  name: string;
  path: string;
  url: string;
  thumbnail_url: string | null;
  size: number;
  mime_type: string;
  width: number | null;
  height: number | null;
  used_in: string[]; // e.g., ["menu_item_123", "hero_image"]
  created_at: string;
}

// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  per_page: number;
  total_pages: number;
}

// Form Types
export interface MenuItemFormData {
  category_id: string;
  number: string;
  name: string;
  description: string | null;
  price: number | null;
  price_note: string | null;
  image_url: string | null;
  is_vegetarian: boolean;
  is_vegan: boolean;
  is_gluten_free: boolean;
  is_spicy: boolean;
  is_new: boolean;
  is_recommended: boolean;
  display_order: number;
  is_active: boolean;
  allergen_ids: string[];
  additive_ids: string[];
}

export interface MenuCategoryFormData {
  name: string;
  description: string | null;
  display_order: number;
  is_active: boolean;
  image_url: string | null;
}

export interface RestaurantSettingsFormData {
  name: string;
  description: string;
  short_description: string;
  address: string;
  city: string;
  postal_code: string;
  country: string;
  phone: string;
  email: string;
  website: string;
  opening_hours: OpeningHours[];
  hero_image_url: string | null;
  logo_url: string | null;
  google_maps_url: string | null;
  google_maps_iframe: string | null;
  latitude: number | null;
  longitude: number | null;
}

// Menu Export/Import Types
export interface MenuExportData {
  version: string;
  exported_at: string;
  restaurant_settings: RestaurantSettings;
  menu_categories: MenuCategory[];
  menu_items: MenuItem[];
  allergens: Allergen[];
  additives: Additive[];
  images: ImageUpload[];
}

export interface MenuImportData {
  version?: string;
  restaurant_settings?: Partial<RestaurantSettings>;
  menu_categories?: MenuCategory[];
  menu_items?: MenuItem[];
  allergens?: Allergen[];
  additives?: Additive[];
}
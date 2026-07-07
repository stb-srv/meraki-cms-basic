// Simplified Supabase types for Taverna Zeus CMS
// Note: For full type safety, run: npm run db:generate

import { 
  RestaurantSettings, 
  MenuCategory, 
  MenuItem, 
  Allergen, 
  Additive,
  Page,
  Language,
  Translation,
  ImageUpload,
  User
} from './database';

// Define table names type
export type Tables = {
  restaurant_settings: RestaurantSettings;
  menu_categories: MenuCategory;
  menu_items: MenuItem;
  allergens: Allergen;
  additives: Additive;
  pages: Page;
  languages: Language;
  translations: Translation;
  image_uploads: ImageUpload;
  users: User;
};

// Simplified Supabase client type extension
declare module '@supabase/supabase-js' {
  interface SupabaseClient {
    from(table: 'restaurant_settings'): any;
    from(table: 'menu_categories'): any;
    from(table: 'menu_items'): any;
    from(table: 'allergens'): any;
    from(table: 'additives'): any;
    from(table: 'pages'): any;
    from(table: 'languages'): any;
    from(table: 'translations'): any;
    from(table: 'image_uploads'): any;
    from(table: 'users'): any;
  }
}

export type { 
  RestaurantSettings, 
  MenuCategory, 
  MenuItem, 
  Allergen, 
  Additive,
  Page,
  Language,
  Translation,
  ImageUpload,
  User 
};

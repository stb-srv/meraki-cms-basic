import { createClient } from '@supabase/supabase-js';
import { validateEnvironment, getSupabaseConfigError } from '@/lib/config/environment';

// Validate environment variables and log configuration status
const validation = validateEnvironment();
if (!validation.isValid) {
  console.error(getSupabaseConfigError());
  validation.errors.forEach(error => console.error(`Supabase Config Error: ${error}`));
}
if (validation.warnings.length > 0) {
  validation.warnings.forEach(warning => console.warn(`Supabase Config Warning: ${warning}`));
}

// Get environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Mock client for development when env vars are not set
const createMockClient = () => {
  // Mock data for development
  const mockSettings = {
    id: 1,
    restaurant_name: 'Taverna Zeus',
    address: 'Musterstraße 123, 10115 Berlin',
    phone: '+49 30 1234567',
    email: 'info@taverna-zeus.de',
    opening_hours: JSON.stringify([
      { day: 'Montag', hours: '12:00-22:00', closed: false },
      { day: 'Dienstag', hours: '12:00-22:00', closed: false },
      { day: 'Mittwoch', hours: '12:00-22:00', closed: false },
      { day: 'Donnerstag', hours: '12:00-22:00', closed: false },
      { day: 'Freitag', hours: '12:00-23:00', closed: false },
      { day: 'Samstag', hours: '12:00-23:00', closed: false },
      { day: 'Sonntag', hours: '12:00-21:00', closed: false }
    ]),
    google_maps_url: 'https://maps.google.com/?q=Taverna+Zeus',
    hero_title: 'Willkommen in der Taverna Zeus',
    hero_subtitle: 'Authentische griechische Küche in Berlin',
    hero_description: 'Genießen Sie traditionelle griechische Spezialitäten in gemütlicher Atmosphäre.',
    hero_image_url: '/images/hero.jpg',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  };

  const mockCategories = [
    { id: 1, name: 'Vorspeisen', description: 'Kalte und warme Vorspeisen', order: 1, is_active: true },
    { id: 2, name: 'Hauptgerichte', description: 'Fleisch- und Fischgerichte', order: 2, is_active: true },
    { id: 3, name: 'Desserts', description: 'Süße Versüßungen', order: 3, is_active: true },
    { id: 4, name: 'Getränke', description: 'Alkoholische und alkoholfreie Getränke', order: 4, is_active: true }
  ];

  const mockMenuItems = [
    {
      id: 1,
      category_id: 1,
      number: 'V1',
      name: 'Tzatziki',
      description: 'Traditioneller griechischer Joghurt-Dip mit Gurke und Knoblauch',
      price: 4.90,
      image_url: null,
      allergen_ids: [1, 3],
      additive_ids: [],
      is_vegetarian: true,
      is_vegan: true,
      is_available: true,
      order: 1
    },
    {
      id: 2,
      category_id: 2,
      number: 'H1',
      name: 'Moussaka',
      description: 'Griechischer Auflauf mit Auberginen, Hackfleisch und Béchamelsauce',
      price: 14.90,
      image_url: null,
      allergen_ids: [1, 3, 7],
      additive_ids: [],
      is_vegetarian: false,
      is_vegan: false,
      is_available: true,
      order: 1
    }
  ];

  const mockAllergens = [
    { id: 1, code: 'A', name: 'Glutenhaltiges Getreide', description: 'Weizen, Roggen, Gerste, Hafer' },
    { id: 2, code: 'B', name: 'Krebstiere', description: 'Krabben, Hummer, Garnelen' },
    { id: 3, code: 'C', name: 'Eier', description: 'Hühner- und andere Vogeleier' },
    { id: 4, code: 'D', name: 'Fisch', description: 'Alle Fischarten' },
    { id: 5, code: 'E', name: 'Erdnüsse', description: 'Erdnüsse und Erdnussprodukte' },
    { id: 6, code: 'F', name: 'Soja', description: 'Soja und Sojaprodukte' },
    { id: 7, code: 'G', name: 'Milch', description: 'Milch und Milchprodukte (Laktose)' },
    { id: 8, code: 'H', name: 'Schalenfrüchte', description: 'Mandeln, Haselnüsse, Walnüsse etc.' },
    { id: 9, code: 'L', name: 'Sellerie', description: 'Sellerie und Sellerieprodukte' },
    { id: 10, code: 'M', name: 'Senf', description: 'Senf und Senfprodukte' }
  ];

  return {
    from: (tableName: string) => {
      // Mock table queries
      switch (tableName) {
        case 'restaurant_settings':
          return {
            select: () => ({
              single: () => Promise.resolve({ data: mockSettings, error: null }),
              eq: () => ({
                single: () => Promise.resolve({ data: mockSettings, error: null })
              })
            })
          };
        case 'menu_categories':
          return {
            select: () => ({
              order: () => ({
                asc: () => Promise.resolve({ data: mockCategories, error: null })
              }),
              eq: (column: string, value: any) => ({
                single: () => Promise.resolve({ data: mockCategories.find(c => c.id === value), error: null })
              })
            })
          };
        case 'menu_items':
          return {
            select: () => ({
              order: () => ({
                asc: () => Promise.resolve({ data: mockMenuItems, error: null })
              }),
              eq: (column: string, value: any) => ({
                single: () => Promise.resolve({ data: mockMenuItems.find(m => m.id === value), error: null }),
                order: () => ({
                  asc: () => Promise.resolve({ data: mockMenuItems.filter(m => m.category_id === value), error: null })
                })
              })
            })
          };
        case 'allergens':
          return {
            select: () => ({
              order: () => ({
                asc: () => Promise.resolve({ data: mockAllergens, error: null })
              })
            })
          };
        case 'additives':
          return {
            select: () => ({
              order: () => ({
                asc: () => Promise.resolve({ data: [], error: null })
              })
            })
          };
        default:
          return {
            select: () => ({
              eq: () => ({
                single: () => Promise.resolve({ data: null, error: null }),
                order: () => ({
                  single: () => Promise.resolve({ data: null, error: null })
                })
              })
            })
          };
      }
    },
    auth: {
      getSession: () => Promise.resolve({ data: { session: null }, error: null }),
      signInWithPassword: (options: any) => {
        // Mock successful login for demo purposes
        if (options.email === 'admin@taverna-zeus.de' && options.password === 'password') {
          return Promise.resolve({
            data: {
              session: {
                user: {
                  id: 'mock-user-id',
                  email: 'admin@taverna-zeus.de',
                  name: 'Admin User',
                  role: 'admin'
                },
                access_token: 'mock-access-token'
              },
              user: {
                id: 'mock-user-id',
                email: 'admin@taverna-zeus.de',
                name: 'Admin User',
                role: 'admin'
              }
            },
            error: null
          });
        }
        return Promise.resolve({ data: { session: null, user: null }, error: { message: 'Invalid credentials' } });
      },
      signOut: () => Promise.resolve({ error: null }),
      onAuthStateChange: (callback: any) => {
        // Mock auth state change
        callback('INITIAL_SESSION', { session: null });
        return { unsubscribe: () => {} };
      },
      admin: {
        createUser: (options: any) => Promise.resolve({
          data: {
            user: {
              id: `mock-user-${Date.now()}`,
              email: options.email,
              created_at: new Date().toISOString()
            }
          },
          error: null
        }),
        deleteUser: (userId: string) => Promise.resolve({ data: {}, error: null }),
        listUsers: () => Promise.resolve({ data: { users: [] }, error: null }),
        getUserById: (userId: string) => Promise.resolve({
          data: {
            user: {
              id: userId,
              email: `mock-${userId}@example.com`,
              created_at: new Date().toISOString()
            }
          },
          error: null
        })
      }
    },
    storage: {
      from: (bucketName: string) => ({
        list: () => Promise.resolve({ data: [], error: null }),
        upload: (filePath: string, file: any) => Promise.resolve({ data: { path: filePath }, error: null }),
        download: (filePath: string) => Promise.resolve({ data: null, error: null }),
        remove: (filePaths: string[]) => Promise.resolve({ data: [], error: null }),
        getPublicUrl: (filePath: string) => `https://mock-supabase-url.com/storage/v1/object/public/${bucketName}/${filePath}`
      })
    }
  };
};

// Create and export the Supabase client
// Type for the mock client to satisfy TypeScript
interface MockSupabaseClient {
  from: (table: string) => any;
  auth: {
    getSession: () => Promise<any>;
    signInWithPassword: (options: any) => Promise<any>;
    signOut: () => Promise<any>;
    onAuthStateChange: (callback: any) => any;
    admin: {
      createUser: (options: any) => Promise<any>;
      deleteUser: (userId: string) => Promise<any>;
      listUsers: () => Promise<any>;
      getUserById: (userId: string) => Promise<any>;
    };
  };
  storage: {
    from: (bucket: string) => {
      list: (options?: any) => Promise<any>;
      upload: (path: string, file: any, options?: any) => Promise<any>;
      download: (path: string) => Promise<any>;
      remove: (paths: string[]) => Promise<any>;
      getPublicUrl: (path: string) => string;
    };
  };
}

let supabase: any;

if (!supabaseUrl || !supabaseAnonKey) {
  const errorMessage = getSupabaseConfigError();
  if (errorMessage) {
    console.error(errorMessage);
  }
  console.warn('Using mock client for development. CMS functionality will be limited.');
  supabase = createMockClient() as unknown as MockSupabaseClient;
} else {
  supabase = createClient(supabaseUrl, supabaseAnonKey);
}

export { supabase };

// Server-side client with service role key for admin operations
export const createServerClient = () => {
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  
  if (!supabaseUrl || !supabaseAnonKey) {
    const errorMessage = getSupabaseConfigError();
    if (errorMessage) {
      console.error(`[Server Client] ${errorMessage}`);
    }
    console.warn('Using mock client for server operations.');
    return createMockClient();
  }
  
  if (!serviceKey) {
    console.warn('Service role key is missing. Using anon key for server client.');
    return createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    });
  }
  
  return createClient(supabaseUrl, serviceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
};

// Client-side client for browser usage
export const createBrowserClient = () => {
  if (!supabaseUrl || !supabaseAnonKey) {
    const errorMessage = getSupabaseConfigError();
    if (errorMessage) {
      console.error(`[Browser Client] ${errorMessage}`);
    }
    console.warn('Using mock client for browser operations.');
    return createMockClient();
  }
  
  return createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      storage: typeof window !== 'undefined' ? localStorage : undefined,
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: true,
    },
  });
};

export type SupabaseClient = typeof supabase;

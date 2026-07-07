#!/usr/bin/env node

/**
 * Menu Import Script for Taverna Zeus CMS
 * Imports menu data including categories, items, allergens, and additives
 */

const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');
const { v4: uuidv4 } = require('uuid');

// Configuration
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const inputFile = process.argv[2] || path.join(__dirname, '../exports/menu-export-latest.json');

async function importMenuData() {
  try {
    console.log('🔍 Starting menu import...');
    
    // Check if input file exists
    if (!fs.existsSync(inputFile)) {
      throw new Error(`Input file not found: ${inputFile}`);
    }

    // Read and parse the import file
    const importData = JSON.parse(fs.readFileSync(inputFile, 'utf8'));
    console.log(`📁 Importing from: ${inputFile}`);
    console.log(`📊 Data to import:`);
    console.log(`   - Categories: ${importData.categories?.length || 0}`);
    console.log(`   - Menu Items: ${importData.items?.length || 0}`);
    console.log(`   - Allergens: ${importData.allergens?.length || 0}`);
    console.log(`   - Additives: ${importData.additives?.length || 0}`);

    // Create Supabase client with service role key for full access
    const supabase = createClient(supabaseUrl, serviceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    });

    // Helper function to create or update records
    async function upsertRecords(table, records, keyField = 'id') {
      const { data, error } = await supabase
        .from(table)
        .upsert(records.map(record => ({
          ...record,
          // Remove fields that shouldn't be updated
          created_at: undefined,
          updated_at: undefined,
        })), { onConflict: keyField });
      
      if (error) {
        console.error(`❌ Error importing ${table}:`, error);
        throw error;
      }
      return data;
    }

    // Import in order: allergens, additives, categories, items, settings
    console.log('\n🚀 Importing data...');

    // 1. Import allergens
    if (importData.allergens && importData.allergens.length > 0) {
      console.log(`🔄 Importing ${importData.allergens.length} allergens...`);
      await upsertRecords('allergens', importData.allergens, 'code');
      console.log(`✅ Allergens imported`);
    }

    // 2. Import additives
    if (importData.additives && importData.additives.length > 0) {
      console.log(`🔄 Importing ${importData.additives.length} additives...`);
      await upsertRecords('additives', importData.additives, 'code');
      console.log(`✅ Additives imported`);
    }

    // 3. Import categories
    if (importData.categories && importData.categories.length > 0) {
      console.log(`🔄 Importing ${importData.categories.length} categories...`);
      await upsertRecords('menu_categories', importData.categories, 'name');
      console.log(`✅ Categories imported`);
    }

    // 4. Import menu items
    if (importData.items && importData.items.length > 0) {
      console.log(`🔄 Importing ${importData.items.length} menu items...`);
      
      // First, we need to map category names to IDs
      const { data: existingCategories, error: categoriesError } = await supabase
        .from('menu_categories')
        .select('id, name');
      
      if (categoriesError) {
        console.error('❌ Error fetching categories:', categoriesError);
        throw categoriesError;
      }
      
      const categoryMap = new Map();
      existingCategories.forEach(cat => {
        categoryMap.set(cat.name, cat.id);
      });
      
      // Map allergen and additive codes to IDs
      const { data: existingAllergens, error: allergensError } = await supabase
        .from('allergens')
        .select('id, code');
      
      if (allergensError) {
        console.error('❌ Error fetching allergens:', allergensError);
        throw allergensError;
      }
      
      const allergenMap = new Map();
      existingAllergens.forEach(all => {
        allergenMap.set(all.code, all.id);
      });
      
      const { data: existingAdditives, error: additivesError } = await supabase
        .from('additives')
        .select('id, code');
      
      if (additivesError) {
        console.error('❌ Error fetching additives:', additivesError);
        throw additivesError;
      }
      
      const additiveMap = new Map();
      existingAdditives.forEach(add => {
        additiveMap.set(add.code, add.id);
      });
      
      // Process items and map category names to IDs
      const itemsToImport = importData.items.map(item => {
        const categoryId = categoryMap.get(item.category_name) || item.category_id;
        
        // Map allergen codes to IDs
        let allergenIds = [];
        if (item.allergen_codes && Array.isArray(item.allergen_codes)) {
          allergenIds = item.allergen_codes
            .map(code => allergenMap.get(code))
            .filter(id => id);
        } else if (item.allergen_ids && Array.isArray(item.allergen_ids)) {
          allergenIds = item.allergen_ids;
        }
        
        // Map additive codes to IDs
        let additiveIds = [];
        if (item.additive_codes && Array.isArray(item.additive_codes)) {
          additiveIds = item.additive_codes
            .map(code => additiveMap.get(code))
            .filter(id => id);
        } else if (item.additive_ids && Array.isArray(item.additive_ids)) {
          additiveIds = item.additive_ids;
        }
        
        return {
          ...item,
          category_id: categoryId,
          allergen_ids: allergenIds,
          additive_ids: additiveIds,
          // Remove temporary fields
          category_name: undefined,
          allergen_codes: undefined,
          additive_codes: undefined,
        };
      });
      
      await upsertRecords('menu_items', itemsToImport, 'name');
      console.log(`✅ Menu items imported`);
    }

    // 5. Import restaurant settings
    if (importData.restaurant?.settings) {
      console.log(`🔄 Importing restaurant settings...`);
      const { error: settingsError } = await supabase
        .from('restaurant_settings')
        .upsert([importData.restaurant.settings], { onConflict: 'id' });
      
      if (settingsError) {
        console.error('❌ Error importing settings:', settingsError);
        throw settingsError;
      }
      console.log(`✅ Restaurant settings imported`);
    }

    console.log('\n🎉 Menu import completed successfully!');
    console.log(`📁 Imported from: ${inputFile}`);
    
    return {
      success: true,
      importedAt: new Date().toISOString(),
      statistics: {
        categories: importData.categories?.length || 0,
        items: importData.items?.length || 0,
        allergens: importData.allergens?.length || 0,
        additives: importData.additives?.length || 0,
      },
    };
  } catch (error) {
    console.error('❌ Error importing menu data:', error);
    process.exit(1);
  }
}

// Run the import
if (supabaseUrl && supabaseKey && serviceKey) {
  importMenuData();
} else {
  console.error('❌ Missing required environment variables:');
  console.error('   NEXT_PUBLIC_SUPABASE_URL');
  console.error('   NEXT_PUBLIC_SUPABASE_ANON_KEY');
  console.error('   SUPABASE_SERVICE_ROLE_KEY');
  console.error('\nPlease set these variables and try again.');
  console.error('\nUsage: node scripts/importMenu.js [path-to-export-file]');
  process.exit(1);
}
#!/usr/bin/env node

/**
 * Menu Export Script for Taverna Zeus CMS
 * Exports menu data including categories, items, allergens, and additives
 */

const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');

// Configuration
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const outputDir = path.join(__dirname, '../exports');
const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
const outputFile = path.join(outputDir, `menu-export-${timestamp}.json`);

// Ensure output directory exists
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

async function exportMenuData() {
  try {
    console.log('🔍 Starting menu export...');
    
    // Create Supabase client with service role key for full access
    const supabase = createClient(supabaseUrl, serviceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    });

    // Fetch all data in parallel
    const [categories, items, allergens, additives, settings] = await Promise.all([
      supabase.from('menu_categories').select('*').order('display_order'),
      supabase.from('menu_items').select('*').order('display_order'),
      supabase.from('allergens').select('*').order('display_order'),
      supabase.from('additives').select('*').order('display_order'),
      supabase.from('restaurant_settings').select('*').single(),
    ]);

    if (categories.error) throw categories.error;
    if (items.error) throw items.error;
    if (allergens.error) throw allergens.error;
    if (additives.error) throw additives.error;
    if (settings.error) throw settings.error;

    // Create export data structure
    const exportData = {
      version: '1.0.0',
      exportedAt: new Date().toISOString(),
      restaurant: {
        name: settings.data.name || 'Taverna Zeus',
        description: settings.data.description || '',
        settings: settings.data,
      },
      categories: categories.data || [],
      items: items.data || [],
      allergens: allergens.data || [],
      additives: additives.data || [],
      statistics: {
        totalCategories: categories.data?.length || 0,
        totalItems: items.data?.length || 0,
        totalAllergens: allergens.data?.length || 0,
        totalAdditives: additives.data?.length || 0,
      },
    };

    // Write to file
    fs.writeFileSync(outputFile, JSON.stringify(exportData, null, 2), 'utf8');
    
    console.log(`✅ Menu export completed successfully!`);
    console.log(`📁 File: ${outputFile}`);
    console.log(`📊 Statistics:`);
    console.log(`   - Categories: ${exportData.statistics.totalCategories}`);
    console.log(`   - Menu Items: ${exportData.statistics.totalItems}`);
    console.log(`   - Allergens: ${exportData.statistics.totalAllergens}`);
    console.log(`   - Additives: ${exportData.statistics.totalAdditives}`);

    return exportData;
  } catch (error) {
    console.error('❌ Error exporting menu data:', error);
    process.exit(1);
  }
}

// Run the export
if (supabaseUrl && supabaseKey && serviceKey) {
  exportMenuData();
} else {
  console.error('❌ Missing required environment variables:');
  console.error('   NEXT_PUBLIC_SUPABASE_URL');
  console.error('   NEXT_PUBLIC_SUPABASE_ANON_KEY');
  console.error('   SUPABASE_SERVICE_ROLE_KEY');
  console.error('\nPlease set these variables and try again.');
  process.exit(1);
}
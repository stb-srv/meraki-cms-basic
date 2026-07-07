-- Taverna Zeus CMS Database Seed Script
-- This script populates the database with initial data including:
-- - Languages (German, English)
-- - Standard EU Allergens (A-N)
-- - Common Additives
-- - Sample Restaurant Settings
-- - Sample Menu Categories
-- - Sample Menu Items
-- - Admin User

-- ============================================
-- LANGUAGES
-- ============================================

-- Insert languages
INSERT INTO languages (id, code, name, is_active, is_default) VALUES
  ('550e8400-e29b-41d4-a716-446655440000', 'de', 'Deutsch', true, true),
  ('550e8400-e29b-41d4-a716-446655440001', 'en', 'English', true, false)
ON CONFLICT (code) DO NOTHING;

-- ============================================
-- ALLERGENS (EU Standard Allergens A-N)
-- ============================================

-- EU Allergens with official codes and names
INSERT INTO allergens (id, code, name, description, display_order, is_active) VALUES
  -- A: Cereals containing gluten
  ('660e8400-e29b-41d4-a716-446655440000', 'A', 'Glutenhaltiges Getreide', 'Weizen, Roggen, Gerste, Hafer, Dinkel, Kamut oder Hybridstämme davon', 1, true),
  
  -- B: Crustaceans
  ('660e8400-e29b-41d4-a716-446655440001', 'B', 'Krebstiere', 'Krebstiere und daraus gewonnene Erzeugnisse', 2, true),
  
  -- C: Eggs
  ('660e8400-e29b-41d4-a716-446655440002', 'C', 'Eier', 'Hühnereier und Erzeugnisse daraus', 3, true),
  
  -- D: Fish
  ('660e8400-e29b-41d4-a716-446655440003', 'D', 'Fisch', 'Fisch und Fischerzeugnisse, außer Fischgelatine, die als Träger für Vitamin- oder Karotinoidzubereitungen verwendet wird', 4, true),
  
  -- E: Peanuts
  ('660e8400-e29b-41d4-a716-446655440004', 'E', 'Erdnüsse', 'Erdnüsse und Erzeugnisse daraus', 5, true),
  
  -- F: Soybeans
  ('660e8400-e29b-41d4-a716-446655440005', 'F', 'Soja', 'Soja und Erzeugnisse daraus', 6, true),
  
  -- G: Milk
  ('660e8400-e29b-41d4-a716-446655440006', 'G', 'Milch', 'Milch und Milcherzeugnisse (einschließlich Laktose)', 7, true),
  
  -- H: Nuts
  ('660e8400-e29b-41d4-a716-446655440007', 'H', 'Schalenfrüchte', 'Mandeln, Haselnüsse, Walnüsse, Kaschunüsse, Pecannüsse, Paranüsse, Pistazien, Macadamianüsse und Queenslandnüsse', 8, true),
  
  -- I: Celery
  ('660e8400-e29b-41d4-a716-446655440008', 'I', 'Sellerie', 'Sellerie und Sellerieerzeugnisse', 9, true),
  
  -- J: Mustard
  ('660e8400-e29b-41d4-a716-446655440009', 'J', 'Senf', 'Senf und Senferzeugnisse', 10, true),
  
  -- K: Sesame seeds
  ('660e8400-e29b-41d4-a716-446655440010', 'K', 'Sesamsamen', 'Sesamsamen und Erzeugnisse daraus', 11, true),
  
  -- L: Sulphur dioxide and sulphites
  ('660e8400-e29b-41d4-a716-446655440011', 'L', 'Schwefeldioxid und Sulfit', 'Schwefeldioxid und Sulfit in Konzentrationen von mehr als 10 mg/kg oder 10 mg/l, angegeben als SO2', 12, true),
  
  -- M: Lupin
  ('660e8400-e29b-41d4-a716-446655440012', 'M', 'Lupinen', 'Lupinen und Erzeugnisse daraus', 13, true),
  
  -- N: Molluscs
  ('660e8400-e29b-41d4-a716-446655440013', 'N', 'Weichtiere', 'Weichtiere und Erzeugnisse daraus', 14, true)
ON CONFLICT (code) DO NOTHING;

-- ============================================
-- ADDITIVES (Common E-numbers)
-- ============================================

INSERT INTO additives (id, code, name, description, display_order, is_active) VALUES
  -- Preservatives
  ('770e8400-e29b-41d4-a716-446655440000', 'E200', 'Sorbinsäure', 'Konservierungsmittel', 1, true),
  ('770e8400-e29b-41d4-a716-446655440001', 'E210', 'Benzoesäure', 'Konservierungsmittel', 2, true),
  ('770e8400-e29b-41d4-a716-446655440002', 'E211', 'Natriumbenzoat', 'Konservierungsmittel', 3, true),
  ('770e8400-e29b-41d4-a716-446655440003', 'E212', 'Kaliumbenzoat', 'Konservierungsmittel', 4, true),
  ('770e8400-e29b-41d4-a716-446655440004', 'E220', 'Schwefeldioxid', 'Konservierungsmittel, Antioxidationsmittel', 5, true),
  ('770e8400-e29b-41d4-a716-446655440005', 'E221', 'Natriumdisulfit', 'Konservierungsmittel, Antioxidationsmittel', 6, true),
  ('770e8400-e29b-41d4-a716-446655440006', 'E222', 'Natriumhydrogensulfit', 'Konservierungsmittel, Antioxidationsmittel', 7, true),
  ('770e8400-e29b-41d4-a716-446655440007', 'E223', 'Natriummetabisulfit', 'Konservierungsmittel, Antioxidationsmittel', 8, true),
  ('770e8400-e29b-41d4-a716-446655440008', 'E224', 'Kaliumdisulfit', 'Konservierungsmittel, Antioxidationsmittel', 9, true),
  
  -- Antioxidants
  ('770e8400-e29b-41d4-a716-446655440009', 'E300', 'Ascorbinsäure', 'Antioxidationsmittel, Vitamin C', 10, true),
  ('770e8400-e29b-41d4-a716-446655440010', 'E301', 'Natriumascorbat', 'Antioxidationsmittel', 11, true),
  ('770e8400-e29b-41d4-a716-446655440011', 'E302', 'Calciumascorbat', 'Antioxidationsmittel', 12, true),
  ('770e8400-e29b-41d4-a716-446655440012', 'E322', 'Lecithin', 'Emulgator', 13, true),
  
  -- Colors
  ('770e8400-e29b-41d4-a716-446655440013', 'E102', 'Tartrazin', 'Farbstoff', 14, true),
  ('770e8400-e29b-41d4-a716-446655440014', 'E122', 'Azorubin', 'Farbstoff', 15, true),
  ('770e8400-e29b-41d4-a716-446655440015', 'E129', 'Allurarot AC', 'Farbstoff', 16, true),
  
  -- Sweeteners
  ('770e8400-e29b-41d4-a716-446655440016', 'E950', 'Acesulfam-K', 'Süßstoff', 17, true),
  ('770e8400-e29b-41d4-a716-446655440017', 'E951', 'Aspartam', 'Süßstoff', 18, true),
  ('770e8400-e29b-41d4-a716-446655440018', 'E952', 'Cyclamat', 'Süßstoff', 19, true),
  ('770e8400-e29b-41d4-a716-446655440019', 'E955', 'Sucralose', 'Süßstoff', 20, true),
  
  -- Emulsifiers and Stabilizers
  ('770e8400-e29b-41d4-a716-446655440020', 'E412', 'Guarkernmehl', 'Verdickungsmittel, Stabilisator', 21, true),
  ('770e8400-e29b-41d4-a716-446655440021', 'E415', 'Xanthan', 'Verdickungsmittel, Stabilisator', 22, true),
  ('770e8400-e29b-41d4-a716-446655440022', 'E420', 'Sorbit', 'Zuckeralkohol, Feuchthaltemittel', 23, true),
  
  -- Flavor Enhancers
  ('770e8400-e29b-41d4-a716-446655440023', 'E621', 'Mononatriumglutamat', 'Geschmacksverstärker', 24, true),
  ('770e8400-e29b-41d4-a716-446655440024', 'E627', 'Dinatriuminosinat', 'Geschmacksverstärker', 25, true),
  ('770e8400-e29b-41d4-a716-446655440025', 'E631', 'Dinatriuminosinat und Dinatriumguanylat', 'Geschmacksverstärker', 26, true)
ON CONFLICT (code) DO NOTHING;

-- ============================================
-- RESTAURANT SETTINGS
-- ============================================

INSERT INTO restaurant_settings (id, name, description, short_description, address, city, postal_code, country, phone, email, website, opening_hours, hero_image_url, logo_url, google_maps_url, google_maps_iframe, latitude, longitude) VALUES (
  '880e8400-e29b-41d4-a716-446655440000',
  'Taverna Zeus',
  'Willkommen in der Taverna Zeus - Authentische griechische Küche in herzlicher Atmosphäre. Genießen Sie traditionelle Gerichte, frische Zutaten und den echten Geschmack Griechenlands.',
  'Authentische griechische Küche seit 1995',
  'Hauptstraße 42',
  'Berlin',
  '10115',
  'Deutschland',
  '+49 30 12345678',
  'info@taverna-zeus.de',
  'https://www.taverna-zeus.de',
  '[{"day": "Montag", "open": "12:00", "close": "22:00", "is_open": true, "all_day": false}, {"day": "Dienstag", "open": "12:00", "close": "22:00", "is_open": true, "all_day": false}, {"day": "Mittwoch", "open": "12:00", "close": "22:00", "is_open": true, "all_day": false}, {"day": "Donnerstag", "open": "12:00", "close": "22:00", "is_open": true, "all_day": false}, {"day": "Freitag", "open": "12:00", "close": "23:00", "is_open": true, "all_day": false}, {"day": "Samstag", "open": "12:00", "close": "23:00", "is_open": true, "all_day": false}, {"day": "Sonntag", "open": "12:00", "close": "22:00", "is_open": true, "all_day": false}]',
  null,
  null,
  'https://www.google.com/maps/place/Taverna+Zeus/@52.520008,13.404954,17z',
  '<iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2624.991625996996!2d13.404954!3d52.520008!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNTLCsDMxJzI0LjAiTiAxM8KwMjQnMTUuMCJX!5e0!3m2!1sen!2sde!4v1234567890" width="600" height="450" style="border:0;" allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>',
  52.520008,
  13.404954
) ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  short_description = EXCLUDED.short_description,
  address = EXCLUDED.address,
  city = EXCLUDED.city,
  postal_code = EXCLUDED.postal_code,
  country = EXCLUDED.country,
  phone = EXCLUDED.phone,
  email = EXCLUDED.email,
  website = EXCLUDED.website,
  opening_hours = EXCLUDED.opening_hours,
  hero_image_url = EXCLUDED.hero_image_url,
  logo_url = EXCLUDED.logo_url,
  google_maps_url = EXCLUDED.google_maps_url,
  google_maps_iframe = EXCLUDED.google_maps_iframe,
  latitude = EXCLUDED.latitude,
  longitude = EXCLUDED.longitude,
  updated_at = NOW();

-- ============================================
-- MENU CATEGORIES
-- ============================================

INSERT INTO menu_categories (id, name, description, display_order, is_active, image_url) VALUES
  ('990e8400-e29b-41d4-a716-446655440000', 'Vorspeisen', 'Kleine Gerichte zum Beginne - Perfekt zum Teilen', 1, true, null),
  ('990e8400-e29b-41d4-a716-446655440001', 'Salate', 'Frische Salate mit griechischen Zutaten', 2, true, null),
  ('990e8400-e29b-41d4-a716-446655440002', 'Suppen', 'Hausgemachte Suppen nach traditionellen Rezepten', 3, true, null),
  ('990e8400-e29b-41d4-a716-446655440003', 'Hauptgerichte', 'Fleisch- und Fischgerichte mit Beilagen', 4, true, null),
  ('990e8400-e29b-41d4-a716-446655440004', 'Vegetarische Gerichte', 'Fleischlose Spezialitäten aus Griechenland', 5, true, null),
  ('990e8400-e29b-41d4-a716-446655440005', 'Grillgerichte', 'Gegrillte Spezialitäten vom Holzkohlegrill', 6, true, null),
  ('990e8400-e29b-41d4-a716-446655440006', 'Desserts', 'Süße Versündigungen zum Abschluss', 7, true, null),
  ('990e8400-e29b-41d4-a716-446655440007', 'Getränke', 'Erfrischungen, Bier, Wein und mehr', 8, true, null)
ON CONFLICT (id) DO NOTHING;

-- ============================================
-- MENU ITEMS
-- ============================================

-- Vorspeisen (Appetizers)
INSERT INTO menu_items (id, category_id, number, name, description, price, price_note, image_url, is_vegetarian, is_vegan, is_gluten_free, is_spicy, is_new, is_recommended, display_order, is_active, allergen_ids, additive_ids) VALUES
  ('100e8400-e29b-41d4-a716-446655440000', '990e8400-e29b-41d4-a716-446655440000', '1', 'Tzatziki', 'Traditioneller griechischer Joghurt-Dip mit Gurke, Knoblauch und Olivenöl. Serviert mit frischem Brot.', 6.50, null, null, false, false, false, false, false, true, 1, true, ARRAY['G']::UUID[], ARRAY[]::UUID[]),
  ('100e8400-e29b-41d4-a716-446655440001', '990e8400-e29b-41d4-a716-446655440000', '2', 'Melitzanosalata', 'Auberginen-Püree mit Knoblauch, Olivenöl und Zitrone.', 6.90, null, null, true, true, true, false, false, false, 2, true, ARRAY[]::UUID[], ARRAY[]::UUID[]),
  ('100e8400-e29b-41d4-a716-446655440002', '990e8400-e29b-41d4-a716-446655440000', '3', 'Dolmades', 'Gefüllte Weinblätter mit Reis, Kräutern und Zitrone.', 7.50, null, null, true, true, true, false, false, false, 3, true, ARRAY[]::UUID[], ARRAY[]::UUID[]),
  ('100e8400-e29b-41d4-a716-446655440003', '990e8400-e29b-41d4-a716-446655440000', '4', 'Feta im Blätterteig', 'Feta-Käse in knusprigem Blätterteig mit Honig und Sesam.', 8.90, null, null, false, false, false, false, false, true, 4, true, ARRAY['A', 'G']::UUID[], ARRAY[]::UUID[]),
  ('100e8400-e29b-41d4-a716-446655440004', '990e8400-e29b-41d4-a716-446655440000', '5', 'Gebratene Calamares', 'Knusprige Tintenfischringe mit Zitronenspalten und Tzatziki.', 12.90, null, null, false, false, false, false, true, true, 5, true, ARRAY['D', 'A']::UUID[], ARRAY[]::UUID[]),
  ('100e8400-e29b-41d4-a716-446655440005', '990e8400-e29b-41d4-a716-446655440000', '6', 'Griechische Oliven', 'Marinierte Oliven mit Kräutern und Zitrone.', 5.90, null, null, true, true, true, false, false, false, 6, true, ARRAY[]::UUID[], ARRAY[]::UUID[])
ON CONFLICT (id) DO NOTHING;

-- Salate (Salads)
INSERT INTO menu_items (id, category_id, number, name, description, price, price_note, image_url, is_vegetarian, is_vegan, is_gluten_free, is_spicy, is_new, is_recommended, display_order, is_active, allergen_ids, additive_ids) VALUES
  ('100e8400-e29b-41d4-a716-446655440006', '990e8400-e29b-41d4-a716-446655440001', '7', 'Griechischer Salat', 'Klassischer Salat mit Tomaten, Gurken, Zwiebeln, Oliven, Feta und Olivenöl.', 9.50, null, null, false, false, true, false, false, true, 1, true, ARRAY['G']::UUID[], ARRAY[]::UUID[]),
  ('100e8400-e29b-41d4-a716-446655440007', '990e8400-e29b-41d4-a716-446655440001', '8', 'Dorf-Salat', 'Gemischter Salat mit Paprika, Tomaten, Gurken, Zwiebeln und Feta.', 8.90, null, null, false, false, true, false, false, false, 2, true, ARRAY['G']::UUID[], ARRAY[]::UUID[]),
  ('100e8400-e29b-41d4-a716-446655440008', '990e8400-e29b-41d4-a716-446655440001', '9', 'Nizoi Salata', 'Junger Blattsalat mit Radieschen, Gurken und Olivenöl-Zitronen-Dressing.', 7.90, null, null, true, true, true, false, false, false, 3, true, ARRAY[]::UUID[], ARRAY[]::UUID[])
ON CONFLICT (id) DO NOTHING;

-- Suppen (Soups)
INSERT INTO menu_items (id, category_id, number, name, description, price, price_note, image_url, is_vegetarian, is_vegan, is_gluten_free, is_spicy, is_new, is_recommended, display_order, is_active, allergen_ids, additive_ids) VALUES
  ('100e8400-e29b-41d4-a716-446655440009', '990e8400-e29b-41d4-a716-446655440002', '10', 'Fasolada', 'Traditionelle weiße Bohnensuppe mit Karotten, Sellerie und Tomaten.', 6.90, null, null, true, true, true, false, false, false, 1, true, ARRAY[]::UUID[], ARRAY[]::UUID[]),
  ('100e8400-e29b-41d4-a716-446655440010', '990e8400-e29b-41d4-a716-446655440002', '11', 'Avgolemono', 'Griechische Hühnersuppe mit Zitrone und Ei.', 7.50, null, null, false, false, true, false, false, true, 2, true, ARRAY['C', 'G']::UUID[], ARRAY[]::UUID[])
ON CONFLICT (id) DO NOTHING;

-- Hauptgerichte (Main Courses)
INSERT INTO menu_items (id, category_id, number, name, description, price, price_note, image_url, is_vegetarian, is_vegan, is_gluten_free, is_spicy, is_new, is_recommended, display_order, is_active, allergen_ids, additive_ids) VALUES
  ('100e8400-e29b-41d4-a716-446655440011', '990e8400-e29b-41d4-a716-446655440003', '12', 'Moussaka', 'Geschichtete Auberginen, Hackfleisch und Béchamelsauce, im Ofen überbacken.', 14.90, null, null, false, false, false, false, false, true, 1, true, ARRAY['A', 'G']::UUID[], ARRAY[]::UUID[]),
  ('100e8400-e29b-41d4-a716-446655440012', '990e8400-e29b-41d4-a716-446655440003', '13', 'Pastitsio', 'Griechische Nudelauflauf mit Hackfleisch und Béchamelsauce.', 15.50, null, null, false, false, false, false, false, true, 2, true, ARRAY['A', 'G']::UUID[], ARRAY[]::UUID[]),
  ('100e8400-e29b-41d4-a716-446655440013', '990e8400-e29b-41d4-a716-446655440003', '14', 'Stifado', 'Griechisches Rindergulasch mit Zwiebeln, Tomaten und Gewürzen.', 16.90, null, null, false, false, true, false, false, false, 3, true, ARRAY['I']::UUID[], ARRAY[]::UUID[]),
  ('100e8400-e29b-41d4-a716-446655440014', '990e8400-e29b-41d4-a716-446655440003', '15', 'Soutzoukakia', 'Griechische Frikadellen in Tomatensauce.', 13.90, null, null, false, false, false, false, false, false, 4, true, ARRAY['A', 'G']::UUID[], ARRAY[]::UUID[])
ON CONFLICT (id) DO NOTHING;

-- Vegetarische Gerichte (Vegetarian Dishes)
INSERT INTO menu_items (id, category_id, number, name, description, price, price_note, image_url, is_vegetarian, is_vegan, is_gluten_free, is_spicy, is_new, is_recommended, display_order, is_active, allergen_ids, additive_ids) VALUES
  ('100e8400-e29b-41d4-a716-446655440015', '990e8400-e29b-41d4-a716-446655440004', '16', 'Gemüse-Moussaka', 'Vegetarische Variante der Moussaka mit Auberginen, Zucchini und Kartoffeln.', 13.90, null, null, true, false, false, false, false, true, 1, true, ARRAY['A', 'G']::UUID[], ARRAY[]::UUID[]),
  ('100e8400-e29b-41d4-a716-446655440016', '990e8400-e29b-41d4-a716-446655440004', '17', 'Spanakopita', 'Blätterteigtasche mit Spinat und Feta-Käse.', 11.90, null, null, false, false, false, false, false, true, 2, true, ARRAY['A', 'G']::UUID[], ARRAY[]::UUID[]),
  ('100e8400-e29b-41d4-a716-446655440017', '990e8400-e29b-41d4-a716-446655440004', '18', 'Briam', 'Griechischer Ofengemüse-Eintopf mit Kartoffeln, Zucchini, Auberginen und Tomaten.', 12.50, null, null, true, true, true, false, true, false, 3, true, ARRAY[]::UUID[], ARRAY[]::UUID[]),
  ('100e8400-e29b-41d4-a716-446655440018', '990e8400-e29b-41d4-a716-446655440004', '19', 'Fava', 'Püree aus gelben Spalterbsen mit Zwiebeln und Olivenöl.', 9.90, null, null, true, true, true, false, false, false, 4, true, ARRAY[]::UUID[], ARRAY[]::UUID[])
ON CONFLICT (id) DO NOTHING;

-- Grillgerichte (Grill Dishes)
INSERT INTO menu_items (id, category_id, number, name, description, price, price_note, image_url, is_vegetarian, is_vegan, is_gluten_free, is_spicy, is_new, is_recommended, display_order, is_active, allergen_ids, additive_ids) VALUES
  ('100e8400-e29b-41d4-a716-446655440019', '990e8400-e29b-41d4-a716-446655440005', '20', 'Souvlaki', 'Gegrillte Schweinespieße mit Zwiebeln und Paprika. Serviert mit Pommes frites und Tzatziki.', 16.50, null, null, false, false, false, false, false, true, 1, true, ARRAY['A', 'G']::UUID[], ARRAY[]::UUID[]),
  ('100e8400-e29b-41d4-a716-446655440020', '990e8400-e29b-41d4-a716-446655440005', '21', 'Hühnchen-Souvlaki', 'Gegrillte Hühnerspieße mit Zwiebeln und Paprika. Serviert mit Pommes frites und Tzatziki.', 15.90, null, null, false, false, false, false, false, false, 2, true, ARRAY['A', 'G']::UUID[], ARRAY[]::UUID[]),
  ('100e8400-e29b-41d4-a716-446655440021', '990e8400-e29b-41d4-a716-446655440005', '22', 'Lammkoteletts', 'Gegrillte Lammkoteletts mit Kräutern. Serviert mit Ofenkartoffeln und Gemüse.', 22.90, null, null, false, false, true, false, false, true, 3, true, ARRAY[]::UUID[], ARRAY[]::UUID[]),
  ('100e8400-e29b-41d4-a716-446655440022', '990e8400-e29b-41d4-a716-446655440005', '23', 'Bifteki', 'Griechische Frikadellen vom Grill. Serviert mit Pommes frites und Tzatziki.', 14.90, null, null, false, false, false, false, false, false, 4, true, ARRAY['A', 'G']::UUID[], ARRAY[]::UUID[]),
  ('100e8400-e29b-41d4-a716-446655440023', '990e8400-e29b-41d4-a716-446655440005', '24', 'Gegrillte Garnelen', 'Gegrillte Riesengarnelen mit Knoblauch und Olivenöl. Serviert mit Zitrone.', 19.90, null, null, false, false, true, false, true, false, 5, true, ARRAY['B', 'D']::UUID[], ARRAY[]::UUID[])
ON CONFLICT (id) DO NOTHING;

-- Desserts
INSERT INTO menu_items (id, category_id, number, name, description, price, price_note, image_url, is_vegetarian, is_vegan, is_gluten_free, is_spicy, is_new, is_recommended, display_order, is_active, allergen_ids, additive_ids) VALUES
  ('100e8400-e29b-41d4-a716-446655440024', '990e8400-e29b-41d4-a716-446655440006', '25', 'Baklava', 'Blätterteiggebäck mit gehackten Nüssen und Honigsirup.', 6.90, null, null, false, false, false, false, false, true, 1, true, ARRAY['A', 'H']::UUID[], ARRAY[]::UUID[]),
  ('100e8400-e29b-41d4-a716-446655440025', '990e8400-e29b-41d4-a716-446655440006', '26', 'Galaktoboureko', 'Griechischer Milch-Pudding in Blätterteig mit Zuckersirup.', 6.50, null, null, false, false, false, false, false, false, 2, true, ARRAY['A', 'G']::UUID[], ARRAY[]::UUID[]),
  ('100e8400-e29b-41d4-a716-446655440026', '990e8400-e29b-41d4-a716-446655440006', '27', 'Loukoumades', 'Griechische Donuts mit Honig und Zimt.', 7.50, null, null, true, false, false, false, false, true, 3, true, ARRAY['A']::UUID[], ARRAY[]::UUID[]),
  ('100e8400-e29b-41d4-a716-446655440027', '990e8400-e29b-41d4-a716-446655440006', '28', 'Joghurt mit Honig', 'Griechischer Joghurt mit Honig und Walnüssen.', 5.90, null, null, true, false, true, false, false, false, 4, true, ARRAY['G']::UUID[], ARRAY[]::UUID[]),
  ('100e8400-e29b-41d4-a716-446655440028', '990e8400-e29b-41d4-a716-446655440006', '29', 'Frisches Obst', 'Saisonales Obst der Tages.', 4.90, null, null, true, true, true, false, false, false, 5, true, ARRAY[]::UUID[], ARRAY[]::UUID[])
ON CONFLICT (id) DO NOTHING;

-- Getränke (Drinks)
INSERT INTO menu_items (id, category_id, number, name, description, price, price_note, image_url, is_vegetarian, is_vegan, is_gluten_free, is_spicy, is_new, is_recommended, display_order, is_active, allergen_ids, additive_ids) VALUES
  ('100e8400-e29b-41d4-a716-446655440029', '990e8400-e29b-41d4-a716-446655440007', '30', 'Mythos Bier', 'Griechisches Bier (0,5l)', 4.50, null, null, true, true, true, false, false, false, 1, true, ARRAY[]::UUID[], ARRAY[]::UUID[]),
  ('100e8400-e29b-41d4-a716-446655440030', '990e8400-e29b-41d4-a716-446655440007', '31', 'Ouzo', 'Griechischer Anisschnaps (4cl)', 5.50, null, null, true, true, true, false, false, false, 2, true, ARRAY[]::UUID[], ARRAY[]::UUID[]),
  ('100e8400-e29b-41d4-a716-446655440031', '990e8400-e29b-41d4-a716-446655440007', '32', 'Retsina', 'Griechischer Weißwein mit Harzaroma (0,2l)', 7.90, null, null, true, true, true, false, false, false, 3, true, ARRAY['L']::UUID[], ARRAY[]::UUID[]),
  ('100e8400-e29b-41d4-a716-446655440032', '990e8400-e29b-41d4-a716-446655440007', '33', 'Cola', 'Softdrink (0,33l)', 3.50, null, null, true, true, true, false, false, false, 4, true, ARRAY[]::UUID[], ARRAY[]::UUID[]),
  ('100e8400-e29b-41d4-a716-446655440033', '990e8400-e29b-41d4-a716-446655440007', '34', 'Wasser', 'Still oder medium (0,5l)', 2.90, null, null, true, true, true, false, false, false, 5, true, ARRAY[]::UUID[], ARRAY[]::UUID[]),
  ('100e8400-e29b-41d4-a716-446655440034', '990e8400-e29b-41d4-a716-446655440007', '35', 'Griechischer Kaffee', 'Traditioneller griechischer Kaffee', 3.90, null, null, true, true, true, false, false, false, 6, true, ARRAY[]::UUID[], ARRAY[]::UUID[])
ON CONFLICT (id) DO NOTHING;

-- ============================================
-- PAGES (Additional CMS Pages)
-- ============================================

INSERT INTO pages (id, slug, title, content, is_active, show_in_navigation, navigation_order, meta_title, meta_description) VALUES
  ('200e8400-e29b-41d4-a716-446655440000', 'geschichte', 'Unsere Geschichte', '<h1>Unsere Geschichte</h1><p>Die Taverna Zeus wurde 1995 von der Familie Papadopoulos in Berlin gegründet. Was als kleines Familienrestaurant begann, hat sich im Laufe der Jahre zu einem der beliebtesten griechischen Restaurants in der Hauptstadt entwickelt.</p><p>Unser Ziel war es immer, authentische griechische Küche mit frischen Zutaten und traditionellen Rezepten anzubieten. Viele unserer Rezepte stammen aus der Familie und werden seit Generationen weitergegeben.</p>', true, true, 1, 'Unsere Geschichte - Taverna Zeus', 'Erfahren Sie mehr über die Geschichte der Taverna Zeus seit 1995'),
  ('200e8400-e29b-41d4-a716-446655440001', 'events', 'Veranstaltungen', '<h1>Veranstaltungen</h1><p>In der Taverna Zeus finden regelmäßig verschiedene Veranstaltungen statt:</p><ul><li><strong>Griechische Abende:</strong> Jeden Freitag mit live griechischer Musik</li><li><strong>Weinproben:</strong> Monatliche Weinproben mit griechischen Weinen</li><li><strong>Kochkurse:</strong> Lernen Sie, authentische griechische Gerichte zuzubereiten</li><li><strong>Privaten Feiern:</strong> Wir organisieren Hochzeiten, Geburtstage und andere Feiern</li></ul>', true, true, 2, 'Veranstaltungen - Taverna Zeus', 'Griechische Abende, Weinproben und Kochkurse in der Taverna Zeus'),
  ('200e8400-e29b-41d4-a716-446655440002', 'reservierung', 'Reservierung', '<h1>Reservierung</h1><p>Sie können einen Tisch in der Taverna Zeus online reservieren oder uns anrufen.</p><p><strong>Telefon:</strong> +49 30 12345678</p><p><strong>E-Mail:</strong> reservierung@taverna-zeus.de</p><p>Oder nutzen Sie unser Online-Formular:</p>', true, true, 3, 'Reservierung - Taverna Zeus', 'Reservieren Sie einen Tisch in der Taverna Zeus online oder per Telefon')
ON CONFLICT (slug) DO NOTHING;

-- ============================================
-- USERS (CMS Users)
-- ============================================

-- Admin user (password should be set through Supabase Auth)
INSERT INTO users (id, email, name, role, is_active, last_login) VALUES (
  '300e8400-e29b-41d4-a716-446655440000',
  'admin@taverna-zeus.de',
  'Administrator',
  'admin',
  true,
  NOW()
) ON CONFLICT (email) DO UPDATE SET
  name = EXCLUDED.name,
  role = EXCLUDED.role,
  is_active = EXCLUDED.is_active,
  updated_at = NOW();

-- Editor user
INSERT INTO users (id, email, name, role, is_active, last_login) VALUES (
  '300e8400-e29b-41d4-a716-446655440001',
  'editor@taverna-zeus.de',
  'Editor',
  'editor',
  true,
  NOW()
) ON CONFLICT (email) DO UPDATE SET
  name = EXCLUDED.name,
  role = EXCLUDED.role,
  is_active = EXCLUDED.is_active,
  updated_at = NOW();

-- Viewer user
INSERT INTO users (id, email, name, role, is_active, last_login) VALUES (
  '300e8400-e29b-41d4-a716-446655440002',
  'viewer@taverna-zeus.de',
  'Viewer',
  'viewer',
  true,
  NOW()
) ON CONFLICT (email) DO UPDATE SET
  name = EXCLUDED.name,
  role = EXCLUDED.role,
  is_active = EXCLUDED.is_active,
  updated_at = NOW();

-- ============================================
-- UPDATE ALLERGEN AND ADDITIVE REFERENCES IN MENU ITEMS
-- ============================================

-- Update allergen_ids to use actual UUIDs from allergens table
UPDATE menu_items 
SET allergen_ids = ARRAY[
  (SELECT id FROM allergens WHERE code = 'G' LIMIT 1)
] 
WHERE name = 'Tzatziki';

UPDATE menu_items 
SET allergen_ids = ARRAY[
  (SELECT id FROM allergens WHERE code = 'A' LIMIT 1),
  (SELECT id FROM allergens WHERE code = 'G' LIMIT 1)
] 
WHERE name = 'Feta im Blätterteig';

UPDATE menu_items 
SET allergen_ids = ARRAY[
  (SELECT id FROM allergens WHERE code = 'D' LIMIT 1),
  (SELECT id FROM allergens WHERE code = 'A' LIMIT 1)
] 
WHERE name = 'Gebratene Calamares';

UPDATE menu_items 
SET allergen_ids = ARRAY[
  (SELECT id FROM allergens WHERE code = 'G' LIMIT 1)
] 
WHERE name IN ('Griechischer Salat', 'Dorf-Salat');

UPDATE menu_items 
SET allergen_ids = ARRAY[
  (SELECT id FROM allergens WHERE code = 'C' LIMIT 1),
  (SELECT id FROM allergens WHERE code = 'G' LIMIT 1)
] 
WHERE name = 'Avgolemono';

UPDATE menu_items 
SET allergen_ids = ARRAY[
  (SELECT id FROM allergens WHERE code = 'A' LIMIT 1),
  (SELECT id FROM allergens WHERE code = 'G' LIMIT 1)
] 
WHERE name IN ('Moussaka', 'Pastitsio', 'Soutzoukakia', 'Vegetarische Moussaka', 'Spanakopita', 'Bifteki', 'Souvlaki', 'Hühnchen-Souvlaki');

UPDATE menu_items 
SET allergen_ids = ARRAY[
  (SELECT id FROM allergens WHERE code = 'I' LIMIT 1)
] 
WHERE name = 'Stifado';

UPDATE menu_items 
SET allergen_ids = ARRAY[
  (SELECT id FROM allergens WHERE code = 'B' LIMIT 1),
  (SELECT id FROM allergens WHERE code = 'D' LIMIT 1)
] 
WHERE name = 'Gegrillte Garnelen';

UPDATE menu_items 
SET allergen_ids = ARRAY[
  (SELECT id FROM allergens WHERE code = 'A' LIMIT 1),
  (SELECT id FROM allergens WHERE code = 'H' LIMIT 1)
] 
WHERE name = 'Baklava';

UPDATE menu_items 
SET allergen_ids = ARRAY[
  (SELECT id FROM allergens WHERE code = 'A' LIMIT 1),
  (SELECT id FROM allergens WHERE code = 'G' LIMIT 1)
] 
WHERE name = 'Galaktoboureko';

UPDATE menu_items 
SET allergen_ids = ARRAY[
  (SELECT id FROM allergens WHERE code = 'A' LIMIT 1)
] 
WHERE name = 'Loukoumades';

UPDATE menu_items 
SET allergen_ids = ARRAY[
  (SELECT id FROM allergens WHERE code = 'G' LIMIT 1)
] 
WHERE name = 'Joghurt mit Honig';

UPDATE menu_items 
SET allergen_ids = ARRAY[
  (SELECT id FROM allergens WHERE code = 'L' LIMIT 1)
] 
WHERE name = 'Retsina';

-- ============================================
-- CREATE STORAGE BUCKETS (via Supabase API)
-- ============================================

-- Note: Storage buckets need to be created through the Supabase dashboard or API
-- The following SQL creates a placeholder to remind you to create these buckets:

-- Create a reminder table for storage setup
CREATE TABLE IF NOT EXISTS storage_setup_reminders (
  id SERIAL PRIMARY KEY,
  bucket_name VARCHAR(100) NOT NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

INSERT INTO storage_setup_reminders (bucket_name, description) VALUES
  ('restaurant-images', 'For all restaurant images (hero, menu items, category images, etc.)'),
  ('documents', 'For PDFs, menus, and other documents'),
  ('backups', 'For database backups and exports')
ON CONFLICT (bucket_name) DO NOTHING;

-- ============================================
-- FINAL OUTPUT
-- ============================================

-- Output summary of inserted data
SELECT 
  'Languages' as table_name,
  COUNT(*) as count
FROM languages
UNION ALL
SELECT 
  'Allergens' as table_name,
  COUNT(*) as count
FROM allergens
UNION ALL
SELECT 
  'Additives' as table_name,
  COUNT(*) as count
FROM additives
UNION ALL
SELECT 
  'Menu Categories' as table_name,
  COUNT(*) as count
FROM menu_categories
UNION ALL
SELECT 
  'Menu Items' as table_name,
  COUNT(*) as count
FROM menu_items
UNION ALL
SELECT 
  'Pages' as table_name,
  COUNT(*) as count
FROM pages
UNION ALL
SELECT 
  'Users' as table_name,
  COUNT(*) as count
FROM users
UNION ALL
SELECT 
  'Restaurant Settings' as table_name,
  COUNT(*) as count
FROM restaurant_settings;
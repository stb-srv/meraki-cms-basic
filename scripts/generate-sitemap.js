#!/usr/bin/env node

/**
 * Sitemap Generator for Taverna Zeus CMS
 * This script generates a sitemap.xml file for SEO purposes
 */

const fs = require('fs');
const path = require('path');

// Configuration
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://taverna-zeus.com';
const OUTPUT_FILE = path.join(__dirname, '../public/sitemap.xml');

// Static pages that should be included in the sitemap
const staticPages = [
  '',
  'speisekarte',
  'standort',
  'ueber-uns',
  'impressum',
  'datenschutz'
];

// Generate sitemap XML
function generateSitemap() {
  const today = new Date().toISOString().split('T')[0];
  
  let xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
`;

  // Add static pages
  staticPages.forEach(page => {
    const url = page ? `${SITE_URL}/${page}` : SITE_URL;
    xml += `  <url>
    <loc>${url}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>
`;
  });

  // Add dynamic pages (these would be fetched from your database in a real implementation)
  // For now, we'll add some placeholder entries
  const dynamicPages = [
    { slug: 'reservierung', changefreq: 'daily', priority: 0.7 },
    { slug: 'galerie', changefreq: 'monthly', priority: 0.6 },
    { slug: 'kontakt', changefreq: 'weekly', priority: 0.7 }
  ];

  dynamicPages.forEach(page => {
    const url = `${SITE_URL}/${page.slug}`;
    xml += `  <url>
    <loc>${url}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>
`;
  });

  xml += `</urlset>`;

  return xml;
}

// Write sitemap to file
function writeSitemap() {
  try {
    const sitemap = generateSitemap();
    fs.writeFileSync(OUTPUT_FILE, sitemap, 'utf8');
    console.log(`✅ Sitemap generated successfully: ${OUTPUT_FILE}`);
    console.log(`🌐 Sitemap URL: ${SITE_URL}/sitemap.xml`);
  } catch (error) {
    console.error('❌ Error generating sitemap:', error);
    process.exit(1);
  }
}

// Run the script
writeSitemap();

// Also generate a simple sitemap for development
if (process.env.NODE_ENV === 'development') {
  const devSitemap = generateSitemap();
  const devOutput = path.join(__dirname, '../public/sitemap-dev.xml');
  fs.writeFileSync(devOutput, devSitemap, 'utf8');
  console.log(`📝 Development sitemap: ${devOutput}`);
}
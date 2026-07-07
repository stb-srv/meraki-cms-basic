# Deployment Guide for Taverna Zeus CMS

This comprehensive guide covers deploying your Taverna Zeus CMS to production using Vercel and Supabase.

## Table of Contents

1. [Pre-Deployment Checklist](#pre-deployment-checklist)
2. [Supabase Production Setup](#supabase-production-setup)
3. [Vercel Deployment](#vercel-deployment)
4. [Custom Domain Configuration](#custom-domain-configuration)
5. [SSL Certificate Setup](#ssl-certificate-setup)
6. [Environment Variables Management](#environment-variables-management)
7. [CI/CD Pipeline Setup](#cicd-pipeline-setup)
8. [Monitoring and Analytics](#monitoring-and-analytics)
9. [Backup and Disaster Recovery](#backup-and-disaster-recovery)
10. [Performance Optimization](#performance-optimization)
11. [Security Hardening](#security-hardening)
12. [Post-Deployment Tasks](#post-deployment-tasks)

---

## Pre-Deployment Checklist

### ✅ Development Environment
- [ ] All features implemented and tested locally
- [ ] No console errors or warnings in development
- [ ] All forms validated and working correctly
- [ ] Image upload/download functionality tested
- [ ] Authentication flow working (login, logout, session persistence)
- [ ] All CMS pages accessible and functional

### ✅ Content Preparation
- [ ] Restaurant information (name, description, contact details)
- [ ] Menu categories and items with prices
- [ ] Allergen and additive information
- [ ] Opening hours configured
- [ ] Location and Google Maps integration
- [ ] Hero images and restaurant photos
- [ ] Legal pages content (Impressum, Datenschutz)

### ✅ Database
- [ ] Schema executed on Supabase
- [ ] Seed data loaded
- [ ] Storage buckets created
- [ ] RLS policies configured and tested
- [ ] Initial admin user created

### ✅ Configuration
- [ ] `.env.local` file created with production credentials
- [ ] Google Maps API key (if using maps)
- [ ] Custom domain purchased (if applicable)
- [ ] SSL certificate ready (Vercel provides automatic SSL)

---

## Supabase Production Setup

### 1. Create Production Project

```bash
# If you haven't created your Supabase project yet
# Follow the steps in SUPABASE_SETUP.md
```

### 2. Configure Project Settings

#### Project Configuration
1. Go to Supabase Dashboard → Project Settings → General
2. Set **Project Name**: `Taverna Zeus CMS - Production`
3. Enable **Custom Domains** (if using custom domain)
4. Set **Max Rows** to a reasonable limit (e.g., 1000 for free tier)

#### Database Configuration
1. Go to Project Settings → Database
2. Set **Connection Pooling** to ON (improves performance)
3. Configure **Timeout Settings**:
   - Statement timeout: 30000 (30 seconds)
   - Lock timeout: 5000 (5 seconds)
   - Idle in transaction session timeout: 10000 (10 seconds)

#### Authentication Configuration
1. Go to Authentication → Settings
2. Enable **Email/Password** authentication
3. Configure **Email Templates**:
   - Set your restaurant's email for sender address
   - Customize email templates with your branding
4. Set **Redirect URLs**:
   - Add your production domain: `https://your-domain.com/cms/login`
   - Add localhost for development: `http://localhost:3000/cms/login`
5. Set **Site URL**: `https://your-domain.com`

#### Storage Configuration
1. Go to Storage → Settings
2. Configure **File Size Limits**:
   - restaurant-images: 10MB max
   - documents: 50MB max
   - backups: 100MB max
3. Enable **Virus Scanner** (recommended for production)

### 3. Configure CORS

1. Go to Project Settings → API → CORS
2. Add your production domain:
   ```
   https://your-domain.com
   https://www.your-domain.com
   ```
3. Add development domain:
   ```
   http://localhost:3000
   ```
4. Add Vercel preview domains (if using Vercel):
   ```
   *.vercel.app
   *.vercel.app
   ```

### 4. Set Up Database Backups

1. Go to Project Settings → Database → Backups
2. Enable **Automated Backups**
3. Set backup frequency (daily recommended for production)
4. Set retention period (7-30 days recommended)
5. Download initial backup for safekeeping

### 5. Monitor Performance

1. Go to Project Settings → Observability
2. Enable **Query Performance Monitoring**
3. Set up alerts for slow queries (> 100ms)
4. Enable **Database Webhooks** for important events

---

## Vercel Deployment

### 1. Prepare for Deployment

#### Install Vercel CLI (Optional)
```bash
npm install -g vercel
vercel login
```

#### Create `vercel.json` Configuration

Create a `vercel.json` file in your project root:

```json
{
  "version": 2,
  "builds": [
    {
      "src": "package.json",
      "use": "@vercel/next",
      "config": {
        "installCommand": "npm install",
        "buildCommand": "npm run build"
      }
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "/"
    },
    {
      "src": "/api/(.*)",
      "dest": "/api/$1"
    }
  ],
  "env": [
    "NEXT_PUBLIC_SUPABASE_URL",
    "NEXT_PUBLIC_SUPABASE_ANON_KEY",
    "SUPABASE_SERVICE_ROLE_KEY",
    "NEXT_PUBLIC_APP_NAME",
    "NEXT_PUBLIC_APP_DESCRIPTION",
    "NEXT_PUBLIC_GOOGLE_MAPS_API_KEY"
  ]
}
```

### 2. Deploy via Vercel Dashboard

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click "Add New" → "Project"
3. Import your GitHub repository
4. Configure project settings:
   - **Project Name**: `taverna-zeus-cms`
   - **Framework Preset**: Next.js
   - **Root Directory**: (leave empty)
   - **Build Command**: `npm run build`
   - **Install Command**: `npm install`
   - **Output Directory**: `.next`
   - **Node.js Version**: 18.x or 20.x
5. Click "Deploy"

### 3. Deploy via Vercel CLI

```bash
# Navigate to your project directory
cd taverna-zeus-cms

# Deploy to Vercel
vercel

# Follow the prompts:
# - Link to existing Vercel project or create new
# - Set project name
# - Add environment variables
# - Choose deployment region
```

### 4. Configure Environment Variables in Vercel

1. Go to your project in Vercel Dashboard
2. Click "Settings" → "Environment Variables"
3. Add the following variables:

| Name | Value | Scope |
|------|-------|-------|
| `NEXT_PUBLIC_SUPABASE_URL` | Your Supabase project URL | All environments |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Your Supabase anon key | All environments |
| `SUPABASE_SERVICE_ROLE_KEY` | Your Supabase service role key | Production only |
| `NEXT_PUBLIC_APP_NAME` | Taverna Zeus | All environments |
| `NEXT_PUBLIC_APP_DESCRIPTION` | Griechisches Restaurant mit authentischer Küche | All environments |
| `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` | Your Google Maps API key | All environments |

**Important**: Mark `SUPABASE_SERVICE_ROLE_KEY` as **Sensitive** and only add it to Production environment.

### 5. Configure Build Settings

1. Go to Project Settings → Build & Development Settings
2. Set **Build Command**: `npm run build`
3. Set **Install Command**: `npm install`
4. Set **Output Directory**: `.next`
5. Set **Node.js Version**: 18.x or 20.x
6. Enable **Automatic Deployments** for main branch
7. Enable **Preview Deployments** for pull requests

---

## Custom Domain Configuration

### 1. Add Domain in Vercel

1. Go to your project in Vercel Dashboard
2. Click "Settings" → "Domains"
3. Click "Add Domain"
4. Enter your domain (e.g., `taverna-zeus.com` or `www.taverna-zeus.com`)
5. Click "Add"

### 2. Configure DNS

#### Option A: Using Vercel Nameservers (Recommended)

1. In Vercel Domains settings, copy the nameservers
2. Go to your domain registrar (GoDaddy, Namecheap, etc.)
3. Replace the current nameservers with Vercel's nameservers:
   - `ns1.vercel-dns.com`
   - `ns2.vercel-dns.com`
4. Save changes (DNS propagation can take up to 48 hours)

#### Option B: Manual DNS Configuration

Add the following DNS records at your registrar:

| Type | Name | Value | TTL |
|------|------|-------|-----|
| A | @ | Vercel IP address | Auto |
| A | www | Vercel IP address | Auto |
| CNAME | www | your-project.vercel.app | Auto |

Get the Vercel IP address from your project's domain settings.

### 3. Configure Redirects

1. In Vercel Domain settings
2. Enable **Redirect** from `www` to root domain or vice versa
3. Set up any additional redirects as needed

---

## SSL Certificate Setup

Vercel automatically provisions and renews SSL certificates for all domains. No manual configuration is needed.

### Verify SSL Certificate

1. After DNS propagation is complete
2. Visit `https://your-domain.com`
3. Check for the padlock icon in the browser address bar
4. Verify certificate details in browser developer tools

### Force HTTPS

Vercel automatically redirects HTTP to HTTPS. You can verify this in your project settings.

---

## Environment Variables Management

### Production vs Development Variables

| Environment | Variables | Notes |
|-------------|-----------|-------|
| Development | All variables in `.env.local` | Used for local development |
| Production | All variables in Vercel | Used for deployed application |
| Preview | All variables except service role key | Used for preview deployments |

### Managing Sensitive Variables

1. **Service Role Key**: Only add to Production environment
2. **Google Maps API Key**: Can be added to all environments
3. **Database Credentials**: Never expose in client-side code

### Using Different Configurations

Create separate environment files:
- `.env.local` - Development
- `.env.production` - Production (optional, for local testing)
- `.env.test` - Testing

---

## CI/CD Pipeline Setup

### 1. GitHub Actions (Optional)

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Vercel

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - name: Install Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
      
      - name: Install dependencies
        run: npm install
      
      - name: Run lint
        run: npm run lint
      
      - name: Build project
        run: npm run build
        env:
          NEXT_PUBLIC_SUPABASE_URL: ${{ secrets.NEXT_PUBLIC_SUPABASE_URL }}
          NEXT_PUBLIC_SUPABASE_ANON_KEY: ${{ secrets.NEXT_PUBLIC_SUPABASE_ANON_KEY }}
          NEXT_PUBLIC_APP_NAME: ${{ secrets.NEXT_PUBLIC_APP_NAME }}
          NEXT_PUBLIC_APP_DESCRIPTION: ${{ secrets.NEXT_PUBLIC_APP_DESCRIPTION }}
      
      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v25
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-args: '--prod'
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
        env:
          NEXT_PUBLIC_SUPABASE_URL: ${{ secrets.NEXT_PUBLIC_SUPABASE_URL }}
          NEXT_PUBLIC_SUPABASE_ANON_KEY: ${{ secrets.NEXT_PUBLIC_SUPABASE_ANON_KEY }}
          SUPABASE_SERVICE_ROLE_KEY: ${{ secrets.SUPABASE_SERVICE_ROLE_KEY }}
          NEXT_PUBLIC_APP_NAME: ${{ secrets.NEXT_PUBLIC_APP_NAME }}
          NEXT_PUBLIC_APP_DESCRIPTION: ${{ secrets.NEXT_PUBLIC_APP_DESCRIPTION }}
          NEXT_PUBLIC_GOOGLE_MAPS_API_KEY: ${{ secrets.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY }}
```

### 2. Configure GitHub Secrets

1. Go to GitHub repository → Settings → Secrets → Actions
2. Add the following secrets:
   - `VERCEL_TOKEN` - From Vercel account settings
   - `VERCEL_ORG_ID` - Your Vercel organization ID
   - `VERCEL_PROJECT_ID` - Your Vercel project ID
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `NEXT_PUBLIC_APP_NAME`
   - `NEXT_PUBLIC_APP_DESCRIPTION`
   - `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY`

---

## Monitoring and Analytics

### 1. Vercel Analytics

1. Go to Vercel Dashboard → Project → Analytics
2. Enable **Performance Monitoring**
3. Enable **Speed Insights**
4. Add analytics to your project

### 2. Supabase Monitoring

1. Go to Supabase Dashboard → Project → Observability
2. Set up **Query Performance** monitoring
3. Configure **Alerts** for:
   - High database load
   - Failed authentication attempts
   - Storage usage thresholds

### 3. Third-Party Analytics (Optional)

#### Google Analytics
1. Create a Google Analytics property
2. Add the tracking code to your Next.js application
3. Create `src/components/Analytics.tsx`:

```tsx
'use client';

import Script from 'next/script';

declare global {
  interface Window {
    gtag: (command: string, ...args: any[]) => void;
  }
}

export default function Analytics() {
  return (
    <>
      <Script
        strategy="afterInteractive"
        src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID}`}
      />
      <Script id="google-analytics" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID}');
        `}
      </Script>
    </>
  );
}
```

4. Add to `src/app/layout.tsx`:
```tsx
import Analytics from '@/components/Analytics';

// Inside your layout component
<Analytics />
```

5. Add to `.env.local`:
```env
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX
```

#### Sentry Error Tracking
1. Install Sentry:
```bash
npm install @sentry/nextjs
```

2. Configure Sentry in `src/lib/sentry.ts`:
```ts
import * as Sentry from '@sentry/nextjs';

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  tracesSampleRate: 1.0,
  debug: process.env.NODE_ENV === 'development',
});

export default Sentry;
```

3. Add to `next.config.js`:
```js
const { withSentryConfig } = require('@sentry/nextjs');

module.exports = withSentryConfig(
  {
    // Your existing Next.js config
  },
  {
    org: process.env.SENTRY_ORG,
    project: process.env.SENTRY_PROJECT,
    authToken: process.env.SENTRY_AUTH_TOKEN,
    configFile: '.sentryclirc',
  }
);
```

---

## Backup and Disaster Recovery

### 1. Database Backups

#### Automated Backups (Supabase)
1. Supabase automatically creates backups daily
2. Retention period: 7 days (free tier), 30 days (pro tier)
3. Go to Supabase Dashboard → Database → Backups

#### Manual Backups
```bash
# Using Supabase CLI
supabase db dump --db-url postgresql://postgres:your-password@db.your-ref.supabase.co:5432/postgres > backup-$(date +%Y%m%d).sql

# Using pg_dump (if you have direct access)
pg_dump -h db.your-ref.supabase.co -U postgres -d postgres > backup.sql
```

#### Backup Storage
1. Store backups in multiple locations:
   - Local machine
   - Cloud storage (Google Drive, Dropbox)
   - Another cloud provider (AWS S3, etc.)
2. Test restore process regularly

### 2. Application Backups

#### Code Backup
1. Regularly push to GitHub
2. Create releases for major versions
3. Use Git tags for important milestones

#### Assets Backup
1. Download all images from Supabase Storage
2. Backup to external storage
3. Document all custom configurations

### 3. Disaster Recovery Plan

1. **Database Failure**:
   - Restore from latest Supabase backup
   - Or use your manual backup
   - Test data integrity after restore

2. **Application Failure**:
   - Redeploy from GitHub
   - Verify environment variables
   - Check Supabase connection

3. **Supabase Outage**:
   - Monitor [Supabase Status](https://status.supabase.com/)
   - Have a maintenance page ready
   - Consider multi-region deployment for critical applications

---

## Performance Optimization

### 1. Next.js Optimizations

#### Image Optimization
Next.js automatically optimizes images. Ensure all images use the `next/image` component.

#### Static Generation
For pages that don't change often (menu, about, location):
```tsx
// In page.tsx
export const dynamic = 'force-static';
```

#### Caching
Configure caching headers in `next.config.js`:
```js
module.exports = {
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=3600, s-maxage=7200',
          },
        ],
      },
    ];
  },
};
```

### 2. Supabase Optimizations

#### Query Optimization
1. Use `.select()` to only fetch needed columns
2. Use `.limit()` and `.range()` for pagination
3. Add appropriate indexes (already in schema)
4. Use `.eq()` instead of `.filter()` when possible

#### Connection Pooling
Supabase automatically handles connection pooling. For server-side operations, consider:
```ts
// Reuse client instances instead of creating new ones for each request
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// Use the same client throughout your application
export default supabase;
```

### 3. Storage Optimization

1. **Image Compression**: Compress images before upload
2. **Thumbnails**: Generate thumbnails for large images
3. **Lazy Loading**: Use lazy loading for images
4. **CDN**: Supabase Storage uses a CDN automatically

### 4. Frontend Optimizations

1. **Code Splitting**: Next.js does this automatically
2. **Lazy Loading**: Load non-critical components lazily
3. **Bundle Analysis**: Use `@next/bundle-analyzer`
4. **Minification**: Next.js handles this automatically

---

## Security Hardening

### 1. Authentication Security

1. **Password Policies**:
   - Enforce strong passwords in Supabase Auth settings
   - Set minimum password length (8+ characters)

2. **Session Management**:
   - Set appropriate session expiration (default: 1 hour)
   - Enable refresh tokens for better UX

3. **Rate Limiting**:
   - Configure rate limiting in Supabase Auth settings
   - Set login attempt limits

### 2. Database Security

1. **RLS Policies**: Already configured in schema
2. **Regular Audits**: Review RLS policies regularly
3. **Least Privilege**: Only grant necessary permissions
4. **Sensitive Data**: Never store plain text passwords or credit card info

### 3. Application Security

1. **Environment Variables**: Never expose sensitive keys in client-side code
2. **Input Validation**: Validate all user inputs (already implemented with Zod)
3. **CSRF Protection**: Next.js provides built-in CSRF protection
4. **XSS Protection**: Use `react-markdown` with `rehype-sanitize` (already implemented)
5. **CORS**: Properly configured in Supabase

### 4. HTTPS and Security Headers

Vercel automatically provides HTTPS. Add security headers in `next.config.js`:

```js
module.exports = {
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin',
          },
          {
            key: 'Content-Security-Policy',
            value: "default-src 'self'; script-src 'self' 'unsafe-eval' https://*.supabase.co; style-src 'self' 'unsafe-inline'; img-src 'self' data: https://*.supabase.co; font-src 'self'; connect-src 'self' https://*.supabase.co; frame-src https://*.google.com;",
          },
        ],
      },
    ];
  },
};
```

### 5. Regular Security Audits

1. **Dependency Scanning**: Regularly run `npm audit`
2. **Secret Scanning**: Use GitHub secret scanning or similar tools
3. **Penetration Testing**: Consider professional security testing for production
4. **Monitoring**: Set up alerts for suspicious activity

---

## Post-Deployment Tasks

### 1. Initial Setup

1. **Login to CMS**:
   - Visit `https://your-domain.com/cms/login`
   - Login with your admin credentials

2. **Configure Restaurant Settings**:
   - Go to CMS → Einstellungen
   - Update restaurant name, description, contact info
   - Upload logo and hero image

3. **Set Up Menu**:
   - Go to CMS → Speisekarte
   - Add categories and menu items
   - Configure prices, descriptions, images

4. **Configure Location**:
   - Go to CMS → Standort
   - Add address, Google Maps iframe
   - Set opening hours

5. **Add Pages**:
   - Go to CMS → Seiten
   - Create additional pages as needed

### 2. Content Migration

1. **Import Menu Data**:
   - Use the Import/Export functionality in CMS
   - Or manually add items through the CMS interface

2. **Upload Images**:
   - Upload all restaurant images
   - Set featured images for menu items

3. **Configure Allergens**:
   - Review and customize allergen list
   - Assign allergens to menu items

### 3. Testing

1. **Functional Testing**:
   - Test all CMS functionality
   - Test public website pages
   - Test authentication flow

2. **User Testing**:
   - Create test user accounts
   - Test different permission levels
   - Test on multiple devices and browsers

3. **Performance Testing**:
   - Test page load times
   - Test image loading
   - Test with slow network connections

### 4. SEO Optimization

1. **Meta Tags**:
   - Configure meta titles and descriptions
   - Set up Open Graph tags for social sharing

2. **Sitemap**:
   - Create `public/sitemap.xml`
   - Submit to Google Search Console

3. **Robots.txt**:
   - Create `public/robots.txt`
   - Configure crawl rules

### 5. Analytics Setup

1. **Google Analytics**: Set up and verify tracking
2. **Google Search Console**: Submit sitemap and verify ownership
3. **Social Media**: Set up Facebook Pixel, Twitter Cards, etc.

### 6. Maintenance Plan

1. **Regular Updates**:
   - Update dependencies monthly
   - Test updates in staging before production

2. **Content Updates**:
   - Regularly update menu items
   - Update opening hours for holidays
   - Add seasonal specials

3. **Monitoring**:
   - Check analytics weekly
   - Monitor performance metrics
   - Review error logs

---

## Troubleshooting Production Issues

### Common Production Issues

1. **White Screen on Load**:
   - Check browser console for errors
   - Verify environment variables are set correctly
   - Check Supabase connection

2. **Authentication Failures**:
   - Verify RLS policies are correct
   - Check user roles in database
   - Test with service role key temporarily

3. **Image Upload Failures**:
   - Verify storage bucket permissions
   - Check bucket exists and is accessible
   - Verify file size limits

4. **Slow Performance**:
   - Check Supabase query performance
   - Optimize slow queries with indexes
   - Enable caching where appropriate

5. **Deployment Failures**:
   - Check Vercel deployment logs
   - Verify all environment variables are set
   - Check for build errors in console

### Debugging Tools

1. **Browser DevTools**: Check Console, Network, and Performance tabs
2. **Supabase Dashboard**: Monitor logs, query performance, and storage
3. **Vercel Dashboard**: Check deployment logs and performance metrics
4. **Sentry**: If configured, check for error reports

---

## Support and Resources

### Documentation
- [Next.js Documentation](https://nextjs.org/docs)
- [Supabase Documentation](https://supabase.com/docs)
- [Vercel Documentation](https://vercel.com/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)

### Community
- [Next.js GitHub Discussions](https://github.com/vercel/next.js/discussions)
- [Supabase GitHub Discussions](https://github.com/supabase/supabase/discussions)
- [Vercel Community](https://vercel.com/community)

### Professional Support
- [Vercel Support](https://vercel.com/support)
- [Supabase Support](https://supabase.com/support)
- Consider hiring a developer for complex issues

---

## Conclusion

You now have a complete guide to deploying your Taverna Zeus CMS to production. Follow these steps carefully, and you'll have a professional, secure, and performant restaurant CMS system running in production.

**Next Steps:**
1. ✅ Complete all pre-deployment checklist items
2. ✅ Set up Supabase production project
3. ✅ Deploy to Vercel
4. ✅ Configure custom domain and SSL
5. ✅ Test thoroughly
6. ✅ Launch your restaurant website!

**Good luck with your Taverna Zeus CMS!** 🍽️🎉
# Taverna Zeus CMS - Restaurant Management System

A comprehensive restaurant CMS built with Next.js 14, React, Tailwind CSS, and Supabase. Perfect for Greek restaurants like Taverna Zeus, but adaptable for any restaurant type.

## 🍽️ Features

### Public Website
- **Hero Section** - Restaurant name, description, and call-to-action buttons
- **Menu Page** - Browse dishes by categories with search and filtering
- **Location Page** - Address, Google Maps integration, opening hours, contact info
- **About Us** - Restaurant story, philosophy, team, and cuisine information
- **Legal Pages** - Impressum and Datenschutz (GDPR compliant)
- **Cookie Banner** - DE/EU compliant cookie consent
- **Responsive Design** - Mobile-first approach with Tailwind CSS

### CMS Admin Panel
- **Authentication** - Secure login via Supabase Auth
- **Menu Management** - Full CRUD for categories and menu items
- **Opening Hours** - Flexible configuration with special hours support
- **Location & Contact** - Manage address, phone, email, and Google Maps
- **Hero Image Management** - Upload and manage hero images
- **Image Upload** - Drag & drop image upload with Supabase Storage
- **Additional Pages** - Create and manage custom CMS pages
- **Import/Export** - Backup and restore menu data with images
- **Multilingual Support** - Ready for DE/EN language switching

### Technical Features
- **Next.js 14** with App Router
- **React 18** with TypeScript
- **Tailwind CSS** with custom theme
- **Supabase** (PostgreSQL + Storage) backend
- **Zod** for form validation
- **React Hook Form** for form management
- **Universal Cookie** for cookie management
- **Next-Intl** for internationalization (configured)

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Supabase account (free tier available)
- Vercel account (for deployment)

### Local Development

1. **Clone the repository:**
```bash
git clone https://github.com/stb-srv/meraki-cms-basic.git
taverna-zeus-cms
cd taverna-zeus-cms
```

2. **Install dependencies:**
```bash
npm install
```

3. **Set up environment variables:**
```bash
cp .env.local.example .env.local
```

Edit `.env.local` with your Supabase credentials:
```env
NEXT_PUBLIC_SUPABASE_URL=your-supabase-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
NEXT_PUBLIC_APP_NAME=Taverna Zeus
NEXT_PUBLIC_APP_DESCRIPTION=Griechisches Restaurant mit authentischer Küche
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your-google-maps-api-key
```

4. **Set up Supabase:**
   - Follow the [Supabase Setup Guide](SUPABASE_SETUP.md)
   - Execute `database/schema.sql` to create database tables
   - Execute `database/seed.sql` to populate with initial data
   - Create storage buckets: `restaurant-images`, `documents`, `backups`

5. **Run the development server:**
```bash
npm run dev
```

6. **Open in browser:**
   - Public site: [http://localhost:3000](http://localhost:3000)
   - CMS login: [http://localhost:3000/cms/login](http://localhost:3000/cms/login)

### Default Admin Credentials
After running the seed script, you can log in with:
- **Email:** admin@taverna-zeus.com
- **Password:** admin123

## 📁 Project Structure

```
taverna-zeus-cms/
├── src/
│   ├── app/                    # Next.js App Router pages
│   │   ├── cms/               # CMS admin pages
│   │   │   ├── speisekarte/   # Menu management
│   │   │   ├── oeffnungszeiten/ # Opening hours
│   │   │   ├── standort/      # Location management
│   │   │   ├── einstellungen/ # Settings
│   │   │   ├── bilder/        # Image management
│   │   │   ├── benutzer/      # User management
│   │   │   ├── seiten/        # Page management
│   │   │   └── import-export/ # Import/Export
│   │   ├── speisekarte/       # Public menu page
│   │   ├── standort/          # Public location page
│   │   ├── ueber-uns/         # About us page
│   │   ├── impressum/         # Legal imprint
│   │   ├── datenschutz/       # Privacy policy
│   │   └── page.tsx           # Home page
│   ├── components/            # React components
│   │   ├── ui/               # UI components (Button, Input, etc.)
│   │   ├── providers/        # Context providers
│   │   └── *.tsx             # Page components
│   ├── hooks/                 # Custom React hooks
│   ├── lib/                  # Utility functions and clients
│   └── types/                # TypeScript type definitions
├── database/
│   ├── schema.sql            # Database schema
│   └── seed.sql              # Seed data
├── public/                   # Static assets
│   ├── robots.txt            # SEO configuration
│   └── sitemap.xml           # Sitemap (generated)
├── scripts/                  # Utility scripts
│   ├── exportMenu.js         # Export menu data
│   ├── importMenu.js         # Import menu data
│   └── generate-sitemap.js   # Generate sitemap
├── .github/workflows/        # GitHub Actions
│   └── deploy.yml            # CI/CD pipeline
├── SUPABASE_SETUP.md         # Supabase setup guide
├── DEPLOYMENT_GUIDE.md       # Deployment guide
├── vercel.json              # Vercel configuration
├── package.json
├── tailwind.config.ts
├── tsconfig.json
└── README.md
```

## 🔧 Configuration

### Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL | ✅ Yes |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anon key | ✅ Yes |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase service role key | ✅ Yes |
| `NEXT_PUBLIC_APP_NAME` | Restaurant name | ⚪ No |
| `NEXT_PUBLIC_APP_DESCRIPTION` | Restaurant description | ⚪ No |
| `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` | Google Maps API key | ⚪ No |

### Database Schema

The database includes the following tables:
- `restaurant_settings` - Restaurant metadata and configuration
- `menu_categories` - Menu item categories with display order
- `menu_items` - Individual menu items with all attributes
- `allergens` - Allergen definitions (EU compliant A-N codes)
- `additives` - Additive definitions
- `pages` - Additional CMS pages
- `languages` - Supported languages
- `translations` - Content translations
- `image_uploads` - Tracking table for uploaded images
- `users` - CMS user accounts with roles

### Storage Buckets

Create these buckets in Supabase Storage:
1. **restaurant-images** - Public bucket for restaurant images
2. **documents** - Private bucket for internal documents
3. **backups** - Private bucket for database backups

## 📊 Available Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |
| `npm run db:generate` | Generate Supabase types |
| `npm run export:menu` | Export menu data to JSON |
| `npm run import:menu` | Import menu data from JSON |
| `npm run generate:sitemap` | Generate sitemap.xml |
| `npm run deploy` | Build and deploy to Vercel |
| `npm run deploy:staging` | Build and deploy to staging |

## 🚀 Deployment

### To Vercel

1. **Push to GitHub:**
```bash
git add .
git commit -m "Ready for deployment"
git push origin main
```

2. **Deploy via Vercel Dashboard:**
   - Go to [Vercel Dashboard](https://vercel.com/dashboard)
   - Import your GitHub repository
   - Configure environment variables
   - Click "Deploy"

3. **Or use Vercel CLI:**
```bash
npm run deploy
```

### To Other Platforms

The application can be deployed to any platform that supports Next.js:
- Netlify
- AWS Amplify
- Heroku
- DigitalOcean App Platform
- Self-hosted Node.js server

## 🔒 Security

### Authentication
- Supabase Auth with email/password
- JWT tokens with automatic refresh
- Secure session management
- Role-based access control (admin, editor, viewer)

### Data Protection
- Row Level Security (RLS) on all database tables
- Public read access for website content
- Restricted write access for CMS users
- Encrypted connections (HTTPS)

### Best Practices
- Never commit `.env.local` to Git
- Use service role key only in server-side code
- Regularly rotate API keys
- Enable 2FA on Supabase account
- Monitor API usage

## 🌍 SEO & Performance

### Built-in SEO Features
- Semantic HTML structure
- Meta tags for all pages
- Sitemap generation
- robots.txt configuration
- Open Graph tags for social sharing

### Performance Optimizations
- Next.js automatic code splitting
- Image optimization with `next/image`
- Static generation for public pages
- Caching headers configuration
- Lazy loading for non-critical components

## 📱 Responsive Design

- Mobile-first approach
- Fully responsive layout
- Touch-friendly UI elements
- Optimized for all screen sizes
- Dark mode support

## 🌐 Multilingual Support

The system is ready for DE/EN language switching using Next-Intl:

1. Install Next-Intl (already included in dependencies)
2. Create translation files in `src/messages/`
3. Configure in `src/app/layout.tsx`
4. Add language switcher component

## 📈 Monitoring & Analytics

### Recommended Integrations
- **Google Analytics** - Track website traffic
- **Google Search Console** - Monitor SEO performance
- **Sentry** - Error tracking and monitoring
- **Supabase Observability** - Database performance monitoring

## 🔄 Data Import/Export

### Export Menu Data
```bash
npm run export:menu
```
This creates a JSON file in the `exports/` directory with all menu data.

### Import Menu Data
```bash
npm run import:menu path/to/export-file.json
```
This imports menu data from a previously exported JSON file.

### Manual Export/Import
You can also use the CMS interface:
1. Go to CMS → Import/Export
2. Click "Export Menu" to download JSON
3. Click "Import Menu" to upload JSON

## 🛠️ Customization

### Change Restaurant Information
1. Go to CMS → Einstellungen
2. Update restaurant name, description, contact info
3. Upload logo and hero images

### Add Menu Items
1. Go to CMS → Speisekarte
2. Click "Kategorie hinzufügen" to add categories
3. Click "Gericht hinzufügen" to add menu items
4. Configure prices, descriptions, images, allergens

### Customize Design
1. Edit `tailwind.config.ts` for colors and theme
2. Modify `src/app/globals.css` for global styles
3. Update components in `src/components/`

### Add New Pages
1. Go to CMS → Seiten
2. Click "Seite hinzufügen"
3. Configure slug, title, content
4. Set navigation visibility

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is private and proprietary. Do not distribute without permission.

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) - The React Framework
- [Supabase](https://supabase.com/) - The Open Source Firebase Alternative
- [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS framework
- [Lucide React](https://lucide.dev/) - Beautiful, simple icons
- [Zod](https://zod.dev/) - Type-safe schema validation
- [React Hook Form](https://react-hook-form.com/) - Performant form validation

## 📞 Support

For issues and questions:
- Check the [Documentation](SUPABASE_SETUP.md)
- Review the [Deployment Guide](DEPLOYMENT_GUIDE.md)
- Open an issue in the GitHub repository
- Contact the development team

---

**Built with ❤️ for restaurants by STB-SRV**

*Taverna Zeus CMS - Your complete restaurant management solution*
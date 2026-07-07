# Supabase Setup Guide for Taverna Zeus CMS

This guide will walk you through setting up your Supabase project and configuring the Taverna Zeus CMS system.

## Prerequisites

- [Supabase account](https://supabase.com/) (free tier is sufficient)
- [Node.js](https://nodejs.org/) v18+ 
- [Git](https://git-scm.com/)
- [Vercel account](https://vercel.com/) (for deployment)

## Step 1: Create Supabase Project

1. Go to [Supabase Dashboard](https://app.supabase.com/)
2. Click "New Project"
3. Enter project name: `taverna-zeus-cms`
4. Select a region (choose one close to your location)
5. Click "Create Project"
6. Wait for the project to be created (usually 1-2 minutes)

## Step 2: Get Project Credentials

Once your project is created:

1. Go to Project Settings (gear icon) → API
2. Copy the following values:
   - **Project URL**: This is your `NEXT_PUBLIC_SUPABASE_URL`
   - **anon public key**: This is your `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - **Service role key**: This is your `SUPABASE_SERVICE_ROLE_KEY` (under "Project API keys" section)

## Step 3: Configure Environment Variables

Create a `.env.local` file in your project root:

```bash
cp .env.local.example .env.local
```

Edit `.env.local` with your Supabase credentials:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your-supabase-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key

# Storage Configuration
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# App Configuration
NEXT_PUBLIC_APP_NAME=Taverna Zeus
NEXT_PUBLIC_APP_DESCRIPTION=Griechisches Restaurant mit authentischer Küche

# Google Maps API Key (optional)
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your-google-maps-api-key
```

## Step 4: Execute Database Schema

### Method A: Using Supabase SQL Editor (Recommended)

1. Go to your Supabase project dashboard
2. Click on "SQL Editor" in the left sidebar
3. Click "New Query"
4. Copy the entire content of `database/schema.sql` and paste it into the editor
5. Click "Run" to execute the schema

### Method B: Using Supabase CLI

1. Install Supabase CLI:
   ```bash
   npm install -g supabase
   ```

2. Link your project:
   ```bash
   supabase link --project-ref your-project-ref
   ```
   (Get project-ref from Project Settings → General)

3. Apply the schema:
   ```bash
   supabase db push
   ```

## Step 5: Execute Seed Data

After the schema is created, execute the seed data:

1. In Supabase SQL Editor, create a new query
2. Copy the entire content of `database/seed.sql` and paste it
3. Click "Run" to populate your database with initial data

## Step 6: Create Storage Buckets

1. Go to "Storage" in the left sidebar
2. Click "New Bucket"
3. Create the following buckets:
   - **Name**: `restaurant-images`
     - **Policy**: Public (for serving images to the public website)
     - **File size limit**: 10MB (or as needed)
     - **Allowed MIME types**: `image/*`
   
   - **Name**: `documents`
     - **Policy**: Private (for internal documents)
     - **File size limit**: 50MB
     - **Allowed MIME types**: `application/pdf, application/msword, application/vnd.*`
   
   - **Name**: `backups`
     - **Policy**: Private (for database backups)
     - **File size limit**: 100MB
     - **Allowed MIME types**: `application/json, application/sql, application/zip`

## Step 7: Configure Row Level Security (RLS)

The schema already includes RLS policies. However, you need to enable them:

1. Go to "Authentication" → "Policies" in Supabase dashboard
2. Verify that the policies from `schema.sql` are active
3. Test by trying to access tables via the API

## Step 8: Create Initial Admin User

The seed data includes an admin user, but you can also create one manually:

1. Go to "Authentication" → "Users" in Supabase dashboard
2. Click "Add User"
3. Enter email and password for your admin account
4. After creation, you'll need to add this user to the `users` table with admin role:

```sql
INSERT INTO users (id, email, name, role, is_active) 
VALUES (
  (SELECT id FROM auth.users WHERE email = 'your-email@example.com'),
  'your-email@example.com',
  'Admin User',
  'admin',
  true
);
```

## Step 9: Test the Application

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the development server:
   ```bash
   npm run dev
   ```

3. Open [http://localhost:3000](http://localhost:3000) in your browser
4. Navigate to [http://localhost:3000/cms/login](http://localhost:3000/cms/login)
5. Login with your admin credentials

## Step 10: Deploy to Vercel

### Method A: Using Vercel CLI

1. Install Vercel CLI:
   ```bash
   npm install -g vercel
   ```

2. Login to Vercel:
   ```bash
   vercel login
   ```

3. Deploy:
   ```bash
   vercel
   ```

4. Follow the prompts to configure your project
5. Add environment variables when prompted

### Method B: Using Vercel Dashboard

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click "Add New" → "Project"
3. Import your GitHub repository
4. Configure the project:
   - **Framework Preset**: Next.js
   - **Root Directory**: (leave empty)
   - **Build Command**: `npm run build`
   - **Install Command**: `npm install`
   - **Output Directory**: `.next`
5. Add environment variables:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `NEXT_PUBLIC_APP_NAME`
   - `NEXT_PUBLIC_APP_DESCRIPTION`
   - `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` (optional)
6. Click "Deploy"

## Step 11: Configure Google Maps (Optional)

If you want to use Google Maps on your location page:

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing
3. Enable "Maps JavaScript API"
4. Create API credentials
5. Add your API key to `.env.local`:
   ```env
   NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your-google-maps-api-key
   ```

## Step 12: Configure Custom Domain (Optional)

1. In Vercel dashboard, go to your project
2. Click "Settings" → "Domains"
3. Add your custom domain
4. Follow the DNS configuration instructions

## Troubleshooting

### Common Issues

1. **Connection Errors**:
   - Verify your Supabase URL and keys are correct
   - Check that your `.env.local` file is in the project root
   - Restart your development server after changing environment variables

2. **RLS Permission Denied**:
   - Make sure you've executed the schema with RLS policies
   - Verify that your user has the correct role in the `users` table
   - Check that the JWT token contains the correct email

3. **Storage Upload Failures**:
   - Verify that the storage buckets exist
   - Check bucket policies (restaurant-images should be public)
   - Ensure your service role key has storage permissions

4. **CORS Issues**:
   - Go to Supabase Project Settings → API → CORS
   - Add your domain(s) to the allowed origins
   - For development, add: `http://localhost:3000`

### Debugging Tips

1. **Check Supabase Logs**:
   - Go to Supabase dashboard → "Logs" to see real-time logs

2. **Test API Directly**:
   - Use the Supabase SQL Editor to test queries directly

3. **Check Network Requests**:
   - Open browser DevTools → Network tab
   - Look for failed requests to your Supabase URL

## Database Management

### Backup Your Database

1. Go to Supabase dashboard → "Table Editor"
2. Click "Export" to download your data as SQL
3. Or use the Supabase CLI:
   ```bash
   supabase db dump --db-url postgresql://postgres:your-password@db.your-project-ref.supabase.co:5432/postgres > backup.sql
   ```

### Restore Database

1. In Supabase SQL Editor, run your backup SQL file
2. Or use Supabase CLI:
   ```bash
   supabase db reset --db-url postgresql://postgres:your-password@db.your-project-ref.supabase.co:5432/postgres < backup.sql
   ```

## Security Best Practices

1. **Never commit `.env.local` to Git**: It's already in `.gitignore`
2. **Use service role key carefully**: Only use it in server-side code
3. **Regularly rotate your keys**: Especially the service role key
4. **Enable 2FA on Supabase**: For your project and account
5. **Monitor API usage**: Check Supabase dashboard for unusual activity

## Performance Optimization

1. **Enable Connection Pooling**: Supabase does this automatically
2. **Add Indexes**: The schema already includes necessary indexes
3. **Use Pagination**: For large datasets (menu items, images)
4. **Cache Frequently Accessed Data**: Consider using Vercel's caching

## Monitoring

1. **Supabase Dashboard**: Real-time monitoring of database, storage, and auth
2. **Vercel Analytics**: Monitor your frontend performance
3. **Error Tracking**: Consider adding Sentry or similar

## Next Steps

1. **Customize Content**: Add your restaurant's actual menu items, images, and settings
2. **Test Thoroughly**: Test all CMS functionality before going live
3. **Set Up Backups**: Configure regular database backups
4. **Monitor Performance**: Keep an eye on database query performance
5. **Plan for Scaling**: Consider upgrading Supabase plan if needed

---

**Need Help?**
- [Supabase Documentation](https://supabase.com/docs)
- [Next.js Documentation](https://nextjs.org/docs)
- [Vercel Documentation](https://vercel.com/docs)

**Support**: For issues with this CMS, check the project's README.md or open an issue in the repository.
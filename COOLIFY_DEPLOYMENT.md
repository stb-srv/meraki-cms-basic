# Coolify Deployment Guide for Taverna Zeus CMS

This guide provides step-by-step instructions for deploying the Taverna Zeus CMS application using Coolify.

## 🚀 Quick Start

### Prerequisites
- [Coolify](https://coolify.io) installed and running
- GitHub account connected to Coolify
- Supabase project created (optional, but required for full CMS functionality)
- Domain name (optional)

## 📋 Step 1: Connect GitHub Repository

1. Log in to your Coolify dashboard
2. Click on **"Add New Project"**
3. Select **GitHub** as the source
4. Choose the repository: `stb-srv/meraki-cms-basic`
5. Select the branch: `main`
6. Click **Next**

## 🏗️ Step 2: Configure Build Settings

### Basic Configuration
- **Project Name**: `taverna-zeus-cms`
- **Build Command**: `npm run build`
- **Start Command**: `npm run start`
- **Output Directory**: `.next`
- **Node Version**: `20` (LTS recommended)
- **Port**: `3000`

### Build Arguments (Optional)
```bash
--max-old-space-size=4096
```

## ⚙️ Step 3: Add Environment Variables

This is **CRITICAL** for the application to work properly. Add these environment variables in the Coolify project settings:

### Required Variables
| Variable | Description | Example |
|----------|-------------|---------|
| `NEXT_PUBLIC_SUPABASE_URL` | Your Supabase project URL | `https://your-project-ref.supabase.co` |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Your Supabase anon public key | `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...` |
| `SUPABASE_SERVICE_ROLE_KEY` | Your Supabase service role key | `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...` |

### Optional Variables
| Variable | Description | Example |
|----------|-------------|---------|
| `NODE_ENV` | Environment mode | `production` |
| `NEXT_PUBLIC_SITE_URL` | Your public domain | `https://your-domain.com` |

### Where to Get Supabase Keys
1. Go to [Supabase Dashboard](https://app.supabase.com)
2. Select your project
3. Navigate to **Settings → API**
4. Copy:
   - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - **anon public key** → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - **service_role secret key** → `SUPABASE_SERVICE_ROLE_KEY`

## 🌐 Step 4: Configure Domain (Optional)

If you have a custom domain:

1. Go to **Domain** section in Coolify
2. Click **Add Domain**
3. Enter your domain name (e.g., `cms.taverna-zeus.de`)
4. Configure DNS records as instructed
5. Enable SSL certificate

## 🔧 Step 5: Advanced Configuration

### Memory Limits
For better performance with large builds:
- **Memory Limit**: `4GB` (recommended)
- **CPU Limit**: `2 vCPUs` (recommended)

### Auto-Deployment
- Enable **Auto-deploy on push** to automatically deploy when code changes
- Enable **Auto-deploy on pull request** for preview deployments

### Notifications
- Configure **Slack** or **Discord** notifications for deployment status
- Set up **Email** notifications for critical errors

## ✅ Step 6: Deploy

1. Click **Deploy** button
2. Monitor the build logs
3. Wait for the deployment to complete (should take 2-5 minutes)

## 🧪 Step 7: Test Deployment

Once deployed:
1. Visit your deployment URL
2. Test the public pages (/, /speisekarte, /standort, etc.)
3. Try to access the CMS at `/cms`
4. Log in with your Supabase credentials

## 🐛 Troubleshooting

### Common Issues

#### 1. Build Fails with "supabaseUrl is required"
**Solution**: Ensure all Supabase environment variables are correctly set in Coolify.

#### 2. Deployment Stuck on "Building..."
**Solution**: 
- Check if you have enough resources (memory/CPU)
- Increase memory limit to 4GB
- Check build logs for specific errors

#### 3. CMS Pages Show Mock Data
**Solution**: This is expected if Supabase variables are not set. Add the required environment variables.

#### 4. 500 Error on Page Load
**Solution**: 
- Check if the application started properly
- Verify port configuration (should be 3000)
- Check logs for runtime errors

### Debug Mode
To enable debug logging:
1. Add environment variable: `DEBUG=true`
2. Redeploy
3. Check logs for detailed error messages

## 📊 Monitoring

### Health Check
The application provides a health check endpoint:
```
GET /api/health
```

Configure this in Coolify:
- **Path**: `/api/health`
- **Interval**: 30 seconds
- **Timeout**: 10 seconds

### Logs
- View real-time logs in Coolify dashboard
- Download logs for analysis
- Set up log retention policy

## 🔄 Updates

### Manual Update
1. Make changes to your code
2. Push to GitHub
3. In Coolify, click **Redeploy**

### Auto-Update
If auto-deploy is enabled, changes will be automatically deployed on push.

## 🚨 Rollback

If deployment fails:
1. Go to **Deployments** in Coolify
2. Find the previous successful deployment
3. Click **Redeploy** on that version

## 💡 Optimization Tips

### Caching
- Enable caching for static assets
- Set cache headers for better performance
- Use CDN for static files

### Performance
- Use Node.js 20 LTS for best compatibility
- Allocate at least 2GB RAM
- Consider using 2 vCPUs for faster builds

### Security
- Always use HTTPS
- Enable security headers
- Regularly rotate Supabase keys
- Use environment variable secrets

## 📞 Support

For issues with:
- **Coolify**: Check [Coolify Documentation](https://coolify.io/docs)
- **Supabase**: Check [Supabase Documentation](https://supabase.com/docs)
- **Next.js**: Check [Next.js Documentation](https://nextjs.org/docs)

## 📝 Deployment Checklist

- [ ] GitHub repository connected
- [ ] Build settings configured
- [ ] Environment variables added
- [ ] Domain configured (if applicable)
- [ ] SSL certificate enabled
- [ ] Auto-deployment configured
- [ ] Notifications set up
- [ ] Health check configured
- [ ] First deployment completed
- [ ] Application tested

---

**Last Updated**: July 7, 2026  
**Version**: 1.0.0  
**Application**: Taverna Zeus CMS

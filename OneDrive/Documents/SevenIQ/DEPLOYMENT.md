# Deployment Guide - SevenIQ

This guide will walk you through deploying your SevenIQ application to Vercel, including all necessary configurations and environment setup.

## 🚀 Prerequisites

Before deploying, ensure you have:

- [ ] A GitHub repository with your SevenIQ code
- [ ] A Vercel account (free tier available)
- [ ] All environment variables configured
- [ ] Database and services (Supabase, Stripe, OpenAI) set up

## 📋 Pre-Deployment Checklist

### 1. Environment Variables
Ensure you have all required environment variables ready:

```env
# OpenAI Configuration
OPENAI_API_KEY=sk-...

# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://...
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...

# Stripe Configuration
STRIPE_SECRET_KEY=sk_live_... or sk_test_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_... or pk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
STRIPE_PRICE_ID=price_...

# App Configuration
NEXT_PUBLIC_APP_URL=https://your-domain.vercel.app
```

### 2. Database Setup
- Run the SQL commands from `database-schema.sql` in your Supabase project
- Ensure Row Level Security (RLS) is properly configured
- Test database connections

### 3. Stripe Webhook Configuration
- Set webhook endpoint to: `https://your-domain.vercel.app/api/stripe/webhook`
- Configure events: `checkout.session.completed`, `customer.subscription.*`, `invoice.payment_failed`
- Copy the webhook signing secret

## 🚀 Vercel Deployment

### Step 1: Connect Repository

1. **Go to [Vercel Dashboard](https://vercel.com/dashboard)**
2. **Click "New Project"**
3. **Import your GitHub repository**
4. **Select the repository containing your SevenIQ code**

### Step 2: Configure Project

1. **Project Name**: Choose a name (e.g., "seveniq-app")
2. **Framework Preset**: Next.js (should auto-detect)
3. **Root Directory**: Leave as `./` (or specify if different)
4. **Build Command**: `npm run build` (default)
5. **Output Directory**: `.next` (default)
6. **Install Command**: `npm install` (default)

### Step 3: Environment Variables

1. **Click "Environment Variables"**
2. **Add each environment variable**:

```bash
# Add these one by one
OPENAI_API_KEY=your_openai_api_key
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
STRIPE_SECRET_KEY=your_stripe_secret_key
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
STRIPE_WEBHOOK_SECRET=your_stripe_webhook_secret
STRIPE_PRICE_ID=your_stripe_price_id
NEXT_PUBLIC_APP_URL=https://your-domain.vercel.app
```

3. **Set Environment**: Select "Production" for all variables
4. **Click "Save"**

### Step 4: Deploy

1. **Click "Deploy"**
2. **Wait for build to complete** (usually 2-5 minutes)
3. **Check for any build errors** in the logs

## 🔧 Post-Deployment Configuration

### 1. Update Stripe Webhook URL

After deployment, update your Stripe webhook endpoint:

1. **Go to Stripe Dashboard > Webhooks**
2. **Update the endpoint URL** to your new Vercel domain
3. **Test the webhook** to ensure it's working

### 2. Update App URL

1. **Go to Vercel Dashboard > Your Project > Settings > Environment Variables**
2. **Update `NEXT_PUBLIC_APP_URL`** to your actual Vercel domain
3. **Redeploy** if necessary

### 3. Test the Application

1. **Visit your deployed URL**
2. **Test user registration and login**
3. **Test AI explanation generation**
4. **Test premium upgrade flow**
5. **Verify webhook functionality**

## 🔒 Security Considerations

### 1. Environment Variables
- ✅ All sensitive keys are in environment variables
- ✅ No hardcoded secrets in the code
- ✅ Service role keys are server-side only

### 2. API Security
- ✅ JWT validation on all protected routes
- ✅ Stripe webhook signature verification
- ✅ Input validation and sanitization

### 3. Database Security
- ✅ Row Level Security (RLS) enabled
- ✅ Proper user isolation
- ✅ No direct database access from client

## 📱 Performance Optimization

### 1. Vercel Features
- **Edge Functions**: Automatically optimized
- **CDN**: Global content delivery
- **Image Optimization**: Built-in Next.js support
- **Automatic HTTPS**: SSL certificates included

### 2. Next.js Optimizations
- **Static Generation**: Landing page is statically generated
- **Code Splitting**: Automatic bundle optimization
- **Image Optimization**: WebP format with responsive sizes

## 🚨 Troubleshooting

### Common Issues

#### 1. Build Failures
```bash
# Check build logs in Vercel dashboard
# Common causes:
# - Missing environment variables
# - TypeScript errors
# - Missing dependencies
```

#### 2. Environment Variable Issues
```bash
# Ensure all variables are set in Vercel dashboard
# Check for typos in variable names
# Verify variable values are correct
```

#### 3. Database Connection Issues
```bash
# Verify Supabase URL and keys
# Check database permissions
# Ensure RLS policies are correct
```

#### 4. Stripe Webhook Issues
```bash
# Verify webhook endpoint URL
# Check webhook signing secret
# Test webhook in Stripe dashboard
```

### Debug Steps

1. **Check Vercel Function Logs**
   - Go to Vercel Dashboard > Your Project > Functions
   - Check for any error logs

2. **Test API Endpoints**
   - Use tools like Postman or curl
   - Test with and without authentication

3. **Verify Environment Variables**
   - Check Vercel dashboard
   - Ensure all variables are set correctly

## 🔄 Continuous Deployment

### Automatic Deployments

1. **Push to main branch** triggers automatic deployment
2. **Preview deployments** for pull requests
3. **Rollback** to previous versions if needed

### Manual Deployments

1. **Go to Vercel Dashboard > Your Project**
2. **Click "Deploy" > "Redeploy"**
3. **Select specific commit** if needed

## 📊 Monitoring

### Vercel Analytics

1. **Performance metrics** automatically collected
2. **Error tracking** and reporting
3. **Real-time monitoring** of your application

### External Monitoring

Consider setting up:
- **Uptime monitoring** (e.g., UptimeRobot)
- **Error tracking** (e.g., Sentry)
- **Performance monitoring** (e.g., New Relic)

## 🎯 Next Steps

After successful deployment:

1. **Set up custom domain** (optional)
2. **Configure monitoring and alerts**
3. **Set up staging environment**
4. **Implement CI/CD pipeline**
5. **Add performance monitoring**

## 📞 Support

If you encounter deployment issues:

1. **Check Vercel documentation**
2. **Review build logs** for specific errors
3. **Contact Vercel support** if needed
4. **Check GitHub issues** for similar problems

---

**Happy Deploying! 🚀**

Your SevenIQ application should now be live and accessible to users worldwide through Vercel's global CDN.

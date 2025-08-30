# SevenIQ Deployment & Production Readiness Guide

## 🚀 Vercel Deployment

### 1. Project Setup
```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Initialize project (if not already done)
vercel
```

### 2. Environment Variables
Set these in your Vercel project dashboard:

#### Site Configuration
```
NEXT_PUBLIC_SITE_URL=https://yourdomain.com
```

#### Supabase Configuration
```
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

#### Stripe Configuration
```
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
NEXT_PUBLIC_STRIPE_PRO_MONTHLY_PRICE_ID=price_...
NEXT_PUBLIC_STRIPE_PRO_YEARLY_PRICE_ID=price_...
STRIPE_PORTAL_RETURN_URL=https://yourdomain.com/billing
```

#### Analytics & Monitoring
```
NEXT_PUBLIC_POSTHOG_KEY=your_posthog_key
# OR
NEXT_PUBLIC_PLAUSIBLE_DOMAIN=yourdomain.com

SENTRY_DSN=https://your_sentry_dsn
```

#### OpenAI Configuration
```
OPENAI_API_KEY=sk-...
```

### 3. Production & Preview Environments
- **Production**: `main` branch → `yourdomain.com`
- **Preview**: All other branches → `branch-name-git-hash.vercel.app`

### 4. Domain Configuration
1. Add custom domain in Vercel dashboard
2. Configure DNS records (A record pointing to Vercel)
3. Enable SSL (automatic with Vercel)

## 💳 Stripe Production Setup

### 1. Create Products & Prices
```bash
# Switch to production mode
stripe login

# Create product
stripe products create --name "SevenIQ Pro" --description "Unlimited AI explanations"

# Create monthly price
stripe prices create \
  --product=prod_... \
  --unit-amount=1999 \
  --currency=usd \
  --recurring-interval=month

# Create yearly price
stripe prices create \
  --product=prod_... \
  --unit-amount=19999 \
  --currency=usd \
  --recurring-interval=year
```

### 2. Configure Webhooks
```bash
# Create webhook endpoint
stripe webhook-endpoints create \
  --url=https://yourdomain.com/api/webhooks/stripe \
  --events=customer.subscription.created,customer.subscription.updated,customer.subscription.deleted

# Get webhook signing secret
stripe webhook-endpoints list
```

### 3. Test Webhooks Locally
```bash
# Install Stripe CLI
# Download from: https://stripe.com/docs/stripe-cli

# Forward webhooks to local development
stripe listen --forward-to localhost:3000/api/webhooks/stripe

# Test webhook events
stripe trigger customer.subscription.created
```

### 4. Update Environment Variables
Replace test keys with production keys in Vercel:
```
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_...
STRIPE_SECRET_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...
```

## 🗄️ Supabase Production Setup

### 1. Database Migration
```bash
# Apply the database schema
psql "postgresql://postgres:[password]@db.[project-ref].supabase.co:5432/postgres" -f database-schema.sql
```

### 2. RLS Policies Verification
Ensure these policies are active:
```sql
-- Profiles table
CREATE POLICY "Users can view own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

-- Usage table
CREATE POLICY "Users can view own usage" ON usage
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own usage" ON usage
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own usage" ON usage
  FOR UPDATE USING (auth.uid() = user_id);
```

### 3. Service Role Usage
- **Client-side**: Only use `anon` key
- **Server-side/Webhooks**: Use `service_role` key
- **Never expose service role key in client code**

### 4. Environment Variables
Update Vercel with production Supabase credentials:
```
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_production_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_production_service_role_key
```

## 🔍 SEO & Content Optimization

### 1. Sitemap Generation
Create `public/sitemap.xml`:
```xml
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://yourdomain.com</loc>
    <lastmod>2024-01-01</lastmod>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>https://yourdomain.com/pricing</loc>
    <lastmod>2024-01-01</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>https://yourdomain.com/dashboard</loc>
    <lastmod>2024-01-01</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.6</priority>
  </url>
</urlset>
```

### 2. Robots.txt
Create `public/robots.txt`:
```txt
User-agent: *
Allow: /

Sitemap: https://yourdomain.com/sitemap.xml
```

### 3. OpenGraph Images
- Create `public/og-image.png` (1200x630px)
- Update metadata in layout.tsx
- Test with Facebook Sharing Debugger

## 📊 Analytics & Monitoring

### 1. Sentry Setup
```bash
# Install Sentry CLI
npm install --save-dev @sentry/cli

# Initialize Sentry
npx @sentry/cli init
```

Update `sentry.client.config.js`:
```javascript
import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  environment: process.env.NODE_ENV,
  tracesSampleRate: 1.0,
});
```

### 2. Analytics Events
Ensure these events fire correctly:
- Page views
- User signup/login
- Explainer runs
- Upgrade clicks
- Stripe conversions

### 3. Performance Monitoring
- Set up Core Web Vitals tracking
- Monitor API response times
- Track error rates

## 🧪 Pre-Deployment Testing

### 1. Run All Tests
```bash
# Unit tests
npm run test
npm run test:coverage

# E2E tests
npm run test:e2e
npm run test:e2e:ui
```

### 2. Lighthouse Audit
```bash
# Install Lighthouse CLI
npm install -g lighthouse

# Run audits
lighthouse https://yourdomain.com --output html --output-path ./lighthouse-report.html
lighthouse https://yourdomain.com/pricing --output html --output-path ./lighthouse-pricing.html
```

### 3. Cross-Browser Testing
- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## 🚀 Deployment Commands

### 1. Deploy to Production
```bash
# Deploy main branch to production
git push origin main

# Or manually deploy
vercel --prod
```

### 2. Deploy Preview
```bash
# Deploy feature branch
git push origin feature-branch

# Or manually deploy
vercel
```

### 3. Rollback if Needed
```bash
# List deployments
vercel ls

# Rollback to previous deployment
vercel rollback [deployment-url]
```

## 🔒 Security Checklist

- [ ] Environment variables are secure
- [ ] API routes are protected
- [ ] CORS is configured correctly
- [ ] Rate limiting is in place
- [ ] Input validation is enforced
- [ ] SQL injection protection active
- [ ] XSS protection enabled
- [ ] HTTPS enforced

## 📈 Post-Deployment Monitoring

### 1. Health Checks
- Monitor `/api/health` endpoint
- Check database connectivity
- Verify external service status

### 2. Performance Metrics
- Core Web Vitals
- API response times
- Error rates
- User engagement

### 3. Business Metrics
- User signups
- Conversion rates
- Stripe webhook success rate
- Customer support tickets

## 🆘 Troubleshooting

### Common Issues
1. **Environment variables not loading**: Check Vercel dashboard
2. **Stripe webhooks failing**: Verify webhook secret and endpoint URL
3. **Database connection errors**: Check Supabase credentials and RLS policies
4. **Build failures**: Review build logs and dependencies

### Support Resources
- Vercel documentation: https://vercel.com/docs
- Stripe documentation: https://stripe.com/docs
- Supabase documentation: https://supabase.com/docs
- Next.js documentation: https://nextjs.org/docs

---

**Deployment Status:** 🟡 Ready for Review  
**Last Updated:** January 2024  
**Next Review:** After QA completion

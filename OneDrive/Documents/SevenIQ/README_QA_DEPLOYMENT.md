# SevenIQ - QA, Testing & Deployment Guide

## 🚀 Quick Start

### 1. Start Development Server
```bash
# Windows
start-server.bat

# PowerShell
start-server.ps1

# Manual
npm run dev
```

### 2. Run Complete Test Suite
```bash
# Windows
scripts\run-tests.bat

# Linux/Mac
./scripts/run-tests.sh

# Manual
npm run test:coverage    # Unit tests with coverage
npm run test:e2e         # E2E tests
npm run lint             # Code quality
```

### 3. Deploy to Production
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod
```

---

## 🧪 Testing Infrastructure

### Unit Tests (Vitest)
- **Framework**: Vitest + React Testing Library
- **Coverage**: Target ≥80%
- **Location**: `tests/unit/`

**Key Test Areas:**
- `run-explainer.test.ts` - Gating logic and validation
- `stripe-webhooks.test.ts` - Subscription event handling
- `usage.test.ts` - Run count tracking and incrementing

### E2E Tests (Playwright)
- **Framework**: Playwright
- **Browsers**: Chrome, Firefox, Safari, Edge
- **Viewports**: 360px, 768px, 1280px
- **Location**: `tests/e2e/`

**Test Suites:**
- `auth-flow.spec.ts` - Authentication and session management
- `gating-flow.spec.ts` - Free tier limits and upgrade prompts
- `pricing-flow.spec.ts` - Stripe checkout and billing
- `responsive-snapshots.spec.ts` - Cross-device compatibility

### Test Commands
```bash
# Unit tests
npm run test              # Run tests
npm run test:ui           # Run with UI
npm run test:coverage     # Run with coverage report

# E2E tests
npm run test:e2e          # Run all E2E tests
npm run test:e2e:ui       # Run with Playwright UI
npm run test:e2e:debug    # Run in debug mode
```

---

## 📋 QA Checklist

### Manual QA Requirements
Complete `QA_CHECKLIST.md` before deployment:

**Critical Blockers:**
- ✅ Authentication flow works
- ✅ Explainer functionality validated
- ✅ Gating system enforced
- ✅ Stripe integration tested

**Quality Gates:**
- ✅ Dark/light theme parity
- ✅ Accessibility requirements met
- ✅ Responsive design verified
- ✅ Performance benchmarks achieved

### Automated QA
```bash
# Run complete QA suite
./scripts/run-tests.sh

# Check results
open test-results/test-summary.md
open coverage/index.html
open playwright-report/index.html
```

---

## 🌐 Deployment Process

### Pre-Deployment Checklist
1. **Tests Passing**: All unit and E2E tests pass
2. **QA Complete**: Manual checklist completed
3. **Performance**: Lighthouse scores ≥90
4. **Security**: No vulnerabilities detected
5. **Environment**: All variables configured

### Vercel Deployment
```bash
# 1. Set environment variables in Vercel dashboard
# 2. Configure custom domain
# 3. Deploy main branch
vercel --prod

# 4. Verify deployment
vercel ls
```

### Environment Variables Required
```bash
# Site Configuration
NEXT_PUBLIC_SITE_URL=https://yourdomain.com

# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# Stripe
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_...
STRIPE_SECRET_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...
NEXT_PUBLIC_STRIPE_PRO_MONTHLY_PRICE_ID=price_...
NEXT_PUBLIC_STRIPE_PRO_YEARLY_PRICE_ID=price_...

# Analytics & Monitoring
SENTRY_DSN=your_sentry_dsn
NEXT_PUBLIC_POSTHOG_KEY=your_posthog_key
```

---

## 🔧 Configuration Files

### Test Configuration
- `vitest.config.ts` - Unit test setup
- `playwright.config.ts` - E2E test configuration
- `tests/setup.ts` - Test environment setup

### Deployment Configuration
- `next.config.js` - Next.js configuration
- `tailwind.config.js` - CSS framework setup
- `tsconfig.json` - TypeScript configuration

### SEO & Performance
- `public/sitemap.xml` - Search engine sitemap
- `public/robots.txt` - Search engine directives
- `public/og-image.png` - Social media sharing image

---

## 📊 Monitoring & Analytics

### Performance Monitoring
- **Lighthouse**: Performance, Best Practices, SEO
- **Core Web Vitals**: LCP, FID, CLS
- **Bundle Analysis**: Next.js bundle analyzer

### Error Tracking
- **Sentry**: Error monitoring and alerting
- **Console Logging**: Development debugging
- **User Feedback**: Error reporting system

### Analytics Events
- User signup/login
- Explainer runs
- Upgrade conversions
- Page views and engagement

---

## 🚨 Troubleshooting

### Common Issues

**Tests Failing:**
```bash
# Clear test cache
npm run test -- --clearCache

# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install
```

**Build Errors:**
```bash
# Check TypeScript errors
npx tsc --noEmit

# Verify environment variables
echo $NEXT_PUBLIC_SUPABASE_URL
```

**Deployment Issues:**
```bash
# Check Vercel logs
vercel logs

# Rollback if needed
vercel rollback [deployment-url]
```

### Support Resources
- **Documentation**: `DEPLOYMENT_GUIDE.md`
- **QA Checklist**: `QA_CHECKLIST.md`
- **Acceptance Criteria**: `ACCEPTANCE_CRITERIA.md`
- **Test Results**: `test-results/` directory

---

## 📈 Post-Deployment

### Health Checks
- Monitor `/api/health` endpoint
- Check external service status
- Verify analytics tracking

### Performance Monitoring
- Track Core Web Vitals
- Monitor API response times
- Check error rates

### User Feedback
- Monitor support tickets
- Track conversion rates
- Analyze user behavior

---

## 🎯 Success Metrics

### Technical Metrics
- **Test Coverage**: ≥80%
- **Lighthouse Scores**: ≥90
- **Error Rate**: <1%
- **Uptime**: ≥99.9%

### Business Metrics
- **User Signups**: Track growth
- **Conversion Rate**: Free to Pro
- **Customer Satisfaction**: Support feedback
- **Revenue**: Stripe analytics

---

## 📞 Contact & Support

### Development Team
- **Lead Developer**: [Your Name]
- **QA Engineer**: [QA Contact]
- **DevOps**: [DevOps Contact]

### External Services
- **Vercel**: Deployment platform
- **Stripe**: Payment processing
- **Supabase**: Database and auth
- **Sentry**: Error monitoring

---

## 📚 Additional Resources

### Documentation
- [Next.js Documentation](https://nextjs.org/docs)
- [Vercel Deployment Guide](https://vercel.com/docs)
- [Stripe Integration](https://stripe.com/docs)
- [Supabase Setup](https://supabase.com/docs)

### Testing Resources
- [Vitest Documentation](https://vitest.dev/)
- [Playwright Testing](https://playwright.dev/)
- [React Testing Library](https://testing-library.com/)

### Deployment Resources
- [Vercel CLI](https://vercel.com/docs/cli)
- [Stripe CLI](https://stripe.com/docs/stripe-cli)
- [Lighthouse CLI](https://github.com/GoogleChrome/lighthouse)

---

**Last Updated:** January 2024  
**Version:** 1.0.0  
**Status:** 🟡 Ready for QA Review

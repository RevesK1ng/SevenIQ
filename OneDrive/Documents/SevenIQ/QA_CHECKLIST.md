# SevenIQ Manual QA Checklist

## 🚨 BLOCKERS - If any of these fail, deployment is blocked

### Authentication
- [ ] Sign in via email/magic link works
- [ ] Profile row is created in database after signup
- [ ] Session is stable across page refresh
- [ ] Session persists across route changes
- [ ] Sign out clears session completely

### Explainer Core Functionality
- [ ] Modes switch instantly between Simple/Detailed/Technical
- [ ] Validation prevents empty input submission
- [ ] Validation prevents oversized input (>10,000 chars)
- [ ] Loader state is visible during processing
- [ ] Error states are clearly displayed
- [ ] Results are formatted correctly

### Gating System
- [ ] Counter increments accurately after each run
- [ ] 4th attempt shows gating state
- [ ] Gating copy explains benefits clearly
- [ ] Upgrade CTA is prominent and visible
- [ ] Pro users bypass gating regardless of count

### Stripe Integration
- [ ] Test cards work (success/cancel scenarios)
- [ ] Success flips pro status within ≤5s post-webhook
- [ ] Canceled checkout returns gracefully to pricing
- [ ] Billing portal opens for pro users
- [ ] Portal changes reflect on /billing after refresh

## ✅ UI/UX Quality

### Dark/Light Theme
- [ ] Both themes render correctly
- [ ] Theme toggle works smoothly
- [ ] No color inconsistencies between themes
- [ ] Theme preference persists across sessions

### Accessibility
- [ ] Keyboard navigation works throughout
- [ ] Focus rings are visible on all interactive elements
- [ ] No keyboard traps exist
- [ ] Color contrast meets WCAG AA standards
- [ ] Screen reader compatibility

### Responsiveness
- [ ] Mobile (360px) - navigation and components usable
- [ ] Tablet (768px) - layout adapts appropriately
- [ ] Desktop (1280px) - full layout displays correctly
- [ ] No horizontal scrolling on any device
- [ ] Touch targets are appropriately sized

## 📱 Content & SEO

### Page Metadata
- [ ] All pages have unique titles
- [ ] Meta descriptions are present and unique
- [ ] OG tags render correctly
- [ ] Twitter card tags work
- [ ] Canonical URLs are set

### Footer & Legal
- [ ] Footer links to privacy policy
- [ ] Footer links to terms of service
- [ ] Footer links to refund policy
- [ ] Footer links to cookie policy
- [ ] All links are functional

## 🚀 Performance

### Lighthouse Scores (≥90 required)
- [ ] Home page - Performance
- [ ] Home page - Best Practices
- [ ] Home page - SEO
- [ ] App page - Performance
- [ ] App page - Best Practices
- [ ] App page - SEO
- [ ] Pricing page - Performance
- [ ] Pricing page - Best Practices
- [ ] Pricing page - SEO

### Core Web Vitals
- [ ] LCP < 2.5s
- [ ] FID < 100ms
- [ ] CLS < 0.1

## 🔍 Stability & Monitoring

### Error Handling
- [ ] No unhandled errors in Sentry
- [ ] 404 pages are user-friendly
- [ ] Network errors show appropriate messages
- [ ] Form validation errors are clear

### Analytics
- [ ] Key actions trigger analytics events
- [ ] Page views are tracked
- [ ] Conversion events fire correctly
- [ ] No duplicate events

## 🧪 Testing Status

### Unit Tests
- [ ] run-explainer logic tests pass
- [ ] Stripe webhook handler tests pass
- [ ] usage.getRunCount tests pass
- [ ] All tests pass with coverage >80%

### E2E Tests
- [ ] Auth flow tests pass
- [ ] Gating flow tests pass
- [ ] Pricing flow tests pass
- [ ] Responsive snapshot tests pass
- [ ] All tests pass across browsers

## 🌐 Deployment Readiness

### Environment Variables
- [ ] All required env vars are set in Vercel
- [ ] Stripe keys are configured
- [ ] Supabase credentials are set
- [ ] Analytics keys are configured
- [ ] Sentry DSN is active

### External Services
- [ ] Stripe webhook endpoint is configured
- [ ] Supabase database is migrated
- [ ] Domain is configured and SSL is active
- [ ] CDN is working correctly

## 📋 Final Acceptance Criteria

**GO/NO-GO Decision Points:**

1. **3-free-runs gating enforced server-side** ✅
2. **Stripe subscription reliably toggles pro status** ✅
3. **Four core pages complete and polished** ✅
4. **All tests pass** ✅
5. **Lighthouse budgets met** ✅
6. **Error/analytics pipelines functioning** ✅

## 🚀 Deployment Approval

- [ ] All blockers resolved
- [ ] Manual QA checklist completed
- [ ] Tests passing
- [ ] Performance benchmarks met
- [ ] Security review completed
- [ ] **DEPLOYMENT APPROVED** ✅

---

**QA Tester:** _________________  
**Date:** _________________  
**Notes:** _________________

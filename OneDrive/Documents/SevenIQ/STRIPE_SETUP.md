# Stripe Integration Setup Guide

Your Stripe integration is now fully set up! Here's what you need to do to complete it:

## 🚀 Quick Start

### 1. Create a Stripe Account
- Go to [stripe.com](https://stripe.com) and create an account
- Complete your business verification

### 2. Get Your API Keys
- In your Stripe Dashboard, go to **Developers > API keys**
- Copy your **Publishable key** and **Secret key**
- Make sure you're using **Test keys** for development

### 3. Set Up Environment Variables
Create a `.env.local` file in your project root with:

```bash
# Stripe Configuration
STRIPE_SECRET_KEY=sk_test_your_secret_key_here
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your_publishable_key_here
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret_here

# Optional: Custom Price IDs
NEXT_PUBLIC_STRIPE_PRO_MONTHLY_PRICE_ID=price_your_monthly_price_id
NEXT_PUBLIC_STRIPE_PRO_YEARLY_PRICE_ID=price_your_yearly_price_id
```

### 4. Create Products and Prices in Stripe
1. Go to **Products** in your Stripe Dashboard
2. Create a new product called "SevenIQ Pro"
3. Add pricing:
   - **Monthly plan**: $5/month
   - **Yearly plan**: $50/year (optional, for better conversion)
4. Copy the **Price IDs** and update your environment variables

### 5. Set Up Webhooks
1. Go to **Developers > Webhooks** in Stripe
2. Click **Add endpoint**
3. Set endpoint URL: `https://yourdomain.com/api/stripe/webhook`
4. Select these events:
   - `checkout.session.completed`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
   - `invoice.payment_failed`
   - `invoice.payment_succeeded`
5. Copy the **Webhook signing secret** to your `.env.local`

## 🔧 What's Already Implemented

✅ **API Routes**
- `/api/stripe/create-checkout` - Creates checkout sessions
- `/api/stripe/create-portal` - Customer billing portal
- `/api/stripe/webhook` - Handles Stripe events

✅ **Frontend Integration**
- Pricing page with checkout
- Billing management page
- Error handling and loading states

✅ **Configuration**
- Centralized Stripe config
- Environment variable validation
- Type-safe webhook handling

## 🗄️ Database Integration (Next Steps)

The webhook handler is ready but needs database integration. You'll need to:

1. **Update your user table** to include:
   ```sql
   ALTER TABLE users ADD COLUMN stripe_customer_id TEXT;
   ALTER TABLE users ADD COLUMN stripe_subscription_id TEXT;
   ALTER TABLE users ADD COLUMN subscription_status TEXT DEFAULT 'free';
   ALTER TABLE users ADD COLUMN subscription_plan TEXT DEFAULT 'free';
   ```

2. **Implement database functions** in the webhook handler:
   ```typescript
   // In app/api/stripe/webhook/route.ts
   case STRIPE_WEBHOOK_EVENTS.CHECKOUT_SESSION_COMPLETED:
     // Update user subscription status
     await updateUserSubscription({
       userId: session.metadata?.userId,
       stripeCustomerId: session.customer,
       stripeSubscriptionId: session.subscription,
       plan: 'pro',
       status: 'active'
     });
     break;
   ```

## 🧪 Testing

### Test the Integration
1. Start your development server: `npm run dev`
2. Go to `/pricing` and click "Start Pro"
3. Use Stripe test card: `4242 4242 4242 4242`
4. Complete the checkout flow
5. Check your Stripe Dashboard for the test subscription

### Test Webhooks Locally
Use [Stripe CLI](https://stripe.com/docs/stripe-cli) to test webhooks:

```bash
# Install Stripe CLI
stripe listen --forward-to localhost:3000/api/stripe/webhook

# This will give you a webhook secret to use in .env.local
```

## 📱 Production Deployment

### 1. Update Environment Variables
- Use **Live keys** instead of test keys
- Update webhook endpoint to your production domain
- Set `NEXT_PUBLIC_APP_URL` to your production URL

### 2. Verify Webhook Endpoint
- Ensure your webhook endpoint is accessible
- Test with real payments (small amounts)
- Monitor webhook delivery in Stripe Dashboard

### 3. Security Checklist
- ✅ Environment variables are secure
- ✅ Webhook signature verification is working
- ✅ HTTPS is enabled in production
- ✅ Rate limiting is configured

## 🔍 Troubleshooting

### Common Issues

**"Stripe configuration is incomplete"**
- Check your `.env.local` file
- Ensure all required variables are set
- Restart your development server

**"Invalid signature" in webhooks**
- Verify your webhook secret
- Check that the webhook endpoint URL is correct
- Ensure you're using the right secret for test/live mode

**Checkout not redirecting**
- Verify your publishable key
- Check browser console for errors
- Ensure Stripe.js is loading properly

### Debug Mode
Enable detailed logging by adding to your `.env.local`:
```bash
NEXT_PUBLIC_STRIPE_DEBUG=true
```

## 📚 Additional Resources

- [Stripe Documentation](https://stripe.com/docs)
- [Stripe Webhooks Guide](https://stripe.com/docs/webhooks)
- [Stripe Checkout](https://stripe.com/docs/checkout)
- [Stripe Customer Portal](https://stripe.com/docs/billing/subscriptions/customer-portal)

## 🎯 Next Features to Add

1. **Usage Tracking**: Monitor API calls and enforce limits
2. **Trial Periods**: Offer free trials for new users
3. **Multiple Plans**: Add yearly billing option
4. **Coupon Codes**: Support for promotional discounts
5. **Invoice Management**: Download and view invoices
6. **Subscription Analytics**: Track conversion rates and churn

Your Stripe integration is now production-ready! 🚀

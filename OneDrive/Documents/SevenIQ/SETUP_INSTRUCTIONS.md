# SevenIQ Setup Instructions

## Quick Start

1. **Copy environment template:**
   ```bash
   cp env.example .env.local
   ```

2. **Fill in your environment variables** (see sections below)

3. **Start the development server:**
   ```bash
   npm run dev
   ```

## Environment Variables Setup

### 1. Supabase Configuration (Required for Authentication)

Get these from [https://supabase.com/dashboard](https://supabase.com/dashboard):

```bash
# Go to your project → Settings → API
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here
```

**Setup Steps:**
1. Create a new Supabase project
2. Go to Settings → API
3. Copy the Project URL and anon public key
4. Copy the service_role key (for server-side operations)

### 2. Stripe Configuration (Required for Payments)

Get these from [https://dashboard.stripe.com/apikeys](https://dashboard.stripe.com/apikeys):

```bash
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your_key_here
STRIPE_SECRET_KEY=sk_test_your_key_here
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret_here
NEXT_PUBLIC_STRIPE_PRO_MONTHLY_PRICE_ID=price_your_monthly_price_id
NEXT_PUBLIC_STRIPE_PRO_YEARLY_PRICE_ID=price_your_yearly_price_id
```

**Setup Steps:**
1. Create a Stripe account
2. Go to Developers → API keys
3. Copy your publishable and secret keys
4. Create products and prices in Products section
5. Set up webhooks (see Stripe webhook setup below)

### 3. OpenAI Configuration (Required for AI Explanations)

Get this from [https://platform.openai.com/api-keys](https://platform.openai.com/api-keys):

```bash
OPENAI_API_KEY=sk-your-openai-api-key-here
```

### 4. Site Configuration

```bash
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

## Database Setup

1. **Run the database schema:**
   ```bash
   # Copy the contents of database-schema.sql to your Supabase SQL editor
   # Or use the Supabase dashboard to create tables manually
   ```

2. **Required tables:**
   - `users` - User accounts and premium status
   - `history` - User explanation history

## Stripe Webhook Setup

1. **Install Stripe CLI:**
   ```bash
   # macOS
   brew install stripe/stripe-cli/stripe
   
   # Windows
   # Download from https://github.com/stripe/stripe-cli/releases
   ```

2. **Login to Stripe:**
   ```bash
   stripe login
   ```

3. **Forward webhooks to your local server:**
   ```bash
   stripe listen --forward-to localhost:3000/api/webhooks/stripe
   ```

4. **Copy the webhook secret** and add it to your `.env.local`

## Development vs Production

### Development Mode
- Missing environment variables will show warnings in console
- App runs in "demo mode" with limited functionality
- Demo banner shows what features are missing

### Production Mode
- All required environment variables must be set
- App will fail to start if configuration is incomplete

## Troubleshooting

### "Supabase configuration is incomplete"
- Check that `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` are set
- Verify your Supabase project is active

### "Stripe configuration is incomplete"
- Check that `STRIPE_SECRET_KEY` and `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` are set
- Verify your Stripe account is active

### "OpenAI configuration is incomplete"
- Check that `OPENAI_API_KEY` is set
- Verify your OpenAI API key is valid and has credits

### Middleware errors
- Check browser console for specific error messages
- Verify all environment variables are loaded correctly
- Restart your development server after changing `.env.local`

## Testing

1. **Run unit tests:**
   ```bash
   npm test
   ```

2. **Run E2E tests:**
   ```bash
   npm run test:e2e
   ```

## Deployment

1. **Set environment variables** in your hosting platform
2. **Build the application:**
   ```bash
   npm run build
   ```
3. **Start the production server:**
   ```bash
   npm start
   ```

## Support

If you encounter issues:
1. Check the console for error messages
2. Verify all environment variables are set correctly
3. Check the demo banner for missing features
4. Review the setup steps above

For additional help, check the main README.md file.

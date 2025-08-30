@echo off
echo ========================================
echo SevenIQ Setup Script
echo ========================================
echo.

echo Installing dependencies...
npm install

echo.
echo Creating environment file...
if not exist .env.local (
    copy .env.example .env.local
    echo Created .env.local - please fill in your values
) else (
    echo .env.local already exists
)

echo.
echo Setting up database...
echo Please run the SQL from database-schema.sql in your Supabase SQL editor

echo.
echo Setting up Stripe...
echo 1. Create products and pricing plans in Stripe dashboard
echo 2. Set up webhook endpoints pointing to /api/webhooks/stripe
echo 3. Configure webhook events for subscription management

echo.
echo Setting up Supabase...
echo 1. Create a new Supabase project
echo 2. Enable authentication providers
echo 3. Set up Row Level Security (RLS)

echo.
echo ========================================
echo Setup Complete!
echo ========================================
echo.
echo Next steps:
echo 1. Fill in your .env.local file
echo 2. Set up your database in Supabase
echo 3. Configure Stripe products and webhooks
echo 4. Run 'npm run dev' to start development
echo.
echo For detailed instructions, see README.md
echo.
pause

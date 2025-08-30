// Environment configuration with fallbacks for development
export const config = {
  // Site Configuration
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000',
  
  // Supabase Configuration
  supabase: {
    url: process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co',
    anonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder_key',
    serviceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY || 'placeholder_service_key',
  },
  
  // Stripe Configuration
  stripe: {
    publishableKey: process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || 'pk_test_placeholder',
    secretKey: process.env.STRIPE_SECRET_KEY || 'sk_test_placeholder',
    webhookSecret: process.env.STRIPE_WEBHOOK_SECRET || 'whsec_placeholder',
    priceIds: {
      proMonthly: process.env.NEXT_PUBLIC_STRIPE_PRO_MONTHLY_PRICE_ID || 'price_pro_monthly_placeholder',
      proYearly: process.env.NEXT_PUBLIC_STRIPE_PRO_YEARLY_PRICE_ID || 'price_pro_yearly_placeholder',
    },
    portalReturnUrl: process.env.STRIPE_PORTAL_RETURN_URL || 'http://localhost:3000/billing',
  },
  
  // OpenAI Configuration
  openai: {
    apiKey: process.env.OPENAI_API_KEY || 'placeholder_openai_key',
  },
  
  // Feature Flags
  features: {
    enableStripe: process.env.NODE_ENV === 'production' || !!process.env.STRIPE_SECRET_KEY,
    enableSupabase: process.env.NODE_ENV === 'production' || !!process.env.NEXT_PUBLIC_SUPABASE_URL,
    enableOpenAI: process.env.NODE_ENV === 'production' || !!process.env.OPENAI_API_KEY,
  },
  
  // Environment
  isDevelopment: process.env.NODE_ENV === 'development',
  isProduction: process.env.NODE_ENV === 'production',
}

// Validation functions
export function validateConfig() {
  const warnings: string[] = []
  
  if (!config.features.enableSupabase) {
    warnings.push('Supabase is not configured - authentication will not work')
  }
  
  if (!config.features.enableStripe) {
    warnings.push('Stripe is not configured - payments will not work')
  }
  
  if (!config.features.enableOpenAI) {
    warnings.push('OpenAI is not configured - AI explanations will not work')
  }
  
  if (warnings.length > 0) {
    console.warn('Configuration warnings:', warnings)
  }
  
  return warnings.length === 0
}

# SevenIQ Portfolio Demo Mode

## 🎯 Overview
This is a portfolio showcase of SevenIQ, an AI-powered explanation platform. The application is currently running in **Demo Mode** where all features are simulated for demonstration purposes.

## 🚀 What's Working (Demo Mode)

### ✅ Authentication
- **Sign In/Sign Up**: Fully functional with simulated authentication
- **Magic Link**: Simulated email verification
- **User Sessions**: Mock user management
- **Any email/password combination will work**

### ✅ AI Explanations
- **Multiple Modes**: Child, Grandma, CEO, and Technical modes
- **Text Input**: Accepts any text input
- **URL Processing**: Can process URLs (simulated)
- **Mock Responses**: Generates realistic-looking explanations

### ✅ User Interface
- **Responsive Design**: Works on all devices
- **Theme Toggle**: Light/dark mode switching
- **Navigation**: Complete navigation system
- **Forms**: All forms are functional

### ✅ Portfolio Features
- **Modern UI/UX**: Professional design with animations
- **Component Library**: Reusable React components
- **TypeScript**: Full type safety
- **Tailwind CSS**: Modern styling system

## ⚠️ What's NOT Configured (Demo Mode)

### ❌ AI Integration
- **OpenAI API**: Not configured
- **Real AI Responses**: Using simulated explanations
- **Model Training**: No custom models

### ❌ Database
- **Supabase**: Not configured
- **User Storage**: No persistent user data
- **History**: Explanations are not saved

### ❌ Payments
- **Stripe**: Not configured
- **Subscriptions**: No real billing
- **Usage Limits**: No enforcement

### ❌ Email Services
- **SMTP**: Not configured
- **Magic Links**: Simulated only
- **Notifications**: No real emails sent

## 🔧 Production Setup Requirements

To make this a production application, you would need to configure:

### 1. Environment Variables
```bash
# Supabase (Database & Auth)
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# OpenAI (AI Explanations)
OPENAI_API_KEY=your_openai_api_key

# Stripe (Payments)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
STRIPE_SECRET_KEY=your_stripe_secret_key
STRIPE_WEBHOOK_SECRET=your_webhook_secret
```

### 2. Database Setup
- Create Supabase project
- Run database migrations
- Set up authentication policies

### 3. AI Service
- Configure OpenAI API
- Set up usage monitoring
- Implement rate limiting

### 4. Payment Processing
- Set up Stripe account
- Configure webhooks
- Implement subscription logic

## 🎨 Portfolio Showcase Features

This demo demonstrates:

- **Modern React Architecture**: Next.js 14 with App Router
- **Type Safety**: Full TypeScript implementation
- **Component Design**: Reusable, accessible components
- **State Management**: Context-based state management
- **Responsive Design**: Mobile-first approach
- **Performance**: Optimized with Framer Motion
- **Accessibility**: WCAG compliant components
- **Testing**: Vitest and Playwright setup

## 🚀 Running the Demo

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Start Development Server**
   ```bash
   npm run dev
   ```

3. **Open Browser**
   - Navigate to `http://localhost:3000`
   - Try the demo with any email/password
   - Test all explanation modes

## 📱 Demo User Flow

1. **Landing Page**: Marketing site with feature overview
2. **Sign Up/In**: Any credentials work (demo mode)
3. **Main App**: AI explanation interface
4. **Explanation Modes**: Test different styles
5. **Responsive Design**: Test on mobile/desktop

## 🎯 Portfolio Value

This demo showcases:

- **Full-Stack Development**: Frontend, backend, and API design
- **Modern Technologies**: Next.js, React, TypeScript, Tailwind
- **User Experience**: Intuitive, accessible interface design
- **System Architecture**: Scalable, maintainable code structure
- **Production Readiness**: Code quality and best practices
- **Problem Solving**: Complex feature implementation

## 📞 Contact

This is a portfolio project by [Your Name]. The code demonstrates professional development skills and modern web application architecture.

---

**Note**: This application is designed as a portfolio showcase. All features are simulated and no real services are integrated. For production use, proper configuration of external services would be required.

# SevenIQ - AI-Powered Explanations Platform

A comprehensive, production-ready platform that transforms complex topics into crystal-clear explanations using AI. Built with Next.js 14, TypeScript, and modern web technologies.

## 🚀 Features

### Core Functionality
- **AI-Powered Explanations**: Transform complex topics into simple, understandable explanations
- **User Authentication**: Secure user management with Supabase Auth
- **Subscription Management**: Integrated Stripe billing with multiple plan tiers
- **Usage Tracking**: Monitor and limit user API usage
- **Responsive Design**: Mobile-first design with dark/light mode support

### Advanced Features
- **Error Handling**: Comprehensive error boundaries and error logging
- **Performance Monitoring**: Real-time performance metrics and optimization
- **Security**: Advanced security middleware with rate limiting and input validation
- **Logging**: Structured logging system with multiple transport options
- **Testing**: Comprehensive test suite with unit, integration, and E2E tests
- **Accessibility**: WCAG 2.1 AA compliant with ARIA support
- **SEO Optimization**: Meta tags, structured data, and performance optimization

## 🏗️ Architecture

### Frontend
- **Next.js 14**: App Router with server components
- **React 18**: Concurrent features and hooks
- **TypeScript**: Full type safety
- **Tailwind CSS**: Utility-first CSS framework
- **Framer Motion**: Smooth animations and transitions

### Backend
- **API Routes**: RESTful API endpoints
- **Server Actions**: Form handling and data mutations
- **Middleware**: Authentication, security, and performance monitoring
- **Database**: Supabase with PostgreSQL
- **External APIs**: OpenAI GPT, Stripe, and more

### Infrastructure
- **Authentication**: Supabase Auth with social providers
- **Database**: PostgreSQL with real-time subscriptions
- **Storage**: Supabase Storage for file uploads
- **Payments**: Stripe integration for subscriptions
- **AI Services**: OpenAI API integration
- **Monitoring**: Performance and error tracking

## 📁 Project Structure

```
seveniq/
├── app/                          # Next.js App Router
│   ├── (marketing)/             # Marketing pages
│   ├── api/                     # API routes
│   ├── auth/                    # Authentication pages
│   ├── billing/                 # Billing management
│   ├── dashboard/               # User dashboard
│   ├── demo/                    # Demo page
│   ├── help/                    # Help and support
│   └── settings/                # User settings
├── components/                   # Reusable components
│   ├── hooks/                   # Custom React hooks
│   ├── ui/                      # UI components
│   └── ...                      # Feature components
├── lib/                         # Utility libraries
├── tests/                       # Test files
│   ├── unit/                    # Unit tests
│   ├── integration/             # Integration tests
│   ├── e2e/                     # End-to-end tests
│   └── setup/                   # Test configuration
├── scripts/                     # Build and deployment scripts
├── public/                      # Static assets
└── types/                       # TypeScript type definitions
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Supabase account
- Stripe account
- OpenAI API key

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/seveniq.git
   cd seveniq
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp env.example .env.local
   ```
   
   Fill in your environment variables:
   ```env
   # Supabase
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
   
   # Stripe
   STRIPE_SECRET_KEY=your_stripe_secret_key
   STRIPE_WEBHOOK_SECRET=your_webhook_secret
   NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your_publishable_key
   
   # OpenAI
   OPENAI_API_KEY=your_openai_api_key
   
   # App
   NEXT_PUBLIC_SITE_URL=http://localhost:3000
   ```

4. **Set up the database**
   ```bash
   # Run the database schema
   psql -h your_host -U your_user -d your_db -f database-schema.sql
   ```

5. **Start the development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🧪 Testing

### Running Tests

```bash
# Run all tests
npm run test:all

# Run specific test types
npm run test:unit          # Unit tests only
npm run test:integration   # Integration tests only
npm run test:e2e          # End-to-end tests only

# Run tests with coverage
npm run test:coverage

# Run tests in watch mode
npm run test:watch

# Run tests with UI
npm run test:ui

# Run tests for CI
npm run test:ci
```

### Test Structure
- **Unit Tests**: Component and utility function tests
- **Integration Tests**: API route and database interaction tests
- **E2E Tests**: Full user workflow tests with Playwright

### Test Coverage
- **Target**: 80%+ coverage across all metrics
- **Reports**: HTML coverage reports in `coverage/` directory
- **CI Integration**: Automated testing in deployment pipeline

## 🔧 Development

### Code Quality

```bash
# Lint code
npm run lint

# Type check
npm run type-check

# Format code (if using Prettier)
npm run format
```

### Development Workflow

1. **Create a feature branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make your changes**
   - Follow the coding standards
   - Write tests for new functionality
   - Update documentation

3. **Run tests**
   ```bash
   npm run test:all
   ```

4. **Submit a pull request**
   - Include tests and documentation
   - Describe the changes clearly
   - Link any related issues

### Component Development

```tsx
// Example component with proper error handling
import { ErrorBoundary } from '@/components/error-boundary'
import { useErrorHandler } from '@/components/error-handling'

export function MyComponent() {
  const { addError } = useErrorHandler()
  
  const handleAction = async () => {
    try {
      // Your logic here
    } catch (error) {
      addError(error as Error)
    }
  }
  
  return (
    <ErrorBoundary>
      {/* Your component content */}
    </ErrorBoundary>
  )
}
```

## 🚀 Deployment

### Production Build

```bash
# Build the application
npm run build

# Start production server
npm start
```

### Environment Configuration

```bash
# Production environment
NODE_ENV=production
NEXT_PUBLIC_SITE_URL=https://yourdomain.com
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
# ... other production variables
```

### Deployment Platforms

- **Vercel**: Recommended for Next.js applications
- **Netlify**: Alternative with good Next.js support
- **AWS**: For enterprise deployments
- **Docker**: Containerized deployment

## 📊 Monitoring & Analytics

### Performance Monitoring

```typescript
import { performanceMonitor } from '@/lib/performance-monitor'

// Track custom metrics
performanceMonitor.recordMetric('custom_operation', duration)

// Get performance reports
const report = performanceMonitor.generateReport()
```

### Error Tracking

```typescript
import { errorLogger } from '@/components/error-handling'

// Log errors with context
errorLogger.logError(error, { 
  context: 'user_action',
  userId: 'user123' 
})
```

### Logging

```typescript
import { logger } from '@/lib/logging'

// Different log levels
await logger.info('User logged in', { userId: 'user123' })
await logger.warn('Rate limit approaching', { ip: '192.168.1.1' })
await logger.error('Database connection failed', { error: dbError })
```

## 🔒 Security Features

### Security Middleware

```typescript
import { securityMiddleware } from '@/lib/security-middleware'

// Apply security headers
const response = securityMiddleware.addSecurityHeaders(nextResponse)

// Validate and sanitize input
const validation = securityMiddleware.validateAndSanitizeInput(
  userInput,
  {
    type: 'text',
    required: true,
    maxLength: 1000,
    checkXSS: true,
    checkSQLInjection: true
  }
)
```

### Rate Limiting

- **API Routes**: Configurable rate limits per endpoint
- **User Actions**: Per-user rate limiting
- **IP-based**: Protection against abuse

### Input Validation

- **XSS Prevention**: Sanitize user input
- **SQL Injection**: Pattern detection and blocking
- **Path Traversal**: Secure file access

## 🎨 UI/UX Features

### Theme System

```typescript
import { useTheme } from '@/components/theme-provider'

export function ThemeToggle() {
  const { theme, setTheme } = useTheme()
  
  return (
    <button onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}>
      Toggle Theme
    </button>
  )
}
```

### Responsive Design

```typescript
import { useBreakpoint } from '@/components/hooks/use-media-query'

export function ResponsiveComponent() {
  const { isMobile, isTablet, isDesktop } = useBreakpoint()
  
  if (isMobile) return <MobileView />
  if (isTablet) return <TabletView />
  return <DesktopView />
}
```

### Accessibility

```typescript
import { SkipToMainContent, useFocusTrap } from '@/components/accessibility'

export function Modal({ children, isOpen, onClose }) {
  const { ref: focusTrapRef } = useFocusTrap(isOpen)
  
  return (
    <>
      <SkipToMainContent />
      <div ref={focusTrapRef}>
        {children}
      </div>
    </>
  )
}
```

## 📱 Mobile Features

### Touch Interactions

```typescript
import { Swipeable } from '@/components/mobile-responsive'

export function SwipeableCard() {
  return (
    <Swipeable
      onSwipeLeft={() => handleSwipeLeft()}
      onSwipeRight={() => handleSwipeRight()}
    >
      <Card />
    </Swipeable>
  )
}
```

### Mobile Optimization

```typescript
import { MobileOptimizedButton } from '@/components/mobile-responsive'

export function ActionButton() {
  return (
    <MobileOptimizedButton
      size="lg"
      minSize="md"
      onClick={handleClick}
    >
      Action
    </MobileOptimizedButton>
  )
}
```

## 🔧 Configuration

### Performance Settings

```typescript
// lib/performance-monitor.ts
performanceMonitor.addThreshold({
  name: 'api_response_time',
  warning: 1000,    // 1 second
  critical: 3000    // 3 seconds
})
```

### Security Settings

```typescript
// lib/security-middleware.ts
securityMiddleware.updateConfig({
  rateLimit: {
    enabled: true,
    maxRequests: 100,
    windowMs: 15 * 60 * 1000 // 15 minutes
  }
})
```

### Logging Configuration

```typescript
// lib/logging.ts
logger.updateConfig({
  level: LogLevel.INFO,
  enableRequestLogging: true,
  enablePerformanceLogging: true,
  enableErrorLogging: true,
  enableSecurityLogging: true
})
```

## 🚀 Performance Optimization

### Code Splitting

- **Dynamic Imports**: Lazy load components and libraries
- **Route-based**: Automatic code splitting by route
- **Component-based**: Selective component loading

### Caching Strategies

- **Static Generation**: Pre-render static pages
- **Incremental Static Regeneration**: Update static content
- **Edge Caching**: CDN-level caching

### Bundle Optimization

- **Tree Shaking**: Remove unused code
- **Minification**: Compress JavaScript and CSS
- **Image Optimization**: Next.js Image component

## 🔍 Troubleshooting

### Common Issues

1. **Build Errors**
   ```bash
   # Clear cache and reinstall
   rm -rf .next node_modules
   npm install
   npm run build
   ```

2. **Test Failures**
   ```bash
   # Clear test cache
   npm run test:clean
   # Run tests with verbose output
   npm run test:ci
   ```

3. **Performance Issues**
   ```bash
   # Check performance metrics
   npm run test:coverage
   # Analyze bundle size
   npm run build
   ```

### Debug Mode

```bash
# Enable debug logging
DEBUG=* npm run dev

# Run tests in debug mode
npm run test:debug
```

## 📚 API Reference

### Core Components

- **ErrorBoundary**: React error boundary with fallback UI
- **ThemeProvider**: Dark/light mode context provider
- **FormValidation**: Form validation with error handling
- **SEOHead**: Meta tags and SEO optimization
- **Accessibility**: ARIA labels and keyboard navigation

### Utility Libraries

- **PerformanceMonitor**: Performance tracking and reporting
- **SecurityMiddleware**: Security headers and input validation
- **Logger**: Structured logging with multiple transports
- **APIErrorHandler**: Consistent API error handling

### Hooks

- **useMediaQuery**: Responsive design hooks
- **useErrorHandler**: Error state management
- **usePerformanceMonitor**: Performance monitoring
- **useLogger**: Logging utilities

## 🤝 Contributing

### Development Setup

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests and documentation
5. Submit a pull request

### Code Standards

- **TypeScript**: Strict mode enabled
- **ESLint**: Consistent code style
- **Prettier**: Code formatting
- **Testing**: 80%+ coverage required

### Commit Guidelines

```
feat: add new feature
fix: resolve bug
docs: update documentation
test: add or update tests
refactor: code restructuring
style: formatting changes
```

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Next.js Team**: For the amazing framework
- **Supabase**: Authentication and database services
- **Stripe**: Payment processing
- **OpenAI**: AI language models
- **Tailwind CSS**: Utility-first CSS framework

## 📞 Support

- **Documentation**: [docs.seveniq.com](https://docs.seveniq.com)
- **Issues**: [GitHub Issues](https://github.com/yourusername/seveniq/issues)
- **Discussions**: [GitHub Discussions](https://github.com/yourusername/seveniq/discussions)
- **Email**: support@seveniq.com

---

**Built with ❤️ by the SevenIQ Team**

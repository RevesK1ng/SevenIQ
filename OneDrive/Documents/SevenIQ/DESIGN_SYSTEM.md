# SevenIQ Design System

A modern, clean, and sleek design system built with Tailwind CSS, prioritizing speed and minimalism.

## 🎨 Color Palette

### Primary Colors
- **Primary 500**: `#1A73E8` - Vibrant blue for main actions and branding
- **Primary 600**: `#1557b0` - Darker blue for hover states
- **Primary 50-900**: Complete range for various UI needs

### Secondary Colors
- **Secondary 50**: `#F5F7FA` - Light gray background
- **Secondary 900**: `#202124` - Dark charcoal text
- **Secondary 100-800**: Complete range for borders, backgrounds, and text

### Accent Colors
- **Accent 500**: `#FF7043` - Warm coral for CTAs and highlights
- **Success 500**: `#34A853` - Green for success states
- **Error 500**: `#EA4335` - Red for error states

## 🔤 Typography

### Font Families
- **Headings**: Inter (600 weight)
- **Body**: Source Sans Pro or Roboto (400 weight)
- **Fallback**: System UI fonts

### Font Sizes
- **Mobile Headings**: 24px (h2), 30px (h3), 40px (h1)
- **Desktop Headings**: 32px (h2), 36px (h3), 48px (h1)
- **Body Text**: 16px base with 1.5 line-height
- **Button Text**: 14px, uppercase, 500 weight, 0.5px letter-spacing

## 📱 Layout & Spacing

### Responsive Grid
- **Mobile**: Single column
- **Tablet (768px+)**: Two columns
- **Desktop (1024px+)**: Three columns

### Spacing System
- **Section Padding**: 24px → 48px → 80px (mobile → tablet → desktop)
- **Element Margins**: 16px between elements
- **Border Radius**: 8px for cards, buttons, inputs

## 🧩 Components

### Buttons

#### Primary Button
```html
<button class="btn-primary">Get Started</button>
```

#### Secondary Button
```html
<button class="btn-secondary">Learn More</button>
```

#### Accent Button
```html
<button class="btn-accent">Try Now</button>
```

#### Button Sizes
```html
<button class="btn-primary btn-sm">Small</button>
<button class="btn-primary">Default</button>
<button class="btn-primary btn-lg">Large</button>
```

### Input Fields

#### Basic Input
```html
<input type="text" class="input-field" placeholder="Enter your email">
```

#### Input with Label
```html
<div class="form-group">
  <label class="form-label">Email Address</label>
  <input type="email" class="input-field" placeholder="you@example.com">
</div>
```

#### Input States
```html
<input type="text" class="input-field error" placeholder="Error state">
<input type="text" class="input-field success" placeholder="Success state">
```

### Cards

#### Basic Card
```html
<div class="card">
  <h3>Card Title</h3>
  <p>Card content goes here</p>
</div>
```

#### Interactive Card
```html
<div class="card card-interactive">
  <h3>Clickable Card</h3>
  <p>This card has hover effects</p>
</div>
```

#### Elevated Card
```html
<div class="card card-elevated">
  <h3>Elevated Card</h3>
  <p>This card has more shadow</p>
</div>
```

### Navigation

#### Nav Link
```html
<a href="#" class="nav-link">Home</a>
<a href="#" class="nav-link active">Dashboard</a>
```

### Badges

```html
<span class="badge badge-primary">New</span>
<span class="badge badge-success">Completed</span>
<span class="badge badge-error">Error</span>
<span class="badge badge-accent">Featured</span>
```

### Alerts

```html
<div class="alert alert-success">
  Your changes have been saved successfully!
</div>

<div class="alert alert-error">
  Something went wrong. Please try again.
</div>

<div class="alert alert-warning">
  Please review your information before proceeding.
</div>

<div class="alert alert-info">
  Here's some helpful information for you.
</div>
```

## 🎭 Animations

### Animation Classes
- **`.animate-fade-in`**: 200ms fade-in on page load
- **`.animate-slide-in`**: 300ms slide-in for sidebars
- **`.animate-scale-up`**: 100ms scale for button clicks
- **`.animate-lift`**: 200ms lift effect for card hovers

### Hover Effects
- **`.hover-lift`**: Subtle upward movement with shadow
- **`.hover-scale`**: 105% scale on hover

## 🛠️ Utilities

### Spacing Utilities
- **`.section-padding`**: Responsive section padding
- **`.container-padding`**: Responsive container padding

### Grid Utilities
- **`.grid-responsive`**: Responsive grid with proper gaps
- **`.grid-1-col`**: Single column layout
- **`.grid-2-col`**: Two column layout (tablet+)
- **`.grid-3-col`**: Three column layout (desktop+)

### Focus Utilities
- **`.focus-ring`**: Primary color focus ring
- **`.focus-ring-accent`**: Accent color focus ring

### Typography Utilities
- **`.text-gradient`**: Primary color gradient text
- **`.text-accent-gradient`**: Accent color gradient text

## 📱 Responsive Design

### Breakpoints
- **Mobile**: < 768px
- **Tablet**: 768px - 1023px
- **Desktop**: 1024px+

### Mobile-First Approach
All components are designed mobile-first with progressive enhancement for larger screens.

## 🌙 Dark Mode Support

The design system includes dark mode support through CSS media queries:

```css
@media (prefers-color-scheme: dark) {
  .dark-mode-toggle {
    @apply bg-secondary-800 text-secondary-100;
  }
}
```

## 🚀 Performance Features

- **Fast animations**: 100-300ms durations for snappy feel
- **Efficient transitions**: Hardware-accelerated transforms
- **Minimal shadows**: Subtle elevation system
- **Optimized fonts**: System font fallbacks for fast loading

## 📋 Usage Examples

### Hero Section
```html
<section class="section-padding bg-secondary-50">
  <div class="container-padding">
    <div class="grid-responsive grid-1-col text-center">
      <h1 class="text-gradient animate-fade-in">
        Welcome to SevenIQ
      </h1>
      <p class="text-xl text-secondary-600 max-w-2xl mx-auto">
        Your intelligent solution for modern business needs
      </p>
      <div class="flex flex-col sm:flex-row gap-4 justify-center mt-8">
        <button class="btn-primary">Get Started</button>
        <button class="btn-secondary">Learn More</button>
      </div>
    </div>
  </div>
</section>
```

### Feature Grid
```html
<section class="section-padding">
  <div class="container-padding">
    <div class="grid-responsive grid-3-col">
      <div class="card card-interactive">
        <h3>Feature One</h3>
        <p>Description of the first feature</p>
      </div>
      <div class="card card-interactive">
        <h3>Feature Two</h3>
        <p>Description of the second feature</p>
      </div>
      <div class="card card-interactive">
        <h3>Feature Three</h3>
        <p>Description of the third feature</p>
      </div>
    </div>
  </div>
</section>
```

### Contact Form
```html
<form class="max-w-md mx-auto">
  <div class="form-group">
    <label class="form-label">Name</label>
    <input type="text" class="input-field" placeholder="Your name">
  </div>
  <div class="form-group">
    <label class="form-label">Email</label>
    <input type="email" class="input-field" placeholder="your@email.com">
  </div>
  <div class="form-group">
    <label class="form-label">Message</label>
    <textarea class="input-field" rows="4" placeholder="Your message"></textarea>
  </div>
  <button type="submit" class="btn-primary w-full">Send Message</button>
</form>
```

## 🔧 Customization

### Adding New Colors
Add to `tailwind.config.js`:
```javascript
colors: {
  custom: {
    500: '#your-color',
    // ... other shades
  }
}
```

### Adding New Components
Add to `app/globals.css`:
```css
@layer components {
  .custom-component {
    @apply base-styles hover:states focus:states;
  }
}
```

### Adding New Animations
Add to `tailwind.config.js`:
```javascript
animation: {
  'custom': 'custom 300ms ease',
},
keyframes: {
  custom: {
    '0%': { /* start state */ },
    '100%': { /* end state */ },
  },
}
```

## 📚 Best Practices

1. **Use semantic class names** for better maintainability
2. **Follow mobile-first** responsive design principles
3. **Maintain consistent spacing** using the spacing utilities
4. **Use elevation system** for proper visual hierarchy
5. **Keep animations fast** (under 300ms) for snappy feel
6. **Test on multiple devices** to ensure responsive behavior
7. **Use focus states** for accessibility compliance

## 🎯 Accessibility

- **Focus rings** on all interactive elements
- **Proper contrast ratios** for text readability
- **Semantic HTML** structure
- **Keyboard navigation** support
- **Screen reader** friendly markup

This design system provides a solid foundation for building modern, accessible, and performant web applications while maintaining consistency across all components and pages.

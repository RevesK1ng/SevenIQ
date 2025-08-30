# SevenIQ Design System - Quick Reference

## 🚀 Quick Start Classes

### Layout
- `.section-padding` - Responsive section padding (24px → 48px → 80px)
- `.container-padding` - Responsive container padding (24px → 48px → 96px)
- `.grid-responsive` - Responsive grid with proper gaps
- `.grid-1-col` - Single column (mobile)
- `.grid-2-col` - Two columns (tablet+)
- `.grid-3-col` - Three columns (desktop+)

### Typography
- `.text-gradient` - Primary blue gradient text
- `.text-accent-gradient` - Coral gradient text
- `.font-heading` - Inter font for headings
- `.font-body` - Source Sans Pro/Roboto for body text

## 🎨 Color Classes

### Primary (Blue)
- `bg-primary-500` - Main blue (#1A73E8)
- `text-primary-500` - Blue text
- `border-primary-500` - Blue border

### Secondary (Gray)
- `bg-secondary-50` - Light background (#F5F7FA)
- `text-secondary-900` - Dark text (#202124)
- `border-secondary-200` - Light border

### Accent (Coral)
- `bg-accent-500` - Warm coral (#FF7043)
- `text-accent-500` - Coral text

### Status Colors
- `bg-success-500` - Green (#34A853)
- `bg-error-500` - Red (#EA4335)

## 🧩 Component Classes

### Buttons
```html
<button class="btn-primary">Primary</button>
<button class="btn-secondary">Secondary</button>
<button class="btn-accent">Accent</button>

<!-- Sizes -->
<button class="btn-primary btn-sm">Small</button>
<button class="btn-primary btn-lg">Large</button>
```

### Inputs
```html
<input class="input-field" placeholder="Enter text">
<input class="input-field error" placeholder="Error state">
<input class="input-field success" placeholder="Success state">

<!-- With labels -->
<div class="form-group">
  <label class="form-label">Label</label>
  <input class="input-field" placeholder="Input">
</div>
```

### Cards
```html
<div class="card">Basic card</div>
<div class="card card-interactive">Clickable card</div>
<div class="card card-elevated">Elevated card</div>
```

### Navigation
```html
<a class="nav-link">Normal link</a>
<a class="nav-link active">Active link</a>
```

### Badges
```html
<span class="badge badge-primary">Primary</span>
<span class="badge badge-success">Success</span>
<span class="badge badge-error">Error</span>
<span class="badge badge-accent">Accent</span>
```

### Alerts
```html
<div class="alert alert-success">Success message</div>
<div class="alert alert-error">Error message</div>
<div class="alert alert-warning">Warning message</div>
<div class="alert alert-info">Info message</div>
```

## 🎭 Animation Classes

- `.animate-fade-in` - 200ms fade-in
- `.animate-slide-in` - 300ms slide-in
- `.animate-scale-up` - 100ms scale
- `.animate-lift` - 200ms lift effect

### Hover Effects
- `.hover-lift` - Subtle upward movement
- `.hover-scale` - 105% scale on hover

## 🛠️ Utility Classes

### Focus States
- `.focus-ring` - Primary color focus ring
- `.focus-ring-accent` - Accent color focus ring

### Shadows
- `.shadow-elevation-1` - Subtle shadow
- `.shadow-elevation-2` - Card shadow
- `.shadow-elevation-3` - Enhanced shadow
- `.shadow-elevation-4` - Prominent shadow

## 📱 Responsive Patterns

### Hero Section
```html
<section class="section-padding bg-secondary-50">
  <div class="container-padding">
    <div class="grid-responsive grid-1-col text-center">
      <h1 class="text-gradient animate-fade-in">Title</h1>
      <p class="text-xl text-secondary-600">Description</p>
      <div class="flex flex-col sm:flex-row gap-4 justify-center">
        <button class="btn-primary">Primary</button>
        <button class="btn-secondary">Secondary</button>
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
        <h3>Feature</h3>
        <p>Description</p>
      </div>
      <!-- Repeat for more features -->
    </div>
  </div>
</section>
```

### Form Layout
```html
<form class="max-w-md mx-auto">
  <div class="form-group">
    <label class="form-label">Field Label</label>
    <input class="input-field" placeholder="Placeholder">
  </div>
  <button type="submit" class="btn-primary w-full">Submit</button>
</form>
```

## 🔧 Customization

### Adding New Colors
```javascript
// tailwind.config.js
colors: {
  custom: {
    500: '#your-color',
    600: '#your-color-dark',
  }
}
```

### Adding New Components
```css
/* app/globals.css */
@layer components {
  .custom-component {
    @apply base-styles hover:states focus:states;
  }
}
```

## 📋 Common Patterns

### Page Layout
```html
<div class="min-h-screen bg-secondary-50">
  <header class="bg-white shadow-elevation-1 border-b border-secondary-100">
    <!-- Header content -->
  </header>
  
  <main class="container-padding py-12">
    <!-- Page content -->
  </main>
</div>
```

### Section Layout
```html
<section class="section-padding">
  <div class="container-padding">
    <h2 class="text-3xl font-semibold mb-8 text-secondary-900">Section Title</h2>
    <!-- Section content -->
  </div>
</section>
```

### Card Grid
```html
<div class="grid-responsive grid-2-col gap-6">
  <div class="card">Card 1</div>
  <div class="card">Card 2</div>
</div>
```

## 🎯 Best Practices

1. **Always use semantic HTML** with design system classes
2. **Follow mobile-first** responsive design
3. **Use consistent spacing** with utility classes
4. **Maintain visual hierarchy** with elevation system
5. **Keep animations fast** (under 300ms)
6. **Test on multiple devices** for responsive behavior

## 🚨 Common Mistakes

- ❌ Don't use arbitrary values when utilities exist
- ❌ Don't skip responsive design considerations
- ❌ Don't forget focus states for accessibility
- ❌ Don't use too many different colors
- ❌ Don't ignore spacing consistency

## 🔍 Need More?

- **Full Documentation**: See `DESIGN_SYSTEM.md`
- **Component Showcase**: Visit `/components-showcase`
- **Tailwind Config**: Check `tailwind.config.js`
- **Global Styles**: Review `app/globals.css`

# Toast Positioning Guide

## Overview

The `ToastViewport` component now supports comprehensive positioning options through the `position` prop, allowing you to control where toasts appear on the screen.

## Basic Usage

```tsx
import { ToastProvider, ToastViewport, toast } from '@turkish-technology/glide';

function App() {
  return (
    <ToastProvider>
      <ToastViewport position="top-right" />
      <YourAppComponents />
    </ToastProvider>
  );
}
```

## Position Options

The `position` prop accepts the following values:

- `'top-right'` (default) - Toasts appear in the top-right corner
- `'top-left'` - Toasts appear in the top-left corner  
- `'top-center'` - Toasts appear centered at the top
- `'bottom-right'` - Toasts appear in the bottom-right corner
- `'bottom-left'` - Toasts appear in the bottom-left corner
- `'bottom-center'` - Toasts appear centered at the bottom

## Examples

### Top Positions
```tsx
<ToastViewport position="top-right" />
<ToastViewport position="top-left" />
<ToastViewport position="top-center" />
```

### Bottom Positions
```tsx
<ToastViewport position="bottom-right" />
<ToastViewport position="bottom-left" />
<ToastViewport position="bottom-center" />
```

## Advanced Configuration

### Custom Z-Index
```tsx
<ToastViewport 
  position="top-right" 
  zIndex={10000}
/>
```

### Custom Container
```tsx
const customContainer = document.getElementById('my-toast-container');

<ToastViewport 
  position="top-right"
  container={customContainer}
/>
```

### Custom Max Width
```tsx
<ToastViewport 
  position="top-right"
  maxWidth="500px"
  // or
  maxWidth={500}
/>
```

### Custom CSS Class
```tsx
<ToastViewport 
  position="top-right"
  className="my-custom-toast-viewport"
/>
```

## CSS Customization

### CSS Variables

The positioning system uses CSS custom properties that you can override:

```css
:root {
  --toast-z-index: 9999;
  --toast-gap: 1rem;
  --toast-viewport-padding: 1rem;
  --toast-viewport-max-width: 420px;
  --toast-viewport-width: 100%;
}
```

### Custom Position Styles

You can override the positioning styles for specific needs:

```css
[data-toast-viewport][data-position="top-right"] {
  top: 20px;
  right: 20px;
  /* Custom positioning */
}
```

### Animation Customization

Each position has optimized animations. You can customize them:

```css
/* Custom animation for top positions */
[data-toast-viewport][data-position^="top"] [data-toast-item] {
  @keyframes toast-slide-in {
    from {
      opacity: 0;
      transform: scale(0.9) translateY(-30px);
    }
    to {
      opacity: 1;
      transform: scale(1) translateY(0);
    }
  }
}
```

## Responsive Behavior

The positioning system is fully responsive:

### Mobile (≤640px)
- Center positions become full-width
- Reduced padding for better space usage
- All positions adapt to smaller screens

### Tablet (641px - 768px)  
- Slightly reduced max-width
- Optimized for touch interactions

### Large Screens (≥1200px)
- Increased max-width and padding
- Better spacing for desktop experience

### Ultra-wide (≥1600px)
- Even more generous padding
- Optimal viewing on large displays

## Z-Index Management

The system automatically manages z-index conflicts with common UI libraries:

### Supported Libraries
- Ant Design
- Material-UI / MUI  
- Chakra UI
- Mantine
- Bootstrap

### Custom Z-Index Conflicts

If you have custom z-index conflicts, you can:

1. Set a custom z-index on ToastViewport:
```tsx
<ToastViewport zIndex={99999} />
```

2. Override CSS variables:
```css
:root {
  --toast-z-index: 99999;
}
```

3. Force specific component z-indexes:
```css
.my-modal {
  z-index: calc(var(--toast-z-index, 9999) - 1) !important;
}
```

## Portal Container Management

### Automatic Container
By default, the system creates a dedicated portal container:

```html
<div id="toast-portal-root" class="toast-portal-root" data-toast-portal="">
  <!-- Toasts render here -->
</div>
```

### Custom Container
You can provide your own container:

```tsx
const myContainer = document.getElementById('custom-toast-area');

<ToastViewport container={myContainer} />
```

### Container Cleanup
The system automatically:
- Creates containers when needed
- Cleans up empty containers
- Manages multiple viewport instances

## Accessibility

The positioning system maintains full accessibility:

- `role="region"` on viewport
- `aria-label="Notifications"`
- `aria-live="polite"` for announcements
- Proper focus management
- Screen reader optimizations

## Best Practices

1. **Choose appropriate positions**: 
   - `top-right` for success/info messages
   - `top-center` for important warnings
   - `bottom-center` for persistent notifications

2. **Consider your app layout**:
   - Avoid conflicts with fixed headers/sidebars
   - Test on different screen sizes
   - Consider RTL language support

3. **Customize responsively**:
   - Use CSS custom properties
   - Test mobile behavior
   - Consider touch targets

4. **Manage z-index carefully**:
   - Use the built-in z-index management
   - Test with your modal/overlay components
   - Document any custom overrides

## Migration from Previous Versions

If upgrading from a version without positioning:

```tsx
// Old (still works)
<ToastViewport />

// New (explicit positioning)
<ToastViewport position="top-right" />
```

The default behavior remains unchanged (`top-right`).

## Common Issues & Solutions

### Issue: Toasts appear behind modals
**Solution**: Use higher z-index or check modal z-index values

### Issue: Position not working on mobile
**Solution**: Check responsive CSS and viewport meta tag

### Issue: Container not cleaning up  
**Solution**: Ensure proper component unmounting

### Issue: Custom animations not working
**Solution**: Check CSS specificity and animation overrides

## Performance Notes

- The positioning system uses CSS transforms for optimal performance
- Portal containers are reused when possible
- Responsive breakpoints use efficient media queries
- Z-index calculations are done at render time

## TypeScript Support

Full TypeScript support with proper types:

```tsx
import type { ToastPosition } from '@turkish-technology/glide';

const position: ToastPosition = 'top-right';

<ToastViewport position={position} />
```
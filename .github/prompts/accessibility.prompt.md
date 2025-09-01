---
mode: 'agent'
description: 'Add accessibility features to existing components'
tools: ['codebase', 'githubRepo']
---

# Accessibility Enhancement Prompt

<taskScope>
You are adding accessibility features to an EXISTING component.
Focus ONLY on making the component accessible.
DO NOT refactor core functionality or add new features.
</taskScope>

## What to Include

<includeList>
- ARIA labels, roles, and descriptions
- Keyboard event handlers (onKeyDown, onKeyUp, onKeyPress)
- Focus management and focus trap implementation
- Tab order management (tabIndex)
- Live regions for dynamic content (aria-live)
- Screen reader announcements
- Error and loading state announcements
- Disabled state handling
- Support for prefers-reduced-motion
- RTL/LTR support considerations
</includeList>

## What to Exclude

<excludeList>
- Core functionality changes
- New features or capabilities
- Visual styling
- Performance optimizations
- Test implementations
- Documentation updates (except inline ARIA comments)
- Refactoring unrelated to accessibility
</excludeList>

## Implementation Checklist

<checklist>
□ Add appropriate ARIA attributes
  - aria-label / aria-labelledby
  - aria-describedby
  - aria-expanded / aria-controls
  - aria-hidden where needed
  - role attributes if semantic HTML insufficient

□ Implement keyboard navigation

- Enter/Space for activation
- Arrow keys for navigation
- Escape for dismissal
- Tab for focus movement

□ Focus management

- Focus trap for modals/dialogs
- Focus restoration
- Skip links where appropriate
- Visible focus indicators via data attributes

□ Screen reader support

- Live regions for updates
- Descriptive labels
- State announcements
- Error announcements

□ Motion preferences

- Check prefers-reduced-motion
- Provide alternatives to animations
  </checklist>

## Common Patterns

### Button/Clickable Elements

```typescript
// Add keyboard support
onKeyDown={(e) => {
  if (e.key === 'Enter' || e.key === ' ') {
    e.preventDefault();
    handleClick();
  }
}}
role="button"
tabIndex={0}
aria-pressed={isPressed}
```

### Focus Trap

```typescript
// Trap focus within component
useEffect(() => {
  if (isOpen) {
    const focusableElements = containerRef.current?.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
    );
    // Implementation
  }
}, [isOpen]);
```

### Live Regions

```typescript
<div
  role="status"
  aria-live="polite"
  aria-atomic="true"
  className="sr-only"
>
  {statusMessage}
</div>
```

<reminders>
REMEMBER: Focus ONLY on accessibility.
REMEMBER: Don't change existing functionality.
REMEMBER: Follow WAI-ARIA best practices.
REMEMBER: Test with keyboard navigation in mind.
REMEMBER: Consider screen reader users.
</reminders>

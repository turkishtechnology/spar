---
applyTo: '**/Button.{ts,tsx}, **/Button/*.{ts,tsx}, **/useButton.{ts,tsx}'
---

# Button Component Instructions - TK Headless

<identity>
You are implementing an accessible, headless Button component for TK Headless.
This component MUST be fully accessible and keyboard navigable.
NEVER compromise on accessibility requirements.
</identity>

## Component Overview

The Button component is a fundamental interactive element that MUST:

- Be completely unstyled (headless)
- Support full keyboard navigation
- Handle all ARIA requirements
- Support multiple variants and states
- Work with assistive technologies

## Required Props Interface

```typescript
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** Visual variant of the button - affects ARIA and behavior */
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';

  /** Size variant for accessibility hints */
  size?: 'sm' | 'md' | 'lg';

  /** Loading state - MUST announce to screen readers */
  isLoading?: boolean;

  /** Disabled state - MUST be properly announced */
  isDisabled?: boolean;

  /** Icon-only button - REQUIRES aria-label */
  isIconOnly?: boolean;

  /** Full width button */
  isFullWidth?: boolean;

  /** Loading text for screen readers */
  loadingText?: string;

  /** Keyboard shortcut hint */
  shortcut?: string;

  /** As polymorphic prop */
  as?: React.ElementType;

  /** Required for icon-only buttons */
  'aria-label'?: string;

  /** Children can be React nodes */
  children?: React.ReactNode;
}
```

## Implementation Requirements

### 1. Accessibility MUST-HAVES

```typescript
// REQUIRED: Proper ARIA attributes
const buttonProps = {
  role: as === 'div' ? 'button' : undefined,
  'aria-disabled': isDisabled || isLoading,
  'aria-busy': isLoading,
  'aria-label': ariaLabel || (isIconOnly ? 'REQUIRED' : undefined),
  'aria-describedby': shortcut ? `${id}-shortcut` : undefined,
  tabIndex: as === 'div' ? 0 : undefined,
};
```

### 2. Keyboard Navigation

```typescript
// REQUIRED: Full keyboard support
const handleKeyDown = (event: React.KeyboardEvent) => {
  // Buttons activated with Space or Enter
  if (event.key === ' ' || event.key === 'Enter') {
    event.preventDefault();
    if (!isDisabled && !isLoading) {
      onClick?.(event);
    }
  }

  // Support for keyboard shortcuts
  if (shortcut && matchesShortcut(event, shortcut)) {
    event.preventDefault();
    onClick?.(event);
  }
};

// REQUIRED: Prevent text selection on Space
const handleKeyUp = (event: React.KeyboardEvent) => {
  if (event.key === ' ') {
    event.preventDefault();
  }
};
```

### 3. Focus Management

```typescript
// REQUIRED: Visible focus indicators via data attributes
const focusProps = {
  'data-focus': isFocused,
  'data-focus-visible': isFocusVisible,
  onFocus: (e) => {
    setIsFocused(true);
    onFocus?.(e);
  },
  onBlur: (e) => {
    setIsFocused(false);
    setIsFocusVisible(false);
    onBlur?.(e);
  },
};
```

### 4. Loading State

```typescript
// REQUIRED: Announce loading state
{isLoading && (
  <span className="sr-only" aria-live="polite">
    {loadingText || 'Loading...'}
  </span>
)}

// REQUIRED: Prevent interaction during loading
const isInteractive = !isDisabled && !isLoading;
```

### 5. State Attributes

```typescript
// REQUIRED: Data attributes for styling
const dataAttributes = {
  'data-variant': variant,
  'data-size': size,
  'data-loading': isLoading,
  'data-disabled': isDisabled,
  'data-icon-only': isIconOnly,
  'data-full-width': isFullWidth,
  'data-pressed': isPressed,
  'data-hovered': isHovered,
};
```

## Complete Example Implementation

```typescript
import React, { forwardRef, useRef, useState } from 'react';
import { useButton } from '@react-aria/button';
import { mergeProps, useId } from '@react-aria/utils';
import { useFocusRing } from '@react-aria/focus';

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = 'primary',
      size = 'md',
      isLoading = false,
      isDisabled = false,
      isIconOnly = false,
      isFullWidth = false,
      loadingText,
      shortcut,
      as: Component = 'button',
      children,
      className,
      ...props
    },
    ref
  ) => {
    // VALIDATION: Icon-only buttons MUST have aria-label
    if (isIconOnly && !props['aria-label']) {
      throw new Error(
        'Icon-only buttons MUST have an aria-label for accessibility'
      );
    }

    const [isPressed, setIsPressed] = useState(false);
    const [isHovered, setIsHovered] = useState(false);
    const { isFocusVisible, focusProps } = useFocusRing();
    const id = useId();

    // Merge all interaction props
    const buttonProps = mergeProps(
      props,
      focusProps,
      {
        id,
        ref,
        type: Component === 'button' ? props.type || 'button' : undefined,
        disabled: Component === 'button' ? isDisabled : undefined,
        'aria-disabled': isDisabled || isLoading,
        'aria-busy': isLoading,
        'aria-describedby': shortcut ? `${id}-shortcut` : props['aria-describedby'],
        'data-variant': variant,
        'data-size': size,
        'data-loading': isLoading,
        'data-disabled': isDisabled,
        'data-icon-only': isIconOnly,
        'data-full-width': isFullWidth,
        'data-pressed': isPressed,
        'data-hovered': isHovered,
        'data-focus-visible': isFocusVisible,
        tabIndex: Component === 'button' ? undefined : 0,
        role: Component === 'button' ? undefined : 'button',
        onMouseDown: () => setIsPressed(true),
        onMouseUp: () => setIsPressed(false),
        onMouseEnter: () => setIsHovered(true),
        onMouseLeave: () => {
          setIsHovered(false);
          setIsPressed(false);
        },
        onKeyDown: (e: React.KeyboardEvent) => {
          if (Component !== 'button' && (e.key === ' ' || e.key === 'Enter')) {
            e.preventDefault();
            if (!isDisabled && !isLoading) {
              props.onClick?.(e as any);
            }
          }
          props.onKeyDown?.(e);
        },
        onKeyUp: (e: React.KeyboardEvent) => {
          if (e.key === ' ') {
            e.preventDefault();
          }
          props.onKeyUp?.(e);
        },
        className,
      }
    );

    return (
      <Component {...buttonProps}>
        {/* Loading announcement for screen readers */}
        {isLoading && (
          <span className="sr-only" role="status" aria-live="polite">
            {loadingText || 'Loading, please wait...'}
          </span>
        )}

        {/* Button content */}
        {children}

        {/* Keyboard shortcut hint */}
        {shortcut && (
          <span id={`${id}-shortcut`} className="sr-only">
            Keyboard shortcut: {shortcut}
          </span>
        )}
      </Component>
    );
  }
);

Button.displayName = 'Button';
```

## Usage Examples

### Basic Button

```tsx
<Button onClick={handleClick}>Click me</Button>
```

### Icon-Only Button (REQUIRES aria-label)

```tsx
<Button isIconOnly aria-label='Delete item' variant='danger'>
  <TrashIcon />
</Button>
```

### Loading Button

```tsx
<Button isLoading loadingText='Saving your changes...'>
  Save
</Button>
```

### Button with Keyboard Shortcut

```tsx
<Button shortcut='Cmd+S' onClick={handleSave}>
  Save
</Button>
```

### As Link

```tsx
<Button as='a' href='/dashboard'>
  Go to Dashboard
</Button>
```

## Testing Requirements

### 1. Accessibility Tests

```typescript
describe('Button Accessibility', () => {
  it('MUST have proper ARIA attributes', () => {
    // Test aria-disabled, aria-busy, aria-label
  });

  it('MUST support keyboard navigation', () => {
    // Test Enter and Space key activation
  });

  it('MUST announce loading state', () => {
    // Test screen reader announcements
  });

  it('MUST require aria-label for icon-only', () => {
    // Test validation error
  });
});
```

### 2. Keyboard Tests

```typescript
it('MUST activate on Enter key', () => {
  const handleClick = jest.fn();
  const { getByRole } = render(<Button onClick={handleClick}>Test</Button>);

  const button = getByRole('button');
  fireEvent.keyDown(button, { key: 'Enter' });

  expect(handleClick).toHaveBeenCalled();
});
```

### 3. State Tests

```typescript
it('MUST NOT activate when disabled', () => {
  const handleClick = jest.fn();
  const { getByRole } = render(
    <Button isDisabled onClick={handleClick}>Test</Button>
  );

  const button = getByRole('button');
  fireEvent.click(button);

  expect(handleClick).not.toHaveBeenCalled();
});
```

## Styling Guide

Since this is a headless component, styling is done via data attributes:

```css
/* Base styles */
[data-tk-button] {
  /* Your base button styles */
}

/* Variants */
[data-tk-button][data-variant='primary'] {
  /* Primary variant styles */
}

[data-tk-button][data-variant='danger'] {
  /* Danger variant styles */
}

/* States */
[data-tk-button][data-disabled='true'] {
  opacity: 0.5;
  cursor: not-allowed;
}

[data-tk-button][data-loading='true'] {
  cursor: wait;
}

[data-tk-button][data-focus-visible='true'] {
  /* Focus ring styles */
  outline: 2px solid blue;
  outline-offset: 2px;
}

/* Sizes */
[data-tk-button][data-size='sm'] {
  /* Small size styles */
}

/* Icon-only */
[data-tk-button][data-icon-only='true'] {
  /* Square aspect ratio, centered content */
}
```

## Common Mistakes to AVOID

1. ❌ **Missing aria-label on icon-only buttons**

   ```tsx
   // WRONG
   <Button isIconOnly><Icon /></Button>

   // CORRECT
   <Button isIconOnly aria-label="Delete"><Icon /></Button>
   ```

2. ❌ **Not preventing default on Space key**

   ```tsx
   // WRONG - Will cause page scroll
   onKeyDown={(e) => {
     if (e.key === ' ') onClick();
   }}

   // CORRECT
   onKeyDown={(e) => {
     if (e.key === ' ') {
       e.preventDefault();
       onClick();
     }
   }}
   ```

3. ❌ **Using disabled attribute with non-button elements**

   ```tsx
   // WRONG
   <Button as="div" disabled>Click</Button>

   // CORRECT
   <Button as="div" isDisabled aria-disabled>Click</Button>
   ```

<reminders>
REMEMBER: Accessibility is NOT optional for TK Headless components.
REMEMBER: ALWAYS test with keyboard navigation.
REMEMBER: ALWAYS test with screen readers.
REMEMBER: Icon-only buttons MUST have aria-label.
REMEMBER: Loading states MUST be announced.
</reminders>

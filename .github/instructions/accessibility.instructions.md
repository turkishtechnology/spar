---
applyTo: 'packages/**/src/components/**/*.{ts,tsx}, packages/**/src/hooks/**/*.{ts,tsx}'
---

# Accessibility Instructions - TK Headless

<identity>
You are implementing accessibility for TK Headless components.
Accessibility is FUNDAMENTAL, not optional.
EVERY component MUST be fully accessible.
NEVER ship components without complete accessibility support.
</identity>

## Core Principles

<principles>
1. **Perceivable**: Information MUST be presentable in ways users can perceive
2. **Operable**: Interface components MUST be operable by keyboard
3. **Understandable**: Information and UI operation MUST be understandable
4. **Robust**: Content MUST be robust enough for assistive technologies
</principles>

## MANDATORY Requirements

### 1. Keyboard Navigation

EVERY interactive component MUST:

```typescript
// REQUIRED: Full keyboard support
- Tab: Navigate between focusable elements
- Shift+Tab: Navigate backwards
- Enter: Activate buttons, links, form controls
- Space: Activate buttons, checkboxes, toggle controls
- Arrow Keys: Navigate within composite widgets
- Escape: Close dialogs, cancel operations
- Home/End: Jump to first/last item in lists
- PageUp/PageDown: Navigate large content areas
```

### 2. ARIA Attributes

<ariaRules>
ALWAYS include:
- role: When semantic HTML is insufficient
- aria-label: For icon-only controls
- aria-labelledby: For complex labeling
- aria-describedby: For additional descriptions
- aria-live: For dynamic content updates
- aria-expanded: For collapsible content
- aria-selected: For selectable items
- aria-checked: For checkable items
- aria-disabled: For disabled states
- aria-busy: For loading states
- aria-invalid: For validation errors
- aria-errormessage: For error descriptions
- aria-controls: For identifying the controlled element
- aria-hidden: For hiding content from assistive tech
- aria-modal: For trapping focus inside modals
- aria-haspopup: For buttons that open popups or menus
- aria-current: For marking current item in a set
- aria-activedescendant: For composite widgets with active item
- tabindex: For managing keyboard focus
</ariaRules>

### 3. Focus Management

```typescript
// REQUIRED: Visible focus indicators
const focusStyles = {
  'data-focus-visible': 'true', // For :focus-visible polyfill
  outline: '2px solid',
  outlineOffset: '2px',
};

// REQUIRED: Focus trap for modals
const trapFocus = (container: HTMLElement) => {
  const focusableElements = container.querySelectorAll(
    'a[href], button, textarea, input, select, [tabindex]:not([tabindex="-1"])',
  );
  const firstFocusable = focusableElements[0];
  const lastFocusable = focusableElements[focusableElements.length - 1];

  // Trap focus within container
  container.addEventListener('keydown', (e) => {
    if (e.key === 'Tab') {
      if (e.shiftKey && document.activeElement === firstFocusable) {
        e.preventDefault();
        lastFocusable.focus();
      } else if (!e.shiftKey && document.activeElement === lastFocusable) {
        e.preventDefault();
        firstFocusable.focus();
      }
    }
  });
};
```

### 4. Screen Reader Support

```typescript
// REQUIRED: Announcements for dynamic content
<div role="status" aria-live="polite" aria-atomic="true">
  {message}
</div>

// REQUIRED: Loading states
<div aria-busy="true" aria-label="Loading content">
  <span className="sr-only">Loading, please wait...</span>
</div>

// REQUIRED: Error announcements
<div role="alert" aria-live="assertive">
  {errorMessage}
</div>
```

### 5. Color and Contrast

<contrastRequirements>
MUST meet WCAG 2.1 Level AA:
- Normal text: 4.5:1 contrast ratio
- Large text (18pt+, or 14pt bold): 3:1 contrast ratio
- UI components: 3:1 contrast ratio
- Focus indicators: 3:1 contrast ratio
NEVER rely on color alone to convey information
</contrastRequirements>

## Component-Specific Patterns

### Modal/Dialog

```typescript
interface DialogA11yProps {
  'aria-modal': true;
  'aria-labelledby': string; // Title ID
  'aria-describedby'?: string; // Description ID
  role: 'dialog';
}

// Focus management
useEffect(() => {
  if (isOpen) {
    // Save previous focus
    previousFocus.current = document.activeElement;
    // Focus first focusable element or dialog
    firstFocusableElement?.focus();
  } else {
    // Restore focus
    previousFocus.current?.focus();
  }
}, [isOpen]);
```

### Dropdown/Select

```typescript
interface DropdownA11yProps {
  role: 'combobox';
  'aria-expanded': boolean;
  'aria-haspopup': 'listbox';
  'aria-controls': string; // Listbox ID
  'aria-activedescendant'?: string; // Active option ID
}

// Keyboard navigation
const handleKeyDown = (event: KeyboardEvent) => {
  switch (event.key) {
    case 'ArrowDown':
      event.preventDefault();
      selectNext();
      break;
    case 'ArrowUp':
      event.preventDefault();
      selectPrevious();
      break;
    case 'Enter':
    case ' ':
      event.preventDefault();
      toggleOpen();
      break;
    case 'Escape':
      event.preventDefault();
      close();
      break;
    case 'Home':
      event.preventDefault();
      selectFirst();
      break;
    case 'End':
      event.preventDefault();
      selectLast();
      break;
  }
};
```

### Tabs

```typescript
interface TabsA11yProps {
  role: 'tablist';
  'aria-orientation'?: 'horizontal' | 'vertical';
}

interface TabA11yProps {
  role: 'tab';
  'aria-selected': boolean;
  'aria-controls': string; // Panel ID
  tabIndex: number; // 0 for selected, -1 for others
}

interface TabPanelA11yProps {
  role: 'tabpanel';
  'aria-labelledby': string; // Tab ID
  tabIndex: 0;
}
```

### Form Controls

```typescript
// REQUIRED: Label associations
<label htmlFor={inputId}>
  Username
  <span aria-label="required">*</span>
</label>
<input
  id={inputId}
  aria-required="true"
  aria-invalid={hasError}
  aria-describedby={hasError ? errorId : undefined}
/>
{hasError && (
  <div id={errorId} role="alert">
    {errorMessage}
  </div>
)}
```

## Testing Checklist

### Automated Testing

```typescript
// Using jest-axe
import { axe, toHaveNoViolations } from 'jest-axe';

expect.extend(toHaveNoViolations);

it('MUST have no accessibility violations', async () => {
  const { container } = render(<Component />);
  const results = await axe(container);
  expect(results).toHaveNoViolations();
});
```

### Manual Testing

<testingChecklist>
✓ Navigate using ONLY keyboard
✓ Test with screen reader (NVDA, JAWS, VoiceOver)
✓ Verify focus order is logical
✓ Check focus indicators are visible
✓ Ensure all content is announced
✓ Test with 200% zoom
✓ Verify color contrast
✓ Test with Windows High Contrast Mode
✓ Disable CSS and verify content structure
✓ Test with voice control software
</testingChecklist>

## Common Violations to AVOID

### 1. Missing Labels

```typescript
// ❌ WRONG
<button><Icon /></button>

// ✅ CORRECT
<button aria-label="Delete item"><Icon /></button>
```

### 2. Focus Not Visible

```typescript
// ❌ WRONG
button:focus { outline: none; }

// ✅ CORRECT
button:focus-visible {
  outline: 2px solid blue;
  outline-offset: 2px;
}
```

### 3. Incorrect ARIA Usage

```typescript
// ❌ WRONG
<div role="button" disabled>Click</div>

// ✅ CORRECT
<div role="button" aria-disabled="true" tabIndex={0}>Click</div>
```

### 4. Missing Keyboard Support

```typescript
// ❌ WRONG
<div onClick={handleClick}>Clickable</div>

// ✅ CORRECT
<div
  role="button"
  tabIndex={0}
  onClick={handleClick}
  onKeyDown={(e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleClick();
    }
  }}
>
  Clickable
</div>
```

## Resources and Tools

### Testing Tools

- **axe DevTools**: Browser extension for accessibility testing
- **WAVE**: Web Accessibility Evaluation Tool
- **Lighthouse**: Built into Chrome DevTools
- **jest-axe**: Automated testing in Jest
- **Pa11y**: Command-line accessibility testing

### Screen Readers

- **NVDA**: Free Windows screen reader
- **JAWS**: Commercial Windows screen reader
- **VoiceOver**: Built into macOS/iOS
- **TalkBack**: Built into Android

### Guidelines

- **WCAG 2.1**: Web Content Accessibility Guidelines
- **ARIA Authoring Practices**: W3C guidelines
- **Section 508**: US Federal accessibility standards

<reminders>
REMEMBER: Accessibility is a LEGAL requirement in many jurisdictions.
REMEMBER: 15% of the world's population has some form of disability.
REMEMBER: Accessible components benefit ALL users.
REMEMBER: Test with REAL assistive technologies.
REMEMBER: Accessibility is easier when built in from the start.
</reminders>

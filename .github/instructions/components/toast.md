# Toast — Glide Headless Instructions

## 1. Component Overview

### Purpose and Use Cases
The Toast component provides non-intrusive notifications that appear temporarily to inform users of status updates, confirmations, warnings, or errors without disrupting their workflow. Unlike alerts or modals, toasts do not require immediate user action and typically auto-dismiss after a timeout period.

**Primary Use Cases:**
- Success confirmations (form submission, save actions)
- Error notifications (validation failures, server errors)
- Warning messages (session expiry, unsaved changes)
- Informational updates (background processes, system status)
- Loading states with progress indicators

### Compound Component Structure
```tsx
<Toast.Provider>
  <Toast.Root>
    <Toast.Icon />
    <Toast.Content>
      <Toast.Title />
      <Toast.Description />
    </Toast.Content>
    <Toast.Action />
    <Toast.Close />
    <Toast.Progress />
  </Toast.Root>
</Toast.Provider>
```

### Key Differentiators
- **Headless Design**: Zero styling opinions, complete behavioral control
- **Progressive Enhancement**: Works with or without JavaScript
- **Queue Management**: Built-in toast queue with priority and positioning
- **Loading States**: Integrated progress indicators and loading management
- **Accessibility First**: WCAG 2.2 AA compliant with proper live regions
- **Framework Agnostic**: Pure React with TypeScript strict mode

## 2. API

### Toast.Provider Props
| Name | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `maxToasts` | `number` | No | `5` | Maximum number of toasts visible at once |
| `position` | `'top-left' \| 'top-center' \| 'top-right' \| 'bottom-left' \| 'bottom-center' \| 'bottom-right'` | No | `'top-right'` | Global positioning for toast container |
| `duration` | `number` | No | `5000` | Default auto-dismiss timeout in ms (0 disables) |
| `pauseOnHover` | `boolean` | No | `true` | Pause auto-dismiss when hovering |
| `pauseOnFocus` | `boolean` | No | `true` | Pause auto-dismiss when focused |
| `swipeDirection` | `'up' \| 'down' \| 'left' \| 'right'` | No | `'right'` | Swipe direction for dismissal |
| `closeOnSwipeEnd` | `boolean` | No | `true` | Auto-close when swipe gesture completes |

### Toast.Root Props
| Name | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `as` | `ElementType` | No | `'div'` | Polymorphic element type |
| `variant` | `'success' \| 'error' \| 'warning' \| 'info' \| 'loading'` | No | `'info'` | Toast semantic variant |
| `size` | `'small' \| 'medium' \| 'large'` | No | `'medium'` | Toast size variant |
| `open` | `boolean` | No | `undefined` | Controlled open state |
| `defaultOpen` | `boolean` | No | `false` | Uncontrolled default open state |
| `onOpenChange` | `(open: boolean) => void` | No | `undefined` | Open state change handler |
| `duration` | `number` | No | `undefined` | Override provider duration |
| `onDurationEnd` | `() => void` | No | `undefined` | Called when duration expires |
| `priority` | `'low' \| 'normal' \| 'high'` | No | `'normal'` | Queue priority level |
| `persistent` | `boolean` | No | `false` | Prevents auto-dismiss |
| `loading` | `boolean` | No | `false` | Shows loading state with progress |
| `progress` | `number` | No | `undefined` | Loading progress (0-100) |
| `onSwipeStart` | `(direction: SwipeDirection) => void` | No | `undefined` | Swipe gesture start |
| `onSwipeEnd` | `(direction: SwipeDirection) => void` | No | `undefined` | Swipe gesture end |

### Toast.Content Props
| Name | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `as` | `ElementType` | No | `'div'` | Polymorphic element type |

### Toast.Title Props
| Name | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `as` | `ElementType` | No | `'h3'` | Polymorphic element type |
| `level` | `1 \| 2 \| 3 \| 4 \| 5 \| 6` | No | `3` | Heading level for accessibility |

### Toast.Description Props
| Name | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `as` | `ElementType` | No | `'p'` | Polymorphic element type |

### Toast.Action Props
| Name | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `as` | `ElementType` | No | `'button'` | Polymorphic element type |
| `onClick` | `() => void` | No | `undefined` | Action click handler |
| `altText` | `string` | Yes | `undefined` | Alternative action text for accessibility |

### Toast.Close Props
| Name | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `as` | `ElementType` | No | `'button'` | Polymorphic element type |
| `onClick` | `() => void` | No | `undefined` | Custom close handler |

### Toast.Icon Props
| Name | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `as` | `ElementType` | No | `'span'` | Polymorphic element type |

### Toast.Progress Props
| Name | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `as` | `ElementType` | No | `'div'` | Polymorphic element type |
| `value` | `number` | No | `undefined` | Progress value (0-100) |
| `max` | `number` | No | `100` | Maximum progress value |

**Polymorphic Support**: All components support `as` prop for element customization.
**Ref Forwarding**: All components forward refs to their DOM elements.
**Controlled/Uncontrolled**: `open`/`defaultOpen` pattern for flexible state management.

## 3. Behavior Matrix

| State | Trigger | Result | ARIA/DOM Update |
|-------|---------|--------|-----------------|
| **Initial** | Component mount | Toast invisible, queued if needed | `aria-hidden="true"`, `data-state="closed"` |
| **Opening** | `open={true}` or auto-show | Transition to visible state | `aria-hidden="false"`, `data-state="opening"`, live region announces |
| **Open** | Animation complete | Fully visible, timer starts | `data-state="open"`, `aria-live` announcement |
| **Hover** | Mouse enter (if pauseOnHover) | Timer pauses | `data-paused="true"` |
| **Unhover** | Mouse leave | Timer resumes | `data-paused="false"` |
| **Focus** | Keyboard focus (if pauseOnFocus) | Timer pauses | `data-paused="true"`, focus visible |
| **Blur** | Focus leaves toast | Timer resumes | `data-paused="false"` |
| **Swipe Start** | Touch/mouse drag | Swipe gesture begins | `data-swipe="start"`, `style` transform updates |
| **Swipe Move** | Drag continues | Visual feedback | `data-swipe="move"`, transform updates |
| **Swipe End** | Gesture completes | Close or return to position | `data-swipe="end"` or `data-swipe="cancel"` |
| **Action Click** | Action button pressed | Custom handler executes | Maintains open state unless explicitly closed |
| **Close Click** | Close button pressed | Initiates close sequence | `data-state="closing"` |
| **Duration End** | Timer expires | Auto-close begins | `data-state="closing"` |
| **Closing** | Close initiated | Transition to hidden | `data-state="closing"`, exit animation |
| **Closed** | Animation complete | Removed from DOM | Component unmounted, removed from queue |
| **Loading** | `loading={true}` | Shows progress state | `aria-busy="true"`, `data-loading="true"` |
| **Progress Update** | `progress` prop change | Updates progress bar | `aria-valuenow` updates |
| **Error** | `variant="error"` | Error styling and announcement | `role="alert"`, assertive announcement |
| **Success** | `variant="success"` | Success styling and announcement | `role="status"`, polite announcement |

## 4. Accessibility

### Roles
- **Toast.Root**: `role="status"` (default), `role="alert"` (error variant), `role="log"` (loading)
- **Toast.Title**: Implicit heading role via semantic element
- **Toast.Description**: No explicit role (paragraph content)
- **Toast.Action**: `role="button"` (via semantic button or explicit)
- **Toast.Close**: `role="button"` with `aria-label="Close notification"`
- **Toast.Progress**: `role="progressbar"` with `aria-valuenow`, `aria-valuemin`, `aria-valuemax`

### Keyboard Support
- **Tab**: Move focus to action/close buttons within toast
- **Shift+Tab**: Move focus backward through toast elements
- **Enter/Space**: Activate focused action or close button
- **Escape**: Close current toast (when focused)
- **Arrow Keys**: Navigate between multiple toasts in queue

### Focus Management
- **Initial Focus**: No automatic focus (toasts are non-intrusive)
- **Programmatic Focus**: Focus action button when explicitly requested
- **Focus Trap**: Not applicable (toasts don't trap focus)
- **Focus Indicators**: Visible focus rings on interactive elements
- **Focus Restoration**: Not applicable (background notifications)

### Screen Reader Announcements
- **Success/Info**: Polite announcements via `aria-live="polite"`
- **Warning/Error**: Assertive announcements via `aria-live="assertive"` or `role="alert"`
- **Loading**: Status updates via `aria-live="polite"` with progress
- **Queue Updates**: Announce total count when multiple toasts present
- **Content Structure**: Proper heading hierarchy and text associations

### Name/Role/Value Exposure
- **Toast.Title**: Accessible name via heading content
- **Toast.Description**: Associated via `aria-describedby` from title
- **Toast.Action**: `aria-label` or visible text content
- **Toast.Close**: `aria-label="Close notification"` or `aria-labelledby`
- **Toast.Progress**: `aria-label="Loading progress"` with value announcements

### WCAG 2.2 AA Compliance
- **2.1.1 Keyboard**: Full keyboard accessibility
- **2.1.2 No Keyboard Trap**: Focus can move freely
- **2.4.3 Focus Order**: Logical tab sequence
- **2.4.7 Focus Visible**: Clear focus indicators
- **4.1.2 Name, Role, Value**: Proper semantic markup
- **4.1.3 Status Messages**: Appropriate live region usage

## 5. Implementation Architecture

### State Hooks Design
```tsx
// Core toast state management
const useToast = () => {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [queue, setQueue] = useState<ToastQueue>([]);
  
  const addToast = useCallback((toast: ToastConfig) => {
    // Queue management with priority
  }, []);
  
  const removeToast = useCallback((id: string) => {
    // Safe removal with cleanup
  }, []);
  
  return { toasts, addToast, removeToast, queue };
};

// Individual toast lifecycle
const useToastState = (props: ToastProps) => {
  const [open, setOpen] = useControllableState(props);
  const [paused, setPaused] = useState(false);
  const [progress, setProgress] = useState(0);
  
  return { open, paused, progress, /* ... */ };
};

// Timer management with pause/resume
const useToastTimer = (duration: number, paused: boolean) => {
  const [remaining, setRemaining] = useState(duration);
  // Implementation with pause/resume logic
};
```

### Context Requirements
```tsx
interface ToastContextValue {
  toasts: Toast[];
  addToast: (config: ToastConfig) => string;
  removeToast: (id: string) => void;
  updateToast: (id: string, updates: Partial<Toast>) => void;
  pauseAll: () => void;
  resumeAll: () => void;
  clearAll: () => void;
  config: ToastProviderProps;
}

const ToastContext = createContext<ToastContextValue | null>(null);
```

### Ref Forwarding Strategy
- **Direct Forwarding**: All components forward refs to their DOM elements
- **Composite Refs**: Internal refs for gesture detection combined with forwarded refs
- **Ref Callbacks**: Support both ref objects and callback refs
- **TypeScript Safety**: Properly typed ref forwarding with generic constraints

### Event System
```tsx
// Gesture detection for swipe-to-dismiss
const useSwipeGesture = (element: RefObject<HTMLElement>) => {
  // Touch and mouse event handling
  // Threshold-based gesture recognition
  // Direction detection and feedback
};

// Timer events for auto-dismiss
const useToastEvents = () => {
  // Duration management
  // Pause/resume on hover/focus
  // Queue processing
};
```

### SSR/CSR Safety and Deterministic IDs
```tsx
// Deterministic ID generation
const useToastId = (id?: string) => {
  const fallbackId = useId(); // React 18+ useId
  return id ?? `toast-${fallbackId}`;
};

// SSR-safe state initialization
const useSSRSafeState = <T>(initialValue: T) => {
  const [state, setState] = useState<T>(initialValue);
  const [hydrated, setHydrated] = useState(false);
  
  useEffect(() => {
    setHydrated(true);
  }, []);
  
  return [hydrated ? state : initialValue, setState] as const;
};
```

## 6. Styling & Data Attributes

### Required Data Attributes

#### State Attributes
- `data-state`: `"closed" | "opening" | "open" | "closing"`
- `data-paused`: `"true" | "false"` (when timer is paused)
- `data-loading`: `"true" | "false"` (loading state)
- `data-swipe`: `"start" | "move" | "end" | "cancel"` (swipe gesture)

#### Variant Attributes
- `data-variant`: `"success" | "error" | "warning" | "info" | "loading"`
- `data-size`: `"small" | "medium" | "large"`

#### Position Attributes (on Provider)
- `data-position`: `"top-left" | "top-center" | "top-right" | "bottom-left" | "bottom-center" | "bottom-right"`

#### Progress Attributes
- `data-progress`: Current progress value for loading toasts
- `data-progress-state`: `"loading" | "complete" | "error"`

#### Interactive Attributes
- `data-action-available`: `"true" | "false"` (has action button)
- `data-closable`: `"true" | "false"` (can be manually closed)

### Styling Examples
```css
/* Basic toast styling */
[data-toast-root] {
  /* Base toast container styles */
}

/* State-based styling */
[data-state="opening"] { /* Opening animation */ }
[data-state="open"] { /* Fully visible state */ }
[data-state="closing"] { /* Closing animation */ }

/* Variant styling */
[data-variant="success"] { /* Success colors/icons */ }
[data-variant="error"] { /* Error colors/icons */ }
[data-variant="warning"] { /* Warning colors/icons */ }
[data-variant="info"] { /* Info colors/icons */ }
[data-variant="loading"] { /* Loading state styling */ }

/* Size variants */
[data-size="small"] { /* Compact sizing */ }
[data-size="medium"] { /* Default sizing */ }
[data-size="large"] { /* Expanded sizing */ }

/* Swipe gesture feedback */
[data-swipe="move"] { /* Transform during swipe */ }

/* Progress bar styling */
[data-toast-progress] {
  /* Progress bar appearance */
}
```

## 7. Test Coverage Plan

### Unit Tests
```tsx
describe('Toast Component', () => {
  describe('State Management', () => {
    test('opens and closes correctly');
    test('respects controlled vs uncontrolled state');
    test('handles duration-based auto-dismiss');
    test('pauses on hover when enabled');
    test('pauses on focus when enabled');
  });

  describe('Queue Management', () => {
    test('respects maxToasts limit');
    test('handles priority ordering');
    test('processes queue when toast closes');
  });

  describe('Gesture Support', () => {
    test('detects swipe gestures');
    test('provides visual feedback during swipe');
    test('closes on successful swipe');
    test('returns to position on canceled swipe');
  });

  describe('Loading States', () => {
    test('shows loading indicator');
    test('updates progress value');
    test('transitions from loading to complete');
  });

  describe('Variants', () => {
    test('applies correct data attributes');
    test('uses appropriate ARIA roles');
    test('announces with correct urgency');
  });
});
```

### Accessibility Tests
```tsx
describe('Toast Accessibility', () => {
  test('has no axe violations', async () => {
    const { container } = render(<ToastExample />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  test('announces content to screen readers', () => {
    // Test live region announcements
  });

  test('supports keyboard navigation', () => {
    // Test tab order and keyboard interactions
  });

  test('provides proper focus management', () => {
    // Test focus indicators and navigation
  });

  test('exposes correct ARIA attributes', () => {
    // Test roles, properties, and states
  });

  test('meets WCAG 2.2 AA requirements', () => {
    // Test specific success criteria
  });
});
```

### Integration Tests
```tsx
describe('Toast Integration', () => {
  test('works with multiple toasts', () => {
    // Test queue behavior and interactions
  });

  test('integrates with form validation', () => {
    // Test error toast display
  });

  test('handles rapid successive toasts', () => {
    // Test performance and queue management
  });

  test('works across route changes', () => {
    // Test persistence and cleanup
  });

  test('handles window resize and orientation', () => {
    // Test responsive behavior
  });
});
```

## 8. Constraints

### Zero Styling (Behavior Only)
- No CSS imports or inline styles
- No visual opinions or themes
- Behavior and accessibility only
- Styling via data attributes exclusively

### Styling via Data Attributes
- All visual states exposed through `data-*` attributes
- Comprehensive attribute coverage for all states and variants
- Predictable and semantic attribute naming
- No style props or CSS-in-JS

### Tree-Shakeable Exports
- Named exports only (no default exports)
- Minimal dependency tree
- Side-effect free imports
- Dead code elimination friendly

### TypeScript Strict Mode
- Explicit types for all public APIs
- No `any` types in public interfaces
- Strict null checks and property access
- Generic type safety for polymorphic components

### WCAG 2.2 AA Compliant
- Full keyboard accessibility
- Proper screen reader support
- Color contrast independence
- Focus management and indicators
- Error handling and announcements

### Controlled/Uncontrolled Support
- Both controlled and uncontrolled patterns
- Consistent state management API
- Proper default value handling
- Change event callbacks

## 9. Migration & Implementation Checklist

### Migration Guidance
Toast components are commonly found in design systems and should be migrated carefully:

**From Styled Toast Libraries:**
1. Remove CSS imports and styled-components
2. Replace style props with data attributes
3. Update event handlers to use new API
4. Test accessibility with screen readers

**From Custom Toast Solutions:**
1. Replace custom state management with useToast hook
2. Update DOM structure to match compound pattern
3. Add proper ARIA attributes and roles
4. Implement gesture support if needed

**Common Migration Patterns:**
```tsx
// Before: Styled library
<Toast type="success" message="Saved!" />

// After: Glide headless
<Toast.Root variant="success">
  <Toast.Content>
    <Toast.Description>Saved!</Toast.Description>
  </Toast.Content>
</Toast.Root>
```

### Implementation Checklist

#### Core Functionality
- [ ] Toast.Provider with global configuration
- [ ] Toast.Root with state management
- [ ] Toast.Content compound structure
- [ ] Toast.Title with proper heading semantics
- [ ] Toast.Description with accessibility associations
- [ ] Toast.Action with keyboard support
- [ ] Toast.Close with dismiss functionality
- [ ] Toast.Icon for variant indicators
- [ ] Toast.Progress for loading states

#### State Management
- [ ] Controlled/uncontrolled open state
- [ ] Duration-based auto-dismiss
- [ ] Pause on hover/focus
- [ ] Queue management with priorities
- [ ] Loading state with progress tracking

#### Gesture Support
- [ ] Swipe-to-dismiss implementation
- [ ] Touch and mouse event handling
- [ ] Visual feedback during gestures
- [ ] Configurable swipe directions

#### Accessibility
- [ ] Proper ARIA roles and attributes
- [ ] Live region announcements
- [ ] Keyboard navigation support
- [ ] Focus management and indicators
- [ ] Screen reader tested

#### Variants & Styling
- [ ] Success/error/warning/info variants
- [ ] Small/medium/large size options
- [ ] Loading state variant
- [ ] All data attributes implemented
- [ ] No CSS dependencies

#### Testing
- [ ] Unit tests covering all functionality
- [ ] Accessibility tests with axe-core
- [ ] Integration tests for queue behavior
- [ ] Manual testing with assistive technologies
- [ ] Performance tests for rapid toasts

#### TypeScript
- [ ] Strict type definitions
- [ ] Polymorphic component typing
- [ ] Ref forwarding with proper types
- [ ] No any types in public API

#### Documentation
- [ ] API documentation complete
- [ ] Usage examples provided
- [ ] Migration guide included
- [ ] Accessibility notes documented
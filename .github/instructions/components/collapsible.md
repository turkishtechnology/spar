# Collapsible — Glide Headless Instructions

## 1. Component Overview

The Collapsible component implements the WAI-ARIA disclosure pattern, providing a headless implementation for show/hide content functionality. It consists of a trigger button that controls the visibility of associated content panel.

**Purpose and use cases:**
- FAQ sections and help documentation
- Expandable card content
- Progressive disclosure of complex forms
- Navigation menu sections
- Content summaries with expandable details

**Compound component structure:**
- `Collapsible.Root` - Context provider and state management
- `Collapsible.Trigger` - Button element that toggles visibility
- `Collapsible.Content` - Panel containing the collapsible content

**Key differentiators:**
- Zero styling opinions (behavior-only)
- Full keyboard and screen reader support
- Controlled and uncontrolled state management
- SSR-safe with deterministic IDs
- Support for `hidden="until-found"` attribute for better findability
- Polymorphic trigger components

## 2. API

### Collapsible.Root Props

| Name | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `open` | `boolean` | No | `undefined` | Controlled open state |
| `defaultOpen` | `boolean` | No | `false` | Default open state for uncontrolled usage |
| `onOpenChange` | `(open: boolean) => void` | No | `undefined` | Callback fired when open state changes |
| `disabled` | `boolean` | No | `false` | Whether the collapsible is disabled |
| `children` | `ReactNode` | Yes | - | Child components |

### Collapsible.Trigger Props

| Name | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `as` | `ElementType` | No | `'button'` | Element type for polymorphic rendering |
| `children` | `ReactNode` | No | - | Trigger content |
| `aria-expanded` | `boolean` | No | Auto-managed | Current open/closed state (automatically set) |
| `aria-controls` | `string` | No | Auto-generated | ID of controlled content (automatically set) |
| `aria-disabled` | `boolean` | No | Auto-managed | Disabled state for non-semantic elements |
| `disabled` | `boolean` | No | Auto-managed | Native disabled for semantic button elements |
| `...rest` | `HTMLAttributes` | No | - | Additional HTML attributes |

**Disabled Semantics:**
- For semantic `<button>` elements: Uses native `disabled` attribute
- For non-semantic elements (via `as` prop): Uses `aria-disabled` + `tabIndex={-1}`

### Collapsible.Content Props

| Name | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `as` | `ElementType` | No | `'div'` | Element type for polymorphic rendering |
| `forceMount` | `boolean` | No | `false` | Force content to remain mounted when closed |
| `id` | `string` | No | Auto-generated | Content element ID (automatically set for ARIA) |
| `hidden` | `boolean \| 'until-found'` | No | Auto-managed | Visibility state (automatically managed) |
| `children` | `ReactNode` | No | - | Content to be shown/hidden |
| `...rest` | `HTMLAttributes` | No | - | Additional HTML attributes |

**Content Visibility:**
- When `forceMount={false}` (default): Content unmounted when closed
- When `forceMount={true}`: Content stays mounted with `hidden="until-found"` for findability

**Polymorphic Support:** Both `Trigger` and `Content` components support the `as` prop for rendering as different elements.

**Ref Forwarding:** All components forward refs to their underlying DOM elements.

**Controlled/Uncontrolled:** Supports both controlled (`open` + `onOpenChange`) and uncontrolled (`defaultOpen`) patterns.

## 3. Behavior Matrix

| State | Trigger | Result | ARIA/DOM Update |
|-------|---------|--------|-----------------|
| Closed | Click trigger | Opens content | `aria-expanded="true"`, content visible |
| Closed | Enter/Space on trigger | Opens content | `aria-expanded="true"`, content visible, `preventDefault()` called |
| Open | Click trigger | Closes content | `aria-expanded="false"`, content hidden |
| Open | Enter/Space on trigger | Closes content | `aria-expanded="false"`, content hidden, `preventDefault()` called |
| Disabled | Any interaction | No change | No updates, interactions prevented |
| Open | Content rendered | Content visible | `hidden` attribute removed if present |
| Closed | Content unmounted (default) | Content not in DOM | Content element removed |
| Closed | Content force mounted | Content hidden | `hidden="until-found"` or `hidden={true}` applied |

## 4. Accessibility

### Roles
- **Trigger**: Inherits `button` role (semantic button element or explicit role)
- **Content**: No specific role required (region/group if semantically appropriate)

### Keyboard Navigation
- **Enter/Space on trigger**: Toggle open/closed state
- **Space key handling**: Must call `preventDefault()` to prevent page scrolling
- **Tab**: Move focus to/from trigger (content is not focusable container)
- **Focus management**: Focus remains on trigger after toggling

### Focus Management
- Trigger receives focus indicator when focused
- Focus is not moved into content when opened
- Focus stays on trigger after state changes
- Disabled state prevents focus (semantic elements) or removes from tab order (non-semantic)

### Screen Reader Announcements
- **State changes**: `aria-expanded` announces "expanded" or "collapsed"
- **Content relationship**: `aria-controls` links trigger to content
- **Accessible naming**: Trigger must have accessible name via `aria-label`, `aria-labelledby`, or text content

### Name/Role/Value Exposure
- **Name**: Trigger accessible name from content, `aria-label`, or `aria-labelledby`
- **Role**: Button role for trigger element
- **Value**: Current state via `aria-expanded` (true/false)

### ARIA Implementation
```tsx
// Trigger element (semantic button)
<button
  aria-expanded={isOpen}
  aria-controls={contentId}
  disabled={disabled} // Use native disabled for semantic buttons
>

// Trigger element (non-semantic with 'as' prop)
<div
  role="button"
  aria-expanded={isOpen}
  aria-controls={contentId}
  aria-disabled={disabled}
  tabIndex={disabled ? -1 : 0}
>

// Content element  
<div
  id={contentId}
  hidden={!isOpen && !forceMount ? true : undefined}
  // OR hidden="until-found" when closed and forceMount=true
>
```

**Key Implementation Notes:**
- Use `role="button"` for non-semantic trigger elements
- `preventDefault()` must be called on Space keydown to prevent scrolling
- Native `disabled` for `<button>` elements, `aria-disabled` + `tabIndex={-1}` for others

## 5. Implementation Architecture

### State Hooks Design
```tsx
// Internal state management
const useCollapsibleState = (props: {
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  disabled?: boolean;
}) => {
  const [internalOpen, setInternalOpen] = useState(defaultOpen ?? false);
  const isControlled = open !== undefined;
  const isOpen = isControlled ? open : internalOpen;
  
  const toggle = useCallback(() => {
    if (disabled) return;
    const nextOpen = !isOpen;
    if (!isControlled) setInternalOpen(nextOpen);
    onOpenChange?.(nextOpen);
  }, [disabled, isOpen, isControlled, onOpenChange]);
  
  return { isOpen, toggle, disabled };
};
```

### Context Requirements
```tsx
// CollapsibleContext for sharing state between components
interface CollapsibleContextValue {
  isOpen: boolean;
  toggle: () => void;
  disabled: boolean;
  triggerId: string;
  contentId: string;
}

const CollapsibleContext = createContext<CollapsibleContextValue | null>(null);

// Context optimization to prevent unnecessary re-renders
const CollapsibleProvider = ({ value, children }: { 
  value: CollapsibleContextValue; 
  children: ReactNode; 
}) => {
  const memoizedValue = useMemo(() => value, [
    value.isOpen,
    value.toggle,
    value.disabled,
    value.triggerId,
    value.contentId,
  ]);

  return (
    <CollapsibleContext.Provider value={memoizedValue}>
      {children}
    </CollapsibleContext.Provider>
  );
};
```

### Ref Forwarding Strategy
- All components use `forwardRef` to expose DOM references
- Trigger ref for focus management and keyboard handling
- Content ref for measuring and animations (external styling)

### Event System
- `onOpenChange` callback for state changes
- Standard DOM events (click, keydown) handled internally
- Event delegation not required (direct element event binding)
- Space keydown must call `event.preventDefault()` to prevent scrolling

### Hidden Until Found Implementation
```tsx
// Content visibility logic
const getHiddenAttribute = (isOpen: boolean, forceMount: boolean) => {
  if (isOpen) return undefined; // Content visible
  if (!forceMount) return undefined; // Content unmounted, no hidden needed
  
  // Content force mounted but closed - use until-found for findability
  if (typeof document !== 'undefined' && 'onbeforematch' in document) {
    return 'until-found'; // Modern browsers with findability support
  }
  return true; // Fallback to standard hidden
};

// Usage in Content component
<div 
  hidden={getHiddenAttribute(isOpen, forceMount)}
  onBeforeMatch={forceMount && !isOpen ? () => onOpenChange?.(true) : undefined}
>
```

### SSR/CSR Safety and Deterministic IDs
```tsx
// Use deterministic ID generation
const useId = () => {
  const [id] = useState(() => 
    typeof window === 'undefined' 
      ? `collapsible-${Math.random().toString(36).substr(2, 9)}`
      : `collapsible-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
  );
  return id;
};

// Generate stable IDs for ARIA relationships
const baseId = useId();
const triggerId = `${baseId}-trigger`;
const contentId = `${baseId}-content`;
```

## 6. Styling & Data Attributes

### Required Data Attributes
All components automatically receive data attributes for styling:

**Root Component:**
- `data-state`: `"open" | "closed"`
- `data-disabled`: Present when disabled

**Trigger Component:**
- `data-state`: `"open" | "closed"`
- `data-disabled`: Present when disabled
- `data-focus`: Present when focused (via keyboard or programmatically)
- `data-hover`: Present when hovered (mouse interaction)
- `data-active`: Present when in pressed/active state

**Content Component:**
- `data-state`: `"open" | "closed"`
- `data-disabled`: Present when disabled (inherited from root)

### CSS Custom Properties
The content component exposes CSS custom properties for smooth animations:

- `--glide-collapsible-content-width`: Current content width in pixels
- `--glide-collapsible-content-height`: Current content height in pixels

These properties are automatically updated and can be used for height/width transitions.

### Usage Examples
```css
/* Styling the trigger based on state */
[data-state="open"] .trigger-icon {
  transform: rotate(90deg);
}

/* Interaction state styling */
[data-focus] {
  outline: 2px solid blue;
  outline-offset: 2px;
}

[data-hover]:not([data-disabled]) {
  background-color: var(--hover-bg);
}

[data-active]:not([data-disabled]) {
  transform: scale(0.98);
}

/* Styling disabled state */
[data-disabled] {
  opacity: 0.5;
  cursor: not-allowed;
  pointer-events: none;
}

/* Enhanced content transitions using CSS custom properties */
.collapsible-content {
  overflow: hidden;
  transition: height 200ms ease-out;
}

[data-state="closed"] .collapsible-content {
  height: 0;
}

[data-state="open"] .collapsible-content {
  height: var(--glide-collapsible-content-height);
}

/* Alternative: Width-based transitions */
.collapsible-content-horizontal {
  overflow: hidden;
  transition: width 200ms ease-out;
}

[data-state="closed"] .collapsible-content-horizontal {
  width: 0;
}

[data-state="open"] .collapsible-content-horizontal {
  width: var(--glide-collapsible-content-width);
}

/* Fade transition for content */
[data-state="closed"] .content-fade {
  opacity: 0;
  transform: translateY(-8px);
  transition: opacity 150ms ease-out, transform 150ms ease-out;
}

[data-state="open"] .content-fade {
  opacity: 1;
  transform: translateY(0);
  transition: opacity 200ms ease-out, transform 200ms ease-out;
}
```

### React Usage Examples
```tsx
// Basic usage
<Collapsible.Root>
  <Collapsible.Trigger>
    Toggle Content
  </Collapsible.Trigger>
  <Collapsible.Content>
    Content to show/hide
  </Collapsible.Content>
</Collapsible.Root>

// Controlled usage
const [isOpen, setIsOpen] = useState(false);
<Collapsible.Root open={isOpen} onOpenChange={setIsOpen}>
  <Collapsible.Trigger>
    {isOpen ? 'Hide' : 'Show'} Details
  </Collapsible.Trigger>
  <Collapsible.Content>
    Controlled content
  </Collapsible.Content>
</Collapsible.Root>

// Polymorphic usage with custom elements
<Collapsible.Root>
  <Collapsible.Trigger as="div" role="button" tabIndex={0}>
    Custom trigger element
  </Collapsible.Trigger>
  <Collapsible.Content as="section">
    Semantic content section
  </Collapsible.Content>
</Collapsible.Root>
```

## 7. Test Coverage Plan

### Unit Tests
- State management (controlled/uncontrolled)
- Props validation and default values
- Event handler execution
- ID generation and uniqueness
- Context value propagation
- Edge cases: Rapid toggling, concurrent state changes
- Polymorphic `as` prop with different element types

### Accessibility Tests
- ARIA attributes correctness (`aria-expanded`, `aria-controls`)
- Keyboard navigation (Enter, Space, Tab)
- Space key `preventDefault()` behavior validation
- Screen reader announcements (jest-axe integration)
- Focus management and indicators
- Disabled state behavior (native vs aria-disabled)
- Role assignment for non-semantic elements

### Integration Tests
- Component composition and context sharing
- State synchronization between trigger and content
- Event bubbling and propagation
- forceMount behavior and `hidden="until-found"` implementation
- SSR rendering without hydration mismatches
- CSS custom properties updates during state changes

### Performance Tests
- Context re-render optimization validation
- Memory leak prevention (event listeners, timeouts)
- Large content handling and animation performance
- Rapid interaction stress testing

### Test Files Structure
```
__tests__/
├── Collapsible.test.tsx              # Core functionality
├── Collapsible.a11y.test.tsx         # Accessibility compliance
├── Collapsible.integration.test.tsx  # Component integration
└── Collapsible.performance.test.tsx  # Performance and edge cases
```

## 8. Constraints

### Zero Styling Requirements
- No CSS imports or inline styles
- No visual styling opinions
- Behavior and state management only
- Styling via data attributes and CSS classes

### Data Attribute Styling
- All visual states exposed via `data-*` attributes
- CSS-in-JS and CSS frameworks can target these attributes
- No className props needed (external styling responsibility)

### Tree-Shakeable Exports
- Named exports only (`Collapsible.Root`, `Collapsible.Trigger`, `Collapsible.Content`)
- No default exports
- Each component can be imported individually

### TypeScript Strict Mode
- Explicit types for all props and interfaces
- No `any` types
- Strict null checks and type safety
- Comprehensive type exports for consumers

### WCAG 2.2 AA Compliance
- All interaction patterns follow ARIA Authoring Practices
- Complete keyboard navigation support
- Screen reader compatibility
- Focus management requirements
- Color and contrast agnostic (no styling)

### Controlled/Uncontrolled Support
- Both patterns fully supported
- Clear controlled vs uncontrolled detection
- Warning for switching between modes (development)
- Consistent API patterns with React ecosystem

## Troubleshooting

### Common Issues

**Issue: Content doesn't animate properly**
- Solution: Ensure CSS transitions target the correct data attributes
- Use CSS custom properties (`--glide-collapsible-content-height`) for smooth height transitions
- Set `overflow: hidden` on animating container

**Issue: Focus lost after toggle**
- Solution: Focus should remain on trigger after state change
- Check that disabled state doesn't interfere with focus management
- Verify `tabIndex` is properly managed for non-semantic elements

**Issue: Screen reader not announcing state changes**
- Solution: Ensure `aria-expanded` is properly toggled
- Verify `aria-controls` links trigger to content
- Check that content has stable `id` attribute

**Issue: Space key scrolls page when pressed on trigger**
- Solution: Implement `event.preventDefault()` on Space keydown
- Only prevent default for Space, not Enter key
- Apply to both semantic and non-semantic trigger elements

**Issue: Performance issues with frequent toggling**
- Solution: Use `useMemo` for context value optimization
- Consider `React.memo` for child components if needed
- Avoid complex computations in render cycles

**Issue: SSR hydration mismatches**
- Solution: Use deterministic ID generation strategy
- Ensure server and client generate same IDs
- Test with different server/client timing scenarios

### Performance Considerations

- **Context optimization**: Memoize context values to prevent unnecessary re-renders
- **Animation performance**: Use CSS transforms and opacity for better performance than layout properties
- **Memory management**: Ensure event listeners are properly cleaned up on unmount
- **Large content**: Consider virtualization for very large collapsible content

## 9. Migration & Implementation Checklist

### Migration Guidance
From existing disclosure/collapsible implementations:

**From styled components:**
1. Remove all styling props and CSS dependencies
2. Add data attributes for external styling
3. Update trigger to use compound pattern
4. Migrate state management to controlled/uncontrolled pattern

**From unstyled headless libraries:**
1. Replace context provider with `Collapsible.Root`
2. Update trigger component to `Collapsible.Trigger`
3. Update content wrapper to `Collapsible.Content`
4. Verify ARIA attribute mapping
5. Test keyboard navigation compatibility

### Implementation Checklist

#### Core Functionality
- [ ] `useCollapsibleState` hook with controlled/uncontrolled support
- [ ] `CollapsibleContext` for state sharing
- [ ] `Collapsible.Root` context provider component
- [ ] `Collapsible.Trigger` button component with keyboard handling
- [ ] `Collapsible.Content` content wrapper with visibility management

#### Accessibility Implementation
- [ ] ARIA attributes (`aria-expanded`, `aria-controls`, `aria-disabled`)
- [ ] Keyboard navigation (Enter, Space key handling with `preventDefault()`)
- [ ] Focus management and visible focus indicators  
- [ ] Screen reader compatibility testing
- [ ] jest-axe integration with zero violations
- [ ] Disabled semantics (native `disabled` vs `aria-disabled` + `tabIndex`)
- [ ] Role assignment for polymorphic non-semantic elements

#### TypeScript & API
- [ ] Strict TypeScript definitions for all components
- [ ] Polymorphic component support (`as` prop)
- [ ] Ref forwarding for all components
- [ ] Comprehensive prop interfaces exported

#### State Management
- [ ] Controlled state support (`open` + `onOpenChange`)
- [ ] Uncontrolled state support (`defaultOpen`)
- [ ] Disabled state handling
- [ ] Development warnings for state pattern misuse

#### Styling Integration
- [ ] Data attributes for all state variants (including interaction states)
- [ ] CSS custom properties for content dimensions
- [ ] No CSS imports or styling opinions
- [ ] CSS class targeting support
- [ ] Animation-ready state transitions

#### Build & Export
- [ ] Named exports in component index
- [ ] Tree-shakeable module structure
- [ ] Zero side effects in module loading
- [ ] SSR-safe rendering with deterministic IDs

#### Testing Suite
- [ ] Unit tests for state management and props
- [ ] Accessibility tests with jest-axe
- [ ] Integration tests for compound component behavior
- [ ] Performance tests for context optimization and edge cases
- [ ] Cross-browser keyboard navigation testing
- [ ] Polymorphic component testing with different `as` props

#### Documentation & Developer Experience
- [ ] TypeScript IntelliSense support
- [ ] Component API documentation
- [ ] Usage examples for controlled/uncontrolled patterns
- [ ] React composition examples and styling patterns
- [ ] Migration guide from common alternatives
- [ ] Troubleshooting guide for common issues

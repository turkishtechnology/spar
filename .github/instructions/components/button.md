# Button — Spar Headless Instructions

## 1. Component Overview

### Purpose and Use Cases
The Button component provides a headless, accessible button primitive that can be used for triggering actions, submitting forms, opening dialogs, or performing any user-initiated command. It serves as the foundation for all clickable interactive elements that perform actions rather than navigate to new locations.

### Compound Component Structure  
Single component pattern - Button is a self-contained primitive that doesn't require compound composition. It supports polymorphic rendering via the `as` prop while maintaining semantic button behavior.

### Key Differentiators
- **Headless by Design**: Zero visual styling - behavior and accessibility only
- **Polymorphic**: Can render as `button`, `div`, `span`, or any valid HTML element while maintaining button semantics
- **Toggle Support**: Built-in toggle functionality with `aria-pressed` state management
- **Loading States**: Integrated loading state with proper screen reader announcements
- **Complete Accessibility**: Full WCAG 2.2 AA compliance with keyboard navigation and screen reader support

## 2. API

### Props Table

| Name | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `as` | `PolymorphicAs` | No | `"button"` | The element type to render as |
| `type` | `"button" \| "submit" \| "reset"` | No | `"button"` | Button type (only applies when `as="button"`) |
| `disabled` | `boolean` | No | `false` | Disables the button and makes it non-interactive |
| `autoFocus` | `boolean` | No | `false` | Whether the button should receive focus when first rendered |
| `loading` | `boolean` | No | `false` | Shows loading state with proper announcements |
| `pressed` | `boolean` | No | `undefined` | Toggle state - when defined, creates a toggle button |
| `onPressedChange` | `(pressed: boolean) => void` | No | `undefined` | Callback fired when toggle state changes |
| `loadingText` | `string` | No | `"Loading"` | Screen reader text announced during loading (should be localized) |
| `children` | `ReactNode` | No | `undefined` | Button content |
| `onClick` | `MouseEventHandler` | No | `undefined` | Click event handler |
| `onKeyDown` | `KeyboardEventHandler` | No | `undefined` | Keyboard event handler |
| `className` | `string` | No | `undefined` | CSS class names |
| `style` | `CSSProperties` | No | `undefined` | Inline styles |
| `...htmlProps` | `HTMLAttributes` | No | `undefined` | All other HTML attributes are spread to the element |

### Polymorphic Support
- **`as` prop**: Changes the underlying element while preserving button behavior
- **Ref forwarding**: Supports ref forwarding to the underlying element
- **Type safety**: TypeScript support for element-specific props based on `as` value

### Controlled/Uncontrolled Toggle
- **Controlled**: When `pressed` and `onPressedChange` are provided
- **Uncontrolled**: When only `pressed` is provided (static toggle state)
- **Regular Button**: When `pressed` is `undefined` (not a toggle button)

## 3. Behavior Matrix

| State | Trigger | Result | ARIA/DOM Update |
|-------|---------|--------|-----------------|
| `default` | Click/Enter/Space | Fires `onClick` event | Focus remains on button |
| `default` | Tab | Focuses button | `tabindex="0"` (focusable) |
| `autoFocus=true` | Component mount | Automatically receives focus | `tabindex="0"`, focus applied on mount |
| `disabled=true` | Any interaction | No action | `aria-disabled="true"`, `tabindex="-1"` |
| `loading=true` | Any interaction | No action | `aria-busy="true"`, announces loading text |
| `pressed=false` (toggle) | Click/Enter/Space | Sets `pressed=true`, fires `onPressedChange` | `aria-pressed="true"` |
| `pressed=true` (toggle) | Click/Enter/Space | Sets `pressed=false`, fires `onPressedChange` | `aria-pressed="false"` |
| Focused | Escape | Blurs button (if in modal/dialog) | Focus management context-dependent |
| Any state | Mouse hover | Visual focus indicator | CSS `:hover` via data attributes |
| Any state | Focus | Shows focus indicator | CSS `:focus-visible` via data attributes |

## 4. Accessibility

### Roles
- **Primary Role**: `button` (implicit when `as="button"`, explicit `role="button"` for other elements)
- **Toggle Button**: Uses `aria-pressed` attribute to indicate toggle state
- **Loading Button**: Uses `aria-busy` to indicate loading state

### Keyboard Navigation
- **Enter**: Activates the button
- **Space**: Activates the button  
- **Tab**: Moves focus to button (when not disabled)
- **Shift+Tab**: Moves focus away from button
- **Escape**: Context-dependent (e.g., closes containing dialog)

### Focus Management
- **Focus Indicators**: Always visible via CSS `outline` or equivalent styling hooks
- **Auto Focus**: When `autoFocus={true}`, receives focus automatically on mount
- **Focus Trap**: When disabled, removed from tab sequence (`tabindex="-1"`)
- **Focus Restoration**: After activation, focus behavior depends on action result:
  - Dialog opening: Focus moves to dialog
  - Dialog closing: Focus returns to trigger or appropriate context
  - In-place actions: Focus remains on button
  - Context changes: Focus moves to new context start

### Screen Reader Announcements
- **Button Name**: Content text, `aria-label`, or `aria-labelledby` reference
- **State Changes**: 
  - Loading: "Loading" or custom `loadingText` announced
  - Toggle: "pressed" or "not pressed" state announced
  - Disabled: "disabled" or "unavailable" announced
- **Live Regions**: Loading state changes announced via implicit `aria-busy`

### Name/Role/Value Exposure
- **Name**: Button text content, `aria-label`, or `aria-labelledby`
- **Role**: "button" 
- **Value**: Toggle buttons expose pressed state via `aria-pressed`
- **State**: Disabled (`aria-disabled`), busy (`aria-busy`), pressed (`aria-pressed`)
- **Description**: Optional `aria-describedby` for additional context

### WCAG 2.2 AA Compliance
- **4.1.2 Name, Role, Value**: All buttons have accessible names and appropriate roles
- **2.1.1 Keyboard**: Full keyboard accessibility via Enter and Space
- **2.1.2 No Keyboard Trap**: Focus management doesn't trap users
- **2.4.7 Focus Visible**: Focus indicators always visible
- **3.2.2 On Input**: Predictable behavior on activation
- **4.1.3 Status Messages**: Loading and state changes announced

## 5. Implementation Architecture

### State Management
```typescript
// Core button state
const [internalPressed, setInternalPressed] = useState<boolean>(false);

// Controlled vs uncontrolled toggle logic
const isToggle = pressed !== undefined;
const isPressed = isToggle ? pressed : internalPressed;

// Loading state management
const isInteractive = !disabled && !loading;

// Auto focus handling
useEffect(() => {
  if (autoFocus && ref.current) {
    ref.current.focus();
  }
}, [autoFocus]);
```

### Event System
```typescript
// Unified activation handler for click and keyboard
const handleActivation = useCallback((event) => {
  if (!isInteractive) return;
  
  // Toggle logic
  if (isToggle) {
    const newPressed = !isPressed;
    if (onPressedChange) {
      onPressedChange(newPressed);
    } else {
      setInternalPressed(newPressed);
    }
  }
  
  // Fire click handler
  onClick?.(event);
}, [isInteractive, isToggle, isPressed, onPressedChange, onClick]);

// Keyboard handler
const handleKeyDown = useCallback((event) => {
  if (event.key === 'Enter' || event.key === ' ') {
    event.preventDefault();
    handleActivation(event);
  }
  onKeyDown?.(event);
}, [handleActivation, onKeyDown]);
```

### Ref Forwarding Strategy
```typescript
const Button = forwardRef<HTMLElement, ButtonProps>((props, ref) => {
  // Component implementation
});
```

### Performance Optimization
```typescript
// Prevent unnecessary re-renders with stable callbacks
const handleActivation = useCallback((event) => {
  if (!isInteractive) return;
  
  // Toggle logic
  if (isToggle) {
    const newPressed = !isPressed;
    if (onPressedChange) {
      onPressedChange(newPressed);
    } else {
      setInternalPressed(newPressed);
    }
  }
  
  // Fire click handler
  onClick?.(event);
}, [isInteractive, isToggle, isPressed, onPressedChange, onClick]);

// Memoize data attributes to prevent object recreation
const dataAttributes = useMemo(() => ({
  'data-disabled': disabled ? 'true' : undefined,
  'data-loading': loading ? 'true' : undefined,
  'data-pressed': isToggle ? String(isPressed) : undefined,
  'data-autofocus': autoFocus ? 'true' : undefined,
}), [disabled, loading, isToggle, isPressed, autoFocus]);
```

### SSR/CSR Safety
- **Deterministic IDs**: No auto-generated IDs that differ between server/client
- **Initial State**: All state properly initialized to avoid hydration mismatches  
- **Conditional ARIA**: Only add `aria-pressed` when actually a toggle button
- **Loading State**: Properly handle initial loading state during hydration

## 6. Styling & Data Attributes

### State Data Attributes
```typescript
'data-disabled': disabled ? 'true' : undefined
'data-loading': loading ? 'true' : undefined  
'data-pressed': isToggle ? String(isPressed) : undefined
'data-autofocus': autoFocus ? 'true' : undefined
'data-focus-visible': // Handled by focus-visible polyfill
```

### Variant Data Attributes
```typescript
'data-variant': variant // If variant prop is added in the future
'data-size': size // If size prop is added in the future
```

### Styling Hooks
- **`[data-disabled="true"]`**: Disabled state styling
- **`[data-loading="true"]`**: Loading state styling  
- **`[data-pressed="true"]`**: Toggle button pressed state
- **`[data-pressed="false"]`**: Toggle button unpressed state
- **`[data-autofocus="true"]`**: Auto-focused button styling
- **`:hover`**: Hover state styling
- **`:focus-visible`**: Keyboard focus styling
- **`:active`**: Active/pressed styling

### CSS-in-JS Compatibility
All data attributes designed to work with CSS-in-JS libraries, CSS modules, and utility frameworks like Tailwind CSS.

## 7. Test Coverage Plan

### Unit Tests
- **Props Handling**: All props are correctly applied and forwarded
- **Auto Focus**: `autoFocus` prop correctly focuses button on mount
- **Event Handling**: Click and keyboard events trigger correct callbacks
- **Toggle Logic**: Controlled and uncontrolled toggle states work correctly  
- **State Management**: Loading, disabled, and pressed states behave correctly
- **Polymorphic Rendering**: `as` prop changes element type correctly
- **Ref Forwarding**: Refs are correctly forwarded to underlying element
- **Performance**: No unnecessary re-renders when props haven't changed
- **Localization**: Loading text accepts localized strings correctly

### Accessibility Tests  
- **ARIA Attributes**: Correct `role`, `aria-pressed`, `aria-busy`, `aria-disabled`
- **Keyboard Navigation**: Enter and Space keys activate button
- **Focus Management**: Tab order and focus indicators work correctly
- **Screen Reader**: Accessible names and state announcements
- **jest-axe**: Zero accessibility violations
- **Color Contrast**: Focus indicators meet WCAG 2.2 AA requirements

### Integration Tests
- **Form Integration**: Button correctly submits forms when `type="submit"`
- **Event Bubbling**: Events bubble correctly through DOM tree
- **Context Integration**: Works correctly within dialogs and other contexts
- **Loading States**: Integration with async operations and loading indicators
- **Toggle Groups**: Multiple toggle buttons work independently

## 8. Constraints

### Zero Styling
- **No CSS imports**: Component contains zero styling code
- **No default styles**: All visual appearance controlled by consumers
- **Behavior only**: Component provides interaction and accessibility only

### Styling via Data Attributes  
- **State exposure**: All interactive states exposed via `data-*` attributes
- **CSS targeting**: Styles applied via attribute selectors, not classes
- **Framework agnostic**: Works with any CSS methodology

### Tree-Shakeable Exports
- **Named exports**: No default export to ensure tree-shaking
- **Minimal dependencies**: Only React as peer dependency
- **Side-effect free**: No side effects during import

### TypeScript Strict Mode
- **Explicit typing**: All props and returns explicitly typed
- **Generic support**: Proper generic typing for polymorphic `as` prop
- **Type inference**: Full IntelliSense support for element-specific props

### WCAG 2.2 AA Compliant
- **Full keyboard support**: All interactions accessible via keyboard
- **Screen reader support**: Complete screen reader compatibility
- **Focus management**: Proper focus indicators and management
- **Color independence**: No reliance on color alone for state

### Controlled/Uncontrolled Support
- **Toggle flexibility**: Supports both controlled and uncontrolled toggle patterns
- **State consistency**: Internal and external state management work seamlessly
- **Warning patterns**: Appropriate warnings for state management misuse

## 9. Migration & Implementation Checklist

### Migration Guidance
- **From HTML Button**: Replace `<button>` with `<Button>` - maintains same API
- **From Other Libraries**: Map existing button props to Spar Button props
- **Styling Migration**: Replace CSS classes with data attribute selectors
- **Event Handling**: `onClick` remains the same, keyboard events handled internally

### Pre-Implementation Checklist
- [ ] Read W3C ARIA Button Pattern documentation
- [ ] Review existing button implementations in codebase
- [ ] Confirm TypeScript configuration supports generic components
- [ ] Verify testing setup includes jest-axe for accessibility testing

### Implementation Checklist
- [ ] Core button component with polymorphic `as` prop
- [ ] Auto focus functionality with `autoFocus` prop
- [ ] Toggle button functionality with `pressed` prop
- [ ] Loading state with `loading` prop and proper announcements
- [ ] Disabled state with proper ARIA attributes
- [ ] Complete keyboard event handling (Enter, Space)
- [ ] Ref forwarding to underlying element
- [ ] All data attributes for styling hooks
- [ ] Performance optimization with memoized callbacks and attributes
- [ ] TypeScript interfaces with proper generic constraints
- [ ] JSDoc documentation for all props
- [ ] Localization support for loading text

### Post-Implementation Checklist  
- [ ] Unit tests cover all props and behavior combinations
- [ ] Auto focus behavior tested across different scenarios
- [ ] Accessibility tests pass with jest-axe (zero violations)
- [ ] Manual keyboard testing confirms all interactions work
- [ ] Screen reader testing confirms proper announcements
- [ ] Integration tests verify form submission and event handling
- [ ] Performance testing confirms no unnecessary re-renders
- [ ] Bundle size analysis confirms tree-shaking works correctly
- [ ] Localization testing with different loading text values

### Quality Gates
- [ ] TypeScript compilation with zero errors
- [ ] ESLint passes with zero warnings  
- [ ] All tests pass (unit, accessibility, integration)
- [ ] Manual accessibility audit completed
- [ ] Code review approved
- [ ] Documentation updated with usage examples

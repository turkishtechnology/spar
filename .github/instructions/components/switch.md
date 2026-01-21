# Switch — Spar Headless Instructions

## 1. Component Overview

The Switch component provides a headless boolean toggle control that allows users to switch between on and off states. It offers the same semantics and behavior as native checkbox elements but with switch-specific visual and accessibility patterns.

### Purpose and Use Cases
- Toggle application settings and preferences
- Enable/disable features or modes 
- Binary choice controls in forms
- Status indicators that users can modify

### Compound Component Structure
The Switch follows a simple single-component pattern rather than compound structure:
- `Switch` - The main interactive control element

### Key Differentiators
- Provides switch-specific ARIA semantics (`role="switch"`)
- Optimized for binary toggle interactions
- Built-in form integration with hidden input elements
- Comprehensive keyboard navigation support
- Uncontrolled and controlled state management

## 2. API

### Switch Props

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `as` | `PolymorphicAs` | No | `"button"` | The element or component to render as |
| `checked` | `boolean` | No | `undefined` | Controlled checked state |
| `defaultChecked` | `boolean` | No | `false` | Default checked state for uncontrolled usage |
| `onChange` | `(checked: boolean) => void` | No | `undefined` | Callback fired when the checked state changes |
| `disabled` | `boolean` | No | `false` | Whether the switch is disabled |
| `name` | `string` | No | `undefined` | Form input name for form integration |
| `value` | `string` | No | `"on"` | Form input value when checked |
| `form` | `string` | No | `undefined` | Form ID to associate with |
| `required` | `boolean` | No | `false` | Whether the switch is required in forms |
| `readOnly` | `boolean` | No | `false` | Whether the switch is read-only |
| `autoFocus` | `boolean` | No | `false` | Whether to auto-focus on mount |
| `id` | `string` | No | `undefined` | HTML id attribute |
| `aria-label` | `string` | No | `undefined` | Accessible name for the switch |
| `aria-labelledby` | `string` | No | `undefined` | ID of element that labels the switch |
| `aria-describedby` | `string` | No | `undefined` | ID of element that describes the switch |
| `children` | `ReactNode \| ((state: SwitchRenderProps) => ReactNode)` | No | `undefined` | Content to display inside the switch or render function for render props pattern |

### SwitchRenderProps

| Name | Type | Description |
|------|------|-------------|
| `checked` | `boolean` | Whether the switch is currently checked |
| `setChecked` | `(checked: boolean) => void` | Function to programmatically set the checked state |
| `disabled` | `boolean` | Whether the switch is disabled |
| `readOnly` | `boolean` | Whether the switch is read-only |
| `isFocused` | `boolean` | Whether the switch currently has focus |
| `isHovered` | `boolean` | Whether the switch is being hovered |
| `isPressed` | `boolean` | Whether the switch is being pressed |

### Polymorphic Support
- Supports `as` prop for rendering as different elements
- Proper ref forwarding with `React.forwardRef`
- Type-safe polymorphic props with generic constraints

### Controlled/Uncontrolled
- **Controlled**: Provide `checked` and `onChange` props
- **Uncontrolled**: Omit `checked`, optionally provide `defaultChecked`

## 3. Behavior Matrix

| State | Trigger | Result | ARIA/DOM Update |
|-------|---------|--------|-----------------|
| Unchecked | Click/Space/Enter | Becomes checked | `aria-checked="true"`, `data-checked` added |
| Checked | Click/Space/Enter | Becomes unchecked | `aria-checked="false"`, `data-checked` removed |
| Focused | Tab | Receives focus | `data-focus` added, focus styles applied |
| Blurred | Tab away/click elsewhere | Loses focus | `data-focus` removed |
| Disabled | Any interaction | No state change | `aria-disabled="true"`, `data-disabled` added |
| Read-only | Click/Space/Enter | No state change | `aria-readonly="true"`, `data-readonly` added |
| Hovered | Mouse enter | Visual feedback | `data-hover` added |
| Active/Pressed | Mouse down/Space down | Visual feedback | `data-active` added |
| Form submit | Submit event | Value included if checked | Hidden input participates in form data |

## 4. Accessibility

### Roles
- Primary role: `role="switch"` 
- Semantic HTML: Uses `<button>` element by default for built-in keyboard support
- Hidden input: `<input type="checkbox">` for form integration and screen reader compatibility

### Keyboard Navigation
- **Space**: Toggle switch state
- **Enter**: Toggle switch state (when focus is on switch)
- **Tab**: Move focus to switch
- **Shift+Tab**: Move focus away from switch

### Focus Management
- Switch is focusable with `tabindex="0"` (unless disabled)
- Clear visible focus indicators required via `data-focus` attribute
- `autoFocus` prop supports automatic focus on mount
- Focus restoration not applicable (single component)

### Screen Reader Announcements
- Switch state announced as "on" or "off" via `aria-checked`
- Label association via `aria-labelledby` or `aria-label`
- Description association via `aria-describedby`
- Form errors announced via `aria-invalid` and `aria-errormessage`
- State changes announced automatically due to `role="switch"`

### Name/Role/Value Exposure
- **Name**: From `aria-label`, `aria-labelledby`, or associated label element
- **Role**: `switch` explicitly set
- **Value**: Current state via `aria-checked="true|false"`
- **State**: Additional states via `aria-disabled`, `aria-readonly`, `aria-invalid`

### ARIA Authoring Practices Guide Compliance
Based on [ARIA APG Switch Pattern](https://www.w3.org/WAI/ARIA/apg/patterns/switch/):
- Uses `role="switch"` 
- Implements `aria-checked` state management
- Supports keyboard activation with Space and Enter
- Provides accessible name via label association
- Handles disabled and read-only states appropriately

## 5. Implementation Architecture

### State Hooks Design
```typescript
interface UseSwitchProps {
  checked?: boolean;
  defaultChecked?: boolean;
  onChange?: (checked: boolean) => void;
  disabled?: boolean;
  readOnly?: boolean;
}

function useSwitch(props: UseSwitchProps) {
  // Internal state management for controlled/uncontrolled
  // Event handlers for click, keyboard, and focus
  // ARIA attribute generation
  // Form integration logic
}
```

### Context Requirements
- No context required (single component)
- Optional integration with form field contexts for label/description association

### Ref Forwarding Strategy
- `React.forwardRef` for proper ref forwarding to DOM element
- Support for both element refs and component refs via polymorphic `as` prop
- Internal ref management for hidden input element

### Event System
- Synthetic event handling for click, keydown, focus, blur
- Event normalization across different interaction methods
- Proper event bubbling and propagation control
- Form submission integration via hidden input

### SSR/CSR Safety and Deterministic IDs
- `useId` hook for generating unique IDs when needed
- No client-side only state that breaks hydration
- Deterministic rendering for server and client
- Proper `suppressHydrationWarning` when necessary

## 6. Styling & Data Attributes

### Required Data Attributes

#### State Attributes
- `data-checked`: Present when switch is checked
- `data-disabled`: Present when switch is disabled  
- `data-readonly`: Present when switch is read-only
- `data-focus`: Present when switch has keyboard focus
- `data-hover`: Present when switch is hovered
- `data-active`: Present when switch is being pressed/activated
- `data-invalid`: Present when switch has validation errors
- `data-required`: Present when switch is required

#### Values
All data attributes are boolean (present/absent) except:
- `data-state`: `"checked" | "unchecked"` for explicit state styling

### CSS Selector Examples
```css
/* Base switch styles */
[data-switch] { }

/* Checked state */
[data-switch][data-checked] { }

/* Disabled state */
[data-switch][data-disabled] { }

/* Focus state */
[data-switch][data-focus] { }

/* Combined states */
[data-switch][data-checked][data-focus] { }
```

## 7. Test Coverage Plan

### Unit Tests
- Controlled and uncontrolled state management
- Event handler triggering (click, keyboard)
- Prop validation and TypeScript compliance
- Default behavior and edge cases
- Form integration with hidden input
- ARIA attribute generation
- Polymorphic rendering with `as` prop

### Accessibility Tests
- `jest-axe` automated accessibility testing
- Keyboard navigation verification
- Screen reader announcement testing
- Focus management validation
- ARIA attribute correctness
- WCAG 2.2 AA compliance verification

### Integration Tests
- Form submission data inclusion
- Label association functionality
- Description association via `aria-describedby`
- Error state handling and announcements
- Context integration (if applicable)

## 8. Constraints

### Zero Styling
- No CSS imports or style objects
- All visual styling via CSS using data attributes
- Component provides only behavior and accessibility

### Data Attributes for Styling
- Visual state communicated via `data-*` attributes
- No inline styles or CSS classes applied by component
- Consistent attribute naming following Spar conventions

### Tree-shakeable Exports
- Named exports only, no default exports
- No side effects on import
- Pure component implementation

### TypeScript Strict Mode
- Explicit type definitions for all props and state
- No `any` types used
- Proper generic constraints for polymorphic behavior
- Comprehensive type coverage

### WCAG 2.2 AA Compliant
- Full keyboard accessibility
- Screen reader compatibility
- Focus management
- Color-independent functionality
- Proper semantic markup

### Controlled/Uncontrolled Support
- Both patterns fully supported
- Automatic detection of controlled vs uncontrolled
- Proper warnings for pattern violations
- Consistent behavior across patterns

## 9. Migration & Implementation Checklist

### Migration Guidance
For teams migrating from other switch implementations:

#### From Native Checkbox
```typescript
// Before
<input type="checkbox" checked={checked} onChange={e => setChecked(e.target.checked)} />

// After  
<Switch checked={checked} onChange={setChecked} />
```

#### From Other Headless Libraries
- Map `isSelected`/`selected` props to `checked`
- Map `onSelectionChange` to `onChange`
- Update ARIA attribute targeting in CSS
- Verify keyboard interaction consistency

### Implementation Checklist

#### Core Functionality
- [ ] Controlled state management with `checked` and `onChange`
- [ ] Uncontrolled state management with `defaultChecked`
- [ ] Proper event handling for click and keyboard
- [ ] Form integration with hidden input element
- [ ] Disabled and read-only state support

#### Accessibility Implementation
- [ ] `role="switch"` applied to interactive element
- [ ] `aria-checked` state management
- [ ] Keyboard navigation (Space, Enter, Tab)
- [ ] Focus management and visible indicators
- [ ] Screen reader announcements
- [ ] Label association support
- [ ] Error state handling

#### Data Attributes
- [ ] `data-checked` for checked state
- [ ] `data-disabled` for disabled state  
- [ ] `data-focus` for focus state
- [ ] `data-hover` for hover state
- [ ] `data-active` for active/pressed state
- [ ] Additional state attributes as needed

#### TypeScript & API
- [ ] Proper type definitions
- [ ] Polymorphic `as` prop support
- [ ] Ref forwarding implementation
- [ ] Props interface documentation
- [ ] Generic type constraints

#### Testing
- [ ] Unit tests for all behaviors
- [ ] Accessibility tests with jest-axe
- [ ] Keyboard navigation tests
- [ ] Form integration tests
- [ ] Edge case coverage

#### Documentation & Examples
- [ ] API documentation
- [ ] Usage examples
- [ ] Migration guide
- [ ] Accessibility guidelines
- [ ] Styling examples with data attributes

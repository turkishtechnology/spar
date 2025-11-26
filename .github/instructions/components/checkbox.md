# Checkbox — Spar Headless Instructions

## 1. Component Overview

The Checkbox component provides a headless, accessible checkbox implementation that supports both dual-state (checked/unchecked) and tri-state (checked/unchecked/indeterminate) functionality. It follows the WAI-ARIA Checkbox Pattern and provides complete keyboard navigation and screen reader support.

**Purpose and use cases:**
- Form controls for binary choices (agree/disagree, enable/disable)
- Multi-selection in lists or grids
- Tri-state controls for managing groups of related checkboxes
- Custom styled checkboxes that maintain accessibility

**Compound component structure:**
- Single component design (no sub-components needed)
- Can be used with external Field, Label, and Description components
- Supports polymorphic rendering via `as` prop

**Key differentiators:**
- Zero styling opinions - purely behavioral
- Full accessibility compliance (WCAG 2.2 AA)
- Supports both controlled and uncontrolled modes
- Built-in indeterminate state support
- Form integration with hidden input synchronization

## 2. API

### Checkbox Props

| Name | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `as` | `ElementType` | No | `"span"` | The element or component to render as |
| `checked` | `boolean \| "indeterminate"` | No | `undefined` | Controlled checked state. When provided, component becomes controlled |
| `defaultChecked` | `boolean \| "indeterminate"` | No | `false` | Default checked state for uncontrolled usage |
| `onChange` | `(checked: boolean \| "indeterminate") => void` | No | `undefined` | Callback fired when checked state changes |
| `disabled` | `boolean` | No | `false` | Whether the checkbox is disabled |
| `readOnly` | `boolean` | No | `false` | Whether the checkbox is read-only |
| `required` | `boolean` | No | `false` | Whether the checkbox is required in forms |
| `name` | `string` | No | `undefined` | Name attribute for form submission |
| `value` | `string` | No | `"on"` | Value sent in form data when checked |
| `form` | `string` | No | `undefined` | ID of the form this checkbox belongs to |
| `autoFocus` | `boolean` | No | `false` | Whether to focus the checkbox on mount |
| `tabIndex` | `number` | No | `0` | Tab index for keyboard navigation |
| `id` | `string` | No | Auto-generated | Unique identifier |
| `className` | `string` | No | `undefined` | CSS class names |
| `style` | `CSSProperties` | No | `undefined` | Inline styles |
| `onFocus` | `FocusEventHandler` | No | `undefined` | Focus event handler |
| `onBlur` | `FocusEventHandler` | No | `undefined` | Blur event handler |
| `onClick` | `MouseEventHandler` | No | `undefined` | Click event handler |
| `onKeyDown` | `KeyboardEventHandler` | No | `undefined` | Keydown event handler |
| `children` | `ReactNode \| ((state: CheckboxRenderProps) => ReactNode)` | No | `undefined` | Children content or render function |

### CheckboxRenderProps

| Name | Type | Description |
|------|------|-------------|
| `checked` | `boolean \| "indeterminate"` | Current checked state |
| `disabled` | `boolean` | Whether the checkbox is disabled |
| `focused` | `boolean` | Whether the checkbox is focused |
| `hovered` | `boolean` | Whether the checkbox is hovered |
| `pressed` | `boolean` | Whether the checkbox is being pressed |

**Polymorphic Support:** Component supports the `as` prop for rendering as different elements.
**Ref Forwarding:** Forward refs to the underlying DOM element.
**Controlled/Uncontrolled:** Supports both patterns - controlled when `checked` is provided, uncontrolled otherwise.

## 3. Behavior Matrix

| State | Trigger | Result | ARIA/DOM Update |
|-------|---------|--------|-----------------|
| Unchecked | Click | Check | `aria-checked="true"`, `data-checked` added |
| Unchecked | Space key | Check | `aria-checked="true"`, `data-checked` added |
| Unchecked | Enter key | Submit form (if in form) | No state change |
| Checked | Click | Uncheck | `aria-checked="false"`, `data-checked` removed |
| Checked | Space key | Uncheck | `aria-checked="false"`, `data-checked` removed |
| Indeterminate | Click | Check | `aria-checked="true"`, `data-checked` added, `data-indeterminate` removed |
| Indeterminate | Space key | Check | `aria-checked="true"`, `data-checked` added, `data-indeterminate` removed |
| Any state | Focus | Gain focus | `data-focus` added |
| Any state | Blur | Lose focus | `data-focus` removed |
| Any state | Mouse enter | Hover state | `data-hover` added |
| Any state | Mouse leave | Normal state | `data-hover` removed |
| Any state | Mouse down | Pressed state | `data-active` added |
| Any state | Mouse up | Normal state | `data-active` removed |
| Disabled | Any interaction | No change | No updates, interactions ignored |

## 4. Accessibility

### Roles
- **checkbox**: Applied to the main element to identify it as a checkbox control
- All child elements are presentational (descendants cannot have semantic roles)

### Keyboard Interactions
- **Space**: Toggles the checkbox between checked and unchecked states
- **Enter**: Submits the parent form (if checkbox is within a form)
- **Tab**: Moves focus to the checkbox
- **Shift+Tab**: Moves focus away from the checkbox

### Focus Management
- Checkbox must be focusable (`tabindex="0"` when not disabled)
- Clear visible focus indicators required (`data-focus` attribute for styling)
- Focus is never trapped or moved automatically
- When disabled with `accessibleWhenDisabled=true`, remains focusable but non-interactive

### Screen Reader Announcements
- Checkbox role and current state (checked/unchecked/indeterminate) announced on focus
- State changes announced immediately when toggled
- Label association via `aria-labelledby` or `aria-label`
- Description association via `aria-describedby` when provided
- Error state announced via `aria-invalid` and `aria-errormessage`

### ARIA Attributes
- **aria-checked**: `"true"` | `"false"` | `"mixed"` (for indeterminate)
- **aria-disabled**: `"true"` when disabled
- **aria-invalid**: `"true"` when validation fails
- **aria-required**: `"true"` when required
- **aria-describedby**: References description element ID
- **aria-labelledby**: References label element ID
- **aria-label**: Provides accessible name when no visible label

### Name/Role/Value Exposure
- **Name**: Provided by `aria-label`, `aria-labelledby`, or visible text content
- **Role**: Always "checkbox"
- **Value**: Current checked state (checked/unchecked/indeterminate)

## 5. Implementation Architecture

### State Management
```typescript
interface CheckboxState {
  checked: boolean | "indeterminate";
  focused: boolean;
  hovered: boolean;
  pressed: boolean;
}

const useCheckboxState = (props: CheckboxProps) => {
  // Controlled vs uncontrolled logic
  // State change handlers
  // Event management
};
```

### Context Requirements
- No context required - self-contained component
- Can integrate with external Form/Field contexts if available

### Ref Forwarding Strategy
- Forward ref to the root element (span/button/div)
- Expose imperative methods: `focus()`, `blur()`, `click()`

### Event System
- Synthetic event handling for cross-browser compatibility
- Keyboard events: Space and Enter key handling
- Mouse events: Click, hover, active states
- Focus events: Focus and blur management
- Custom onChange callback with new checked value

### SSR/CSR Safety
- Generate deterministic IDs using useId hook or provided ID
- No client-only APIs in initial render
- Hydration-safe state management

## 6. Styling & Data Attributes

### Required Data Attributes

| Attribute | Values | Description |
|-----------|---------|-------------|
| `data-checked` | `"true"` \| `undefined` | Present when checkbox is checked |
| `data-indeterminate` | `"true"` \| `undefined` | Present when checkbox is indeterminate |
| `data-disabled` | `"true"` \| `undefined` | Present when checkbox is disabled |
| `data-focus` | `"true"` \| `undefined` | Present when checkbox has focus |
| `data-hover` | `"true"` \| `undefined` | Present when checkbox is hovered |
| `data-active` | `"true"` \| `undefined` | Present when checkbox is being pressed |
| `data-invalid` | `"true"` \| `undefined` | Present when checkbox has validation errors |
| `data-required` | `"true"` \| `undefined` | Present when checkbox is required |

### State-based Styling Examples
```css
/* Basic checkbox styling */
.checkbox {
  cursor: pointer;
}

/* Checked state */
.checkbox[data-checked] {
  background-color: blue;
}

/* Indeterminate state */
.checkbox[data-indeterminate] {
  background-color: gray;
}

/* Disabled state */
.checkbox[data-disabled] {
  opacity: 0.5;
  cursor: not-allowed;
}

/* Focus state */
.checkbox[data-focus] {
  outline: 2px solid blue;
  outline-offset: 2px;
}

/* Combined states */
.checkbox[data-checked][data-disabled] {
  background-color: lightgray;
}
```

## 7. Test Coverage Plan

### Unit Tests
- **State Management**
  - Controlled vs uncontrolled behavior
  - Default state initialization
  - State transitions (unchecked → checked → indeterminate)
  - Form value synchronization

- **Event Handling**
  - Click events toggle state
  - Space key toggles state
  - Enter key behavior in forms
  - Focus/blur events
  - Custom event handler calls

- **Props Validation**
  - Polymorphic rendering with `as` prop
  - Ref forwarding works correctly
  - Disabled state prevents interactions
  - Required/invalid state handling

### Accessibility Tests
- **jest-axe Integration**
  - Zero accessibility violations
  - Proper ARIA attribute usage
  - Keyboard navigation support

- **Screen Reader Testing**
  - Role announcement ("checkbox")
  - State announcement (checked/unchecked/indeterminate)
  - Label association verification
  - Error state announcements

- **Keyboard Navigation**
  - Tab navigation works
  - Space key toggles state
  - Enter key submits forms
  - Focus indicators visible

### Integration Tests
- **Form Integration**
  - Hidden input creation and synchronization
  - Form submission includes checkbox value
  - Validation integration
  - Reset functionality

- **Compound Usage**
  - Works with external Label components
  - Works with external Description components
  - Field wrapper integration

- **Real-world Scenarios**
  - Multi-checkbox groups
  - Tri-state parent/child relationships
  - Dynamic enable/disable scenarios

## 8. Constraints

- **Zero styling**: Component provides only behavior, no visual styling
- **Styling via data attributes**: All visual states exposed through `data-*` attributes
- **Tree-shakeable exports**: Named exports only, no default exports
- **TypeScript strict mode**: Full type safety, no `any` types
- **WCAG 2.2 AA compliant**: Meets all Level AA accessibility requirements
- **Controlled/uncontrolled support**: Works in both patterns seamlessly
- **SSR compatible**: Safe for server-side rendering
- **Browser support**: Modern browsers with ES2019+ support

## 9. Migration & Implementation Checklist

### Migration Guidance
**From native HTML checkbox:**
- Replace `<input type="checkbox">` with `<Checkbox>`
- Move styling from checkbox to data attributes
- Add proper ARIA labels if missing
- Test keyboard navigation

**From other libraries:**
- Map existing props to Spar API
- Update styling to use data attributes
- Verify accessibility improvements
- Test form integration

### Implementation Checklist

#### Core Functionality
- [ ] Basic checked/unchecked toggle
- [ ] Indeterminate state support
- [ ] Controlled and uncontrolled modes
- [ ] Form integration with hidden input
- [ ] Event handler prop support

#### Accessibility
- [ ] Checkbox role applied
- [ ] ARIA attributes (checked, disabled, invalid, required)
- [ ] Keyboard navigation (Space, Enter, Tab)
- [ ] Focus management and indicators
- [ ] Screen reader announcements
- [ ] Label association support

#### Developer Experience
- [ ] TypeScript definitions
- [ ] Polymorphic `as` prop
- [ ] Ref forwarding
- [ ] Render props pattern
- [ ] Data attributes for styling

#### Testing
- [ ] Unit tests for all props and states
- [ ] Accessibility tests with jest-axe
- [ ] Keyboard navigation tests
- [ ] Form integration tests
- [ ] Cross-browser compatibility

#### Documentation
- [ ] API documentation
- [ ] Usage examples
- [ ] Accessibility guidelines
- [ ] Migration guide
- [ ] Styling examples

#### Production Readiness
- [ ] Bundle size optimization
- [ ] Performance testing
- [ ] SSR/CSR compatibility
- [ ] Error boundary handling
- [ ] Edge case testing

# Label — Spar Headless Instructions

## 1. Component Overview

### Purpose and Use Cases
The Label component provides an accessible, semantic label primitive for form controls. It establishes programmatic relationships between label text and form inputs, improving usability for all users, especially those using assistive technologies. Labels increase the clickable area of form controls and provide essential context for screen readers.

**Use Cases**:
- Labeling text inputs, checkboxes, radio buttons, and other form controls
- Providing accessible names for form fields
- Displaying required field indicators
- Showing optional field indicators
- Creating custom form label layouts with help text or icons
- Building complex form field compositions

### Component Structure
Single component pattern - Label is a simple primitive that wraps label content and associates with form controls. It can be used with explicit association (via `htmlFor`) or implicit association (wrapping the control).

```tsx
// Explicit association (recommended)
<Label htmlFor="email">Email Address</Label>
<input id="email" type="email" />

// Implicit association
<Label>
  Email Address
  <input type="email" />
</Label>
```

### Key Differentiators
- **Headless by Design**: Zero visual styling - behavior and semantics only
- **Flexible Association**: Supports both explicit (`htmlFor`) and implicit (wrapped) form control association
- **Polymorphic**: Can render as native `<label>` or custom element while maintaining semantics
- **Accessibility First**: Proper semantic HTML with full screen reader support
- **Indicator Support**: Optional required/optional/read-only/invalid field indicators via data attributes
- **Form Integration**: Works seamlessly with all labelable form controls

## 2. API

### Label Props

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `required` | `boolean` | No | `false` | Marks label for a required field (exposed via data attribute) |
| `isOptional` | `boolean` | No | `false` | Marks label for an optional field (exposed via data attribute) |
| `disabled` | `boolean` | No | `false` | Marks label for a disabled field (exposed via data attribute) |
| `readOnly` | `boolean` | No | `false` | Marks label for a read-only field (exposed via data attribute) |
| `isInvalid` | `boolean` | No | `false` | Marks label for an invalid field (exposed via data attribute) |
| `as` | `ElementType` | No | `'label'` | Polymorphic element type |
| `children` | `React.ReactNode` | Yes | — | Label content (text, icons, form controls) |

**Note**: All standard element attributes (`htmlFor`, `className`, `style`, `id`, `aria-*`, `data-*`, event handlers, etc.) are forwarded through polymorphic props.

**⚠️ Important Notes:**
- `required`, `isOptional`, `disabled`, `readOnly`, and `isInvalid` are for **styling purposes only**. Always set `required`, `aria-required`, `disabled`, `readOnly`, and `aria-invalid` attributes on the **form control itself** for proper functionality.
- When using `as` prop with non-label elements, `htmlFor` will not create native association. You must use `aria-labelledby` or other ARIA labeling techniques on the control.

### Ref Forwarding
- **Label**: Accepts and forwards `ref` to the rendered root element (native `<label>` by default)

### Polymorphic Support
The `as` prop allows rendering as any valid element, but **breaks native label behavior**:

```tsx
// ❌ This does NOT create proper association
<Label as="div" htmlFor="field">Custom Label</Label>
<input id="field" />

// ✅ Use aria-labelledby instead with custom elements
<Label as="div" id="field-label">Custom Label</Label>
<input id="field" aria-labelledby="field-label" />

// ✅ Best practice: Keep semantic label element
<Label htmlFor="field">Native Label</Label>
<input id="field" />
```

## 3. Behavior Matrix

| State | User Action | Result | DOM/ARIA Update |
|-------|-------------|--------|-----------------|
| Default | Click label | Focus shifts to associated form control | Native browser behavior |
| Default | Render with `htmlFor` | Associates with control by ID | `for` attribute set |
| Default | Render wrapping control | Implicitly associates with control | Control nested in label |
| Multiple Labels | Multiple labels with same `htmlFor` | All labels associate with same control | Multiple labels valid and supported |
| Required | Render with `required={true}` | Marks as required field label | `data-required=""` |
| Optional | Render with `isOptional={true}` | Marks as optional field label | `data-optional=""` |
| Disabled | Render with `disabled={true}` | Marks as disabled field label | `data-disabled=""` |
| ReadOnly | Render with `readOnly={true}` | Marks as read-only field label | `data-readonly=""` |
| Invalid | Render with `isInvalid={true}` | Marks as invalid field label | `data-invalid=""` |
| Polymorphic | Render with `as` prop | Changes root element | Renders as specified element |

## 4. Accessibility

### Semantic HTML
- **Native Element**: Uses semantic `<label>` element by default
- **For Association**: Supports `htmlFor` attribute for explicit ID-based association
- **Implicit Association**: Supports wrapping form controls for implicit association
- **Labelable Elements**: Works with `<input>`, `<textarea>`, `<select>`, `<button>`, `<meter>`, `<output>`, `<progress>`

### ARIA Roles and Properties
**Native `<label>` element**:
- **Role**: Implicit role (no explicit role needed for native label)
- **Association**: Uses native `for` attribute (maps to `htmlFor` in React)

**Polymorphic (non-label) element**:
- **⚠️ Important**: There is NO `role="label"` in ARIA specification
- **Association**: Must use `aria-labelledby` on the control pointing to the label element's ID
- **Best Practice**: Use semantic `<label>` element whenever possible to maintain native association behavior

### Keyboard Navigation
Labels themselves are not focusable or interactive. Clicking a label focuses its associated form control (native browser behavior).

**⚠️ Important Click Behavior:**
- Clicking a label **automatically focuses** the associated form control
- For checkboxes and radio buttons, clicking the label **toggles the control**
- This increases the clickable hit area, improving usability (especially on touch devices)

**⚠️ Avoid Nested Interactive Elements:**
Per accessibility guidelines, **do NOT place interactive elements** (links, buttons) inside a label:

```tsx
// ❌ BAD - Makes it difficult to activate the form control
<Label htmlFor="terms">
  I agree to the <a href="/terms">Terms and Conditions</a>
</Label>
<input id="terms" type="checkbox" />

// ✅ GOOD - Place context before the label
<p>
  <a href="/terms">Read our Terms and Conditions</a>
</p>
<Label htmlFor="terms">
  <input id="terms" type="checkbox" />
  I agree to the Terms and Conditions
</Label>
```

**⚠️ Avoid Headings Inside Labels:**
Do NOT place heading elements inside labels - this interferes with assistive technology navigation:

```tsx
// ❌ BAD
<Label htmlFor="name">
  <h3>Your Name</h3>
  <input id="name" type="text" />
</Label>

// ✅ GOOD - Use CSS for visual styling
<Label htmlFor="name" className="large-label">
  Your Name
  <input id="name" type="text" />
</Label>
```

### Screen Reader Support
- **Label Text**: Announced when associated form control receives focus
- **Required/Optional**: Indicators should be included in label text or use `aria-required` on the control itself
- **Disabled State**: Announced through associated control's `disabled` attribute

### Focus Management
Labels do not receive focus. Focus is automatically transferred to the associated form control when the label is clicked (native browser behavior preserved).

### Name/Role/Value Exposure
- **Name**: Label text content provides accessible name for associated control
- **Association**: `for` attribute creates programmatic relationship with control
- **State**: Control state (required, disabled) should be set on the control itself

### WCAG 2.2 AA Compliance
- **3.3.2 Labels or Instructions**: All form controls have visible labels
- **4.1.2 Name, Role, Value**: Labels provide accessible names for controls
- **2.4.6 Headings and Labels**: Label text is descriptive and clear
- **1.3.1 Info and Relationships**: Programmatic association between labels and controls

## 5. Implementation Architecture

### Component Structure
```tsx
export const Label = ({
  required = false,
  isOptional = false,
  disabled = false,
  readOnly = false,
  isInvalid = false,
  as,
  children,
  ref,
  ...rest
}: LabelProps) => {
  const Component = as || 'label';
  
  // Data attributes for styling hooks
  const dataAttributes = {
    'data-required': required || undefined,
    'data-optional': isOptional || undefined,
    'data-disabled': disabled || undefined,
    'data-readonly': readOnly || undefined,
    'data-invalid': isInvalid || undefined,
  };

  return (
    <Component
      ref={ref}
      {...dataAttributes}
      {...rest}
    >
      {children}
    </Component>
  );
};
```

### State Management
- **Stateless**: Label is a presentational component with no internal state
- **Props-driven**: All behavior controlled via props
- **Memoized attributes**: Data attributes are memoized with `useMemo`

### Ref Forwarding
- Forwards ref directly to root element
- Supports accessing native label element methods and properties

### Event Handling
- **Native Behavior**: Preserves native label click behavior (focuses associated control)
- **Event Propagation**: All standard DOM events work as expected

### SSR/CSR Safety
- **Server-Side Rendering**: Fully compatible, no client-side dependencies
- **Hydration**: No hydration issues (pure HTML with no runtime state)
- **Static Generation**: Works perfectly with SSG/SSR frameworks

## 6. Styling & Data Attributes

### State Data Attributes
```typescript
'data-required': required ? '' : undefined
'data-optional': isOptional ? '' : undefined
'data-disabled': disabled ? '' : undefined
'data-readonly': readOnly ? '' : undefined
'data-invalid': isInvalid ? '' : undefined
```

### Usage Examples for Styling
```css
/* Required field indicator */
label[data-required]::after {
  content: ' *';
  color: red;
}

/* Optional field styling */
label[data-optional] {
  font-style: italic;
}

/* Disabled field label */
label[data-disabled] {
  opacity: 0.5;
  cursor: not-allowed;
}

/* Read-only field label */
label[data-readonly] {
  color: gray;
}

/* Invalid field label */
label[data-invalid] {
  color: red;
}
```

### CSS-in-JS Example
```tsx
const styles = {
  label: {
    '&[data-required]::after': {
      content: '" *"',
      color: 'red',
    },
    '&[data-readonly]': {
      color: 'gray',
    },
    '&[data-invalid]': {
      color: 'red',
    },
  },
};
```

## 7. Test Coverage Plan

### Unit Tests
- ✅ Renders with correct element type (default `label`)
- ✅ Accepts and forwards `ref` to rendered root element
- ✅ Applies `htmlFor` attribute correctly
- ✅ Renders children content
- ✅ Applies className and style props
- ✅ Spreads additional HTML attributes
- ✅ Sets data attributes for required state
- ✅ Sets data attributes for optional state
- ✅ Sets data attributes for disabled state
- ✅ Sets data attributes for readOnly state
- ✅ Sets data attributes for invalid state
- ✅ Supports polymorphic rendering with `as` prop
- ✅ Handles both explicit and implicit association

### Accessibility Tests
- ✅ Uses semantic `<label>` element by default
- ✅ Associates with form control via `htmlFor`
- ✅ Passes jest-axe with zero violations
- ✅ Provides accessible name to associated control
- ✅ Works with screen readers (label announced on control focus)
- ✅ Clicking label focuses associated control
- ✅ Implicit association works when wrapping control

### Integration Tests
- ✅ Works with text inputs
- ✅ Works with checkboxes
- ✅ Works with radio buttons
- ✅ Works with select elements
- ✅ Works with textareas
- ✅ Multiple labels can reference same control
- ✅ Nested controls work with implicit association

## 8. Constraints

### Zero Styling
- **No CSS imports**: Component contains zero styling code
- **No default styles**: All visual appearance controlled by consumers
- **Behavior only**: Component provides semantics and association only

### Styling via Data Attributes
- **State exposure**: Field states exposed via `data-*` attributes
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
- **Semantic HTML**: Uses native `<label>` element
- **Programmatic Association**: Proper `for` attribute support
- **Screen Reader Support**: Full compatibility with assistive technologies

## 9. Migration & Implementation Checklist

### Pre-Implementation Research
- ✅ Review HTML `<label>` specification
- ✅ Study form control association patterns
- ✅ Review accessibility best practices for form labels
- ✅ Analyze label usage in popular component libraries

### Implementation Steps
1. ✅ Create `Label.tsx` with core component logic
2. ✅ Create `types.ts` with TypeScript interfaces
3. ✅ Implement polymorphic `as` prop support
4. ✅ Add `htmlFor` attribute support
5. ✅ Add state props (`required`, `isOptional`, `disabled`, `readOnly`, `isInvalid`)
6. ✅ Implement data attributes for styling hooks
7. ✅ Add ref forwarding
8. ✅ Create `index.ts` with named exports

### Testing Checklist
1. ✅ Write unit tests for all props and behaviors
2. ✅ Write accessibility tests with jest-axe
3. ✅ Write integration tests with form controls
4. ✅ Test explicit association (`htmlFor`)
5. ✅ Test implicit association (wrapping)
6. ✅ Test polymorphic rendering
7. ✅ Verify screen reader compatibility

### Common Patterns to Support
```tsx
// Explicit association (recommended)
<Label htmlFor="username">Username</Label>
<input id="username" type="text" />

// With required indicator
<Label htmlFor="email" required>Email</Label>
<input id="email" type="email" required />

// With optional indicator
<Label htmlFor="phone" isOptional>Phone</Label>
<input id="phone" type="tel" />

// With read-only indicator
<Label htmlFor="accountId" readOnly>Account ID</Label>
<input id="accountId" type="text" readOnly />

// With invalid indicator
<Label htmlFor="email" isInvalid>Email</Label>
<input id="email" type="email" aria-invalid="true" />

// Implicit association
<Label>
  Password
  <input type="password" />
</Label>

// Complex label with help text
<Label htmlFor="bio">
  <span>Biography</span>
  <small>(Optional - Tell us about yourself)</small>
</Label>
<textarea id="bio" />

// Polymorphic usage
<Label as="div" id="custom-label">
  Custom Label
</Label>
<input id="custom" aria-labelledby="custom-label" />
```

### API Stability Considerations
- Keep `htmlFor` prop naming (matches React convention)
- Maintain native label behavior (click to focus)
- Preserve all native HTML label attributes
- Ensure backwards compatibility with standard form patterns

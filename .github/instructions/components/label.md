# Label — Glide Headless Instructions

## 1. Component Overview

The Label component provides accessible labeling for form controls with support for variants, sizes, and loading states. It's designed as a foundational text component that can be used standalone or in association with form inputs.

**Purpose and use cases:**
- Form input labeling with explicit association
- Standalone text with semantic meaning
- Loading state indicators for async operations
- Visual hierarchy through variants and sizes
- Required field indicators with accessibility support

**Compound component structure:**
- `Label.Root` - Core label element with polymorphic rendering
- `Label.Text` - Text content wrapper for complex compositions
- `Label.Indicator` - Required field, loading, or status indicators

**Key differentiators:**
- Built-in loading state with accessible announcements
- Required field indicators with proper ARIA labeling
- Size and variant system via data attributes
- Polymorphic rendering (`as` prop) for semantic flexibility
- Form association utilities for programmatic control

## 2. API

### Label.Root

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `as` | `React.ElementType` | No | `"label"` | Polymorphic element type |
| `htmlFor` | `string` | No | - | Associates label with form control by ID |
| `variant` | `"default" \| "primary" \| "secondary" \| "danger" \| "warning" \| "success"` | No | `"default"` | Visual variant for styling |
| `size` | `"xs" \| "sm" \| "md" \| "lg" \| "xl"` | No | `"md"` | Size variant for text scaling |
| `isRequired` | `boolean` | No | `false` | Marks label as required with indicator |
| `isDisabled` | `boolean` | No | `false` | Disabled state styling |
| `isLoading` | `boolean` | No | `false` | Loading state with indicator |
| `loadingText` | `string` | No | `"Loading..."` | Screen reader text for loading state |
| `requiredIndicator` | `React.ReactNode` | No | `"*"` | Custom required field indicator |
| `children` | `React.ReactNode` | Yes | - | Label content |
| `className` | `string` | No | - | Additional CSS classes |
| `style` | `React.CSSProperties` | No | - | Inline styles |
| `id` | `string` | No | - | Component identifier |
| `onClick` | `(event: React.MouseEvent) => void` | No | - | Click event handler |
| `onFocus` | `(event: React.FocusEvent) => void` | No | - | Focus event handler |
| `onBlur` | `(event: React.FocusEvent) => void` | No | - | Blur event handler |
| `ref` | `React.Ref<T>` | No | - | Forwarded ref to underlying element |
| `...rest` | `React.HTMLAttributes<T>` | No | - | Additional HTML attributes including data-* and aria-* |

### Label.Text

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `as` | `React.ElementType` | No | `"span"` | Polymorphic element type |
| `children` | `React.ReactNode` | Yes | - | Text content |
| `className` | `string` | No | - | Additional CSS classes |
| `style` | `React.CSSProperties` | No | - | Inline styles |
| `ref` | `React.Ref<T>` | No | - | Forwarded ref to underlying element |
| `...rest` | `React.HTMLAttributes<T>` | No | - | Additional HTML attributes |

### Label.Indicator

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `type` | `"required" \| "loading" \| "custom"` | No | `"required"` | Indicator type |
| `children` | `React.ReactNode` | No | - | Custom indicator content |
| `className` | `string` | No | - | Additional CSS classes |
| `style` | `React.CSSProperties` | No | - | Inline styles |
| `ref` | `React.Ref<T>` | No | - | Forwarded ref to underlying element |

## 3. Behavior Matrix

| State | Trigger | Result | ARIA/DOM Update |
|-------|---------|--------|-----------------|
| Default | Render | Label displays with semantic markup | `role="label"` (implicit), proper element structure |
| Associated | `htmlFor` prop | Label associates with form control | `for` attribute links to target element |
| Required | `isRequired={true}` | Required indicator appears | `aria-required="true"` on associated form control |
| Loading | `isLoading={true}` | Loading indicator shows | `aria-live="polite"` region + `aria-busy="true"` on associated control |
| Disabled | `isDisabled={true}` | Visual disabled state | `data-disabled="true"` attribute |
| Click | User clicks label | Focus moves to associated control | Native label click behavior preserved |
| Variant change | `variant` prop change | Visual styling updates | `data-variant` attribute updates |
| Size change | `size` prop change | Text size updates | `data-size` attribute updates |

## 4. Accessibility

### Roles
- Uses semantic `<label>` element by default for implicit labeling behavior
- Supports polymorphic rendering with proper role attribution
- Maintains label semantics when rendered as different elements

### Keyboard
- No direct keyboard interactions (labels are not focusable)
- Clicking label focuses associated form control (native behavior)
- Screen reader navigation treats as label content

### Focus management
- Labels are not in tab order (`tabindex="-1"` implicit)
- Associated form controls receive focus when label is clicked
- No focus trapping or management required

### Announcements (screen reader)
- Required state should be announced via `aria-required` on associated form controls
- Loading state announced via `aria-live="polite"` regions within label
- Loading state also communicated via `aria-busy` on associated form controls
- Variant and size changes are not announced (visual only)
- Associated form control reads label content as accessible name via proper label association

### Name/Role/Value exposure
- **Name**: Label text content becomes accessible name for associated control
- **Role**: "label" (implicit from semantic element)
- **Value**: Not applicable (labels don't have values)
- **State**: Required status included in accessible name
- **Properties**: `aria-describedby` for additional context when needed

### ARIA Implementation
```tsx
// Required field - proper pattern
<label htmlFor="input-id">
  Field Label
  <span aria-hidden="true">*</span>
</label>
<input id="input-id" aria-required="true" />

// Loading state - proper live region
<label htmlFor="input-id">
  Field Label
  {loading && (
    <span aria-live="polite" aria-atomic="true">
      {loadingText}
    </span>
  )}
</label>
<input id="input-id" aria-busy={loading} />

// Associated with control - standard pattern
<label htmlFor="input-id">
  Field Label
</label>
<input id="input-id" />

// Error state pattern
<label htmlFor="input-id">
  Field Label
</label>
<input 
  id="input-id" 
  aria-invalid={hasError}
  aria-describedby={hasError ? "error-id" : undefined}
/>
{hasError && (
  <div id="error-id" role="alert">
    {errorMessage}
  </div>
)}
```

## 5. Implementation Architecture

### State hooks design
```tsx
interface UseLabelProps {
  isRequired?: boolean;
  isLoading?: boolean;
  loadingText?: string;
  isDisabled?: boolean;
  variant?: LabelVariant;
  size?: LabelSize;
}

function useLabel(props: UseLabelProps) {
  const { isRequired, isLoading, loadingText, isDisabled, variant, size } = props;
  
  const ariaLabel = useMemo(() => {
    const parts = [];
    if (isRequired) parts.push('required');
    if (isLoading) parts.push(loadingText);
    return parts.length > 0 ? parts.join(', ') : undefined;
  }, [isRequired, isLoading, loadingText]);

  const dataAttributes = useMemo(() => ({
    'data-variant': variant,
    'data-size': size,
    'data-required': isRequired || undefined,
    'data-loading': isLoading || undefined,
    'data-disabled': isDisabled || undefined,
  }), [variant, size, isRequired, isLoading, isDisabled]);

  return {
    ariaLabel,
    dataAttributes,
    isRequired,
    isLoading,
    isDisabled,
  };
}
```

### Context requirements
```tsx
interface LabelContextValue {
  isRequired?: boolean;
  isLoading?: boolean;
  isDisabled?: boolean;
  variant?: LabelVariant;
  size?: LabelSize;
}

const LabelContext = createContext<LabelContextValue>({});
```

### Ref forwarding strategy
- Forward refs to the underlying label element
- Support polymorphic ref types based on `as` prop
- Maintain type safety for different element types

### Event system
- No custom events required
- Preserve native label click behavior
- Support standard React event handlers

### SSR/CSR safety and deterministic ids
- Generate deterministic IDs using `useId()` hook
- Ensure server/client rendering consistency
- No hydration mismatches for dynamic content

## 6. Styling & Data Attributes

### Required `data-*` attributes and values

**Variants:**
- `data-variant="default"` - Default label styling
- `data-variant="primary"` - Primary emphasis
- `data-variant="secondary"` - Secondary emphasis  
- `data-variant="danger"` - Error/danger state
- `data-variant="warning"` - Warning state
- `data-variant="success"` - Success state

**Sizes:**
- `data-size="xs"` - Extra small text
- `data-size="sm"` - Small text
- `data-size="md"` - Medium text (default)
- `data-size="lg"` - Large text
- `data-size="xl"` - Extra large text

**States:**
- `data-required="true"` - Required field indicator
- `data-loading="true"` - Loading state active
- `data-disabled="true"` - Disabled state
- `data-focus-visible="true"` - Focus visible indicator for styling
- `data-invalid="true"` - Invalid/error state
- `data-valid="true"` - Valid state (for form validation)

**Example CSS targeting:**
```css
[data-variant="primary"] { color: var(--color-primary); }
[data-size="lg"] { font-size: var(--text-lg); }
[data-required="true"] { /* required styling */ }
[data-loading="true"] { opacity: 0.6; }
[data-disabled="true"] { opacity: 0.5; cursor: not-allowed; }
```

## 7. Test Coverage Plan

### Unit tests
- Props rendering and default values
- Polymorphic `as` prop behavior
- Required indicator display logic
- Loading state management
- Data attributes assignment
- Event handler preservation
- Context value propagation

### Accessibility tests
- `jest-axe` compliance (zero violations)
- Label association with form controls
- Required field announcement testing
- Loading state screen reader announcement
- Keyboard navigation (no focus, click behavior)
- ARIA attributes validation
- Semantic HTML structure verification

### Integration tests
- Form control association behavior
- Label click focusing target input
- Context provider/consumer integration
- Complex composition scenarios
- Dynamic prop updates
- Server-side rendering consistency

### Test files structure
```
__tests__/
├── Label.test.tsx              # Core functionality
├── Label.a11y.test.tsx         # Accessibility compliance
└── Label.integration.test.tsx  # Integration scenarios
```

## 8. Constraints

- **Zero styling**: No CSS imports or styling opinions, only `data-*` attributes for styling hooks
- **Styling via `data-*` attributes**: All visual variants exposed through data attributes
- **Tree-shakeable exports**: Named exports only, no default exports, no side effects
- **TypeScript strict mode**: Explicit types, no `any`, full type safety
- **WCAG 2.2 AA compliant**: Full accessibility compliance with screen reader support
- **Controlled/uncontrolled support**: Supports both usage patterns for associated form controls

## 9. Migration & Implementation Checklist

### Usage Examples

#### Basic Label with Form Association
```tsx
// Simple label-input association
<Label.Root htmlFor="email">
  Email Address
</Label.Root>
<input id="email" type="email" />

// With variants and sizes
<Label.Root 
  htmlFor="username" 
  variant="primary" 
  size="lg"
>
  Username
</Label.Root>
<input id="username" type="text" />
```

#### Required Field Pattern
```tsx
<Label.Root 
  htmlFor="password" 
  isRequired
  requiredIndicator={<span>*</span>}
>
  Password
</Label.Root>
<input 
  id="password" 
  type="password" 
  aria-required="true"
/>
```

#### Loading State
```tsx
<Label.Root 
  htmlFor="search" 
  isLoading={isLoading}
  loadingText="Searching..."
>
  Search Query
</Label.Root>
<input 
  id="search" 
  type="text" 
  aria-busy={isLoading}
/>
```

#### Complex Composition
```tsx
<Label.Root htmlFor="description">
  <Label.Text>Project Description</Label.Text>
  <Label.Indicator type="required" />
  {isValidating && (
    <Label.Indicator type="loading" />
  )}
</Label.Root>
<textarea 
  id="description"
  aria-required="true"
  aria-busy={isValidating}
/>
```

#### Polymorphic Usage
```tsx
// Render as legend for fieldset
<Label.Root as="legend" variant="primary">
  Personal Information
</Label.Root>

// Render as div for non-form content
<Label.Root as="div" size="sm">
  Section Header
</Label.Root>
```

#### Styling with Data Attributes
```css
/* Variant styling */
[data-variant="primary"] {
  color: var(--color-primary-600);
  font-weight: 600;
}

[data-variant="danger"] {
  color: var(--color-red-600);
}

/* Size scaling */
[data-size="xs"] { font-size: 0.75rem; }
[data-size="sm"] { font-size: 0.875rem; }
[data-size="md"] { font-size: 1rem; }
[data-size="lg"] { font-size: 1.125rem; }
[data-size="xl"] { font-size: 1.25rem; }

/* State styling */
[data-required="true"]::after {
  content: " *";
  color: var(--color-red-500);
}

[data-loading="true"] {
  opacity: 0.7;
}

[data-disabled="true"] {
  opacity: 0.5;
  cursor: not-allowed;
}

/* Focus-visible styling */
[data-focus-visible="true"] {
  outline: 2px solid var(--color-blue-500);
  outline-offset: 2px;
}
```

#### TypeScript Usage
```tsx
import { Label } from '@glide/components';

interface FormFieldProps {
  label: string;
  htmlFor: string;
  isRequired?: boolean;
  variant?: 'default' | 'primary' | 'danger';
}

const FormField: React.FC<FormFieldProps> = ({ 
  label, 
  htmlFor, 
  isRequired, 
  variant = 'default' 
}) => {
  return (
    <Label.Root 
      htmlFor={htmlFor}
      isRequired={isRequired}
      variant={variant}
    >
      {label}
    </Label.Root>
  );
};

// With ref forwarding
const labelRef = useRef<HTMLLabelElement>(null);

<Label.Root ref={labelRef} htmlFor="input">
  Label Text
</Label.Root>
```

### Migration guidance
- **From HTML labels**: Replace `<label>` with `<Label.Root>`, add variant/size props as needed
- **From styled components**: Remove styling, use `data-*` attributes for CSS targeting
- **From other libraries**: Map existing props to Glide API, update accessibility patterns

### Implementation checklist

**Core Implementation:**
- [ ] Create `Label.tsx` with polymorphic component structure
- [ ] Implement `useLabel` hook with state management
- [ ] Add TypeScript definitions in `Label.types.ts`
- [ ] Create compound components (Root, Text, Indicator)
- [ ] Implement context provider for complex compositions

**Accessibility Implementation:**
- [ ] Add semantic `<label>` element as default
- [ ] Implement required field announcements
- [ ] Add loading state with `aria-live` regions
- [ ] Ensure form control association via `htmlFor`
- [ ] Test screen reader compatibility

**API Implementation:**
- [ ] Add all props with correct TypeScript types
- [ ] Implement polymorphic `as` prop with type safety
- [ ] Add ref forwarding for all element types
- [ ] Implement data attribute generation
- [ ] Add controlled/uncontrolled support

**Testing Implementation:**
- [ ] Write unit tests for all props and behaviors
- [ ] Create accessibility tests with `jest-axe`
- [ ] Add integration tests for form association
- [ ] Test server-side rendering compatibility
- [ ] Verify all keyboard interactions

**Documentation:**
- [ ] Create component documentation
- [ ] Add usage examples for all variants
- [ ] Document accessibility features
- [ ] Provide migration guide
- [ ] Add TypeScript usage examples

**Quality Assurance:**
- [ ] Pass all ESLint rules
- [ ] Pass TypeScript strict mode compilation
- [ ] Achieve 100% test coverage
- [ ] Pass accessibility audit tools
- [ ] Verify tree-shaking compatibility
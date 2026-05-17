# Input — Spar Headless Instructions

## 1. Component Overview

The Input component provides accessible form input primitives with zero styling opinions. Supports native HTML input types with proper ARIA implementation and validation state management.

**Core Purpose:**

- Headless input behavior with full accessibility
- Native HTML semantics with enhanced ARIA support
- Validation state coordination between label, field, and error elements

**Compound Structure:**

- `InputRoot` - State provider with validation context
- `InputField` - Core input element (polymorphic: input/textarea)
- `InputLabel` - Associated label element
- `InputDescription` - Helper text element
- `InputErrorMessage` - Error announcement element

**Unique Value:**

- Pure behavior without styling constraints
- Context-driven state sharing for compound usage
- Native accessibility with enhanced screen reader support

## 2. API

### InputRoot Props

| Name       | Type        | Required | Default | Description             |
| ---------- | ----------- | -------- | ------- | ----------------------- |
| `id`       | `string`    | No       | `undefined` | Custom base ID for compound ARIA relationships |
| `invalid`  | `boolean`   | No       | `false` | Input validation state  |
| `disabled` | `boolean`   | No       | `false` | Input disabled state    |
| `required` | `boolean`   | No       | `false` | Input required state    |
| `readOnly` | `boolean`   | No       | `false` | Input read-only state   |
| `children` | `ReactNode` | No       | -       | Compound input elements |

### InputField Props

| Name   | Type          | Required | Default   | Description                   |
| ------ | ------------- | -------- | --------- | ----------------------------- |
| `as`   | `ElementType` | No       | `"input"` | Element type (input/textarea) |
| `type` | `string`      | No       | `"text"`  | HTML input type               |
| `autoFocus` | `boolean` | No       | `false` | Whether to focus field on mount |

### InputLabel Props

| Name       | Type        | Required | Default | Description   |
| ---------- | ----------- | -------- | ------- | ------------- |
| `children` | `ReactNode` | Yes      | -       | Label content |

**Auto-forwarded from context**: When used inside `InputRoot`, the following props are automatically forwarded from the Input context to the underlying `Label` component — no manual prop passing needed:

- `disabled` — mirrors `InputRoot`'s `disabled` prop
- `required` — mirrors `InputRoot`'s `required` prop
- `readOnly` — mirrors `InputRoot`'s `readOnly` prop
- `invalid` — mirrors `InputRoot`'s `invalid` prop

These produce corresponding `data-disabled`, `data-required`, `data-readonly`, and `data-invalid` attributes on the rendered label element for styling hooks.

### InputDescription Props

| Name       | Type        | Required | Default | Description         |
| ---------- | ----------- | -------- | ------- | ------------------- |
| `children` | `ReactNode` | Yes      | -       | Description content |

### InputErrorMessage Props

| Name       | Type        | Required | Default | Description   |
| ---------- | ----------- | -------- | ------- | ------------- |
| `children` | `ReactNode` | Yes      | -       | Error content |

## 3. Behavior Matrix

| State        | ARIA/DOM Result                                             |
| ------------ | ----------------------------------------------------------- |
| **Initial**  | Proper label association; `aria-invalid` reflects `invalid` |
| **Focus**    | Focus visible, label association announced                  |
| **Invalid**  | `aria-invalid="true"`, `aria-describedby` includes error ID |
| **Disabled** | `disabled` attribute, non-interactive                       |
| **Required** | `aria-required="true"` and `required` attribute             |
| **ReadOnly** | `readOnly` attribute, non-editable but focusable            |

## 4. Accessibility

### ARIA Implementation

```tsx
// InputField
aria-labelledby={labelId}
aria-describedby={invalid ? errorId : descriptionId}
aria-required={required}
aria-invalid={invalid}
disabled={disabled}

// InputErrorMessage
role="alert"
aria-live="assertive"
id={errorId}
```

### Keyboard Support

- Tab/Shift+Tab: Focus navigation
- All input keys: Text entry
- Enter: Form submission (input only)

## 5. Implementation Architecture

### Context Hook

```tsx
const useInputContext = () => {
  const id = useId();
  const invalid = false;
  const disabled = false;
  const required = false;
  const readOnly = false;

  return {
    fieldId: `${id}-field`,
    labelId: `${id}-label`,
    descriptionId: `${id}-description`,
    errorId: `${id}-error`,
    invalid,
    disabled,
    required,
    readOnly,
  };
};
```

### Component Structure

- **InputRoot**: Context provider with state management
- **InputField**: Ref forwarding to native input element
- **InputLabel/Description/ErrorMessage**: ID-based ARIA associations

### Events

- All native input events forwarded through InputField
- Focus/blur updates local `data-focused` state
- `InputField` supports standalone usage without `InputRoot` context

## 6. Styling & Data Attributes

### Data Hooks for Styling

**InputRoot**:

- `data-invalid` - When validation fails
- `data-disabled` - When input disabled
- `data-required` - When input required
- `data-readonly` - When input read-only

**InputField**:

- `data-focused` - When input focused
- `data-autofocus` - When autoFocus is enabled
- `data-disabled` - Disabled state (context or standalone)
- `data-required` - Required state (context or standalone)
- `data-readonly` - Read-only state (context or standalone)

**InputLabel** (auto-forwarded from context):

- `data-disabled` - When input disabled
- `data-required` - When input required
- `data-readonly` - When input read-only
- `data-invalid` - When validation fails

## 7. Test Coverage Plan

### Unit Tests

- Context state management and ID generation
- ARIA attribute presence and values
- Event forwarding through InputField

### Accessibility Tests

- `jest-axe` compliance for all states
- Label association verification
- Keyboard navigation testing

### Integration Tests

- Form submission workflows
- Validation state coordination
- Compound component composition

## 8. Constraints

- **Zero styling**: Pure behavior primitives only
- **Data attribute styling**: All visual state via `data-*` hooks
- **TypeScript strict**: Explicit types, no `any`
- **WCAG 2.2 AA**: Full accessibility compliance required
- **Tree-shakeable**: Named exports only

## 9. Implementation Checklist

**Phase 1: Core**

- [ ] Compound component structure
- [ ] Context provider with useId()
- [ ] TypeScript interfaces

**Phase 2: Accessibility**

- [ ] ARIA attributes implementation
- [ ] Label associations
- [ ] Error announcements

**Phase 3: Testing**

- [ ] Unit tests with jest-axe
- [ ] Keyboard navigation tests
- [ ] Integration scenarios

**Phase 4: Polish**

- [ ] Data attributes for styling
- [ ] JSDoc documentation
- [ ] Package exports

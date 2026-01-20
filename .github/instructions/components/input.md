# Input — Spar Headless Instructions

## 1. Component Overview

The Input component provides accessible form input primitives with zero styling opinions. Supports native HTML input types with proper ARIA implementation and validation state management.

**Core Purpose:**

- Headless input behavior with full accessibility
- Native HTML semantics with enhanced ARIA support
- Validation state coordination between label, field, and error elements

**Compound Structure:**

- `Input.Root` - State provider with validation context
- `Input.Field` - Core input element (polymorphic: input/textarea)
- `Input.Label` - Associated label element
- `Input.Description` - Helper text element
- `Input.ErrorMessage` - Error announcement element

**Unique Value:**

- Pure behavior without styling constraints
- Context-driven state sharing for compound usage
- Native accessibility with enhanced screen reader support

## 2. API

### Input.Root Props

| Name       | Type        | Required | Default | Description             |
| ---------- | ----------- | -------- | ------- | ----------------------- |
| `invalid`  | `boolean`   | No       | `false` | Input validation state  |
| `disabled` | `boolean`   | No       | `false` | Input disabled state    |
| `required` | `boolean`   | No       | `false` | Input required state    |
| `children` | `ReactNode` | Yes      | -       | Compound input elements |

### Input.Field Props

| Name   | Type          | Required | Default   | Description                   |
| ------ | ------------- | -------- | --------- | ----------------------------- |
| `as`   | `PolymorphicAs` | No       | `"input"` | Element type (input/textarea) |
| `type` | `string`      | No       | `"text"`  | HTML input type               |

### Input.Label Props

| Name       | Type        | Required | Default | Description   |
| ---------- | ----------- | -------- | ------- | ------------- |
| `children` | `ReactNode` | Yes      | -       | Label content |

### Input.Description Props

| Name       | Type        | Required | Default | Description         |
| ---------- | ----------- | -------- | ------- | ------------------- |
| `children` | `ReactNode` | Yes      | -       | Description content |

### Input.ErrorMessage Props

| Name       | Type        | Required | Default | Description   |
| ---------- | ----------- | -------- | ------- | ------------- |
| `children` | `ReactNode` | Yes      | -       | Error content |

## 3. Behavior Matrix

| State        | ARIA/DOM Result                                             |
| ------------ | ----------------------------------------------------------- |
| **Initial**  | `aria-invalid="false"`, proper label association            |
| **Focus**    | Focus visible, label association announced                  |
| **Invalid**  | `aria-invalid="true"`, `aria-describedby` includes error ID |
| **Disabled** | `disabled` attribute, non-interactive                       |
| **Required** | `aria-required="true"` and `required` attribute             |

## 4. Accessibility

### ARIA Implementation

```tsx
// Input.Field
aria-labelledby={labelId}
aria-describedby={invalid ? errorId : descriptionId}
aria-required={required}
aria-invalid={invalid}
disabled={disabled}

// Input.ErrorMessage
role="alert"
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
  const [invalid, setInvalid] = useState(false);
  const [disabled, setDisabled] = useState(false);
  const [required, setRequired] = useState(false);

  return {
    fieldId: `${id}-field`,
    labelId: `${id}-label`,
    descriptionId: `${id}-description`,
    errorId: `${id}-error`,
    invalid,
    disabled,
    required,
    setInvalid,
    setDisabled,
    setRequired,
  };
};
```

### Component Structure

- **Input.Root**: Context provider with state management
- **Input.Field**: Ref forwarding to native input element
- **Input.Label/Description/ErrorMessage**: ID-based ARIA associations

### Events

- All native input events forwarded through Input.Field
- Context state updates trigger ARIA attribute changes

## 6. Styling & Data Attributes

### Data Hooks for Styling

**Input.Root**:

- `data-spar-input` - Base identifier
- `data-invalid` - When validation fails
- `data-disabled` - When input disabled
- `data-required` - When input required

**Input.Field**:

- `data-spar-input-field` - Field identifier
- `data-focused` - When input focused

**Input.Label**:

- `data-spar-input-label` - Label identifier

**Input.Description**:

- `data-spar-input-description` - Description identifier

**Input.ErrorMessage**:

- `data-spar-input-error` - Error identifier

## 7. Test Coverage Plan

### Unit Tests

- Context state management and ID generation
- ARIA attribute presence and values
- Event forwarding through Input.Field

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

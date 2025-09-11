# Textarea — Glide Headless Instructions

## 1. Component Overview

The Textarea component is a headless, multi-line text input control that provides accessibility, keyboard navigation, and form integration capabilities. It extends the native HTML `<textarea>` element with enhanced validation states, helper text, error handling, and comprehensive ARIA support.

**Purpose and use cases:**

- Multi-line text input for forms (comments, descriptions, messages)
- Content editing areas with validation feedback
- Resizable text input with character/word limits
- Accessible text areas with proper labeling and error states

**Compound component structure:**

- Single component design (not compound) following native textarea patterns
- Supports wrapper elements for additional context (labels, helper text, errors)

**Key differentiators:**

- Zero styling opinions - pure behavior
- Full WCAG 2.2 AA compliance
- Controlled and uncontrolled modes
- Built-in validation state management
- Deterministic SSR-safe IDs

## 2. API

| Prop                 | Type                                                | Required | Default          | Description                              |
| -------------------- | --------------------------------------------------- | -------- | ---------------- | ---------------------------------------- |
| `value`              | `string`                                            | No       | `undefined`      | Controlled value of the textarea         |
| `defaultValue`       | `string`                                            | No       | `undefined`      | Uncontrolled default value               |
| `onChange`           | `(event: ChangeEvent<HTMLTextAreaElement>) => void` | No       | `undefined`      | Value change handler                     |
| `onBlur`             | `(event: FocusEvent<HTMLTextAreaElement>) => void`  | No       | `undefined`      | Blur event handler                       |
| `onFocus`            | `(event: FocusEvent<HTMLTextAreaElement>) => void`  | No       | `undefined`      | Focus event handler                      |
| `onInvalid`          | `(errors: string[]) => void`                        | No       | `undefined`      | Validation error handler                 |
| `label`              | `string`                                            | No       | `undefined`      | Accessible label text                    |
| `placeholder`        | `string`                                            | No       | `undefined`      | Placeholder text                         |
| `helperText`         | `string`                                            | No       | `undefined`      | Helper text below textarea               |
| `errorMessage`       | `string`                                            | No       | `undefined`      | Error message (sets invalid state)       |
| `validationErrors`   | `string[]`                                          | No       | `undefined`      | Multiple validation error messages       |
| `validationBehavior` | `'native' \| 'aria'`                                | No       | `'aria'`         | Validation behavior mode                 |
| `isRequired`         | `boolean`                                           | No       | `false`          | Required field indicator                 |
| `isDisabled`         | `boolean`                                           | No       | `false`          | Disabled state                           |
| `isReadOnly`         | `boolean`                                           | No       | `false`          | Read-only state                          |
| `isInvalid`          | `boolean`                                           | No       | `false`          | Invalid state (controlled)               |
| `rows`               | `number`                                            | No       | `3`              | Visible rows of text                     |
| `cols`               | `number`                                            | No       | `undefined`      | Visible columns (character width)        |
| `maxLength`          | `number`                                            | No       | `undefined`      | Maximum character limit                  |
| `minLength`          | `number`                                            | No       | `undefined`      | Minimum character limit                  |
| `resize`             | `'none' \| 'both' \| 'horizontal' \| 'vertical'`    | No       | `'vertical'`     | Resize behavior                          |
| `autoComplete`       | `string`                                            | No       | `undefined`      | Autocomplete attribute                   |
| `autoFocus`          | `boolean`                                           | No       | `false`          | Auto-focus on mount                      |
| `spellCheck`         | `boolean`                                           | No       | `undefined`      | Spell check setting                      |
| `wrap`               | `'soft' \| 'hard' \| 'off'`                         | No       | `'soft'`         | Text wrapping mode                       |
| `inputMode`          | `string`                                            | No       | `undefined`      | Input mode for mobile keyboards          |
| `id`                 | `string`                                            | No       | `auto-generated` | Element ID                               |
| `name`               | `string`                                            | No       | `undefined`      | Form field name                          |
| `form`               | `string`                                            | No       | `undefined`      | Associated form ID                       |
| `as`                 | `React.ElementType`                                 | No       | `'textarea'`     | Polymorphic component type               |
| `aria-label`         | `string`                                            | No       | `undefined`      | Accessible label (when no visible label) |
| `aria-labelledby`    | `string`                                            | No       | `undefined`      | References to labeling elements          |
| `aria-describedby`   | `string`                                            | No       | `undefined`      | Additional description references        |
| `className`          | `string`                                            | No       | `undefined`      | CSS class names                          |
| `style`              | `CSSProperties`                                     | No       | `undefined`      | Inline styles                            |
| `ref`                | `Ref<HTMLTextAreaElement>`                          | No       | `undefined`      | Forward ref to textarea element          |

**Polymorphic support:** Uses `as` prop to render different elements with textarea behavior.
**Refs:** Forwards ref to the underlying textarea element.
**Controlled/Uncontrolled:** Supports both modes via `value`/`defaultValue` patterns.

## 3. Behavior Matrix

| State          | Trigger                                | Result                                  | ARIA/DOM Update                                             |
| -------------- | -------------------------------------- | --------------------------------------- | ----------------------------------------------------------- |
| **Initial**    | Component mounts                       | Renders textarea with default props     | `aria-invalid="false"`, no error state                      |
| **Focus**      | User tabs/clicks                       | Textarea receives focus                 | Focus visible, `data-focused="true"`                        |
| **Blur**       | User tabs away/clicks outside          | Textarea loses focus                    | `data-focused="false"`, validation may trigger              |
| **Type**       | User types text                        | Value updates (controlled/uncontrolled) | Character count updates if maxLength set                    |
| **Invalid**    | Validation fails or `onInvalid` called | Error state activated                   | `aria-invalid="true"`, `aria-describedby` includes error ID |
| **Valid**      | Validation passes                      | Error state cleared                     | `aria-invalid="false"`, error announcement removed          |
| **Disabled**   | `isDisabled=true`                      | Non-interactive state                   | `disabled` attribute, `data-disabled="true"`                |
| **ReadOnly**   | `isReadOnly=true`                      | Non-editable but focusable              | `readonly` attribute, `data-readonly="true"`                |
| **Required**   | `isRequired=true`                      | Required field indicator                | `required` attribute, `aria-required="true"`                |
| **Resize**     | User drags resize handle               | Textarea dimensions change              | CSS resize property controls behavior                       |
| **Max Length** | Character limit reached                | Prevents further input                  | Browser native behavior, may show count                     |

## 4. Accessibility

**Roles:**

- Primary role: `textbox` (implicit for textarea element)
- Error messages: `alert` role for immediate feedback
- Helper text: Associated via `aria-describedby`

**ARIA Properties:**

- `aria-label` or `aria-labelledby`: Required accessible name
- `aria-describedby`: Links to helper text and error messages
- `aria-invalid`: Indicates validation state (`true` when error present)
- `aria-required`: Indicates required fields (`true` when isRequired)
- `aria-readonly`: Indicates read-only state (when isReadOnly)

**Keyboard Navigation:**

- **Tab/Shift+Tab**: Move focus to/from textarea
- **Typing**: Insert text at cursor position
- **Arrow Keys**: Navigate within text content
- **Ctrl+A/Cmd+A**: Select all text
- **Home/End**: Move to line beginning/end
- **Page Up/Page Down**: Scroll content (if scrollable)
- **Ctrl+Home/Ctrl+End**: Move to document beginning/end
- **Enter**: Insert line break (multiline behavior)
- **Escape**: No default behavior (can be customized)

**Focus Management:**

- Visible focus indicator required
- Focus programmatically with `autoFocus` prop
- Focus remains within textarea during editing
- Tab order follows document flow

**Screen Reader Announcements:**

- Label and purpose announced on focus
- Value announced on focus (if not empty)
- Error messages announced immediately via `role="alert"`
- Helper text announced when associated
- State changes (required, invalid) announced
- Character/word count announcements (if implemented)

**Name/Role/Value Exposure:**

- **Name**: From `aria-label`, `<label>`, or `aria-labelledby`
- **Role**: `textbox` (multiline)
- **Value**: Current textarea content
- **State**: Required, invalid, readonly, disabled states exposed

## 5. Implementation Architecture

**State Hooks Design:**

```typescript
// Internal state management
const [isFocused, setIsFocused] = useState(false);
const [isFocusVisible, setIsFocusVisible] = useState(false);
const [internalValue, setInternalValue] = useState(defaultValue || '');

// Controlled vs uncontrolled detection
const isControlled = value !== undefined;
const currentValue = isControlled ? value : internalValue;

// Character count optimization
const characterCount = useMemo(
  () => (maxLength ? `${currentValue.length}/${maxLength}` : undefined),
  [currentValue, maxLength],
);
```

**Context Requirements:**

- No complex context needed (single component)
- Optional form context integration for validation

**Ref Forwarding Strategy:**

```typescript
const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>((props, ref) => {
  // Implementation forwards ref to textarea element
});
```

**Event System:**

- Native DOM events (onChange, onFocus, onBlur, onInput)
- Validation events (onInvalid for error handling)
- Custom events for enhanced functionality
- Focus-visible detection for keyboard vs mouse focus

**SSR/CSR Safety:**

- Deterministic ID generation using `useId()` hook
- No client-only behavior that breaks SSR
- Hydration-safe default values

## 6. Styling & Data Attributes

**Required `data-*` attributes for styling:**

**State Attributes:**

- `data-glide-textarea`: Component identifier
- `data-focused="true|false"`: Focus state
- `data-focus-visible="true"`: Keyboard focus state (when focused via keyboard)
- `data-disabled="true"`: Disabled state (when isDisabled)
- `data-readonly="true"`: Read-only state (when isReadOnly)
- `data-required="true"`: Required field (when isRequired)
- `data-invalid="true"`: Error state (when error present)
- `data-empty="true"`: Empty state (when no value)

**Resize Attributes:**

- `data-resize="none|both|horizontal|vertical"`: Resize behavior

**Size Attributes:**

- `data-rows="{number}"`: Number of visible rows
- `data-cols="{number}"`: Number of visible columns (if set)

**Validation Attributes:**

- `data-has-error="true"`: Error message present
- `data-has-helper="true"`: Helper text present
- `data-character-count="{current}/{max}"`: Character count (if maxLength set)
- `data-validation-behavior="native|aria"`: Validation mode indicator

## 7. Test Coverage Plan

**Unit Tests:**

- Controlled vs uncontrolled behavior
- Value updates and onChange handling
- Validation behavior (native vs aria modes)
- Multiple error message handling
- Prop validation and defaults
- Event handler execution (including onInvalid)
- Ref forwarding
- SSR compatibility
- ID generation and stability
- Performance optimization (memoization)
- Focus-visible state management

**Accessibility Tests:**

- ARIA attributes presence and correctness
- Keyboard navigation (Tab, Arrow keys, etc.)
- Screen reader announcements
- Focus management and focus-visible indicators
- Label association
- Error state accessibility with multiple errors
- Required field indication
- Validation behavior modes testing
- jest-axe validation (zero violations)

**Integration Tests:**

- Form integration and submission
- Validation library integration
- State management library compatibility
- Error handling workflows
- Real-world usage scenarios
- Cross-browser compatibility
- Resize behavior testing

## 8. Constraints

- **Zero styling**: No CSS imports, visual opinions, or layout styles
- **Styling via `data-*` attributes**: All styling hooks provided through data attributes
- **Tree-shakeable exports**: Named exports with no side effects
- **TypeScript strict mode**: Explicit types, no `any`, strict compliance
- **WCAG 2.2 AA compliant**: Full accessibility compliance required
- **Controlled/uncontrolled support**: Both patterns must work correctly
- **SSR safe**: Server-side rendering compatible
- **Performance optimized**: Minimal re-renders and memory usage

## 9. Migration & Implementation Checklist

**API Enhancements:**

- Enhanced props for modern form handling
- Multiple validation error support via `validationErrors` array
- Validation behavior modes (`validationBehavior`: 'native' | 'aria')
- Mobile keyboard optimization via `inputMode` prop
- Validation event handling via `onInvalid` callback
- Focus-visible state management for better UX

**Migration Guidance:**

- Drop-in replacement for native `<textarea>` elements
- Enhanced props for accessibility and validation
- Maintains backward compatibility with standard textarea attributes
- Progressive enhancement approach

**Implementation Checklist:**

**Core Functionality:**

- [ ] Basic textarea rendering with forwardRef
- [ ] Controlled and uncontrolled value management
- [ ] Event handling (onChange, onFocus, onBlur)
- [ ] Polymorphic `as` prop support

**Accessibility:**

- [ ] ARIA attributes implementation
- [ ] Keyboard navigation support
- [ ] Screen reader announcements
- [ ] Focus management
- [ ] Label association (label, aria-label, aria-labelledby)
- [ ] Error state accessibility with role="alert"

**Validation & States:**

- [ ] Error message display and ARIA
- [ ] Multiple validation error support
- [ ] Validation behavior modes (native vs aria)
- [ ] Helper text association
- [ ] Required field handling
- [ ] Disabled and readonly states
- [ ] Invalid state management
- [ ] Focus-visible state tracking

**Advanced Features:**

- [ ] Character/word counting (if maxLength)
- [ ] Resize behavior control
- [ ] Auto-resize functionality (optional)
- [ ] Form integration
- [ ] SSR-safe ID generation
- [ ] Mobile keyboard optimization (inputMode)
- [ ] Performance optimization (memoization)

**Testing:**

- [ ] Unit tests covering all props and behaviors
- [ ] Accessibility tests with jest-axe
- [ ] Integration tests with forms
- [ ] Cross-browser compatibility
- [ ] Screen reader testing

**Documentation:**

- [ ] TypeScript definitions
- [ ] Usage examples
- [ ] Accessibility guidelines
- [ ] Migration guide from native textarea

**Performance:**

- [ ] Minimize re-renders
- [ ] Efficient event handling
- [ ] Memory leak prevention
- [ ] Bundle size optimization

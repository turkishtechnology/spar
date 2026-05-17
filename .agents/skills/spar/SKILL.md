---
name: spar
description: Build UI with @turkish-technology/spar headless React components. Use when importing, composing, styling, or configuring Spar components. Covers all 16 unstyled, accessible primitives — Accordion, Breadcrumb, Button, Checkbox, Collapsible, Dialog, DropdownMenu, Field, Input, Label, Popover, Radio, Select, Switch, Tabs, Tooltip — with compound patterns, controlled/uncontrolled state, render props, polymorphic elements, ARIA compliance, and keyboard support.
---

# Spar — Headless React Component Library

## When to use this skill

Use when the user is working with `@turkish-technology/spar` — importing components, building UI features, composing patterns, or ensuring accessibility.

## Installation

```bash
npm install @turkish-technology/spar
# or
pnpm add @turkish-technology/spar
```

## Import patterns

```tsx
// Full bundle
import { Accordion, Dialog, Button } from '@turkish-technology/spar';

// Tree-shakeable sub-path imports (recommended)
import { Accordion } from '@turkish-technology/spar/accordion';
import { Dialog } from '@turkish-technology/spar/dialog';
import { Button } from '@turkish-technology/spar/button';
import { Tabs } from '@turkish-technology/spar/tabs';
import { Select } from '@turkish-technology/spar/select';
import { Checkbox } from '@turkish-technology/spar/checkbox';
import { Switch } from '@turkish-technology/spar/switch';
import { Radio } from '@turkish-technology/spar/radio';
import { Input } from '@turkish-technology/spar/input';
import { Label } from '@turkish-technology/spar/label';
import { Popover } from '@turkish-technology/spar/popover';
import { Tooltip } from '@turkish-technology/spar/tooltip';
import { DropdownMenu } from '@turkish-technology/spar/dropdown-menu';
import { Collapsible } from '@turkish-technology/spar/collapsible';
import { Breadcrumb } from '@turkish-technology/spar/breadcrumb';
import { Field } from '@turkish-technology/spar/field';
```

## Compound component pattern

Most components use dot notation for composable parts:

```tsx
<Accordion.Root selectionMode='single' defaultValue='item-1'>
  <Accordion.Item value='item-1'>
    <Accordion.Header>
      <Accordion.Trigger>Section 1</Accordion.Trigger>
    </Accordion.Header>
    <Accordion.Content>Content here</Accordion.Content>
  </Accordion.Item>
</Accordion.Root>
```

Named exports also available: `import { AccordionRoot, AccordionTrigger } from '@turkish-technology/spar/accordion'`

### All compound parts

| Component      | Parts                                                                                             |
| -------------- | ------------------------------------------------------------------------------------------------- |
| `Accordion`    | `Root`, `Item`, `Header`, `Trigger`, `Content`                                                    |
| `Breadcrumb`   | `Root`, `List`, `Item`, `Link`, `Page`, `Separator`                                               |
| `Collapsible`  | `Root`, `Trigger`, `Content`                                                                      |
| `Dialog`       | `Root`, `Trigger`, `Overlay`, `Content`, `Title`, `Description`, `Close`                          |
| `DropdownMenu` | `Root`, `Trigger`, `Content`, `Item`, `Separator`, `Label`, `Group`, `Arrow`                      |
| `Field`        | `Root`, `Label`, `Description`, `ErrorMessage`                                                    |
| `Input`        | `Root`, `Field`                                                                                   |
| `Popover`      | `Root`, `Trigger`, `Content`, `Arrow`, `Close`                                                    |
| `Radio`        | `Root`, `Item`                                                                                    |
| `Select`       | `Root`, `Trigger`, `Value`, `Content`, `Item`, `Group`, `Label`, `ItemText`, `Separator`, `Arrow` |
| `Tabs`         | `Root`, `List`, `Trigger`, `Content`                                                              |
| `Tooltip`      | `Provider`, `Root`, `Trigger`, `Content`, `Arrow`                                                 |

**Simple components** (no compound parts): `Button`, `Checkbox`, `Label`, `Switch`

## Field — the form-field container

`Field` is a generic wrapper that provides `invalid`, `disabled`, `required`, and `readOnly` state to nested form controls (`Input`, `Switch`, `Checkbox`, `Radio`, `Select`) via context, and coordinates ARIA IDs for `Field.Label`, `Field.Description`, and `Field.ErrorMessage`. Set form state once on the `Field` and every nested control picks it up — direct props on the control still win.

```tsx
<Field invalid={!!error} required>
  <Field.Label>Email</Field.Label>
  <Input>
    <Input.Field type='email' />
  </Input>
  <Field.Description>We'll never share it.</Field.Description>
  <Field.ErrorMessage>{error}</Field.ErrorMessage>
</Field>
```

`Field.ErrorMessage` only renders when `invalid` is true (and uses `role="alert"`). Use `Field` for any form control — not just `Input`.

## Controlled vs uncontrolled

Every stateful component supports both:

```tsx
// Uncontrolled — component manages state internally
<Tabs.Root defaultValue="tab1">...</Tabs.Root>
<Checkbox defaultChecked={true} />

// Controlled — you manage state externally
const [value, setValue] = useState('tab1');
<Tabs.Root value={value} onValueChange={setValue}>...</Tabs.Root>

const [checked, setChecked] = useState(false);
<Checkbox checked={checked} onChange={setChecked} />
```

Never mix both (e.g. `value` + `defaultValue` together).

## Render props

Some components expose internal state via children-as-function:

```tsx
<Checkbox aria-label="Accept terms">
  {({ checked, isFocused }) => (
    <span>{checked ? '✓' : '○'}</span>
  )}
</Checkbox>

<Collapsible.Trigger>
  {({ isOpen }) => <span>{isOpen ? '▼' : '▶'} Details</span>}
</Collapsible.Trigger>

<Tabs.Trigger value="tab1">
  {({ isSelected }) => <span className={isSelected ? 'active' : ''}>Tab 1</span>}
</Tabs.Trigger>
```

## Styling

All components are **completely unstyled** — zero CSS shipped. You bring your style:

```tsx
// className
<Button className="bg-blue-600 px-4 py-2 text-white rounded">Save</Button>

// style prop
<Dialog.Content style={{ padding: 24, borderRadius: 8 }}>...</Dialog.Content>
```

### Data attributes for state-based styling

Spar emits data attributes reflecting internal state:

```css
[data-state='open'] {
  /* expanded/open state */
}
[data-state='closed'] {
  /* collapsed/closed state */
}
[data-state='active'] {
  /* active tab */
}
[data-state='checked'] {
  /* checked checkbox/switch */
}
[data-state='unchecked'] {
  /* unchecked */
}
[data-state='indeterminate'] {
  /* indeterminate checkbox */
}
[data-disabled] {
  opacity: 0.5;
}
```

Tailwind: `className="data-[state=open]:font-bold data-[disabled]:opacity-50"`

## Accessibility — what Spar handles automatically

| Feature             | Automatic                                                                                     |
| ------------------- | --------------------------------------------------------------------------------------------- |
| ARIA roles          | ✅ Correct roles on all elements                                                              |
| ARIA attributes     | ✅ `aria-expanded`, `aria-selected`, `aria-checked`, `aria-controls`, `aria-labelledby`, etc. |
| Keyboard navigation | ✅ Tab, Enter, Space, Escape, Arrow keys per APG pattern                                      |
| Focus trapping      | ✅ Modal dialogs trap focus                                                                   |
| Focus restoration   | ✅ Returns to trigger on close                                                                |
| Roving tabindex     | ✅ Tabs, Radio (one item in tab order)                                                        |
| Typeahead           | ✅ Type-to-select in Select, DropdownMenu                                                     |

### What YOU must handle

1. **Visible focus indicators** — provide CSS for `:focus-visible` (Spar manages focus state, you make it visible)
2. **Color contrast** — WCAG AA: 4.5:1 text, 3:1 UI components
3. **Labels** — `aria-label` for icon-only buttons, `Input.Label` for fields
4. **Dialog.Title is mandatory** — use `className="sr-only"` to hide visually if needed

## Common composition patterns

### Confirmation dialog

```tsx
function ConfirmDialog({ title, description, onConfirm, trigger }) {
  const [open, setOpen] = useState(false);
  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger>{trigger}</Dialog.Trigger>
      <Dialog.Overlay />
      <Dialog.Content>
        <Dialog.Title>{title}</Dialog.Title>
        <Dialog.Description>{description}</Dialog.Description>
        <Dialog.Close>Cancel</Dialog.Close>
        <Button
          onClick={() => {
            onConfirm();
            setOpen(false);
          }}
        >
          Confirm
        </Button>
      </Dialog.Content>
    </Dialog.Root>
  );
}
```

### Form field wrapper

```tsx
function FormField({ label, error, description, required, children }) {
  return (
    <Field invalid={!!error} required={required}>
      <Field.Label>{label}</Field.Label>
      {children}
      {description && <Field.Description>{description}</Field.Description>}
      {error && <Field.ErrorMessage>{error}</Field.ErrorMessage>}
    </Field>
  );
}

// Usage with Input
<FormField label='Email' error={errors.email} required>
  <Input>
    <Input.Field type='email' {...register('email')} />
  </Input>
</FormField>;

// Same wrapper works with Switch, Checkbox, Select, Radio
<FormField label='Notifications' description='Email me on activity'>
  <Switch name='notify' />
</FormField>;
```

### Tooltip-wrapped button

```tsx
<Tooltip.Root>
  <Tooltip.Trigger asChild>
    <Button aria-label='Settings'>
      <GearIcon />
    </Button>
  </Tooltip.Trigger>
  <Tooltip.Content>
    Settings
    <Tooltip.Arrow />
  </Tooltip.Content>
</Tooltip.Root>
```

## Detailed API per component

When you need full props, render props, events, and keyboard for a specific component, read the corresponding reference:

- [Accordion](references/accordion.md) — multiple, collapsible, value/onValueChange, orientation
- [Breadcrumb](references/breadcrumb.md) — onNavigate, Link, Page, Separator
- [Button](references/button.md) — isLoading, toggle mode (isPressed/onPressedChange)
- [Checkbox](references/checkbox.md) — CheckedState (true/false/'indeterminate'), invalid, Field context
- [Collapsible](references/collapsible.md) — open/onOpenChange, forceMount
- [Dialog](references/dialog.md) — modal, trapFocus, initialFocus, onEscapeKeyDown
- [DropdownMenu](references/dropdown-menu.md) — side/align, closeOnSelect, onSelect per item
- [Field](references/field.md) — invalid/disabled/required/readOnly context for nested form controls; Label/Description/ErrorMessage
- [Input](references/input.md) — Root + Field only; reads Field context for invalid/disabled/required/readOnly
- [Label](references/label.md) — required, isOptional, data attributes
- [Popover](references/popover.md) — side/align, trapFocus, onInteractOutside
- [Radio](references/radio.md) — selectOnFocus, orientation, invalid, readOnly, roving tabindex
- [Select](references/select.md) — Value/placeholder, ItemText, Group/Label, invalid, readOnly, typeahead
- [Switch](references/switch.md) — render props, invalid, useSwitch hook, Field context
- [Tabs](references/tabs.md) — activationMode (automatic/manual), orientation
- [Tooltip](references/tooltip.md) — Provider (delayDuration, skipDelayDuration), per-instance delay

Only load the reference for the component the user is working with.

## Gotchas

- **All components are unstyled**: They render semantic HTML with ARIA but zero CSS.
- **Compound parts must be nested correctly**: `Accordion.Trigger` inside `Accordion.Item` inside `Accordion.Root`. Wrong nesting throws a context error.
- **Don't mix controlled and uncontrolled**: Use `value` OR `defaultValue`, never both.
- **Use `Field` for label/description/error**: `Input` no longer ships its own `Label`/`Description`/`ErrorMessage` — wrap any form control (`Input`, `Switch`, `Checkbox`, `Radio`, `Select`) in `<Field>` and use `Field.Label`, `Field.Description`, `Field.ErrorMessage`. The wrapped control inherits `invalid`/`disabled`/`required`/`readOnly` from `Field`.
- **`Input` is now `Root` + `Field` only**: Render the text input as `<Input><Input.Field type="email" /></Input>`. For labels/errors, wrap in `<Field>`.
- **Dialog.Title is required**: Screen readers need it. Hide visually with `className="sr-only"` if needed.
- **Dialog needs Overlay**: For modal dialogs, include `Dialog.Overlay` for backdrop.
- **Tooltip needs Provider**: Wrap your app once with `Tooltip.Provider` for delay config.
- **Select.ItemText is required**: Each `Select.Item` must have a `Select.ItemText` child.
- **Accordion `multiple`**: Boolean — `false` (default) = one panel open at a time, `true` = many. Use `collapsible` (default `true`) to control whether the open item can be re-clicked to close it in single mode.
- **Radio needs `name`**: Set on `Radio.Root` for form submission.
- **Icon-only buttons need `aria-label`**: Spar can't infer meaning from icon children.
- **Don't add redundant ARIA**: Spar already sets roles and aria-\* attributes. Adding extras may conflict.
- **Don't override `tabIndex`**: Spar manages tabindex internally (roving tabindex). Overriding breaks keyboard nav.
- **Positioned content uses Floating UI**: `Popover.Content`, `Tooltip.Content`, `Select.Content`, `DropdownMenu.Content` handle positioning automatically.

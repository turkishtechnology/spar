# Switch API Reference

## Element: `<button>` (role="switch")

Simple component — no compound parts. When nested inside a `<Field>`, reads `invalid`, `disabled`, `required`, and `readOnly` from Field context automatically. Direct props on `<Switch>` override the inherited values.

## Props

| Prop              | Type                         | Default    | Description                                        |
| ----------------- | ---------------------------- | ---------- | -------------------------------------------------- |
| `checked?`        | `boolean`                    | —          | Controlled checked state                           |
| `defaultChecked?` | `boolean`                    | `false`    | Default checked state (uncontrolled)               |
| `onChange?`       | `(checked: boolean) => void` | —          | Called when state changes                          |
| `disabled?`       | `boolean`                    | `false`    | Disables the switch. Inherited from Field          |
| `required?`       | `boolean`                    | `false`    | Required for form validation. Inherited from Field |
| `readOnly?`       | `boolean`                    | `false`    | Prevents state changes. Inherited from Field       |
| `isInvalid?`      | `boolean`                    | `false`    | Error state (`aria-invalid`). Inherited from Field |
| `name?`           | `string`                     | —          | Form field name (renders hidden `<input>`)         |
| `value?`          | `string`                     | `'on'`     | Form field value when checked                      |
| `form?`           | `string`                     | —          | Associated form ID                                 |
| `autoFocus?`      | `boolean`                    | `false`    | Auto-focus on mount                                |
| `as?`             | `ElementType`                | `'button'` | Polymorphic element                                |

Plus all native `<button>` HTML attributes.

## Render props

```tsx
<Switch aria-label='Dark mode'>
  {({
    checked,
    disabled,
    readOnly,
    required,
    isInvalid,
    isFocused,
    isHovered,
    isPressed,
    setChecked,
  }) => (
    <span className={checked ? 'switch-on' : 'switch-off'}>
      <span className='switch-thumb' />
    </span>
  )}
</Switch>
```

| Render Prop  | Type                         | Description           |
| ------------ | ---------------------------- | --------------------- |
| `checked`    | `boolean`                    | Current checked state |
| `setChecked` | `(checked: boolean) => void` | State setter          |
| `disabled`   | `boolean`                    | Whether disabled      |
| `readOnly`   | `boolean`                    | Whether read-only     |
| `required`   | `boolean`                    | Whether required      |
| `isInvalid`  | `boolean`                    | Whether invalid       |
| `isFocused`  | `boolean`                    | Whether focused       |
| `isHovered`  | `boolean`                    | Whether hovered       |
| `isPressed`  | `boolean`                    | Whether being pressed |

## Data attributes

| Attribute       | Values                       |
| --------------- | ---------------------------- |
| `data-switch`   | Always present (marker)      |
| `data-state`    | `'checked'` \| `'unchecked'` |
| `data-checked`  | Present when checked         |
| `data-disabled` | Present when disabled        |
| `data-readonly` | Present when read-only       |
| `data-required` | Present when required        |
| `data-invalid`  | Present when invalid         |
| `data-focus`    | Present when focused         |
| `data-hover`    | Present when hovered         |
| `data-active`   | Present when being pressed   |

## Hook

```tsx
import { useSwitch } from '@turkish-technology/spar/switch';

const { checked, setChecked, switchProps, hiddenInputProps, isFocused, isHovered, isActive } =
  useSwitch({ checked, defaultChecked, onChange, disabled, readOnly });
```

Returns the raw state and prop bundles you can spread onto your own element. Use when you need a fully custom DOM that the polymorphic `<Switch as>` can't express.

## Field integration

```tsx
<Field disabled={!user.canEdit}>
  <Field.Label>Email notifications</Field.Label>
  <Switch name='notify' defaultChecked />
  <Field.Description>Get notified when someone mentions you.</Field.Description>
</Field>
```

The Switch picks up `disabled`/`required`/`readOnly`/`invalid` from Field, and `aria-labelledby` / `aria-describedby` are wired to Field's Label and Description automatically.

## Keyboard

| Key     | Action               |
| ------- | -------------------- |
| `Space` | Toggle checked state |
| `Enter` | Toggle checked state |

# Checkbox API Reference

## Element: `<span>` (wraps a hidden `<input type="checkbox">`)

Simple component — no compound parts. When nested inside a `<Field>`, reads `invalid`, `disabled`, `required`, and `readOnly` from Field context. Direct props on `<Checkbox>` override the inherited values.

## Props

| Prop              | Type                              | Default | Description                                        |
| ----------------- | --------------------------------- | ------- | -------------------------------------------------- |
| `checked?`        | `boolean \| 'indeterminate'`      | —       | Controlled checked state                           |
| `defaultChecked?` | `boolean \| 'indeterminate'`      | `false` | Default checked state                              |
| `onChange?`       | `(checked: CheckedState) => void` | —       | Called when state changes                          |
| `disabled?`       | `boolean`                         | `false` | Disables the checkbox. Inherited from Field        |
| `required?`       | `boolean`                         | `false` | Required for form validation. Inherited from Field |
| `readOnly?`       | `boolean`                         | `false` | Prevents state changes. Inherited from Field       |
| `isInvalid?`      | `boolean`                         | `false` | Error state (`aria-invalid`). Inherited from Field |
| `name?`           | `string`                          | —       | Form field name                                    |
| `value?`          | `string`                          | `'on'`  | Form field value                                   |
| `form?`           | `string`                          | —       | Associated form ID                                 |
| `autoFocus?`      | `boolean`                         | `false` | Auto-focus on mount                                |

`CheckedState = boolean | 'indeterminate'`

## Render props

Children can be a function receiving internal state:

```tsx
<Checkbox aria-label='Accept terms'>
  {({
    checked,
    isFocused,
    isHovered,
    isPressed,
    disabled,
    readOnly,
    required,
    isInvalid,
    setChecked,
  }) => (
    <span className={checked === true ? 'checked' : checked === 'indeterminate' ? 'mixed' : ''}>
      {checked === true && '✓'}
      {checked === 'indeterminate' && '—'}
    </span>
  )}
</Checkbox>
```

| Render Prop  | Type                              | Description           |
| ------------ | --------------------------------- | --------------------- |
| `checked`    | `CheckedState`                    | Current checked state |
| `setChecked` | `(checked: CheckedState) => void` | State setter          |
| `disabled`   | `boolean`                         | Whether disabled      |
| `readOnly`   | `boolean`                         | Whether read-only     |
| `required`   | `boolean`                         | Whether required      |
| `isInvalid`  | `boolean`                         | Whether invalid       |
| `isFocused`  | `boolean`                         | Whether focused       |
| `isHovered`  | `boolean`                         | Whether hovered       |
| `isPressed`  | `boolean`                         | Whether being pressed |

## Data attributes

| Attribute       | Values                                            |
| --------------- | ------------------------------------------------- |
| `data-state`    | `'checked'` \| `'unchecked'` \| `'indeterminate'` |
| `data-disabled` | Present when disabled                             |
| `data-readonly` | Present when read-only                            |
| `data-required` | Present when required                             |
| `data-invalid`  | Present when invalid                              |

## Field integration

```tsx
<Field invalid={!terms.accepted} required>
  <Checkbox
    name='terms'
    checked={terms.accepted}
    onChange={(v) => setTerms({ accepted: v === true })}
  />
  <Field.Label>I accept the terms</Field.Label>
  <Field.ErrorMessage>You must accept the terms to continue.</Field.ErrorMessage>
</Field>
```

The Checkbox inherits `invalid`/`disabled`/`required`/`readOnly` from Field, and ARIA wiring (`aria-labelledby`, `aria-describedby`, `aria-invalid`) is set up automatically.

## Keyboard

| Key     | Action               |
| ------- | -------------------- |
| `Space` | Toggle checked state |

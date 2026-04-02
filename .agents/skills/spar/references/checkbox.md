# Checkbox API Reference

## Element: `<span>` (wraps a hidden `<input type="checkbox">`)

Simple component — no compound parts.

## Props

| Prop              | Type                              | Default | Description                  |
| ----------------- | --------------------------------- | ------- | ---------------------------- |
| `checked?`        | `boolean \| 'indeterminate'`      | —       | Controlled checked state     |
| `defaultChecked?` | `boolean \| 'indeterminate'`      | `false` | Default checked state        |
| `onChange?`       | `(checked: CheckedState) => void` | —       | Called when state changes    |
| `disabled?`       | `boolean`                         | `false` | Disables the checkbox        |
| `name?`           | `string`                          | —       | Form field name              |
| `value?`          | `string`                          | `'on'`  | Form field value             |
| `form?`           | `string`                          | —       | Associated form ID           |
| `required?`       | `boolean`                         | `false` | Required for form validation |
| `readOnly?`       | `boolean`                         | `false` | Prevents state changes       |
| `autoFocus?`      | `boolean`                         | `false` | Auto-focus on mount          |

`CheckedState = boolean | 'indeterminate'`

## Render props

Children can be a function receiving internal state:

```tsx
<Checkbox aria-label='Accept terms'>
  {({ checked, isFocused, isHovered, isPressed, disabled, readOnly, setChecked }) => (
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
| `isFocused`  | `boolean`                         | Whether focused       |
| `isHovered`  | `boolean`                         | Whether hovered       |
| `isPressed`  | `boolean`                         | Whether being pressed |

## Data attributes

| Attribute       | Values                                            |
| --------------- | ------------------------------------------------- |
| `data-state`    | `'checked'` \| `'unchecked'` \| `'indeterminate'` |
| `data-disabled` | Present when disabled                             |
| `data-readonly` | Present when read-only                            |

## Keyboard

| Key     | Action               |
| ------- | -------------------- |
| `Space` | Toggle checked state |

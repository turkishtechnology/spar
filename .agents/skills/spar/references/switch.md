# Switch API Reference

## Element: `<button>` (role="switch")

Simple component — no compound parts.

## Props

| Prop              | Type                         | Default    | Description                  |
| ----------------- | ---------------------------- | ---------- | ---------------------------- |
| `checked?`        | `boolean`                    | —          | Controlled checked state     |
| `defaultChecked?` | `boolean`                    | `false`    | Default checked state        |
| `onChange?`       | `(checked: boolean) => void` | —          | Called when state changes    |
| `disabled?`       | `boolean`                    | `false`    | Disables the switch          |
| `required?`       | `boolean`                    | `false`    | Required for form validation |
| `readOnly?`       | `boolean`                    | `false`    | Prevents state changes       |
| `isLoading?`      | `boolean`                    | `false`    | Loading state (from Button)  |
| `as?`             | `ElementType`                | `'button'` | Polymorphic element          |

Plus all native `<button>` HTML attributes.

## Render props

```tsx
<Switch aria-label='Dark mode'>
  {({ checked, disabled, readOnly, isFocused, isHovered, isPressed, setChecked }) => (
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
| `isFocused`  | `boolean`                    | Whether focused       |
| `isHovered`  | `boolean`                    | Whether hovered       |
| `isPressed`  | `boolean`                    | Whether being pressed |

## Data attributes

| Attribute       | Values                       |
| --------------- | ---------------------------- |
| `data-state`    | `'checked'` \| `'unchecked'` |
| `data-disabled` | Present when disabled        |
| `data-readonly` | Present when read-only       |
| `data-focus`    | Present when focused         |
| `data-hover`    | Present when hovered         |

## Keyboard

| Key     | Action               |
| ------- | -------------------- |
| `Space` | Toggle checked state |
| `Enter` | Toggle checked state |

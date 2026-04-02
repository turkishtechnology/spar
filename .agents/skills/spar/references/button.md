# Button API Reference

## Element: `<button>`

Simple component — no compound parts.

## Props

| Prop               | Type                         | Default    | Description                      |
| ------------------ | ---------------------------- | ---------- | -------------------------------- |
| `isLoading?`       | `boolean`                    | `false`    | Loading state (adds `aria-busy`) |
| `isPressed?`       | `boolean`                    | —          | Controlled toggle state          |
| `onPressedChange?` | `(pressed: boolean) => void` | —          | Toggle callback                  |
| `as?`              | `ElementType`                | `'button'` | Polymorphic element              |
| `disabled?`        | `boolean`                    | `false`    | Disables the button              |
| `autoFocus?`       | `boolean`                    | `false`    | Auto-focus on mount              |

Plus all native `<button>` HTML attributes (`type`, `onClick`, `className`, `style`, `ref`, etc.)

## Toggle button

When `isPressed` is provided, the button becomes a toggle:

```tsx
// Uncontrolled toggle
<Button>Toggle me</Button>;

// Controlled toggle
const [pressed, setPressed] = useState(false);
<Button isPressed={pressed} onPressedChange={setPressed}>
  {pressed ? 'ON' : 'OFF'}
</Button>;
```

ARIA: Adds `aria-pressed` automatically when in toggle mode.

## Keyboard

| Key     | Action          |
| ------- | --------------- |
| `Enter` | Activate button |
| `Space` | Activate button |

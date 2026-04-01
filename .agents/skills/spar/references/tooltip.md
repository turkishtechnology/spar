# Tooltip API Reference

## Parts

| Part               | Element    | Description                                           |
| ------------------ | ---------- | ----------------------------------------------------- |
| `Tooltip.Provider` | —          | Global config (no DOM element, wrap app once)         |
| `Tooltip.Root`     | —          | State container for a single tooltip (no DOM element) |
| `Tooltip.Trigger`  | `<button>` | Element that shows tooltip on hover/focus             |
| `Tooltip.Content`  | `<div>`    | Tooltip panel (portaled, role="tooltip")              |
| `Tooltip.Arrow`    | `<svg>`    | Pointing arrow                                        |

## Provider Props

| Prop                       | Type      | Default | Description                                       |
| -------------------------- | --------- | ------- | ------------------------------------------------- |
| `delayDuration?`           | `number`  | `700`   | Delay before showing (ms)                         |
| `skipDelayDuration?`       | `number`  | `300`   | Delay window to skip when moving between tooltips |
| `disableHoverableContent?` | `boolean` | `false` | Close tooltip when pointer moves to content       |

## Root Props

| Prop            | Type                      | Default | Description                                |
| --------------- | ------------------------- | ------- | ------------------------------------------ |
| `id?`           | `string`                  | auto    | Base ID for ARIA relationships             |
| `open?`         | `boolean`                 | —       | Controlled open state                      |
| `defaultOpen?`  | `boolean`                 | `false` | Default open state                         |
| `onOpenChange?` | `(open: boolean) => void` | —       | Called when state changes                  |
| `delay?`        | `number`                  | —       | Override provider's delay for this tooltip |
| `hideDelay?`    | `number`                  | `0`     | Delay before hiding (ms)                   |
| `disabled?`     | `boolean`                 | `false` | Prevents showing                           |

## Trigger Props

Extends Button props.

**Render props:**

| Render Prop | Type         | Description                |
| ----------- | ------------ | -------------------------- |
| `isOpen`    | `boolean`    | Whether tooltip is visible |
| `disabled`  | `boolean`    | Whether disabled           |
| `show`      | `() => void` | Show tooltip               |
| `hide`      | `() => void` | Hide tooltip               |

## Content Props

| Prop                    | Type                                     | Default         | Description             |
| ----------------------- | ---------------------------------------- | --------------- | ----------------------- |
| `side?`                 | `'top' \| 'right' \| 'bottom' \| 'left'` | `'top'`         | Preferred placement     |
| `align?`                | `'start' \| 'center' \| 'end'`           | `'center'`      | Alignment               |
| `container?`            | `HTMLElement \| null`                    | `document.body` | Portal container        |
| `onEscapeKeyDown?`      | `(event: KeyboardEvent) => void`         | —               | Called on Escape        |
| `onPointerDownOutside?` | `(event: PointerEvent) => void`          | —               | Called on click outside |
| `onOpenAutoFocus?`      | `(event: Event) => void`                 | —               | Before auto-focus       |
| `onCloseAutoFocus?`     | `(event: Event) => void`                 | —               | Before focus restore    |

## Keyboard

| Key                   | Action          |
| --------------------- | --------------- |
| `Escape`              | Dismiss tooltip |
| `Tab` (focus trigger) | Show tooltip    |
| `Tab` (leave trigger) | Hide tooltip    |

## Behavior

- Shows on hover after delay (configurable via Provider)
- Shows immediately on focus
- Moving between tooltips skips delay (within `skipDelayDuration`)
- `disableHoverableContent`: when `false` (default), user can hover over tooltip content without it closing

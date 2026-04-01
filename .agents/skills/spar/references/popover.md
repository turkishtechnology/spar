# Popover API Reference

## Parts

| Part              | Element    | Description                      |
| ----------------- | ---------- | -------------------------------- |
| `Popover.Root`    | —          | State container (no DOM element) |
| `Popover.Trigger` | `<button>` | Opens the popover                |
| `Popover.Content` | `<div>`    | Popover panel (portaled)         |
| `Popover.Arrow`   | `<svg>`    | Pointing arrow                   |
| `Popover.Close`   | `<button>` | Closes the popover               |

## Root Props

| Prop            | Type                      | Default | Description                    |
| --------------- | ------------------------- | ------- | ------------------------------ |
| `id?`           | `string`                  | auto    | Base ID for ARIA relationships |
| `open?`         | `boolean`                 | —       | Controlled open state          |
| `onOpenChange?` | `(open: boolean) => void` | —       | Called when state changes      |
| `defaultOpen?`  | `boolean`                 | `false` | Default open state             |
| `modal?`        | `boolean`                 | `false` | Whether popover is modal       |
| `disabled?`     | `boolean`                 | `false` | Prevents opening               |

## Trigger Props

Extends Button props.

**Render props:**

| Render Prop                 | Type         | Description                 |
| --------------------------- | ------------ | --------------------------- |
| `isOpen`                    | `boolean`    | Whether popover is open     |
| `disabled`                  | `boolean`    | Whether trigger is disabled |
| `open` / `close` / `toggle` | `() => void` | State control               |

## Content Props

| Prop                    | Type                                          | Default         | Description                       |
| ----------------------- | --------------------------------------------- | --------------- | --------------------------------- |
| `side?`                 | `'top' \| 'right' \| 'bottom' \| 'left'`      | `'bottom'`      | Preferred placement               |
| `align?`                | `'start' \| 'center' \| 'end'`                | `'center'`      | Alignment                         |
| `container?`            | `HTMLElement \| null`                         | `document.body` | Portal container                  |
| `trapFocus?`            | `boolean`                                     | `false`         | Trap focus inside popover         |
| `onOpenAutoFocus?`      | `(event: Event) => void`                      | —               | Before auto-focus on open         |
| `onCloseAutoFocus?`     | `(event: Event) => void`                      | —               | Before auto-focus on close        |
| `onEscapeKeyDown?`      | `(event: KeyboardEvent) => void`              | —               | Called on Escape                  |
| `onPointerDownOutside?` | `(event: PointerEvent) => void`               | —               | Called on click outside           |
| `onFocusOutside?`       | `(event: FocusEvent) => void`                 | —               | Called on focus outside           |
| `onInteractOutside?`    | `(event: PointerEvent \| FocusEvent) => void` | —               | Called on any interaction outside |

## Close Props

Extends Button props.

**Render props:**

| Render Prop | Type         | Description             |
| ----------- | ------------ | ----------------------- |
| `isOpen`    | `boolean`    | Whether popover is open |
| `close`     | `() => void` | Close the popover       |

## Keyboard

| Key               | Action                                   |
| ----------------- | ---------------------------------------- |
| `Enter` / `Space` | Toggle popover                           |
| `Escape`          | Close popover                            |
| `Tab`             | Navigate within (trapped if `trapFocus`) |

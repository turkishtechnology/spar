# DropdownMenu API Reference

## Parts

| Part                     | Element    | Description                             |
| ------------------------ | ---------- | --------------------------------------- |
| `DropdownMenu.Root`      | —          | State container (no DOM element)        |
| `DropdownMenu.Trigger`   | `<button>` | Opens the menu                          |
| `DropdownMenu.Content`   | `<div>`    | Menu panel (portaled, role="menu")      |
| `DropdownMenu.Item`      | `<div>`    | Interactive menu item (role="menuitem") |
| `DropdownMenu.Separator` | `<div>`    | Visual separator                        |
| `DropdownMenu.Label`     | `<div>`    | Non-interactive label for a group       |
| `DropdownMenu.Group`     | `<div>`    | Groups related items                    |
| `DropdownMenu.Arrow`     | `<svg>`    | Pointing arrow element                  |

## Root Props

| Prop             | Type                      | Default | Description                    |
| ---------------- | ------------------------- | ------- | ------------------------------ |
| `id?`            | `string`                  | auto    | Base ID for ARIA relationships |
| `open?`          | `boolean`                 | —       | Controlled open state          |
| `defaultOpen?`   | `boolean`                 | `false` | Default open state             |
| `onOpenChange?`  | `(open: boolean) => void` | —       | Called when state changes      |
| `modal?`         | `boolean`                 | `true`  | Whether menu is modal          |
| `disabled?`      | `boolean`                 | `false` | Prevents opening               |
| `closeOnSelect?` | `boolean`                 | `true`  | Close menu when item selected  |

## Trigger Props

Extends Button props.

**Render props:**

| Render Prop                 | Type         | Description                 |
| --------------------------- | ------------ | --------------------------- |
| `isOpen`                    | `boolean`    | Whether menu is open        |
| `disabled`                  | `boolean`    | Whether trigger is disabled |
| `open` / `close` / `toggle` | `() => void` | State control               |

## Content Props

| Prop                    | Type                                     | Default         | Description              |
| ----------------------- | ---------------------------------------- | --------------- | ------------------------ |
| `side?`                 | `'top' \| 'right' \| 'bottom' \| 'left'` | `'bottom'`      | Preferred placement side |
| `align?`                | `'start' \| 'center' \| 'end'`           | `'start'`       | Alignment along the side |
| `container?`            | `HTMLElement \| null`                    | `document.body` | Portal container         |
| `onEscapeKeyDown?`      | `(event: KeyboardEvent) => void`         | —               | Called on Escape         |
| `onPointerDownOutside?` | `(event: PointerEvent) => void`          | —               | Called on click outside  |
| `onFocusOutside?`       | `(event: FocusEvent) => void`            | —               | Called on focus outside  |

## Item Props

| Prop         | Type                              | Default | Description               |
| ------------ | --------------------------------- | ------- | ------------------------- |
| `disabled?`  | `boolean`                         | `false` | Disables this item        |
| `onSelect?`  | `(event: SyntheticEvent) => void` | —       | Called when item selected |
| `textValue?` | `string`                          | —       | Text for typeahead search |

## Keyboard

| Key               | Action                     |
| ----------------- | -------------------------- |
| `Enter` / `Space` | Open menu / select item    |
| `Arrow Down`      | Open menu / next item      |
| `Arrow Up`        | Previous item              |
| `Home`            | First item                 |
| `End`             | Last item                  |
| `Escape`          | Close menu                 |
| Type characters   | Typeahead to matching item |

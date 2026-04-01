# Dialog API Reference

## Parts

| Part                 | Element    | Description                            |
| -------------------- | ---------- | -------------------------------------- |
| `Dialog.Root`        | —          | State container (no DOM element)       |
| `Dialog.Trigger`     | `<button>` | Opens the dialog                       |
| `Dialog.Overlay`     | `<div>`    | Backdrop behind the dialog (portaled)  |
| `Dialog.Content`     | `<div>`    | Dialog panel (portaled, role="dialog") |
| `Dialog.Title`       | `<h2>`     | Dialog heading (required for a11y)     |
| `Dialog.Description` | `<p>`      | Supplementary description              |
| `Dialog.Close`       | `<button>` | Closes the dialog                      |

## Root Props

| Prop            | Type                      | Default | Description                    |
| --------------- | ------------------------- | ------- | ------------------------------ |
| `id?`           | `string`                  | auto    | Base ID for ARIA relationships |
| `open?`         | `boolean`                 | —       | Controlled open state          |
| `onOpenChange?` | `(open: boolean) => void` | —       | Called when state changes      |
| `defaultOpen?`  | `boolean`                 | `false` | Default open state             |
| `modal?`        | `boolean`                 | `true`  | Whether dialog is modal        |
| `disabled?`     | `boolean`                 | `false` | Prevents opening               |
| `forceMount?`   | `boolean`                 | `false` | Keep in DOM when closed        |

## Trigger Props

Extends Button props.

**Render props:**

| Render Prop | Type         | Description                 |
| ----------- | ------------ | --------------------------- |
| `isOpen`    | `boolean`    | Whether dialog is open      |
| `disabled`  | `boolean`    | Whether trigger is disabled |
| `open`      | `() => void` | Open the dialog             |
| `close`     | `() => void` | Close the dialog            |
| `toggle`    | `() => void` | Toggle state                |

## Overlay Props

| Prop         | Type                  | Default         | Description      |
| ------------ | --------------------- | --------------- | ---------------- |
| `container?` | `HTMLElement \| null` | `document.body` | Portal container |

## Content Props

| Prop                    | Type                                 | Default         | Description                               |
| ----------------------- | ------------------------------------ | --------------- | ----------------------------------------- |
| `role?`                 | `AriaRole`                           | `'dialog'`      | ARIA role (`'dialog'` or `'alertdialog'`) |
| `container?`            | `HTMLElement \| null`                | `document.body` | Portal container                          |
| `trapFocus?`            | `boolean`                            | `true`          | Trap focus inside dialog                  |
| `restoreFocus?`         | `boolean`                            | `true`          | Restore focus on close                    |
| `initialFocus?`         | `HTMLElement \| (() => HTMLElement)` | —               | Element to focus on open                  |
| `finalFocus?`           | `HTMLElement \| (() => HTMLElement)` | —               | Element to focus on close                 |
| `onOpenAutoFocus?`      | `(event: Event) => void`             | —               | Called before auto-focus on open          |
| `onCloseAutoFocus?`     | `(event: Event) => void`             | —               | Called before auto-focus on close         |
| `onEscapeKeyDown?`      | `(event: KeyboardEvent) => void`     | —               | Called on Escape press                    |
| `onPointerDownOutside?` | `(event: PointerEvent) => void`      | —               | Called on click outside                   |
| `onInteractOutside?`    | `(event: PointerEvent) => void`      | —               | Called on any interaction outside         |

## Title Props

| Prop     | Type     | Default | Description         |
| -------- | -------- | ------- | ------------------- |
| `level?` | `number` | `2`     | Heading level (1-6) |

## Close Props

Extends Button props.

**Render props:**

| Render Prop | Type         | Description            |
| ----------- | ------------ | ---------------------- |
| `isOpen`    | `boolean`    | Whether dialog is open |
| `close`     | `() => void` | Close the dialog       |

## Keyboard

| Key         | Action                              |
| ----------- | ----------------------------------- |
| `Escape`    | Close dialog                        |
| `Tab`       | Cycle focus within dialog (trapped) |
| `Shift+Tab` | Cycle focus backwards               |

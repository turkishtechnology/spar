# Collapsible API Reference

## Parts

| Part                  | Element    | Description                         |
| --------------------- | ---------- | ----------------------------------- |
| `Collapsible.Root`    | `<div>`    | Container managing open/close state |
| `Collapsible.Trigger` | `<button>` | Button that toggles content         |
| `Collapsible.Content` | `<div>`    | Collapsible content area            |

## Root Props

| Prop            | Type                      | Default | Description                    |
| --------------- | ------------------------- | ------- | ------------------------------ |
| `id?`           | `string`                  | auto    | Base ID for ARIA relationships |
| `triggerId?`    | `string`                  | auto    | Custom trigger ID              |
| `contentId?`    | `string`                  | auto    | Custom content ID              |
| `open?`         | `boolean`                 | —       | Controlled open state          |
| `defaultOpen?`  | `boolean`                 | `false` | Default open state             |
| `onOpenChange?` | `(open: boolean) => void` | —       | Called when state changes      |
| `disabled?`     | `boolean`                 | `false` | Disables the collapsible       |

## Trigger Props

Extends Button props.

**Render props:**

```tsx
<Collapsible.Trigger>
  {({ isOpen, disabled, open, close, toggle }) => <span>{isOpen ? 'Hide' : 'Show'} details</span>}
</Collapsible.Trigger>
```

| Render Prop | Type         | Description                |
| ----------- | ------------ | -------------------------- |
| `isOpen`    | `boolean`    | Whether content is visible |
| `disabled`  | `boolean`    | Whether disabled           |
| `open`      | `() => void` | Open the content           |
| `close`     | `() => void` | Close the content          |
| `toggle`    | `() => void` | Toggle open/close          |

## Content Props

| Prop             | Type                     | Default | Description                       |
| ---------------- | ------------------------ | ------- | --------------------------------- |
| `forceMount?`    | `boolean`                | `false` | Keep in DOM when closed           |
| `onBeforeMatch?` | `(event: Event) => void` | —       | Before browser find-in-page match |

## Keyboard

| Key               | Action         |
| ----------------- | -------------- |
| `Enter` / `Space` | Toggle content |

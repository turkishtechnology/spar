# Tabs API Reference

## Parts

| Part           | Element    | Description                  |
| -------------- | ---------- | ---------------------------- |
| `Tabs.Root`    | `<div>`    | Container managing tab state |
| `Tabs.List`    | `<div>`    | Tab strip (role="tablist")   |
| `Tabs.Trigger` | `<button>` | Tab button (role="tab")      |
| `Tabs.Content` | `<div>`    | Tab panel (role="tabpanel")  |

## Root Props

| Prop              | Type                         | Default        | Description                           |
| ----------------- | ---------------------------- | -------------- | ------------------------------------- |
| `id?`             | `string`                     | auto           | Base ID for ARIA relationships        |
| `value?`          | `string`                     | —              | Controlled active tab                 |
| `defaultValue?`   | `string`                     | —              | Default active tab                    |
| `onValueChange?`  | `(value: string) => void`    | —              | Called when active tab changes        |
| `orientation?`    | `'horizontal' \| 'vertical'` | `'horizontal'` | Affects arrow key direction           |
| `activationMode?` | `'automatic' \| 'manual'`    | `'automatic'`  | Whether focus alone activates the tab |

## Trigger Props

| Prop    | Type     | Default      | Description             |
| ------- | -------- | ------------ | ----------------------- |
| `value` | `string` | **required** | Tab's unique identifier |

Extends Button props.

**Render props:**

```tsx
<Tabs.Trigger value='tab1'>
  {({ isSelected, disabled, isFocused, orientation, select }) => (
    <span className={isSelected ? 'active' : ''}>Tab 1</span>
  )}
</Tabs.Trigger>
```

| Render Prop   | Type          | Description                |
| ------------- | ------------- | -------------------------- |
| `isSelected`  | `boolean`     | Whether this tab is active |
| `select`      | `() => void`  | Activate this tab          |
| `disabled`    | `boolean`     | Whether disabled           |
| `isFocused`   | `boolean`     | Whether focused            |
| `orientation` | `Orientation` | Current orientation        |

## Content Props

| Prop          | Type      | Default      | Description               |
| ------------- | --------- | ------------ | ------------------------- |
| `value`       | `string`  | **required** | Matches trigger's value   |
| `forceMount?` | `boolean` | `false`      | Keep in DOM when inactive |

## Keyboard

| Key           | Action (horizontal) | Action (vertical) |
| ------------- | ------------------- | ----------------- |
| `Arrow Right` | Next tab            | —                 |
| `Arrow Left`  | Previous tab        | —                 |
| `Arrow Down`  | —                   | Next tab          |
| `Arrow Up`    | —                   | Previous tab      |
| `Home`        | First tab           | First tab         |
| `End`         | Last tab            | Last tab          |
| `Tab`         | Move to content     | Move to content   |

Uses roving tabindex — only the active tab is in the tab order.

**Activation modes:**

- `automatic` (default): Tab activates on focus (arrow key)
- `manual`: Tab activates on Enter/Space after focusing

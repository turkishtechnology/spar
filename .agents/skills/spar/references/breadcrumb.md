# Breadcrumb API Reference

## Parts

| Part                   | Element  | Description                                           |
| ---------------------- | -------- | ----------------------------------------------------- |
| `Breadcrumb.Root`      | `<nav>`  | Navigation container with `aria-label="Breadcrumb"`   |
| `Breadcrumb.List`      | `<ol>`   | Ordered list of breadcrumb items                      |
| `Breadcrumb.Item`      | `<li>`   | Individual breadcrumb entry                           |
| `Breadcrumb.Link`      | `<a>`    | Navigable link                                        |
| `Breadcrumb.Page`      | `<span>` | Current page (non-interactive, `aria-current="page"`) |
| `Breadcrumb.Separator` | `<li>`   | Visual separator between items                        |

## Root Props

| Prop          | Type                                        | Default | Description               |
| ------------- | ------------------------------------------- | ------- | ------------------------- |
| `onNavigate?` | `(href: string, event: PressEvent) => void` | —       | Custom navigation handler |
| `disabled?`   | `boolean`                                   | `false` | Disables all links        |

## Item Props

| Prop         | Type                            | Default | Description                  |
| ------------ | ------------------------------- | ------- | ---------------------------- |
| `position?`  | `'first' \| 'middle' \| 'last'` | —       | Position in breadcrumb trail |
| `isCurrent?` | `boolean`                       | —       | Marks as current page        |

**Render props:**

```tsx
<Breadcrumb.Item>
  {({ position, isCurrent, isDisabled }) => (
    <span>{isCurrent ? <strong>Here</strong> : 'Link'}</span>
  )}
</Breadcrumb.Item>
```

## Link Props

| Prop          | Type                          | Default | Description        |
| ------------- | ----------------------------- | ------- | ------------------ |
| `href?`       | `string`                      | —       | Destination URL    |
| `disabled?`   | `boolean`                     | `false` | Disables this link |
| `isExternal?` | `boolean`                     | `false` | Opens in new tab   |
| `onPress?`    | `(event: PressEvent) => void` | —       | Press handler      |

## Keyboard

| Key     | Action             |
| ------- | ------------------ |
| `Enter` | Navigate to link   |
| `Tab`   | Move between links |
